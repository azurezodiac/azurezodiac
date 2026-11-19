<?php
/**
 * Redeemysoul cPanel MySQL API (PHP 7.4+ compatible)
 * Upload as public_html/rs-api.php with config.php beside it.
 */
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

if (!function_exists('str_starts_with')) {
  function str_starts_with($haystack, $needle) {
    return $needle === '' || strpos((string)$haystack, (string)$needle) === 0;
  }
}
if (!function_exists('str_contains')) {
  function str_contains($haystack, $needle) {
    return $needle === '' || strpos((string)$haystack, (string)$needle) !== false;
  }
}

function json_out(array $payload, $status = 200)
{
  http_response_code((int)$status);
  if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
  }
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

set_exception_handler(function ($e) {
  json_out([
    'error' => 'Server error.',
    'detail' => $e->getMessage(),
  ], 500);
});

set_error_handler(function ($severity, $message, $file, $line) {
  throw new ErrorException($message, 0, $severity, $file, $line);
});

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const OPEN_STATUSES = ['pending', 'in_review', 'active', 'diagnosis_completed'];
const STATUS_LABELS = [
  'pending' => 'Pending',
  'in_review' => 'In review',
  'active' => 'Active / in progress',
  'diagnosis_completed' => 'Diagnosis completed',
  'resolved' => 'Resolved',
  'cleared' => 'Cleared — new request allowed',
];
const STATUS_NOTES_DEFAULT = [
  'diagnosis_completed' =>
    'Initial spiritual diagnosis is completed. Further guidance, if needed, will be shared privately. Shifa is from Allah alone; no guarantee of healing.',
];
const COOKIE = 'rs_admin_session';

$configCandidates = array(
  __DIR__ . '/config.php',
  __DIR__ . '/api/config.php',
  dirname(__DIR__) . '/config.php',
  dirname(__DIR__) . '/api/config.php',
);
$configPath = '';
foreach ($configCandidates as $candidate) {
  if (is_file($candidate)) {
    $configPath = $candidate;
    break;
  }
}
if ($configPath === '') {
  json_out([
    'error' => 'API config missing. Place config.php next to rs-api.php or in api/ with MySQL + admin_password.',
  ], 503);
}

try {
/** @var array $config */
$config = require $configPath;

if (!is_array($config)) {
  json_out(['error' => 'config.php must return an array.'], 500);
}
foreach (array('db_host','db_name','db_user','db_pass','admin_password') as $key) {
  if (!isset($config[$key]) || $config[$key] === '') {
    json_out(array('error' => 'config.php missing ' . $key . '.'), 500);
  }
}
if (empty($config['admin_session_secret'])) {
  $config['admin_session_secret'] = $config['admin_password'];
}

  $pdo = new PDO(
    sprintf(
      'mysql:host=%s;dbname=%s;charset=utf8mb4',
      $config['db_host'],
      $config['db_name']
    ),
    $config['db_user'],
    $config['db_pass'],
    array(
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    )
  );
  ensure_schema($pdo);
  maybe_seed_cms($pdo);
  $method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
  $path = api_path();
  route($pdo, $config, $method, $path);
} catch (Throwable $e) {
  json_out(array(
    'error' => 'Server error.',
    'detail' => $e->getMessage(),
  ), 500);
}

function api_path(): string
{
  if (!empty($_GET['__path'])) {
    return trim((string) $_GET['__path'], '/');
  }
  $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
  // Strip /api prefix whether rewritten or direct
  if (preg_match('#/api(?:/index\.php)?(?:/(.*))?$#', $uri, $m)) {
    return trim($m[1] ?? '', '/');
  }
  $scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
  if ($scriptDir && str_starts_with($uri, $scriptDir)) {
    return trim(substr($uri, strlen($scriptDir)), '/');
  }
  return trim($uri, '/');
}

/**
 * @param array{db_host:string,db_name:string,db_user:string,db_pass:string,admin_password:string,admin_session_secret:string} $config
 */
function route(PDO $pdo, array $config, string $method, string $path): void
{
  if ($path === 'requests' && $method === 'POST') {
    handle_create_request($pdo);
    return;
  }

  if (preg_match('#^track/(.+)$#', $path, $m) && $method === 'GET') {
    handle_track($pdo, rawurldecode($m[1]));
    return;
  }

  if ($path === 'cms/public' && $method === 'GET') {
    handle_cms_public($pdo);
    return;
  }

  if ($path === 'admin/login' && $method === 'POST') {
    handle_admin_login($config);
    return;
  }

  if ($path === 'admin/logout' && $method === 'POST') {
    clear_admin_cookie();
    json_out(['ok' => true]);
    return;
  }

  if ($path === 'admin/requests') {
    require_admin($config);
    if ($method === 'GET') {
      $rows = $pdo->query('SELECT * FROM consultation_requests ORDER BY created_at DESC')->fetchAll();
      json_out(['requests' => array_map('map_request', $rows)]);
      return;
    }
    if ($method === 'POST' || $method === 'PATCH') {
      handle_admin_patch_request($pdo);
      return;
    }
  }

  if ($path === 'admin/cms') {
    require_admin($config);
    if ($method === 'GET') {
      json_out(['cms' => load_cms($pdo)]);
      return;
    }
    if ($method === 'POST') {
      handle_admin_cms($pdo);
      return;
    }
  }

  json_out(['error' => 'Not found.', 'path' => $path], 404);
}

function handle_create_request(PDO $pdo): void
{
  $body = read_json();
  $concernId = trim((string) ($body['concernId'] ?? ''));
  $name = trim((string) ($body['name'] ?? ''));
  $motherName = trim((string) ($body['motherName'] ?? ''));
  $location = trim((string) ($body['location'] ?? ''));
  $phone = normalize_phone((string) ($body['phone'] ?? ''));
  $note = trim((string) ($body['note'] ?? ''));
  $hadiyaTxnLast5 = preg_replace('/\D+/', '', (string) ($body['hadiyaTxnLast5'] ?? '')) ?? '';
  $region = ($body['hadiyaRegion'] ?? '') === 'international' ? 'International' : 'Pakistan';

  if ($concernId === '') {
    json_out(['error' => 'Please choose a valid concern.'], 400);
  }
  if (strlen($name) < 2 || strlen($motherName) < 2 || strlen($location) < 2) {
    json_out(['error' => "Name, mother's name, and location are required."], 400);
  }
  if (strlen($phone) < 10) {
    json_out(['error' => 'Please enter a valid WhatsApp / mobile number.'], 400);
  }
  if (strlen($hadiyaTxnLast5) !== 5) {
    json_out([
      'error' => 'Please enter the last 5 digits of your Hadiya transaction for spiritual diagnosis.',
    ], 400);
  }
  if (!str_contains($note, $hadiyaTxnLast5)) {
    $note = $note !== ''
      ? $note . "\n\nHadiya ({$region}) txn last 5: {$hadiyaTxnLast5}"
      : "Hadiya ({$region}) txn last 5: {$hadiyaTxnLast5}";
  }

  $existing = find_open_by_phone($pdo, $phone);
  if ($existing) {
    json_out([
      'error' => 'duplicate',
      'message' => 'A request is already pending for this number. Please wait until the admin clears it, or track your existing request.',
      'request' => [
        'trackingNumber' => $existing['trackingNumber'],
        'status' => $existing['status'],
        'statusNote' => $existing['statusNote'],
        'createdAt' => $existing['createdAt'],
      ],
    ], 409);
  }

  $now = gmdate('Y-m-d\TH:i:s.000\Z');
  $request = [
    'id' => bin2hex(random_bytes(8)),
    'trackingNumber' => 'RS-' . gmdate('Y') . '-' . strtoupper(bin2hex(random_bytes(3))),
    'concernId' => $concernId,
    'concernTitle' => trim((string) ($body['concernTitle'] ?? $concernId)),
    'name' => $name,
    'motherName' => $motherName,
    'location' => $location,
    'phone' => $phone,
    'note' => $note,
    'status' => 'pending',
    'statusNote' => 'Your request is received and waiting for review.',
    'createdAt' => $now,
    'updatedAt' => $now,
    'clearedAt' => null,
  ];

  if (empty($body['concernTitle'])) {
    $titles = [
      'evil-eye' => 'Nazar & hasad',
      'black-magic' => 'Sihr & dark disturbance',
      'healing' => 'Islamic healing',
      'cleansing' => 'Spiritual cleansing',
      'home-cleansing' => 'Home cleansing',
      'rizq' => 'Business & rizq blockage',
      'family' => 'Family & children care',
      'renewal' => 'Spiritual renewal',
      'other' => 'Something else',
    ];
    $request['concernTitle'] = $titles[$concernId] ?? $concernId;
  }

  $stmt = $pdo->prepare(
    'INSERT INTO consultation_requests
      (id, tracking_number, concern_id, concern_title, name, mother_name, location, phone, note, status, status_note, created_at, updated_at, cleared_at)
     VALUES
      (:id, :tracking_number, :concern_id, :concern_title, :name, :mother_name, :location, :phone, :note, :status, :status_note, :created_at, :updated_at, NULL)'
  );
  $stmt->execute([
    ':id' => $request['id'],
    ':tracking_number' => $request['trackingNumber'],
    ':concern_id' => $request['concernId'],
    ':concern_title' => $request['concernTitle'],
    ':name' => $request['name'],
    ':mother_name' => $request['motherName'],
    ':location' => $request['location'],
    ':phone' => $request['phone'],
    ':note' => $request['note'],
    ':status' => $request['status'],
    ':status_note' => $request['statusNote'],
    ':created_at' => iso_to_sql($request['createdAt']),
    ':updated_at' => iso_to_sql($request['updatedAt']),
  ]);

  json_out(['request' => $request], 201);
}

function handle_track(PDO $pdo, string $trackingNumber): void
{
  $found = get_by_tracking($pdo, $trackingNumber);
  if (!$found) {
    json_out(['error' => 'No request found for this tracking number.'], 404);
  }
  json_out([
    'request' => [
      'trackingNumber' => $found['trackingNumber'],
      'concernTitle' => $found['concernTitle'],
      'name' => $found['name'],
      'location' => $found['location'],
      'status' => $found['status'],
      'statusLabel' => STATUS_LABELS[$found['status']] ?? $found['status'],
      'statusNote' => $found['statusNote'],
      'createdAt' => $found['createdAt'],
      'updatedAt' => $found['updatedAt'],
    ],
  ]);
}

function handle_cms_public(PDO $pdo): void
{
  $cms = load_cms($pdo);
  header('Cache-Control: public, s-maxage=60, stale-while-revalidate=300');
  json_out([
    'cms' => [
      'posts' => array_values(array_filter($cms['posts'], function ($p) { return !empty($p['published']); })),
      'features' => array_values(array_filter($cms['features'], function ($f) { return !empty($f['published']); })),
      'promotions' => array_values(array_filter($cms['promotions'], function ($p) { return !empty($p['active']); })),
      'pricing' => array_values(array_filter($cms['pricing'], function ($p) { return !empty($p['published']); })),
      'landing' => $cms['landing'],
    ],
  ]);
}

/**
 * @param array{admin_password:string,admin_session_secret:string} $config
 */
function handle_admin_login(array $config): void
{
  $body = read_json();
  $password = trim((string) ($body['password'] ?? ''));
  $expected = trim((string) $config['admin_password']);
  if ($password === '' || !hash_equals($expected, $password)) {
    json_out(['error' => 'Invalid password.'], 401);
  }
  $token = sign_token($config['admin_session_secret']);
  $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
  if (PHP_VERSION_ID >= 70300) {
    setcookie(COOKIE, $token, [
      'expires' => time() + 60 * 60 * 12,
      'path' => '/',
      'secure' => $secure,
      'httponly' => true,
      'samesite' => 'Lax',
    ]);
  } else {
    setcookie(COOKIE, $token, time() + 60 * 60 * 12, '/; samesite=Lax', '', $secure, true);
  }
  json_out(['ok' => true]);
}

function handle_admin_patch_request(PDO $pdo): void
{
  $body = read_json();
  $tracking = trim((string) ($body['trackingNumber'] ?? ''));
  if ($tracking === '') {
    json_out(['error' => 'trackingNumber is required.'], 400);
  }
  $current = get_by_tracking($pdo, $tracking);
  if (!$current) {
    json_out(['error' => 'Request not found.'], 404);
  }

  $nextStatus = isset($body['status']) ? (string) $body['status'] : $current['status'];
  $statusNote = array_key_exists('statusNote', $body)
    ? (string) $body['statusNote']
    : (
      $nextStatus !== $current['status'] && isset(STATUS_NOTES_DEFAULT[$nextStatus])
        ? STATUS_NOTES_DEFAULT[$nextStatus]
        : $current['statusNote']
    );
  $updatedAt = gmdate('Y-m-d\TH:i:s.000\Z');
  $clearedAt = $nextStatus === 'cleared' ? $updatedAt : $current['clearedAt'];

  $stmt = $pdo->prepare(
    'UPDATE consultation_requests
     SET status = ?, status_note = ?, updated_at = ?, cleared_at = ?
     WHERE UPPER(tracking_number) = ?'
  );
  $stmt->execute([
    $nextStatus,
    $statusNote,
    iso_to_sql($updatedAt),
    $clearedAt ? iso_to_sql($clearedAt) : null,
    strtoupper($tracking),
  ]);

  $updated = get_by_tracking($pdo, $tracking);
  json_out(['request' => $updated]);
}

function handle_admin_cms(PDO $pdo): void
{
  $body = read_json();
  $action = (string) ($body['action'] ?? '');
  $collection = (string) ($body['collection'] ?? '');
  $item = is_array($body['item'] ?? null) ? $body['item'] : [];
  $id = (string) ($body['id'] ?? '');

  if ($action === 'reset') {
    seed_cms($pdo, true);
    json_out(['cms' => load_cms($pdo)]);
  }

  if ($action === 'updateLanding') {
    $current = load_landing($pdo);
    $en = is_array($item['en'] ?? null) ? $item['en'] : [];
    $ur = is_array($item['ur'] ?? null) ? $item['ur'] : [];
    $next = [
      'en' => normalize_landing_locale(array_merge($current['en'], $en)),
      'ur' => normalize_landing_locale(array_merge($current['ur'], $ur)),
      'updatedAt' => gmdate('Y-m-d\TH:i:s.000\Z'),
    ];
    save_landing($pdo, $next);
    json_out(['cms' => load_cms($pdo)]);
  }

  $allowed = ['posts', 'features', 'promotions', 'pricing'];
  if (!in_array($collection, $allowed, true)) {
    json_out(['error' => 'Invalid collection.'], 400);
  }

  $now = gmdate('Y-m-d\TH:i:s.000\Z');

  if ($action === 'create') {
    if ($collection === 'posts') {
      $slug = slugify((string) ($item['slug'] ?? '')) ?: ('post-' . bin2hex(random_bytes(3)));
      $stmt = $pdo->prepare(
        'INSERT INTO cms_posts (id, slug, title, excerpt, body, published, published_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      );
      $stmt->execute([
        bin2hex(random_bytes(6)),
        $slug,
        trim((string) ($item['title'] ?? 'Untitled')),
        trim((string) ($item['excerpt'] ?? '')),
        (string) ($item['body'] ?? ''),
        !empty($item['published']) ? 1 : 0,
        (string) ($item['publishedAt'] ?? substr($now, 0, 10)),
        iso_to_sql($now),
      ]);
    } elseif ($collection === 'features') {
      $stmt = $pdo->prepare(
        'INSERT INTO cms_features (id, title, body, sort_order, published, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)'
      );
      $stmt->execute([
        bin2hex(random_bytes(6)),
        trim((string) ($item['title'] ?? 'Feature')),
        trim((string) ($item['body'] ?? '')),
        (int) ($item['order'] ?? 0),
        ($item['published'] ?? true) ? 1 : 0,
        iso_to_sql($now),
      ]);
    } elseif ($collection === 'promotions') {
      $stmt = $pdo->prepare(
        'INSERT INTO cms_promotions (id, title, body, cta_label, cta_href, active, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
      );
      $stmt->execute([
        bin2hex(random_bytes(6)),
        trim((string) ($item['title'] ?? 'Promotion')),
        trim((string) ($item['body'] ?? '')),
        trim((string) ($item['ctaLabel'] ?? 'Begin')),
        trim((string) ($item['ctaHref'] ?? '/begin')),
        ($item['active'] ?? true) ? 1 : 0,
        iso_to_sql($now),
      ]);
    } else {
      $stmt = $pdo->prepare(
        'INSERT INTO cms_pricing (id, label, amount, method, note, sort_order, published, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      );
      $stmt->execute([
        bin2hex(random_bytes(6)),
        trim((string) ($item['label'] ?? 'Plan')),
        trim((string) ($item['amount'] ?? '')),
        trim((string) ($item['method'] ?? '')),
        trim((string) ($item['note'] ?? '')),
        (int) ($item['order'] ?? 0),
        ($item['published'] ?? true) ? 1 : 0,
        iso_to_sql($now),
      ]);
    }
    json_out(['cms' => load_cms($pdo)]);
  }

  if ($action === 'update') {
    if ($id === '') {
      json_out(['error' => 'id required.'], 400);
    }
    $ok = update_cms_item($pdo, $collection, $id, $item, $now);
    if (!$ok) {
      json_out(['error' => 'Not found.'], 404);
    }
    json_out(['cms' => load_cms($pdo)]);
  }

  if ($action === 'delete') {
    if ($id === '') {
      json_out(['error' => 'id required.'], 400);
    }
    $table = cms_table($collection);
    $stmt = $pdo->prepare("DELETE FROM {$table} WHERE id = ?");
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
      json_out(['error' => 'Not found.'], 404);
    }
    json_out(['cms' => load_cms($pdo)]);
  }

  json_out(['error' => 'Unknown action.'], 400);
}

function update_cms_item(PDO $pdo, string $collection, string $id, array $item, string $now): bool
{
  if ($collection === 'posts') {
    $stmt = $pdo->prepare('SELECT * FROM cms_posts WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
      return false;
    }
    $slug = array_key_exists('slug', $item) ? slugify((string) $item['slug']) : $row['slug'];
    $upd = $pdo->prepare(
      'UPDATE cms_posts SET slug=?, title=?, excerpt=?, body=?, published=?, published_at=?, updated_at=? WHERE id=?'
    );
    $upd->execute([
      $slug,
      array_key_exists('title', $item) ? trim((string) $item['title']) : $row['title'],
      array_key_exists('excerpt', $item) ? trim((string) $item['excerpt']) : $row['excerpt'],
      array_key_exists('body', $item) ? (string) $item['body'] : $row['body'],
      array_key_exists('published', $item) ? (!empty($item['published']) ? 1 : 0) : (int) $row['published'],
      array_key_exists('publishedAt', $item) ? (string) $item['publishedAt'] : $row['published_at'],
      iso_to_sql($now),
      $id,
    ]);
    return true;
  }

  if ($collection === 'features') {
    $stmt = $pdo->prepare('SELECT * FROM cms_features WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
      return false;
    }
    $upd = $pdo->prepare(
      'UPDATE cms_features SET title=?, body=?, sort_order=?, published=?, updated_at=? WHERE id=?'
    );
    $upd->execute([
      array_key_exists('title', $item) ? trim((string) $item['title']) : $row['title'],
      array_key_exists('body', $item) ? trim((string) $item['body']) : $row['body'],
      array_key_exists('order', $item) ? (int) $item['order'] : (int) $row['sort_order'],
      array_key_exists('published', $item) ? (!empty($item['published']) ? 1 : 0) : (int) $row['published'],
      iso_to_sql($now),
      $id,
    ]);
    return true;
  }

  if ($collection === 'promotions') {
    $stmt = $pdo->prepare('SELECT * FROM cms_promotions WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
      return false;
    }
    $upd = $pdo->prepare(
      'UPDATE cms_promotions SET title=?, body=?, cta_label=?, cta_href=?, active=?, updated_at=? WHERE id=?'
    );
    $upd->execute([
      array_key_exists('title', $item) ? trim((string) $item['title']) : $row['title'],
      array_key_exists('body', $item) ? trim((string) $item['body']) : $row['body'],
      array_key_exists('ctaLabel', $item) ? trim((string) $item['ctaLabel']) : $row['cta_label'],
      array_key_exists('ctaHref', $item) ? trim((string) $item['ctaHref']) : $row['cta_href'],
      array_key_exists('active', $item) ? (!empty($item['active']) ? 1 : 0) : (int) $row['active'],
      iso_to_sql($now),
      $id,
    ]);
    return true;
  }

  $stmt = $pdo->prepare('SELECT * FROM cms_pricing WHERE id = ?');
  $stmt->execute([$id]);
  $row = $stmt->fetch();
  if (!$row) {
    return false;
  }
  $upd = $pdo->prepare(
    'UPDATE cms_pricing SET label=?, amount=?, method=?, note=?, sort_order=?, published=?, updated_at=? WHERE id=?'
  );
  $upd->execute([
    array_key_exists('label', $item) ? trim((string) $item['label']) : $row['label'],
    array_key_exists('amount', $item) ? trim((string) $item['amount']) : $row['amount'],
    array_key_exists('method', $item) ? trim((string) $item['method']) : $row['method'],
    array_key_exists('note', $item) ? trim((string) $item['note']) : $row['note'],
    array_key_exists('order', $item) ? (int) $item['order'] : (int) $row['sort_order'],
    array_key_exists('published', $item) ? (!empty($item['published']) ? 1 : 0) : (int) $row['published'],
    iso_to_sql($now),
    $id,
  ]);
  return true;
}

function cms_table(string $collection): string
{
  if ($collection === 'posts') {
    return 'cms_posts';
  }
  if ($collection === 'features') {
    return 'cms_features';
  }
  if ($collection === 'promotions') {
    return 'cms_promotions';
  }
  return 'cms_pricing';
}

/** @return array{posts:array,features:array,promotions:array,pricing:array} */
function empty_landing_locale(): array
{
  return [
    'brandLine' => '',
    'headline' => '',
    'support' => '',
    'ctaBegin' => '',
    'ctaServices' => '',
  ];
}

function normalize_landing_locale(array $value): array
{
  return [
    'brandLine' => trim((string) ($value['brandLine'] ?? '')),
    'headline' => trim((string) ($value['headline'] ?? '')),
    'support' => trim((string) ($value['support'] ?? '')),
    'ctaBegin' => trim((string) ($value['ctaBegin'] ?? '')),
    'ctaServices' => trim((string) ($value['ctaServices'] ?? '')),
  ];
}

function default_landing(string $updatedAt = ''): array
{
  return [
    'en' => [
      'brandLine' => 'Spiritual Healing Shazli · Karachi',
      'headline' => 'Islamic healing for a heart under pressure.',
      'support' => 'Ruqyah-centered guidance for nazar, sihr concerns, and spiritual heaviness — private, respectful, and rooted in remembrance.',
      'ctaBegin' => 'Begin healing',
      'ctaServices' => 'Explore services',
    ],
    'ur' => [
      'brandLine' => 'سپریچوئل ہیلنگ شاذلی · کراچی',
      'headline' => 'دباؤ میں دل کے لیے اسلامی شفا۔',
      'support' => 'نظر، سحر کی پریشانی اور روحانی بوجھ کے لیے رقیہ پر مبنی رہنمائی — نجی، ادب کے ساتھ، اور ذکر پر قائم۔',
      'ctaBegin' => 'شفا شروع کریں',
      'ctaServices' => 'خدمات دیکھیں',
    ],
    'updatedAt' => $updatedAt !== '' ? $updatedAt : gmdate('Y-m-d\TH:i:s.000\Z'),
  ];
}

function load_landing(PDO $pdo): array
{
  try {
    $stmt = $pdo->prepare('SELECT setting_value, updated_at FROM cms_settings WHERE setting_key = ?');
    $stmt->execute(['landing']);
    $row = $stmt->fetch();
    if (!$row) {
      return default_landing();
    }
    $decoded = json_decode((string) $row['setting_value'], true);
    if (!is_array($decoded)) {
      return default_landing(sql_to_iso($row['updated_at']));
    }
    return [
      'en' => normalize_landing_locale(is_array($decoded['en'] ?? null) ? $decoded['en'] : []),
      'ur' => normalize_landing_locale(is_array($decoded['ur'] ?? null) ? $decoded['ur'] : []),
      'updatedAt' => sql_to_iso($row['updated_at']),
    ];
  } catch (Throwable $e) {
    return default_landing();
  }
}

function save_landing(PDO $pdo, array $landing): void
{
  $payload = json_encode($landing, JSON_UNESCAPED_UNICODE);
  if ($payload === false) {
    $payload = '{}';
  }
  $stmt = $pdo->prepare(
    'INSERT INTO cms_settings (setting_key, setting_value, updated_at)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = VALUES(updated_at)'
  );
  $stmt->execute([
    'landing',
    $payload,
    iso_to_sql((string) ($landing['updatedAt'] ?? gmdate('Y-m-d\TH:i:s.000\Z'))),
  ]);
}

function load_cms(PDO $pdo): array
{
  $posts = $pdo->query('SELECT * FROM cms_posts ORDER BY published_at DESC')->fetchAll();
  $features = $pdo->query('SELECT * FROM cms_features ORDER BY sort_order ASC')->fetchAll();
  $promos = $pdo->query('SELECT * FROM cms_promotions ORDER BY updated_at DESC')->fetchAll();
  $pricing = $pdo->query('SELECT * FROM cms_pricing ORDER BY sort_order ASC')->fetchAll();

  return [
    'posts' => array_map(static function ($row) {
      return [
        'id' => $row['id'],
        'slug' => $row['slug'],
        'title' => $row['title'],
        'excerpt' => $row['excerpt'],
        'body' => $row['body'],
        'published' => (bool) $row['published'],
        'publishedAt' => $row['published_at'],
        'updatedAt' => sql_to_iso($row['updated_at']),
      ];
    }, $posts),
    'features' => array_map(static function ($row) {
      return [
        'id' => $row['id'],
        'title' => $row['title'],
        'body' => $row['body'],
        'order' => (int) $row['sort_order'],
        'published' => (bool) $row['published'],
        'updatedAt' => sql_to_iso($row['updated_at']),
      ];
    }, $features),
    'promotions' => array_map(static function ($row) {
      return [
        'id' => $row['id'],
        'title' => $row['title'],
        'body' => $row['body'],
        'ctaLabel' => $row['cta_label'],
        'ctaHref' => $row['cta_href'],
        'active' => (bool) $row['active'],
        'updatedAt' => sql_to_iso($row['updated_at']),
      ];
    }, $promos),
    'pricing' => array_map(static function ($row) {
      return [
        'id' => $row['id'],
        'label' => $row['label'],
        'amount' => $row['amount'],
        'method' => $row['method'],
        'note' => $row['note'],
        'order' => (int) $row['sort_order'],
        'published' => (bool) $row['published'],
        'updatedAt' => sql_to_iso($row['updated_at']),
      ];
    }, $pricing),
    'landing' => load_landing($pdo),
  ];
}

function maybe_seed_cms(PDO $pdo): void
{
  $count = (int) $pdo->query(
    'SELECT (
      (SELECT COUNT(*) FROM cms_posts) +
      (SELECT COUNT(*) FROM cms_features) +
      (SELECT COUNT(*) FROM cms_promotions) +
      (SELECT COUNT(*) FROM cms_pricing)
    ) AS c'
  )->fetchColumn();
  if ($count === 0) {
    seed_cms($pdo, false);
    return;
  }
  $landing = load_landing($pdo);
  if (($landing['en']['headline'] ?? '') === '' && ($landing['ur']['headline'] ?? '') === '') {
    save_landing($pdo, default_landing());
  }
}

function seed_cms(PDO $pdo, bool $wipe): void
{
  if ($wipe) {
    $pdo->exec('DELETE FROM cms_posts');
    $pdo->exec('DELETE FROM cms_features');
    $pdo->exec('DELETE FROM cms_promotions');
    $pdo->exec('DELETE FROM cms_pricing');
  }

  $now = gmdate('Y-m-d\TH:i:s.000\Z');
  $posts = [
    [
      'bandish-signs-islamic-view',
      'Bandish signs — an Islamic spiritual view',
      'Common signs people associate with bandish, and how a private Islamic consultation approaches them with care.',
      "## What people mean by bandish\n\nMany families use “bandish” for a stuck feeling in marriage, work, or home affairs. An Islamic review starts with du’a, Qur’an, and careful listening — not fear marketing.\n\n## When to seek guidance\n\nIf the home feels heavy, sleep is disturbed, or relationships stay blocked after ordinary efforts, a discreet diagnosis review can help clarify next steps. Shifa is from Allah alone.",
      '2026-03-01',
    ],
    [
      'nazar-vs-sihr',
      'Nazar vs sihr — knowing the difference',
      'How envy (nazar) and deliberate sihr are discussed differently in Islamic spiritual care.',
      "## Nazar\n\nNazar is often linked to envy without complex ritual. Protection includes Qur’an, salawat, and guarding the gaze of the heart.\n\n## Sihr\n\nSihr is treated as a serious claim needing careful spiritual diagnosis — never self-accusation or panic. Further guidance, if needed, is private.",
      '2026-03-08',
    ],
    [
      'home-feel-heavy',
      'When the home feels heavy',
      'Practical Islamic steps when a house feels restless, tense, or spiritually weighed down.',
      "## Atmosphere and worship\n\nKeep Qur’an audible, remove haram media where possible, and renew wudu before Maghrib and Fajr when anxiety peaks.\n\n## Private review\n\nIf heaviness continues, a Hadiya-based diagnosis review can map whether the concern looks more like stress, nazar, or something needing deeper ruqyah care.",
      '2026-03-15',
    ],
  ];

  $insPost = $pdo->prepare(
    'INSERT INTO cms_posts (id, slug, title, excerpt, body, published, published_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 1, ?, ?)'
  );
  foreach ($posts as $post) {
    $insPost->execute([
      bin2hex(random_bytes(6)),
      $post[0],
      $post[1],
      $post[2],
      $post[3],
      $post[4],
      iso_to_sql($now),
    ]);
  }

  $insFeature = $pdo->prepare(
    'INSERT INTO cms_features (id, title, body, sort_order, published, updated_at) VALUES (?, ?, ?, ?, 1, ?)'
  );
  $features = [
    [1, 'Private Islamic consultation', 'Online-first guidance with Spiritual Healing Shazli — discreet, ruqyah-centered, and respectful.'],
    [2, 'Hadiya for diagnosis review', 'Pakistan PKR 5,000 · International USD 50 for first spiritual diagnosis only.'],
    [3, 'Baldia office by appointment', 'Ittehad Town office visits after the first message — preferred day/time collected in Begin flow.'],
  ];
  foreach ($features as $feature) {
    $insFeature->execute([
      bin2hex(random_bytes(6)),
      $feature[1],
      $feature[2],
      $feature[0],
      iso_to_sql($now),
    ]);
  }

  $pdo->prepare(
    'INSERT INTO cms_promotions (id, title, body, cta_label, cta_href, active, updated_at)
     VALUES (?, ?, ?, ?, ?, 1, ?)'
  )->execute([
    bin2hex(random_bytes(6)),
    'Begin your private consultation',
    'Share your concern online. Hadiya covers the first spiritual diagnosis review only.',
    'Begin healing',
    '/begin',
    iso_to_sql($now),
  ]);

  $insPrice = $pdo->prepare(
    'INSERT INTO cms_pricing (id, label, amount, method, note, sort_order, published, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 1, ?)'
  );
  $insPrice->execute([
    bin2hex(random_bytes(6)),
    'Pakistan — diagnosis Hadiya',
    'PKR 5,000',
    'EasyPaisa 03452845400',
    'Initial spiritual diagnosis only. Not a medical fee.',
    1,
    iso_to_sql($now),
  ]);
  $insPrice->execute([
    bin2hex(random_bytes(6)),
    'International — diagnosis Hadiya',
    'USD 50',
    'Bank IBAN PK50TMFB0000000014429642',
    'For UK/UAE diaspora and overseas seekers. Diagnosis review only.',
    2,
    iso_to_sql($now),
  ]);

  save_landing($pdo, default_landing($now));
}

function ensure_schema(PDO $pdo): void
{
  static $done = false;
  if ($done) {
    return;
  }
  $schemaFile = __DIR__ . '/schema.sql';
  if (!is_file($schemaFile)) {
    $schemaFile = __DIR__ . '/api/schema.sql';
  }
  if (!is_file($schemaFile)) {
    return;
  }
  $sql = file_get_contents($schemaFile);
  if ($sql === false) {
    return;
  }
  foreach (preg_split('/;\s*\n/', $sql) as $statement) {
    $statement = trim($statement);
    if ($statement === '' || str_starts_with($statement, '--')) {
      continue;
    }
    $pdo->exec($statement);
  }
  $done = true;
}

function find_open_by_phone(PDO $pdo, string $phone): ?array
{
  $placeholders = implode(',', array_fill(0, count(OPEN_STATUSES), '?'));
  $stmt = $pdo->prepare(
    "SELECT * FROM consultation_requests
     WHERE phone = ? AND status IN ($placeholders)
     ORDER BY created_at DESC LIMIT 1"
  );
  $stmt->execute(array_merge([$phone], OPEN_STATUSES));
  $row = $stmt->fetch();
  return $row ? map_request($row) : null;
}

function get_by_tracking(PDO $pdo, string $trackingNumber): ?array
{
  $stmt = $pdo->prepare(
    'SELECT * FROM consultation_requests WHERE UPPER(tracking_number) = ? LIMIT 1'
  );
  $stmt->execute([strtoupper(trim($trackingNumber))]);
  $row = $stmt->fetch();
  return $row ? map_request($row) : null;
}

function map_request(array $row): array
{
  return [
    'id' => $row['id'],
    'trackingNumber' => $row['tracking_number'],
    'concernId' => $row['concern_id'],
    'concernTitle' => $row['concern_title'],
    'name' => $row['name'],
    'motherName' => $row['mother_name'],
    'location' => $row['location'],
    'phone' => $row['phone'],
    'note' => $row['note'] ?? '',
    'status' => $row['status'],
    'statusNote' => $row['status_note'] ?? '',
    'createdAt' => sql_to_iso($row['created_at']),
    'updatedAt' => sql_to_iso($row['updated_at']),
    'clearedAt' => !empty($row['cleared_at']) ? sql_to_iso($row['cleared_at']) : null,
  ];
}

function normalize_phone(string $phone): string
{
  return preg_replace('/\D+/', '', $phone) ?? '';
}

function slugify(string $value): string
{
  $value = strtolower(trim($value));
  $value = preg_replace('/[^a-z0-9-]+/', '-', $value) ?? '';
  return trim($value, '-');
}

function iso_to_sql(string $iso): string
{
  $dt = date_create($iso);
  return $dt ? $dt->format('Y-m-d H:i:s.v') : gmdate('Y-m-d H:i:s.000');
}

function sql_to_iso(string $sql): string
{
  $dt = date_create($sql);
  return $dt ? $dt->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d\TH:i:s.000\Z') : $sql;
}

function read_json(): array
{
  $raw = file_get_contents('php://input');
  if ($raw === false || $raw === '') {
    return [];
  }
  $decoded = json_decode($raw, true);
  return is_array($decoded) ? $decoded : [];
}

/**
 * @param array{admin_password:string,admin_session_secret:string} $config
 */
function require_admin(array $config): void
{
  $token = $_COOKIE[COOKIE] ?? '';
  $expected = sign_token($config['admin_session_secret']);
  if ($token === '' || !hash_equals($expected, $token)) {
    json_out(['error' => 'Unauthorized'], 401);
  }
}

function sign_token(string $secret): string
{
  return hash_hmac('sha256', 'admin-ok', $secret);
}

function clear_admin_cookie(): void
{
  if (PHP_VERSION_ID >= 70300) {
    setcookie(COOKIE, '', [
      'expires' => time() - 3600,
      'path' => '/',
      'httponly' => true,
      'samesite' => 'Lax',
    ]);
  } else {
    setcookie(COOKIE, '', time() - 3600, '/', '', false, true);
  }
}


<?php
/**
 * Copy to public_html/api/config.php (recommended) or public_html/config.php.
 * Admin login uses admin_password — not db_pass.
 * Never commit real passwords.
 */
return [
  'db_host' => 'localhost',
  'db_name' => 'your_cpanel_db_name',
  'db_user' => 'your_cpanel_db_user',
  'db_pass' => 'your_cpanel_db_password',
  'admin_password' => 'change-me-admin-password',
  'admin_session_secret' => 'change-me-long-random-secret',
];

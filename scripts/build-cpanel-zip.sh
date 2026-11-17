#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

API_BACKUP="/tmp/redeemysoul-api-backup-$$"
ARTIFACT_DIR="${ARTIFACT_DIR:-/tmp/cursor/artifacts}"
ZIP_PATH="${ARTIFACT_DIR}/redeemysoul-public_html.zip"

mkdir -p "$ARTIFACT_DIR"

# Keep public PHP copies in sync with cpanel-php source
cp cpanel-php/index.php public/rs-api.php
cp cpanel-php/index.php public/rs-api.php.txt
cp cpanel-php/config.sample.php public/config.sample.php
cp cpanel-php/config.sample.php public/config.sample.php.txt
cp cpanel-php/schema.sql public/schema.sql

if [[ -d src/app/api ]]; then
  rm -rf "$API_BACKUP"
  mv src/app/api "$API_BACKUP"
fi

cleanup() {
  if [[ -d "$API_BACKUP" ]]; then
    rm -rf src/app/api
    mv "$API_BACKUP" src/app/api
  fi
}
trap cleanup EXIT

export CPANEL_STATIC=1
pnpm build

# Apache/cPanel expects folder/index.html for pretty URLs.
for route in begin track admin topics pricing blog locations templates; do
  if [[ -f "out/${route}.html" ]]; then
    mkdir -p "out/${route}"
    cp "out/${route}.html" "out/${route}/index.html"
  fi
done

flatten_section() {
  local section="$1"
  if [[ -d "out/${section}" ]]; then
    shopt -s nullglob
    for html in "out/${section}"/*.html; do
      base="$(basename "$html" .html)"
      if [[ "$base" != "index" ]]; then
        mkdir -p "out/${section}/${base}"
        cp "$html" "out/${section}/${base}/index.html"
      fi
    done
    for html in "out/${section}"/*/ur.html; do
      dir="$(dirname "$html")"
      mkdir -p "${dir}/ur"
      cp "$html" "${dir}/ur/index.html"
    done
    shopt -u nullglob
  fi
}

flatten_section topics
flatten_section blog
flatten_section locations

if [[ -f public/.htaccess ]]; then
  cp public/.htaccess out/.htaccess
fi

# Also keep legacy api/ copies
rm -rf out/api
mkdir -p out/api
cp cpanel-php/index.php cpanel-php/schema.sql cpanel-php/.htaccess out/api/
cp cpanel-php/config.sample.php out/api/config.sample.php
cp cpanel-php/index.php out/api/index.php.txt
cp cpanel-php/config.sample.php out/api/config.sample.php.txt

# Standalone upload files (host often strips .php from zip extract)
cp public/rs-api.php.txt "$ARTIFACT_DIR/rs-api.php.txt"
cp public/config.sample.php.txt "$ARTIFACT_DIR/config.sample.php.txt"
cp public/schema.sql "$ARTIFACT_DIR/schema.sql"

rm -f "$ZIP_PATH"
(
  cd out
  zip -r "$ZIP_PATH" . \
    -x "CPANEL-UPLOAD.txt" \
    -x "__next*" \
    -x "*/__next*"
)

printf '%s\n' \
  "Redeemysoul cPanel — DO THIS (3 files)" \
  "" \
  "Your host may delete .php from zip extracts. Upload these TXT files instead:" \
  "" \
  "1) File Manager → public_html" \
  "2) Upload rs-api.php.txt → Rename to rs-api.php" \
  "3) Upload config.sample.php.txt → Rename to config.php" \
  "4) Edit config.php: db_name, db_user, db_pass, admin_password" \
  "5) Upload schema.sql (optional)" \
  "6) Open /admin and login with admin_password" \
  "" \
  "Test URL: https://redeemysoul.com/rs-api.php?__path=cms/public" \
  "(should return JSON, not 404)" \
  > /tmp/CPANEL-UPLOAD.txt
(
  cd out
  cp /tmp/CPANEL-UPLOAD.txt ./CPANEL-UPLOAD.txt
  zip -u "$ZIP_PATH" CPANEL-UPLOAD.txt
)

ls -lh "$ZIP_PATH"
ls -lh "$ARTIFACT_DIR/rs-api.php.txt" "$ARTIFACT_DIR/config.sample.php.txt" "$ARTIFACT_DIR/schema.sql"
echo "ZIP_READY=$ZIP_PATH"
echo "UPLOAD_THESE=rs-api.php.txt + config.sample.php.txt into public_html then rename"

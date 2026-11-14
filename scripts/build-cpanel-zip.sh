#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

API_BACKUP="/tmp/redeemysoul-api-backup-$$"
ARTIFACT_DIR="${ARTIFACT_DIR:-/tmp/cursor/artifacts}"
ZIP_PATH="${ARTIFACT_DIR}/redeemysoul-public_html.zip"

mkdir -p "$ARTIFACT_DIR"

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
for route in begin track admin topics pricing; do
  if [[ -f "out/${route}.html" ]]; then
    mkdir -p "out/${route}"
    cp "out/${route}.html" "out/${route}/index.html"
  fi
done

# Nested dynamic SEO topics: out/topics/<slug>.html -> out/topics/<slug>/index.html
if [[ -d out/topics ]]; then
  shopt -s nullglob
  for html in out/topics/*.html; do
    base="$(basename "$html" .html)"
    if [[ "$base" != "index" ]]; then
      mkdir -p "out/topics/${base}"
      cp "$html" "out/topics/${base}/index.html"
    fi
  done
  shopt -u nullglob
fi

# Ensure htaccess is present in the static export root.
if [[ -f public/.htaccess ]]; then
  cp public/.htaccess out/.htaccess
fi

rm -f "$ZIP_PATH"
(
  cd out
  zip -r "$ZIP_PATH" . \
    -x "CPANEL-UPLOAD.txt" \
    -x "__next*" \
    -x "*/__next*"
)

# Helpful upload + SEO note inside the zip root
printf '%s\n' \
  "Redeemysoul — cPanel upload" \
  "" \
  "1) cPanel -> File Manager -> public_html" \
  "2) Upload this zip" \
  "3) Extract / Unzip here" \
  "4) Make sure index.html, robots.txt, and sitemap.xml are inside public_html" \
  "" \
  "Works: homepage, begin form, WhatsApp/email notify, SEO files" \
  "Needs Node hosting later: full tracking API + admin portal" \
  "" \
  "SEO — do these in Google (important for search suggestions):" \
  "A) Google Search Console -> Add property redeemysoul.com -> verify -> Submit sitemap: https://redeemysoul.com/sitemap.xml" \
  "B) Google Business Profile (Spiritual Healing Shazli) -> Website = https://redeemysoul.com" \
  "C) Keep name/address/phone identical on GBP and the website footer" \
  "D) Ask happy clients for Google reviews on Spiritual Healing Shazli" \
  "E) Share the site from WhatsApp/Facebook with the homepage link regularly" \
  > /tmp/CPANEL-UPLOAD.txt
(
  cd out
  cp /tmp/CPANEL-UPLOAD.txt ./CPANEL-UPLOAD.txt
  zip -u "$ZIP_PATH" CPANEL-UPLOAD.txt
)

ls -lh "$ZIP_PATH"
echo "ZIP_READY=$ZIP_PATH"

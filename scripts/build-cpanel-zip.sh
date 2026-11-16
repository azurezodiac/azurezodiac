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
for route in begin track admin topics pricing blog locations templates; do
  if [[ -f "out/${route}.html" ]]; then
    mkdir -p "out/${route}"
    cp "out/${route}.html" "out/${route}/index.html"
  fi
done

# Nested dynamic routes: out/<section>/<slug>.html -> out/<section>/<slug>/index.html
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
    # Urdu topic pages: out/topics/<slug>/ur.html -> out/topics/<slug>/ur/index.html
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

# Ensure htaccess is present in the static export root.
if [[ -f public/.htaccess ]]; then
  cp public/.htaccess out/.htaccess
fi

# Ship PHP MySQL API for cPanel (leads + admin CMS + track)
rm -rf out/api
mkdir -p out/api
cp cpanel-php/index.php cpanel-php/schema.sql cpanel-php/.htaccess out/api/
cp cpanel-php/config.sample.php out/api/config.sample.php
# Do not ship real secrets; user copies sample -> config.php on server

rm -f "$ZIP_PATH"
(
  cd out
  zip -r "$ZIP_PATH" . \
    -x "CPANEL-UPLOAD.txt" \
    -x "__next*" \
    -x "*/__next*"
)

# Helpful upload + DNS cutover note inside the zip root
printf '%s\n' \
  "Redeemysoul — cPanel + MySQL (Option B)" \
  "" \
  "FILES" \
  "1) cPanel -> File Manager -> public_html" \
  "2) Upload redeemysoul-public_html.zip and Extract" \
  "3) Confirm public_html has: index.html, .htaccess, api/" \
  "4) Copy api/config.sample.php -> api/config.php and fill MySQL + admin_password" \
  "5) MySQL user must be Added to Database with ALL PRIVILEGES" \
  "" \
  "DNS (required — domain is currently on Vercel NS)" \
  "Right now redeemysoul.com uses ns1.vercel-dns.com / ns2.vercel-dns.com" \
  "Until DNS points to THIS cPanel server, config.php will not control the live site." \
  "" \
  "Pick ONE:" \
  "A) Registrar nameservers -> change to your hosting cPanel nameservers" \
  "   (from hosting welcome email, e.g. ns1.yourhost.com / ns2.yourhost.com)" \
  "B) Or in DNS panel set A record @ to your cPanel Shared IP" \
  "   (cPanel -> Server Information) and point www there too; remove Vercel A/ALIAS." \
  "" \
  "Wait for DNS (often 5-60 minutes). Live site headers must NOT say server: Vercel." \
  "Then open /admin and log in with config.php admin_password." \
  "" \
  "SEO sitemap: https://redeemysoul.com/sitemap.xml" \
  > /tmp/CPANEL-UPLOAD.txt
(
  cd out
  cp /tmp/CPANEL-UPLOAD.txt ./CPANEL-UPLOAD.txt
  zip -u "$ZIP_PATH" CPANEL-UPLOAD.txt
)

ls -lh "$ZIP_PATH"
echo "ZIP_READY=$ZIP_PATH"

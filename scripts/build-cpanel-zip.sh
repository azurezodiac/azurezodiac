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

rm -f "$ZIP_PATH"
(
  cd out
  zip -r "$ZIP_PATH" . \
    -x "*.txt" \
    -x "__next*" \
    -x "*/__next*"
)

# Helpful upload note inside the zip root
printf '%s\n' \
  "Redeemysoul — cPanel upload" \
  "" \
  "1) cPanel -> File Manager -> public_html" \
  "2) Upload this zip" \
  "3) Extract / Unzip here" \
  "4) Make sure index.html is directly inside public_html" \
  "" \
  "Works: homepage, begin form, WhatsApp/email notify" \
  "Needs Node hosting later: full tracking API + admin portal" \
  > /tmp/CPANEL-UPLOAD.txt
(
  cd out
  cp /tmp/CPANEL-UPLOAD.txt ./CPANEL-UPLOAD.txt
  zip -u "$ZIP_PATH" CPANEL-UPLOAD.txt
)

ls -lh "$ZIP_PATH"
echo "ZIP_READY=$ZIP_PATH"

#!/usr/bin/env node
/**
 * Upload asset buckets using the session JWT (no account API token required).
 * Usage: node upload-buckets.mjs <session.json>
 * session.json: { jwt, buckets, accountId, hashToPath, outDir }
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sessionPath = process.argv[2];
if (!sessionPath) {
  console.error("Usage: node upload-buckets.mjs <session.json>");
  process.exit(1);
}

const session = JSON.parse(fs.readFileSync(sessionPath, "utf8"));
const { jwt, buckets, accountId, hashToPath, outDir } = session;

if (!jwt) throw new Error("missing jwt");
if (!accountId) throw new Error("missing accountId");
if (!hashToPath) throw new Error("missing hashToPath");
if (!outDir) throw new Error("missing outDir");

const mime = {
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "application/javascript; charset=utf-8",
  mjs: "application/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  map: "application/json",
  webmanifest: "application/manifest+json",
};

function contentTypeFor(assetPath) {
  const ext = path.extname(assetPath).replace(/^\./, "").toLowerCase();
  return mime[ext] || "application/octet-stream";
}

let completionJwt = jwt;

if (!buckets || buckets.length === 0) {
  console.log(JSON.stringify({ ok: true, skipped: true, completionJwt }));
  process.exit(0);
}

for (let i = 0; i < buckets.length; i++) {
  const bucket = buckets[i];
  const form = new FormData();
  for (const hash of bucket) {
    const assetPath = hashToPath[hash];
    if (!assetPath) throw new Error(`Unknown hash ${hash}`);
    const full = path.join(outDir, assetPath.replace(/^\//, ""));
    const buf = fs.readFileSync(full);
    const b64 = buf.toString("base64");
    const blob = new Blob([b64], { type: contentTypeFor(assetPath) });
    form.append(hash, blob, hash);
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/assets/upload?base64=true`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`Upload bucket ${i + 1} non-JSON ${res.status}: ${text.slice(0, 400)}`);
  }
  if (!res.ok || !body.success) {
    throw new Error(
      `Upload bucket ${i + 1} failed ${res.status}: ${JSON.stringify(body.errors || body)}`,
    );
  }
  if (body.result?.jwt) completionJwt = body.result.jwt;
  console.error(`Uploaded bucket ${i + 1}/${buckets.length} (${bucket.length} files)`);
}

const out = { ok: true, completionJwt };
const dest = path.join(path.dirname(sessionPath), "completion.json");
fs.writeFileSync(dest, JSON.stringify(out));
console.log(JSON.stringify(out));

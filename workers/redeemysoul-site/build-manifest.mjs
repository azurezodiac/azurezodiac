#!/usr/bin/env node
/**
 * Build Cloudflare Workers static-assets manifest from out/.
 * Hash = first 32 hex of sha256(base64(content) + extensionWithoutDot)
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = process.env.ASSETS_DIRECTORY || path.join(ROOT, "out");
const DEST = process.env.MANIFEST_OUT || path.join(__dirname, ".manifest.json");
const HASHMAP = process.env.HASHMAP_OUT || path.join(__dirname, ".hashmap.json");

const SKIP = new Set([
  ".htaccess",
  "CPANEL-UPLOAD.txt",
  "schema.sql",
  "config.sample.php",
  "config.sample.php.txt",
]);

function shouldSkip(relPosix) {
  const base = path.posix.basename(relPosix);
  if (SKIP.has(base)) return true;
  if (base.endsWith(".php") || base.endsWith(".php.txt")) return true;
  return false;
}

function walk(dir, base = "") {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, rel));
    else if (entry.isFile()) out.push(rel);
  }
  return out;
}

const manifest = {};
const hashToPath = {};

for (const rel of walk(OUT)) {
  const relPosix = rel.split(path.sep).join("/");
  if (shouldSkip(relPosix)) continue;
  const full = path.join(OUT, rel);
  const buf = fs.readFileSync(full);
  const ext = path.extname(relPosix).replace(/^\./, "");
  const hash = crypto
    .createHash("sha256")
    .update(buf.toString("base64") + ext)
    .digest("hex")
    .slice(0, 32);
  const key = `/${relPosix}`;
  manifest[key] = { hash, size: buf.length };
  hashToPath[hash] = key;
}

fs.writeFileSync(DEST, JSON.stringify(manifest));
fs.writeFileSync(HASHMAP, JSON.stringify({ outDir: OUT, hashToPath, manifest }));
console.log(
  JSON.stringify({
    files: Object.keys(manifest).length,
    bytes: Object.values(manifest).reduce((a, b) => a + b.size, 0),
    dest: DEST,
  }),
);

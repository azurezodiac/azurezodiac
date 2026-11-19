/**
 * Resolve API base for browser fetches.
 *
 * - Local / Node hosting: Next.js route handlers under `/api/...`
 * - cPanel static export: PHP front controller `/rs-api.php?__path=...`
 *
 * Set `NEXT_PUBLIC_USE_PHP_API=1` when building the cPanel zip.
 */
export function apiUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  const usePhp =
    process.env.NEXT_PUBLIC_USE_PHP_API === "1" ||
    process.env.NEXT_PUBLIC_USE_PHP_API === "true";

  if (usePhp) {
    return `/rs-api.php?__path=${encodeURIComponent(clean)}`;
  }

  return `/api/${clean}`;
}

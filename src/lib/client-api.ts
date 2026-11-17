/**
 * cPanel static hosting: call the single PHP front controller.
 * (Many hosts strip .php files out of zip extracts under /api/.)
 */
export function apiUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  return `/rs-api.php?__path=${encodeURIComponent(clean)}`;
}

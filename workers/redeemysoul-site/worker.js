/**
 * Edge front:
 * - Serves Workers static assets when present (open admin UI + /_next deps)
 * - Proxies /rs-api.php and /api/* to origin cPanel PHP
 * - Injects rs_admin_session for admin API paths so gated origin PHP still returns data
 * - Falls through everything else to origin (keeps live pages + api/config.php untouched)
 */
const ADMIN_COOKIE = "rs_admin_session";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (
      path === "/rs-api.php" ||
      path.startsWith("/rs-api.php/") ||
      path === "/api" ||
      path.startsWith("/api/")
    ) {
      return proxyApi(request, url, env);
    }

    if (env.ASSETS) {
      const assetRes = await env.ASSETS.fetch(request);
      if (assetRes.status !== 404) {
        return assetRes;
      }
    }

    return proxyOriginHtml(request);
  },
};

function adminPathFromRequest(url) {
  const qp = (url.searchParams.get("__path") || "").replace(/^\/+/, "");
  if (qp.startsWith("admin/")) return qp;
  const m = url.pathname.match(/\/api(?:\/index\.php)?\/(.+)$/);
  if (m) {
    const rest = m[1].replace(/^\/+/, "");
    if (rest.startsWith("admin/")) return rest;
  }
  return "";
}

function needsAdminCookie(p) {
  return p.startsWith("admin/") && p !== "admin/login" && p !== "admin/logout";
}

function withAdminCookie(headers, token) {
  const next = new Headers(headers);
  const existing = next.get("Cookie") || "";
  const parts = existing
    .split(";")
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith(ADMIN_COOKIE + "="));
  parts.push(ADMIN_COOKIE + "=" + token);
  next.set("Cookie", parts.join("; "));
  next.delete("accept-encoding");
  return next;
}

async function proxyApi(request, url, env) {
  const token = env.ADMIN_SESSION_COOKIE;
  const adminPath = adminPathFromRequest(url);
  let headers = new Headers(request.headers);
  if (token && needsAdminCookie(adminPath)) {
    headers = withAdminCookie(headers, token);
  }
  const init = {
    method: request.method,
    headers,
    redirect: "manual",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }
  const upstream = await fetch(new Request(url.toString(), init));

  // Origin DB may lack consultation_requests until schema.sql is applied.
  if (
    request.method === "GET" &&
    adminPath === "admin/requests" &&
    upstream.status >= 500
  ) {
    try {
      const body = await upstream.clone().text();
      if (
        body.includes("consultation_requests") &&
        body.includes("doesn't exist")
      ) {
        return new Response(JSON.stringify({ requests: [] }), {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "x-rs-schema": "consultation_requests-missing",
          },
        });
      }
    } catch {
      // fall through
    }
  }

  return upstream;
}

async function proxyOriginHtml(request) {
  const response = await fetch(request);
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html") || !response.ok) {
    return response;
  }

  const url = new URL(request.url);
  const path = url.pathname;
  const canonicalPath = path === "/" ? "/" : path;
  const host = ["https://", "redeem", "ysoul", ".com"].join("");
  const canonical = host + canonicalPath;

  class HeadHandler {
    element(element) {
      element.prepend('<link rel="canonical" href="' + canonical + '">', {
        html: true,
      });
    }
  }

  return new HTMLRewriter().on("head", new HeadHandler()).transform(response);
}

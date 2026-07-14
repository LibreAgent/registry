const API_FILES = {
  "/v1/appcards/index.json": "index.json",
  "/v1/appcards/categories.json": "categories.json",
  "/v1/appcards/models.json": "models.json",
};

const SITE_FILES = {
  "/": ["site/index.html", "text/html; charset=utf-8"],
  "/styles.css": ["site/styles.css", "text/css; charset=utf-8"],
  "/app.js": ["site/app.js", "text/javascript; charset=utf-8"],
  "/favicon.svg": ["web/public/images/icon.svg", "image/svg+xml"],
};

const SOURCE_ROOT = "https://raw.githubusercontent.com/LibreAgent/registry/main/";

const SECURITY_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          ...SECURITY_HEADERS,
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        },
      });
    }

    if (!["GET", "HEAD"].includes(request.method)) {
      return new Response("Method not allowed", { status: 405, headers: SECURITY_HEADERS });
    }

    if (url.pathname === "/health") {
      return Response.json(
        { status: "ok", service: "LibreAgents Registry" },
        { headers: { ...SECURITY_HEADERS, "Cache-Control": "no-store" } },
      );
    }

    const apiFile = API_FILES[url.pathname];
    const siteFile = SITE_FILES[url.pathname];
    const source = apiFile || siteFile?.[0];
    const contentType = apiFile ? "application/json; charset=utf-8" : siteFile?.[1];

    if (!source) {
      return new Response("Not found", { status: 404, headers: SECURITY_HEADERS });
    }

    const upstream = await fetch(`${SOURCE_ROOT}${source}`, {
      cf: { cacheEverything: true, cacheTtl: apiFile ? 300 : 3600 },
    });

    if (!upstream.ok) {
      return new Response("Registry source unavailable", {
        status: upstream.status,
        headers: SECURITY_HEADERS,
      });
    }

    const headers = new Headers(upstream.headers);
    Object.entries(SECURITY_HEADERS).forEach(([name, value]) => headers.set(name, value));
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", apiFile ? "public, max-age=300, s-maxage=300" : "public, max-age=3600, s-maxage=3600");
    if (url.pathname === "/") {
      headers.set(
        "Content-Security-Policy",
        "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
      );
    }

    return new Response(request.method === "HEAD" ? null : upstream.body, {
      status: upstream.status,
      headers,
    });
  },
};

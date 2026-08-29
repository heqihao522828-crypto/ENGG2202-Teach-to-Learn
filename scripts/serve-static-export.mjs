import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

import { siteBasePath } from "../site-paths.mjs";

const exportRoot = join(process.cwd(), "out");
const port = Number(process.env.PORT ?? 4173);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function resolveExportPath(requestPath) {
  const decodedRequestPath = decodeURIComponent(requestPath);
  const pathWithoutBase = siteBasePath &&
      (decodedRequestPath === siteBasePath || decodedRequestPath.startsWith(`${siteBasePath}/`))
    ? decodedRequestPath.slice(siteBasePath.length) || "/"
    : decodedRequestPath;
  const decodedPath = pathWithoutBase.replace(/^\/+/, "");
  const safePath = normalize(decodedPath).replace(/^(\.\.(?:[\\/]|$))+/, "");
  const candidates = safePath
    ? [join(exportRoot, safePath), join(exportRoot, `${safePath}.html`), join(exportRoot, safePath, "index.html")]
    : [join(exportRoot, "index.html")];

  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host}`);
  const filePath = resolveExportPath(requestUrl.pathname);

  if (!filePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Static export available at http://127.0.0.1:${port}`);
});

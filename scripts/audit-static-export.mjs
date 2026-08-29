import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { siteBasePath } from "../site-paths.mjs";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const exportRoot = join(projectRoot, "out");
const requiredPages = [
  "index.html",
  "engg2202/index.html",
  "sdgs/index.html",
  "gallery/index.html",
  "guide/index.html",
  "about/index.html",
];

const errors = [];
const auditedAssets = new Set();
let htmlCount = 0;

function listFiles(directory, extension) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return listFiles(path, extension);
    }
    return !extension || entry.name.endsWith(extension) ? [path] : [];
  });
}

function exportedPathFor(urlPath) {
  const cleanPath = urlPath.split(/[?#]/, 1)[0];
  const withoutBasePath = siteBasePath &&
      (cleanPath === siteBasePath || cleanPath.startsWith(`${siteBasePath}/`))
    ? cleanPath.slice(siteBasePath.length) || "/"
    : cleanPath;
  return join(exportRoot, ...withoutBasePath.split("/").filter(Boolean));
}

function isExportedFile(filePath) {
  return existsSync(filePath) && statSync(filePath).isFile();
}

function checkLocalUrl(url, htmlPath, attribute) {
  if (!url.startsWith("/") || url.startsWith("//")) {
    return;
  }

  if (siteBasePath) {
    const duplicatePrefix = `${siteBasePath}${siteBasePath}/`;
    if (url.startsWith(duplicatePrefix)) {
      errors.push(`${relative(projectRoot, htmlPath)} has duplicate base path: ${url}`);
      return;
    }
    if (url !== siteBasePath && !url.startsWith(`${siteBasePath}/`)) {
      errors.push(`${relative(projectRoot, htmlPath)} has an unprefixed local URL: ${url}`);
      return;
    }
  }

  const exportPath = exportedPathFor(url);
  const isAsset = attribute === "src" || /\.[a-z0-9]+(?:[?#]|$)/i.test(url);
  const candidates = isAsset
    ? [exportPath]
    : [exportPath, `${exportPath}.html`, join(exportPath, "index.html")];

  if (isAsset) {
    auditedAssets.add(exportPath);
  }

  if (!candidates.some(isExportedFile)) {
    errors.push(`${relative(projectRoot, htmlPath)} references a missing export target: ${url}`);
  }
}

if (!existsSync(exportRoot)) {
  throw new Error("Static export audit failed: out/ does not exist.");
}

for (const requiredPage of requiredPages) {
  if (!existsSync(join(exportRoot, requiredPage))) {
    errors.push(`Missing required page: out/${requiredPage.split(sep).join("/")}`);
  }
}

if (!existsSync(join(exportRoot, ".nojekyll"))) {
  errors.push("Missing out/.nojekyll");
}

for (const htmlPath of listFiles(exportRoot, ".html")) {
  htmlCount += 1;
  const html = readFileSync(htmlPath, "utf8");
  const localUrls = html.matchAll(/(href|src)=["']([^"']+)["']/g);
  for (const [, attribute, url] of localUrls) {
    checkLocalUrl(url, htmlPath, attribute);
  }
}

const cssFiles = listFiles(join(exportRoot, "_next", "static"), ".css");
const jsFiles = listFiles(join(exportRoot, "_next", "static"), ".js");

if (cssFiles.length === 0) {
  errors.push("No CSS files found under out/_next/static");
}
if (jsFiles.length === 0) {
  errors.push("No JavaScript chunks found under out/_next/static");
}

if (errors.length > 0) {
  console.error("Static export path audit failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Static export path audit passed: ${htmlCount} HTML pages, ` +
      `${auditedAssets.size} referenced assets, ${cssFiles.length} CSS files, ` +
      `${jsFiles.length} JavaScript chunks (base path: ${siteBasePath || "/"}).`,
  );
}

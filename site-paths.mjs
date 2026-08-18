const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";

export const siteBasePath =
  configuredBasePath === "/"
    ? ""
    : configuredBasePath.replace(/\/$/, "");

export function withSiteBasePath(path) {
  if (
    !path ||
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (
    !siteBasePath ||
    normalizedPath === siteBasePath ||
    normalizedPath.startsWith(`${siteBasePath}/`)
  ) {
    return normalizedPath;
  }

  return `${siteBasePath}${normalizedPath}`;
}

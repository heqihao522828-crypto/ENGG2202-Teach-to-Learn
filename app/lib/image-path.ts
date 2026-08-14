export function imagePath(path: string): string {
  if (!path) {
    return path;
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedPath;
}
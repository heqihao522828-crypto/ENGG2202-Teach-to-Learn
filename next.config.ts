import type { NextConfig } from "next";
import { siteBasePath } from "./site-paths.mjs";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages supplies the repository base path during deployment.
  basePath: siteBasePath,
  // Folder-style routes keep copied links reliable with or without a final slash.
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    qualities: [72, 75],
    unoptimized: true,
  },
};

export default nextConfig;

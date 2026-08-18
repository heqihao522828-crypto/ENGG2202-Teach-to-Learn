import type { NextConfig } from "next";
import { siteBasePath } from "./site-paths.mjs";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages redirects this repository to activelearning.engg.hku.hk,
  // where the export is served from the domain root. Set
  // NEXT_PUBLIC_BASE_PATH only when deploying the export under a subpath.
  basePath: siteBasePath,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    qualities: [72, 75],
    unoptimized: true,
  },
};

export default nextConfig;

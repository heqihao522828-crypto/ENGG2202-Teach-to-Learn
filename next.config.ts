import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProduction ? "/activelearning-web" : "",
  turbopack: {
    root: process.cwd(),
  },
  images: {
    qualities: [72, 75],
    unoptimized: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    qualities: [72, 75],
    unoptimized: true,
  },
};

export default nextConfig;

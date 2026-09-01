import type { MetadataRoute } from "next";

const siteUrl = "https://active-learning-kyle.github.io/ENGG2202-Teach-to-Learn";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/engg2202", "/gallery", "/guide", "/about", "/sdgs"];

  return routes.map((route, index) => ({
    url: `${siteUrl}${route}/`,
    lastModified: new Date("2026-09-02"),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route === "/engg2202" ? 0.9 : 0.7,
  }));
}

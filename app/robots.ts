import type { MetadataRoute } from "next";

const siteUrl = "https://active-learning-kyle.github.io/ENGG2202-Teach-to-Learn";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: "https://active-learning-kyle.github.io",
  };
}

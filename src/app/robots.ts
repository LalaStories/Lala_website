import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/assets/",
    },
    sitemap: "https://lalastories.com/sitemap.xml",
  };
}

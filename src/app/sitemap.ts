import type { MetadataRoute } from "next";

const SITE = "https://harukamirai.engineer";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Only real, content-bearing routes are listed. /writing, /now, /lab are
  // ComingSoon stubs and stay out of the sitemap until they have real
  // content — thin placeholder pages hurt the site's overall quality signal
  // in search results.
  return [
    {
      url: `${SITE}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE}/work`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE}/resume`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}

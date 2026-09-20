import type { MetadataRoute } from "next";
import { profile } from "@/content";

// The host Vercel actually serves; the apex redirects here.
const SITE = profile.siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Stub routes - crawlable by humans via the nav, but not advertised
        // to search engines until they have real content.
        disallow: ["/writing", "/now", "/lab"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}

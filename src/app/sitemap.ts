import type { MetadataRoute } from "next";
import { getApps } from "@/lib/apps";
import { getPosts } from "@/lib/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://king.gojaehyun.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const posts = getPosts().map<MetadataRoute.Sitemap[number]>((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const apps = getApps()
    .filter((a) => a.demoUrl)
    .map<MetadataRoute.Sitemap[number]>((a) => ({
      url: a.demoUrl!,
      lastModified: new Date(a.createdAt),
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [...staticRoutes, ...posts, ...apps];
}

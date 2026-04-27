export type Platform = "web" | "macos" | "ios" | "other";

export interface App {
  slug: string;
  title: string;
  description: string;
  platform: Platform;
  demoUrl?: string;
  repoUrl: string;
  thumbnail: string;
  tags: string[];
  featured: boolean;
  createdAt: string;
}

export const PLATFORM_LABEL: Record<Platform, string> = {
  web: "Web",
  macos: "macOS",
  ios: "iOS",
  other: "Other",
};

export const PLATFORM_ACCENT: Record<Platform, string> = {
  web: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  macos: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  ios: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  other: "bg-zinc-500/15 text-zinc-300 ring-zinc-500/30",
};

import data from "@/data/apps.json";

export function getApps(): App[] {
  const apps = (data as App[]).slice();
  apps.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
  return apps;
}

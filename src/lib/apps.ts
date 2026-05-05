export type Platform = "web" | "macos" | "ios" | "other";

export interface App {
  slug: string;
  title: string;
  description: string;
  platform: Platform;
  demoUrl?: string;
  /** Direct binary download (e.g. .dmg from GitHub Releases). Takes precedence
   *  over demoUrl when present. */
  downloadUrl?: string;
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
  web: "bg-white/10 text-zinc-200 ring-white/15",
  macos: "bg-white/10 text-zinc-200 ring-white/15",
  ios: "bg-white/10 text-zinc-200 ring-white/15",
  other: "bg-white/10 text-zinc-200 ring-white/15",
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

"use client";

import { useMemo, useState } from "react";
import { AppCard } from "./AppCard";
import { type App, type Platform, PLATFORM_LABEL } from "@/lib/apps";

const FILTERS: Array<"all" | Platform> = ["all", "web", "macos", "ios", "other"];

export function PortalGrid({ apps }: { apps: App[] }) {
  const [filter, setFilter] = useState<"all" | Platform>("all");

  const visible = useMemo(() => {
    if (filter === "all") return apps;
    return apps.filter((a) => a.platform === filter);
  }, [apps, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: apps.length };
    for (const a of apps) c[a.platform] = (c[a.platform] || 0) + 1;
    return c;
  }, [apps]);

  return (
    <>
      <div className="sticky top-0 z-10 -mx-4 mb-6 border-b border-white/5 bg-zinc-950/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {FILTERS.map((f) => {
            const label = f === "all" ? "전체" : PLATFORM_LABEL[f];
            const count = counts[f] ?? 0;
            const active = filter === f;
            if (f !== "all" && count === 0) return null;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-colors ${
                  active
                    ? "bg-emerald-500 text-emerald-950 ring-emerald-400"
                    : "bg-white/5 text-zinc-300 ring-white/10 hover:bg-white/10"
                }`}
              >
                {label}
                <span className={`ml-1.5 text-xs ${active ? "text-emerald-900/70" : "text-zinc-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {visible.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </div>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <p className="text-sm text-zinc-400">
        아직 등록된 앱이 없어요. 터미널에서{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-zinc-200">
          /add-app &lt;repo&gt;
        </code>{" "}
        를 실행해 첫 앱을 추가해보세요.
      </p>
    </div>
  );
}

import Image from "next/image";
import { type App, PLATFORM_LABEL, PLATFORM_ACCENT } from "@/lib/apps";

export function AppCard({ app }: { app: App }) {
  const primaryHref = app.downloadUrl || app.demoUrl || app.repoUrl;
  const primaryLabel = app.downloadUrl
    ? "DMG 다운로드"
    : app.demoUrl
      ? "데모 열기"
      : "GitHub";
  const hasSecondary = Boolean(app.downloadUrl || app.demoUrl);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900/60 ring-1 ring-white/5 transition-all hover:ring-white/15 hover:bg-zinc-900"
    >
      <a
        href={primaryHref}
        target="_blank"
        rel="noreferrer noopener"
        className="relative block aspect-[16/10] w-full overflow-hidden bg-zinc-800"
        aria-label={`${app.title} ${primaryLabel}`}
      >
        <Image
          src={app.thumbnail}
          alt={app.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
        {app.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-950">
            Featured
          </span>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur ring-1 ${PLATFORM_ACCENT[app.platform]}`}
        >
          {PLATFORM_LABEL[app.platform]}
        </span>
      </a>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-snug text-zinc-50">
            {app.title}
          </h3>
          <time
            dateTime={app.createdAt}
            className="shrink-0 text-[10px] uppercase tracking-wider text-zinc-500"
          >
            {app.createdAt.slice(0, 10)}
          </time>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
          {app.description}
        </p>

        {app.tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {app.tags.slice(0, 4).map((t) => (
              <li
                key={t}
                className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2 pt-2">
          <a
            href={primaryHref}
            target="_blank"
            rel="noreferrer noopener"
            {...(app.downloadUrl ? { download: "" } : {})}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-zinc-100 px-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-white active:bg-zinc-300"
          >
            {primaryLabel}
          </a>
          {hasSecondary && (
            <a
              href={app.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-zinc-300 transition-colors hover:bg-white/10"
              aria-label="GitHub repository"
              title="GitHub"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.08 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.81-.01 3.2 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

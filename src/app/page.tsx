import { PortalGrid } from "@/components/PortalGrid";
import { getApps } from "@/lib/apps";

export const dynamic = "force-static";

export default function Home() {
  const apps = getApps();
  const latest = apps[0]?.createdAt?.slice(0, 10);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <header className="mb-10 sm:mb-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
          TNT Labs · Daily Vibe-Coded
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-5xl">
          매일 새로 만드는
          <br />
          작은 앱들의 포털.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          하루에 하나씩, 아이디어를 빠르게 만들어 올립니다. 웹 데모는 한 탭으로,
          데스크탑·모바일 전용 앱은 GitHub 레포로 이어집니다.
        </p>
        {latest && (
          <p className="mt-4 text-xs text-zinc-500">
            마지막 업데이트 · {latest} · 총 {apps.length}개
          </p>
        )}
      </header>

      <PortalGrid apps={apps} />

      <footer className="mt-20 border-t border-white/5 pt-8 text-xs text-zinc-500">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>© TNT Labs · vibe-coded with Claude</span>
          <a
            href="https://github.com/Gojaehyeon"
            target="_blank"
            rel="noreferrer noopener"
            className="text-zinc-400 hover:text-zinc-200"
          >
            github.com/Gojaehyeon
          </a>
        </div>
      </footer>
    </main>
  );
}

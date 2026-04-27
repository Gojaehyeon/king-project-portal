import Image from "next/image";
import { PortalGrid } from "@/components/PortalGrid";
import { getApps } from "@/lib/apps";

export const dynamic = "force-static";

export default function Home() {
  const apps = getApps();
  const latest = apps[0]?.createdAt?.slice(0, 10);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <header className="mb-10 sm:mb-14">
        <div className="mb-6 flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-full ring-1 ring-white/15 sm:h-16 sm:w-16">
            <Image
              src="/avatar.png"
              alt="Gojaehyeon"
              fill
              sizes="64px"
              className="object-cover"
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-zinc-100">고재현 · Gojaehyun</p>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
              <a
                href="https://github.com/Gojaehyeon"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-zinc-300"
              >
                GitHub
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="https://instagram.com/gojaehyun.go"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-zinc-300"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
          KING PROJECT · DAILY
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-5xl">
          하루에 한 개씩,
          <br />
          킹받는 프로그램 만들기.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          매일 한 개씩 킹받는 프로그램을 만드는 프로젝트 진행 중.
          웹 데모는 한 탭으로, 데스크탑·모바일 전용 앱은 GitHub 레포로 이어집니다.
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
          <span>© Gojaehyun · vibe-coded with Claude</span>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Gojaehyeon"
              target="_blank"
              rel="noreferrer noopener"
              className="text-zinc-400 hover:text-zinc-200"
            >
              GitHub
            </a>
            <a
              href="https://instagram.com/gojaehyun.go"
              target="_blank"
              rel="noreferrer noopener"
              className="text-zinc-400 hover:text-zinc-200"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

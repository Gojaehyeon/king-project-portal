import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { getApps } from "@/lib/apps";

export const metadata: Metadata = {
  title: "소개 — 킹 프로젝트 포털",
  description: "킹 프로젝트 포털과 메이커 고재현(Gojaehyun)에 대한 소개.",
};

export const dynamic = "force-static";

export default function AboutPage() {
  const apps = getApps();
  const total = apps.length;
  const byPlatform = apps.reduce<Record<string, number>>((acc, a) => {
    acc[a.platform] = (acc[a.platform] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <header className="mb-12 flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-white/15 sm:h-20 sm:w-20">
          <Image src="/avatar.png" alt="Gojaehyun" fill sizes="80px" className="object-cover" priority />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-zinc-50 sm:text-4xl">소개</h1>
          <p className="mt-1 text-sm text-zinc-400">고재현 · Gojaehyun · 메이커</p>
        </div>
      </header>

      <section className="space-y-10 text-sm leading-relaxed text-zinc-300 sm:text-base">
        <div>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">킹 프로젝트란</h2>
          <p>
            하루에 한 개씩 작은 프로그램을 만들어 출시하는 메이커 프로젝트입니다. 2026년 4월에 시작했고, 현재 총 {total}개의 앱이 누적되어 있습니다. 웹 데모, macOS 데스크탑 앱, iOS 모바일 앱, 그리고 ESP32 펌웨어 같은 하드웨어 프로젝트까지 영역을 가리지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">지금까지 만든 것</h2>
          <ul className="grid grid-cols-2 gap-y-2 text-zinc-300 sm:grid-cols-4">
            <li>전체 <span className="text-zinc-500">{total}</span></li>
            <li>Web <span className="text-zinc-500">{byPlatform.web ?? 0}</span></li>
            <li>macOS <span className="text-zinc-500">{byPlatform.macos ?? 0}</span></li>
            <li>iOS <span className="text-zinc-500">{byPlatform.ios ?? 0}</span></li>
          </ul>
          <p className="mt-4">
            모든 앱은 <Link href="/" className="text-zinc-100 underline">메인 페이지</Link>에서 한눈에 볼 수 있고, 제작 후기는 <Link href="/blog" className="text-zinc-100 underline">블로그</Link>에서 정리합니다.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">운영 주체</h2>
          <ul className="list-inside list-disc space-y-1 text-zinc-400">
            <li>상호: 티엔티랩스</li>
            <li>대표: 고재현</li>
            <li>업종: 정보통신업 / 소프트웨어 개발 및 공급업</li>
            <li>문의: <a href="mailto:tntlabgo@gmail.com" className="text-zinc-200 underline">tntlabgo@gmail.com</a></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">외부 채널</h2>
          <ul className="list-inside list-disc space-y-1 text-zinc-400">
            <li><a href="https://github.com/Gojaehyeon" target="_blank" rel="noreferrer noopener" className="text-zinc-200 underline">GitHub</a> — 모든 앱의 소스코드</li>
            <li><a href="https://instagram.com/gojaehyun.go" target="_blank" rel="noreferrer noopener" className="text-zinc-200 underline">Instagram</a> — 데모 영상과 제작 과정</li>
          </ul>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

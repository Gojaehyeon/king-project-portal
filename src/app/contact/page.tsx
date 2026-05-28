import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "연락처 — 킹 프로젝트 포털",
  description: "킹 프로젝트 포털 운영자에게 문의·제안·협업 요청을 보낼 수 있는 채널입니다.",
};

export const dynamic = "force-static";

export default function ContactPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <h1 className="mb-2 text-3xl font-semibold text-zinc-50 sm:text-4xl">연락처</h1>
      <p className="mb-10 text-sm text-zinc-500">문의, 협업, 광고, 제휴에 관한 모든 연락을 환영합니다.</p>

      <section className="space-y-8 text-sm leading-relaxed text-zinc-300 sm:text-base">
        <div>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">이메일</h2>
          <p>
            <a href="mailto:tntlabgo@gmail.com" className="text-zinc-100 underline">tntlabgo@gmail.com</a>
          </p>
          <p className="mt-2 text-zinc-500">평일 기준 영업일 2일 이내 회신을 목표로 합니다.</p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">목적별 안내</h2>
          <ul className="list-inside list-disc space-y-2 text-zinc-400">
            <li>
              <span className="text-zinc-200">서비스/앱 관련 문의</span> — 메일 제목에 앱 이름(예: gatcha, instaclock)을 적어 주시면 처리가 빨라집니다.
            </li>
            <li>
              <span className="text-zinc-200">광고 및 제휴</span> — 광고주, 매체사, 광고 대행사 등에서 보내는 제안.
            </li>
            <li>
              <span className="text-zinc-200">취재/인터뷰</span> — 매체 정보, 마감일, 인터뷰 방식(서면/대면)을 함께 보내 주시면 좋습니다.
            </li>
            <li>
              <span className="text-zinc-200">개인정보 관련 요청</span> — 열람·정정·삭제·처리 정지 요청.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">사업자 정보</h2>
          <ul className="list-inside list-disc space-y-1 text-zinc-400">
            <li>상호: 티엔티랩스</li>
            <li>대표자: 고재현</li>
            <li>주소: 사업자등록증상 주소 (요청 시 메일로 회신)</li>
            <li>사업자등록번호: 000-00-00000</li>
          </ul>
          <p className="mt-3 text-xs text-zinc-500">
            ※ 위 사업자 정보 자리 표시자(placeholder)를 실제 등록 정보로 교체해 주세요.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">소셜</h2>
          <ul className="list-inside list-disc space-y-1 text-zinc-400">
            <li><a href="https://instagram.com/gojaehyun.go" target="_blank" rel="noreferrer noopener" className="text-zinc-200 underline">Instagram @gojaehyun.go</a></li>
            <li><a href="https://github.com/Gojaehyeon" target="_blank" rel="noreferrer noopener" className="text-zinc-200 underline">GitHub @Gojaehyeon</a></li>
          </ul>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

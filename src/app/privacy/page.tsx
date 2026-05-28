import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "개인정보처리방침 — 킹 프로젝트 포털",
  description: "킹 프로젝트 포털(king.gojaehyun.com)의 개인정보처리방침입니다.",
};

export const dynamic = "force-static";

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <h1 className="mb-2 text-3xl font-semibold text-zinc-50 sm:text-4xl">개인정보처리방침</h1>
      <p className="mb-10 text-sm text-zinc-500">최종 개정일: 2026년 5월 28일</p>

      <section className="space-y-8 text-sm leading-relaxed text-zinc-300 sm:text-base">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">1. 총칙</h2>
          <p>
            티엔티랩스(이하 &quot;운영자&quot;)는 킹 프로젝트 포털(king.gojaehyun.com 및 *.gojaehyun.com 하위 도메인, 이하 &quot;서비스&quot;)을 운영하면서 이용자의 개인정보를 중요하게 다룹니다. 본 방침은 운영자가 수집하는 정보의 항목, 이용 목적, 보관 기간, 제3자 제공 및 이용자의 권리를 안내합니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">2. 수집하는 정보</h2>
          <p className="mb-2">서비스는 별도의 회원 가입 절차를 두지 않으며, 다음의 정보를 자동 수집할 수 있습니다.</p>
          <ul className="list-inside list-disc space-y-1 text-zinc-400">
            <li>접속 IP 주소, 브라우저 종류 및 버전, 운영체제, 접속 시간</li>
            <li>접속 페이지 URL, 이전 페이지(referrer), 체류 시간</li>
            <li>쿠키 및 유사 식별자(Google Analytics, Google AdSense)</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">3. 이용 목적</h2>
          <ul className="list-inside list-disc space-y-1 text-zinc-400">
            <li>서비스 운영 통계 산출 및 콘텐츠 개선</li>
            <li>광고 노출 및 광고 효과 측정</li>
            <li>비정상 접근 차단 등 보안 목적</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">4. 제3자 제공 — Google AdSense / Analytics</h2>
          <p className="mb-2">
            서비스에는 Google Inc.가 제공하는 광고 서비스(AdSense)와 분석 서비스(Analytics)가 포함되어 있습니다. 이들 서비스는 쿠키 및 광고 ID를 이용해 맞춤형 광고를 제공할 수 있습니다.
          </p>
          <p className="mb-2">
            제3자 공급업체인 Google은 이용자가 이 사이트나 다른 사이트를 방문한 기록을 바탕으로 광고를 게재합니다. 이용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer noopener" className="text-zinc-100 underline">Google 광고 설정</a>에서 맞춤 광고를 비활성화할 수 있습니다.
          </p>
          <p>
            Google의 개인정보 보호 정책은 <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer noopener" className="text-zinc-100 underline">policies.google.com/privacy</a>에서 확인할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">5. 쿠키의 사용</h2>
          <p>
            운영자는 쿠키를 통해 이용자의 방문 및 이용 형태를 분석할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 일부 서비스 이용에 제한이 발생할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">6. 보관 기간 및 파기</h2>
          <p>
            자동 수집된 접속 로그는 관련 법령에 따른 보관 의무 기간 종료 시 즉시 파기합니다. 이용자가 직접 입력한 정보(문의 메일 본문 등)는 처리 목적이 달성된 후 지체 없이 파기합니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">7. 이용자의 권리</h2>
          <p>
            이용자는 언제든지 자신의 개인정보 처리에 관해 열람·정정·삭제·처리 정지를 요청할 수 있으며, 그 요청은 아래 연락처로 접수해 주시기 바랍니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">8. 책임자 및 문의</h2>
          <ul className="list-inside list-disc space-y-1 text-zinc-400">
            <li>개인정보 보호 책임자: 고재현</li>
            <li>이메일: tntlabgo@gmail.com</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">9. 고지의 의무</h2>
          <p>
            본 방침이 변경되는 경우 변경 사항을 본 페이지에 게시하며, 중요한 변경의 경우 30일 전 공지합니다.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

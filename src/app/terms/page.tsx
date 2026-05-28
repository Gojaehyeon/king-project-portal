import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "이용약관 — 킹 프로젝트 포털",
  description: "킹 프로젝트 포털(king.gojaehyun.com)의 서비스 이용약관입니다.",
};

export const dynamic = "force-static";

export default function TermsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <h1 className="mb-2 text-3xl font-semibold text-zinc-50 sm:text-4xl">이용약관</h1>
      <p className="mb-10 text-sm text-zinc-500">시행일: 2026년 5월 28일</p>

      <section className="space-y-8 text-sm leading-relaxed text-zinc-300 sm:text-base">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">제1조 (목적)</h2>
          <p>
            본 약관은 티엔티랩스(이하 &quot;운영자&quot;)가 제공하는 킹 프로젝트 포털(king.gojaehyun.com 및 *.gojaehyun.com, 이하 &quot;서비스&quot;) 및 그에 포함된 웹앱·데모·블로그 콘텐츠의 이용 조건을 정함을 목적으로 합니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">제2조 (서비스의 성격)</h2>
          <p>
            서비스는 운영자가 제작한 daily app 데모, 블로그 글, 외부 배포 채널 링크를 모은 포트폴리오 사이트입니다. 일부 데모는 별도의 회원 가입 없이 무료로 제공되며, 데모의 기능 및 가용성은 사전 고지 없이 변경될 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">제3조 (저작권)</h2>
          <p className="mb-2">
            서비스에 게시된 글, 이미지, 코드 스니펫의 저작권은 별도 표기가 없는 한 운영자에게 귀속됩니다. 다만 각 daily app의 소스코드는 GitHub 리포지토리에 명시된 라이선스를 따릅니다.
          </p>
          <p>
            이용자는 비상업적 인용 시 출처(king.gojaehyun.com)를 명시해야 하며, 상업적 이용을 원할 경우 사전에 서면 허가를 받아야 합니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">제4조 (광고)</h2>
          <p>
            서비스 일부 페이지에는 Google AdSense 등 제3자 광고 네트워크에서 제공하는 광고가 게재될 수 있습니다. 광고 콘텐츠의 정확성 및 광고 클릭 후 발생하는 거래에 대해 운영자는 책임을 지지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">제5조 (금지 행위)</h2>
          <p>이용자는 다음의 행위를 해서는 안 됩니다.</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-400">
            <li>서비스 운영을 방해하는 비정상적 트래픽 발생, 크롤링 남용</li>
            <li>광고 부정 클릭, 자동화 도구를 통한 광고 노출 부풀리기</li>
            <li>운영자의 사전 허가 없는 콘텐츠 복제·재배포·2차 가공</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">제6조 (면책)</h2>
          <p>
            서비스의 daily app은 실험적 성격의 데모입니다. 운영자는 데모 이용 중 발생할 수 있는 데이터 손실, 기기 손상, 기타 직간접 손해에 대해 책임을 지지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">제7조 (약관의 변경)</h2>
          <p>
            본 약관은 관련 법령, 운영 정책의 변경에 따라 개정될 수 있으며, 개정 시 본 페이지에 즉시 공지합니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">제8조 (준거법 및 관할)</h2>
          <p>
            본 약관은 대한민국 법령에 따라 해석되며, 분쟁이 발생할 경우 민사소송법에 따른 관할 법원을 따릅니다.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

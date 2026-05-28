import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/5 pt-8 text-xs text-zinc-500">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-1">
          <p className="text-zinc-300">© Gojaehyun · vibe-coded with Claude</p>
          <p>상호: 티엔티랩스 · 대표: 고재현</p>
          <p>사업자등록번호: 000-00-00000 · 이메일: tntlabgo@gmail.com</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/about" className="text-zinc-400 hover:text-zinc-200">소개</Link>
          <Link href="/blog" className="text-zinc-400 hover:text-zinc-200">블로그</Link>
          <Link href="/contact" className="text-zinc-400 hover:text-zinc-200">연락처</Link>
          <Link href="/privacy" className="text-zinc-400 hover:text-zinc-200">개인정보처리방침</Link>
          <Link href="/terms" className="text-zinc-400 hover:text-zinc-200">이용약관</Link>
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
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "블로그 — 킹 프로젝트 포털",
  description: "하루에 한 개씩 앱을 만들면서 쌓이는 제작 후기, 기술 노트, 메이커 일지.",
};

export const dynamic = "force-static";

export default function BlogIndexPage() {
  const posts = getPosts();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <header className="mb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">BLOG · MAKER NOTES</p>
        <h1 className="text-3xl font-semibold leading-tight text-zinc-50 sm:text-4xl">제작 후기와 메이커 일지</h1>
        <p className="mt-4 max-w-xl text-base text-zinc-400">
          하루에 한 개씩 daily app을 만들면서 쌓이는 기술 노트, 실패담, 다음 실험에 대한 메모.
        </p>
      </header>

      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-white/5 pb-8 last:border-b-0">
            <Link href={`/blog/${post.slug}`} className="group block">
              <p className="text-xs text-zinc-500">{post.date}</p>
              <h2 className="mt-2 text-xl font-semibold text-zinc-100 group-hover:text-white sm:text-2xl">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-400 sm:text-base">{post.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-zinc-400 ring-1 ring-white/10">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <SiteFooter />
    </main>
  );
}

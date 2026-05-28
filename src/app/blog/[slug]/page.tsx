import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { PostContent } from "@/components/PostContent";
import { getPost, getPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "글을 찾을 수 없습니다 — 킹 프로젝트 포털" };
  return {
    title: `${post.title} — 킹 프로젝트 포털`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <Link href="/blog" className="mb-8 inline-block text-xs text-zinc-500 hover:text-zinc-300">
        ← 블로그 목록으로
      </Link>

      <header className="mb-10">
        <p className="text-xs text-zinc-500">{post.date}</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-base text-zinc-400">{post.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span key={t} className="rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-zinc-400 ring-1 ring-white/10">
              {t}
            </span>
          ))}
        </div>
      </header>

      <article>
        <PostContent markdown={post.content} />
      </article>

      <SiteFooter />
    </main>
  );
}

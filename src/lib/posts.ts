import data from "@/data/posts.json";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  content: string;
}

export function getPosts(): Post[] {
  const posts = (data as Post[]).slice();
  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return (data as Post[]).find((p) => p.slug === slug);
}

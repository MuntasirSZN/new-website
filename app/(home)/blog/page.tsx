import Link from "next/link";
import { formatBlogPostDate, getLatestBlogPosts } from "@/lib/blog";

export default function Page() {
  const posts = getLatestBlogPosts();

  return (
    <main className="mx-auto w-full max-w-350 flex-1 px-4 py-8">
      <h1 className="mb-8 font-bold text-4xl">Latest Blog Posts</h1>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="flex flex-col rounded-2xl border bg-fd-card p-4 shadow-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <p className="font-medium">{post.data.title}</p>
            <p className="text-fd-muted-foreground text-sm">{post.data.description}</p>

            <p className="mt-auto pt-4 text-brand text-xs">{formatBlogPostDate(post)}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

import Link from "next/link";
import { formatPostDate, getPosts } from "@/lib/blog";
import { blogAuthors, blogSource } from "@/lib/source";
import BlogCard from "../ui/blog-card";

export default function Blogs() {
  const posts = getPosts(blogSource.getPages(), blogAuthors).slice(0, 4);

  return (
    <section className="bg-neutral-50 py-14 dark:bg-neutral-950">
      <div className="mx-auto w-full max-w-350 px-4 md:px-6">
        <div className="text-center lg:text-left">
          <h2 className="font-bold font-bricolage-grotesque text-3xl text-zinc-900 md:text-4xl dark:text-zinc-50">
            Stay Updated
          </h2>
          <p className="pt-2 text-lg text-zinc-600 md:text-xl dark:text-zinc-400">
            Release notes, announcements, and updates from the OpenBangla team.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-10 lg:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.url} href={post.url} className="block">
              <BlogCard
                title={post.title}
                date={formatPostDate(post.date)}
                author={post.authors.map((a) => a.name).join(", ")}
                description={post.description ?? ""}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

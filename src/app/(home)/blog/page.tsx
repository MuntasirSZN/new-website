import { blogAuthors, blogSource } from "@/lib/source";
import { getPosts } from "@/lib/blog";
import { BlogCards } from "@/components/blog";

export default function Page() {
  return <BlogCards posts={getPosts(blogSource.getPages(), blogAuthors)} />;
}

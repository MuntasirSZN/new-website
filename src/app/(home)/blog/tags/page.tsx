import { blogSource } from "@/lib/source";
import { getPosts, getTags } from "@/lib/blog";
import { BlogHeader, BlogTagCards, BlogTitle } from "@/components/blog";

export default function Page() {
  const tags = getTags(getPosts(blogSource.getPages()));

  return (
    <>
      <BlogHeader>
        <BlogTitle>All Tags</BlogTitle>
      </BlogHeader>
      <BlogTagCards tags={tags} />
    </>
  );
}

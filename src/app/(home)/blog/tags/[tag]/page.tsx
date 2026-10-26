import { notFound } from "next/navigation";
import { blogAuthors, blogSource } from "@/lib/source";
import { getPosts, getTagPosts, getTags } from "@/lib/blog";
import { BlogCards, BlogHeader, BlogTitle } from "@/components/blog";

export default async function Page(props: PageProps<"/blog/tags/[tag]">) {
  const { tag } = await props.params;
  const result = getTagPosts(getPosts(blogSource.getPages(), blogAuthors), tag);
  if (!result) notFound();

  return (
    <>
      <BlogHeader>
        <BlogTitle>{result.tag.name}</BlogTitle>
      </BlogHeader>
      <BlogCards posts={result.posts} />
    </>
  );
}

export function generateStaticParams() {
  return getTags(getPosts(blogSource.getPages())).map((tag) => ({ tag: tag.slug }));
}

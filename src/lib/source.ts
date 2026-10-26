// https://www.fumadocs.dev/docs/integrations/blog

import { llms, loader } from "fumadocs-core/source";
import { docsRoute } from "./shared";
import { defineDocs } from "fumadocs-mdx/macro";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineCollections } from "fumadocs-mdx/macro";
import { type BlogAuthor, blogPageSchema } from "@/lib/blog";

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`,
});

const blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: blogPageSchema,
});
export const blogSource = loader({
  baseUrl: "/blog",
  source: blog.toFumadocsSource(),
});
export const blogAuthors: Record<string, BlogAuthor> = {
  mominul: {
    name: "Muhammad Mominul Huque",
    title: "Maintainer",
    url: "https://mominul.github.io/",
    image: "https://avatars.githubusercontent.com/u/9459891",
  },
};

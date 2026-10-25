import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "@takumi-rs/image-response";
import { generate as DefaultImage } from "fumadocs-ui/og/takumi";
import { notFound } from "next/navigation";
import { appName } from "@/lib/shared";
import { blog, getBlogImage } from "@/lib/source";

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<"/og/blog/[...slug]">) {
  const { slug } = await params;
  const page = blog.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const fontData = readFileSync(
    join(process.cwd(), "app", "_fonts", "noto-sans-bengali", "NotoSansBengali[wdth,wght].woff2"),
  );

  return new ImageResponse(
    <div
      style={{
        fontSynthesisWeight: "none",
        fontFamily: "Noto Sans Bengali",
        fontVariationSettings: "'wght' 700, 'wdth' 95",
        lineHeight: 1.25,
        width: 1200,
        height: 630,
      }}
    >
      <DefaultImage title={page.data.title} description={`By ${page.data.author}`} site={appName} />
    </div>,
    {
      width: 1200,
      height: 630,
      format: "webp",
      fonts: [
        {
          name: "Noto Sans Bengali",
          data: fontData,
          weight: 400,
          style: "normal",
        },
        {
          name: "Noto Sans Bengali",
          data: fontData,
          weight: 500,
          style: "normal",
        },
        {
          name: "Noto Sans Bengali",
          data: fontData,
          weight: 600,
          style: "normal",
        },
        {
          name: "Noto Sans Bengali",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}

export function generateStaticParams() {
  return blog.getPages().map((page) => ({
    slug: getBlogImage(page).segments,
  }));
}

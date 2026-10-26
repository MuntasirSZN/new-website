// https://nextjs.org/docs/messages/export-image-api

import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default withMDX(config);

// https://www.fumadocs.dev/docs/ui/layouts

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "./shared";
import { BookHeart, BookIcon, BookText } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { icon: <BookText />, text: "Blog", url: "/blog" },
      { icon: <BookIcon />, text: "Docs", url: "/docs" },
      { icon: <BookHeart />, text: "Thanks", url: "/thanks" },
    ],
  };
}

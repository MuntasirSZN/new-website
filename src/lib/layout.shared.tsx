// https://www.fumadocs.dev/docs/ui/layouts

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "./shared";
import { BookIcon } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { icon: <BookIcon />, text: "Blog", url: "/blog" },
      { icon: <BookIcon />, text: "Docs", url: "/docs" },
    ],
  };
}

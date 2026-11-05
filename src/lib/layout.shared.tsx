// https://www.fumadocs.dev/docs/ui/layouts

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { gitConfig } from "./shared";
import { BookHeart, BookIcon, BookText } from "lucide-react";
import Image from "next/image";
import icon from "@/app/icon.svg";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Image src={icon} alt="icon" height={32} width={32} />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { icon: <BookText />, text: "Blog", url: "/blog" },
      { icon: <BookIcon />, text: "Docs", url: "/docs" },
      { icon: <BookHeart />, text: "Thanks", url: "/thanks" },
    ],
  };
}

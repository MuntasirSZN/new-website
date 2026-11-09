"use client";

import Image from "next/image";
import { useState } from "react";

function initials(name: string) {
  return name
    .replace(/\[bot\]/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/**
 * A contributor's GitHub avatar over their initials. The initials render first
 * so a missing profile or a failed image request still leaves a readable badge.
 */
export function ContributorAvatar({ name, avatar }: { name: string; avatar?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      aria-hidden
      className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-fd-border bg-fd-muted text-[10px] font-medium uppercase tracking-wide text-fd-muted-foreground"
    >
      {initials(name)}
      {avatar && !failed && (
        <Image
          src={avatar}
          alt=""
          width={24}
          height={24}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          ref={(image) => {
            // An image that failed before hydration never fires onError.
            if (image?.complete && image.naturalWidth === 0) setFailed(true);
          }}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </span>
  );
}

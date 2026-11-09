"use client";

import { ContributorAvatar } from "@/components/thanks/contributor-avatar";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-foreground";

export function ContributorRow({
  name,
  rank,
  commits,
  login,
  avatar,
}: {
  name: string;
  rank: number;
  commits: number;
  login?: string;
  avatar?: string;
}) {
  const profileUrl = login ? `https://github.com/${login}` : null;

  return (
    <tr className="border-t border-fd-border transition-colors hover:bg-fd-accent/40">
      <td className="px-3 py-2.5 text-right tabular-nums text-fd-muted-foreground sm:px-4">
        {rank}
      </td>
      <td className="px-3 py-2.5 sm:px-4">
        <span className="flex min-w-0 items-center gap-2.5">
          <ContributorAvatar name={name} avatar={avatar} />
          {profileUrl ? (
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className={`text-fd-card-foreground transition-colors hover:text-brand-text ${focusRing}`}
            >
              {name}
            </a>
          ) : (
            <span className="text-fd-card-foreground">{name}</span>
          )}
          {name.endsWith("[bot]") && (
            <span className="rounded border border-fd-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-fd-muted-foreground">
              bot
            </span>
          )}
        </span>
      </td>
      <td className="px-3 py-2.5 text-right font-medium tabular-nums text-fd-foreground sm:px-4">
        {commits}
      </td>
    </tr>
  );
}

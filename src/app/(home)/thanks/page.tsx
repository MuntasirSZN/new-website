// app/thanks/page.tsx
//
// A static "Thanks" page listing all-time contributors to OpenBangla Keyboard.
// Colors come from Fumadocs' `fd-*` Tailwind tokens, so light/dark mode
// follows your existing Fumadocs theme (RootProvider) with no extra code.

import type { Metadata } from "next";

// Update both of these whenever you refresh the data.
// Source: `git shortlog -sn --no-merges` on the develop branch.
const LAST_UPDATED = "2026-10-28";

const CONTRIBUTORS: { name: string; commits: number }[] = [
  { name: "Muhammad Mominul Huque", commits: 426 },
  { name: "Adyel Ullahil Mamun", commits: 24 },
  { name: "Ahmad Hasan Mubashshir", commits: 13 },
  { name: "Sammay Sarkar", commits: 12 },
  { name: "Reshad Ahammed Ayon", commits: 6 },
  { name: "Weng Xuetian", commits: 6 },
  { name: "Abu Huraira", commits: 3 },
  { name: "Nafiul Rony", commits: 3 },
  { name: "JonyBepary", commits: 2 },
  { name: "Md. Fahim Bin Amin", commits: 2 },
  { name: "Arifur Rahman", commits: 1 },
  { name: "Battery9", commits: 1 },
  { name: "Chandradeep Dey", commits: 1 },
  { name: "Fake ID", commits: 1 },
  { name: "Gunnar Hjalmarsson", commits: 1 },
  { name: "Imran Khan", commits: 1 },
  { name: "Mahmud Nabil", commits: 1 },
  { name: "Mike FABIAN", commits: 1 },
  { name: "Shakib Hossain", commits: 1 },
  { name: "Sintaul Mahdi Siam", commits: 1 },
  { name: "Thomas Staudinger", commits: 1 },
  { name: "Zahin Azmayeen", commits: 1 },
  { name: "imgbot[bot]", commits: 1 },
  { name: "larina3315", commits: 1 },
  { name: "yeakiniqra", commits: 1 },
];

export const metadata: Metadata = {
  title: "Thanks",
  description: "All-time contributors to OpenBangla Keyboard.",
};

// Standard competition ranking: equal commit counts share a rank (1, 2, 2, 4 ...).
function withRanks(list: typeof CONTRIBUTORS) {
  const sorted = [...list].sort((a, b) => b.commits - a.commits || a.name.localeCompare(b.name));
  return sorted.map((c, i) => {
    const firstWithSameCount = sorted.findIndex((x) => x.commits === c.commits);
    return { ...c, rank: firstWithSameCount + 1, key: `${i}-${c.name}` };
  });
}

export default function ThanksPage() {
  const rows = withRanks(CONTRIBUTORS);
  const total = rows.reduce((sum, c) => sum + c.commits, 0);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">Thanks</h1>
        <h2 className="mt-2 text-lg text-fd-muted-foreground">
          All-time OpenBangla Keyboard contributors
        </h2>
        <p className="mt-4 text-fd-muted-foreground">
          OpenBangla Keyboard exists because of the people below. Thank you for every commit. The
          list shows all-time commits on the{" "}
          <code className="rounded bg-fd-muted px-1.5 py-0.5 text-sm text-fd-foreground">
            develop
          </code>{" "}
          branch, excluding merge commits.
        </p>

        <dl className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-lg border border-fd-border bg-fd-card px-4 py-3">
            <dt className="text-sm text-fd-muted-foreground">Contributors</dt>
            <dd className="text-2xl font-semibold text-fd-card-foreground">{rows.length}</dd>
          </div>
          <div className="rounded-lg border border-fd-border bg-fd-card px-4 py-3">
            <dt className="text-sm text-fd-muted-foreground">Commits</dt>
            <dd className="text-2xl font-semibold text-fd-card-foreground">{total}</dd>
          </div>
        </dl>
      </header>

      <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            OpenBangla Keyboard contributors ranked by commit count
          </caption>
          <thead className="bg-fd-muted text-fd-muted-foreground">
            <tr>
              <th scope="col" className="w-16 px-4 py-2.5 font-medium">
                Rank
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Name
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">
                Commits
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.key}
                className="border-t border-fd-border transition-colors hover:bg-fd-accent/50"
              >
                <td className="px-4 py-2.5 tabular-nums text-fd-muted-foreground">{c.rank}</td>
                <td className="px-4 py-2.5 text-fd-card-foreground">
                  <span>{c.name}</span>
                  {c.name.endsWith("[bot]") && (
                    <span className="ml-2 rounded border border-fd-border px-1.5 py-0.5 text-xs text-fd-muted-foreground">
                      bot
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums font-medium text-fd-foreground">
                  {c.commits}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-fd-muted-foreground">
        Last updated on{" "}
        <time dateTime={LAST_UPDATED}>
          {new Date(`${LAST_UPDATED}T00:00:00Z`).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })}
        </time>
        . This site is static, so the list is refreshed by hand.
      </p>
    </main>
  );
}

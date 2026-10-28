#!/usr/bin/env bun
// scripts/generate-contributors.ts
// Clones all OpenBangla repos and aggregates contributor data.

import { $ } from "bun";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import os from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAILMAP = join(__dirname, "../.mailmap");

interface RepoInfo {
  name: string;
  default_branch: string;
}
function loadMailmap(p: string): Map<string, string> {
  const m = new Map<string, string>();
  if (!existsSync(p)) return m;
  const text = readFileSync(p, "utf-8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const matches = [...t.matchAll(/([^<]+?)\s*<([^>]+)>/g)];
    if (matches.length === 0) continue;
    const canonical = matches[0][1].trim();
    for (const match of matches) {
      const name = match[1].trim();
      const email = match[2].trim();
      if (name && name !== canonical) m.set(name.toLowerCase(), canonical);
      if (email) m.set(email.toLowerCase(), canonical);
    }
  }
  return m;
}

function normalize(login: string, map: Map<string, string>): string {
  return map.get(login.toLowerCase()) || login;
}

async function main() {
  const mailmap = loadMailmap(MAILMAP);

  // Fetch repos from API (fast, no clone needed for list)
  const repos: RepoInfo[] = await fetch("https://api.github.com/orgs/OpenBangla/repos?per_page=100")
    .then((r) => r.json())
    .catch(() => []);
  const nonForks = (repos as any[]).filter((r) => !r.fork);

  const agg = new Map<string, number>();

  for (const repo of nonForks) {
    const branch: string = repo.default_branch || "master";
    const name: string = repo.name;
    const tmp = join(os.tmpdir(), `openbangla-${name}-${Date.now()}`);

    try {
      await $`rm -rf ${tmp}`.quiet().catch(() => {});
      await $`mkdir -p ${tmp}`.quiet();

      // Very cheap clone: filter out blobs (only metadata + commits), single branch
      await $`git clone --branch ${branch} --single-branch --filter=blob:none --recurse-submodules=no --no-tags https://github.com/OpenBangla/${name}.git ${tmp}`.quiet();

      const out = await $`git -C ${tmp} shortlog -sn --no-merges HEAD`.text();
      for (const line of out.trim().split("\n")) {
        const t = line.trim();
        if (!t) continue;
        const m = t.match(/^(\s*\d+)\t(.+)$/);
        if (!m) continue;
        const commits = parseInt(m[1].trim(), 10);
        const nameNorm = normalize(m[2].trim(), mailmap);
        agg.set(nameNorm, (agg.get(nameNorm) || 0) + commits);
      }
    } catch (e: any) {
      console.warn(`Failed ${name}:`, e.message || e);
    } finally {
      await $`rm -rf ${tmp}`.quiet().catch(() => {});
    }
  }

  const sorted = Array.from(agg.entries())
    .map(([n, c]) => ({ name: n, commits: c }))
    .sort((a, b) => b.commits - a.commits || a.name.localeCompare(b.name));

  const dateStr = new Date().toISOString().split("T")[0];
  const ts = `// Auto-generated at build time by scripts/generate-contributors.ts
export const LAST_UPDATED = "${dateStr}";
export const CONTRIBUTORS: { name: string; commits: number }[] = [
${sorted.map((c) => `  { name: "${c.name.replace(/"/g, '\\"')}", commits: ${c.commits} },`).join("\n")}
];
`;
  writeFileSync(join(__dirname, "../src/app/(home)/thanks/contributors-data.ts"), ts);
  console.log(`Generated with ${sorted.length} contributors (${dateStr}).`);
}

main();

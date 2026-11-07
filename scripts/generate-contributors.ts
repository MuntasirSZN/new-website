#!/usr/bin/env bun

/**
 * Collects all-time contributors across a GitHub organization and writes
 * them to a JSON file, with the number of commits each person has made.
 *
 * Usage: bun scripts/generate-contributors.ts [--org OpenBangla] [--cache DIR]
 *
 * Only public, non-fork repos are counted, on their default branch, without
 * merge commits.
 *
 * Who counts as "one person": git applies the .mailmap file for us, and then
 * one (mailmap-resolved) email is one person. Emails are shown in the console
 * so you can spot problems and fix them in .mailmap, but they are never
 * written to the output file.
 *
 * Requires the GITHUB_TOKEN environment variable (see .env.example).
 */

import { $ } from "bun";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT = resolve(import.meta.dirname, "..");
const MAILMAP_PATH = join(ROOT, ".mailmap");
const OUTPUT_PATH = join(ROOT, "src/data/contributors.json");
const DEFAULT_CACHE_DIR = join(ROOT, ".cache/contributors");
const DEFAULT_ORG = "OpenBangla";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Options {
  org: string;
  cacheDir: string;
}

interface Repo {
  name: string;
  cloneUrl: string;
  defaultBranch: string;
}

interface Commit {
  sha: string;
  name: string;
  email: string;
}

/** One person, as we know them while working. Has an email: never written out. */
interface Person {
  name: string;
  email: string;
  commits: number;
}

/** One person, as written to the output file. */
interface Contributor {
  name: string;
  commits: number;
}

interface Collection {
  commits: Commit[]; // unique by SHA, across all repos
  scannedRepos: number;
  skippedRepos: string[];
}

// ---------------------------------------------------------------------------
// Console output: plain text, with optional colors
// ---------------------------------------------------------------------------

// Colors are turned off when output is piped to a file or NO_COLOR is set.
const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;

function paint(code: number, text: string): string {
  return useColor ? `\x1b[${code}m${text}\x1b[0m` : text;
}

const bold = (text: string) => paint(1, text);
const dim = (text: string) => paint(2, text);
const red = (text: string) => paint(31, text);
const green = (text: string) => paint(32, text);
const yellow = (text: string) => paint(33, text);

// Always pad text first and paint it afterwards, because color codes
// count as characters and would break the alignment.

function formatNumber(value: number): string {
  return value.toLocaleString("en-US"); // 1204 -> "1,204"
}

function printTitle(title: string): void {
  console.log(bold(title));
  console.log("=".repeat(title.length));
}

function printHeading(heading: string): void {
  console.log(`\n${bold(heading)}`);
}

function printRepoDone(name: string, nameWidth: number, action: string, commitCount: number): void {
  const commits = formatNumber(commitCount).padStart(7);
  console.log(
    `  ${green("[ok]")}   ${name.padEnd(nameWidth)}   ${action.padEnd(7)}  ${commits} commits`,
  );
}

function printRepoSkipped(name: string, nameWidth: number, reason: string): void {
  console.log(`  ${red("[skip]")} ${name.padEnd(nameWidth)}   ${reason}`);
}

function printContributorsTable(people: Person[]): void {
  const rankWidth = Math.max(3, String(people.length).length);
  const commitsWidth = Math.max(
    "commits".length,
    ...people.map((p) => formatNumber(p.commits).length),
  );
  const nameWidth = Math.max("name".length, ...people.map((p) => p.name.length));

  const header =
    `  ${"#".padStart(rankWidth)}  ${"commits".padStart(commitsWidth)}  ` +
    `${"name".padEnd(nameWidth)}  email`;
  console.log(dim(header));

  people.forEach((person, index) => {
    const rank = String(index + 1).padStart(rankWidth);
    const commits = formatNumber(person.commits).padStart(commitsWidth);
    const name = person.name.padEnd(nameWidth);
    console.log(`  ${rank}  ${commits}  ${name}  ${dim(person.email)}`);
  });
}

function printSummary(collection: Collection, contributorCount: number): void {
  const commits = formatNumber(collection.commits.length);
  console.log(
    `  ${contributorCount} contributors, ${commits} commits, ` +
      `${collection.scannedRepos} repos -> ${relative(ROOT, OUTPUT_PATH)}`,
  );

  const skipped = collection.skippedRepos;
  if (skipped.length > 0) {
    const noun = skipped.length === 1 ? "repo" : "repos";
    console.log(`  ${yellow("[warn]")} ${skipped.length} ${noun} skipped: ${skipped.join(", ")}`);
  }
}

// ---------------------------------------------------------------------------
// Startup: options and token
// ---------------------------------------------------------------------------

function readOptions(): Options {
  const { values } = parseArgs({
    options: {
      org: { type: "string", default: DEFAULT_ORG },
      cache: { type: "string", default: DEFAULT_CACHE_DIR },
    },
  });
  return { org: values.org!, cacheDir: resolve(values.cache!) };
}

function requireGithubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error(
      "GITHUB_TOKEN is not set.\n" +
        "Copy .env.example to .env and fill it in (Bun loads .env automatically),\n" +
        "or run: GITHUB_TOKEN=$(gh auth token) bun scripts/generate-contributors.ts",
    );
    process.exit(1);
  }
  return token;
}

// ---------------------------------------------------------------------------
// GitHub: which repos to scan
// ---------------------------------------------------------------------------

/** Shape of the fields we use from GitHub's "list organization repositories" response. */
interface ApiRepo {
  name: string;
  clone_url: string;
  default_branch: string;
  fork: boolean;
}

/**
 * Public, non-fork repos of the org.
 * Forks are skipped because their history contains the upstream authors,
 * who are not contributors to this org.
 * Any API failure throws, so we never overwrite good data with an empty list.
 */
async function listRepos(org: string, token: string): Promise<Repo[]> {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "generate-contributors",
  };

  const repos: Repo[] = [];
  for (let page = 1; ; page++) {
    const url = `https://api.github.com/orgs/${org}/repos?type=public&per_page=100&page=${page}`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(
        `GitHub API request failed (${response.status} ${response.statusText}) for ${url}\n${await response.text()}`,
      );
    }

    const batch = (await response.json()) as ApiRepo[];
    if (batch.length === 0) return repos; // an empty page means we have seen everything

    for (const repo of batch) {
      if (repo.fork) continue;
      repos.push({
        name: repo.name,
        cloneUrl: repo.clone_url,
        defaultBranch: repo.default_branch,
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Git: getting commits out of each repo
// ---------------------------------------------------------------------------

/** Runs git with our central mailmap applied. Throws if git exits with an error. */
async function git(args: string[]): Promise<string> {
  const gitArgs = ["-c", `mailmap.file=${MAILMAP_PATH}`, ...args];
  return await $`git ${gitArgs}`.quiet().text();
}

/**
 * Makes sure a bare clone of the repo exists in the cache and is up to date.
 * "Bare" means no files are checked out, and "blob:none" skips file contents.
 * What remains is just the commit history, which is all we need.
 */
async function syncRepo(repo: Repo, repoPath: string): Promise<"cloned" | "updated"> {
  if (existsSync(repoPath)) {
    const allBranches = "+refs/heads/*:refs/heads/*";
    await git(["-C", repoPath, "fetch", "--quiet", "--prune", "origin", allBranches]);
    return "updated";
  }

  await mkdir(dirname(repoPath), { recursive: true });
  await git(["clone", "--bare", "--quiet", "--filter=blob:none", repo.cloneUrl, repoPath]);
  return "cloned";
}

/**
 * Every non-merge commit on the default branch, one per line:
 * hash, author name, author email (all resolved through the mailmap).
 */
async function readCommits(repo: Repo, repoPath: string): Promise<Commit[]> {
  const output = await git([
    "-C",
    repoPath,
    "log",
    `refs/heads/${repo.defaultBranch}`,
    "--no-merges",
    "--format=%H%x09%aN%x09%aE", // %aN and %aE apply the mailmap; %x09 is a tab
  ]);

  return output
    .split("\n")
    .filter((line) => line !== "")
    .map((line) => {
      const [sha, name, email] = line.split("\t");
      return { sha, name, email: email.toLowerCase() };
    });
}

/**
 * Reads the commits of every repo, printing one line per repo.
 * A repo that fails (network error, empty repo, ...) is skipped with a
 * printed reason instead of stopping the run.
 * The same commit found in several repos is kept once.
 */
async function collectCommits(repos: Repo[], cacheDir: string): Promise<Collection> {
  const commitsBySha = new Map<string, Commit>();
  const skippedRepos: string[] = [];
  let scannedRepos = 0;
  const nameWidth = Math.max(0, ...repos.map((repo) => repo.name.length));

  for (const repo of repos) {
    const repoPath = join(cacheDir, `${repo.name}.git`);
    try {
      const action = await syncRepo(repo, repoPath);
      const commits = await readCommits(repo, repoPath);
      for (const commit of commits) {
        commitsBySha.set(commit.sha, commit);
      }
      scannedRepos++;
      printRepoDone(repo.name, nameWidth, action, commits.length);
    } catch (error) {
      skippedRepos.push(repo.name);
      printRepoSkipped(repo.name, nameWidth, firstLine(describeError(error)));
    }
  }

  return { commits: [...commitsBySha.values()], scannedRepos, skippedRepos };
}

function describeError(error: unknown): string {
  if (error instanceof $.ShellError) {
    return error.stderr.toString().trim() || error.message;
  }
  return error instanceof Error ? error.message : String(error);
}

function firstLine(text: string): string {
  return text.split("\n")[0];
}

// ---------------------------------------------------------------------------
// Counting: commits -> people (pure functions, no I/O)
// ---------------------------------------------------------------------------

/**
 * One person = one email. If that email appears under several spellings of a
 * name, the most common spelling is shown. Result is sorted by commits.
 */
function countPeople(commits: Commit[]): Person[] {
  const nameCountsByEmail = new Map<string, Map<string, number>>();

  for (const { name, email } of commits) {
    const nameCounts = nameCountsByEmail.get(email) ?? new Map<string, number>();
    nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1);
    nameCountsByEmail.set(email, nameCounts);
  }

  const people: Person[] = [];
  for (const [email, nameCounts] of nameCountsByEmail) {
    const names = [...nameCounts.entries()].sort(
      ([nameA, countA], [nameB, countB]) => countB - countA || nameA.localeCompare(nameB),
    );
    const totalCommits = names.reduce((sum, [, count]) => sum + count, 0);
    people.push({ name: names[0][0], email, commits: totalCommits });
  }

  return people.sort((a, b) => b.commits - a.commits || a.name.localeCompare(b.name));
}

/**
 * The same name under different emails usually means a missing mailmap rule.
 * Returns lines to print, with ready-to-paste .mailmap entries (it never
 * merges anyone by itself, because two real people can share a name).
 * Expects `people` sorted by commits, so the busiest email is the "main" one.
 */
function suggestMailmapLines(people: Person[]): string[] {
  const peopleByName = new Map<string, Person[]>();
  for (const person of people) {
    const key = person.name.toLowerCase();
    peopleByName.set(key, [...(peopleByName.get(key) ?? []), person]);
  }

  const lines: string[] = [];
  for (const group of peopleByName.values()) {
    if (group.length < 2) continue;
    const [main, ...others] = group;
    lines.push(`  "${main.name}" is used with ${group.length} emails. Add to .mailmap:`);
    for (const other of others) {
      lines.push(`    ${main.name} <${main.email}> ${other.name} <${other.email}>`);
    }
  }
  return lines;
}

/** Drops the email: this is the only shape that is ever written to disk. */
function toContributors(people: Person[]): Contributor[] {
  return people.map(({ name, commits }) => ({ name, commits }));
}

// ---------------------------------------------------------------------------
// Output file
// ---------------------------------------------------------------------------

async function writeOutput(collection: Collection, contributors: Contributor[]): Promise<void> {
  const output = {
    updatedAt: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    repositories: collection.scannedRepos,
    contributors,
  };

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf-8");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const { org, cacheDir } = readOptions();
  const token = requireGithubToken();

  printTitle(`${org} contributors`);
  if (!existsSync(MAILMAP_PATH)) {
    console.log(
      `${yellow("[warn]")} No mailmap found at ${relative(ROOT, MAILMAP_PATH)}: ` +
        "names and emails will not be merged.",
    );
  }

  const repos = await listRepos(org, token);

  printHeading("Repos");
  const collection = await collectCommits(repos, cacheDir);

  const people = countPeople(collection.commits);
  const contributors = toContributors(people);
  await writeOutput(collection, contributors);

  printHeading("Contributors");
  printContributorsTable(people);

  const suggestions = suggestMailmapLines(people);
  if (suggestions.length > 0) {
    printHeading("Possible duplicates (same name, different emails)");
    for (const line of suggestions) console.log(line);
  }

  printHeading("Done");
  printSummary(collection, contributors.length);
}

main().catch((error) => {
  console.error(describeError(error));
  process.exit(1);
});

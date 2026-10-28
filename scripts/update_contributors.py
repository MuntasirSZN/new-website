#!/usr/bin/env python3
"""Collect all-time contributors across a GitHub organization.

Usage: python3 scripts/update_contributors.py [--org OpenBangla] [--cache DIR]

Lists the org's public, non-fork repos through the GitHub API, keeps a
lightweight bare clone of each in a cache folder (created on first run,
updated on later runs), and counts non-merge commits on every repo's default
branch. Commits are de-duplicated by hash, names are merged with
scripts/contributors.mailmap, and the result goes to data/contributors.json.
Emails are used for grouping only and never written out.

Set GITHUB_TOKEN to raise the API rate limit (optional).
"""

import argparse
import json
import os
import subprocess
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAILMAP = ROOT / "scripts" / "contributors.mailmap"
OUT = ROOT / "src" / "data" / "contributors.json"
DEFAULT_CACHE = ROOT / ".cache" / "contributors"  # add ".cache/" to .gitignore


def git(repo: Path, *args: str) -> str:
    cmd = ["git", "-C", str(repo), "-c", f"mailmap.file={MAILMAP}", *args]
    return subprocess.run(
        cmd, check=True, capture_output=True, text=True, encoding="utf-8"
    ).stdout


def list_repos(org: str) -> list[dict]:
    """Public, non-fork repos of the org (forks would import upstream authors)."""
    headers = {"User-Agent": "update-contributors"}
    if token := os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {token}"

    repos, page = [], 1
    while True:
        url = f"https://api.github.com/orgs/{org}/repos?per_page=100&page={page}"
        with urllib.request.urlopen(
            urllib.request.Request(url, headers=headers)
        ) as resp:
            batch = json.load(resp)
        if not batch:
            return repos
        repos += [r for r in batch if not r["fork"]]
        page += 1


def sync(path: Path, clone_url: str) -> None:
    if path.exists():
        git(path, "fetch", "--quiet", "--prune", "origin", "+refs/heads/*:refs/heads/*")
    else:
        path.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [
                "git",
                "clone",
                "--bare",
                "--quiet",
                "--filter=blob:none",
                clone_url,
                str(path),
            ],
            check=True,
            capture_output=True,
            text=True,
        )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--org", default="OpenBangla")
    parser.add_argument("--cache", type=Path, default=DEFAULT_CACHE)
    args = parser.parse_args()

    authors: dict[str, tuple[str, str]] = {}  # commit hash -> (name, email)
    scanned = 0

    for repo in list_repos(args.org):
        name = repo["name"]
        try:
            path = args.cache / f"{name}.git"
            sync(path, repo["clone_url"])
            log = git(
                path,
                "log",
                f"refs/heads/{repo['default_branch']}",
                "--no-merges",
                "--format=%H%x09%aN%x09%aE",
            )
        except subprocess.CalledProcessError as e:
            print(f"skip  {name}: {(e.stderr or '').strip()}")
            continue
        for line in log.splitlines():
            sha, author, email = line.split("\t")
            authors[sha] = (author, email.lower())
        scanned += 1
        print(f"ok    {name}")

    # One person = one (mailmap-resolved) email; show their most common name.
    names_by_email: dict[str, Counter] = defaultdict(Counter)
    for author, email in authors.values():
        names_by_email[email][author] += 1

    people = [
        {
            "name": names.most_common(1)[0][0],
            "commits": sum(names.values()),
            "email": email,
        }
        for email, names in names_by_email.items()
    ]
    people.sort(key=lambda p: (-p["commits"], p["name"]))

    # The same name under different emails usually means a missing mailmap rule.
    by_name: dict[str, list[dict]] = defaultdict(list)
    for p in people:
        by_name[p["name"].lower()].append(p)
    for group in by_name.values():
        if len(group) > 1:
            main_p, *others = group
            print(
                f'dup?  "{main_p["name"]}" is used with {len(group)} emails; suggested mailmap lines:'
            )
            for o in others:
                print(
                    f'      {main_p["name"]} <{main_p["email"]}> {o["name"]} <{o["email"]}>'
                )

    contributors = [{"name": p["name"], "commits": p["commits"]} for p in people]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "updatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                "repositories": scanned,
                "contributors": contributors,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )
    print(
        f"\n{len(contributors)} contributors, {len(authors)} commits, {scanned} repos -> {OUT}"
    )


if __name__ == "__main__":
    main()

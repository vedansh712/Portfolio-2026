import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import type { ActivityDay, TILPost, LastCommit } from "../../types/activity";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const GITHUB_USERNAME = "vedansh712";

// ── GRAPHQL QUERY ─────────────────────────────────────────────────────────────
const QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
      repositories(
        first: 10
        orderBy: { field: PUSHED_AT, direction: DESC }
        isFork: false
        privacy: PUBLIC
      ) {
        nodes {
          name
          pushedAt
          defaultBranchRef {
            target {
              ... on Commit {
                message
                committedDate
              }
            }
          }
        }
      }
    }
  }
`;

// ── ROUTE HANDLER ─────────────────────────────────────────────────────────────
export const dynamic = "force-dynamic";

export async function GET() {
    // 1. Load TIL data from file system (server-side, safe)
    let tilData: TILPost[] = [];
    try {
        const raw = readFileSync(join(process.cwd(), "data", "til.json"), "utf-8");
        tilData = JSON.parse(raw);
    } catch {
        // data/til.json missing — return empty array, client falls back to mock
    }

    // 2. If no token, skip GitHub and return TIL only
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return NextResponse.json({
            github: null,   // null → client uses deterministic mock data
            tils: tilData,
            lastCommit: null,
        });
    }

    // 3. Build date range — last 28 days
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 28);

    // 4. Hit GitHub GraphQL API
    try {
        const res = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "User-Agent": "vedansh-portfolio",
            },
            body: JSON.stringify({
                query: QUERY,
                variables: {
                    login: GITHUB_USERNAME,
                    from: from.toISOString(),
                    to: to.toISOString(),
                },
            }),
        });

        if (!res.ok) {
            return NextResponse.json({ github: null, tils: tilData, lastCommit: null });
        }

        const json = await res.json();

        // Surface any GraphQL-level errors and fall back gracefully
        if (json.errors || !json.data?.user) {
            console.error("[/api/activity] GitHub GraphQL error:", JSON.stringify(json.errors));
            return NextResponse.json({ github: null, tils: tilData, lastCommit: null });
        }

        const user = json.data.user;

        // 5. Parse contribution calendar into ActivityDay[]
        const weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number }> }> =
            user.contributionsCollection?.contributionCalendar?.weeks ?? [];

        const github: ActivityDay[] = weeks.flatMap((w) =>
            w.contributionDays.map((d) => ({
                date: d.date,
                commitCount: d.contributionCount,
            }))
        );

        // 6. Extract last commit — first repo with a valid commit target
        const repos: Array<{
            name: string;
            pushedAt: string;
            defaultBranchRef?: { target?: { message?: string; committedDate?: string } };
        }> = user.repositories?.nodes ?? [];

        let lastCommit: LastCommit | null = null;
        for (const repo of repos) {
            const target = repo.defaultBranchRef?.target;
            if (target?.message && target?.committedDate) {
                lastCommit = {
                    // Only the first line of the commit message, capped at 72 chars
                    message: target.message.split("\n")[0].slice(0, 72),
                    repo: repo.name,
                    date: target.committedDate,
                };
                break;
            }
        }

        return NextResponse.json({ github, tils: tilData, lastCommit });
    } catch (err) {
        console.error("[/api/activity] fetch failed:", err);
        return NextResponse.json({ github: null, tils: tilData, lastCommit: null });
    }
}

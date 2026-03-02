import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import type { ActivityDay, TILPost, LastCommit } from "../../types/activity";

const GITHUB_USERNAME = "vedansh712";

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

export const dynamic = "force-dynamic";

export async function GET() {
    let tilData: TILPost[] = [];
    try {
        const raw = readFileSync(join(process.cwd(), "data", "til.json"), "utf-8");
        tilData = JSON.parse(raw);
    } catch {
        // data/til.json missing — client falls back to mock
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return NextResponse.json({ github: null, tils: tilData, lastCommit: null });
    }

    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 28);

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
                variables: { login: GITHUB_USERNAME, from: from.toISOString(), to: to.toISOString() },
            }),
        });

        if (!res.ok) return NextResponse.json({ github: null, tils: tilData, lastCommit: null });

        const json = await res.json();
        if (json.errors || !json.data?.user) {
            console.error("[/api/activity] GraphQL error:", JSON.stringify(json.errors));
            return NextResponse.json({ github: null, tils: tilData, lastCommit: null });
        }

        const user = json.data.user;
        const weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number }> }> =
            user.contributionsCollection?.contributionCalendar?.weeks ?? [];

        const github: ActivityDay[] = weeks.flatMap((w) =>
            w.contributionDays.map((d) => ({ date: d.date, commitCount: d.contributionCount }))
        );

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

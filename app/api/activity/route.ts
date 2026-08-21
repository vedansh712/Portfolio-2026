import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import type {
    ActivityDay,
    TILPost,
    LastCommit,
    RepoActivity,
    WindowActivity,
    RepoActivityWindows,
} from "../../types/activity";

const GITHUB_USERNAME = "vedansh712";

/**
 * `week` and `month` are aliased contributionsCollection calls over different
 * windows, so the compact (7-day) and expanded (28-day) views of the activity
 * panel each get a matching repo breakdown from a single round-trip.
 *
 * commitContributionsByRepository only names repositories the token may see.
 * Commits to private repos still count toward the calendar but arrive as the
 * anonymous `restrictedContributionsCount`, so both are read.
 */
const QUERY = `
  query($login: String!, $weekFrom: DateTime!, $monthFrom: DateTime!, $historySince: GitTimestamp!, $to: DateTime!) {
    user(login: $login) {
      month: contributionsCollection(from: $monthFrom, to: $to) {
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
        ...repoBreakdown
      }
      week: contributionsCollection(from: $weekFrom, to: $to) {
        restrictedContributionsCount
        ...repoBreakdown
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
                history(first: 20, since: $historySince) {
                  nodes {
                    messageHeadline
                    committedDate
                    parents { totalCount }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  fragment repoBreakdown on ContributionsCollection {
    commitContributionsByRepository(maxRepositories: 10) {
      contributions(first: 1, orderBy: { field: OCCURRED_AT, direction: DESC }) {
        totalCount
        nodes { occurredAt }
      }
      repository {
        name
        nameWithOwner
        url
      }
    }
  }
`;

export const dynamic = "force-dynamic";

type RawRepoContribution = {
    contributions: { totalCount: number; nodes: Array<{ occurredAt: string }> };
    repository: { name: string; nameWithOwner: string; url: string };
};

const EMPTY_WINDOW: WindowActivity = { repos: [], privateCommits: 0, total: 0 };

function toWindow(raw: {
    restrictedContributionsCount?: number;
    commitContributionsByRepository?: RawRepoContribution[];
} | undefined): WindowActivity {
    if (!raw) return EMPTY_WINDOW;

    const repos: RepoActivity[] = (raw.commitContributionsByRepository ?? [])
        .map((entry) => ({
            repo: entry.repository.nameWithOwner,
            name: entry.repository.name,
            url: entry.repository.url,
            commits: entry.contributions.totalCount,
            // Filled in from the repo history below, window-scoped.
            lastMessage: "",
            lastDate: entry.contributions.nodes[0]?.occurredAt ?? "",
        }))
        .filter((r) => r.commits > 0)
        .sort((a, b) => b.commits - a.commits);

    const privateCommits = raw.restrictedContributionsCount ?? 0;
    return {
        repos,
        privateCommits,
        total: repos.reduce((sum, r) => sum + r.commits, 0) + privateCommits,
    };
}

export async function GET() {
    let tilData: TILPost[] = [];
    try {
        const raw = readFileSync(join(process.cwd(), "data", "til.json"), "utf-8");
        tilData = JSON.parse(raw);
    } catch {
        // data/til.json missing — client falls back to mock
    }

    const empty = {
        github: null,
        tils: tilData,
        lastCommit: null,
        repoActivity: null as RepoActivityWindows | null,
    };

    const token = process.env.GITHUB_TOKEN?.trim();
    if (!token) {
        console.warn("[/api/activity] GITHUB_TOKEN is not set — activity feed will be empty.");
        return NextResponse.json(empty);
    }

    const to = new Date();
    const monthFrom = new Date();
    monthFrom.setDate(monthFrom.getDate() - 28);
    const weekFrom = new Date();
    weekFrom.setDate(weekFrom.getDate() - 6);
    weekFrom.setHours(0, 0, 0, 0);

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
                    weekFrom: weekFrom.toISOString(),
                    monthFrom: monthFrom.toISOString(),
                    historySince: monthFrom.toISOString(),
                    to: to.toISOString(),
                },
            }),
        });

        if (!res.ok) {
            // 401 = token invalid/revoked/expired, 403 = rate limited or scope refused
            console.error(
                `[/api/activity] GitHub responded ${res.status} ${res.statusText} —`,
                (await res.text()).slice(0, 200)
            );
            return NextResponse.json(empty);
        }

        const json = await res.json();
        if (json.errors || !json.data?.user) {
            console.error("[/api/activity] GraphQL error:", JSON.stringify(json.errors));
            return NextResponse.json(empty);
        }

        const user = json.data.user;
        const weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number }> }> =
            user.month?.contributionCalendar?.weeks ?? [];

        const github: ActivityDay[] = weeks.flatMap((w) =>
            w.contributionDays.map((d) => ({ date: d.date, commitCount: d.contributionCount }))
        );

        type HistoryNode = {
            messageHeadline: string;
            committedDate: string;
            parents: { totalCount: number };
        };
        const repos: Array<{
            name: string;
            pushedAt: string;
            defaultBranchRef?: {
                target?: {
                    message?: string;
                    committedDate?: string;
                    history?: { nodes?: HistoryNode[] };
                };
            };
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

        // Newest real commit per repo inside a window. Merge commits are skipped
        // — "Merge pull request #1 from ..." says nothing about what was built.
        const historyByRepo = new Map<string, HistoryNode[]>(
            repos.map((r) => [r.name, r.defaultBranchRef?.target?.history?.nodes ?? []])
        );
        const subjectFor = (repoName: string, since: Date): string => {
            const node = (historyByRepo.get(repoName) ?? []).find(
                (n) => n.parents.totalCount <= 1 && new Date(n.committedDate) >= since
            );
            return node ? node.messageHeadline.slice(0, 72) : "";
        };
        const withSubjects = (w: WindowActivity, since: Date): WindowActivity => ({
            ...w,
            repos: w.repos.map((r) => ({ ...r, lastMessage: subjectFor(r.name, since) })),
        });

        const repoActivity: RepoActivityWindows = {
            week: withSubjects(toWindow(user.week), weekFrom),
            month: withSubjects(toWindow(user.month), monthFrom),
        };

        return NextResponse.json({ github, tils: tilData, lastCommit, repoActivity });
    } catch (err) {
        console.error("[/api/activity] fetch failed:", err);
        return NextResponse.json(empty);
    }
}

"use client";

import { useState, useEffect } from "react";
import type { ActivityDay, TILPost, LastCommit } from "../types/activity";
import { mockGithubData, mockTILPosts } from "../lib/mockActivity";

export type ActivityState = {
    githubData: ActivityDay[];
    tilData: TILPost[];
    lastCommit: LastCommit | null;
    loading: boolean;
};

/**
 * Fetches real GitHub + TIL data from /api/activity.
 * Automatically falls back to deterministic mock data if:
 *  - GITHUB_TOKEN is not set (server returns null)
 *  - The API request fails for any reason
 *
 * The hook starts in loading=true state so the ActivityFeed can
 * show a skeleton while the fetch is in-flight.
 */
export function useActivityData(): ActivityState {
    const [state, setState] = useState<ActivityState>({
        githubData: [],        // empty → shows skeleton
        tilData: [],
        lastCommit: null,
        loading: true,
    });

    useEffect(() => {
        let cancelled = false;

        fetch("/api/activity")
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((data: { github: ActivityDay[] | null; tils: TILPost[]; lastCommit: LastCommit | null }) => {
                if (cancelled) return;
                setState({
                    // If no GitHub token, server returns null → use mock
                    githubData: data.github ?? mockGithubData,
                    tilData: data.tils?.length ? data.tils : mockTILPosts,
                    lastCommit: data.lastCommit ?? null,
                    loading: false,
                });
            })
            .catch(() => {
                if (cancelled) return;
                // Any network failure → silent fallback to mock
                setState({
                    githubData: mockGithubData,
                    tilData: mockTILPosts,
                    lastCommit: null,
                    loading: false,
                });
            });

        return () => { cancelled = true; };
    }, []); // runs once on mount

    return state;
}

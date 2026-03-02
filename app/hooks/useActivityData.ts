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

export function useActivityData(): ActivityState {
    const [state, setState] = useState<ActivityState>({
        githubData: [],
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
                    githubData: data.github ?? mockGithubData,
                    tilData: data.tils?.length ? data.tils : mockTILPosts,
                    lastCommit: data.lastCommit ?? null,
                    loading: false,
                });
            })
            .catch(() => {
                if (cancelled) return;
                setState({
                    githubData: mockGithubData,
                    tilData: mockTILPosts,
                    lastCommit: null,
                    loading: false,
                });
            });

        return () => { cancelled = true; };
    }, []);

    return state;
}

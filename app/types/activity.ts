export type ActivityDay = {
    date: string;        // "YYYY-MM-DD"
    commitCount: number; // from GitHub API
};

export type TILPost = {
    date: string;        // "YYYY-MM-DD"
    title: string;
    url?: string;
};

export type DayCell = {
    date: string;
    commits: number;
    tils: number;
    total: number;       // commits + tils
    type: "commit" | "til" | "both" | "empty";
};

/** Real last commit info — populated when GITHUB_TOKEN is set */
export type LastCommit = {
    message: string;   // first line of commit message, max 72 chars
    repo: string;      // repository name
    date: string;      // ISO 8601 string (committedDate)
};

/** One repository worked on inside a time window. */
export type RepoActivity = {
    repo: string;      // "owner/name"
    name: string;      // short name
    url: string;
    commits: number;   // your commits in the window
    lastMessage: string; // most recent commit subject in the window ("" if unavailable)
    lastDate: string;    // ISO 8601 ("" if unavailable)
};

/**
 * What was worked on during a window.
 *
 * `privateCommits` is GitHub's `restrictedContributionsCount`: commits to
 * private repos that count toward the graph but which a read:user token is
 * not allowed to attribute to a named repository. Surfacing the number keeps
 * a busy private week from rendering as an empty list.
 */
export type WindowActivity = {
    repos: RepoActivity[];
    privateCommits: number;
    total: number;
};

export type RepoActivityWindows = {
    week: WindowActivity;
    month: WindowActivity;
};

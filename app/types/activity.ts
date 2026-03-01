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

import type { ActivityDay, TILPost } from "../types/activity";

function generateMockData(days: number): ActivityDay[] {
    const result: ActivityDay[] = [];
    const today = new Date();

    // Deterministic hash so same day always gets same commitCount (no re-randomisation)
    const hash = (s: string): number => {
        let h = 0;
        for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
        return (h >>> 0) / 4294967295;
    };

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const rnd = hash(dateStr);
        const threshold = isWeekend ? 0.80 : 0.68;
        const commitCount = rnd < threshold ? 0 : Math.floor(hash(dateStr + "c") * 6) + 1;
        result.push({ date: dateStr, commitCount });
    }
    return result;
}

// ── STABLE MODULE-LEVEL CONSTANTS ───────────────────────────────────────────
// Generated once at module-load, never re-randomises between renders.
export const mockGithubData: ActivityDay[] = generateMockData(28);
export function getMockActivityData(days: number) { return generateMockData(days); }

const _today = new Date();
const _off = (n: number) => {
    const d = new Date(_today);
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
};

export const mockTILPosts: TILPost[] = [
    { date: _off(1), title: "Learned how PostgreSQL EXPLAIN ANALYZE reveals query plans" },
    { date: _off(3), title: "Discovered CSS :has() selector for parent targeting" },
    { date: _off(7), title: "React useTransition keeps UI responsive during heavy updates" },
    { date: _off(9), title: "OpenAI token limits and chunking for long prompts" },
    { date: _off(14), title: "Docker multi-stage builds cut image size by 60%" },
    { date: _off(18), title: "Git bisect automates finding the breaking commit" },
    { date: _off(22), title: "AWS IAM policy simulator catches permission issues before deploy" },
    { date: _off(27), title: "Redis EXPIRE keys are crucial for session management at scale" },
];

/* ══════════════════════════════════════════════════════════
   HIGH SCORES — arcade cabinet table, kept in localStorage
══════════════════════════════════════════════════════════ */

export type ScoreRow = { initials: string; score: number; level: number; at: number };

const KEY = "vedansh.thefeed.scores";
export const TABLE_SIZE = 5;

/**
 * localStorage throws in private windows and when site data is blocked, and can
 * hold anything a previous version wrote — so every read is defensive and a bad
 * payload degrades to an empty table rather than breaking the game over screen.
 */
export function loadScores(): ScoreRow[] {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return [];
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter(
                (r): r is ScoreRow =>
                    !!r && typeof r === "object" &&
                    typeof (r as ScoreRow).initials === "string" &&
                    Number.isFinite((r as ScoreRow).score)
            )
            .map((r) => ({
                initials: r.initials.slice(0, 3).toUpperCase(),
                score: Math.max(0, Math.floor(r.score)),
                level: Number.isFinite(r.level) ? r.level : 1,
                at: Number.isFinite(r.at) ? r.at : 0,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, TABLE_SIZE);
    } catch {
        return [];
    }
}

export function saveScore(row: ScoreRow): ScoreRow[] {
    const next = [...loadScores(), row]
        .sort((a, b) => b.score - a.score)
        .slice(0, TABLE_SIZE);
    try {
        localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
        // Nothing to do — the table just will not persist this session.
    }
    return next;
}

/** Does this score earn a place, and therefore an initials prompt? */
export function qualifies(score: number): boolean {
    if (score <= 0) return false;
    const rows = loadScores();
    return rows.length < TABLE_SIZE || score > rows[rows.length - 1].score;
}

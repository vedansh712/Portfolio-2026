"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { ActivityDay, TILPost, DayCell, LastCommit, RepoActivityWindows, WindowActivity } from "../types/activity";

/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */
export type Theme = "amber" | "modern";
export type FeedMode = "compact" | "full";

/* ══════════════════════════════════════════════════════════
   COLOUR TOKENS
   Amber  : commit = orange top-half, TIL = orange bottom-half, both = green
   Modern : commit = cyan top-half,   TIL = emerald bottom-half, both = emerald
══════════════════════════════════════════════════════════ */
const C = {
    amber: {
        commit: "#ff9500",
        til: "#ff9500",
        both: "#22c55e",
        empty: "#140a00",
        skeleton: "#2a1500",
        tooltipBg: "#1a0e00",
        tooltipBorder: "rgba(255,149,0,0.32)",
        tooltipText: "#ff9500",
        label: "rgba(255,149,0,0.35)",
        sub: "rgba(255,149,0,0.42)",
        sep: "rgba(255,149,0,0.12)",
        dow: "rgba(255,149,0,0.28)",
        pfxPush: "> LAST PUSH:",
        pfxTIL: "> LAST TIL:",
    },
    modern: {
        commit: "#22d3ee",
        til: "#34d399",
        both: "#34d399",
        empty: "#0d0d18",
        skeleton: "#161628",
        tooltipBg: "#0d0d18",
        tooltipBorder: "rgba(255,255,255,0.12)",
        tooltipText: "#e2e8f0",
        label: "rgba(255,255,255,0.25)",
        sub: "rgba(255,255,255,0.32)",
        sep: "rgba(255,255,255,0.07)",
        dow: "rgba(255,255,255,0.22)",
        pfxPush: "last push ·",
        pfxTIL: "last til ·",
    },
} as const;

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
function hexRgba(hex: string, a: number) {
    const n = parseInt(hex.replace("#", ""), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function intensityAlpha(total: number) {
    if (total === 0) return 0;
    if (total === 1) return 0.30;
    if (total <= 3) return 0.65;
    return 1;
}

function cellBg(cell: DayCell, theme: Theme): string {
    const t = C[theme];
    const a = intensityAlpha(cell.total);
    switch (cell.type) {
        case "empty": return t.empty;
        case "both": return hexRgba(t.both, a);
        case "commit":
            return `linear-gradient(to bottom, ${hexRgba(t.commit, a)} 50%, ${t.empty} 50%)`;
        case "til":
            return `linear-gradient(to bottom, ${t.empty} 50%, ${hexRgba(t.til, a)} 50%)`;
    }
}

function buildCells(githubData: ActivityDay[], tilData: TILPost[]): DayCell[] {
    const tilMap: Record<string, number> = {};
    tilData.forEach((t) => { tilMap[t.date] = (tilMap[t.date] || 0) + 1; });
    return githubData.map((d) => {
        const commits = d.commitCount;
        const tils = tilMap[d.date] || 0;
        const total = commits + tils;
        let type: DayCell["type"] = "empty";
        if (commits > 0 && tils > 0) type = "both";
        else if (commits > 0) type = "commit";
        else if (tils > 0) type = "til";
        return { date: d.date, commits, tils, total, type };
    });
}

function fmtDate(s: string) {
    return new Date(s + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric",
    });
}
function fmtRange(a: string, b: string) {
    const f = (s: string) =>
        new Date(s + "T00:00:00").toLocaleDateString("en-US", {
            month: "short", day: "2-digit", year: "numeric",
        });
    return `${f(a)} — ${f(b)}`;
}
function relTime(s: string) {
    const ms = Date.now() - new Date(s).getTime();
    const h = Math.floor(ms / 3_600_000);
    if (h < 1) return "just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

/* ══════════════════════════════════════════════════════════
   TOOLTIP
══════════════════════════════════════════════════════════ */
type TipState = { cell: DayCell; rect: DOMRect } | null;

function Tooltip({ tip, theme, isMobile }: { tip: TipState; theme: Theme; isMobile: boolean }) {
    if (!tip) return null;
    const t = C[theme];
    const { cell, rect } = tip;
    const sty: React.CSSProperties = {
        position: "fixed", zIndex: 9999, pointerEvents: "none",
        background: t.tooltipBg, border: `1px solid ${t.tooltipBorder}`,
        color: t.tooltipText, fontFamily: "monospace",
        fontSize: 9, lineHeight: 1.7, padding: "4px 8px", whiteSpace: "nowrap",
    };
    if (isMobile) {
        sty.left = Math.max(4, Math.min(rect.left, window.innerWidth - 160));
        sty.top = rect.bottom + 4;
    } else {
        sty.left = Math.max(4, Math.min(rect.left + rect.width / 2, window.innerWidth - 160));
        sty.top = rect.top - 4;
        sty.transform = "translate(-50%, -100%)";
    }
    return (
        <div style={sty}>
            <div style={{ opacity: 0.6, marginBottom: 2 }}>{fmtDate(cell.date)}</div>
            {cell.total === 0 ? (
                <div style={{ opacity: 0.35 }}>No activity</div>
            ) : (
                <>
                    {cell.commits > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.commit, display: "inline-block" }} />
                            {cell.commits} commit{cell.commits !== 1 ? "s" : ""}
                        </div>
                    )}
                    {cell.tils > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.til, display: "inline-block" }} />
                            {cell.tils} TIL{cell.tils !== 1 ? "s" : ""}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   GRID CELL
══════════════════════════════════════════════════════════ */
function GridCell({
    cell, theme, size, onHover, onLeave,
}: {
    cell: DayCell; theme: Theme; size: number;
    onHover: (c: DayCell, r: DOMRect) => void;
    onLeave: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const handleEnter = useCallback(() => {
        if (ref.current) onHover(cell, ref.current.getBoundingClientRect());
    }, [cell, onHover]);
    return (
        <div
            ref={ref}
            data-day-cell=""
            data-cell-type={cell.type}
            data-cell-total={cell.total}
            style={{ width: size, height: size, flexShrink: 0, background: cellBg(cell, theme), cursor: "crosshair" }}
            onMouseEnter={handleEnter}
            onMouseLeave={onLeave}
        />
    );
}

/* ══════════════════════════════════════════════════════════
   SKELETON CELL — pulsing placeholder while loading
══════════════════════════════════════════════════════════ */
function SkeletonCell({ theme, size, delay }: { theme: Theme; size: number; delay: number }) {
    return (
        <div
            style={{
                width: size, height: size, flexShrink: 0,
                background: C[theme].skeleton,
                animation: `activityPulse 1.6s ease-in-out ${delay}ms infinite`,
            }}
        />
    );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
const DOW = ["M", "T", "W", "T", "F", "S", "S"];
const COMPACT_COUNT = 7;
const FULL_COUNT = 28;

export function ActivityFeed({
    theme,
    githubData,
    tilData,
    mode = "compact",
    loading = false,
    lastCommit = null,
    repoActivity = null,
}: {
    theme: Theme;
    githubData: ActivityDay[];
    tilData: TILPost[];
    mode?: FeedMode;
    loading?: boolean;
    lastCommit?: LastCommit | null;
    repoActivity?: RepoActivityWindows | null;
}) {
    const t = C[theme];
    const [isMobile, setIsMobile] = useState(false);
    const [tip, setTip] = useState<TipState>(null);

    useEffect(() => {
        // Inject keyframe animations once
        const id = "activity-feed-keyframes";
        if (!document.getElementById(id)) {
            const s = document.createElement("style");
            s.id = id;
            s.textContent = `
        @keyframes activityPulse {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 0.65; }
        }
      `;
            document.head.appendChild(s);
        }

        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const cells = buildCells(githubData, tilData);
    const displayCells = mode === "full" ? cells.slice(-FULL_COUNT) : cells.slice(-COMPACT_COUNT);
    const cellCount = mode === "full" ? FULL_COUNT : COMPACT_COUNT;

    const cellSize = mode === "full" ? (isMobile ? 16 : 20) : (isMobile ? 14 : 18);
    const gap = 3;

    // Stats
    const totalCommits = displayCells.reduce((s, c) => s + c.commits, 0);
    const totalTILs = displayCells.reduce((s, c) => s + c.tils, 0);
    const activeDays = displayCells.filter((c) => c.total > 0).length;

    const range = displayCells.length > 0
        ? fmtRange(displayCells[0].date, displayCells[displayCells.length - 1].date)
        : "Loading…";

    // Last activity (from props data — fallback if no real lastCommit)
    const lastFromData = [
        ...githubData.filter((d) => d.commitCount > 0).map((d) => ({
            date: d.date, isTil: false,
            text: `${d.commitCount} commit${d.commitCount !== 1 ? "s" : ""}`,
        })),
        ...tilData.map((d) => ({ date: d.date, isTil: true, text: d.title })),
    ].sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;

    // Repo breakdown for whichever range the grid is showing.
    const window_ = mode === "full" ? repoActivity?.month ?? null : repoActivity?.week ?? null;

    const handleHover = useCallback((c: DayCell, r: DOMRect) => setTip({ cell: c, rect: r }), []);
    const handleLeave = useCallback(() => setTip(null), []);

    const legendItem = (bg: string, label: string) => (
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ width: 8, height: 8, display: "inline-block", flexShrink: 0, background: bg }} />
            {label}
        </span>
    );

    return (
        <div style={{ fontFamily: "monospace", fontSize: 9, display: "flex", flexDirection: "column", gap: 6 }}>

            {/* Date range */}
            <div style={{ color: t.sub }}>{loading ? "Fetching activity…" : range}</div>

            {/* ── LOADING SKELETON ── */}
            {loading && mode === "compact" && (
                <div style={{ display: "flex", gap }}>
                    {Array.from({ length: COMPACT_COUNT }, (_, i) => (
                        <SkeletonCell key={i} theme={theme} size={cellSize} delay={i * 80} />
                    ))}
                </div>
            )}

            {loading && mode === "full" && (
                <div>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cellSize}px)`, gap, marginBottom: gap }}>
                        {DOW.map((d, i) => (
                            <div key={i} style={{ textAlign: "center", fontSize: 8, color: t.dow }}>{d}</div>
                        ))}
                    </div>
                    {Array.from({ length: 4 }, (_, row) => (
                        <div key={row} style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cellSize}px)`, gap, marginBottom: row < 3 ? gap : 0 }}>
                            {Array.from({ length: 7 }, (_, col) => (
                                <SkeletonCell key={col} theme={theme} size={cellSize} delay={(row * 7 + col) * 40} />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* ── WEEK STRIP (compact, loaded) ── */}
            {!loading && mode === "compact" && (
                <div style={{ display: "flex", gap }}>
                    {displayCells.map((cell) => (
                        <GridCell key={cell.date} cell={cell} theme={theme} size={cellSize} onHover={handleHover} onLeave={handleLeave} />
                    ))}
                </div>
            )}

            {/* ── MONTH GRID (full, loaded) ── */}
            {!loading && mode === "full" && (
                <div>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cellSize}px)`, gap, marginBottom: gap }}>
                        {DOW.map((d, i) => (
                            <div key={i} style={{ textAlign: "center", fontSize: 8, color: t.dow, userSelect: "none" }}>{d}</div>
                        ))}
                    </div>
                    {Array.from({ length: 4 }, (_, row) => (
                        <div key={row} style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cellSize}px)`, gap, marginBottom: row < 3 ? gap : 0 }}>
                            {displayCells.slice(row * 7, row * 7 + 7).map((cell) => (
                                <GridCell key={cell.date} cell={cell} theme={theme} size={cellSize} onHover={handleHover} onLeave={handleLeave} />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* ── LEGEND + SUMMARY ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 8, color: t.label }}>
                    {legendItem(`linear-gradient(to bottom, ${hexRgba(t.commit, 0.9)} 50%, ${t.empty} 50%)`, "commit")}
                    {legendItem(`linear-gradient(to bottom, ${t.empty} 50%, ${hexRgba(t.til, 0.9)} 50%)`, "TIL")}
                    {legendItem(hexRgba(t.both, 0.9), "both")}
                </div>
                <span style={{ color: t.sub }}>
                    {loading ? "—" : `${totalCommits}c · ${totalTILs} TIL · ${activeDays} days`}
                </span>
            </div>

            {/* ── WORKED ON ── */}
            {!loading && (
                <div style={{ borderTop: `1px solid ${t.sep}`, paddingTop: 4 }}>
                    <WorkedOn
                        theme={theme}
                        window={window_}
                        mode={mode}
                        lastCommit={lastCommit}
                        lastFromData={lastFromData}
                    />
                </div>
            )}

            {/* Loading ticker placeholder */}
            {loading && (
                <div style={{ color: t.label, borderTop: `1px solid ${t.sep}`, paddingTop: 4, opacity: 0.35 }}>
                    fetching activity…
                </div>
            )}

            {/* Tooltip (fixed-position, escapes overflow:hidden panels) */}
            <Tooltip tip={tip} theme={theme} isMobile={isMobile} />
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   WORKED ON — what the window's commits actually went into
══════════════════════════════════════════════════════════ */

function WorkedOn({
    theme,
    window: win,
    mode,
    lastCommit,
    lastFromData,
}: {
    theme: Theme;
    window: WindowActivity | null;
    mode: FeedMode;
    lastCommit: LastCommit | null;
    lastFromData: { date: string; isTil: boolean; text: string } | null;
}) {
    const t = C[theme];
    const maxRepos = mode === "full" ? 6 : 3;
    const repos = win?.repos ?? [];
    const shown = repos.slice(0, maxRepos);
    const hidden = repos.length - shown.length;
    const privateCommits = win?.privateCommits ?? 0;

    const label = mode === "full" ? "WORKED ON · 28d" : "WORKED ON · 7d";
    const ellipsis: React.CSSProperties = {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    };

    // Nothing attributable in the window — fall back to the most recent known
    // push so the panel still says something true.
    if (shown.length === 0 && privateCommits === 0) {
        return (
            <div style={{ color: t.label, ...ellipsis }}>
                {lastCommit ? (
                    <>
                        <span style={{ color: t.commit }}>{t.pfxPush}</span>
                        {" \""}
                        {lastCommit.message}
                        {"\" → "}
                        {lastCommit.repo}
                        <span style={{ opacity: 0.35 }}> · {relTime(lastCommit.date)}</span>
                    </>
                ) : lastFromData ? (
                    <>
                        <span style={{ color: lastFromData.isTil ? t.til : t.commit }}>
                            {lastFromData.isTil ? t.pfxTIL : t.pfxPush}
                        </span>{" "}
                        {lastFromData.text}
                        <span style={{ opacity: 0.35 }}>
                            {" "}· {relTime(lastFromData.date + "T12:00:00Z")}
                        </span>
                    </>
                ) : (
                    <span style={{ opacity: 0.4 }}>no activity in this range</span>
                )}
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ color: t.label, opacity: 0.5, letterSpacing: 0.5 }}>{label}</div>

            {shown.map((r) => (
                <a
                    key={r.repo}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: t.label,
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "baseline",
                        gap: 5,
                        ...ellipsis,
                    }}
                    title={r.lastMessage ? `${r.repo} — ${r.lastMessage}` : r.repo}
                >
                    <span style={{ color: t.commit, flexShrink: 0, opacity: 0.55 }}>▸</span>
                    <span style={{ color: t.commit, flexShrink: 0 }}>{r.name}</span>
                    <span style={{ opacity: 0.45, flexShrink: 0 }}>
                        {r.commits}c
                    </span>
                    {r.lastMessage && (
                        <span style={{ opacity: 0.35, ...ellipsis }}>· {r.lastMessage}</span>
                    )}
                </a>
            ))}

            {hidden > 0 && (
                <div style={{ color: t.label, opacity: 0.35 }}>
                    + {hidden} more {hidden === 1 ? "repo" : "repos"}
                </div>
            )}

            {privateCommits > 0 && (
                <div
                    style={{ color: t.label, opacity: 0.45, ...ellipsis }}
                    title="Commits to private repositories. They count toward the contribution graph, but GitHub does not disclose which repository they belong to."
                >
                    <span style={{ opacity: 0.6 }}>◆</span> {privateCommits} private{" "}
                    {privateCommits === 1 ? "contribution" : "contributions"}
                    <span style={{ opacity: 0.6 }}> · repos undisclosed</span>
                </div>
            )}
        </div>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { loadScores, saveScore, qualifies, type ScoreRow } from "./scores";

const AMBER = "#ff9500";

/**
 * Arcade end screen: initials entry when the score places, then the table.
 *
 * Keyboard entry is deliberately cabinet-like (type three letters), but a real
 * input is used underneath so mobile raises a keyboard and paste/IME work.
 */
export function EndScreen({
    outcome,
    score,
    level,
    onRestart,
    onExit,
}: {
    outcome: "gameover" | "victory";
    score: number;
    level: number;
    onRestart: () => void;
    onExit: () => void;
}) {
    const [placing, setPlacing] = useState(() => qualifies(score));
    const [initials, setInitials] = useState("");
    const [rows, setRows] = useState<ScoreRow[]>(() => (qualifies(score) ? [] : loadScores()));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (placing) inputRef.current?.focus();
    }, [placing]);

    const submit = () => {
        const tag = (initials.trim() || "AAA").toUpperCase().slice(0, 3).padEnd(3, "A");
        setRows(saveScore({ initials: tag, score, level, at: Date.now() }));
        setPlacing(false);
    };

    const won = outcome === "victory";

    return (
        <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
                className="w-full max-w-xs text-center px-5 py-5 border bg-black/85"
                style={{ fontFamily: "monospace", color: AMBER, borderColor: "rgba(255,149,0,0.4)" }}
            >
                <div className="text-lg font-bold tracking-widest mb-1">
                    {won ? "PORTFOLIO CLEARED" : "GAME OVER"}
                </div>
                <div className="text-[10px] opacity-60 mb-3">
                    {won ? "every panel destroyed" : `reached level ${level}`}
                </div>
                <div className="text-2xl font-bold tabular-nums mb-4">{score.toLocaleString()}</div>

                {placing ? (
                    <form
                        onSubmit={(e) => { e.preventDefault(); submit(); }}
                        className="mb-1"
                    >
                        <div className="text-[10px] tracking-wider opacity-70 mb-2">
                            NEW HIGH SCORE — ENTER INITIALS
                        </div>
                        <input
                            ref={inputRef}
                            value={initials}
                            onChange={(e) =>
                                setInitials(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3))
                            }
                            maxLength={3}
                            inputMode="text"
                            autoComplete="off"
                            spellCheck={false}
                            aria-label="Your initials"
                            className="w-28 text-center text-2xl tracking-[0.5em] bg-transparent border-b-2 outline-none py-1 mb-3"
                            style={{ color: AMBER, borderColor: "rgba(255,149,0,0.45)", caretColor: AMBER }}
                        />
                        <div>
                            <button
                                type="submit"
                                className="text-[10px] tracking-wider px-3 py-1 border cursor-pointer hover:bg-amber-500/15"
                                style={{ borderColor: "rgba(255,149,0,0.4)" }}
                            >
                                [ENTER] SUBMIT
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {rows.length > 0 && (
                            <div className="mb-4 text-left">
                                <div className="text-[9px] tracking-wider opacity-50 mb-1.5 text-center">
                                    HIGH SCORES
                                </div>
                                {rows.map((r, i) => (
                                    <div
                                        key={`${r.at}-${i}`}
                                        className="flex justify-between text-[11px] py-0.5"
                                        style={{ opacity: r.score === score ? 1 : 0.6 }}
                                    >
                                        <span>{i + 1}. {r.initials}</span>
                                        <span className="tabular-nums">{r.score.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={onRestart}
                                className="text-[10px] tracking-wider px-3 py-1 border cursor-pointer hover:bg-amber-500/15"
                                style={{ borderColor: "rgba(255,149,0,0.4)" }}
                            >
                                PLAY AGAIN
                            </button>
                            <button
                                onClick={onExit}
                                className="text-[10px] tracking-wider px-3 py-1 border cursor-pointer hover:bg-amber-500/15"
                                style={{ borderColor: "rgba(255,149,0,0.25)", opacity: 0.75 }}
                            >
                                [ESC] RETURN
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

"use client";

import { useCallback } from "react";

const AMBER = "#ff9500";

/**
 * On-screen controls for touch devices.
 *
 * Buttons drive the same key map the keyboard fills, so the loop has one input
 * path. Pointer events (not click) so holding thrust actually holds, and
 * onPointerLeave/Cancel release — a finger sliding off a button must not leave
 * the ship thrusting forever.
 */
export function TouchControls({
    onHold,
    onHyper,
    onPause,
}: {
    onHold: (key: string, down: boolean) => void;
    onHyper: () => void;
    onPause: () => void;
}) {
    const hold = useCallback(
        (key: string) => ({
            onPointerDown: (e: React.PointerEvent) => {
                e.preventDefault();
                e.stopPropagation();
                onHold(key, true);
            },
            onPointerUp: (e: React.PointerEvent) => { e.preventDefault(); onHold(key, false); },
            onPointerLeave: () => onHold(key, false),
            onPointerCancel: () => onHold(key, false),
        }),
        [onHold]
    );

    const base =
        "select-none flex items-center justify-center border active:bg-amber-500/25 " +
        "text-[15px] font-bold";
    const style = {
        color: AMBER,
        borderColor: "rgba(255,149,0,0.38)",
        background: "rgba(10,8,4,0.6)",
        fontFamily: "monospace",
        touchAction: "none" as const,
        WebkitUserSelect: "none" as const,
        userSelect: "none" as const,
    };

    return (
        <div
            className="absolute left-0 right-0 z-10 flex items-end justify-between px-4 md:hidden"
            style={{ bottom: "max(14px, env(safe-area-inset-bottom))", touchAction: "none" }}
        >
            {/* rotate */}
            <div className="flex gap-2">
                <button aria-label="Rotate left" className={`${base} w-14 h-14 rounded-full`} style={style} {...hold("ArrowLeft")}>◀</button>
                <button aria-label="Rotate right" className={`${base} w-14 h-14 rounded-full`} style={style} {...hold("ArrowRight")}>▶</button>
            </div>

            {/* secondary */}
            <div className="flex flex-col gap-2 items-center">
                <button
                    aria-label="Hyperspace"
                    className={`${base} px-2.5 h-8 rounded-sm text-[9px] tracking-wider`}
                    style={style}
                    onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onHyper(); }}
                >HYPER</button>
                <button
                    aria-label="Pause"
                    className={`${base} px-2.5 h-8 rounded-sm text-[9px] tracking-wider`}
                    style={style}
                    onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onPause(); }}
                >PAUSE</button>
            </div>

            {/* thrust + fire */}
            <div className="flex gap-2">
                <button aria-label="Thrust" className={`${base} w-14 h-14 rounded-full`} style={style} {...hold("ArrowUp")}>▲</button>
                <button aria-label="Fire" className={`${base} w-16 h-16 rounded-full text-[11px] tracking-wider`} style={style} {...hold(" ")}>FIRE</button>
            </div>
        </div>
    );
}

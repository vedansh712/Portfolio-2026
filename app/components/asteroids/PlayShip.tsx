"use client";

/**
 * Launcher for THE FEED — a vector ship parked at the bottom of the ACTIVITY
 * panel with PLAY blinking beneath it.
 *
 * stopPropagation matters: the ACTIVITY panel is itself clickable and opens the
 * month-view modal, so without it this would expand the panel instead of
 * starting the game.
 */
export function PlayShip({ onPlay }: { onPlay: () => void }) {
    return (
        <button
            type="button"
            aria-label="Play Asteroids"
            data-no-harvest=""
            onClick={(e) => {
                e.stopPropagation();
                onPlay();
            }}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 px-2 py-1 cursor-pointer group bg-transparent border-0"
        >
            <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true"
                className="text-amber-500/70 group-hover:text-amber-400 transition-colors">
                <path d="M9 2 L15.5 17 L9 13.5 L2.5 17 Z" fill="none" stroke="currentColor" strokeWidth="1.4"
                    strokeLinejoin="round" />
                <path d="M6.5 15.5 L9 19.5 L11.5 15.5" fill="none" stroke="currentColor" strokeWidth="1.2"
                    strokeLinejoin="round" className="opacity-0 group-hover:opacity-90 transition-opacity" />
            </svg>
            <span className="ast-blink text-[8px] font-bold tracking-[0.2em] text-amber-500/70 group-hover:text-amber-400 transition-colors">
                PLAY
            </span>
        </button>
    );
}

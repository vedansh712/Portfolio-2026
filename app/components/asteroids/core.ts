/* ══════════════════════════════════════════════════════════
   THE FEED — engine core
   Types, DOM harvesting, physics and collision.
   No React, no rendering — all pure so it stays testable.
══════════════════════════════════════════════════════════ */

export type Rect = { x: number; y: number; w: number; h: number };

/** word -> char is the large/small asteroid chain. */
export type RockKind = "word" | "char" | "cell";

export type Rock = {
    id: number;
    kind: RockKind;
    text: string;
    /** centre position, screen px */
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    vrot: number;
    w: number;
    h: number;
    font: string;
    color: string;
    /** how hard it hits the shield; scaled from the day cell's real intensity */
    damage: number;
    /** green health box — a day with both a commit and a TIL */
    heals: boolean;
    /** pre-rendered glyph, so the loop blits instead of laying out text */
    sprite?: HTMLCanvasElement;
    /** homing strength, 0 = pure drift (level 1) */
    seek: number;
};

export type Bullet = { x: number; y: number; vx: number; vy: number; life: number };

export type Particle = {
    x: number; y: number; vx: number; vy: number; life: number; max: number; color: string;
};

export type Ship = {
    x: number; y: number; vx: number; vy: number;
    angle: number;
    thrusting: boolean;
    /** invulnerability frames after a hit */
    invuln: number;
};

export type Status = "idle" | "playing" | "clearing" | "dead" | "gameover";

export type Game = {
    status: Status;
    field: Rect;
    ship: Ship;
    bullets: Bullet[];
    rocks: Rock[];
    particles: Particle[];
    score: number;
    lives: number;
    shield: number;
    level: number;
    /** panels already absorbed into the field */
    cleared: string[];
    /** panels queued for this level, order shuffled */
    pending: string[];
    /** panel currently sliding its header away */
    absorbing: { panel: string; t: number } | null;
    lastGreenScore: number;
};

export const AMBER = "#ff9500";
export const GREEN = "#22c55e";
export const MAX_SHIELD = 100;
export const GREEN_SCORE_STEP = 500;

/** Level -> the panels it absorbs, in column order. */
export const LEVELS: string[][] = [
    ["ACTIVITY", "CONTACT", "PERSONAL"],
    ["SKILLS", "PROJECTS"],
    ["ABOUT", "EXPERIENCE"],
];

let nextId = 1;

/* ══════════════════════════════════════════════════════════
   HARVEST — rendered DOM into game entities
══════════════════════════════════════════════════════════ */

type HarvestedLine = {
    text: string; x: number; y: number; w: number; h: number; font: string;
};

/**
 * Split a panel's text into *rendered line boxes* by measuring each character.
 * Range rects are used rather than text nodes so wrapped lines break where the
 * browser actually broke them.
 *
 * Panel headers are excluded — the header is animated away separately rather
 * than becoming debris.
 */
function harvestLines(panel: HTMLElement): HarvestedLine[] {
    const header = panel.querySelector("[data-panel-header]");
    const walker = document.createTreeWalker(panel, NodeFilter.SHOW_TEXT);
    const out: HarvestedLine[] = [];
    const range = document.createRange();
    let node: Node | null;

    while ((node = walker.nextNode())) {
        const raw = node.textContent ?? "";
        if (!raw.trim()) continue;
        if (header && header.contains(node)) continue;
        if ((node.parentElement as HTMLElement | null)?.closest("[data-no-harvest]")) continue;

        const parent = node.parentElement;
        if (!parent) continue;
        const cs = getComputedStyle(parent);
        if (cs.visibility === "hidden" || cs.display === "none") continue;
        const family = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim() || "monospace";
        const font = `${cs.fontWeight} ${cs.fontSize} ${family}, monospace`;

        let cur: { text: string; top: number; left: number; right: number; bottom: number } | null = null;
        for (let i = 0; i < raw.length; i++) {
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const r = range.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            if (cur && Math.abs(r.top - cur.top) < 1) {
                cur.text += raw[i];
                cur.right = r.right;
            } else {
                if (cur && cur.text.trim()) {
                    out.push({
                        text: cur.text, x: cur.left, y: cur.top,
                        w: cur.right - cur.left, h: cur.bottom - cur.top, font,
                    });
                }
                cur = { text: raw[i], top: r.top, left: r.left, right: r.right, bottom: r.bottom };
            }
        }
        if (cur && cur.text.trim()) {
            out.push({
                text: cur.text, x: cur.left, y: cur.top,
                w: cur.right - cur.left, h: cur.bottom - cur.top, font,
            });
        }
    }
    return out;
}

/** Letters and digits only — used to reject punctuation-sized debris. */
function alnum(s: string): number {
    return (s.match(/[a-zA-Z0-9]/g) ?? []).length;
}

function drift(speed: number) {
    const a = Math.random() * Math.PI * 2;
    return { vx: Math.cos(a) * speed, vy: Math.sin(a) * speed };
}

/**
 * Colours are assigned from the site palette rather than read from the DOM.
 * Tailwind v4 emits oklab()/lab(), which canvas fillStyle only accepts in
 * recent browsers and fails silently in others.
 */
function kindColor(kind: RockKind): string {
    switch (kind) {
        case "word": return "rgba(255,149,0,0.85)";
        case "char": return "rgba(255,149,0,0.6)";
        case "cell": return AMBER;
    }
}

export function harvestPanel(panel: HTMLElement, speed: number, seek: number): Rock[] {
    const rocks: Rock[] = [];

    for (const l of harvestLines(panel)) {
        // Each word is its own asteroid. A whole line drifting as one bar reads
        // as a floating sentence rather than debris.
        const unit = l.w / Math.max(l.text.length, 1);
        let cursor = l.x;
        for (const token of l.text.split(/(\s+)/)) {
            const tw = unit * token.length;
            if (token.trim() && alnum(token) >= 2) {
                const { vx, vy } = drift(speed);
                rocks.push({
                    id: nextId++, kind: "word", text: token,
                    x: cursor + tw / 2, y: l.y + l.h / 2, vx, vy,
                    rot: 0, vrot: (Math.random() - 0.5) * 0.03,
                    w: Math.max(tw, 6), h: l.h, font: l.font, color: kindColor("word"),
                    damage: 5, heals: false, seek,
                });
            }
            cursor += tw;
        }
    }

    // Contribution day cells — damage scales with how busy that day really was.
    panel.querySelectorAll<HTMLElement>("[data-day-cell]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        const type = el.dataset.cellType ?? "empty";
        const total = Number(el.dataset.cellTotal ?? 0);
        if (type === "empty") return;
        const tier = total === 1 ? 0.3 : total <= 3 ? 0.65 : 1;
        const heals = type === "both";
        const { vx, vy } = drift(speed * 0.8);
        rocks.push({
            id: nextId++, kind: "cell", text: "",
            x: r.left + r.width / 2, y: r.top + r.height / 2, vx, vy,
            rot: 0, vrot: (Math.random() - 0.5) * 0.04,
            w: r.width, h: r.height, font: "",
            color: heals ? GREEN : `rgba(255,149,0,${tier})`,
            damage: heals ? 0 : Math.round(8 + tier * 22),
            heals, seek: 0,
        });
    });

    return rocks;
}

/** A green health box spawned once the score passes a threshold. */
export function spawnGreen(field: Rect): Rock {
    const { vx, vy } = drift(0.5);
    const edge = Math.random() < 0.5;
    return {
        id: nextId++, kind: "cell", text: "",
        x: edge ? field.x + 4 : field.x + Math.random() * field.w,
        y: edge ? field.y + Math.random() * field.h : field.y + 4,
        vx, vy, rot: 0, vrot: 0.02,
        w: 16, h: 16, font: "", color: GREEN,
        damage: 0, heals: true, seek: 0,
    };
}

/* ══════════════════════════════════════════════════════════
   SPLITTING — line -> words -> chars
══════════════════════════════════════════════════════════ */

export function split(rock: Rock, speed: number): Rock[] {
    if (rock.kind === "cell" || rock.kind === "char") return [];

    // A word breaks into its letters; a single-letter word is already smallest.
    const pieces = rock.text.trim().split("");
    if (pieces.length <= 1) return [];

    const kind: RockKind = "char";
    const unit = rock.w / Math.max(rock.text.length, 1);
    let offset = -rock.w / 2;
    const out: Rock[] = [];

    for (const p of pieces) {
        const w = Math.max(unit * p.length, 4);
        const cx = rock.x + offset + w / 2;
        offset += w;
        const a = Math.random() * Math.PI * 2;
        const burst = speed * 0.6 + 0.25 + Math.random() * 0.4;
        out.push({
            id: nextId++, kind, text: p,
            x: cx, y: rock.y,
            vx: rock.vx + Math.cos(a) * burst,
            vy: rock.vy + Math.sin(a) * burst,
            rot: rock.rot, vrot: (Math.random() - 0.5) * 0.06,
            w, h: rock.h, font: rock.font, color: kindColor(kind),
            damage: 2,
            heals: false, seek: rock.seek,
        });
    }
    return out;
}

export function scoreFor(kind: RockKind): number {
    switch (kind) {
        case "word": return 50;
        case "char": return 100;
        case "cell": return 150;
    }
}

/* ══════════════════════════════════════════════════════════
   PHYSICS
══════════════════════════════════════════════════════════ */

export function wrap(o: { x: number; y: number }, f: Rect, pad = 0) {
    if (o.x < f.x - pad) o.x = f.x + f.w + pad;
    if (o.x > f.x + f.w + pad) o.x = f.x - pad;
    if (o.y < f.y - pad) o.y = f.y + f.h + pad;
    if (o.y > f.y + f.h + pad) o.y = f.y - pad;
}

export function stepRock(r: Rock, ship: Ship, f: Rect, dt: number) {
    if (r.seek > 0) {
        const dx = ship.x - r.x;
        const dy = ship.y - r.y;
        const d = Math.hypot(dx, dy) || 1;
        r.vx += (dx / d) * r.seek * dt;
        r.vy += (dy / d) * r.seek * dt;
        const sp = Math.hypot(r.vx, r.vy);
        const cap = 2.2;
        if (sp > cap) { r.vx = (r.vx / sp) * cap; r.vy = (r.vy / sp) * cap; }
    }
    r.x += r.vx * dt;
    r.y += r.vy * dt;
    r.rot += r.vrot * dt;
    wrap(r, f, Math.max(r.w, r.h) / 2);
}

const MIN_HIT = 11;

export function hits(r: Rock, x: number, y: number, pad = 0): boolean {
    // A lone letter is only a few px wide; without a floor it is unhittable.
    const hw = Math.max(r.w, MIN_HIT) / 2 + pad;
    const hh = Math.max(r.h, MIN_HIT) / 2 + pad;
    return x >= r.x - hw && x <= r.x + hw && y >= r.y - hh && y <= r.y + hh;
}

export function burst(x: number, y: number, color: string, n: number): Particle[] {
    const out: Particle[] = [];
    for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 0.5 + Math.random() * 2;
        const life = 18 + Math.random() * 20;
        out.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life, max: life, color });
    }
    return out;
}

export function shuffle<T>(a: T[]): T[] {
    const out = [...a];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

export function unionRect(a: Rect, b: Rect): Rect {
    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    return {
        x, y,
        w: Math.max(a.x + a.w, b.x + b.w) - x,
        h: Math.max(a.y + a.h, b.y + b.h) - y,
    };
}

export function rectOf(el: HTMLElement): Rect {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
}

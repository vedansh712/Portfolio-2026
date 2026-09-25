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

/**
 * The cabinet saucer. The large one fires roughly, the small one leads its shot
 * at the ship — the same bargain as the original: more points, more danger.
 */
export type Saucer = {
    x: number; y: number; vx: number; vy: number;
    small: boolean;
    /** frames until its next shot */
    fireIn: number;
    /** frames until it gives up and leaves */
    life: number;
};

export type Particle = {
    x: number; y: number; vx: number; vy: number; life: number; max: number; color: string;
};

/** Damage / bonus numbers that rise off the point of impact. */
export type Floater = {
    x: number; y: number; vy: number; life: number; max: number; text: string; color: string;
};

/** Shown while a panel is being absorbed. */
export type Banner = {
    cleared: string;
    next: string | null;
    bonus: number;
    t: number;
    /** set when this clear also crosses into a new level */
    levelUp?: number;
};

export type Ship = {
    x: number; y: number; vx: number; vy: number;
    angle: number;
    thrusting: boolean;
    /** invulnerability frames after a hit */
    invuln: number;
};

export type Status = "idle" | "playing" | "clearing" | "dead" | "gameover" | "victory";

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
    saucer: Saucer | null;
    /** frames until the next saucer run */
    saucerIn: number;
    enemyBullets: Bullet[];
    /** frames until hyperspace is available again */
    hyperIn: number;
    paused: boolean;
    /** suppresses shake and flash for prefers-reduced-motion */
    calm: boolean;
    banner: Banner | null;
    floaters: Floater[];
    /** decaying impact shake, in px */
    shake: number;
    /** decaying red damage flash, 0..1 */
    flash: number;
    lastGreenScore: number;
};

export const AMBER = "#ff9500";
export const GREEN = "#22c55e";
export const MAX_SHIELD = 100;
export const GREEN_SCORE_STEP = 500;
export const SAUCER_MIN_GAP = 520;
export const SAUCER_MAX_GAP = 1100;
export const HYPER_COOLDOWN = 160;
/** Chance a hyperspace jump destroys the ship, as in the cabinet. */
export const HYPER_RISK = 0.12;
/**
 * Ceiling on live debris. Level 3 alone is ~212 words, and fully splitting them
 * would be well over a thousand entities — past this the frame budget goes
 * before the game does.
 */
export const MAX_ROCKS = 240;

/** Frames the stage-clear banner holds before the next panel opens. */
export const CLEAR_FRAMES = 100;
/** Score per point of shield still standing when a panel falls. */
export const CLEAR_BONUS_PER_SHIELD = 5;

/**
 * Per-level tuning. Kept as data so the difficulty curve can be read and
 * adjusted in one place rather than hunted through the loop.
 */
export const LEVEL_TUNING = [
    { speed: 0.42, seek: 0,      seekShare: 0,    label: "RIGHT COLUMN" },
    { speed: 0.62, seek: 0.010,  seekShare: 0.35, label: "CENTRE COLUMN" },
    { speed: 0.84, seek: 0.017,  seekShare: 0.70, label: "LEFT COLUMN" },
] as const;

export function tuningFor(level: number) {
    return LEVEL_TUNING[Math.min(level, LEVEL_TUNING.length) - 1];
}

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
    text: string; x: number; y: number; w: number; h: number; font: string; green: boolean;
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
        const green = isGreen(cs.color);

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
                        w: cur.right - cur.left, h: cur.bottom - cur.top, font, green,
                    });
                }
                cur = { text: raw[i], top: r.top, left: r.left, right: r.right, bottom: r.bottom };
            }
        }
        if (cur && cur.text.trim()) {
            out.push({
                text: cur.text, x: cur.left, y: cur.top,
                w: cur.right - cur.left, h: cur.bottom - cur.top, font, green,
            });
        }
    }
    return out;
}

/**
 * Resolve any CSS colour to RGBA by painting one pixel.
 *
 * getComputedStyle returns oklab()/lab() under Tailwind v4, which no amount of
 * string parsing handles cleanly. Letting the browser rasterise it works for
 * every colour syntax it supports. Results are cached — this runs over every
 * element of a panel.
 */
const colorCache = new Map<string, [number, number, number, number]>();
let probe: CanvasRenderingContext2D | null | undefined;

function toRgba(css: string): [number, number, number, number] {
    const cached = colorCache.get(css);
    if (cached) return cached;
    if (probe === undefined) {
        const c = document.createElement("canvas");
        c.width = c.height = 1;
        probe = c.getContext("2d", { willReadFrequently: true });
    }
    let out: [number, number, number, number] = [0, 0, 0, 0];
    if (probe) {
        probe.clearRect(0, 0, 1, 1);
        // An unparseable value leaves fillStyle untouched, so seed a sentinel
        // that cannot be mistaken for green.
        probe.fillStyle = "#000000";
        probe.fillStyle = css;
        probe.fillRect(0, 0, 1, 1);
        const d = probe.getImageData(0, 0, 1, 1).data;
        out = [d[0], d[1], d[2], d[3]];
    }
    colorCache.set(css, out);
    return out;
}

/** Green enough to read as "alive" — the ONLINE dot, CURRENT/LIVE badges, both-cells. */
export function isGreen(css: string): boolean {
    const [r, g, b, a] = toRgba(css);
    return a > 40 && g > 80 && g > r * 1.3 && g > b * 1.3;
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

export function harvestPanel(panel: HTMLElement, speed: number, seek: number, seekShare = 0): Rock[] {
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
                    w: Math.max(tw, 6), h: l.h, font: l.font,
                    color: l.green ? GREEN : kindColor("word"),
                    damage: l.green ? 0 : 5, heals: l.green,
                    // Only a share of the field hunts; a screen where everything
                    // homes in leaves nowhere to retreat to.
                    seek: l.green || Math.random() > seekShare ? 0 : seek,
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

    // Anything rendered green by background — the "both" legend swatch, the
    // ONLINE dot, CURRENT / LIVE badges — becomes a health box too.
    panel.querySelectorAll<HTMLElement>("*").forEach((el) => {
        if (el.hasAttribute("data-day-cell")) return;       // already handled above
        if (el.closest("[data-no-harvest]")) return;
        if (el.closest("[data-panel-header]")) return;
        const cs = getComputedStyle(el);
        if (!isGreen(cs.backgroundColor) && !isGreen(cs.borderTopColor)) return;
        const r = el.getBoundingClientRect();
        if (r.width < 3 || r.height < 3 || r.width > 80 || r.height > 80) return;
        const { vx, vy } = drift(speed * 0.7);
        rocks.push({
            id: nextId++, kind: "cell", text: "",
            x: r.left + r.width / 2, y: r.top + r.height / 2, vx, vy,
            rot: 0, vrot: (Math.random() - 0.5) * 0.03,
            w: Math.max(r.width, 10), h: Math.max(r.height, 10), font: "",
            color: GREEN, damage: 0, heals: true, seek: 0,
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

export function spawnSaucer(f: Rect, level: number): Saucer {
    // Small saucers become more likely as the portfolio falls.
    const small = Math.random() < 0.2 + level * 0.18;
    const fromLeft = Math.random() < 0.5;
    const speed = (small ? 1.5 : 1.05) + level * 0.12;
    return {
        x: fromLeft ? f.x - 18 : f.x + f.w + 18,
        y: f.y + 24 + Math.random() * Math.max(1, f.h - 48),
        vx: fromLeft ? speed : -speed,
        vy: (Math.random() - 0.5) * 0.35,
        small,
        fireIn: small ? 55 : 80,
        life: 900,
    };
}

export function saucerScore(s: Saucer): number {
    return s.small ? 1000 : 200;
}

/** Returns true once the saucer has left the field and should be dropped. */
export function stepSaucer(s: Saucer, f: Rect, dt: number): boolean {
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    // Bounce vertically so it stays on screen while it crosses.
    if (s.y < f.y + 12) { s.y = f.y + 12; s.vy = Math.abs(s.vy); }
    if (s.y > f.y + f.h - 12) { s.y = f.y + f.h - 12; s.vy = -Math.abs(s.vy); }
    s.life -= dt;
    s.fireIn -= dt;
    const gone = s.vx > 0 ? s.x > f.x + f.w + 30 : s.x < f.x - 30;
    return gone || s.life <= 0;
}

/** A saucer shot: the small one aims, the large one sprays. */
export function saucerShot(s: Saucer, ship: Ship, level: number): Bullet {
    const spread = s.small ? 0.16 : 0.9;
    const base = Math.atan2(ship.y - s.y, ship.x - s.x);
    const a = base + (Math.random() - 0.5) * spread;
    const sp = 3.1 + level * 0.25;
    return { x: s.x, y: s.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 150 };
}

export function floater(x: number, y: number, text: string, color: string): Floater {
    return { x, y, vy: -0.7, life: 55, max: 55, text, color };
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

/**
 * Re-map every moving thing from one field rect into another, proportionally.
 * Used when the window resizes mid-run: the harvested geometry was frozen at
 * the old layout, so without this the debris detaches from the panels it came
 * from.
 */
export function rescaleField(g: Game, next: Rect) {
    const old = g.field;
    if (old.w <= 0 || old.h <= 0 || next.w <= 0 || next.h <= 0) return;
    const sx = next.w / old.w;
    const sy = next.h / old.h;
    const map = (o: { x: number; y: number }) => {
        o.x = next.x + (o.x - old.x) * sx;
        o.y = next.y + (o.y - old.y) * sy;
    };
    g.rocks.forEach((r) => { map(r); r.w *= sx; r.h *= sy; r.sprite = undefined; });
    g.bullets.forEach(map);
    g.enemyBullets.forEach(map);
    g.particles.forEach(map);
    g.floaters.forEach(map);
    if (g.saucer) map(g.saucer);
    map(g.ship);
    g.field = next;
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

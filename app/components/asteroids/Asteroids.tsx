"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
    AMBER, GREEN, MAX_SHIELD, GREEN_SCORE_STEP, LEVELS,
    CLEAR_FRAMES, CLEAR_BONUS_PER_SHIELD,
    harvestPanel, spawnGreen, split, scoreFor, stepRock, wrap, hits, burst, floater,
    shuffle, unionRect, rectOf,
    type Game, type Rock,
} from "./core";

/* ══════════════════════════════════════════════════════════
   SPRITES — text is rasterised once, then blitted each frame.
══════════════════════════════════════════════════════════ */
function makeSprite(r: Rock, dpr: number): HTMLCanvasElement {
    const pad = 4;
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.ceil((r.w + pad * 2) * dpr));
    c.height = Math.max(1, Math.ceil((r.h + pad * 2) * dpr));
    const g = c.getContext("2d")!;
    g.scale(dpr, dpr);
    g.font = r.font;
    g.textBaseline = "middle";
    g.textAlign = "center";
    g.fillStyle = r.color;
    g.fillText(r.text, r.w / 2 + pad, r.h / 2 + pad);
    return c;
}

export default function Asteroids({
    active,
    onExit,
}: {
    active: boolean;
    onExit: () => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Game | null>(null);
    const rafRef = useRef<number | null>(null);
    const keysRef = useRef<Record<string, boolean>>({});
    const consumedRef = useRef<HTMLElement[]>([]);
    const [hud, setHud] = useState({
        score: 0, lives: 3, shield: MAX_SHIELD, level: 1, panelsDone: 0, panelsTotal: 3,
    });
    const [over, setOver] = useState(false);
    const exitRef = useRef(onExit);
    useEffect(() => { exitRef.current = onExit; }, [onExit]);

    /* ── restore every panel we hid ── */
    const restore = useCallback(() => {
        consumedRef.current.forEach((el) => {
            el.style.transition = "";
            el.style.opacity = "";
            el.style.transform = "";
        });
        consumedRef.current = [];
    }, []);

    const consume = useCallback((panelName: string, g: Game) => {
        const panel = document.querySelector<HTMLElement>(`[data-panel="${panelName}"]`);
        if (!panel) return;
        const speed = 0.25 + g.level * 0.18;
        const seek = g.level >= 2 ? (g.level - 1) * 0.006 : 0;

        g.rocks.push(...harvestPanel(panel, speed, seek));
        g.field = unionRect(g.field, rectOf(panel));

        const body = panel.querySelector<HTMLElement>("[data-panel-body]");
        const header = panel.querySelector<HTMLElement>("[data-panel-header]");
        if (body) {
            body.style.transition = "opacity 260ms ease-out";
            body.style.opacity = "0";
            consumedRef.current.push(body);
        }
        if (header) {
            // The header slides left out of view as the panel opens up.
            header.style.transition = "transform 420ms cubic-bezier(.6,.05,.3,1), opacity 420ms ease-out";
            header.style.transform = "translateX(-110%)";
            header.style.opacity = "0";
            consumedRef.current.push(header);
        }
    }, []);

    /* ── start ── */
    useEffect(() => {
        if (!active) return;

        const startPanel = document.querySelector<HTMLElement>('[data-panel="ACTIVITY"]');
        if (!startPanel) { exitRef.current(); return; }

        const field = rectOf(startPanel);
        const g: Game = {
            status: "playing",
            field,
            ship: {
                x: field.x + field.w / 2,
                y: field.y + field.h - 28,
                vx: 0, vy: 0, angle: -Math.PI / 2,
                thrusting: false, invuln: 90,
            },
            bullets: [], rocks: [], particles: [],
            score: 0, lives: 3, shield: MAX_SHIELD, level: 1,
            cleared: [], pending: [],
            banner: null, floaters: [], shake: 0, flash: 0, lastGreenScore: 0,
        };
        gameRef.current = g;
        if (process.env.NODE_ENV !== "production") {
            (window as unknown as { __feed?: Game }).__feed = g;
        }
        // Level 1 always opens on ACTIVITY; the rest of the column is shuffled.
        const [first, ...rest] = LEVELS[0];
        g.pending = shuffle(rest);
        consume(first, g);
        g.cleared.push(first);

        return () => {
            gameRef.current = null;
            restore();
        };
    }, [active, consume, restore]);

    /* ── input ── */
    useEffect(() => {
        if (!active) return;
        const down = (e: KeyboardEvent) => {
            if (e.key === "Escape") { exitRef.current(); return; }
            const k = e.key;
            if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(k)) e.preventDefault();
            keysRef.current[k] = true;
        };
        const up = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
        window.addEventListener("keydown", down, { passive: false });
        window.addEventListener("keyup", up);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
            keysRef.current = {};
        };
    }, [active]);

    /* ── loop ── */
    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const resize = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        let last = performance.now();
        let cooldown = 0;
        let hudTick = 0;
        let running = true;

        const onVis = () => {
            // Never burn a frame while the tab is hidden.
            if (document.hidden) {
                running = false;
                if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
            } else if (!running) {
                running = true;
                last = performance.now();
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                rafRef.current = requestAnimationFrame(frame);
            }
        };
        document.addEventListener("visibilitychange", onVis);

        const frame = (now: number) => {
            if (!running) return;
            const g = gameRef.current;
            if (!g) return;
            const dt = Math.max(0, Math.min((now - last) / 16.667, 3));
            last = now;

            const keys = keysRef.current;
            const s = g.ship;

            if (g.status === "playing") {
                /* ship */
                if (keys["ArrowLeft"]) s.angle -= 0.075 * dt;
                if (keys["ArrowRight"]) s.angle += 0.075 * dt;
                s.thrusting = !!keys["ArrowUp"];
                if (s.thrusting) {
                    s.vx += Math.cos(s.angle) * 0.16 * dt;
                    s.vy += Math.sin(s.angle) * 0.16 * dt;
                }
                const sp = Math.hypot(s.vx, s.vy);
                if (sp > 6) { s.vx = (s.vx / sp) * 6; s.vy = (s.vy / sp) * 6; }
                s.vx *= Math.pow(0.988, dt);
                s.vy *= Math.pow(0.988, dt);
                s.x += s.vx * dt;
                s.y += s.vy * dt;
                wrap(s, g.field, 11);
                if (s.invuln > 0) s.invuln -= dt;

                /* fire */
                cooldown -= dt;
                if (keys[" "] && cooldown <= 0) {
                    g.bullets.push({
                        x: s.x + Math.cos(s.angle) * 12,
                        y: s.y + Math.sin(s.angle) * 12,
                        vx: Math.cos(s.angle) * 7 + s.vx * 0.4,
                        vy: Math.sin(s.angle) * 7 + s.vy * 0.4,
                        life: 55,
                    });
                    cooldown = 9;
                }

                /* bullets */
                for (const b of g.bullets) {
                    b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
                    wrap(b, g.field, 2);
                }
                g.bullets = g.bullets.filter((b) => b.life > 0);

                /* rocks */
                for (const r of g.rocks) stepRock(r, s, g.field, dt);

                /* bullet -> rock */
                outer:
                for (let bi = g.bullets.length - 1; bi >= 0; bi--) {
                    const b = g.bullets[bi];
                    for (let ri = g.rocks.length - 1; ri >= 0; ri--) {
                        const r = g.rocks[ri];
                        if (!hits(r, b.x, b.y, 2)) continue;
                        g.bullets.splice(bi, 1);
                        g.rocks.splice(ri, 1);
                        g.score += scoreFor(r.kind);
                        g.particles.push(...burst(r.x, r.y, r.heals ? GREEN : AMBER, r.kind === "word" ? 9 : 5));
                        const kids = split(r, 0.4 + g.level * 0.2);
                        for (const k of kids) k.sprite = makeSprite(k, dpr);
                        g.rocks.push(...kids);
                        continue outer;
                    }
                }

                /* rock -> ship */
                for (let ri = g.rocks.length - 1; ri >= 0; ri--) {
                    const r = g.rocks[ri];
                    if (!hits(r, s.x, s.y, 7)) continue;
                    if (r.heals) {
                        g.rocks.splice(ri, 1);
                        const before = g.shield;
                        g.shield = Math.min(MAX_SHIELD, g.shield + 35);
                        g.particles.push(...burst(r.x, r.y, GREEN, 14));
                        g.floaters.push(floater(r.x, r.y - 10, `+${g.shield - before}`, GREEN));
                        g.score += scoreFor(r.kind);
                        continue;
                    }
                    if (s.invuln > 0) continue;
                    g.rocks.splice(ri, 1);
                    g.shield -= r.damage;
                    g.particles.push(...burst(s.x, s.y, AMBER, 12));
                    g.floaters.push(floater(s.x, s.y - 12, `-${r.damage}`, "#ef4444"));
                    // Heavier hits shake harder, so damage is felt not just read.
                    g.shake = Math.min(14, g.shake + 3 + r.damage * 0.3);
                    g.flash = Math.min(1, g.flash + 0.25 + r.damage * 0.012);
                    s.invuln = 45;
                    if (g.shield <= 0) {
                        g.lives -= 1;
                        g.shield = MAX_SHIELD;
                        s.invuln = 110;
                        s.x = g.field.x + g.field.w / 2;
                        s.y = g.field.y + g.field.h / 2;
                        s.vx = s.vy = 0;
                        g.particles.push(...burst(s.x, s.y, AMBER, 40));
                        g.shake = 22;
                        g.flash = 1;
                        if (g.lives <= 0) { g.status = "gameover"; setOver(true); }
                    }
                }

                /* green resupply once the score has climbed far enough */
                if (g.score - g.lastGreenScore >= GREEN_SCORE_STEP) {
                    g.lastGreenScore = g.score;
                    if (!g.rocks.some((r) => r.heals)) g.rocks.push(spawnGreen(g.field));
                }

                /* panel cleared -> award, announce, then absorb the next */
                if (g.rocks.length === 0) {
                    const bonus = Math.round(g.shield * CLEAR_BONUS_PER_SHIELD);
                    g.score += bonus;
                    g.shield = Math.min(MAX_SHIELD, g.shield + 20);
                    g.floaters.push(
                        floater(g.field.x + g.field.w / 2, g.field.y + g.field.h / 2 + 26, `+${bonus}`, AMBER)
                    );

                    let next: string | null = null;
                    if (g.pending.length > 0) {
                        next = g.pending.shift()!;
                    } else if (g.level < LEVELS.length) {
                        g.level += 1;
                        g.pending = shuffle(LEVELS[g.level - 1]);
                        next = g.pending.shift()!;
                    }

                    g.banner = {
                        cleared: g.cleared[g.cleared.length - 1] ?? "",
                        next, bonus, t: CLEAR_FRAMES,
                    };
                    g.status = next ? "clearing" : "gameover";
                    if (!next) setOver(true);
                }
            } else if (g.status === "clearing" && g.banner) {
                // Hold on the banner so the field growth is legible, then absorb.
                g.banner.t -= dt;
                if (g.banner.t <= 0) {
                    const next = g.banner.next!;
                    consume(next, g);
                    g.cleared.push(next);
                    g.banner = null;
                    g.status = "playing";
                }
            }

            /* particles, floaters, decaying feedback */
            for (const p of g.particles) {
                p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
            }
            g.particles = g.particles.filter((p) => p.life > 0);

            for (const fl of g.floaters) { fl.y += fl.vy * dt; fl.life -= dt; }
            g.floaters = g.floaters.filter((fl) => fl.life > 0);

            g.shake *= Math.pow(0.88, dt);
            if (g.shake < 0.3) g.shake = 0;
            g.flash *= Math.pow(0.90, dt);
            if (g.flash < 0.01) g.flash = 0;

            /* ── draw ── */
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            const f = g.field;
            ctx.save();
            if (g.shake > 0) {
                ctx.translate(
                    (Math.random() - 0.5) * g.shake,
                    (Math.random() - 0.5) * g.shake
                );
            }
            ctx.save();
            ctx.strokeStyle = "rgba(255,149,0,0.35)";
            ctx.lineWidth = 1;
            ctx.setLineDash([6, 6]);
            ctx.strokeRect(f.x + 0.5, f.y + 0.5, f.w - 1, f.h - 1);
            ctx.restore();

            ctx.save();
            ctx.beginPath();
            ctx.rect(f.x, f.y, f.w, f.h);
            ctx.clip();

            for (const r of g.rocks) {
                ctx.save();
                ctx.translate(r.x, r.y);
                ctx.rotate(r.rot);
                if (r.kind === "cell") {
                    ctx.fillStyle = r.color;
                    ctx.fillRect(-r.w / 2, -r.h / 2, r.w, r.h);
                    if (r.heals) {
                        ctx.strokeStyle = "rgba(255,255,255,0.7)";
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(-4, 0); ctx.lineTo(4, 0);
                        ctx.moveTo(0, -4); ctx.lineTo(0, 4);
                        ctx.stroke();
                    }
                } else {
                    if (!r.sprite) r.sprite = makeSprite(r, dpr);
                    const sp2 = r.sprite;
                    ctx.drawImage(sp2, -(sp2.width / dpr) / 2, -(sp2.height / dpr) / 2, sp2.width / dpr, sp2.height / dpr);
                }
                ctx.restore();
            }

            ctx.fillStyle = AMBER;
            for (const b of g.bullets) ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3);

            for (const p of g.particles) {
                ctx.globalAlpha = Math.max(0, p.life / p.max);
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
            }
            ctx.globalAlpha = 1;

            if (g.status !== "gameover" && (s.invuln <= 0 || Math.floor(now / 90) % 2 === 0)) {
                ctx.save();
                ctx.translate(s.x, s.y);
                ctx.rotate(s.angle + Math.PI / 2);
                ctx.strokeStyle = AMBER;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(0, -11); ctx.lineTo(7, 9); ctx.lineTo(0, 5); ctx.lineTo(-7, 9);
                ctx.closePath();
                ctx.stroke();
                if (s.thrusting && Math.floor(now / 60) % 2 === 0) {
                    ctx.beginPath();
                    ctx.moveTo(-3.5, 7); ctx.lineTo(0, 15); ctx.lineTo(3.5, 7);
                    ctx.stroke();
                }
                ctx.restore();
            }

            /* damage flash, inside the clip so it reads as the field being hit */
            if (g.flash > 0) {
                ctx.fillStyle = `rgba(239,68,68,${g.flash * 0.22})`;
                ctx.fillRect(f.x, f.y, f.w, f.h);
            }

            ctx.restore(); // end playfield clip

            /* floating damage / bonus numbers */
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "bold 11px monospace";
            for (const fl of g.floaters) {
                ctx.globalAlpha = Math.max(0, Math.min(1, fl.life / fl.max));
                ctx.fillStyle = fl.color;
                ctx.fillText(fl.text, fl.x, fl.y);
            }
            ctx.globalAlpha = 1;

            /* stage-clear banner */
            if (g.banner) {
                const cx = f.x + f.w / 2;
                const cy = f.y + f.h / 2;
                const fade = Math.min(1, g.banner.t / 25);
                ctx.globalAlpha = fade;
                ctx.fillStyle = "rgba(10,8,4,0.82)";
                ctx.fillRect(f.x, cy - 34, f.w, 68);
                ctx.strokeStyle = "rgba(255,149,0,0.45)";
                ctx.lineWidth = 1;
                ctx.strokeRect(f.x + 0.5, cy - 33.5, f.w - 1, 67);
                ctx.fillStyle = AMBER;
                ctx.font = "bold 14px monospace";
                ctx.fillText(`${g.banner.cleared} CLEARED`, cx, cy - 14);
                ctx.font = "11px monospace";
                ctx.fillStyle = "rgba(255,149,0,0.7)";
                ctx.fillText(`BONUS +${g.banner.bonus}`, cx, cy + 4);
                if (g.banner.next) {
                    ctx.fillStyle = "rgba(255,149,0,0.5)";
                    ctx.fillText(`BREACHING ${g.banner.next}…`, cx, cy + 20);
                }
                ctx.globalAlpha = 1;
            }

            ctx.restore(); // end shake

            hudTick -= dt;
            if (hudTick <= 0) {
                hudTick = 6;
                const total = LEVELS[g.level - 1]?.length ?? 0;
                const doneThisLevel = total - g.pending.length - (g.status === "clearing" ? 0 : 0);
                setHud({
                    score: g.score, lives: g.lives, shield: g.shield, level: g.level,
                    panelsDone: Math.max(0, Math.min(total, doneThisLevel)), panelsTotal: total,
                });
            }

            rafRef.current = requestAnimationFrame(frame);
        };

        // Dev-only: drive the loop by hand. requestAnimationFrame is suspended
        // whenever the page is hidden, so this is the only way to exercise the
        // simulation in a headless/background context.
        if (process.env.NODE_ENV !== "production") {
            (window as unknown as { __feedStep?: (n: number) => void }).__feedStep = (n = 1) => {
                running = true; // the hidden-tab guard would otherwise bail out
                const base = performance.now();
                last = base - 16.667; // so the first stepped frame is a full tick
                for (let i = 0; i < n; i++) frame(base + i * 16.667);
            };
        }

        rafRef.current = requestAnimationFrame(frame);
        window.addEventListener("resize", resize);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("resize", resize);
        };
    }, [active, consume]);

    if (!active) return null;

    return (
        <div className="fixed inset-0 z-[200]" style={{ background: "rgba(6,4,2,0.55)" }}>
            <canvas ref={canvasRef} className="absolute inset-0" />

            {/* HUD */}
            <div className="absolute top-2 left-0 right-0 flex items-center justify-between px-4 text-[10px] tracking-wider pointer-events-none"
                style={{ fontFamily: "monospace", color: AMBER }}>
                <div className="flex items-center gap-4">
                    <span>SCORE {String(hud.score).padStart(6, "0")}</span>
                    <span className="opacity-60">LEVEL {hud.level}</span>
                    <span className="opacity-60">PANELS {hud.panelsDone}/{hud.panelsTotal}</span>
                    <span className="opacity-60">SHIPS {"▲".repeat(Math.max(0, hud.lives))}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="opacity-50">SHIELD</span>
                    <span className="inline-block w-24 h-2 border border-amber-500/40">
                        <span className="block h-full" style={{
                            width: `${Math.max(0, hud.shield)}%`,
                            background: hud.shield > 35 ? AMBER : "#ef4444",
                        }} />
                    </span>
                </div>
            </div>

            <div className="absolute bottom-3 left-0 right-0 text-center text-[9px] opacity-40 pointer-events-none"
                style={{ fontFamily: "monospace", color: AMBER }}>
                ← → ROTATE · ↑ THRUST · SPACE FIRE · [ESC] QUIT
            </div>

            {over && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-6 py-5 border border-amber-500/40 bg-black/80"
                        style={{ fontFamily: "monospace", color: AMBER }}>
                        <div className="text-lg font-bold tracking-widest mb-1">GAME OVER</div>
                        <div className="text-[11px] opacity-70 mb-4">SCORE {hud.score}</div>
                        <button onClick={onExit}
                            className="text-[10px] tracking-wider px-3 py-1 border border-amber-500/40 hover:bg-amber-500/15 cursor-pointer">
                            [ESC] RETURN
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { JetBrains_Mono } from "next/font/google";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

function useClock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);
  return { time, date };
}

function Panel({
  title,
  children,
  className = "",
  titleRight,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleRight?: React.ReactNode;
}) {
  return (
    <div
      className={`border border-amber-500/25 bg-black/40 flex flex-col overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between px-2 py-0.5 bg-amber-500/10 border-b border-amber-500/20 shrink-0">
        <span className="text-[10px] font-bold tracking-wider text-amber-400/80 uppercase">
          {title}
        </span>
        {titleRight && (
          <span className="text-[9px] text-amber-500/50">{titleRight}</span>
        )}
      </div>
      <div className="flex-1 overflow-hidden p-2">{children}</div>
    </div>
  );
}

function Ticker() {
  const items = [
    "NEXT.JS ▲ 16.1",
    "REACT ● 19.2",
    "TYPESCRIPT ◆ 5.x",
    "NODE.JS ▼ 22",
    "PYTHON ● 3.12",
    "GO ◆ 1.22",
    "POSTGRESQL ▲ 16",
    "REDIS ● 7.4",
    "DOCKER ▲ 27",
    "AWS ◆ ACTIVE",
    "VERCEL ● DEPLOYED",
    "TAILWIND ▲ 4.0",
  ];
  const text = items.join("    ·    ");
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-block text-[10px] text-amber-500/60"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {text}&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;{text}
      </motion.div>
    </div>
  );
}

function Sparkline({
  data,
  color = "amber",
}: {
  data: number[];
  color?: string;
}) {
  const max = Math.max(...data);
  const colorClass =
    color === "green"
      ? "bg-green-500/70"
      : color === "red"
      ? "bg-red-400/70"
      : "bg-amber-500/60";
  return (
    <div className="flex items-end gap-px h-5">
      {data.map((v, i) => (
        <div
          key={i}
          className={`w-[3px] ${colorClass} rounded-t-px`}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function BloombergTerminal() {
  const { time, date } = useClock();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div
      className={`${mono.className} fixed inset-0 overflow-hidden`}
      style={{
        /* Dark worn TV body — darkish grey-beige plastic */
        background: `
          radial-gradient(ellipse 85% 80% at 50% 50%, #0d0906 0%, #151210 40%, #1e1a16 55%, #28231e 62%, #302a24 68%, #38322b 74%, #3e3730 80%, #443d35 88%, #4a4239 95%, #4e463d 100%)
        `,
      }}
    >
      {/* Subtle lighter edge on the very outside — worn plastic catching light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 55,
          background: `
            radial-gradient(ellipse 92% 88% at 50% 50%, transparent 75%, rgba(120,105,85,0.06) 100%)
          `,
        }}
      />

      {/* Outer bezel rim */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 56,
          borderRadius: "6px",
          boxShadow: `
            inset 0 0 0 1px rgba(80,70,55,0.15),
            inset 0 1px 2px rgba(100,90,70,0.04)
          `,
        }}
      />

      {/* Screen recess — shadow cast BY the bezel rim DOWN onto the screen glass.
          Top/left edges get a light highlight (plastic catching light above),
          bottom/right get shadow (depth underneath). This sells the "sunk in" look. */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "22px 30px",
          zIndex: 53,
          borderRadius: "14px",
          boxShadow: `
            inset 0 4px 12px 2px rgba(0,0,0,0.7),
            inset 0 2px 4px 1px rgba(0,0,0,0.5),
            inset 4px 0 8px -2px rgba(0,0,0,0.4),
            inset -2px -2px 6px -1px rgba(0,0,0,0.2),
            0 -2px 6px 2px rgba(60,53,43,0.25),
            0 -1px 2px 0px rgba(75,66,55,0.2)
          `,
        }}
      />

      {/* Faint bevel highlight on the TOP lip of the recess — light hitting the rim */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "21px 29px",
          zIndex: 54,
          borderRadius: "15px",
          borderTop: "1px solid rgba(90,80,65,0.2)",
          borderLeft: "1px solid rgba(90,80,65,0.12)",
          borderBottom: "1px solid rgba(0,0,0,0.15)",
          borderRight: "1px solid rgba(0,0,0,0.1)",
        }}
      />

      {/* Scanlines — over the screen area */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "24px 32px",
          zIndex: 45,
          borderRadius: "12px",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,170,0,0.06) 2px, rgba(255,170,0,0.06) 4px)",
        }}
      />

      {/* Phosphor glow — center of screen is warmer/brighter */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "24px 32px",
          zIndex: 44,
          borderRadius: "12px",
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,170,0,0.05) 0%, transparent 100%)",
        }}
      />

      {/* ── SCREEN CONTENT — recessed inside the TV frame ── */}
      <div
        className="absolute text-amber-400 text-[11px] leading-tight flex flex-col overflow-hidden bg-[#0a0804]"
        style={{
          inset: "24px 32px",
          zIndex: 10,
          borderRadius: "12px",
        }}
      >
        {/* ━━━ TOP BAR ━━━ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between px-4 py-1.5 bg-amber-500/8 border-b border-amber-500/20 shrink-0"
        >
          <div className="flex items-center gap-4">
            <span className="text-amber-500 font-bold text-xs tracking-widest">
              VEDANSH TERMINAL
            </span>
            <span className="text-amber-500/30 text-[10px]">v1.0.0</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-500/40 text-[10px]">{date}</span>
            <span className="text-amber-400 font-bold text-sm tabular-nums tracking-wider">
              {mounted ? time : "--:--:--"}
            </span>
          </div>
        </motion.div>

        {/* ━━━ TICKER ━━━ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-4 py-1 border-b border-amber-500/15 bg-amber-500/5 shrink-0"
        >
          <Ticker />
        </motion.div>

        {/* ━━━ MAIN GRID — fills all remaining vertical space ━━━ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex-1 min-h-0 grid grid-cols-12 gap-[1px] p-1 overflow-hidden"
          style={{
            gridTemplateRows: "auto 1fr auto",
          }}
        >
          {/* ── ROW 1: IDENTITY BANNER ── */}
          <div className="col-span-12 flex items-center gap-4 px-3 py-2 bg-amber-600/15 border border-amber-500/20">
            <pre className="text-amber-500/90 text-[9px] leading-none hidden md:block">
              {`
 _   _ ___ ___   _   _  _ ___ _  _
| | | | __|   \\ /_\\ | \\| / __| || |
| |_| | _|| |) / _ \\| .\` \\__ \\ __ |
 \\___/|___|___/_/ \\_\\_|\\_|___/_||_|`}
            </pre>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3">
                <span className="text-amber-400 font-bold text-sm">
                  VEDANSH
                </span>
                <span className="text-amber-500/50 text-[10px]">
                  SOFTWARE DEVELOPER
                </span>
                <span className="text-green-500/60 text-[9px] ml-auto">
                  ● ONLINE
                </span>
              </div>
              <p className="text-amber-500/50 text-[10px] mt-0.5 truncate">
                Full-stack engineer · Systems thinker · Builder of things that
                matter
              </p>
            </div>
          </div>

          {/* ── ROW 2: THREE COLUMNS — stretches to fill ── */}

          {/* LEFT: ABOUT + EXPERIENCE */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-[1px] min-h-0 overflow-hidden">
            <Panel title="ABOUT" titleRight="PG 1/1" className="flex-1 min-h-0">
              <div className="space-y-2 text-[10px]">
                <p className="text-amber-400/90">
                  I am Vedansh — a software developer who builds full-stack web
                  applications, distributed systems, and AI-integrated products.
                </p>
                <p className="text-amber-500/50">
                  4+ years shipping production code. Obsessed with performance,
                  clean architecture, and interfaces that feel right.
                </p>
                <div className="border-t border-amber-500/10 pt-2 mt-2 space-y-1">
                  <Row label="LOCATION" value="New Delhi, IN" />
                  <Row label="EDUCATION" value="B.Tech Computer Science" />
                  <Row
                    label="STATUS"
                    value="Open to opportunities"
                    valueColor="text-green-400/80"
                  />
                  <Row label="FOCUS" value="Full-Stack · AI · Systems" />
                </div>
              </div>
            </Panel>

            <Panel
              title="EXPERIENCE"
              titleRight="--career"
              className="flex-1 min-h-0"
            >
              <div className="space-y-2 text-[10px]">
                {[
                  {
                    role: "Senior Frontend Engineer",
                    co: "Nexus",
                    yr: "2024-NOW",
                    tag: "CURRENT",
                  },
                  {
                    role: "Full-Stack Developer",
                    co: "PixelForge Studios",
                    yr: "2022-2024",
                    tag: "",
                  },
                  {
                    role: "Software Engineer",
                    co: "Codewave Labs",
                    yr: "2021-2022",
                    tag: "",
                  },
                ].map((job) => (
                  <div
                    key={job.co}
                    className="flex items-start gap-2 pb-1.5 border-b border-amber-500/8 last:border-0"
                  >
                    <span className="text-amber-500/30 text-[9px] w-16 shrink-0 tabular-nums">
                      {job.yr}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400/90 truncate">
                          {job.role}
                        </span>
                        {job.tag && (
                          <span className="text-[8px] text-green-400/70 border border-green-500/20 px-1 rounded shrink-0">
                            {job.tag}
                          </span>
                        )}
                      </div>
                      <span className="text-amber-500/40">{job.co}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* CENTER: SKILLS + PROJECTS */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-[1px] min-h-0 overflow-hidden">
            <Panel
              title="SKILLS"
              titleRight="--list"
              className="flex-1 min-h-0"
            >
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
                {[
                  {
                    cat: "LANGUAGES",
                    items: ["TypeScript", "Python", "Go", "Rust", "SQL"],
                  },
                  {
                    cat: "FRONTEND",
                    items: ["React", "Next.js", "Tailwind", "Motion"],
                  },
                  {
                    cat: "BACKEND",
                    items: ["Node.js", "FastAPI", "Express", "GraphQL"],
                  },
                  {
                    cat: "DATA",
                    items: ["PostgreSQL", "Redis", "MongoDB", "Kafka"],
                  },
                  {
                    cat: "CLOUD",
                    items: ["AWS", "Vercel", "Cloudflare", "GCP"],
                  },
                  {
                    cat: "DEVOPS",
                    items: ["Docker", "K8s", "Terraform", "CI/CD"],
                  },
                ].map((group) => (
                  <div key={group.cat} className="mb-1">
                    <span className="text-amber-600/60 text-[9px] font-bold">
                      {group.cat}
                    </span>
                    <div className="text-amber-400/70 mt-0.5">
                      {group.items.map((item, i) => (
                        <span key={item}>
                          {item}
                          {i < group.items.length - 1 && (
                            <span className="text-amber-500/25"> · </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              title="PROJECTS"
              titleRight="--recent"
              className="flex-1 min-h-0"
            >
              <div className="space-y-2 text-[10px]">
                {[
                  {
                    name: "Spectra UI",
                    desc: "Micro-frontend platform, 40+ modules",
                    stat: "▲ SHIPPED",
                    statColor: "text-green-400/70",
                  },
                  {
                    name: "Moodboard AI",
                    desc: "AI-powered creative tool",
                    stat: "▲ LIVE",
                    statColor: "text-green-400/70",
                  },
                  {
                    name: "Gridlock",
                    desc: "Open-source React layout engine",
                    stat: "★ 2.1k",
                    statColor: "text-amber-400/70",
                  },
                  {
                    name: "Ghostwriter",
                    desc: "Collaborative editor with CRDTs",
                    stat: "▲ v2.0",
                    statColor: "text-amber-400/70",
                  },
                  {
                    name: "Pulse Monitor",
                    desc: "Real-time error tracking",
                    stat: "● ACTIVE",
                    statColor: "text-green-400/70",
                  },
                ].map((proj) => (
                  <div
                    key={proj.name}
                    className="flex items-center justify-between pb-1.5 border-b border-amber-500/8 last:border-0"
                  >
                    <div className="min-w-0">
                      <span className="text-amber-400/90">{proj.name}</span>
                      <span className="text-amber-500/30 ml-2">
                        {proj.desc}
                      </span>
                    </div>
                    <span
                      className={`${proj.statColor} text-[9px] shrink-0 ml-2`}
                    >
                      {proj.stat}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* RIGHT: CONTACT + ACTIVITY + SYSTEM */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-[1px] min-h-0 overflow-hidden">
            <Panel
              title="CONTACT"
              titleRight="cat ./contact"
              className="shrink-0"
            >
              <div className="space-y-1.5 text-[10px]">
                <Row
                  label="EMAIL"
                  value="vedansh@example.com"
                  valueColor="text-amber-400"
                />
                <Row
                  label="GITHUB"
                  value="github.com/vedansh"
                  valueColor="text-amber-400"
                />
                <Row
                  label="LINKEDIN"
                  value="linkedin.com/in/vedansh"
                  valueColor="text-amber-400"
                />
                <Row
                  label="TWITTER"
                  value="@vedansh"
                  valueColor="text-amber-400"
                />
                <div className="border-t border-amber-500/10 pt-1.5 mt-1">
                  <span className="text-amber-500/30 text-[9px]">
                    PREFERRED: EMAIL · LINKEDIN
                  </span>
                </div>
              </div>
            </Panel>

            <Panel
              title="ACTIVITY"
              titleRight="--7d"
              className="flex-1 min-h-0"
            >
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[9px] mb-1">
                    <span className="text-amber-500/40">COMMITS</span>
                    <span className="text-green-400/60">+847 this month</span>
                  </div>
                  <Sparkline
                    data={[
                      12, 8, 15, 22, 18, 25, 30, 14, 19, 28, 35, 20, 16, 24,
                      31, 27, 22, 18, 33, 29, 15, 20, 26, 38, 32, 28, 19, 24,
                    ]}
                    color="green"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-[9px] mb-1">
                    <span className="text-amber-500/40">DEPLOYMENTS</span>
                    <span className="text-amber-400/60">23 this week</span>
                  </div>
                  <Sparkline
                    data={[4, 2, 6, 3, 8, 5, 7, 3, 9, 4, 6, 2, 5, 8]}
                    color="amber"
                  />
                </div>
                <div className="border-t border-amber-500/10 pt-1.5">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <MiniStat label="REPOS" value="34" />
                    <MiniStat label="PRs" value="289" />
                    <MiniStat label="ISSUES" value="127" />
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="SYSTEM" titleRight="uptime" className="shrink-0">
              <div className="grid grid-cols-2 gap-1 text-[9px]">
                <Row label="SHELL" value="zsh + oh-my-zsh" small />
                <Row label="EDITOR" value="Neovim / VS Code" small />
                <Row label="TERM" value="Kitty / iTerm2" small />
                <Row label="OS" value="macOS / Linux" small />
              </div>
            </Panel>
          </div>

          {/* ── BOTTOM: LOG ── */}
          <div className="col-span-12 bg-black/30 border border-amber-500/15 px-3 py-1.5 overflow-hidden">
            <div className="flex gap-4 text-[9px] overflow-hidden">
              <span className="text-amber-500/30 shrink-0">LOG</span>
              {[
                {
                  t: "2025-12-15",
                  m: "Deployed Spectra UI v3.0",
                  lvl: "INFO",
                },
                {
                  t: "2025-08-22",
                  m: "Pipeline: 2M+ events/day",
                  lvl: "FEAT",
                },
                {
                  t: "2025-03-10",
                  m: "Launched Moodboard AI",
                  lvl: "SHIP",
                },
                {
                  t: "2024-06-18",
                  m: "Open-sourced Gridlock",
                  lvl: "FEAT",
                },
              ].map((entry, i) => (
                <span key={i} className="text-amber-500/40 shrink-0">
                  <span className="text-amber-500/20">{entry.t}</span>{" "}
                  <span
                    className={
                      entry.lvl === "SHIP"
                        ? "text-cyan-400/50"
                        : entry.lvl === "FEAT"
                        ? "text-yellow-400/50"
                        : "text-amber-500/40"
                    }
                  >
                    [{entry.lvl}]
                  </span>{" "}
                  {entry.m}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ━━━ STATUS BAR ━━━ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between px-4 py-1 bg-amber-600/12 border-t border-amber-500/20 shrink-0 text-[9px]"
        >
          <div className="flex items-center gap-3">
            <span className="text-amber-500/60">SYS:OK</span>
            <span className="text-green-500/50">● CONNECTED</span>
            <span className="text-amber-500/30">PID:1337</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amber-500/30">MEM: 42.0%</span>
            <span className="text-amber-500/30">CPU: 7.2%</span>
            <span className="text-amber-500/40">
              © {new Date().getFullYear()} VEDANSH
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Helpers ── */
function Row({
  label,
  value,
  valueColor = "text-amber-400/70",
  small = false,
}: {
  label: string;
  value: string;
  valueColor?: string;
  small?: boolean;
}) {
  return (
    <div className={`flex gap-2 ${small ? "text-[9px]" : "text-[10px]"}`}>
      <span className="text-amber-500/35 shrink-0 w-16">{label}</span>
      <span className={valueColor}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-amber-400 font-bold text-xs">{value}</div>
      <div className="text-amber-500/30 text-[8px]">{label}</div>
    </div>
  );
}

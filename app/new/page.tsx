"use client";

import { JetBrains_Mono, Inter } from "next/font/google";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });
const sans = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

function useClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);
  return { time, date };
}

function Panel({
  title,
  icon,
  children,
  className = "",
  titleRight,
  accent = "#3b82f6",
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  titleRight?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className={`overflow-hidden flex flex-col bg-[#111118] border border-white/[0.06] ${className}`}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06] shrink-0 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: accent }}>
            {title}
          </span>
        </div>
        {titleRight && <span className="text-[9px] text-white/30">{titleRight}</span>}
      </div>
      <div className="flex-1 overflow-hidden p-3">{children}</div>
    </div>
  );
}

function SkillTag({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium border"
      style={{
        color,
        borderColor: `${color}22`,
        background: `${color}0a`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {name}
    </span>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[2px] h-8">
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ delay: 0.5 + i * 0.02, duration: 0.4, ease: "easeOut" }}
          className="flex-1"
          style={{ background: color, opacity: 0.7, minWidth: "2px" }}
        />
      ))}
    </div>
  );
}

function Ticker() {
  const items = [
    { name: "NEXT.JS", v: "16.1", color: "#fff" },
    { name: "REACT", v: "19.2", color: "#61dafb" },
    { name: "TYPESCRIPT", v: "5.x", color: "#3178c6" },
    { name: "NODE", v: "22", color: "#68a063" },
    { name: "PYTHON", v: "3.12", color: "#ffd43b" },
    { name: "GO", v: "1.22", color: "#00add8" },
    { name: "POSTGRES", v: "16", color: "#336791" },
    { name: "REDIS", v: "7.4", color: "#d82c20" },
    { name: "DOCKER", v: "27", color: "#2496ed" },
    { name: "AWS", v: "ACTIVE", color: "#ff9900" },
    { name: "VERCEL", v: "LIVE", color: "#fff" },
    { name: "TAILWIND", v: "4.0", color: "#38bdf8" },
  ];
  const content = items.map((t, i) => (
    <span key={i} className="inline-flex items-center gap-2 mr-8">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
      <span className="text-white/40">{t.name}</span>
      <span style={{ color: t.color }} className="font-medium">{t.v}</span>
    </span>
  ));
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-block text-[10px]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {content}{content}
      </motion.div>
    </div>
  );
}

export default function ModernTerminal() {
  const { time, date } = useClock();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={`${mono.className} fixed inset-0 overflow-hidden bg-[#08080c]`}>
      {/* SCREEN — edge to edge */}
      <div
        className="absolute inset-0 flex flex-col overflow-hidden text-white text-[11px] leading-tight bg-[#0a0a10]"
      >
        {/* TOP BAR */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] shrink-0 bg-white/[0.02]"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className={`${sans.className} text-white/90 font-semibold text-xs tracking-wide`}>
              vedansh
            </span>
            <span className="text-white/20 text-[10px]">~</span>
            <span className="text-[10px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400/80 border border-cyan-500/20">
              v2.0
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/25 text-[10px]">{date}</span>
            <span className="text-cyan-400 font-bold text-sm tabular-nums tracking-wider">
              {mounted ? time : "--:--:--"}
            </span>
          </div>
        </motion.div>

        {/* TICKER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-4 py-1.5 border-b border-white/[0.04] shrink-0"
        >
          <Ticker />
        </motion.div>

        {/* MAIN GRID */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex-1 min-h-0 grid grid-cols-12 gap-2 p-2 overflow-hidden"
          style={{ gridTemplateRows: "auto 1fr auto" }}
        >
          {/* IDENTITY BANNER */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-12 flex items-center gap-4 px-4 py-3 overflow-hidden relative bg-white/[0.03] border border-white/[0.06]"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />

            <div className="flex-1 min-w-0 pl-2">
              <div className="flex items-center gap-3">
                <span className={`${sans.className} text-white font-bold text-lg tracking-tight`}>
                  VEDANSH
                </span>
                <span className="text-white/30 text-[10px] hidden sm:inline">—</span>
                <span className={`${sans.className} text-white/40 text-xs hidden sm:inline`}>
                  Software Developer
                </span>
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400/70 text-[10px]">online</span>
                </div>
              </div>
              <p className="text-white/30 text-[10px] mt-0.5">
                Full-stack engineer · Systems thinker · Builder of things that matter
              </p>
            </div>
          </motion.div>

          {/* LEFT COLUMN */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-2 min-h-0 overflow-hidden">
            <Panel title="About" icon="👤" accent="#3b82f6" className="flex-1 min-h-0">
              <div className="space-y-2.5 text-[10px]">
                <p className="text-white/80 leading-relaxed">
                  I am Vedansh — a software developer who builds full-stack
                  web applications, distributed systems, and AI-integrated products.
                </p>
                <p className="text-white/40 leading-relaxed">
                  4+ years shipping production code. Obsessed with performance,
                  clean architecture, and interfaces that feel right.
                </p>
                <div className="border-t border-white/[0.06] pt-2 space-y-1.5">
                  <InfoRow icon="📍" label="LOCATION" value="New Delhi, IN" />
                  <InfoRow icon="🎓" label="EDUCATION" value="B.Tech CS" />
                  <InfoRow icon="🟢" label="STATUS" value="Open to work" valueColor="text-emerald-400/80" />
                  <InfoRow icon="🎯" label="FOCUS" value="Full-Stack · AI · Systems" />
                </div>
              </div>
            </Panel>

            <Panel title="Experience" icon="💼" accent="#f59e0b" className="flex-1 min-h-0">
              <div className="space-y-2 text-[10px]">
                {[
                  { role: "Senior Frontend Engineer", co: "Nexus", yr: "2024–Now", color: "#22c55e", current: true },
                  { role: "Full-Stack Developer", co: "PixelForge Studios", yr: "2022–24", color: "#3b82f6", current: false },
                  { role: "Software Engineer", co: "Codewave Labs", yr: "2021–22", color: "#f59e0b", current: false },
                ].map((job) => (
                  <div key={job.co} className="flex items-start gap-2.5 pb-2 border-b border-white/[0.04] last:border-0">
                    <div className="w-1 h-8 mt-0.5 shrink-0" style={{ background: job.color }} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white/90">{job.role}</span>
                        {job.current && (
                          <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400/80 border border-emerald-500/20">
                            NOW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-white/35">{job.co}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-white/20 tabular-nums">{job.yr}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* CENTER COLUMN */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-2 min-h-0 overflow-hidden">
            <Panel title="Skills" icon="⚡" accent="#06b6d4" className="flex-1 min-h-0">
              <div className="space-y-2.5 text-[10px]">
                {[
                  { cat: "Languages", items: [
                    { n: "TypeScript", c: "#3178c6" }, { n: "Python", c: "#ffd43b" },
                    { n: "Go", c: "#00add8" }, { n: "Rust", c: "#f74c00" }, { n: "SQL", c: "#e38c00" },
                  ]},
                  { cat: "Frontend", items: [
                    { n: "React", c: "#61dafb" }, { n: "Next.js", c: "#ffffff" },
                    { n: "Tailwind", c: "#38bdf8" }, { n: "Motion", c: "#f43f5e" },
                  ]},
                  { cat: "Backend", items: [
                    { n: "Node.js", c: "#68a063" }, { n: "FastAPI", c: "#009688" },
                    { n: "Express", c: "#ffffff" }, { n: "GraphQL", c: "#e535ab" },
                  ]},
                  { cat: "Data", items: [
                    { n: "PostgreSQL", c: "#336791" }, { n: "Redis", c: "#d82c20" },
                    { n: "MongoDB", c: "#47a248" }, { n: "Kafka", c: "#ffffff" },
                  ]},
                  { cat: "Infra", items: [
                    { n: "AWS", c: "#ff9900" }, { n: "Docker", c: "#2496ed" },
                    { n: "K8s", c: "#326ce5" }, { n: "Terraform", c: "#7b42bc" },
                  ]},
                ].map((group) => (
                  <div key={group.cat}>
                    <span className="text-white/25 text-[9px] font-semibold uppercase tracking-wider">{group.cat}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {group.items.map((s) => <SkillTag key={s.n} name={s.n} color={s.c} />)}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Projects" icon="🚀" accent="#f43f5e" className="flex-1 min-h-0">
              <div className="space-y-2 text-[10px]">
                {[
                  { name: "Spectra UI", desc: "Micro-frontend platform", stat: "SHIPPED", color: "#22c55e", icon: "▲" },
                  { name: "Moodboard AI", desc: "AI creative tool", stat: "LIVE", color: "#22c55e", icon: "▲" },
                  { name: "Gridlock", desc: "React layout engine", stat: "★ 2.1k", color: "#eab308", icon: "◆" },
                  { name: "Ghostwriter", desc: "CRDT editor", stat: "v2.0", color: "#3b82f6", icon: "▲" },
                  { name: "Pulse Monitor", desc: "Error tracking", stat: "ACTIVE", color: "#22c55e", icon: "●" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between pb-1.5 border-b border-white/[0.04] last:border-0">
                    <div className="min-w-0">
                      <span className="text-white/90">{p.name}</span>
                      <span className="text-white/25 ml-2">{p.desc}</span>
                    </div>
                    <span className="text-[9px] shrink-0 ml-2 flex items-center gap-1" style={{ color: p.color }}>
                      {p.icon} {p.stat}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-2 min-h-0 overflow-hidden">
            <Panel title="Contact" icon="✉️" accent="#f43f5e" className="shrink-0">
              <div className="space-y-2 text-[10px]">
                {[
                  { icon: "📧", label: "EMAIL", value: "vedansh@example.com", color: "#f43f5e" },
                  { icon: "🐙", label: "GITHUB", value: "github.com/vedansh", color: "#c9d1d9" },
                  { icon: "💼", label: "LINKEDIN", value: "linkedin.com/in/vedansh", color: "#0a66c2" },
                  { icon: "🐦", label: "TWITTER", value: "@vedansh", color: "#1d9bf0" },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    <span>{c.icon}</span>
                    <span className="text-white/25 w-14 shrink-0 text-[9px]">{c.label}</span>
                    <span style={{ color: c.color }}>{c.value}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Activity" icon="📊" accent="#22c55e" className="flex-1 min-h-0">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[9px] mb-1.5">
                    <span className="text-white/30">COMMITS</span>
                    <span className="text-emerald-400/70">+847 this month</span>
                  </div>
                  <Sparkline
                    data={[12, 8, 15, 22, 18, 25, 30, 14, 19, 28, 35, 20, 16, 24, 31, 27, 22, 18, 33, 29, 15, 20, 26, 38, 32, 28, 19, 24]}
                    color="#22c55e"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-[9px] mb-1.5">
                    <span className="text-white/30">DEPLOYMENTS</span>
                    <span className="text-cyan-400/70">23 this week</span>
                  </div>
                  <Sparkline
                    data={[4, 2, 6, 3, 8, 5, 7, 3, 9, 4, 6, 2, 5, 8]}
                    color="#06b6d4"
                  />
                </div>
                <div className="border-t border-white/[0.06] pt-2">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <MiniStat label="REPOS" value="34" color="#3b82f6" />
                    <MiniStat label="PRs" value="289" color="#22c55e" />
                    <MiniStat label="ISSUES" value="127" color="#f43f5e" />
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="System" icon="🖥" accent="#f59e0b" className="shrink-0">
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
                <InfoRow icon="🐚" label="SHELL" value="zsh" small />
                <InfoRow icon="✏️" label="EDITOR" value="Neovim" small />
                <InfoRow icon="📟" label="TERM" value="Ghostty" small />
                <InfoRow icon="🍎" label="OS" value="macOS" small />
              </div>
            </Panel>
          </div>

          {/* BOTTOM LOG */}
          <div className="col-span-12 px-3 py-1.5 overflow-hidden bg-white/[0.02] border border-white/[0.04]">
            <div className="flex gap-4 text-[9px] overflow-hidden">
              <span className="text-white/20 shrink-0">LOG</span>
              {[
                { t: "2025-12-15", m: "Deployed Spectra UI v3.0", lvl: "INFO", c: "#3b82f6" },
                { t: "2025-08-22", m: "Pipeline: 2M+ events/day", lvl: "FEAT", c: "#f59e0b" },
                { t: "2025-03-10", m: "Launched Moodboard AI", lvl: "SHIP", c: "#06b6d4" },
                { t: "2024-06-18", m: "Open-sourced Gridlock", lvl: "FEAT", c: "#f59e0b" },
              ].map((e, i) => (
                <span key={i} className="text-white/30 shrink-0">
                  <span className="text-white/15">{e.t}</span>{" "}
                  <span style={{ color: e.c }}>[{e.lvl}]</span>{" "}
                  {e.m}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* STATUS BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-between px-4 py-1.5 border-t border-white/[0.06] shrink-0 text-[9px] bg-white/[0.02]"
        >
          <div className="flex items-center gap-3">
            <span className="text-white/30">SYS:OK</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-400/60">CONNECTED</span>
            </span>
            <span className="text-white/15">PID:1337</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/20">MEM: 42%</span>
            <span className="text-white/20">CPU: 7%</span>
            <span className="text-white/50 font-medium">
              © {new Date().getFullYear()} VEDANSH
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  valueColor = "text-white/60",
  small = false,
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
  small?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${small ? "text-[9px]" : "text-[10px]"}`}>
      <span className="text-[10px]">{icon}</span>
      <span className="text-white/25 shrink-0 w-14 text-[9px]">{label}</span>
      <span className={valueColor}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="font-bold text-xs" style={{ color }}>{value}</div>
      <div className="text-white/25 text-[8px]">{label}</div>
    </div>
  );
}

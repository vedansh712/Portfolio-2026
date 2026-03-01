"use client";

import { JetBrains_Mono } from "next/font/google";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { ActivityFeed } from "./components/ActivityFeed";
import { useActivityData } from "./hooks/useActivityData";
import type { LastCommit } from "./types/activity";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

/* ═══════════════════════════════════════════════
   DATA — All real info from personal_info.md
   ═══════════════════════════════════════════════ */

const PROFILE = {
  name: "VEDANSH SHARMA",
  title: "FULL STACK DEVELOPER",
  tagline: "Crafting digital experiences with modern technologies — turning complex problems into seamless digital solutions.",
  about: "Mechanical Engineering graduate turned self-taught Full Stack Developer. Confident in taking products from scratch to deployment. I build scalable web applications, AI-integrated products, and tools that make a real difference.",
  aboutExtra: "Passionate about clean code, innovative solutions, and user-centered design. I thrive on continuous learning and creative problem-solving.",
  location: "Uttarakhand, INDIA",
  education: "B.Tech — Graphic Era University",
  educationYears: "2019 - 2023",
  status: "Open to opportunities",
  focus: "Full-Stack · AI · Web Apps",
  interests: "Long bike rides, exploring new places, creative problem solving.",
  philosophy: "Clean, maintainable code · User-centered design · Continuous learning",
  funFact: "Believes balance between adventure (bike rides) and creativity fuels better problem-solving.",
};

const CONTACT = {
  email: "vedanshsharma712@gmail.com",
  emailLink: "mailto:vedanshsharma712@gmail.com",
  phone: "+91 9760108830",
  phoneLink: "tel:+919760108830",
  github: "github.com/vedansh712",
  githubLink: "https://github.com/vedansh712",
  linkedin: "linkedin.com/in/vedansh712",
  linkedinLink: "https://www.linkedin.com/in/vedansh712/",
  resume: "Resume (Google Drive)",
  resumeLink: "https://drive.google.com/file/d/19ZkM5WTKAD0POocpNzdRBtnQX6_MJfAc/view?usp=sharing",
};

interface Job {
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  achievements: string[];
}

const EXPERIENCE: Job[] = [
  {
    role: "Full Stack Developer",
    company: "DreamAlle Solutions",
    location: "Remote",
    period: "2024 - 2025",
    current: true,
    achievements: [
      "Lead development of scalable web applications (0 to 10K+ users)",
      "Architected microservices infrastructure and mentored junior developers",
      "Reduced application load time by 30% through optimization",
      "Designed dynamic prompt pipelines for integration with OpenAI's API",
      "Led development on major product redesign to MVC principles",
      "Built core platform features from scratch",
      "Streamlined Git branching and code review practices",
    ],
  },
  {
    role: "Software Development Engineer",
    company: "Akashalabdhi",
    location: "IIT Roorkee",
    period: "2023 - 2024",
    current: false,
    achievements: [
      "Created responsive websites and web applications for diverse clients",
      "Launched dynamic company website that boosted traffic by 30% in three months",
      "Implemented performance optimizations reducing load time by 20%",
      "Built mobile app with user-centric features, improving engagement",
      "Collaborated with design and business teams for market-aligned products",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "Convival Tech Hub",
    location: "Remote",
    period: "6 Months",
    current: false,
    achievements: [
      "Completed intensive training program",
      "Built first production React application",
      "Contributed to open-source projects",
    ],
  },
];

interface Project {
  name: string;
  shortDesc: string;
  fullDesc: string;
  techStack: string[];
  status: string;
  statusColor: string;
  liveLink?: string;
  githubLink?: string;
  highlights: string[];
}

const PROJECTS: Project[] = [
  {
    name: "Stocai",
    shortDesc: "Full Stack AI Coaching Platform",
    fullDesc:
      "Developed backend infrastructure and frontend for scalable applications. Optimized PostgreSQL schemas and OpenAI prompt refinement for intelligent coaching workflows.",
    techStack: ["React", "Next.js", "Python", "PostgreSQL", "JWT", "OpenAI"],
    status: "▲ LIVE",
    statusColor: "text-green-400/70",
    liveLink: "https://www.mystocai.com/",
    highlights: [
      "Scalable backend architecture with JWT auth",
      "OpenAI prompt pipeline for AI coaching",
      "PostgreSQL schema optimization for performance",
      "Full-stack from design to deployment",
    ],
  },
  {
    name: "Activity Tracker",
    shortDesc: "Browser Extension",
    fullDesc:
      "Monitors and analyzes browsing activity with domain-level insights. Includes time limits, alerts, and smart content categorization. Published on the Microsoft Edge Add-ons Store.",
    techStack: ["JavaScript", "HTML", "CSS", "Manifest V3", "Browser APIs"],
    status: "● PUBLISHED",
    statusColor: "text-green-400/70",
    liveLink: "https://microsoftedge.microsoft.com/addons/detail/llljlnkcpejaonlbbnodhfjblichghjf",
    githubLink: "https://github.com/vedansh712/Activity-Tracker-extention",
    highlights: [
      "Published on Microsoft Edge Store",
      "Domain-level browsing analytics",
      "Smart content categorization system",
      "Configurable time limits and alerts",
    ],
  },
  {
    name: "Akashalabdhi",
    shortDesc: "Company Website",
    fullDesc:
      "Launched dynamic company website on AWS, boosting traffic and significantly cutting page load time with performance optimizations.",
    techStack: ["React", "TypeScript", "AWS", "Figma", "Git", "React Native"],
    status: "▲ LIVE",
    statusColor: "text-green-400/70",
    liveLink: "https://akashalabdhi.space/",
    highlights: [
      "Boosted traffic by 30% in three months",
      "Deployed on AWS infrastructure",
      "Pixel-perfect implementation from Figma designs",
      "Performance optimized — reduced load time by 20%",
    ],
  },
];

const SKILLS = [
  {
    cat: "FRONTEND",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"],
  },
  {
    cat: "BACKEND",
    items: ["Node.js", "Python", "Express.js", "REST APIs"],
  },
  {
    cat: "DATABASE",
    items: ["MongoDB", "PostgreSQL", "Redis", "Firebase"],
  },
  {
    cat: "DEVOPS",
    items: ["Docker", "AWS", "Git", "CI/CD"],
  },
];

const SKILL_LEVELS: Record<string, number> = {
  React: 95,
  "Next.js": 90,
  TypeScript: 88,
  "Tailwind CSS": 92,
  "HTML/CSS": 95,
  "Node.js": 90,
  Python: 85,
  "Express.js": 88,
  "REST APIs": 92,
  MongoDB: 88,
  PostgreSQL: 85,
  Redis: 75,
  Firebase: 80,
  Docker: 82,
  AWS: 78,
  Git: 95,
  "CI/CD": 80,
};

const TICKER_ITEMS = [
  "REACT ▲ 19.2",
  "NEXT.JS ● 16.1",
  "TYPESCRIPT ◆ 5.x",
  "NODE.JS ▲ 22",
  "PYTHON ● 3.12",
  "POSTGRESQL ▲ 16",
  "MONGODB ◆ 7.0",
  "DOCKER ▲ 27",
  "AWS ● ACTIVE",
  "TAILWIND ▲ 4.0",
  "REDIS ◆ 7.4",
  "EXPRESS ● 4.x",
];

const LOG_ENTRIES = [
  { t: "2025-01", m: "Shipped Stocai AI platform", lvl: "SHIP" as const },
  { t: "2024-06", m: "Published Activity Tracker on Edge Store", lvl: "FEAT" as const },
  { t: "2024-01", m: "Joined DreamAlle Solutions", lvl: "INFO" as const },
  { t: "2023-08", m: "Launched Akashalabdhi website", lvl: "SHIP" as const },
  { t: "2023-05", m: "Graduated — B.Tech, Graphic Era University", lvl: "INFO" as const },
];

/* ═══════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════
   DETAIL MODAL — click-to-expand overlay
   ═══════════════════════════════════════════════ */

type ModalContent =
  | { type: "project"; data: Project }
  | { type: "job"; data: Job }
  | { type: "skills"; data: typeof SKILLS }
  | { type: "activity" }
  | null;

function DetailModal({
  content,
  onClose,
  activityProps,
}: {
  content: ModalContent;
  onClose: () => void;
  activityProps: { githubData: Parameters<typeof ActivityFeed>[0]["githubData"]; tilData: Parameters<typeof ActivityFeed>[0]["tilData"]; lastCommit: LastCommit | null; loading: boolean };
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop — dark with subtle amber tint like CRT room glow */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(15,10,4,0.92) 0%, rgba(0,0,0,0.96) 100%)",
        }}
      />

      {/* ── CRT MONITOR FRAME ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
        style={{
          /* TV body — dark worn plastic bezel */
          background: `radial-gradient(ellipse 90% 85% at 50% 50%, #151210 0%, #1e1a16 40%, #28231e 60%, #302a24 75%, #38322b 90%, #3e3730 100%)`,
          borderRadius: "10px",
          padding: "12px",
          boxShadow: `
            0 0 80px rgba(255,149,0,0.08),
            0 0 30px rgba(255,149,0,0.04),
            0 20px 60px rgba(0,0,0,0.8),
            inset 0 0 0 1px rgba(80,70,55,0.2),
            inset 0 1px 3px rgba(100,90,70,0.06)
          `,
        }}
      >
        {/* Screen recess shadow — the "sunk in" look */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "8px",
            borderRadius: "8px",
            zIndex: 2,
            boxShadow: `
              inset 0 3px 10px 2px rgba(0,0,0,0.7),
              inset 0 2px 4px 1px rgba(0,0,0,0.4),
              inset 3px 0 6px -2px rgba(0,0,0,0.3),
              inset -2px -2px 5px -1px rgba(0,0,0,0.2),
              0 -1px 4px 1px rgba(60,53,43,0.2)
            `,
          }}
        />

        {/* Bevel highlight on top rim */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "7px",
            borderRadius: "9px",
            zIndex: 3,
            borderTop: "1px solid rgba(90,80,65,0.18)",
            borderLeft: "1px solid rgba(90,80,65,0.1)",
            borderBottom: "1px solid rgba(0,0,0,0.12)",
            borderRight: "1px solid rgba(0,0,0,0.08)",
          }}
        />

        {/* ── CRT SCREEN (inner content) ── */}
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: "6px",
            background: "#0a0804",
            maxHeight: "78vh",
          }}
        >
          {/* Scanlines overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 20,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,170,0,0.06) 2px, rgba(255,170,0,0.06) 4px)",
            }}
          />

          {/* Phosphor glow — center of screen brighter */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 19,
              background:
                "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,170,0,0.06) 0%, transparent 100%)",
            }}
          />

          {/* Screen edge vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 21,
              boxShadow: "inset 0 0 40px 10px rgba(0,0,0,0.4)",
            }}
          />

          {/* Scrollable content area */}
          <div
            className="relative overflow-y-auto text-amber-400 text-[11px] leading-relaxed"
            style={{ maxHeight: "78vh", scrollbarWidth: "none", zIndex: 10 }}
          >
            {/* Modal Header — like a terminal panel title bar */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-3 md:px-4 py-2 bg-amber-500/10 border-b border-amber-500/25"
              style={{ backdropFilter: "blur(8px)", background: "rgba(10,8,4,0.9)" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-500/40 text-[9px]">▶</span>
                <span className="text-amber-400/90 font-bold text-[10px] md:text-xs tracking-wider uppercase">
                  {content.type === "project" && `${content.data.name}`}
                  {content.type === "job" && `${content.data.company}`}
                  {content.type === "skills" && "SKILL PROFICIENCY"}
                  {content.type === "activity" && "ACTIVITY.LOG"}
                </span>
                <span className="text-amber-500/25 text-[9px] hidden sm:inline">
                  {content.type === "project" && "// project --detail"}
                  {content.type === "job" && "// career --detail"}
                  {content.type === "skills" && "// skills --verbose"}
                  {content.type === "activity" && "// month --view"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-amber-500/50 hover:text-amber-400 transition-colors text-[10px] px-1.5 py-0.5 border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/10 cursor-pointer tracking-wider"
              >
                [ESC]
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-3 md:p-4 space-y-3 md:space-y-4">
              {content.type === "project" && <ProjectDetail project={content.data} />}
              {content.type === "job" && <JobDetail job={content.data} />}
              {content.type === "skills" && <SkillsDetail />}
              {content.type === "activity" && (
                <ActivityFeed
                  theme="amber"
                  githubData={activityProps.githubData}
                  tilData={activityProps.tilData}
                  lastCommit={activityProps.lastCommit}
                  loading={activityProps.loading}
                  mode="full"
                />
              )}
            </div>

            {/* Modal Footer — terminal status */}
            <div className="px-3 md:px-4 py-1.5 border-t border-amber-500/15 bg-amber-500/5 text-[9px] flex items-center justify-between">
              <span className="text-amber-500/30">
                {content.type === "project" && "STATUS: VIEWED"}
                {content.type === "job" && "RECORD: LOADED"}
                {content.type === "skills" && "ANALYSIS: COMPLETE"}
                {content.type === "activity" && "FEED: MONTH VIEW"}
              </span>
              <span className="text-amber-500/20">PRESS [ESC] TO CLOSE</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <>
      <div>
        <SectionLabel>DESCRIPTION</SectionLabel>
        <p className="text-amber-400/80 mt-1">{project.fullDesc}</p>
      </div>
      <div>
        <SectionLabel>TECH STACK</SectionLabel>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[9px] text-amber-400/90 border border-amber-500/20 bg-amber-500/5"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div>
        <SectionLabel>KEY CONTRIBUTIONS</SectionLabel>
        <ul className="space-y-1 mt-1.5">
          {project.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-amber-500/70">
              <span className="text-amber-500/40 mt-0.5 shrink-0">▸</span>
              {h}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-amber-500/15 pt-3 space-y-1.5">
        <SectionLabel>LINKS</SectionLabel>
        {project.liveLink && (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span className="text-green-400/60">●</span>
            <span className="group-hover:underline">{project.liveLink.replace("https://", "")}</span>
            <span className="text-amber-500/30 text-[9px]">↗ LIVE</span>
          </a>
        )}
        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span className="text-amber-500/60">◆</span>
            <span className="group-hover:underline">{project.githubLink.replace("https://", "")}</span>
            <span className="text-amber-500/30 text-[9px]">↗ GITHUB</span>
          </a>
        )}
      </div>
    </>
  );
}

function JobDetail({ job }: { job: Job }) {
  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-amber-400/90 font-bold">{job.role}</span>
        {job.current && (
          <span className="text-[8px] text-green-400/70 border border-green-500/20 px-1.5 py-0.5 rounded">
            CURRENT
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-amber-500/50 text-[10px]">
        <span>📍 {job.location}</span>
        <span>·</span>
        <span>📅 {job.period}</span>
      </div>
      <div>
        <SectionLabel>KEY ACHIEVEMENTS</SectionLabel>
        <ul className="space-y-1.5 mt-1.5">
          {job.achievements.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-amber-500/70">
              <span className="text-amber-500/40 mt-0.5 shrink-0">▸</span>
              {a}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function SkillsDetail() {
  return (
    <div className="space-y-4">
      {SKILLS.map((group) => (
        <div key={group.cat}>
          <SectionLabel>{group.cat}</SectionLabel>
          <div className="space-y-2 mt-1.5">
            {group.items.map((skill) => {
              const level = SKILL_LEVELS[skill] || 50;
              return (
                <div key={skill}>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-amber-400/80">{skill}</span>
                    <span className="text-amber-500/40 tabular-nums">{level}%</span>
                  </div>
                  <div className="h-1.5 bg-amber-500/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${level}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                      className="h-full bg-amber-500/60"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-amber-600/60 text-[9px] font-bold tracking-wider uppercase">
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════ */

function Panel({
  title,
  children,
  className = "",
  titleRight,
  onClick,
  clickable = false,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleRight?: React.ReactNode;
  onClick?: () => void;
  clickable?: boolean;
}) {
  return (
    <div
      className={`border border-amber-500/25 bg-black/40 flex flex-col overflow-hidden ${clickable ? "cursor-pointer hover:border-amber-500/40 hover:bg-amber-500/[0.03] transition-all duration-200" : ""
        } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between px-2 py-0.5 bg-amber-500/10 border-b border-amber-500/20 shrink-0">
        <span className="text-[10px] font-bold tracking-wider text-amber-400/80 uppercase">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {titleRight && (
            <span className="text-[9px] text-amber-500/50">{titleRight}</span>
          )}
          {clickable && (
            <span className="text-[9px] text-amber-500/40 hidden md:inline">↗ CLICK TO EXPAND</span>
          )}
          {clickable && (
            <span className="text-[9px] text-amber-500/40 md:hidden">TAP ↗</span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-2">{children}</div>
    </div>
  );
}

function Ticker() {
  const text = TICKER_ITEMS.join("    ·    ");
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

function Row({
  label,
  value,
  valueColor = "text-amber-400/70",
  small = false,
  href,
}: {
  label: string;
  value: string;
  valueColor?: string;
  small?: boolean;
  href?: string;
}) {
  return (
    <div className={`flex gap-2 ${small ? "text-[9px]" : "text-[10px]"}`}>
      <span className="text-amber-500/35 shrink-0 w-16">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${valueColor} hover:text-amber-300 transition-colors hover:underline truncate`}
        >
          {value}
        </a>
      ) : (
        <span className={`${valueColor} truncate`}>{value}</span>
      )}
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

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */

export default function BloombergTerminal() {
  const { time, date } = useClock();
  const [mounted, setMounted] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>(null);
  const activity = useActivityData();

  useEffect(() => setMounted(true), []);

  const openProject = useCallback((p: Project) => setModalContent({ type: "project", data: p }), []);
  const openJob = useCallback((j: Job) => setModalContent({ type: "job", data: j }), []);
  const openSkills = useCallback(() => setModalContent({ type: "skills", data: SKILLS }), []);
  const openActivity = useCallback(() => setModalContent({ type: "activity" }), []);
  const closeModal = useCallback(() => setModalContent(null), []);

  return (
    <div
      className={`${mono.className} fixed inset-0 overflow-hidden`}
      style={{
        background: `
          radial-gradient(ellipse 85% 80% at 50% 50%, #0d0906 0%, #151210 40%, #1e1a16 55%, #28231e 62%, #302a24 68%, #38322b 74%, #3e3730 80%, #443d35 88%, #4a4239 95%, #4e463d 100%)
        `,
      }}
    >
      {/* Subtle lighter edge */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 55,
          background: `radial-gradient(ellipse 92% 88% at 50% 50%, transparent 75%, rgba(120,105,85,0.06) 100%)`,
        }}
      />

      {/* Outer bezel rim */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          zIndex: 56,
          borderRadius: "6px",
          boxShadow: `inset 0 0 0 1px rgba(80,70,55,0.15), inset 0 1px 2px rgba(100,90,70,0.04)`,
        }}
      />

      {/* Screen recess — hidden on mobile */}
      <div
        className="absolute pointer-events-none hidden md:block"
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

      {/* Bevel highlight — hidden on mobile */}
      <div
        className="absolute pointer-events-none hidden md:block"
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

      {/* Scanlines */}
      <div
        className="absolute pointer-events-none hidden md:block"
        style={{
          inset: "24px 32px",
          zIndex: 45,
          borderRadius: "12px",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,170,0,0.06) 2px, rgba(255,170,0,0.06) 4px)",
        }}
      />

      {/* Phosphor glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "0",
          zIndex: 44,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,170,0,0.03) 0%, transparent 100%)",
        }}
      />

      {/* ── SCREEN CONTENT ── */}
      <div
        className="absolute text-amber-400 text-[11px] leading-tight flex flex-col overflow-hidden bg-[#0a0804]"
        style={{
          /* Desktop: recessed, Mobile: full screen */
          inset: "0",
          zIndex: 10,
          borderRadius: "0",
        }}
      >
        {/* Desktop-only screen offset — adjusted via media query in className */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @media (min-width: 768px) {
                .screen-content {
                  top: 24px !important;
                  left: 32px !important;
                  right: 32px !important;
                  bottom: 24px !important;
                  border-radius: 12px !important;
                }
              }
            `,
          }}
        />
        <div
          className="screen-content absolute text-amber-400 text-[11px] leading-tight flex flex-col overflow-hidden bg-[#0a0804]"
          style={{ inset: 0, zIndex: 10 }}
        >
          {/* ━━━ TOP BAR ━━━ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between px-3 md:px-4 py-1.5 bg-amber-500/8 border-b border-amber-500/20 shrink-0"
          >
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-amber-500 font-bold text-[10px] md:text-xs tracking-widest">
                VEDANSH TERMINAL
              </span>
              <span className="text-amber-500/30 text-[9px] hidden sm:inline">v2.0.0</span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-amber-500/40 text-[9px] md:text-[10px] hidden sm:inline">{date}</span>
              <span className="text-amber-400 font-bold text-xs md:text-sm tabular-nums tracking-wider">
                {mounted ? time : "--:--:--"}
              </span>
            </div>
          </motion.div>

          {/* ━━━ TICKER ━━━ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-3 md:px-4 py-1 border-b border-amber-500/15 bg-amber-500/5 shrink-0"
          >
            <Ticker />
          </motion.div>

          {/* ━━━ MAIN — scrollable on mobile, grid on desktop ━━━ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden"
            style={{ scrollbarWidth: "none" }}
          >
            <div
              className="md:h-full md:grid md:grid-cols-12 md:gap-[1px] p-1 flex flex-col gap-1"
              style={{ gridTemplateRows: "auto 1fr auto" }}
            >
              {/* ── ROW 1: IDENTITY BANNER ── */}
              <div className="md:col-span-12 flex items-center gap-3 md:gap-4 px-3 py-2 bg-amber-600/15 border border-amber-500/20">
                <pre className="text-amber-500/90 text-[8px] md:text-[9px] leading-none hidden lg:block">
                  {`
 _   _ ___ ___   _   _  _ ___ _  _
| | | |__ |   \\ /_\\ | \\| / __| || |
| |_| | _|| |) / _ \\| .\` \\__ \\ __ |
 \\___/|___|___/_/ \\_\\_|\\_|___/_||_|`}
                </pre>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
                    <span className="text-amber-400 font-bold text-sm">
                      {PROFILE.name}
                    </span>
                    <span className="text-amber-500/50 text-[9px] md:text-[10px]">
                      {PROFILE.title}
                    </span>
                    <span className="text-green-500/60 text-[9px] ml-auto">
                      ● ONLINE
                    </span>
                  </div>
                  <p className="text-amber-500/50 text-[9px] md:text-[10px] mt-0.5 line-clamp-2 md:truncate">
                    {PROFILE.tagline}
                  </p>
                </div>
              </div>

              {/* ── ROW 2: COLUMNS ── */}

              {/* LEFT: ABOUT + EXPERIENCE */}
              <div className="md:col-span-4 flex flex-col gap-[1px] min-h-0 overflow-hidden">
                <Panel title="ABOUT" titleRight="PG 1/1" className="flex-1 min-h-0">
                  <div className="space-y-2 text-[10px]">
                    <p className="text-amber-400/90">{PROFILE.about}</p>
                    <p className="text-amber-500/50">{PROFILE.aboutExtra}</p>
                    <div className="border-t border-amber-500/10 pt-2 mt-2 space-y-1">
                      <Row label="LOCATION" value={PROFILE.location} />
                      <Row
                        label="EDUCATION"
                        value={PROFILE.education}
                      />
                      <Row label="YEARS" value={PROFILE.educationYears} />
                      <Row
                        label="STATUS"
                        value={PROFILE.status}
                        valueColor="text-green-400/80"
                      />
                      <Row label="FOCUS" value={PROFILE.focus} />
                    </div>
                  </div>
                </Panel>

                <Panel
                  title="EXPERIENCE"
                  titleRight="--career"
                  className="flex-1 min-h-0"
                  clickable
                >
                  <div className="space-y-2 text-[10px]">
                    {EXPERIENCE.map((job) => (
                      <div
                        key={job.company}
                        className="flex items-start gap-2 pb-1.5 border-b border-amber-500/8 last:border-0 cursor-pointer hover:bg-amber-500/[0.03] transition-colors -mx-1 px-1 py-0.5 rounded-sm"
                        onClick={() => openJob(job)}
                      >
                        <span className="text-amber-500/30 text-[9px] w-18 shrink-0 tabular-nums">
                          {job.period}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400/90 truncate">
                              {job.role}
                            </span>
                            {job.current && (
                              <span className="text-[8px] text-green-400/70 border border-green-500/20 px-1 rounded shrink-0">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-500/40">{job.company}</span>
                            <span className="text-amber-500/20 text-[9px]">· {job.location}</span>
                          </div>
                          {/* Mobile: show first achievement */}
                          <p className="text-amber-500/30 text-[9px] mt-0.5 truncate md:hidden">
                            ▸ {job.achievements[0]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>

              {/* CENTER: SKILLS + PROJECTS */}
              <div className="md:col-span-4 flex flex-col gap-[1px] min-h-0 overflow-hidden">
                <Panel
                  title="SKILLS"
                  titleRight="--list"
                  className="flex-1 min-h-0"
                  clickable
                  onClick={openSkills}
                >
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
                    {SKILLS.map((group) => (
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
                  titleRight="--featured"
                  className="flex-1 min-h-0"
                  clickable
                >
                  <div className="space-y-2 text-[10px]">
                    {PROJECTS.map((proj) => (
                      <div
                        key={proj.name}
                        className="flex items-center justify-between pb-1.5 border-b border-amber-500/8 last:border-0 cursor-pointer hover:bg-amber-500/[0.03] transition-colors -mx-1 px-1 py-0.5 rounded-sm"
                        onClick={() => openProject(proj)}
                      >
                        <div className="min-w-0">
                          <span className="text-amber-400/90">{proj.name}</span>
                          <span className="text-amber-500/30 ml-2 hidden sm:inline">
                            {proj.shortDesc}
                          </span>
                          {/* Mobile: show desc below */}
                          <p className="text-amber-500/30 text-[9px] mt-0.5 sm:hidden truncate">
                            {proj.shortDesc}
                          </p>
                        </div>
                        <span
                          className={`${proj.statusColor} text-[9px] shrink-0 ml-2`}
                        >
                          {proj.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>

              {/* RIGHT: CONTACT + INTERESTS + RESUME */}
              <div className="md:col-span-4 flex flex-col gap-[1px] min-h-0 overflow-hidden">
                <Panel
                  title="CONTACT"
                  titleRight="cat ./contact"
                  className="shrink-0"
                >
                  <div className="space-y-1.5 text-[10px]">
                    <Row label="EMAIL" value={CONTACT.email} valueColor="text-amber-400" href={CONTACT.emailLink} />
                    <Row label="PHONE" value={CONTACT.phone} valueColor="text-amber-400" href={CONTACT.phoneLink} />
                    <Row label="GITHUB" value={CONTACT.github} valueColor="text-amber-400" href={CONTACT.githubLink} />
                    <Row label="LINKEDIN" value={CONTACT.linkedin} valueColor="text-amber-400" href={CONTACT.linkedinLink} />
                    <div className="border-t border-amber-500/10 pt-1.5 mt-1">
                      <a
                        href={CONTACT.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[10px] text-amber-400 hover:text-amber-300 transition-colors group"
                      >
                        <span className="text-amber-500/50">📄</span>
                        <span className="group-hover:underline font-bold">DOWNLOAD RESUME</span>
                        <span className="text-amber-500/30 text-[9px]">↗</span>
                      </a>
                    </div>
                  </div>
                </Panel>

                <Panel
                  title="ACTIVITY"
                  titleRight="--feed"
                  className="flex-1 min-h-0"
                  clickable
                  onClick={openActivity}
                >
                  <ActivityFeed
                    theme="amber"
                    githubData={activity.githubData}
                    tilData={activity.tilData}
                    lastCommit={activity.lastCommit}
                    loading={activity.loading}
                    mode="compact"
                  />
                </Panel>

                <Panel title="PERSONAL" titleRight="--me" className="shrink-0">
                  <div className="space-y-1.5 text-[10px]">
                    <div>
                      <span className="text-amber-600/60 text-[9px] font-bold">INTERESTS</span>
                      <p className="text-amber-500/60 mt-0.5">{PROFILE.interests}</p>
                    </div>
                    <div>
                      <span className="text-amber-600/60 text-[9px] font-bold">FUN FACT</span>
                      <p className="text-amber-500/60 mt-0.5">{PROFILE.funFact}</p>
                    </div>
                  </div>
                </Panel>
              </div>

              {/* ── BOTTOM: LOG ── */}
              <div className="md:col-span-12 bg-black/30 border border-amber-500/15 px-3 py-1.5 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-[9px] overflow-hidden">
                  <span className="text-amber-500/30 shrink-0">LOG</span>
                  <div className="flex flex-col md:flex-row gap-1 md:gap-4 overflow-hidden">
                    {LOG_ENTRIES.map((entry, i) => (
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
              </div>
            </div>
          </motion.div>

          {/* ━━━ STATUS BAR ━━━ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between px-3 md:px-4 py-1 bg-amber-600/12 border-t border-amber-500/20 shrink-0 text-[9px]"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-amber-500/60">SYS:OK</span>
              <span className="text-green-500/50">● CONNECTED</span>
              <span className="text-amber-500/30 hidden sm:inline">PID:1337</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-amber-500/30 hidden sm:inline">MEM: 42.0%</span>
              <span className="text-amber-500/30 hidden sm:inline">CPU: 7.2%</span>
              <span className="text-amber-500/40">
                © {new Date().getFullYear()} VEDANSH SHARMA
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── DETAIL MODAL ── */}
      <AnimatePresence>
        {modalContent && (
          <DetailModal content={modalContent} onClose={closeModal} activityProps={activity} />
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { JetBrains_Mono, Inter } from "next/font/google";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { ActivityFeed } from "../components/ActivityFeed";
import { useActivityData } from "../hooks/useActivityData";
import type { LastCommit } from "../types/activity";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });
const sans = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

/* ═══════════════════════════════════════════════
   DATA — All real info from personal_info.md
   ═══════════════════════════════════════════════ */

const PROFILE = {
    name: "VEDANSH SHARMA",
    title: "Full Stack Developer",
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
    email: { icon: "📧", label: "EMAIL", value: "vedanshsharma712@gmail.com", color: "#f43f5e", href: "mailto:vedanshsharma712@gmail.com" },
    phone: { icon: "📱", label: "PHONE", value: "+91 9760108830", color: "#22c55e", href: "tel:+919760108830" },
    github: { icon: "🐙", label: "GITHUB", value: "github.com/vedansh712", color: "#c9d1d9", href: "https://github.com/vedansh712" },
    linkedin: { icon: "💼", label: "LINKEDIN", value: "linkedin.com/in/vedansh712", color: "#0a66c2", href: "https://www.linkedin.com/in/vedansh712/" },
    resume: { icon: "📄", label: "RESUME", value: "Download Resume", color: "#f59e0b", href: "https://drive.google.com/file/d/19ZkM5WTKAD0POocpNzdRBtnQX6_MJfAc/view?usp=sharing" },
};

interface Job {
    role: string;
    company: string;
    location: string;
    period: string;
    current: boolean;
    color: string;
    achievements: string[];
}

const EXPERIENCE: Job[] = [
    {
        role: "Full Stack Developer",
        company: "DreamAlle Solutions",
        location: "Remote",
        period: "2024–2025",
        current: true,
        color: "#22c55e",
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
        period: "2023–2024",
        current: false,
        color: "#3b82f6",
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
        color: "#f59e0b",
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
    statusIcon: string;
    liveLink?: string;
    githubLink?: string;
    highlights: string[];
}

const PROJECTS: Project[] = [
    {
        name: "Stocai",
        shortDesc: "Full Stack AI Coaching Platform",
        fullDesc: "Developed backend infrastructure and frontend for scalable applications. Optimized PostgreSQL schemas and OpenAI prompt refinement for intelligent coaching workflows.",
        techStack: ["React", "Next.js", "Python", "PostgreSQL", "JWT", "OpenAI"],
        status: "LIVE",
        statusColor: "#22c55e",
        statusIcon: "▲",
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
        fullDesc: "Monitors and analyzes browsing activity with domain-level insights. Includes time limits, alerts, and smart content categorization. Published on the Microsoft Edge Add-ons Store.",
        techStack: ["JavaScript", "HTML", "CSS", "Manifest V3", "Browser APIs"],
        status: "PUBLISHED",
        statusColor: "#22c55e",
        statusIcon: "●",
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
        fullDesc: "Launched dynamic company website on AWS, boosting traffic and significantly cutting page load time with performance optimizations.",
        techStack: ["React", "TypeScript", "AWS", "Figma", "Git", "React Native"],
        status: "LIVE",
        statusColor: "#22c55e",
        statusIcon: "▲",
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
        cat: "Frontend",
        items: [
            { n: "React", c: "#61dafb", level: 95 },
            { n: "Next.js", c: "#ffffff", level: 90 },
            { n: "TypeScript", c: "#3178c6", level: 88 },
            { n: "Tailwind CSS", c: "#38bdf8", level: 92 },
        ],
    },
    {
        cat: "Backend",
        items: [
            { n: "Node.js", c: "#68a063", level: 90 },
            { n: "Python", c: "#ffd43b", level: 85 },
            { n: "Express.js", c: "#ffffff", level: 88 },
            { n: "REST APIs", c: "#f97316", level: 92 },
        ],
    },
    {
        cat: "Database",
        items: [
            { n: "MongoDB", c: "#47a248", level: 88 },
            { n: "PostgreSQL", c: "#336791", level: 85 },
            { n: "Redis", c: "#d82c20", level: 75 },
            { n: "Firebase", c: "#ffca28", level: 80 },
        ],
    },
    {
        cat: "DevOps",
        items: [
            { n: "Docker", c: "#2496ed", level: 82 },
            { n: "AWS", c: "#ff9900", level: 78 },
            { n: "Git", c: "#f05032", level: 95 },
            { n: "CI/CD", c: "#6366f1", level: 80 },
        ],
    },
];

const TICKER_ITEMS = [
    { name: "REACT", v: "19.2", color: "#61dafb" },
    { name: "NEXT.JS", v: "16.1", color: "#fff" },
    { name: "TYPESCRIPT", v: "5.x", color: "#3178c6" },
    { name: "NODE", v: "22", color: "#68a063" },
    { name: "PYTHON", v: "3.12", color: "#ffd43b" },
    { name: "POSTGRES", v: "16", color: "#336791" },
    { name: "MONGODB", v: "7.0", color: "#47a248" },
    { name: "DOCKER", v: "27", color: "#2496ed" },
    { name: "AWS", v: "ACTIVE", color: "#ff9900" },
    { name: "TAILWIND", v: "4.0", color: "#38bdf8" },
    { name: "REDIS", v: "7.4", color: "#d82c20" },
    { name: "EXPRESS", v: "4.x", color: "#ffffff" },
];

const LOG_ENTRIES = [
    { t: "2025-01", m: "Shipped Stocai AI platform", lvl: "SHIP", c: "#06b6d4" },
    { t: "2024-06", m: "Published Activity Tracker on Edge Store", lvl: "FEAT", c: "#f59e0b" },
    { t: "2024-01", m: "Joined DreamAlle Solutions", lvl: "INFO", c: "#3b82f6" },
    { t: "2023-08", m: "Launched Akashalabdhi website", lvl: "SHIP", c: "#06b6d4" },
    { t: "2023-05", m: "Graduated — B.Tech, Graphic Era University", lvl: "INFO", c: "#3b82f6" },
];

/* ═══════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════
   DETAIL MODAL
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
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto border border-white/[0.1] bg-[#0e0e14] text-white text-[11px] leading-relaxed rounded-lg"
                style={{
                    boxShadow: "0 0 60px rgba(59,130,246,0.08), 0 0 20px rgba(0,0,0,0.5)",
                    scrollbarWidth: "none",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/[0.08]">
                    <span className={`${sans.className} text-white/90 font-semibold text-xs tracking-wide`}>
                        {content.type === "project" && `◆ ${content.data.name}`}
                        {content.type === "job" && `◆ ${content.data.company}`}
                        {content.type === "skills" && "◆ Skill Proficiency"}
                        {content.type === "activity" && "◆ Activity Feed"}
                    </span>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors text-sm px-2 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    {content.type === "project" && <ProjectDetail project={content.data} />}
                    {content.type === "job" && <JobDetail job={content.data} />}
                    {content.type === "skills" && <SkillsDetail />}
                    {content.type === "activity" && (
                        <ActivityFeed
                            theme="modern"
                            githubData={activityProps.githubData}
                            tilData={activityProps.tilData}
                            lastCommit={activityProps.lastCommit}
                            loading={activityProps.loading}
                            mode="full"
                        />
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

function ProjectDetail({ project }: { project: Project }) {
    return (
        <>
            <div>
                <ModernLabel>Description</ModernLabel>
                <p className="text-white/70 mt-1 leading-relaxed">{project.fullDesc}</p>
            </div>
            <div>
                <ModernLabel>Tech Stack</ModernLabel>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {project.techStack.map((tech) => (
                        <span key={tech} className="px-2.5 py-0.5 text-[9px] text-cyan-400/80 border border-cyan-500/20 bg-cyan-500/5 rounded-sm">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
            <div>
                <ModernLabel>Key Contributions</ModernLabel>
                <ul className="space-y-1.5 mt-1.5">
                    {project.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/60">
                            <span className="text-cyan-400/50 mt-0.5 shrink-0">▸</span>
                            {h}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-t border-white/[0.06] pt-3 space-y-2">
                <ModernLabel>Links</ModernLabel>
                {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-emerald-400/80 hover:text-emerald-300 transition-colors group">
                        <span className="w-2 h-2 rounded-full bg-emerald-400/60" />
                        <span className="group-hover:underline">{project.liveLink.replace("https://", "")}</span>
                        <span className="text-white/20 text-[9px]">↗ LIVE</span>
                    </a>
                )}
                {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors group">
                        <span className="w-2 h-2 rounded-full bg-white/30" />
                        <span className="group-hover:underline">{project.githubLink.replace("https://", "")}</span>
                        <span className="text-white/20 text-[9px]">↗ GITHUB</span>
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
                <span className="text-white/90 font-semibold">{job.role}</span>
                {job.current && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400/80 border border-emerald-500/20 rounded-sm">NOW</span>
                )}
            </div>
            <div className="flex items-center gap-3 text-white/40 text-[10px]">
                <span>📍 {job.location}</span>
                <span>·</span>
                <span>📅 {job.period}</span>
            </div>
            <div>
                <ModernLabel>Key Achievements</ModernLabel>
                <ul className="space-y-1.5 mt-1.5">
                    {job.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/60">
                            <span className="mt-0.5 shrink-0" style={{ color: job.color }}>▸</span>
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
        <div className="space-y-5">
            {SKILLS.map((group) => (
                <div key={group.cat}>
                    <ModernLabel>{group.cat}</ModernLabel>
                    <div className="space-y-2.5 mt-2">
                        {group.items.map((skill) => (
                            <div key={skill.n}>
                                <div className="flex justify-between text-[10px] mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full" style={{ background: skill.c }} />
                                        <span className="text-white/80">{skill.n}</span>
                                    </div>
                                    <span className="text-white/30 tabular-nums">{skill.level}%</span>
                                </div>
                                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.level}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                        className="h-full rounded-full"
                                        style={{ background: skill.c, opacity: 0.7 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ModernLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-white/25 text-[9px] font-semibold uppercase tracking-wider">{children}</span>
    );
}

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════ */

function Panel({
    title,
    icon,
    children,
    className = "",
    titleRight,
    accent = "#3b82f6",
    clickable = false,
    onClick,
}: {
    title: string;
    icon?: string;
    children: React.ReactNode;
    className?: string;
    titleRight?: React.ReactNode;
    accent?: string;
    clickable?: boolean;
    onClick?: () => void;
}) {
    return (
        <div
            className={`overflow-hidden flex flex-col bg-[#111118] border border-white/[0.06] ${clickable ? "cursor-pointer hover:border-white/[0.12] hover:bg-white/[0.02] transition-all duration-200" : ""
                } ${className}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06] shrink-0 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-sm">{icon}</span>}
                    <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: accent }}>{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    {titleRight && <span className="text-[9px] text-white/30">{titleRight}</span>}
                    {clickable && <span className="text-[9px] text-white/20 hidden md:inline">↗ EXPAND</span>}
                    {clickable && <span className="text-[9px] text-white/20 md:hidden">TAP ↗</span>}
                </div>
            </div>
            <div className="flex-1 overflow-hidden p-3">{children}</div>
        </div>
    );
}

function SkillTag({ name, color }: { name: string; color: string }) {
    return (
        <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium border rounded-sm"
            style={{ color, borderColor: `${color}22`, background: `${color}0a` }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            {name}
        </span>
    );
}

function Ticker() {
    const content = TICKER_ITEMS.map((t, i) => (
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

function InfoRow({
    icon,
    label,
    value,
    valueColor = "text-white/60",
    small = false,
    href,
}: {
    icon: string;
    label: string;
    value: string;
    valueColor?: string;
    small?: boolean;
    href?: string;
}) {
    return (
        <div className={`flex items-center gap-2 ${small ? "text-[9px]" : "text-[10px]"}`}>
            <span className="text-[10px]">{icon}</span>
            <span className="text-white/25 shrink-0 w-14 text-[9px]">{label}</span>
            {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer"
                    className={`${valueColor} hover:text-white transition-colors hover:underline truncate`}>
                    {value}
                </a>
            ) : (
                <span className={`${valueColor} truncate`}>{value}</span>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */

export default function ModernTerminal() {
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
        <div className={`${mono.className} fixed inset-0 overflow-hidden bg-[#08080c]`}>
            {/* SCREEN */}
            <div className="absolute inset-0 flex flex-col overflow-hidden text-white text-[11px] leading-tight bg-[#0a0a10]">
                {/* TOP BAR */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between px-3 md:px-4 py-2 border-b border-white/[0.06] shrink-0 bg-white/[0.02]"
                >
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-1.5 mr-2 hidden sm:flex">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                        </div>
                        <span className={`${sans.className} text-white/90 font-semibold text-xs tracking-wide`}>
                            vedansh
                        </span>
                        <span className="text-white/20 text-[10px] hidden sm:inline">~</span>
                        <span className="text-[10px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400/80 border border-cyan-500/20 hidden sm:inline">
                            v2.0
                        </span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <span className="text-white/25 text-[10px] hidden sm:inline">{date}</span>
                        <span className="text-cyan-400 font-bold text-xs md:text-sm tabular-nums tracking-wider">
                            {mounted ? time : "--:--:--"}
                        </span>
                    </div>
                </motion.div>

                {/* TICKER */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="px-3 md:px-4 py-1.5 border-b border-white/[0.04] shrink-0"
                >
                    <Ticker />
                </motion.div>

                {/* MAIN CONTENT — scrollable on mobile, grid on desktop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden"
                    style={{ scrollbarWidth: "none" }}
                >
                    <div
                        className="md:h-full md:grid md:grid-cols-12 md:gap-2 p-2 flex flex-col gap-2"
                        style={{ gridTemplateRows: "auto 1fr auto" }}
                    >
                        {/* IDENTITY BANNER */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="md:col-span-12 flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 overflow-hidden relative bg-white/[0.03] border border-white/[0.06]"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                            <div className="flex-1 min-w-0 pl-2">
                                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                    <span className={`${sans.className} text-white font-bold text-base md:text-lg tracking-tight`}>
                                        {PROFILE.name}
                                    </span>
                                    <span className="text-white/30 text-[10px] hidden sm:inline">—</span>
                                    <span className={`${sans.className} text-white/40 text-xs hidden sm:inline`}>
                                        {PROFILE.title}
                                    </span>
                                    <div className="flex items-center gap-1.5 ml-auto">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-emerald-400/70 text-[10px]">online</span>
                                    </div>
                                </div>
                                <p className="text-white/30 text-[9px] md:text-[10px] mt-0.5 line-clamp-2 md:line-clamp-1">
                                    {PROFILE.tagline}
                                </p>
                            </div>
                        </motion.div>

                        {/* LEFT COLUMN */}
                        <div className="md:col-span-4 flex flex-col gap-2 min-h-0 overflow-hidden">
                            <Panel title="About" icon="👤" accent="#3b82f6" className="flex-1 min-h-0">
                                <div className="space-y-2.5 text-[10px]">
                                    <p className="text-white/80 leading-relaxed">{PROFILE.about}</p>
                                    <p className="text-white/40 leading-relaxed">{PROFILE.aboutExtra}</p>
                                    <div className="border-t border-white/[0.06] pt-2 space-y-1.5">
                                        <InfoRow icon="📍" label="LOCATION" value={PROFILE.location} />
                                        <InfoRow icon="🎓" label="EDUCATION" value={PROFILE.education} />
                                        <InfoRow icon="📅" label="YEARS" value={PROFILE.educationYears} />
                                        <InfoRow icon="🟢" label="STATUS" value={PROFILE.status} valueColor="text-emerald-400/80" />
                                        <InfoRow icon="🎯" label="FOCUS" value={PROFILE.focus} />
                                    </div>
                                </div>
                            </Panel>

                            <Panel title="Experience" icon="💼" accent="#f59e0b" className="flex-1 min-h-0" clickable>
                                <div className="space-y-2 text-[10px]">
                                    {EXPERIENCE.map((job) => (
                                        <div
                                            key={job.company}
                                            className="flex items-start gap-2.5 pb-2 border-b border-white/[0.04] last:border-0 cursor-pointer hover:bg-white/[0.02] transition-colors -mx-1 px-1 py-0.5 rounded-sm"
                                            onClick={() => openJob(job)}
                                        >
                                            <div className="w-1 h-8 mt-0.5 shrink-0 rounded-full" style={{ background: job.color }} />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white/90">{job.role}</span>
                                                    {job.current && (
                                                        <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400/80 border border-emerald-500/20 rounded-sm">NOW</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-white/35">{job.company}</span>
                                                    <span className="text-white/20">·</span>
                                                    <span className="text-white/20 tabular-nums">{job.period}</span>
                                                </div>
                                                <p className="text-white/20 text-[9px] mt-0.5 truncate md:hidden">
                                                    ▸ {job.achievements[0]}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Panel>
                        </div>

                        {/* CENTER COLUMN */}
                        <div className="md:col-span-4 flex flex-col gap-2 min-h-0 overflow-hidden">
                            <Panel title="Skills" icon="⚡" accent="#06b6d4" className="flex-1 min-h-0" clickable onClick={openSkills}>
                                <div className="space-y-2.5 text-[10px]">
                                    {SKILLS.map((group) => (
                                        <div key={group.cat}>
                                            <span className="text-white/25 text-[9px] font-semibold uppercase tracking-wider">{group.cat}</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {group.items.map((s) => <SkillTag key={s.n} name={s.n} color={s.c} />)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Panel>

                            <Panel title="Projects" icon="🚀" accent="#f43f5e" className="flex-1 min-h-0" clickable>
                                <div className="space-y-2 text-[10px]">
                                    {PROJECTS.map((p) => (
                                        <div
                                            key={p.name}
                                            className="flex items-center justify-between pb-1.5 border-b border-white/[0.04] last:border-0 cursor-pointer hover:bg-white/[0.02] transition-colors -mx-1 px-1 py-0.5 rounded-sm"
                                            onClick={() => openProject(p)}
                                        >
                                            <div className="min-w-0">
                                                <span className="text-white/90">{p.name}</span>
                                                <span className="text-white/25 ml-2 hidden sm:inline">{p.shortDesc}</span>
                                                <p className="text-white/25 text-[9px] mt-0.5 sm:hidden truncate">{p.shortDesc}</p>
                                            </div>
                                            <span className="text-[9px] shrink-0 ml-2 flex items-center gap-1" style={{ color: p.statusColor }}>
                                                {p.statusIcon} {p.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Panel>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="md:col-span-4 flex flex-col gap-2 min-h-0 overflow-hidden">
                            <Panel title="Contact" icon="✉️" accent="#f43f5e" className="shrink-0">
                                <div className="space-y-2 text-[10px]">
                                    {Object.values(CONTACT).map((c) => (
                                        <div key={c.label} className="flex items-center gap-2">
                                            <span>{c.icon}</span>
                                            <span className="text-white/25 w-14 shrink-0 text-[9px]">{c.label}</span>
                                            <a
                                                href={c.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline hover:text-white transition-colors truncate"
                                                style={{ color: c.color }}
                                            >
                                                {c.value}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </Panel>

                            <Panel title="Activity" icon="📊" accent="#22c55e" className="flex-1 min-h-0" clickable onClick={openActivity}>
                                <ActivityFeed
                                    theme="modern"
                                    githubData={activity.githubData}
                                    tilData={activity.tilData}
                                    lastCommit={activity.lastCommit}
                                    loading={activity.loading}
                                    mode="compact"
                                />
                            </Panel>

                            <Panel title="Personal" icon="❤️" accent="#f59e0b" className="shrink-0">
                                <div className="space-y-2 text-[10px]">
                                    <div>
                                        <span className="text-white/25 text-[9px] font-semibold uppercase tracking-wider">Interests</span>
                                        <p className="text-white/50 mt-0.5">{PROFILE.interests}</p>
                                    </div>
                                    <div>
                                        <span className="text-white/25 text-[9px] font-semibold uppercase tracking-wider">Fun Fact</span>
                                        <p className="text-white/50 mt-0.5">{PROFILE.funFact}</p>
                                    </div>
                                </div>
                            </Panel>
                        </div>

                        {/* BOTTOM LOG */}
                        <div className="md:col-span-12 px-3 py-1.5 overflow-hidden bg-white/[0.02] border border-white/[0.04]">
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-[9px] overflow-hidden">
                                <span className="text-white/20 shrink-0">LOG</span>
                                <div className="flex flex-col md:flex-row gap-1 md:gap-4 overflow-hidden">
                                    {LOG_ENTRIES.map((e, i) => (
                                        <span key={i} className="text-white/30 shrink-0">
                                            <span className="text-white/15">{e.t}</span>{" "}
                                            <span style={{ color: e.c }}>[{e.lvl}]</span>{" "}
                                            {e.m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* STATUS BAR */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-between px-3 md:px-4 py-1.5 border-t border-white/[0.06] shrink-0 text-[9px] bg-white/[0.02]"
                >
                    <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-white/30">SYS:OK</span>
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-emerald-400/60">CONNECTED</span>
                        </span>
                        <span className="text-white/15 hidden sm:inline">PID:1337</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <span className="text-white/20 hidden sm:inline">MEM: 42%</span>
                        <span className="text-white/20 hidden sm:inline">CPU: 7%</span>
                        <span className="text-white/50 font-medium">
                            © {new Date().getFullYear()} VEDANSH SHARMA
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* DETAIL MODAL */}
            <AnimatePresence>
                {modalContent && <DetailModal content={modalContent} onClose={closeModal} activityProps={activity} />}
            </AnimatePresence>
        </div>
    );
}

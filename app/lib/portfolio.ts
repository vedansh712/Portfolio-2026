/* ═══════════════════════════════════════════════
   PORTFOLIO DATA — single source of truth
   Consumed by app/page.tsx (amber terminal) and
   app/new/page.tsx (modern terminal).
   Mirrors personal_info.md + the current resume.
   ═══════════════════════════════════════════════ */

export const PROFILE = {
  name: "VEDANSH SHARMA",
  title: "Full Stack Developer",
  tagline:
    "Building fast, scalable web and mobile products — backend architecture, frontend performance, and AI-integrated features shipped end to end.",
  about:
    "Software developer working across Java/Spring Boot backends, React frontends and Android. Currently building EduVizio at PayVizio — a multi-tenant school ERP — where I own authorization architecture, data integrity and the academics platform end to end.",
  aboutExtra:
    "Proven in backend architecture, frontend optimization and mentorship in fast-paced startup environments. I care about clean, maintainable code, security by design, and shipping things that hold up in production.",
  location: "Uttarakhand, INDIA",
  education: "B.Tech — Graphic Era University",
  educationYears: "2019 - 2023",
  status: "Open to opportunities",
  focus: "Backend · Full-Stack · AI · Mobile",
  interests: "Long bike rides, exploring new places, creative problem solving.",
  philosophy:
    "Clean, maintainable code · Security by design · User-centered design · Continuous learning",
  funFact:
    "Believes balance between adventure (bike rides) and creativity fuels better problem-solving.",
  certification: "Prompt to Prototype — Google for Startups × Scaler",
};

export const CONTACT = {
  email: "vedanshsharma712@gmail.com",
  emailLink: "mailto:vedanshsharma712@gmail.com",
  phone: "+91 9760108830",
  phoneLink: "tel:+919760108830",
  github: "github.com/vedansh712",
  githubLink: "https://github.com/vedansh712",
  linkedin: "linkedin.com/in/vedansh712",
  linkedinLink: "https://www.linkedin.com/in/vedansh712/",
  website: "vedansh.info",
  websiteLink: "https://vedansh.info",
  resume: "Resume (Google Drive)",
  resumeLink:
    "https://drive.google.com/file/d/19ZkM5WTKAD0POocpNzdRBtnQX6_MJfAc/view?usp=sharing",
};

/** Same links as CONTACT, shaped for the icon-driven list on /new. */
export const CONTACT_LIST = [
  { icon: "📧", label: "EMAIL", value: CONTACT.email, color: "#f43f5e", href: CONTACT.emailLink },
  { icon: "📱", label: "PHONE", value: CONTACT.phone, color: "#22c55e", href: CONTACT.phoneLink },
  { icon: "🐙", label: "GITHUB", value: CONTACT.github, color: "#c9d1d9", href: CONTACT.githubLink },
  { icon: "💼", label: "LINKEDIN", value: CONTACT.linkedin, color: "#0a66c2", href: CONTACT.linkedinLink },
  { icon: "🌐", label: "WEB", value: CONTACT.website, color: "#06b6d4", href: CONTACT.websiteLink },
  { icon: "📄", label: "RESUME", value: "Download Resume", color: "#f59e0b", href: CONTACT.resumeLink },
];

export interface Job {
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  color: string;
  achievements: string[];
}

export const EXPERIENCE: Job[] = [
  {
    role: "Software Developer",
    company: "PayVizio",
    location: "Remote",
    period: "Mar 2026 - Present",
    current: true,
    color: "#22c55e",
    achievements: [
      "Architected a three-axis RBAC model (role × capability × scope) introducing row-level scoping across 26 controllers of a live multi-tenant school ERP",
      "Closed multiple cross-portal data leaks — students reading any student's exam results and fee records, teachers reading school-wide attendance",
      "Shipped 253 permission codes across 13 roles with JWT-signed page claims, so the allowed route set cannot be forged client-side",
      "Owned the academics platform end to end — exams and marks state machine, assignments, lesson planning, timetable, attendance and syllabus tracking",
      "Rebuilt the student CSV import pipeline with an RFC 4180 parser, identity-based deduplication and dry-run validation; cut a 500-row import from ~1,000 queries to 2",
      "Ran ledger-gated MongoDB migrations across 99 collections to move from platform-wide to per-school and per-academic-year uniqueness",
      "Built AI homework and question-paper generators grounded in the taught syllabus, validated server-side with per-school quotas",
      "Containerised the stack with Docker and nginx on Azure Container Apps; grew the test suite from 58 to 246 green tests alongside features",
      "Integrated Mixpanel analytics across the application to track engagement and feature usage for data-driven product decisions",
    ],
  },
  {
    role: "Full Stack Developer",
    company: "StocAI / DreamAlle Solutions",
    location: "Remote",
    period: "Sep 2024 - Sep 2025",
    current: false,
    color: "#3b82f6",
    achievements: [
      "Redesigned the backend architecture using FastAPI and MVC principles, cutting feature development time by 15% and improving modularity",
      "Designed and tested dynamic prompt pipelines for OpenAI's ChatGPT API, reducing failure cases and optimizing performance across use cases",
      "Implemented JWT authentication and OAuth2 flows inside FastAPI middleware, securing chat history and user data with role-based access control",
      "Reduced application load time by 30% through frontend and query optimization",
      "Built core platform features from scratch and mentored junior developers",
      "Streamlined Git branching and code review practices across the team",
    ],
  },
  {
    role: "Software Development Engineer",
    company: "Akashalabdhi",
    location: "IIT Roorkee",
    period: "Dec 2023 - Aug 2024",
    current: false,
    color: "#f59e0b",
    achievements: [
      "Built a React Native attendance application capturing user location and live photo data for real-time attendance marking",
      "Improved engagement and reliability through intuitive UI design, contributing to a 30% increase in session attention with accuracy",
      "Engineered and launched a dynamic company website, driving a 30% increase in web traffic within the first three months",
      "Implemented performance optimizations reducing page load time by 20%",
      "Collaborated with design and business teams to keep the product aligned with the market",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "Convival Tech Hub",
    location: "Remote",
    period: "6 Months",
    current: false,
    color: "#a855f7",
    achievements: [
      "Completed intensive training program",
      "Built first production React application",
      "Contributed to open-source projects",
    ],
  },
];

/**
 * A project link is presented by what it *is* ("Website", "Play Store"), not by
 * its raw URL — several of these URLs are long or opaque.
 */
export type ProjectLinkKind = "website" | "app" | "extension" | "github";

export interface ProjectLink {
  kind: ProjectLinkKind;
  /** Overrides the default label for the kind, e.g. "Play Store". */
  label?: string;
  href: string;
}

/** Icon + default label for each link kind. */
export const LINK_KINDS: Record<ProjectLinkKind, { icon: string; label: string }> = {
  website: { icon: "🌐", label: "Website" },
  app: { icon: "📱", label: "App" },
  extension: { icon: "🧩", label: "Extension" },
  github: { icon: "🐙", label: "GitHub" },
};

export interface Project {
  name: string;
  shortDesc: string;
  fullDesc: string;
  techStack: string[];
  status: string;
  statusIcon: string;
  statusColor: string;
  links?: ProjectLink[];
  highlights: string[];
}

export const PROJECTS: Project[] = [
  {
    name: "EduVizio",
    shortDesc: "Multi-Tenant School ERP / SIS",
    fullDesc:
      "A school ERP serving many schools from a single deployment — each with its own campuses, academic years, classes, sections, staff and students. Java 21 / Spring Boot backend across 6 Maven modules and 99 MongoDB collections, a React + Vite frontend, and a Kotlin/Jetpack Compose parent–student Android app.",
    techStack: [
      "Java 21",
      "Spring Boot",
      "MongoDB",
      "React",
      "Vite",
      "Docker",
      "Azure",
      "Kotlin",
    ],
    status: "IN PRODUCTION",
    statusIcon: "▲",
    statusColor: "#22c55e",
    links: [
      { kind: "website", href: "https://eduvizio.com/" },
      {
        kind: "app",
        label: "Play Store",
        href: "https://play.google.com/store/apps/details?id=com.eduvizio.app&hl=en",
      },
    ],
    highlights: [
      "Three-axis RBAC — 253 permission codes across 13 roles, 26 guarded controllers, JWT-signed page claims",
      "Academics platform end to end: exams, marks state machine, assignments, lesson plans, timetable, attendance, syllabus",
      "CSV import pipeline with identity-based dedupe — ~1,000 queries down to 2 per 500-row file",
      "Ledger-gated MongoDB migrations across 99 collections; test suite grown from 58 to 246",
      "AI homework and question-paper generation grounded in the taught syllabus",
    ],
  },
  {
    name: "Track Daily",
    shortDesc: "Privacy-First Chrome Extension",
    fullDesc:
      "A privacy-first Chrome extension (Manifest V3, vanilla JS, no build step) that measures how you actually spend time in the browser and turns it into analytics — daily/weekly/monthly dashboards, a zoomable day timeline, a focus score, and per-video and per-channel YouTube breakdowns. It makes zero network requests to any third party: no telemetry, no remote AI, not even a CDN. Every byte stays in IndexedDB on the user's machine and can be wiped from the options page. ~10k lines across a strictly layered architecture.",
    techStack: [
      "Vanilla JS",
      "Manifest V3",
      "Service Workers",
      "IndexedDB",
      "Chart.js",
      "Gemini Nano",
    ],
    status: "IN DEVELOPMENT",
    statusIcon: "◆",
    statusColor: "#f59e0b",
    highlights: [
      "Zero third-party network requests — all data local to the browser and user-wipeable at any time",
      "MV3 service worker attributes time per tab, pauses on idle and screen lock, and clamps sleep gaps so a closed laptop never logs phantom hours",
      "Categorisation as an ordered chain of named strategies — domain overrides, keyword heuristics, similarity matching against past choices — with Chrome's on-device Gemini Nano as an optional final tier",
      "Model results are written back as similarity exemplars, so the fully offline path learns from the AI and handles comparable sites without it next time",
      "Three layers with dependencies pointing strictly inward; a tagged template escapes interpolated values by default so page titles can never reach innerHTML unescaped",
      "228 dependency-free unit tests on the Node built-in runner covering time accounting, aggregation, categorisation, escaping and CSV serialisation",
    ],
  },
  {
    name: "Laya",
    shortDesc: "Couples & Relationships App",
    fullDesc:
      "A mobile app for couples to build daily connection habits through interactive shared messages, photos and gamified experiences. React Native client with a Python backend.",
    techStack: ["React Native", "Expo", "Python", "FastAPI", "Firebase"],
    status: "IN DEVELOPMENT",
    statusIcon: "◆",
    statusColor: "#f59e0b",
    highlights: [
      "Daily connection habits built around shared prompts and streaks",
      "Interactive shared messages and photo moments between partners",
      "Gamified experiences to keep couples engaged day to day",
      "Cross-platform React Native client on a Python API",
    ],
  },
  {
    name: "Stocai",
    shortDesc: "Full Stack AI Coaching Platform",
    fullDesc:
      "Developed backend infrastructure and frontend for scalable applications. Optimized PostgreSQL schemas and OpenAI prompt refinement for intelligent coaching workflows.",
    techStack: ["React", "Next.js", "Python", "FastAPI", "PostgreSQL", "JWT", "OpenAI"],
    status: "LIVE",
    statusIcon: "▲",
    statusColor: "#22c55e",
    links: [{ kind: "website", href: "https://os.bettercorporatelife.com/" }],
    highlights: [
      "FastAPI backend rebuilt on MVC principles — 15% faster feature delivery",
      "OpenAI prompt pipeline for AI coaching with reduced failure cases",
      "JWT auth and OAuth2 flows in FastAPI middleware with role-based access control",
      "PostgreSQL schema optimization for performance",
    ],
  },
  {
    name: "Activity Tracker",
    shortDesc: "Browser Extension",
    fullDesc:
      "Monitors and analyzes browsing activity with domain-level insights. Includes time limits, alerts, and smart content categorization. Published on the Microsoft Edge Add-ons Store.",
    techStack: ["JavaScript", "HTML", "CSS", "Manifest V3", "Browser APIs"],
    status: "PUBLISHED",
    statusIcon: "●",
    statusColor: "#22c55e",
    links: [
      {
        kind: "extension",
        label: "Edge Add-ons",
        href: "https://microsoftedge.microsoft.com/addons/detail/llljlnkcpejaonlbbnodhfjblichghjf",
      },
      { kind: "github", href: "https://github.com/vedansh712/Activity-Tracker-extention" },
    ],
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
    status: "LIVE",
    statusIcon: "▲",
    statusColor: "#22c55e",
    links: [{ kind: "website", href: "https://akashalabdhi.space/" }],
    highlights: [
      "Boosted traffic by 30% in three months",
      "Deployed on AWS infrastructure",
      "Pixel-perfect implementation from Figma designs",
      "Performance optimized — reduced load time by 20%",
    ],
  },
];

export interface Skill {
  n: string;
  c: string;
  level: number;
}

export const SKILLS: { cat: string; items: Skill[] }[] = [
  {
    cat: "Frontend",
    items: [
      { n: "React", c: "#61dafb", level: 95 },
      { n: "Next.js", c: "#ffffff", level: 90 },
      { n: "TypeScript", c: "#3178c6", level: 90 },
      { n: "Redux", c: "#764abc", level: 82 },
      { n: "Tailwind CSS", c: "#38bdf8", level: 92 },
      { n: "Chrome Extensions", c: "#4285f4", level: 85 },
    ],
  },
  {
    cat: "Backend",
    items: [
      { n: "Java", c: "#f89820", level: 85 },
      { n: "Spring Boot", c: "#6db33f", level: 85 },
      { n: "Node.js", c: "#68a063", level: 90 },
      { n: "Python", c: "#ffd43b", level: 88 },
      { n: "FastAPI", c: "#009688", level: 88 },
      { n: "Express.js", c: "#ffffff", level: 88 },
    ],
  },
  {
    cat: "Database",
    items: [
      { n: "MongoDB", c: "#47a248", level: 90 },
      { n: "PostgreSQL", c: "#336791", level: 85 },
      { n: "Redis", c: "#d82c20", level: 75 },
      { n: "Firebase", c: "#ffca28", level: 80 },
    ],
  },
  {
    cat: "Mobile",
    items: [
      { n: "React Native", c: "#61dafb", level: 88 },
      { n: "Kotlin", c: "#7f52ff", level: 75 },
      { n: "Jetpack Compose", c: "#4285f4", level: 75 },
      { n: "Flutter", c: "#54c5f8", level: 72 },
      { n: "Expo", c: "#ffffff", level: 82 },
    ],
  },
  {
    cat: "DevOps",
    items: [
      { n: "Docker", c: "#2496ed", level: 85 },
      { n: "AWS", c: "#ff9900", level: 78 },
      { n: "Azure", c: "#0078d4", level: 75 },
      { n: "Git", c: "#f05032", level: 95 },
      { n: "CI/CD", c: "#6366f1", level: 82 },
    ],
  },
  {
    cat: "AI",
    items: [
      { n: "OpenAI API", c: "#10a37f", level: 88 },
      { n: "Prompt Engineering", c: "#a855f7", level: 90 },
      { n: "LLM Pipelines", c: "#ec4899", level: 85 },
      { n: "On-Device AI", c: "#4285f4", level: 80 },
    ],
  },
];

export interface TickerItem {
  name: string;
  v: string;
  icon: string;
  color: string;
}

export const TICKER_ITEMS: TickerItem[] = [
  { name: "JAVA", v: "21", icon: "▲", color: "#f89820" },
  { name: "SPRING BOOT", v: "3.x", icon: "●", color: "#6db33f" },
  { name: "REACT", v: "19.2", icon: "◆", color: "#61dafb" },
  { name: "NEXT.JS", v: "16.1", icon: "▲", color: "#ffffff" },
  { name: "TYPESCRIPT", v: "5.x", icon: "◆", color: "#3178c6" },
  { name: "NODE", v: "22", icon: "▲", color: "#68a063" },
  { name: "PYTHON", v: "3.12", icon: "●", color: "#ffd43b" },
  { name: "MONGODB", v: "7.0", icon: "◆", color: "#47a248" },
  { name: "POSTGRES", v: "16", icon: "▲", color: "#336791" },
  { name: "DOCKER", v: "27", icon: "▲", color: "#2496ed" },
  { name: "KOTLIN", v: "2.x", icon: "●", color: "#7f52ff" },
  { name: "AZURE", v: "ACTIVE", icon: "◆", color: "#0078d4" },
  { name: "AWS", v: "ACTIVE", icon: "●", color: "#ff9900" },
  { name: "TAILWIND", v: "4.0", icon: "▲", color: "#38bdf8" },
];

export interface LogEntry {
  t: string;
  m: string;
  lvl: string;
  c: string;
}

export const LOG_ENTRIES: LogEntry[] = [
  { t: "2026-08", m: "Building Track Daily — 228 tests, zero network calls", lvl: "FEAT", c: "#f59e0b" },
  { t: "2026-06", m: "Shipped three-axis RBAC across 26 controllers", lvl: "SHIP", c: "#06b6d4" },
  { t: "2026-03", m: "Joined PayVizio — building EduVizio SIS", lvl: "INFO", c: "#3b82f6" },
  { t: "2025-09", m: "Wrapped up StocAI at DreamAlle Solutions", lvl: "INFO", c: "#3b82f6" },
  { t: "2024-06", m: "Published Activity Tracker on Edge Store", lvl: "FEAT", c: "#f59e0b" },
  { t: "2023-08", m: "Launched Akashalabdhi website", lvl: "SHIP", c: "#06b6d4" },
];

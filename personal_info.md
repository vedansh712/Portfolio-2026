# Personal Information & Portfolio Data

This file contains all the personal information, professional experience, and links added to this portfolio project. This data is structured to provide a comprehensive overview of **Vedansh Sharma** for AI understanding and professional transfer.

> The live site reads its data from `app/lib/portfolio.ts`. Keep this file and that module in sync.

---

## 👤 Basic Information
- **Name:** Vedansh Sharma
- **Role:** Full Stack Developer (resume title: Software Developer)
- **Location:** Uttarakhand, INDIA
- **Tagline:** Building fast, scalable web and mobile products — backend architecture, frontend performance, and AI-integrated features shipped end to end.
- **Background:** Mechanical Engineering degree turned self-taught Full Stack Developer. Confident in taking products from scratch to deployment. Currently works across Java/Spring Boot backends, React frontends and Android.

---

## 📧 Contact & Social Links
- **Email:** [vedanshsharma712@gmail.com](mailto:vedanshsharma712@gmail.com)
- **Phone:** [+91 9760108830](tel:+919760108830)
- **LinkedIn:** [linkedin.com/in/vedansh712](https://www.linkedin.com/in/vedansh712/)
- **GitHub:** [github.com/vedansh712](https://github.com/vedansh712)
- **Website:** [vedansh.info](https://vedansh.info)
- **Resume:** [View Resume on Google Drive](https://drive.google.com/file/d/19ZkM5WTKAD0POocpNzdRBtnQX6_MJfAc/view?usp=sharing)

---

## 💼 Professional Experience

### **Software Developer** | PayVizio
*Mar 2026 - Present*

Building **EduVizio** — a multi-tenant school ERP / SIS. Java 21 + Spring Boot across 6 Maven modules, 99 MongoDB collections, a React + Vite frontend, and a Kotlin/Jetpack Compose parent–student Android app.

- Architected a three-axis RBAC model (role × capability × scope) introducing row-level scoping across 26 controllers of a live multi-tenant school ERP.
- Closed multiple cross-portal data leaks — students reading any student's exam results and fee records, teachers reading school-wide attendance.
- Shipped 253 permission codes across 13 roles with JWT-signed page claims, so the allowed route set cannot be forged client-side.
- Owned the academics platform end to end — exams and marks state machine, assignments, lesson planning, timetable, attendance and syllabus tracking.
- Rebuilt the student CSV import pipeline with an RFC 4180 parser, identity-based deduplication and dry-run validation; cut a 500-row import from ~1,000 queries to 2.
- Ran ledger-gated MongoDB migrations across 99 collections to move from platform-wide to per-school and per-academic-year uniqueness.
- Built AI homework and question-paper generators grounded in the taught syllabus, validated server-side with per-school quotas.
- Containerised the stack with Docker and nginx on Azure Container Apps; grew the test suite from 58 to 246 green tests alongside features.
- Integrated Mixpanel analytics across the application to track engagement and feature usage.

### **Full Stack Developer** | StocAI / DreamAlle Solutions
*Remote | Sep 2024 - Sep 2025*
- Redesigned the backend architecture using FastAPI and MVC principles, cutting feature development time by 15% and improving modularity.
- Designed and tested dynamic prompt pipelines for OpenAI's ChatGPT API, reducing failure cases and optimizing performance across use cases.
- Implemented JWT authentication and OAuth2 flows inside FastAPI middleware, securing chat history and user data with role-based access control.
- Reduced application load time by 30% through frontend and query optimization.
- Built core platform features from scratch and mentored junior developers.
- Streamlined Git branching and code review practices across the team.

### **Software Development Engineer** | Akashalabdhi
*IIT Roorkee | Dec 2023 - Aug 2024*
- Built a React Native attendance application capturing user location and live photo data for real-time attendance marking.
- Improved engagement and reliability through intuitive UI design, contributing to a 30% increase in session attention with accuracy.
- Engineered and launched a dynamic company website, driving a 30% increase in web traffic within the first three months.
- Implemented performance optimizations reducing page load time by 20%.
- Collaborated with design and business teams to keep the product aligned with the market.

### **Software Developer Intern** | Convival Tech Hub
*Remote | 6 Months*
- Completed intensive training program.
- Built first production React application.
- Contributed to open-source projects.

---

## 🎓 Education
- **Bachelor of Technology (B.Tech)**
  *Graphic Era University, Dehradun* | 2019 - 2023

---

## 🏅 Certifications & Achievements
- **Prompt to Prototype** — Google for Startups × Scaler. Hands-on program on turning AI prompts into scalable, production-ready prototypes using modern LLM workflows and rapid iteration.

---

## 🛠️ Technical Skills

### **Frontend**
- **React:** 95% · **Next.js:** 90% · **TypeScript:** 90% · **Redux:** 82% · **Tailwind CSS:** 92% · **Chrome Extensions:** 85%

### **Backend**
- **Java:** 85% · **Spring Boot:** 85% · **Node.js:** 90% · **Python:** 88% · **FastAPI:** 88% · **Express.js:** 88%

### **Database**
- **MongoDB:** 90% · **PostgreSQL:** 85% · **Redis:** 75% · **Firebase:** 80%

### **Mobile**
- **React Native:** 88% · **Kotlin:** 75% · **Jetpack Compose:** 75% · **Flutter:** 72% · **Expo:** 82%

### **DevOps & Tools**
- **Docker:** 85% · **AWS:** 78% · **Azure:** 75% · **Git:** 95% · **CI/CD:** 82%

### **AI**
- **OpenAI API:** 88% · **Prompt Engineering:** 90% · **LLM Pipelines:** 85% · **On-Device AI:** 80%

---

## 🚀 Featured Projects

### 1. **EduVizio** (Multi-Tenant School ERP / SIS — PayVizio)
- **Description:** A school ERP serving many schools from a single deployment — each with its own campuses, academic years, classes, sections, staff and students.
- **Tech Stack:** Java 21, Spring Boot, MongoDB, React, Vite, Docker, Azure, Kotlin
- **Website:** [eduvizio.com](https://eduvizio.com/)
- **Android App:** [Play Store](https://play.google.com/store/apps/details?id=com.eduvizio.app&hl=en)
- **Status:** In production

### 2. **Track Daily** (Privacy-First Chrome Extension — Browsing Time Analytics)
- **Description:** A Manifest V3 Chrome extension that measures how time is actually spent in the browser and turns it into analytics — daily/weekly/monthly dashboards, a zoomable day timeline, a focus score, and per-video and per-channel YouTube breakdowns. Zero network requests to any third party; all data lives in IndexedDB on the user's machine and is wipeable from the options page. ~10k lines, strictly layered, 228 dependency-free unit tests.
- **Tech Stack:** Vanilla JS, Manifest V3, Service Workers, IndexedDB, Chart.js, Gemini Nano (on-device)
- **Status:** In development

### 3. **Laya** (Couples & Relationships App)
- **Description:** A mobile app for couples to build daily connection habits through interactive shared messages, photos and gamified experiences.
- **Tech Stack:** React Native, Expo, Python, FastAPI, Firebase
- **Status:** In development

### 4. **Stocai** (Full Stack AI Coaching Platform)
- **Description:** Developed backend infrastructure and frontend for scalable applications. Optimized PostgreSQL schemas and OpenAI prompt refinement.
- **Tech Stack:** React, Next.js, Python, FastAPI, PostgreSQL, JWT, OpenAI
- **Website:** [os.bettercorporatelife.com](https://os.bettercorporatelife.com/)

### 5. **Activity Tracker** (Browser Extension)
- **Description:** Monitors and analyzes browsing activity with domain-level insights. Includes time limits and alerts. Published on Microsoft Edge Store.
- **Tech Stack:** JavaScript, HTML, CSS, Manifest V3, Browser APIs
- **Extension:** [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/llljlnkcpejaonlbbnodhfjblichghjf)
- **GitHub:** [Activity-Tracker-extention](https://github.com/vedansh712/Activity-Tracker-extention)

### 6. **Akashalabdhi** (Company Website)
- **Description:** Launched dynamic company website on AWS, boosting traffic and cutting page load time.
- **Tech Stack:** React, TypeScript, AWS, Figma, Git, React Native
- **Website:** [akashalabdhi.space](https://akashalabdhi.space/)

---

## ❤️ Interests & Philosophy
- **Interests:** Long bike rides, exploring new places, creative problem solving.
- **Philosophy:** Clean, maintainable code; Security by design; User-centered design; Continuous learning.
- **Fun Fact:** Believes balance between adventure (bike rides) and creativity fuels better problem-solving.

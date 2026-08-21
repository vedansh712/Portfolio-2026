import Link from "next/link";
import { JetBrains_Mono, Inter } from "next/font/google";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"] });
const sans = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/**
 * Long-form document chrome in the site's terminal idiom.
 *
 * Owns its own scroll container: globals.css sets `overflow: hidden` on
 * html/body at >=768px (the CRT effect on the terminal pages needs it), so a
 * document that relies on page scroll would be unreadable on desktop. Fixed +
 * overflow-y-auto scrolls independently of the body regardless of that rule.
 */
export function DocShell({
  title,
  slug,
  updated,
  children,
}: {
  title: string;
  slug: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${mono.className} fixed inset-0 overflow-y-auto doc-scroll bg-[#0a0804]`}>
      {/* globals.css hides every scrollbar; a long document needs its affordance back. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .doc-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,149,0,0.3) transparent; }
            .doc-scroll::-webkit-scrollbar { display: block; width: 10px; }
            .doc-scroll::-webkit-scrollbar-track { background: transparent; }
            .doc-scroll::-webkit-scrollbar-thumb {
              background: rgba(255,149,0,0.25);
              border: 3px solid #0a0804;
              border-radius: 6px;
            }
            .doc-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,149,0,0.4); }
          `,
        }}
      />

      {/* ━━━ TOP BAR ━━━ */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-6 py-2 border-b border-amber-500/20 bg-[#0a0804]/95 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <span className="text-amber-500 font-bold text-[10px] md:text-xs tracking-widest shrink-0">
            VEDANSH TERMINAL
          </span>
          <span className="text-amber-500/25 text-[10px] hidden sm:inline shrink-0">/</span>
          <span className="text-amber-500/45 text-[9px] md:text-[10px] tracking-wider truncate">
            {slug}
          </span>
        </div>
        <Link
          href="/"
          className="shrink-0 text-amber-500/60 hover:text-amber-300 transition-colors text-[10px] tracking-wider px-2 py-1 border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/10"
        >
          [← BACK]
        </Link>
      </header>

      {/* ━━━ DOCUMENT ━━━ */}
      <main className="mx-auto w-full max-w-[74ch] px-5 md:px-8 py-9 md:py-14">
        <h1 className="text-amber-400 font-bold text-xl md:text-2xl leading-tight tracking-tight">
          {title}
        </h1>
        {updated && (
          <p className="mt-2 text-amber-500/40 text-[11px] tracking-wider uppercase">
            Last updated: {updated}
          </p>
        )}
        <div className={`${sans.className} mt-9 space-y-11`}>{children}</div>
      </main>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="border-t border-amber-500/15 bg-amber-600/[0.06] px-4 md:px-6 py-2.5">
        <div className="mx-auto max-w-[74ch] flex items-center justify-between gap-3 text-[9px]">
          <span className="text-amber-500/45">SYS:OK · DOC RENDERED</span>
          <span className="text-amber-500/35">© {new Date().getFullYear()} VEDANSH SHARMA</span>
        </div>
      </footer>
    </div>
  );
}

/** Terminal-style section header + body. */
export function DocSection({
  heading,
  tag,
  children,
}: {
  heading: string;
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className={`${mono.className} flex items-baseline justify-between gap-3 pb-1.5 mb-4 border-b border-amber-500/20`}
      >
        <span className="text-amber-400/90 font-bold text-[13px] md:text-sm tracking-wider uppercase">
          <span className="text-amber-500/35 mr-2">▶</span>
          {heading}
        </span>
        <span className="text-amber-500/25 text-[10px] hidden sm:inline shrink-0">{tag}</span>
      </h2>
      <div className="space-y-4 text-[14px] md:text-[15px] leading-[1.75] text-[#e6c79c]">
        {children}
      </div>
    </section>
  );
}

/** Bulleted list with the site's ▸ marker. */
export function DocList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="text-amber-500/40 shrink-0 mt-[0.4em] text-[10px] leading-none">▸</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Emphasised callout for the load-bearing claims. */
export function DocCallout({
  children,
  accent = "amber",
}: {
  children: React.ReactNode;
  accent?: "amber" | "green";
}) {
  const border = accent === "green" ? "border-green-500/30" : "border-amber-500/30";
  const bg = accent === "green" ? "bg-green-500/[0.06]" : "bg-amber-500/[0.06]";
  return (
    <div className={`border-l-2 ${border} ${bg} pl-4 pr-3 py-3`}>{children}</div>
  );
}

export const docMono = mono;

import type { Metadata } from "next";
import { CONTACT } from "../../lib/portfolio";
import {
  DocShell,
  DocSection,
  DocList,
  DocCallout,
  docMono,
} from "../../components/DocShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Track Daily",
  description:
    "Privacy policy for the Track Daily browser extension: all browsing data is stored locally in your own browser and is never transmitted anywhere.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026-08-01";

const STORAGE_ROWS: { data: string; location: string; lifetime: string }[] = [
  {
    data: "Page visits, daily summaries, learned categorisations",
    location: "IndexedDB (track_daily_db)",
    lifetime: "Until the retention period expires or you delete it",
  },
  {
    data: "Settings, categories, domain overrides",
    location: "chrome.storage.local",
    lifetime: "Until you delete it",
  },
  {
    data: "The in-progress session, pending categorisations, AI result cache",
    location: "chrome.storage.session",
    lifetime: "Cleared when you close the browser",
  },
];

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      className={`${docMono.className} text-[0.9em] text-amber-300/90 bg-amber-500/10 px-1.5 py-0.5 rounded-sm`}
    >
      {children}
    </code>
  );
}

/**
 * Storage table. Rendered as a real table from md up (inside an overflow-x-auto
 * container so it can never push the page sideways) and restacked as cards
 * below that breakpoint, where three columns of prose would be unreadable.
 */
function StorageTable() {
  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden md:block -mx-1 overflow-x-auto">
        <table className="w-full min-w-[38rem] border-collapse text-[14px]">
          <caption className="sr-only">
            Where Track Daily stores each kind of data, and for how long
          </caption>
          <thead>
            <tr className="border-b border-amber-500/25">
              {["Data", "Location", "Lifetime"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className={`${docMono.className} text-left align-bottom px-3 py-2 text-amber-600/70 text-[10px] font-bold tracking-wider uppercase`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STORAGE_ROWS.map((row) => (
              <tr key={row.location} className="border-b border-amber-500/10 last:border-0">
                <td className="px-3 py-3 align-top text-[#e6c79c] leading-relaxed">{row.data}</td>
                <td className="px-3 py-3 align-top leading-relaxed">
                  <Code>{row.location}</Code>
                </td>
                <td className="px-3 py-3 align-top text-[#e6c79c] leading-relaxed">
                  {row.lifetime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {STORAGE_ROWS.map((row) => (
          <div key={row.location} className="border border-amber-500/20 bg-amber-500/[0.03] p-3.5">
            <p className="text-[#e6c79c] leading-relaxed">{row.data}</p>
            <dl className="mt-3 pt-3 border-t border-amber-500/10 space-y-2">
              <div className="flex gap-2 flex-wrap items-baseline">
                <dt
                  className={`${docMono.className} text-amber-600/70 text-[9px] font-bold tracking-wider uppercase w-16 shrink-0`}
                >
                  Location
                </dt>
                <dd className="min-w-0">
                  <Code>{row.location}</Code>
                </dd>
              </div>
              <div className="flex gap-2 flex-wrap items-baseline">
                <dt
                  className={`${docMono.className} text-amber-600/70 text-[9px] font-bold tracking-wider uppercase w-16 shrink-0`}
                >
                  Lifetime
                </dt>
                <dd className="min-w-0 text-[#e6c79c] text-[13px] leading-relaxed">
                  {row.lifetime}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}

export default function TrackDailyPrivacyPolicy() {
  return (
    <DocShell title="Privacy Policy — Track Daily" slug="privacy/track-daily" updated={LAST_UPDATED}>
      <DocSection heading="Summary" tag="// --summary">
        <p>
          Track Daily records your browsing activity so it can show it back to you. All of that data
          is stored locally in your own browser and is never transmitted anywhere. The extension
          makes no network requests to any third-party service.
        </p>
        <p>There is no server, no account, no analytics, and no telemetry.</p>
      </DocSection>

      <DocSection heading="What is collected" tag="// --collected">
        <p>The extension stores the following, locally:</p>
        <DocList
          items={[
            <>
              <strong className="text-amber-300/90 font-semibold">Page visits</strong> — URL, page
              title, domain, start and end time, and duration
            </>,
            <>
              <strong className="text-amber-300/90 font-semibold">Categories</strong> — the category
              assigned to each visit, your manual overrides, and any categories you create
            </>,
            <>
              <strong className="text-amber-300/90 font-semibold">YouTube metadata</strong> (when
              YouTube Deep Tracking is enabled) — video ID, title, channel name, video category, and
              duration, for videos you watch
            </>,
            <>
              <strong className="text-amber-300/90 font-semibold">Settings</strong> — your
              preferences, such as idle threshold and retention period
            </>,
          ]}
        />
      </DocSection>

      <DocSection heading="Where it is stored" tag="// --storage">
        <StorageTable />
        <p>All of these live inside your browser profile on your own device.</p>
      </DocSection>

      <DocSection heading="What is transmitted" tag="// --network">
        <DocCallout accent="green">
          <p className={`${docMono.className} text-green-400/90 font-bold text-lg tracking-wide`}>
            Nothing.
          </p>
        </DocCallout>
        <p>
          The extension has no backend. It contains no analytics or crash reporting. It does not
          load remote fonts, scripts, stylesheets, or images.
        </p>
        <p>
          Site icons are read from the browser&apos;s own local favicon cache via the{" "}
          <Code>favicon</Code> permission, so displaying them does not contact any server.
        </p>
      </DocSection>

      <DocSection heading="On-device AI classification" tag="// --ai">
        <p>
          The extension can optionally use the browser&apos;s built-in AI model to categorise sites
          it does not recognise.
        </p>
        <DocList
          items={[
            <>
              It is <strong className="text-amber-300/90 font-semibold">off by default</strong> and
              must be explicitly enabled in settings
            </>,
            <>
              The model runs{" "}
              <strong className="text-amber-300/90 font-semibold">entirely on your device</strong>;
              the domain and page title are given to a local model and are not sent over the network
            </>,
            <>No API key is required, and no third-party AI provider is involved</>,
            <>
              The large model download only ever starts when you click the download button yourself
            </>,
          ]}
        />
        <DocCallout>
          <p>
            Earlier versions of this extension supported sending data to external AI providers
            (OpenAI, Anthropic, Google).{" "}
            <strong className="text-amber-300/90 font-semibold">
              That capability has been removed entirely.
            </strong>{" "}
            If you had previously saved an API key, it is deleted automatically when the extension
            updates.
          </p>
        </DocCallout>
      </DocSection>

      <DocSection heading="What is never collected" tag="// --never">
        <DocList
          items={[
            <>Passwords, form contents, or anything you type</>,
            <>Page content beyond the title and meta description</>,
            <>Cookies, credentials, or authentication tokens</>,
            <>Any personally identifying information</>,
            <>
              Browsing in InPrivate or Incognito windows (unless you explicitly allow the extension
              there)
            </>,
          ]}
        />
      </DocSection>

      <DocSection heading="Your control over your data" tag="// --controls">
        <p>From the extension&apos;s options page you can:</p>
        <DocList
          items={[
            <>
              <strong className="text-amber-300/90 font-semibold">Exclude domains</strong> so they
              are never tracked
            </>,
            <>
              <strong className="text-amber-300/90 font-semibold">Set a retention period</strong> —
              data older than this is deleted automatically
            </>,
            <>
              <strong className="text-amber-300/90 font-semibold">Disable tracking</strong> entirely
              at any time
            </>,
            <>
              <strong className="text-amber-300/90 font-semibold">Clear browsing history</strong> —
              deletes all recorded visits and summaries, keeping your settings
            </>,
            <>
              <strong className="text-amber-300/90 font-semibold">Reset everything</strong> —
              deletes all data and settings, returning the extension to its initial state
            </>,
          ]}
        />
        <p>You can also export your data as a CSV file from the dashboard.</p>
        <p>Uninstalling the extension removes all of its stored data from your browser.</p>
      </DocSection>

      <DocSection heading="Data sharing" tag="// --sharing">
        <p>
          There is no data sharing. Your data is never sold, transmitted, or made available to
          anyone, including the developer, because it never leaves your device.
        </p>
      </DocSection>

      <DocSection heading="Changes" tag="// --changes">
        <p>
          If this policy changes in a way that affects what is collected or transmitted, the change
          will be described in the extension&apos;s release notes.
        </p>
      </DocSection>

      <DocSection heading="Contact" tag="// --contact">
        <p>
          Questions about this policy:{" "}
          <a
            href={CONTACT.emailLink}
            className="text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-500/40 transition-colors break-all"
          >
            {CONTACT.email}
          </a>
        </p>
      </DocSection>
    </DocShell>
  );
}

import type { Metadata } from "next";
import { PROJECTS } from "../lib/portfolio";
import { DocShell, DocSection, docMono } from "../components/DocShell";

export const metadata: Metadata = {
  title: "Licenses — Vedansh Sharma",
  description:
    "Open-source license information for the public projects by Vedansh Sharma, including the Track Daily browser extension.",
  robots: { index: true, follow: true },
};

const COPYRIGHT_HOLDER = "Vedansh Sharma";
const COPYRIGHT_YEAR = "2026";

const MIT_TEXT = `Copyright (c) ${COPYRIGHT_YEAR} ${COPYRIGHT_HOLDER}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

const TRACK_DAILY = PROJECTS.find((p) => p.name === "Track Daily");

export default function LicensesPage() {
  return (
    <DocShell title="Licenses" slug="license">
      <DocSection heading="Track Daily" tag="// --mit">
        <p>
          {TRACK_DAILY?.shortDesc ?? "Privacy-First Chrome Extension"} — released under the{" "}
          <strong className="text-amber-300/90 font-semibold">MIT License</strong>.
        </p>
        <pre
          className={`${docMono.className} overflow-x-auto border border-amber-500/20 bg-amber-500/[0.03] p-4 text-[12px] leading-[1.7] text-[#e6c79c] whitespace-pre-wrap break-words`}
        >
          {MIT_TEXT}
        </pre>
      </DocSection>

      <DocSection heading="Other projects" tag="// --other">
        <p>
          License terms for the other public projects are declared in each project&apos;s own
          repository. Where a repository contains no license file, no license is granted and all
          rights are reserved.
        </p>
      </DocSection>

      <DocSection heading="This site" tag="// --site">
        <p>
          The content of this site — text, layout and design — is © {COPYRIGHT_YEAR}{" "}
          {COPYRIGHT_HOLDER}. The third-party libraries it is built on remain under their own
          respective licenses.
        </p>
      </DocSection>
    </DocShell>
  );
}

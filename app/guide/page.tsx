import type { Metadata } from "next";
import Link from "next/link";
import SiteShell, { EdDiscussionLogo } from "../components/site-shell";

export const metadata: Metadata = {
  title: "Student Guide",
  description:
    "Open the ENGG2202 Notion guide for Gate tasks, methods, resources, templates and checkpoint instructions.",
  alternates: { canonical: "https://active-learning-kyle.github.io/ENGG2202-Teach-to-Learn/guide/" },
};

const notionGuideUrl =
  "https://tasty-vicuna-87f.notion.site/ENGG2202-Teach-to-Learn-Student-Guide-3cb402ed073681a4aef4eaf93f3dd67d";
const edDiscussionUrl = "https://edstem.org/au/courses/41087/lessons";

const guideContents = [
  ["01", "Gate task", "The decision your team needs to make and the evidence required before review."],
  ["02", "Methods and examples", "Practical ways to investigate, plan, build, test and document the work."],
  ["03", "Templates and tools", "Working formats for research, project planning, GitHub, AI use and release preparation."],
  ["04", "Checkpoint instructions", "The exact submission format for the Gate, with links to the relevant course platform."],
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export default function StudentGuidePage() {
  return (
    <SiteShell>
      <main>
        <section className="overflow-hidden bg-[#123d24] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8d8bf]">ENGG2202 Student Guide</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Detailed help
                <span className="block text-[#d7f43c]">for the Gate you are working on.</span>
              </h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-lg leading-9 text-white/78">
                The Project Journey explains the six Gates. The Notion guide provides the working materials for completing them.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href={notionGuideUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d7f43c] px-5 py-3 text-sm font-bold text-[#17351f] transition hover:-translate-y-0.5 hover:bg-[#e7fa76]">
                  Open the Notion Student Guide <ArrowIcon />
                </a>
                <a href={edDiscussionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/16">
                  <EdDiscussionLogo className="h-6 w-6 text-[0.7rem]" /> Ed Discussion <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Inside the Notion guide</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#143421]">Open the page for your current Gate.</h2>
              <p className="mt-5 text-base leading-8 text-[#506656]">Use the guide when you need to begin a task, choose a method or prepare a checkpoint submission.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {guideContents.map(([number, title, copy]) => (
                <article key={number} className="rounded-[1.6rem] border border-[#d4e1d6] bg-white p-6">
                  <p className="text-xs font-bold tracking-[0.16em] text-[#78907d]">{number}</p>
                  <h3 className="mt-6 text-xl font-semibold text-[#173823]">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#526858]">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#d7e4d9] bg-[#eef6ec] px-5 py-14 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[90rem] gap-4 md:grid-cols-3">
            <Link href="/engg2202" className="group rounded-[1.7rem] border border-[#d1dfd3] bg-white p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#718776]">Need the overall route?</p>
              <h2 className="mt-4 text-2xl font-semibold text-[#173823]">Return to the Project Journey.</h2>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#226439]">View all six Gates <ArrowIcon /></span>
            </Link>
            <a href={notionGuideUrl} target="_blank" rel="noopener noreferrer" className="group rounded-[1.7rem] bg-[#153f27] p-7 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b9d8bf]">Ready to work?</p>
              <h2 className="mt-4 text-2xl font-semibold">Open the detailed Notion guide.</h2>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#d7f43c]">Choose your Gate <ArrowIcon /></span>
            </a>
            <a href={edDiscussionUrl} target="_blank" rel="noopener noreferrer" className="group rounded-[1.7rem] border border-[#d6d0ec] bg-white p-7 text-[#30294f]">
              <div className="flex items-center gap-2.5"><EdDiscussionLogo className="h-8 w-8 text-sm" /><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c5c9b]">Questions and course discussion</p></div>
              <h2 className="mt-4 text-2xl font-semibold">Ask the class on Ed.</h2>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#684fc4]">Open ENGG2202 Ed Discussion <ArrowIcon /></span>
            </a>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

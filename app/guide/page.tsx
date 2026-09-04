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
const engineeringCompassUrl =
  "https://active-learning-kyle.github.io/engineering-compass/";
const engineeringCompassSourceUrl =
  "https://github.com/Active-Learning-Kyle/engineering-compass";

const engineeringRoles = [
  "Problem Framer",
  "Project Navigator",
  "Team Connector",
  "Practical Builder",
  "Prototype Explorer",
  "Solution Storyteller",
];

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

        <section id="engineering-compass" className="scroll-mt-20 border-b border-[#d7e4d9] bg-[#eef6ec] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto grid max-w-[90rem] overflow-hidden rounded-[2rem] border border-[#cadbcd] bg-white shadow-[0_30px_80px_-58px_rgba(15,60,32,0.5)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Before Gate 01 · optional self-reflection</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#143421] sm:text-5xl">
                Find how you can contribute before choosing what to build.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#506656]">
                Engineering Compass helps you reflect on how you work in a team, the technical areas you have practised and one direction you want to develop next.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "30 questions",
                  "8–10 minutes",
                  "English + 繁體中文",
                  "Answers stay in your browser",
                ].map((item) => (
                  <span key={item} className="rounded-full bg-[#edf4ed] px-3 py-2 text-xs font-semibold text-[#41614a]">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href={engineeringCompassUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f28] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#245d38]">
                  Open Engineering Compass <ArrowIcon />
                </a>
                <a href={engineeringCompassSourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#bfd0c2] bg-white px-5 py-3 text-sm font-bold text-[#234d31] transition hover:-translate-y-0.5 hover:border-[#4b8259]">
                  View the open-source project <ArrowIcon />
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden bg-[#123d24] p-7 text-white sm:p-10 lg:p-12">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[3rem] border-[#d7f43c]/10" aria-hidden="true" />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8d8bf]">Six current ways of contributing</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {engineeringRoles.map((role, index) => (
                    <div key={role} className="rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-sm">
                      <span className="text-[0.65rem] font-bold tracking-[0.16em] text-[#d7f43c]">0{index + 1}</span>
                      <p className="mt-2 text-base font-semibold text-white">{role}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 border-t border-white/15 pt-5 text-sm leading-7 text-white/72">
                  Use the result to start a team conversation or choose a growth goal. It is a reflection prompt—not a grade, ranking or fixed team role.
                </p>
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

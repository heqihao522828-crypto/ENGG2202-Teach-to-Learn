import type { Metadata } from "next";
import Image from "next/image";
import SiteShell from "../components/site-shell";
import StageArtwork from "../components/stage-artwork";
import { imagePath } from "../lib/image-path";

export const metadata: Metadata = {
  title: "Student Guide",
  description:
    "A clear six-Gate route through ENGG2202, with detailed Notion guidance, methods, resources and checkpoints.",
};

const gateNames = [
  { title: "Challenge Focus", verb: "Focus", note: "Choose a meaningful Green Technology direction", left: "12%", top: "72%" },
  { title: "Problem Validation", verb: "Define", note: "Find stakeholder and baseline evidence", left: "28%", top: "45%" },
  { title: "Proposal & Plan", verb: "Plan", note: "Choose and justify a responsible route", left: "45%", top: "66%" },
  { title: "First Working Version", verb: "Learn", note: "Build the smallest useful version", left: "61%", top: "38%" },
  { title: "Test & Iteration", verb: "Improve", note: "Use evidence to revise the work", left: "77%", top: "58%" },
  { title: "Teach, Share & Release", verb: "Contribute", note: "Leave something others can build on", left: "89%", top: "27%" },
];

const notionGuideUrl =
  "https://tasty-vicuna-87f.notion.site/ENGG2202-Teach-to-Learn-Student-Guide-3cb402ed073681a4aef4eaf93f3dd67d";

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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8d8bf]">ENGG2202 Teach to Learn · Student Guide</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                A visible route.
                <span className="block text-[#d7f43c]">Practical help at every Gate.</span>
              </h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-lg leading-9 text-white/78">
                Use this page to see where your team is going. Open the Notion
                guide when you need the detailed task, examples, methods,
                resources and checkpoint for the Gate you are working on.
              </p>
              <a href={notionGuideUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#d7f43c] px-5 py-3 text-sm font-bold text-[#17351f] transition hover:-translate-y-0.5 hover:bg-[#e7fa76]">
                Open the full Notion Student Guide
                <ArrowIcon />
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.58fr_1.42fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Why this guide exists</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#143421]">Know the next decision without losing sight of the whole project.</h2>
              <p className="mt-5 text-base leading-8 text-[#506656]">
                The six Gates give your team a shared path, not a fixed recipe.
                Each Gate asks for a decision supported by evidence. If new
                evidence changes the decision, return to the earlier Gate and
                improve it.
              </p>
              <div className="mt-7 rounded-2xl bg-[#edf5ec] p-5 text-sm leading-7 text-[#36553f]">
                <strong className="text-[#173f28]">The route is visible from the start.</strong><br />Your team still owns the challenge, technology, pace and final contribution.
              </div>
            </div>

            <div>
              <div className="relative hidden min-h-[640px] overflow-hidden rounded-[2.2rem] border border-[#ccddcf] bg-[#e9f3e5] shadow-[0_32px_90px_-58px_rgba(15,60,32,0.5)] lg:block">
                <Image src={imagePath("/images/teach-to-learn/guide-country-path.webp")} alt="A gentle countryside path connecting six project Gates through a green technology landscape" fill preload sizes="(min-width: 1024px) 65vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/38 via-transparent to-[#123d24]/14" />
                <div className="absolute left-7 top-7 max-w-sm rounded-2xl border border-white/60 bg-white/78 p-4 shadow-sm backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#64806b]">Six connected decisions</p>
                  <p className="mt-2 text-sm leading-6 text-[#54705c]">Follow the path forward. Use evidence to decide when to continue and when to return to an earlier Gate.</p>
                </div>
                <ol>
                  {gateNames.map((gate, index) => (
                    <li key={gate.title} className="absolute w-[10.5rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/75 bg-white/90 shadow-[0_18px_45px_-25px_rgba(7,40,20,0.75)] backdrop-blur-sm" style={{ left: gate.left, top: gate.top }}>
                      <StageArtwork stage={String(index + 1).padStart(2, "0")} className="h-16 w-full" sizes="168px" compact />
                      <div className="flex items-start gap-2.5 p-3">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.68rem] font-bold ${index === 5 ? "bg-[#d7f43c] text-[#17351f]" : "bg-[#173f28] text-white"}`}>0{index + 1}</span>
                        <div><p className="text-xs font-bold leading-4 text-[#21452d]">{gate.verb}</p><p className="mt-1 text-[0.6rem] leading-3 text-[#627568]">{gate.note}</p></div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <ol className="relative grid gap-3 pl-7 lg:hidden before:absolute before:bottom-8 before:left-3 before:top-8 before:w-1 before:rounded-full before:bg-[#c3d4c4]">
                {gateNames.map((gate, index) => (
                  <li key={gate.title} className="relative flex items-center gap-4 rounded-2xl border border-[#d4e1d6] bg-white p-4">
                    <span className="absolute -left-[1.45rem] h-3 w-3 rounded-full bg-[#d7f43c] ring-4 ring-[#f7faf6]" />
                    <StageArtwork stage={String(index + 1).padStart(2, "0")} className="h-14 w-14 shrink-0 rounded-xl" sizes="56px" compact />
                    <div><p className="text-[0.65rem] font-bold tracking-[0.14em] text-[#72907a]">0{index + 1}</p><p className="text-sm font-semibold text-[#23422d]">{gate.verb} · {gate.title}</p><p className="mt-1 text-xs text-[#748579]">{gate.note}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-y border-[#d7e4d9] bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto grid max-w-[90rem] gap-8 overflow-hidden rounded-[2rem] border border-[#d2e0d4] bg-[#f5faf4] p-7 sm:p-9 lg:grid-cols-[0.72fr_1.28fr] lg:p-11">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Your detailed working guide</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#143421]">Open the detailed guide for the Gate you are working on.</h2>
              <p className="mt-5 text-sm leading-7 text-[#506656]">The Notion guide brings together the task, useful links, AI and research tools, templates, examples and the Ed Discussion checkpoint for each Gate.</p>
              <a href={notionGuideUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#173f28] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#245d38]">Open the full Student Guide <ArrowIcon /></a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[['01', 'Understand the Gate', 'What the team is deciding, why it matters and what not to overcomplicate.'], ['02', 'Use the right methods', 'Practical moves, prompts, links and examples that help the team begin.'], ['03', 'Keep useful evidence', 'The minimum record needed to explain the decision and improve it later.'], ['04', 'Complete the checkpoint', 'A clear team submission structure before requesting review and moving on.']].map(([number, title, copy]) => (
                <article key={number} className="rounded-2xl bg-white p-5 shadow-[0_16px_45px_-38px_rgba(15,60,32,0.5)]"><p className="text-xs font-bold tracking-[0.16em] text-[#78907d]">{number}</p><h3 className="mt-5 text-lg font-semibold text-[#173823]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#5a6e5f]">{copy}</p></article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

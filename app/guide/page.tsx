import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "../components/site-shell";
import { imagePath } from "../lib/image-path";

export const metadata: Metadata = {
  title: "Student Guide",
  description:
    "How ENGG2202 project guidance, tools and checkpoint materials are released one project Gate at a time.",
};

const gateNames = [
  { title: "Challenge Focus", note: "Choose a meaningful direction", left: "11%", top: "65%" },
  { title: "Problem Validation", note: "Find stakeholder evidence", left: "24%", top: "35%" },
  { title: "Proposal & Plan", note: "Justify a responsible route", left: "40%", top: "66%" },
  { title: "First Working Version", note: "Learn, adapt and make", left: "57%", top: "34%" },
  { title: "Test & Iteration", note: "Use evidence to improve", left: "72%", top: "62%" },
  { title: "Share, Teach & Release", note: "Create value for an audience", left: "87%", top: "25%" },
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
        <section className="bg-[#123d24] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8d8bf]">Student workspace</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                One Gate at a time.
                <span className="block text-[#d7f43c]">One useful decision at a time.</span>
              </h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-lg leading-9 text-white/78">
                This website shows the complete project map. The Notion guide
                provides the detailed instructions, methods, tools and
                checkpoint template for the Gate currently released by the instructor.
              </p>
              <div className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#d7f43c] px-5 py-3 text-sm font-bold text-[#17351f]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#347344]" aria-hidden="true" />
                Stage 1 guide · preparing for release
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">How release works</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#143421]">You can see the destination without receiving every instruction at once.</h2>
              <p className="mt-5 text-base leading-8 text-[#506656]">
                The full journey stays visible so teams can plan ahead. Detailed
                materials are released progressively so the current decision
                remains clear and the instructor can improve later stages before use.
              </p>
            </div>
            <div>
              <div className="relative hidden min-h-[690px] overflow-hidden rounded-[2.2rem] border border-[#ccddcf] bg-[#dcebdd] shadow-[0_32px_90px_-58px_rgba(15,60,32,0.5)] lg:block">
                <Image
                  src={imagePath("/images/teach-to-learn/six-stage-green-journey.png")}
                  alt="A winding path through a Green Technology landscape with six project-stage stops"
                  fill
                  sizes="64vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2e1a]/30 via-transparent to-white/12" />
                <ol>
                  {gateNames.map((gate, index) => (
                    <li
                      key={gate.title}
                      className="absolute w-[10.5rem] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/70 bg-white/92 p-3 shadow-[0_15px_40px_-24px_rgba(7,40,20,0.7)] backdrop-blur"
                      style={{ left: gate.left, top: gate.top }}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.68rem] font-bold ${index === 5 ? "bg-[#d7f43c] text-[#17351f]" : "bg-[#173f28] text-white"}`}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="text-xs font-bold leading-4 text-[#21452d]">{gate.title}</p>
                          <p className="mt-1 text-[0.64rem] leading-4 text-[#627568]">{gate.note}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="absolute bottom-5 left-5 rounded-full bg-[#133c25]/90 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.13em] text-white backdrop-blur">
                  The route can loop back when evidence changes the decision
                </div>
              </div>

              <ol className="grid gap-3 sm:grid-cols-2 lg:hidden">
                {gateNames.map((gate, index) => (
                  <li key={gate.title} className="flex items-center gap-4 rounded-2xl border border-[#d4e1d6] bg-white p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9f3e9] text-xs font-bold text-[#2d6740]">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#23422d]">{gate.title}</p>
                      <p className="mt-1 text-xs text-[#748579]">{gate.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-y border-[#d7e4d9] bg-white px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[90rem]">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Inside each released Gate</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#143421]">Resources appear beside the decision that needs them.</h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["01", "Decision", "What engineering judgement is the team making now?"],
                ["02", "Action", "What should the team investigate, build or test?"],
                ["03", "Support", "Which method, tool, example or AI workflow can remove an obstacle?"],
                ["04", "Evidence", "What must remain for feedback, revision and the checkpoint?"],
              ].map(([number, title, copy]) => (
                <article key={number} className="rounded-[1.7rem] bg-[#eef5ed] p-6">
                  <p className="text-xs font-bold tracking-[0.15em] text-[#6e8673]">{number}</p>
                  <h3 className="mt-7 text-xl font-semibold text-[#173923]">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#526858]">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[90rem] gap-6 px-5 py-16 sm:px-8 lg:grid-cols-3 lg:px-10 lg:py-24">
          <article className="rounded-[2rem] border border-[#d3e0d5] bg-white p-7 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Student guide · Notion</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#153522]">The working manual for the current Gate.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#506656]">
              Use it during independent work and bring questions, uncertainty
              and evidence back to Tuesday Studio. Reading the page is not the
              active learning; using it to make, test and revise a decision is.
            </p>
            <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#edf4ed] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#4f6b56]">
              No student Gate has been publicly released yet
            </p>
          </article>

          <article className="rounded-[2rem] bg-[#d7f43c] p-7 text-[#17351f]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#42601f]">Tool index</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">A simple directory, not another syllabus.</h2>
            <p className="mt-4 text-sm leading-7 text-[#3f5526]">Browse tools by name, link and main purpose. Use the Gate guide for context and recommended methods.</p>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.1em] text-[#52662f]">Added progressively beside each released Gate</p>
          </article>

          <div className="lg:col-span-3 flex flex-col gap-5 rounded-[2rem] border border-[#d6e3d7] bg-[#f0f6ef] p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#627a67]">Need the full map?</p>
              <p className="mt-2 text-lg font-semibold text-[#23442e]">Return to the six-stage journey at any time.</p>
            </div>
            <Link href="/engg2202" className="inline-flex items-center gap-2 text-sm font-bold text-[#29643b]">
              View Project Journey
              <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

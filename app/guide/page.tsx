import type { Metadata } from "next";
import SiteShell from "../components/site-shell";
import StageArtwork from "../components/stage-artwork";

export const metadata: Metadata = {
  title: "Student Guide",
  description:
    "How ENGG2202 project guidance, tools and checkpoint materials are released one project Gate at a time.",
};

const gateNames = [
  { title: "Challenge Focus", note: "Choose a meaningful direction", left: "14%", top: "70%" },
  { title: "Problem Validation", note: "Find stakeholder evidence", left: "26%", top: "34%" },
  { title: "Proposal & Plan", note: "Justify a responsible route", left: "42%", top: "68%" },
  { title: "First Working Version", note: "Learn, adapt and make", left: "58%", top: "31%" },
  { title: "Test & Iteration", note: "Use evidence to improve", left: "74%", top: "64%" },
  { title: "Share, Teach & Release", note: "Create value for an audience", left: "86%", top: "25%" },
];

const notionGuideUrl =
  "https://app.notion.com/p/3cb402ed073681a4aef4eaf93f3dd67d?pvs=204";

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
              <a
                href={notionGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#d7f43c] px-5 py-3 text-sm font-bold text-[#17351f] transition hover:-translate-y-0.5 hover:bg-[#e7fa76]"
              >
                Open Notion Student Guide
                <ArrowIcon />
              </a>
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
              <div className="relative hidden min-h-[610px] overflow-hidden rounded-[2.2rem] border border-[#ccddcf] bg-[radial-gradient(circle_at_50%_45%,#ffffff_0%,#f2f8f0_48%,#e2efe1_100%)] shadow-[0_32px_90px_-58px_rgba(15,60,32,0.5)] lg:block">
                <svg viewBox="0 0 1000 560" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <path
                    d="M82 397 C145 392 170 198 250 190 S336 390 410 385 S486 178 565 174 S655 365 735 358 S820 142 916 138"
                    fill="none"
                    stroke="#82a78b"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="2 22"
                  />
                  <path
                    d="M86 397 C150 390 174 202 250 190 S336 390 410 385 S486 178 565 174 S655 365 735 358 S820 142 914 138"
                    fill="none"
                    stroke="#d7f43c"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="18 24"
                  />
                  <g fill="#5b9767" opacity="0.48">
                    <circle cx="146" cy="302" r="6" />
                    <circle cx="338" cy="297" r="5" />
                    <circle cx="506" cy="277" r="6" />
                    <circle cx="672" cy="284" r="5" />
                    <circle cx="838" cy="222" r="6" />
                  </g>
                </svg>
                <div className="absolute left-8 top-8 max-w-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#64806b]">Six connected decisions</p>
                  <p className="mt-2 text-sm leading-6 text-[#54705c]">The line shows the normal direction of travel. Evidence can send a team back to an earlier decision.</p>
                </div>
                <ol>
                  {gateNames.map((gate, index) => (
                    <li
                      key={gate.title}
                      className="absolute w-[10.5rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[#cbdccd] bg-white shadow-[0_15px_40px_-24px_rgba(7,40,20,0.7)]"
                      style={{ left: gate.left, top: gate.top }}
                    >
                      <StageArtwork stage={String(index + 1).padStart(2, "0")} className="h-16 w-full" sizes="168px" compact />
                      <div className="flex items-start gap-2.5 p-3">
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
                <div className="absolute bottom-5 left-5 rounded-full bg-[#133c25] px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.13em] text-white">
                  The route can loop back when evidence changes the decision
                </div>
              </div>

              <ol className="relative grid gap-3 pl-7 lg:hidden before:absolute before:bottom-8 before:left-3 before:top-8 before:border-l-2 before:border-dashed before:border-[#8eaa94]">
                {gateNames.map((gate, index) => (
                  <li key={gate.title} className="relative flex items-center gap-4 rounded-2xl border border-[#d4e1d6] bg-white p-4">
                    <span className="absolute -left-[1.45rem] h-3 w-3 rounded-full bg-[#d7f43c] ring-4 ring-[#f7faf6]" />
                    <StageArtwork stage={String(index + 1).padStart(2, "0")} className="h-14 w-14 shrink-0 rounded-xl" sizes="56px" compact />
                    <div>
                      <p className="text-[0.65rem] font-bold tracking-[0.14em] text-[#72907a]">{String(index + 1).padStart(2, "0")}</p>
                      <p className="text-sm font-semibold text-[#23422d]">{gate.title}</p>
                      <p className="mt-1 text-xs text-[#748579]">{gate.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-t border-[#d7e4d9] bg-white px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
          <div className="flex flex-col gap-5 rounded-[2rem] bg-[#173f28] p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8d8bf]">Current working material</p>
              <p className="mt-3 text-xl font-semibold">Open the released Gate in Notion, use it during independent work, and bring your evidence and questions to Tuesday Studio.</p>
            </div>
            <a
              href={notionGuideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#d7f43c] px-5 py-3 text-sm font-bold text-[#17351f] transition hover:bg-[#e7fa76]"
            >
              Open Notion Student Guide
              <ArrowIcon />
            </a>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

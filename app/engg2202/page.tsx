import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "../components/site-shell";
import StageArtwork from "../components/stage-artwork";

export const metadata: Metadata = {
  title: "Project Journey",
  description:
    "The six-stage ENGG2202 project journey from challenge focus to responsible teaching and release.",
};

const stages = [
  {
    number: "01",
    title: "Challenge Focus",
    verb: "Focus",
    color: "#16734b",
    question:
      "Which challenge, context and possible stakeholder are worth investigating next?",
    why: "A technology is not yet a problem. Start broad enough to compare directions before committing.",
    actions: ["Form the team", "Explore challenge areas", "Separate facts from assumptions"],
    evidence:
      "Directions considered, initial context, possible stakeholder, theme link and unanswered questions.",
    starters: ["SDG target scan", "Context map", "Assumption log"],
    discussion:
      "Why this direction? What evidence might make the team change it?",
  },
  {
    number: "02",
    title: "Problem Validation",
    verb: "Define",
    color: "#187b8e",
    question:
      "Is this a real, important and bounded problem—and what evidence supports that claim?",
    why: "Teams need a stakeholder, context and baseline before judging any solution.",
    actions: ["Observe and ask", "Map existing solutions", "Define scope and success"],
    evidence:
      "Stakeholder evidence, baseline, sourced landscape, problem statement, scope and success criteria.",
    starters: ["Interview or observation", "Baseline", "Existing-solution scan"],
    discussion:
      "Which claim is strongest? Which remains an assumption? Could buy or borrow be better?",
  },
  {
    number: "03",
    title: "Proposal & Plan",
    verb: "Plan",
    color: "#2f7d32",
    question:
      "Which solution direction should the team pursue, and what plan makes it responsible?",
    why: "A proposal makes trade-offs, uncertainty and feasibility discussable before major commitment.",
    actions: ["Compare buy, borrow, adapt and build", "Set requirements", "Plan learning and risk"],
    evidence:
      "Alternatives, selection rationale, architecture, BOM, budget, risks, schedule and learning plan.",
    starters: ["Decision matrix", "Budget & BOM", "Risk & schedule"],
    discussion:
      "Which criterion changed the decision? What is the cheapest useful experiment?",
  },
  {
    number: "04",
    title: "First Working Version",
    verb: "Learn",
    color: "#c48610",
    question:
      "What can the first inspectable version demonstrate, and what can it not yet claim?",
    why: "A small real version teaches more than a long period of invisible planning.",
    actions: ["Study and reproduce relevant work", "Build the smallest useful version", "Record source and licence"],
    evidence:
      "Build instructions, files, photos or logs, failures, limitations and another person’s reproduction attempt.",
    starters: ["Open-source review", "Rapid prototype", "Reproduction test"],
    discussion:
      "What failed? Could another person repeat it? What must be proven before real-world use?",
  },
  {
    number: "05",
    title: "Test & Iteration",
    verb: "Improve",
    color: "#d15b28",
    question:
      "What does the evidence justify us to keep, revise, return to the bench or use only as reference?",
    why: "Testing should support a decision, not stage a successful demo.",
    actions: ["Define acceptance and stop conditions", "Collect evidence and anomalies", "Revise and retest"],
    evidence:
      "Method, raw data, observations, uncertainty, feedback, revision and a justified next-step decision.",
    starters: ["Test matrix", "Failure analysis", "Decision log"],
    discussion:
      "Which observation would change the decision? Is the result repeatable and safe?",
  },
  {
    number: "06",
    title: "Share, Teach & Release",
    verb: "Teach",
    color: "#7d3fa0",
    question:
      "Who should receive this work, in what form, and what is safe and ready to release?",
    why: "Engineering knowledge creates value when another person can understand, question or use it.",
    actions: ["Choose a real audience", "Teach and observe difficulty", "Complete a release review"],
    evidence:
      "Outcome, audience response, revised material, repository, attribution, reflection and release decision.",
    starters: ["Audience map", "Teaching test", "Release review"],
    discussion:
      "What can another person use? What must be redacted? Which claim is still too strong?",
  },
];

const releaseFormats = [
  { type: "build", label: "Build", title: "Functional prototype or open-source system", copy: "Show how it works, how it was tested and what another team would need to continue.", visualClass: "bg-[#dfeede] text-[#17452b]", dark: false },
  { type: "teach", label: "Teach", title: "Workshop, tutorial or teaching kit", copy: "Observe learners using the material, then revise it from their questions and difficulty.", visualClass: "bg-[#173f28] text-white", dark: true },
  { type: "communicate", label: "Communicate", title: "Presentation, report, poster or conference paper", copy: "Make the evidence, trade-offs and limits understandable to a defined audience.", visualClass: "bg-[#f2ebcf] text-[#51491f]", dark: false },
  { type: "film", label: "Film", title: "Project film, video essay or short documentary", copy: "Record decisions, failures, testing and learning—not only the final result or a highlight reel.", visualClass: "bg-[#0f3521] text-white", dark: true },
  { type: "showcase", label: "Showcase", title: "Competition entry or stakeholder demonstration", copy: "Use external questions and feedback to test the project under real judgement.", visualClass: "bg-[#dcecf0] text-[#164b58]", dark: false },
  { type: "contribute", label: "Contribute", title: "Public repository, community resource or startup validation", copy: "Release something useful with attribution, safety, privacy and claims checked.", visualClass: "bg-[#d7f43c] text-[#17351f]", dark: false },
];

const evidenceSteps = [
  { number: "01", label: "Act", position: "left-1/2 top-0 -translate-x-1/2" },
  { number: "02", label: "Keep evidence", position: "right-0 top-[27%]" },
  { number: "03", label: "Get feedback", position: "right-[8%] bottom-[4%]" },
  { number: "04", label: "Revise", position: "left-[8%] bottom-[4%]" },
  { number: "05", label: "Transfer", position: "left-0 top-[27%]" },
] as const;

const notionGuideUrl =
  "https://app.notion.com/p/3cb402ed073681a4aef4eaf93f3dd67d?pvs=204";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

function OutputIcon({ type }: { type: string }) {
  const common = "h-10 w-10";

  if (type === "build") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className={common} aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.7 7.5 4.2 7.5-4.2M12 12v9" /></svg>;
  }
  if (type === "teach") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true"><rect x="3" y="3" width="18" height="12" rx="2" /><path d="m8 10 2.2-2.2L13 10.6l3-3M8 21v-1.2a3 3 0 0 1 6 0V21M11 17.2a2 2 0 1 0 0-4" /></svg>;
  }
  if (type === "communicate") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true"><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 12h6M9 16h6" /></svg>;
  }
  if (type === "film") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9 5 3-5 3V9Z" /></svg>;
  }
  if (type === "showcase") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true"><path d="M8 4h8v4a4 4 0 0 1-8 0V4ZM9 20h6M12 12v8" /><path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true"><circle cx="6" cy="12" r="2.2" /><circle cx="18" cy="6" r="2.2" /><circle cx="18" cy="18" r="2.2" /><path d="m8 11 7.8-4M8 13l7.8 4" /></svg>;
}

function EvidenceLoop() {
  return (
    <div className="mb-12 overflow-hidden rounded-[2.2rem] bg-[#123d24] p-7 text-white sm:p-9 lg:p-11">
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b9d9bf]">Active-learning evidence loop</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Do more than complete an activity.</h2>
          <p className="mt-5 text-base leading-8 text-white/76">
            An experience becomes learning when evidence and feedback change
            the next attempt—and when the team can use that learning again in
            a new context.
          </p>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[26rem]" role="img" aria-label="Active-learning loop: act, keep evidence, get feedback, revise and transfer">
          <svg viewBox="0 0 420 420" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <marker id="loop-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0 0 10 5 0 10Z" fill="#d7f43c" />
              </marker>
            </defs>
            <path d="M210 54a156 156 0 1 1-2 0" fill="none" stroke="#d7f43c" strokeWidth="5" strokeLinecap="round" strokeDasharray="5 14" markerEnd="url(#loop-arrow)" />
          </svg>
          <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-white/8 p-3 text-center shadow-[0_20px_55px_-30px_rgba(0,0,0,0.7)] backdrop-blur-sm sm:h-32 sm:w-32 sm:p-5">
            <p className="text-[0.68rem] font-semibold leading-4 text-[#eff8ec] sm:text-sm sm:leading-5">Evidence changes the next action.</p>
          </div>
          {evidenceSteps.map((step) => (
            <div key={step.number} className={`absolute flex h-[4.2rem] w-20 flex-col items-center justify-center rounded-xl border border-white/14 bg-[#245b38] px-1.5 text-center shadow-[0_18px_45px_-30px_rgba(0,0,0,0.85)] sm:h-[4.8rem] sm:w-[6.5rem] sm:rounded-2xl sm:px-2 ${step.position}`}>
              <span className="text-[0.6rem] font-bold tracking-[0.15em] text-[#b9d8bf]">{step.number}</span>
              <span className="mt-1 text-xs font-bold leading-4 text-white">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectJourneyPage() {
  return (
    <SiteShell>
      <main>
        <section className="border-b border-[#d7e5d9] bg-[#eef6ec]">
          <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end lg:px-10 lg:py-28">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4d7459]">ENGG2202 Project Journey</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#11301d] sm:text-6xl lg:text-7xl">
                Six decisions.
                <span className="block text-[#32844a]">One evolving project.</span>
              </h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-lg leading-9 text-[#465f4d]">
                The gates make progress visible without forcing every team into
                the same weekly sequence. Move forward with evidence, return
                when assumptions fail, and use Tuesday Studio to discuss the
                decision—not simply report activity.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/guide" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f28] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#245d38]">
                  How staged guides work
                  <ArrowIcon />
                </Link>
                <a
                  href={notionGuideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#a9c0ae] bg-white px-5 py-3 text-sm font-bold text-[#31573c] transition hover:border-[#2c7140]"
                >
                  Open Notion Student Guide
                  <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <EvidenceLoop />

          <div className="space-y-8">
            {stages.map((stage) => (
              <article id={`stage-${stage.number}`} key={stage.number} className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-[#d2e0d4] bg-white shadow-[0_24px_72px_-54px_rgba(15,60,32,0.35)]">
                <div className="grid lg:grid-cols-[0.38fr_0.62fr]">
                  <div className="relative flex min-h-[410px] flex-col overflow-hidden text-white" style={{ backgroundColor: stage.color }}>
                    <StageArtwork
                      stage={stage.number}
                      className="h-44 w-full shrink-0 border-b border-white/20 sm:h-52"
                      sizes="(min-width: 1024px) 38vw, 100vw"
                    />
                    <div className="relative flex flex-1 flex-col p-7 sm:p-9">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_52%)]" />
                      <div className="relative">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/72">Gate {stage.number}</p>
                        <p className="mt-5 text-5xl font-semibold tracking-[-0.05em]">{stage.verb}</p>
                        <h2 className="mt-3 text-xl font-semibold text-white/92">{stage.title}</h2>
                        <p className="mt-6 border-t border-white/25 pt-5 text-base leading-7 text-white/88">{stage.question}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-7 sm:p-9 lg:p-10">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#54715c]">Why this matters</h3>
                        <p className="mt-3 text-sm leading-7 text-[#435b4b]">{stage.why}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#54715c]">What to do</h3>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-[#435b4b]">
                          {stage.actions.map((action) => (
                            <li key={action} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: stage.color }} />{action}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#54715c]">Evidence to keep</h3>
                        <p className="mt-3 text-sm leading-7 text-[#435b4b]">{stage.evidence}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#54715c]">Useful starting points</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {stage.starters.map((item) => (
                            <span key={item} className="rounded-full bg-[#edf4ed] px-3 py-2 text-xs font-semibold text-[#41614a]">{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-7 border-t border-[#dde7df] pt-7">
                      <div className="rounded-2xl bg-[#f7f4e8] p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#776a3a]">Tuesday Studio prompt</p>
                        <p className="mt-2 text-sm leading-6 text-[#554e34]">{stage.discussion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-16 rounded-[2.2rem] border border-[#d1dfd3] bg-[#eef6ec] p-7 sm:p-9 lg:p-11">
            <div className="grid gap-7 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Gate 06 · output menu</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#143421]">Different forms. The same evidence standard.</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-[#506656] lg:justify-self-end">
                Teams may combine formats. The final choice should fit the
                audience and the value created, while making the learning
                process, evidence, feedback and revision visible.
              </p>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {releaseFormats.map((format, index) => (
                <article key={format.label} className="group overflow-hidden rounded-[1.7rem] border border-[#cfddcf] bg-white text-[#183822] shadow-[0_20px_55px_-44px_rgba(15,60,32,0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_-40px_rgba(15,60,32,0.58)]">
                  <div className={`relative flex h-24 items-center justify-center overflow-hidden sm:h-36 ${format.visualClass}`}>
                    <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border-[22px] border-current opacity-10" />
                    <span className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border border-current/12 sm:h-20 sm:w-20 sm:rounded-[1.4rem] ${format.dark ? "bg-white/10" : "bg-white/70"}`}>
                      <OutputIcon type={format.type} />
                    </span>
                    <span className={`absolute left-3 top-3 rounded-full px-2 py-1 text-[0.58rem] font-bold tracking-[0.12em] sm:left-5 sm:top-5 sm:px-2.5 sm:text-[0.62rem] sm:tracking-[0.14em] ${format.dark ? "bg-white/12 text-white" : "bg-white/78 text-current"}`}>0{index + 1}</span>
                  </div>
                  <div className="p-4 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#628069]">{format.label}</p>
                    <h3 className="mt-3 text-base font-semibold leading-6 tracking-[-0.02em] sm:mt-5 sm:text-xl">{format.title}</h3>
                    <p className="mt-3 hidden text-sm leading-7 text-[#526858] sm:block">{format.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="bg-[#173f28] px-5 py-16 text-white sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bad7c0]">Detailed guidance is released one Gate at a time</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">See the whole journey here. Work on the current stage in Notion.</h2>
            </div>
            <a href={notionGuideUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#d7f43c] px-6 py-3.5 text-sm font-bold text-[#17351f] transition hover:bg-[#e8fa7e]">
              Open Notion Student Guide
              <ArrowIcon />
            </a>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

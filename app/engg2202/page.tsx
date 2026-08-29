import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "../components/site-shell";

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
    methods:
      "SDG target scan, context map, team capability map, challenge-source review and assumption log.",
    discussion:
      "Why this direction? What evidence might make the team change it?",
    example:
      "“Build a weather station” is only a response area. The problem and stakeholder still need evidence.",
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
    methods:
      "Interview, observation, measurement, literature and patent search, open-source landscape and baseline analysis.",
    discussion:
      "Which claim is strongest? Which remains an assumption? Could buy or borrow be better?",
    example:
      "Who needs local data, at what site, and for what decision? Teaching and operational-data goals are different.",
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
    methods:
      "Decision matrix, requirements table, system map, risk register, budget estimate and project schedule.",
    discussion:
      "Which criterion changed the decision? What is the cheapest useful experiment?",
    example:
      "A hybrid route can use a commercial reference while preserving the student-built learning platform.",
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
    methods:
      "Open-source review, Git branches and pull requests, rapid prototyping, interface tests and handover tests.",
    discussion:
      "What failed? Could another person repeat it? What must be proven before real-world use?",
    example:
      "A bench demo can show sensing and logging, but does not yet justify outdoor deployment.",
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
    methods:
      "Test matrix, reference comparison, failure analysis, log review, safety checklist and decision table.",
    discussion:
      "Which observation would change the decision? Is the result repeatable and safe?",
    example:
      "A 72-hour first field test can support the next stage; it cannot certify long-term reliability.",
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
    methods:
      "Workshop, report, poster, demo, competition, project film, short documentary, stakeholder implementation, tutorial and public repository.",
    discussion:
      "What can another person use? What must be redacted? Which claim is still too strong?",
    example:
      "Release the weather station as an educational prototype unless evidence supports stronger claims.",
  },
];

const releaseFormats = [
  ["Build", "Functional prototype or open-source system", "Show how it works, how it was tested and what another team would need to continue."],
  ["Teach", "Workshop, tutorial or teaching kit", "Observe learners using the material, then revise it from their questions and difficulty."],
  ["Communicate", "Presentation, report, poster or conference-style paper", "Make the evidence, trade-offs and limits understandable to a defined audience."],
  ["Film", "Project video, video essay or short documentary", "Record the journey, decisions, failures, testing and learning—not only the final result."],
  ["Showcase", "Competition entry or stakeholder demonstration", "Use external questions and feedback to test the project under real judgement."],
  ["Contribute", "Public repository, community resource or startup validation", "Release something useful with attribution, safety, privacy and claims checked."],
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
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
                <span className="inline-flex items-center justify-center gap-2 rounded-full border border-[#a9c0ae] bg-white px-5 py-3 text-sm font-bold text-[#56705d]">
                  Stage 1 guide · preparing for release
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mb-12 grid gap-5 rounded-[2rem] bg-[#123d24] p-7 text-white sm:p-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b9d9bf]">Active-learning evidence loop</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">Do more than complete an activity.</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold sm:grid-cols-5">
              {['Act', 'Keep evidence', 'Get feedback', 'Revise', 'Transfer'].map((item, index) => (
                <div key={item} className={`rounded-xl px-3 py-4 ${index === 4 ? "bg-[#d7f43c] text-[#183620]" : "bg-white/9 text-white"}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {stages.map((stage) => (
              <article id={`stage-${stage.number}`} key={stage.number} className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-[#d2e0d4] bg-white shadow-[0_24px_72px_-54px_rgba(15,60,32,0.35)]">
                <div className="grid lg:grid-cols-[0.38fr_0.62fr]">
                  <div className="relative p-7 text-white sm:p-9" style={{ backgroundColor: stage.color }}>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Gate {stage.number}</p>
                    <p className="mt-8 text-5xl font-semibold tracking-[-0.05em]">{stage.verb}</p>
                    <h2 className="mt-3 text-xl font-semibold text-white/92">{stage.title}</h2>
                    <p className="mt-8 border-t border-white/25 pt-6 text-base leading-7 text-white/85">{stage.question}</p>
                  </div>

                  <div className="p-7 sm:p-9 lg:p-10">
                    <div className="grid gap-6 sm:grid-cols-2">
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
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#54715c]">Methods & tools</h3>
                        <p className="mt-3 text-sm leading-7 text-[#435b4b]">{stage.methods}</p>
                      </div>
                    </div>

                    <div className="mt-7 grid gap-3 border-t border-[#dde7df] pt-7 lg:grid-cols-2">
                      <div className="rounded-2xl bg-[#f0f6ef] p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#57715d]">Weather station example</p>
                        <p className="mt-2 text-sm leading-6 text-[#415747]">{stage.example}</p>
                      </div>
                      <div className="rounded-2xl bg-[#f7f4e8] p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#776a3a]">Discuss on Tuesday</p>
                        <p className="mt-2 text-sm leading-6 text-[#554e34]">{stage.discussion}</p>
                      </div>
                    </div>

                    <p className="mt-6 text-sm font-semibold text-[#54705c]">
                      The detailed instructions and checkpoint template are released inside the current Notion guide.
                    </p>
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
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {releaseFormats.map(([label, title, copy], index) => (
                <article key={label} className={`rounded-[1.6rem] p-6 ${index === 3 ? "bg-[#173f28] text-white" : "bg-white text-[#183822]"}`}>
                  <p className={`text-xs font-bold uppercase tracking-[0.14em] ${index === 3 ? "text-[#d7f43c]" : "text-[#628069]"}`}>{label}</p>
                  <h3 className="mt-7 text-xl font-semibold tracking-[-0.025em]">{title}</h3>
                  <p className={`mt-3 text-sm leading-7 ${index === 3 ? "text-white/76" : "text-[#526858]"}`}>{copy}</p>
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
            <Link href="/guide" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#d7f43c] px-6 py-3.5 text-sm font-bold text-[#17351f] transition hover:bg-[#e8fa7e]">
              See how staged release works
              <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

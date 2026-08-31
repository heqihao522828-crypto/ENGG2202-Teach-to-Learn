import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "../components/site-shell";

export const metadata: Metadata = {
  title: "Assessment",
  description:
    "How ENGG2202 coursework is assessed, what evidence matters and how the six project Gates support the four approved assessment components.",
};

const assessmentComponents = [
  {
    number: "01",
    title: "Project Progress & Participation",
    weight: "24%",
    mode: "Individual",
    colour: "#4f925f",
    copy: "Your preparation, participation and learning across the project—not only what appears at the end.",
    evidence: [
      "Checkpoints and written progress summaries",
      "Active contribution during learning activities and meetings",
      "Reflection, response to feedback and self-directed learning",
      "Awareness of sustainability and the wider project context",
    ],
    strong:
      "Strong work is consistent, clearly documented and shows that feedback changes what you do next.",
  },
  {
    number: "02",
    title: "Written Reports",
    weight: "46%",
    mode: "Individual",
    colour: "#d7f43c",
    copy: "Your individual engineering account of the problem, analysis, solution, implementation and evaluation.",
    evidence: [
      "A clearly defined problem supported by relevant evidence",
      "A feasible solution with justified engineering decisions",
      "Testing, evaluation, limitations and responsible impact claims",
      "Clear technical communication, structure and attribution",
    ],
    strong:
      "Strong reports connect claims to evidence and explain why each important decision was made.",
  },
  {
    number: "03",
    title: "Solution Demonstration",
    weight: "20%",
    mode: "Team",
    colour: "#efb94b",
    copy: "A clear team demonstration of the conceptual design or prototype and the engineering behind it.",
    evidence: [
      "A structured, audience-focused demonstration",
      "A working or honestly bounded conceptual solution",
      "Problem-solving and design development explained clearly",
      "Appropriate use of engineering tools, methods and principles",
    ],
    strong:
      "Strong demonstrations make the design logic, measured evidence and known limitations easy to understand.",
  },
  {
    number: "04",
    title: "Teamwork & Collaboration",
    weight: "10%",
    mode: "Individual",
    colour: "#69b6a0",
    copy: "How reliably and professionally you contribute to the shared project over time.",
    evidence: [
      "Meaningful ownership and completion of agreed work",
      "Constructive feedback and communication with teammates",
      "Initiative and leadership when the team needs it",
      "Professional responsibility, reliability and accountability",
    ],
    strong:
      "Strong contributors help the whole team move forward while making their own responsibility visible.",
  },
];

const gateEvidence = [
  ["01", "Focus", "Choose a meaningful challenge and establish its Green Technology direction."],
  ["02", "Define", "Keep stakeholder and problem evidence before committing to a solution."],
  ["03", "Plan", "Record requirements, alternatives, trade-offs, risks and responsibilities."],
  ["04", "Learn", "Show how new knowledge is checked, applied and turned into a first version."],
  ["05", "Improve", "Use tests and feedback to justify what changes—and what does not."],
  ["06", "Contribute", "Explain, demonstrate and release work that another person can understand."],
];

const gradeBands = [
  ["A", "Exceptional", "Deep understanding, well-supported decisions, strong initiative and professional execution."],
  ["B", "Good", "Clear understanding and effective application, with only minor gaps."],
  ["C", "Adequate", "The expected foundation is present, but evidence, depth or consistency is limited."],
  ["D", "Passing", "Some relevant work is visible, but important gaps remain in quality, clarity or contribution."],
  ["F", "Insufficient", "There is not enough meaningful evidence to demonstrate the required learning."],
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export default function AssessmentPage() {
  return (
    <SiteShell>
      <main>
        <section className="overflow-hidden border-b border-[#d8e4d9] bg-[#163f27] px-5 py-14 text-white sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b9d8bf]">ENGG2202 assessment</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Show the work
                <span className="block text-[#d7f43c]">behind the result.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-9 text-white/76">
                You are assessed on how you investigate, decide, build, test,
                explain and work with others—not only on whether the final
                prototype looks finished.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm font-semibold">100% coursework</span>
                <span className="rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm font-semibold">80% individual</span>
                <span className="rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm font-semibold">20% team</span>
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-white/12 bg-[#0f321f] p-6 shadow-[0_34px_90px_-55px_rgba(0,0,0,0.8)] sm:p-8">
              <div className="grid gap-7 sm:grid-cols-[minmax(220px,0.78fr)_1.22fr] sm:items-center">
                <div className="mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center rounded-full p-[1.1rem]" style={{ background: "conic-gradient(#4f925f 0 24%, #d7f43c 24% 70%, #efb94b 70% 90%, #69b6a0 90% 100%)" }}>
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#153b25] text-center shadow-inner">
                    <span className="text-5xl font-semibold tracking-[-0.06em] text-white">100%</span>
                    <span className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#b9d8bf]">coursework</span>
                  </div>
                </div>
                <div className="grid gap-3">
                  {assessmentComponents.map((item) => (
                    <div key={item.number} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.colour }} aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-0.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/48">{item.mode}</p>
                      </div>
                      <span className="text-xl font-semibold text-white">{item.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7faf6] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[90rem]">
            <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Four assessment components</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#143421] sm:text-5xl">One project, viewed from four angles.</h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-[#526858] lg:justify-self-end">
                Each component asks a different question. Together they show
                what your team created, what you personally learned and how
                responsibly you contributed.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {assessmentComponents.map((item) => (
                <article key={item.number} className="overflow-hidden rounded-[2rem] border border-[#d4e1d6] bg-white">
                  <div className="grid grid-cols-[1fr_auto] gap-5 border-b border-[#dce7de] p-6 sm:p-8">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold tracking-[0.16em] text-[#708675]">{item.number}</span>
                        <span className="rounded-full bg-[#edf4ed] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#52705d]">{item.mode}</span>
                      </div>
                      <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[#173823] sm:text-3xl">{item.title}</h3>
                    </div>
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-semibold text-[#173823]" style={{ backgroundColor: item.colour }}>
                      {item.weight}
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <p className="text-base leading-8 text-[#48604f]">{item.copy}</p>
                    <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-[#718776]">Evidence may include</p>
                    <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#36533f]">
                      {item.evidence.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4f925f]" aria-hidden="true" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 rounded-2xl bg-[#f1f7f0] p-5">
                      <p className="text-sm font-semibold leading-6 text-[#2f583a]">{item.strong}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#d8e4d9] bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[90rem]">
            <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">The role of the six Gates</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#143421] sm:text-5xl">The Gates organise your evidence. They are not six extra assessments.</h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-[#526858]">
                  Use each Gate to make a decision visible while the work is
                  still happening. That record can later support your progress,
                  report, demonstration and individual contribution evidence.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {gateEvidence.map(([number, title, copy]) => (
                  <article key={number} className="rounded-[1.6rem] border border-[#d4e1d6] bg-[#f5faf4] p-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-bold tracking-[0.16em] text-[#738878]">{number}</span>
                      <span className="h-px flex-1 bg-[#d4e1d6]" aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-[#173823]">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#526858]">{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#eef6ec] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto grid max-w-[90rem] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] bg-[#153f27] p-7 text-white sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b9d8bf]">What does not earn marks by itself</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Activity is not the same as evidence.</h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  ["A large repository", "More files or commits do not automatically mean a stronger contribution."],
                  ["A polished final demo", "A result without decisions, tests and limitations does not show the learning behind it."],
                  ["An SDG icon", "A sustainability claim needs a real target, context and evidence."],
                  ["AI-generated output", "You remain responsible for checking, explaining and defending anything you use."],
                ].map(([title, copy]) => (
                  <article key={title} className="rounded-2xl border border-white/11 bg-white/7 p-5">
                    <h3 className="font-semibold text-[#d7f43c]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/68">{copy}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#d4e1d6] bg-white p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">How grades are distinguished</p>
              <div className="mt-6 grid gap-3">
                {gradeBands.map(([grade, title, copy], index) => (
                  <div key={grade} className="grid grid-cols-[3.2rem_1fr] gap-4 rounded-2xl border border-[#dce7de] p-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold ${index === 0 ? "bg-[#d7f43c] text-[#173823]" : "bg-[#edf4ed] text-[#31573b]"}`}>{grade}</div>
                    <div>
                      <h3 className="font-semibold text-[#173823]">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#526858]">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
          <div className="mx-auto grid max-w-[90rem] gap-8 rounded-[2rem] border border-[#d4e1d6] bg-[#f7faf6] p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Before you submit</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#143421]">Make the learning—and your own contribution—easy to verify.</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#526858]">
                Keep claims traceable to sources and tests, identify your own
                decisions and contribution, disclose material AI assistance,
                attribute reused work and state limitations honestly. Exact
                report stages, submission instructions, dates and the full
                formal rubrics are published on Moodle or Ed Discussion.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/engg2202" className="inline-flex items-center gap-2 rounded-full bg-[#173f28] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#245d38]">
                View Project Journey <ArrowIcon />
              </Link>
              <Link href="/guide" className="inline-flex items-center gap-2 rounded-full border border-[#b9cfbf] bg-white px-5 py-3 text-sm font-bold text-[#214b31] transition hover:border-[#1f6d3b]">
                Use Student Guide <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

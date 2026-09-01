import Link from "next/link";

const meetingDates = [
  ["01 SEP", "Course launch", "Meet the project journey and begin Gate 01."],
  ["08 SEP", "Direction studio", "Explore Green Technology contexts and possible project directions."],
  ["22 SEP", "Gate 01 review", "Review the challenge focus and the evidence behind it."],
  ["06 OCT", "Gate 02 review", "Test whether the problem is specific, observable and worth solving."],
  ["27 OCT", "Concept studio", "Compare possible approaches and develop a feasible direction."],
  ["10 NOV", "Approval-pack clinic", "Check the system design, budget, risks and build plan."],
  ["24 NOV", "Gate 03 review", "Present the Project Approval Pack and establish build readiness."],
];

const assessmentComponents = [
  {
    number: "01",
    title: "Project Progress & Gate Checkpoints",
    weight: "24%",
    mode: "Individual",
    colour: "#4f925f",
    copy: "Six reviews across the year. Each Gate is worth 4% and records your contribution to the next project decision.",
  },
  {
    number: "02",
    title: "Written Reports",
    weight: "46%",
    mode: "Individual",
    colour: "#d7f43c",
    copy: "Two reports turn the project record into a clear engineering argument: 18% after Gate 03 and 28% at the end of the project.",
  },
  {
    number: "03",
    title: "Solution Demonstration",
    weight: "20%",
    mode: "Team",
    colour: "#efb94b",
    copy: "A structured demonstration of what the team built, how it works and what the available evidence can honestly support.",
  },
  {
    number: "04",
    title: "Teamwork & Professional Practice",
    weight: "10%",
    mode: "Individual",
    colour: "#69b6a0",
    copy: "How reliably, constructively and professionally you contribute to the shared project over time.",
  },
];

const reports = [
  {
    term: "SEMESTER 1",
    weight: "18%",
    title: "Project Definition & Engineering Plan",
    timing: "Due after Gate 03 · exact deadline on Moodle",
    question: "Why are this problem, this direction and this implementation plan reasonable?",
    sections: [
      "Project context, stakeholder and evidence-based problem definition",
      "Requirements, constraints and success criteria",
      "Alternatives considered and justification of the selected direction",
      "System design, resources, budget, schedule, risk and safety",
      "Your own engineering contribution, decisions and learning",
    ],
  },
  {
    term: "SEMESTER 2",
    weight: "28%",
    title: "Final Engineering Development Report",
    timing: "Due after Gate 06 · exact deadline on Moodle",
    question: "What did you build, what does the evidence show, and how did the project change because of it?",
    sections: [
      "Implementation and the engineering methods used",
      "Testing, results, feedback and iteration decisions",
      "Performance against the agreed requirements",
      "Limitations, safety, sustainability and evidence-based SDG claims",
      "Open release, lasting contribution and your individual learning",
    ],
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

function BulletList({ items, light = false }: { items: string[]; light?: boolean }) {
  return (
    <ul className={`grid gap-3 text-sm leading-6 ${light ? "text-white/76" : "text-[#36533f]"}`}>
      {items.map((point) => (
        <li key={point} className="flex gap-3">
          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${light ? "bg-[#d7f43c]" : "bg-[#4f925f]"}`} aria-hidden="true" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

export function SemesterMeetings() {
  return (
    <section id="meetings" className="scroll-mt-28 border-y border-[#d8e4d9] bg-[#eef6ec] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Semester meetings</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#143421] sm:text-5xl">Semester 1 meeting schedule.</h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#526858] lg:justify-self-end">
            B1 and B2 meet together on the dates below for project decisions, Gate reviews and practical feedback.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="rounded-[2rem] bg-[#153f27] p-7 text-white sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b9d8bf]">Semester 1 · 2026</p>
            <p className="mt-8 text-3xl font-semibold tracking-[-0.04em]">Tuesdays</p>
            <p className="mt-2 text-2xl font-semibold text-[#d7f43c]">10:00 am–12:50 pm</p>
            <div className="mt-8 border-t border-white/15 pt-7">
              <p className="font-semibold">CB 102B</p>
              <p className="mt-2 text-sm leading-6 text-white/70">Chow Yei Ching Building<br />B1 and B2 attend together</p>
            </div>
            <a href="https://www.google.com/maps/place/Chow+Yei+Ching+Building,+Pok+Fu+Lam+Rd,+Lung+Fu+Shan/@22.2831076,114.1352674,19.25z/data=!4m6!3m5!1s0x3403ff85af39ecbb:0xea1597b626ef3c1e!8m2!3d22.2830634!4d114.1354068!16s%2Fg%2F12j05kv2z" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#173b25]">
              Open in Google Maps <ArrowIcon />
            </a>
            <div className="mt-8 rounded-2xl border border-white/12 bg-white/7 p-5">
              <p className="text-sm font-semibold">Need another meeting?</p>
              <p className="mt-2 text-sm leading-6 text-white/68">You may arrange an additional project meeting outside these fixed sessions. Semester 2 dates will be provided later.</p>
            </div>
          </aside>

          <div className="grid gap-3 sm:grid-cols-2">
            {meetingDates.map(([date, title, copy], index) => (
              <article key={date} className={`rounded-[1.5rem] border p-6 ${index === meetingDates.length - 1 ? "border-[#b8d22c] bg-[#d7f43c]" : "border-[#d4e1d6] bg-white"}`}>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold tracking-[0.16em] text-[#52705d]">{date}</span>
                  <span className="text-xs font-bold text-[#78907d]">0{index + 1}</span>
                </div>
                <h3 className="mt-7 text-xl font-semibold text-[#173823]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#526858]">{copy}</p>
              </article>
            ))}
            <article className="rounded-[1.5rem] border border-dashed border-[#a9c0af] bg-[#f7faf6] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#718776]">Semester 2</p>
              <h3 className="mt-7 text-xl font-semibold text-[#173823]">Dates to be confirmed</h3>
              <p className="mt-3 text-sm leading-7 text-[#526858]">The build, test, release and final demonstration schedule will be added when confirmed.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AssessmentInformation() {
  return (
    <>
      <section id="assessment" className="scroll-mt-24 overflow-hidden bg-[#163f27] px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b9d8bf]">ENGG2202 assessment</p>
            <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Show the work
              <span className="block text-[#d7f43c]">behind the result.</span>
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-white/76">
              Marks come from the investigation, decisions, build evidence, testing, explanation and teamwork behind the final prototype.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm font-semibold">100% coursework</span>
              <span className="rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm font-semibold">80% individual</span>
              <span className="rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm font-semibold">20% team</span>
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-white/12 bg-[#0f321f] p-6 shadow-[0_34px_90px_-55px_rgba(0,0,0,0.8)] sm:p-8">
            <div className="grid gap-7 sm:grid-cols-[minmax(210px,0.78fr)_1.22fr] sm:items-center">
              <div className="mx-auto flex aspect-square w-full max-w-[270px] items-center justify-center rounded-full p-[1.05rem]" style={{ background: "conic-gradient(#4f925f 0 24%, #d7f43c 24% 70%, #efb94b 70% 90%, #69b6a0 90% 100%)" }}>
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#153b25] text-center shadow-inner">
                  <span className="text-5xl font-semibold tracking-[-0.06em]">100%</span>
                  <span className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#b9d8bf]">coursework</span>
                </div>
              </div>
              <div className="grid gap-3">
                {assessmentComponents.map((item) => (
                  <div key={item.number} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.colour }} aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-0.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/48">{item.mode}</p>
                    </div>
                    <span className="text-xl font-semibold">{item.weight}</span>
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
            <p className="max-w-2xl text-base leading-8 text-[#526858] lg:justify-self-end">The four components cover project progress, engineering reasoning, the final demonstration and your professional contribution.</p>
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
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-semibold text-[#173823]" style={{ backgroundColor: item.colour }}>{item.weight}</div>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-base leading-8 text-[#48604f]">{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="reports" className="scroll-mt-28 bg-[#eef6ec] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[90rem]">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Two written reports · 46%</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#143421] sm:text-5xl">Use the project record to explain your engineering decisions.</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {reports.map((report, index) => (
              <article key={report.title} className={`rounded-[2rem] p-7 sm:p-9 ${index === 1 ? "bg-[#153f27] text-white" : "border border-[#d4e1d6] bg-white text-[#173823]"}`}>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-[0.16em] ${index === 1 ? "text-[#b9d8bf]" : "text-[#718776]"}`}>{report.term}</p>
                    <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">{report.title}</h3>
                  </div>
                  <span className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-semibold ${index === 1 ? "bg-[#d7f43c] text-[#173823]" : "bg-[#e4f4a8] text-[#173823]"}`}>{report.weight}</span>
                </div>
                <p className={`mt-6 text-sm font-bold ${index === 1 ? "text-[#d7f43c]" : "text-[#4d7958]"}`}>{report.timing}</p>
                <p className={`mt-6 text-lg font-semibold leading-8 ${index === 1 ? "text-white" : "text-[#214b31]"}`}>{report.question}</p>
                <div className="mt-7"><BulletList items={report.sections} light={index === 1} /></div>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-[#cfded1] bg-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <p className="max-w-4xl text-sm leading-7 text-[#526858]">The team uses the Gate 03 Project Approval Pack for its design review. The Semester 1 report is your individual explanation of why the project definition and plan make engineering sense.</p>
            <Link href="/guide" className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-full bg-[#173f28] px-5 py-3 text-sm font-bold text-white sm:mt-0">Open Student Guide <ArrowIcon /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "../components/site-shell";
import { imagePath } from "../lib/image-path";

export const metadata: Metadata = {
  title: "Green Technology & the SDGs",
  description:
    "Use the United Nations Sustainable Development Goals as a starting lens for a bounded, evidence-led ENGG2202 engineering challenge.",
};

const projectFlow = [
  {
    number: "01",
    title: "Choose a goal and target",
    copy: "Start with a sustainability direction, then read the relevant target rather than relying on the icon alone.",
  },
  {
    number: "02",
    title: "Locate a real context",
    copy: "Name a place, community, system or practice where the challenge can be observed and investigated.",
  },
  {
    number: "03",
    title: "Validate the problem",
    copy: "Identify a stakeholder, baseline and decision that could be improved. Keep evidence and uncertainty visible.",
  },
  {
    number: "04",
    title: "Judge the contribution",
    copy: "Test whether the proposed technology creates useful value without making sustainability claims the evidence cannot support.",
  },
];

const focusGoals = [
  { number: "06", label: "Clean water & sanitation" },
  { number: "07", label: "Affordable & clean energy" },
  { number: "09", label: "Industry, innovation & infrastructure" },
  { number: "11", label: "Sustainable cities & communities" },
  { number: "12", label: "Responsible consumption & production" },
  { number: "13", label: "Climate action" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export default function SustainableDevelopmentGoalsPage() {
  return (
    <SiteShell>
      <main>
        <section className="overflow-hidden border-b border-[#d8e4d9] bg-white px-5 py-18 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="relative order-2 overflow-hidden rounded-[2.2rem] border border-[#d4e1d6] bg-[#f7faf6] p-5 shadow-[0_30px_90px_-62px_rgba(15,60,32,0.45)] sm:p-7 lg:order-1">
              <Image
                src={imagePath("/images/teach-to-learn/un-sdg-17-goals-poster.png")}
                alt="Official United Nations poster showing all 17 Sustainable Development Goals"
                width={1280}
                height={720}
                priority
                className="h-auto w-full rounded-[1.4rem] bg-white object-contain"
              />
              <p className="mt-4 text-xs leading-5 text-[#6b7d70]">
                Official UN SDG poster. The goals provide a shared language for
                locating challenges; they do not prove project impact by themselves.
              </p>
            </div>

            <div className="order-1 max-w-2xl lg:order-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#52765c]">Green Technology theme</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[#11301d] sm:text-6xl lg:text-7xl">
                From a global goal
                <span className="block text-[#318248]">to a testable challenge.</span>
              </h1>
              <p className="mt-7 text-lg leading-9 text-[#48604f]">
                ENGG2202 teams use the SDGs to explore why an engineering
                challenge matters. The next step is always local and specific:
                who is affected, where, what decision is being made and what
                evidence could justify a better response?
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/engg2202#stage-01" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f28] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#245d38]">
                  Start at Challenge Focus
                  <ArrowIcon />
                </Link>
                <a href="https://sdgs.un.org/goals" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#a9c0ae] bg-white px-5 py-3 text-sm font-bold text-[#214a2f] transition hover:border-[#2c7140]">
                  Explore the official goals
                  <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Use the SDGs responsibly</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#143421] sm:text-5xl">
                The icon is a doorway, not the conclusion.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#506656]">
                A solar panel does not automatically make a project sustainable.
                Teams should investigate energy, materials, lifetime, repair,
                access, safety and unintended effects before making an impact claim.
              </p>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2">
              {projectFlow.map((item) => (
                <li key={item.number} className="rounded-[1.7rem] border border-[#d4e1d6] bg-white p-6">
                  <p className="text-xs font-bold tracking-[0.16em] text-[#6b8270]">{item.number}</p>
                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.025em] text-[#173823]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#526858]">{item.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-[#d8e4d9] bg-[#eef6ec] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[90rem]">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Common Green Technology entry points</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#143421]">Explore widely before narrowing the project.</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-[#506656] lg:justify-self-end">
                These goals often connect strongly to engineering and sustainability,
                but teams may work with any relevant goal or combination. The selected
                target must still lead to a real, bounded and researchable challenge.
              </p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {focusGoals.map((goal) => (
                <div key={goal.number} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_18px_50px_-45px_rgba(15,60,32,0.4)]">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
                    <Image
                      src={imagePath(`/images/teach-to-learn/sdg/goal-${goal.number}.png`)}
                      alt={`SDG ${goal.number}: ${goal.label}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm font-semibold text-[#31523b]">{goal.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#153f27] px-5 py-16 text-white sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b9d8bf]">A useful Green Technology claim</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">Say what the project has demonstrated—and keep the next question visible.</h2>
            </div>
            <a href="https://www.un.org/sustainabledevelopment/news/communications-material/" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#173b25]">
              UN SDG materials & guidelines
              <ArrowIcon />
            </a>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

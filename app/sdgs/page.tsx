import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "../components/site-shell";
import { imagePath } from "../lib/image-path";

export const metadata: Metadata = {
  title: "Green Technology & the SDGs",
  description:
    "Use the United Nations Sustainable Development Goals as a starting lens for a bounded, evidence-led ENGG2202 engineering challenge.",
  alternates: { canonical: "https://active-learning-kyle.github.io/ENGG2202-Teach-to-Learn/sdgs/" },
};

const projectFlow = [
  {
    number: "01",
    title: "Choose a goal and target",
    copy: "Start with a sustainability direction, then read the relevant target rather than relying on the icon alone.",
    image: "/images/teach-to-learn/un-sdg-17-goals-poster.png",
  },
  {
    number: "02",
    title: "Locate a real context",
    copy: "Name a place, community, system or practice where the challenge can be observed and investigated.",
    image: "/images/teach-to-learn/stage-define-evidence-v2.png",
  },
  {
    number: "03",
    title: "Validate the problem",
    copy: "Identify a stakeholder, baseline and decision that could be improved. Keep evidence and uncertainty visible.",
    image: "/images/teach-to-learn/stage-improve-iteration-v2.png",
  },
  {
    number: "04",
    title: "Judge the contribution",
    copy: "Test whether the proposed technology creates useful value without making sustainability claims the evidence cannot support.",
    image: "/images/teach-to-learn/stage-contribute-release-v2.png",
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

const greenTechnologyReading = [
  {
    category: "Systems in practice",
    date: "2026",
    title: "From waste to hydrogen: what a working system has to solve",
    copy: "An HKU Engineering alumni study tour examined a waste-to-hydrogen plant, green building technology and the practical choices behind large-scale adoption.",
    source: "HKU Engineering Alumni Association",
    href: "https://hkueaa.engg.hku.hk/post/hkueaa-overseas-study-tour-2026-to-korea-ambitious-green-policies-and-industrial-innovation",
    accent: "bg-[#c8f06a]",
  },
  {
    category: "Water × energy",
    date: "17 Jun 2025",
    title: "Can wastewater treatment also produce green hydrogen?",
    copy: "This HKAE TechTalk introduces a photoelectrochemical system that treats saline wastewater while generating hydrogen, then asks what changes when the process is scaled.",
    source: "HKU Innovation Wing",
    href: "https://innowings.engg.hku.hk/greenhydrogen/",
    accent: "bg-[#70c7b4]",
  },
  {
    category: "Solar materials",
    date: "Summer 2025",
    title: "What limits efficient organic photovoltaics?",
    copy: "HKU Engineering's research newsletter looks at advances in solar energy harvesting alongside new work in filtration, batteries and low-carbon materials.",
    source: "HKU Engineering Newsletter",
    href: "https://engg.hku.hk/Portals/0/adam/News%20and%20Events/4fDJg5_Yq0-mgFGRpb5gmA/Link/HKU%20Engineering%20Newsletter%20-%20Summer%202025.pdf",
    accent: "bg-[#f5c04d]",
  },
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
                <li key={item.number} className="group relative min-h-[15.5rem] overflow-hidden rounded-[1.7rem] border border-[#d4e1d6] bg-white p-6">
                  <Image src={imagePath(item.image)} alt="" fill sizes="(min-width: 640px) 40vw, 100vw" className="object-cover opacity-[0.16] saturate-[0.7] transition duration-700 group-hover:scale-[1.035] group-hover:opacity-[0.22]" aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/45" />
                  <div className="relative max-w-[24rem]">
                    <p className="text-xs font-bold tracking-[0.16em] text-[#6b8270]">{item.number}</p>
                    <h3 className="mt-12 text-xl font-semibold tracking-[-0.025em] text-[#173823]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#526858]">{item.copy}</p>
                  </div>
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

        <section className="bg-[#0f2d1c] px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[90rem]">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b7d6bd]">Green Technology briefing</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Ideas worth bringing into the next team discussion.</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-white/68 lg:justify-self-end">
                This is a curated reading list, not a live news feed. Each item comes from an HKU source and is here to spark a project question, not to prescribe a solution.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {greenTechnologyReading.map((item) => (
                <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className="group flex min-h-[23rem] flex-col overflow-hidden rounded-[1.7rem] border border-white/14 bg-white/[0.065] transition hover:-translate-y-1 hover:bg-white/[0.1]">
                  <div className={`h-2 ${item.accent}`} />
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-4 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/55">
                      <span>{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                    <h3 className="mt-8 text-2xl font-semibold leading-8 tracking-[-0.03em]">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/68">{item.copy}</p>
                    <span className="mt-auto inline-flex items-center justify-between gap-3 pt-8 text-xs font-bold text-[#d7f43c]">
                      {item.source}
                      <ArrowIcon />
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <div className="relative mt-12 overflow-hidden rounded-[2rem] border border-white/12 bg-[#f3f7ee] text-[#153622] shadow-[0_34px_90px_-58px_rgba(0,0,0,0.65)]">
              <div className="grid lg:min-h-[27rem] lg:grid-cols-[1.18fr_0.82fr]">
                <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4e7157]">Global engineering opportunity</p>
                    <span className="rounded-full border border-[#c8d9ca] bg-white px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#47654f]">
                      4 March every year
                    </span>
                  </div>
                  <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
                    Take the project beyond the course.
                  </h2>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-[#4d6554]">
                    World Engineering Day connects students and engineers around
                    the UN Sustainable Development Goals. Explore the WFEO
                    challenge briefs, previous Hackathon entries and global
                    events to find questions and see how teams communicate a
                    working solution.
                  </p>
                  <div className="mt-6 rounded-2xl border border-[#d4e1d5] bg-white/85 p-4 text-sm leading-6 text-[#496151]">
                    <strong className="text-[#1b442a]">Current status:</strong>{" "}
                    the 2026 Hackathon has concluded; 2027 details have not yet
                    been announced. Use the briefs for inspiration—your project
                    still needs a specific context, stakeholder and evidence.
                  </div>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <a href="https://worldengineeringday.net/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f28] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#245d38]">
                      Explore World Engineering Day
                      <ArrowIcon />
                    </a>
                    <a href="https://worldengineeringday.net/hackathon/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#a9c0ae] bg-white px-5 py-3 text-sm font-bold text-[#214a2f] transition hover:border-[#2c7140]">
                      View the Hackathon
                      <ArrowIcon />
                    </a>
                    <a href="https://worldengineeringday.net/events-map/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-2 py-3 text-sm font-bold text-[#315f3d] transition hover:text-[#173f28]">
                      Browse global events
                      <ArrowIcon />
                    </a>
                  </div>
                </div>

                <div className="relative flex min-h-[20rem] items-center justify-center overflow-hidden bg-[#e5efe2] p-8 sm:p-10 lg:min-h-full">
                  <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#f7bf2f]/25 blur-2xl" aria-hidden="true" />
                  <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-[#38a369]/18 blur-3xl" aria-hidden="true" />
                  <Image
                    src={imagePath("/images/teach-to-learn/wed-engineering-tools-sticker.png")}
                    alt="World Engineering Day social sticker showing engineering drawing tools and coloured gears"
                    width={1600}
                    height={1600}
                    sizes="(min-width: 1024px) 34vw, 70vw"
                    className="relative h-auto w-full max-w-[25rem] rotate-[2deg] object-contain drop-shadow-[0_24px_30px_rgba(30,70,42,0.18)]"
                  />
                  <p className="absolute bottom-5 left-6 right-6 text-center text-[0.62rem] leading-4 text-[#6a7d6e]">
                    Official World Engineering Day social sticker · used with attribution
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#153f27] px-5 py-16 text-white sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b9d8bf]">A useful Green Technology claim</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">Say what the project has demonstrated, then state what still needs to be tested.</h2>
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

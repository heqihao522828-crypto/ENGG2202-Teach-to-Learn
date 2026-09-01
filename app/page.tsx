"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SiteShell from "./components/site-shell";
import StageArtwork from "./components/stage-artwork";
import { imagePath } from "./lib/image-path";

const heroImages = [
  "/images/teach-to-learn/home-hero-1.png",
  "/images/teach-to-learn/home-hero-2.png",
  "/images/teach-to-learn/home-hero-3.png",
  "/images/teach-to-learn/home-hero-4.png",
];

const stages = [
  { number: "01", short: "Focus", label: "Challenge Focus", note: "Choose a direction worth investigating.", left: "12%", top: "72%" },
  { number: "02", short: "Define", label: "Problem Validation", note: "Use evidence to define the problem.", left: "28%", top: "45%" },
  { number: "03", short: "Plan", label: "Proposal & Plan", note: "Make the project feasible and ready.", left: "45%", top: "66%" },
  { number: "04", short: "Learn", label: "First Working Version", note: "Build and understand a first version.", left: "61%", top: "38%" },
  { number: "05", short: "Improve", label: "Test & Iteration", note: "Let testing change the next version.", left: "77%", top: "58%" },
  { number: "06", short: "Contribute", label: "Teach, Share & Release", note: "Leave work that others can use.", left: "89%", top: "27%" },
];

const mastery = ["Learn", "Apply", "Explain", "Teach", "Contribute"];

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

function ProjectMarqueeCard({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <a
      href="https://github.com/Active-Learning-Kyle/solar-weather-station"
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={duplicate ? -1 : undefined}
      className="group relative flex h-52 w-[21rem] shrink-0 overflow-hidden rounded-[1.55rem] border border-white/20 bg-[#163f27] text-white shadow-[0_24px_60px_-42px_rgba(10,42,24,0.8)] sm:w-[25rem]"
    >
      <Image src={imagePath("/images/teach-to-learn/solar-weather-station-cover.png")} alt={duplicate ? "" : "Solar Weather Station prototype on a green rooftop"} fill sizes="400px" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,32,18,0.94)_0%,rgba(8,32,18,0.12)_80%)]" />
      <div className="relative mt-auto p-5">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#d7f43c]">Open project · GitHub</p>
        <p className="mt-2 text-xl font-semibold">Solar Weather Station</p>
        <span className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-white/78">Explore the repository <ArrowIcon /></span>
      </div>
    </a>
  );
}

function FutureProjectCard({ number }: { number: string }) {
  return (
    <div className="flex h-52 w-[18rem] shrink-0 flex-col justify-between rounded-[1.55rem] border border-dashed border-[#a9c2ae] bg-[#edf4ed] p-5 text-[#31533b] sm:w-[20rem]">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-[#6f8775]">{number}</span>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#708577]">Project space</p>
        <p className="mt-2 text-lg font-semibold">More projects will be added.</p>
        <p className="mt-2 text-xs leading-5 text-[#617465]">This space opens when another public repository is ready to use.</p>
      </div>
    </div>
  );
}

function ProjectMarqueeGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="flex shrink-0 gap-4 pr-4" aria-hidden={duplicate || undefined}>
      <ProjectMarqueeCard duplicate={duplicate} />
      <FutureProjectCard number="02" />
      <FutureProjectCard number="03" />
      <FutureProjectCard number="04" />
    </div>
  );
}

export default function Home() {
  const [heroIndex, setHeroIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length);
    }, 9000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <SiteShell>
      <main>
        <section className="relative overflow-hidden bg-[#0d2f1c] text-white">
          {heroImages.map((source, index) => (
            <Image
              key={source}
              src={imagePath(source)}
              alt={index === 0 ? "Engineering students developing green technology prototypes in Hong Kong" : ""}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`absolute inset-0 object-cover object-center transition-opacity duration-[1400ms] ease-in-out ${index === heroIndex ? "opacity-100" : "opacity-0"} ${index === heroIndex ? (index % 2 === 0 ? "hero-zoom-in" : "hero-zoom-out") : ""}`}
              aria-hidden={index !== 0}
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,33,19,0.97)_0%,rgba(8,33,19,0.84)_38%,rgba(8,33,19,0.24)_74%,rgba(8,33,19,0.08)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,33,19,0.72)_0%,transparent_48%)]" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.72, ease: "easeOut" }}
            className="relative mx-auto flex min-h-[690px] max-w-[90rem] items-center px-5 py-20 sm:px-8 lg:px-10"
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-[#0c2d1b]/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d8efc9] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#d7f43c]" />
                ENGG2202 · Active Learning
              </div>

              <h1 className="mt-7 text-[3.7rem] font-semibold leading-[0.93] tracking-[-0.055em] sm:text-[5.4rem] lg:text-[6.7rem]">
                Teach
                <span className="block text-[#d7f43c]">to Learn.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl sm:leading-9">
                Build an engineering project. Test it with evidence. Explain it
                clearly enough that another person can use what you learned.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/engg2202" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d7f43c] px-6 py-3.5 text-sm font-bold text-[#112d1c] transition hover:-translate-y-0.5 hover:bg-[#e6fa72]">
                  Start the project journey
                  <ArrowIcon />
                </Link>
                <Link href="/gallery" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/8 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15">
                  Explore student projects
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="overflow-hidden border-b border-[#d7e4d9] bg-white py-14 sm:py-18">
          <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
            <div className="overflow-hidden rounded-[2rem] bg-[#102f1d] px-6 py-8 text-white sm:px-9 lg:px-12 lg:py-10">
              <div className="grid gap-7 lg:grid-cols-[0.62fr_1.38fr] lg:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b9d8bf]">Teach to Learn</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">Knowledge matters when it can travel.</h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">Learn something, use it in the project, explain the reasoning, help another person apply it, then leave a contribution they can build on.</p>
                </div>
                <ol className="flex min-h-[8rem] w-full flex-wrap items-center justify-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.035] px-4 py-5 sm:px-6 lg:flex-nowrap lg:justify-between" aria-label="Teach-to-Learn mastery progression">
                {mastery.map((item, index) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className={`rounded-full px-5 py-3 text-sm font-bold sm:text-base ${index === mastery.length - 1 ? "bg-[#d7f43c] text-[#17351f]" : "bg-white/10 text-white"}`}>
                      {item}
                    </span>
                    {index < mastery.length - 1 ? <span className="text-lg text-white/35 sm:text-xl">→</span> : null}
                  </li>
                ))}
              </ol>
              </div>
            </div>

            <div className="mt-11 flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#52765c]">Student projects</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#143421]">See what an open project leaves behind.</h2>
              </div>
              <Link href="/gallery" className="hidden shrink-0 items-center gap-2 text-sm font-bold text-[#226439] sm:inline-flex">View project directory <ArrowIcon /></Link>
            </div>

            <div className="project-marquee mt-7 w-full overflow-hidden rounded-[1.55rem]" aria-label="Student project showcase">
              <div className="project-marquee-track flex w-max">
                <ProjectMarqueeGroup />
                <ProjectMarqueeGroup duplicate />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} transition={{ duration: 0.6 }} className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4d7459]">One project · six decisions</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#102d1b] sm:text-5xl">
                Use the six Gates to move the project forward.
                <span className="block text-[#318248]">Your team decides how the project develops.</span>
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[#4a6452] lg:justify-self-end">
              Your team chooses the problem, technology and final contribution.
              The six Gates mark the decisions needed to develop that work.
            </p>
          </motion.div>

          <div className="relative mt-12 hidden aspect-[16/7.6] min-h-[42rem] overflow-hidden rounded-[2.2rem] border border-[#cfe0d2] bg-[#eaf3e8] shadow-[0_24px_70px_-48px_rgba(15,60,32,0.34)] lg:block">
            <Image src={imagePath("/images/teach-to-learn/guide-country-path.webp")} alt="A countryside route connecting the six ENGG2202 project Gates" fill sizes="1440px" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,36,20,0.12),transparent_55%)]" />
            {stages.map((stage) => (
              <Link
                key={stage.number}
                href={`/engg2202#stage-${stage.number}`}
                style={{ left: stage.left, top: stage.top }}
                className="group absolute w-[10.5rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.2rem] border border-white/75 bg-white/94 shadow-[0_16px_38px_-22px_rgba(9,43,23,0.7)] backdrop-blur-sm transition duration-300 hover:z-10 hover:-translate-y-[55%] hover:shadow-[0_22px_48px_-20px_rgba(9,43,23,0.75)]"
              >
                <StageArtwork stage={stage.number} className="h-16 w-full border-b border-[#d8e5da]" sizes="168px" />
                <div className="p-3.5">
                  <div className="flex items-center justify-between"><span className="text-[0.62rem] font-bold tracking-[0.16em] text-[#78907d]">{stage.number}</span><ArrowIcon /></div>
                  <p className="mt-2 text-base font-semibold text-[#143620]">{stage.short}</p>
                  <p className="mt-1 text-[0.68rem] leading-4 text-[#5b7161]">{stage.note}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 lg:hidden">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] border border-[#cfe0d2]">
              <Image src={imagePath("/images/teach-to-learn/guide-country-path.webp")} alt="The six-Gate project route" fill sizes="100vw" className="object-cover" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {stages.map((stage) => (
                <Link key={stage.number} href={`/engg2202#stage-${stage.number}`} className="flex items-center gap-4 rounded-2xl border border-[#d4e1d6] bg-white p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf4ee] text-xs font-bold text-[#55735d]">{stage.number}</span>
                  <span className="min-w-0"><span className="block font-semibold text-[#173823]">{stage.short}</span><span className="mt-1 block text-xs text-[#617465]">{stage.note}</span></span>
                  <span className="ml-auto text-[#356844]"><ArrowIcon /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-[#d7e4d9] bg-[#f7faf6] px-5 py-9 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-4 text-sm text-[#5d7463] sm:flex-row sm:items-center sm:justify-between">
            <p>ENGG2202 · Teach to Learn · HKU Engineering</p>
          </div>
        </footer>
      </main>
    </SiteShell>
  );
}

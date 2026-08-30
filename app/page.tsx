"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SiteShell from "./components/site-shell";
import StageArtwork from "./components/stage-artwork";
import { imagePath } from "./lib/image-path";

const heroImages = [
  "/images/teach-to-learn/green-technology-hero.webp",
  "/images/teach-to-learn/home-hero-1.png",
  "/images/teach-to-learn/home-hero-2.png",
];

const stages = [
  { number: "01", short: "Focus", label: "Challenge Focus" },
  { number: "02", short: "Define", label: "Problem Validation" },
  { number: "03", short: "Plan", label: "Proposal & Plan" },
  { number: "04", short: "Learn", label: "First Working Version" },
  { number: "05", short: "Improve", label: "Test & Iteration" },
  { number: "06", short: "Teach", label: "Share, Teach & Release" },
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
              className={`absolute inset-0 object-cover object-center transition-opacity duration-[1400ms] ease-in-out ${index === heroIndex ? "opacity-100" : "opacity-0"} ${index === heroIndex ? "hero-motion" : ""}`}
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

        <section className="border-b border-[#d7e4d9] bg-white">
          <div className="mx-auto max-w-[90rem] px-5 py-7 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-xl text-sm font-semibold leading-6 text-[#34523d]">
                Mastery grows when knowledge moves beyond understanding and
                becomes something you can use, explain and share.
              </p>
              <ol className="flex flex-wrap items-center gap-2" aria-label="Teach-to-Learn mastery progression">
                {mastery.map((item, index) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className={`rounded-full px-3.5 py-2 text-xs font-bold ${index === mastery.length - 1 ? "bg-[#153f27] text-white" : "bg-[#edf4ee] text-[#2e543a]"}`}>
                      {item}
                    </span>
                    {index < mastery.length - 1 ? <span className="text-[#9aad9f]">→</span> : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} transition={{ duration: 0.6 }} className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4d7459]">One project · six decisions</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#102d1b] sm:text-5xl">
                Enough structure to start.
                <span className="block text-[#318248]">Enough freedom to own it.</span>
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[#4a6452] lg:justify-self-end">
              Every team works through the same engineering decisions, but the
              problem, technology, pace and final contribution remain theirs.
              The stages are gates for evidence and discussion—not a rigid weekly checklist.
            </p>
          </motion.div>

          <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-[#cfe0d2] bg-[#eaf3e8] shadow-[0_24px_70px_-48px_rgba(15,60,32,0.34)] sm:grid-cols-2 lg:grid-cols-3">
            {stages.map((stage, index) => (
              <Link
                key={stage.number}
                href={`/engg2202#stage-${stage.number}`}
                className={`group overflow-hidden border-[#dbe8dd] bg-white transition hover:bg-[#f1f8f1] ${index % 3 !== 2 ? "lg:border-r" : ""} ${index < 3 ? "border-b" : ""} ${index % 2 === 0 ? "sm:border-r lg:border-r" : "sm:border-r-0"}`}
              >
                <StageArtwork stage={stage.number} className="h-32 w-full border-b border-[#d8e5da] sm:h-36" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
                <div className="relative min-h-44 p-6 sm:p-7">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(90,182,107,0.1),transparent_52%)]" />
                  <div className="relative flex items-start justify-between">
                    <span className="text-xs font-bold tracking-[0.16em] text-[#72907a]">{stage.number}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c9dcca] text-[#346444] transition group-hover:bg-[#173f28] group-hover:text-white">
                      <ArrowIcon />
                    </span>
                  </div>
                  <div className="relative">
                    <p className="mt-7 text-2xl font-semibold tracking-[-0.025em] text-[#143620]">{stage.short}</p>
                    <p className="mt-2 text-sm leading-6 text-[#5b7161]">{stage.label}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer className="border-t border-[#d7e4d9] bg-[#f7faf6] px-5 py-9 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-4 text-sm text-[#5d7463] sm:flex-row sm:items-center sm:justify-between">
            <p>ENGG2202 · Teach to Learn · HKU Engineering</p>
            <p>Learn it. Use it. Explain it. Teach it forward.</p>
          </div>
        </footer>
      </main>
    </SiteShell>
  );
}

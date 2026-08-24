"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SiteShell from "../components/site-shell";
import { imagePath } from "../lib/image-path";

const engg1101NotionPublicUrl =
  "https://engineering-challenges.notion.site/ENGG1101-Engineering-Challenges-247d72aefb858052a816d5232746d4db?source=copy_link";

// This is the special embeddable Notion path, different from the public share link.
// It was verified via response headers to return frame-ancestors https: http:,
// which allows embedding from any site. The double slash after /ebd is intentional
// and must not be cleaned up or normalized.
const engg1101NotionEmbedUrl =
  "https://engineering-challenges.notion.site/ebd//bb7d72aefb85829ea48381c1d8bdd58e";

const sections = [
  {
    title: "Course Overview",
    items: [
      "A hands-on, project-based experience designed for first-year engineering students.",
      "Students work in teams to explore problems, build prototypes and test ideas through guided studio activities.",
      "The course emphasizes making, iteration, reflection and communication as core engineering habits.",
    ],
  },
  {
    title: "Learning Objectives",
    items: [
      "Understand the engineering design process from problem framing to prototype refinement.",
      "Develop teamwork, communication and collaborative problem-solving skills in a studio environment.",
      "Use testing, feedback and reflection to improve solutions with purpose and confidence.",
    ],
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/*
  Assessment details are temporarily hidden because ENGG1101 assessment
  is not finalized yet. Keep the original data and icon renderer here for
  quick restoration when the final scheme is confirmed.

const assessmentCards = [
  {
    weight: "55%",
    title: "Checkpoints & Assignments",
    subtitle: "Individual work",
    description: "Checkpoint exercises and short written assignments.",
    icon: "checklist",
  },
  {
    weight: "15%",
    title: "Presentations",
    subtitle: "Group work",
    description: "Poster sharing and project presentation.",
    icon: "presentation",
  },
  {
    weight: "30%",
    title: "Reports",
    subtitle: "Individual work",
    description: "Interim reporting and final reflection.",
    icon: "report",
  },
];

const assessmentRows = [
  {
    type: "Checkpoints (Mainly MCs)",
    weight: "35%",
    note: "INDIVIDUAL WORK",
    description: "Short checkpoint exercises focused on quick understanding checks.",
  },
  {
    type: "Short Written Assignments",
    weight: "20%",
    note: "Individual work",
    description: "Concise written submissions that document your progress and reflection.",
  },
  {
    type: "Poster",
    weight: "5%",
    note: "Group work",
    description: "A visual summary of the project outcome and key ideas.",
  },
  {
    type: "Presentation",
    weight: "10%",
    note: "Group work",
    description: "An oral presentation explaining the project and its decisions.",
  },
  {
    type: "Interim Report",
    weight: "15%",
    note: "Individual work",
    description: "A mid-course report on progress, findings, and next steps.",
  },
  {
    type: "Final Report on Improvements, Results, and Reflection",
    weight: "15%",
    note: "Individual work",
    description: "A final report summarising improvements, results and reflection.",
  },
];

function AssessmentIcon({ type }: { type: string }) {
  const baseClass = "h-5 w-5 text-[#9b2c8a]";

  if (type === "checklist") {
    return (
      <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M8 9h8" />
        <path d="M8 13h8" />
        <path d="m8 17 2-2 2 2 4-4" />
      </svg>
    );
  }

  if (type === "presentation") {
    return (
      <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="4" width="16" height="10" rx="2" />
        <path d="M12 14v4" />
        <path d="M9 18h6" />
        <path d="M8 10h8" />
        <path d="M12 6v4" />
      </svg>
    );
  }

  return (
    <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h9l5 5v13H6z" />
      <path d="M15 3v5h5" />
      <path d="M8 12h8" />
      <path d="M8 16h8" />
    </svg>
  );
}
*/

export default function Engg1101Page() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-8">
        <motion.section
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, ease: "easeOut" }}
          variants={fadeIn}
          whileHover={{ scale: 1.01, y: -2 }}
          className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-950 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] transition-transform duration-200 ease-out sm:min-h-[420px]"
        >
          <div className="absolute inset-0">
            <Image
              src={imagePath("/images/Course/Timmy_groupphoto.jpg")}
              alt="ENGG1101 students and teaching team group photo"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/52 to-slate-950/18" />
                A first-year course where students build their engineering toolkit and fundamentals through hands-on, team-based activities.
          </div>

          <div className="relative z-10 flex min-h-[360px] items-center p-8 sm:min-h-[420px] sm:p-10">
            <div className="max-w-2xl space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-200/90">
                ENGG1101
              </p>
              <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl sm:leading-[1.08]">
                <span className="block bg-gradient-to-r from-cyan-300/80 via-sky-400/80 to-emerald-400/80 bg-clip-text text-transparent">
                  Engineering Challenges
                </span>
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
                A first-year course where students build their engineering toolkit and fundamentals through hands-on, team-based activities.
              </p>
            </div>
          </div>
        </motion.section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <motion.article
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            variants={fadeIn}
            className="rounded-[2rem] border border-cyan-200 bg-cyan-50/80 p-7 shadow-[0_20px_60px_-42px_rgba(8,145,178,0.24)] lg:col-span-2"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">
              Schedule
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 lg:whitespace-nowrap">
              Class Schedule · Semester 1 · Academic Year 2026/27
            </h2>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm leading-7 text-slate-700 sm:text-base">
                  Select your subclass to see every lecture and workshop date, time, venue and teacher.
                </p>
              </div>
              <Link
                href="/engg1101/schedule"
                className="inline-flex w-full shrink-0 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
              >
                View Semester 1 Schedule
              </Link>
            </div>
          </motion.article>

          {sections.map((section, index) => (
            <motion.article
              key={section.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.06 * index }}
              variants={fadeIn}
              whileHover={{ scale: 1.01, y: -2 }}
              className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-7 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.14)] transition-transform duration-200 ease-out"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                {section.title}
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                {section.items.map((item) => (
                  <li key={item} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </section>

        <section
          id="assessment"
          className="mt-10 rounded-[2rem] border border-slate-200/80 bg-white/92 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] sm:p-10"
        >
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700/80">
                Assessment
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Course Assessment
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Course assessment details are to be confirmed.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-8 text-center shadow-[0_16px_40px_-34px_rgba(15,23,42,0.18)] sm:px-8">
              <p className="text-lg font-semibold text-slate-900">To be confirmed.</p>
            </div>
          </div>
        </section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          variants={fadeIn}
          className="mt-10 rounded-[2rem] border border-slate-200/80 bg-white/92 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] sm:p-10"
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700/80">
                Course Materials
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Notion Page
              </h2>
            </div>

            <div>
              <a
                href={engg1101NotionPublicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                <span>Open in new tab</span>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </a>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_20px_50px_-36px_rgba(15,23,42,0.24)]">
              <iframe
                src={engg1101NotionEmbedUrl}
                title="ENGG1101 Course Materials"
                width="100%"
                height="980"
                loading="lazy"
                className="block h-[900px] w-full md:h-[980px]"
                style={{ border: 0 }}
              />
            </div>

          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          variants={fadeIn}
          whileHover={{ scale: 1.01, y: -2 }}
          className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.18)] transition-transform duration-200 ease-out"
        >
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <div className="relative min-h-[260px] overflow-hidden bg-slate-200 sm:min-h-[320px]">
              <Image
                src={imagePath("/images/Course/edwin_workshop.jpg")}
                alt="ENGG1101 story preview"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-slate-950/10 to-transparent" />
            </div>

            <div className="flex items-center bg-[#f7f5f1] px-8 py-8 sm:px-10 sm:py-10">
              <div className="max-w-xl space-y-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Story
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Check the Story of ENGG1101
                </h2>
                <p className="text-sm leading-7 text-slate-700 sm:text-base">
                  The students of ENGG1101 tackle real challenges through prototype building, live pitching, teamwork, iterative problem-solving, and senior-to-junior mentoring.
                </p>
                <Link
                  href="/engg1101/gallery"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Open Story
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          variants={fadeIn}
          whileHover={{ scale: 1.01, y: -2 }}
          className="mt-10 rounded-[2rem] border border-slate-800 bg-slate-950 p-8 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.5)] transition-transform duration-200 ease-out sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/75">
                Robotic Arm Experience
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Experience the robotic arm
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                Use the controller to explore an interactive robotic arm built for ENGG1101 workshop.
              </p>
              <Link
                href="/engg1101/robotic-arm-controller"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Open controller page
              </Link>
            </div>

            <div className="relative flex min-h-[260px] items-center justify-end px-4 sm:min-h-[320px] sm:px-6">
              <div className="relative ml-auto aspect-[4/3] w-full max-w-[440px]">
                <Image
                  src={imagePath("/images/Course/robotarm.png")}
                  alt="Robotic arm workshop model"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-contain object-right"
                />
              </div>
            </div>
          </div>
        </motion.section>

      </main>
    </SiteShell>
  );
}
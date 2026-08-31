import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "../components/site-shell";
import { imagePath } from "../lib/image-path";
import { AssessmentInformation, SemesterMeetings } from "./course-information";

export const metadata: Metadata = {
  title: "About",
  description:
    "About the ENGG2202 Teach-to-Learn strand of HKU Engineering Active Learning and its Green Technology theme.",
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <SiteShell>
      <main>
        <section className="overflow-hidden border-b border-[#d8e4d9] bg-[#eef6ec] px-5 py-16 sm:px-8 lg:px-10 lg:py-22">
          <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#52765c]">About this microsite</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#11301d] sm:text-6xl lg:text-7xl">
                A focused part of a wider
                <span className="block text-[#318248]">Active Learning community.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-9 text-[#48604f]">
                This is the ENGG2202 Teach-to-Learn space. It helps you turn
                project experience into engineering knowledge that other people
                can understand, question and use.
              </p>
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-[2.2rem] bg-[#173f28] shadow-[0_36px_100px_-62px_rgba(15,60,32,0.55)] sm:min-h-[520px]">
              <Image
                src={imagePath("/images/teach-to-learn/kyle-green-technology-studio.webp")}
                alt="ENGG2202 instructor in a Green Technology project studio with students, solar sensing and prototype systems"
                fill
                priority
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#102e1d]/95 via-[#102e1d]/55 to-transparent p-7 pt-24 text-white sm:p-9 sm:pt-28">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d7f43c]">Green Technology studio</p>
                <p className="mt-2 max-w-lg text-lg font-semibold leading-7">Whether you want to explore a Green Technology challenge, turn an idea into a working solution, or contribute something useful to society, this is where your project journey begins.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              ["01", "The main Active Learning site", "Meet the wider teaching initiative, its courses, team and shared activities."],
              ["02", "This Teach-to-Learn site", "Follow the ENGG2202 project journey, understand the evidence expected at each Gate and explore student projects."],
              ["03", "Team project repositories", "See each project’s files, issues, versions, tests, decisions and release history."],
            ].map(([number, title, copy], index) => (
              <article key={number} className={`rounded-[2rem] p-7 ${index === 1 ? "bg-[#153f27] text-white" : "border border-[#d4e1d6] bg-white text-[#183822]"}`}>
                <p className={`text-xs font-bold tracking-[0.16em] ${index === 1 ? "text-[#b9d8bf]" : "text-[#718776]"}`}>{number}</p>
                <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em]">{title}</h2>
                <p className={`mt-4 text-sm leading-7 ${index === 1 ? "text-white/75" : "text-[#526858]"}`}>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <SemesterMeetings />

        <AssessmentInformation />

        <section className="bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">The learning proposition</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#143421] sm:text-5xl">Doing gives you experience. Evidence and explanation turn it into learning.</h2>
              <p className="mt-6 text-base leading-8 text-[#506656]">
                Self-study resources can help you get past one obstacle. Active
                learning goes further: you choose, investigate, build, test,
                receive feedback, revise and apply what you learned in a new
                context. Teach to Learn asks one more question: can someone else
                now use that knowledge?
              </p>
              <div className="mt-7 rounded-2xl border border-[#d4e1d6] bg-[#f5faf4] p-5">
                <p className="text-sm font-semibold leading-6 text-[#2f583a]">Teaching shows whether another person can use what you learned. Contributing makes that learning available for others to reuse, question and extend.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-2 xl:grid-cols-5">
              {[
                ["Learn", "Find and understand a useful idea.", "/images/teach-to-learn/mastery-learn.webp"],
                ["Apply", "Use it in a real project decision.", "/images/teach-to-learn/mastery-apply.webp"],
                ["Explain", "Make the reasoning visible.", "/images/teach-to-learn/mastery-explain.webp"],
                ["Teach", "Help another person use it.", "/images/teach-to-learn/mastery-teach.webp"],
                ["Contribute", "Leave something others can build on.", "/images/teach-to-learn/mastery-contribute.webp"],
              ].map(([item, copy, image], index) => (
                <article key={item} className={`group overflow-hidden rounded-2xl border ${index === 4 ? "border-[#b9d42c] bg-[#d7f43c] text-[#193820]" : "border-[#d4e1d6] bg-[#edf4ed] text-[#335b3f]"}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#dfeade]">
                    <Image src={imagePath(image)} alt="" fill sizes="(min-width: 1280px) 12vw, 45vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/88 px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.12em] text-[#30563a] backdrop-blur">0{index + 1}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-lg font-semibold">{item}</p>
                    <p className="mt-2 text-xs leading-5 text-current/72">{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#d8e4d9] bg-[#eef6ec] px-5 py-14 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[90rem] gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Teach is a method. Contribute is the lasting outcome.</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#143421]">A useful contribution remains useful after the class ends.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-[1.5rem] border border-[#d4e1d6] bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6d8673]">Teach</p>
                <p className="mt-4 text-lg font-semibold text-[#173823]">Help a real audience understand or use the work.</p>
                <p className="mt-3 text-sm leading-7 text-[#526858]">A workshop, tutorial, demonstration or guided handover shows where your explanation still needs work.</p>
              </article>
              <article className="rounded-[1.5rem] bg-[#173f28] p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d7f43c]">Contribute</p>
                <p className="mt-4 text-lg font-semibold">Leave a durable, responsible starting point for others.</p>
                <p className="mt-3 text-sm leading-7 text-white/72">Teaching may be part of it. The lasting contribution is the open repository, evidence, documentation, licence and clear limits that others can build on.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[#153f27] px-5 py-16 text-white sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b9d8bf]">Course administration</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">Use this page to understand the course. Use Moodle for confirmed deadlines, rubrics and submissions.</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="https://activelearning.engg.hku.hk/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#173b25]">
                Visit Active Learning Hub
                <ArrowIcon />
              </a>
              <Link href="/engg2202" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-5 py-3 text-sm font-bold text-white">
                View Project Journey
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

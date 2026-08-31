import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "../components/site-shell";
import { AssessmentInformation, SemesterMeetings } from "./course-information";

export const metadata: Metadata = {
  title: "Course Information",
  description:
    "ENGG2202 meeting dates, assessment structure, Gate checkpoints and written report requirements.",
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
          <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#52765c]">ENGG2202 course information</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#11301d] sm:text-6xl lg:text-7xl">
                Meetings,
                <span className="block text-[#318248]">assessment and deadlines.</span>
              </h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-lg leading-9 text-[#48604f]">
                Find the fixed class meetings, assessment weights, six Gate submissions and the two written reports here. Moodle contains the confirmed deadlines, rubrics and submission links.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#meetings" className="inline-flex items-center gap-2 rounded-full bg-[#173f28] px-5 py-3 text-sm font-bold text-white">Meeting schedule <ArrowIcon /></a>
                <a href="#assessment" className="inline-flex items-center gap-2 rounded-full border border-[#a9c0ae] bg-white px-5 py-3 text-sm font-bold text-[#214b31]">Assessment overview <ArrowIcon /></a>
              </div>
            </div>
          </div>
        </section>

        <SemesterMeetings />
        <AssessmentInformation />

        <section className="bg-[#153f27] px-5 py-14 text-white sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b9d8bf]">Where to go next</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">Use the Project Journey for methods and the Student Guide for detailed working materials.</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/engg2202" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#173b25]">Project Journey <ArrowIcon /></Link>
              <Link href="/guide" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-5 py-3 text-sm font-bold text-white">Student Guide <ArrowIcon /></Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

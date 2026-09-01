import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "../components/site-shell";
import { imagePath } from "../lib/image-path";
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
        <section className="overflow-hidden border-b border-[#d8e4d9] bg-[#eef6ec] px-5 py-12 sm:px-8 lg:px-10 lg:py-18">
          <div className="mx-auto grid max-w-[90rem] gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
            <div className="flex flex-col justify-center py-5 lg:py-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#52765c]">ENGG2202 course information</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#11301d] sm:text-6xl">
                Start here when
                <span className="block text-[#318248]">you need the course details.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#48604f]">
                Find the fixed class meetings, assessment weights, six Gate submissions and the two written reports here. Moodle contains the confirmed deadlines, rubrics and submission links.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#meetings" className="inline-flex items-center gap-2 rounded-full bg-[#173f28] px-5 py-3 text-sm font-bold text-white">Meeting schedule <ArrowIcon /></a>
                <a href="#assessment" className="inline-flex items-center gap-2 rounded-full border border-[#a9c0ae] bg-white px-5 py-3 text-sm font-bold text-[#214b31]">Assessment overview <ArrowIcon /></a>
              </div>
            </div>

            <div className="relative min-h-[27rem] overflow-hidden rounded-[2rem] border border-[#d1dfd3] bg-[#173f28] shadow-[0_28px_80px_-58px_rgba(15,60,32,0.48)]">
              <Image
                src={imagePath("/images/teach-to-learn/kyle-green-technology-studio.webp")}
                alt="ENGG2202 teacher in a Green Technology project studio"
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-[center_30%]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(9,38,21,0.92)_0%,rgba(9,38,21,0.2)_66%,transparent_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7f43c]">Green Technology studio</p>
                <p className="mt-3 max-w-2xl text-xl font-semibold leading-8 sm:text-2xl sm:leading-9">
                  Whether you want to explore a Green Technology challenge, turn an idea into a working solution, or contribute something useful to society, this is where your project journey begins.
                </p>
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

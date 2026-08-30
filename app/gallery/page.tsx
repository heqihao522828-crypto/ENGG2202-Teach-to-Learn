import type { Metadata } from "next";
import Image from "next/image";
import SiteShell from "../components/site-shell";
import SdgMosaic from "../components/sdg-mosaic";
import { imagePath } from "../lib/image-path";

export const metadata: Metadata = {
  title: "Student Projects",
  description:
    "Explore ENGG2202 engineering projects through their open repositories, evidence and learning stories.",
};

const projects = [
  {
    title: "Solar Weather Station",
    status: "Instructor exemplar · in development",
    description:
      "A modular, solar-powered environmental sensing prototype used to show how an engineering project develops through open-source study, testing, iteration and responsible release.",
    image: "/images/teach-to-learn/green-technology-products.webp",
    href: "https://github.com/heqihao522828-crypto/solar-weather-station",
    tags: ["Sensing", "IoT", "Solar power", "Field testing"],
    sdgs: [
      { number: "07", title: "Affordable and Clean Energy", image: "/images/teach-to-learn/sdg/goal-07.png" },
      { number: "09", title: "Industry, Innovation and Infrastructure", image: "/images/teach-to-learn/sdg/goal-09.png" },
      { number: "13", title: "Climate Action", image: "/images/teach-to-learn/sdg/goal-13.png" },
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

export default function StudentProjectsPage() {
  return (
    <SiteShell>
      <main>
        <section className="overflow-hidden border-b border-[#d9e6db] bg-white">
          <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4f765a]">Open engineering in practice</p>
              <h1 className="mt-5 text-6xl font-semibold leading-[0.92] tracking-[-0.055em] text-[#112e1d] sm:text-7xl lg:text-8xl">
                Student
                <span className="block text-[#318248]">Projects.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-9 text-[#48614f]">
                Each card opens the project’s own repository: the place where
                its design files, decisions, test evidence, versions and
                learning story remain visible.
              </p>
            </div>
            <SdgMosaic />
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="flex flex-col gap-4 border-b border-[#d5e2d7] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57735e]">Project directory</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#153321]">Explore the evidence, not only the final demo.</h2>
            </div>
            <p className="text-sm text-[#607566]">{projects.length} published project</p>
          </div>

          <div className="mt-10 grid gap-7 md:grid-cols-2">
            {projects.map((project) => (
              <a
                key={project.title}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#cfddcf] bg-white shadow-[0_24px_70px_-52px_rgba(15,60,32,0.42)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-48px_rgba(15,60,32,0.48)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#dce9dc]">
                  <Image src={imagePath(project.image)} alt="Solar weather station and related green technology engineering systems" fill sizes="(min-width: 1280px) 30vw, (min-width: 768px) 48vw, 100vw" className="object-cover object-left transition duration-700 group-hover:scale-[1.035]" />
                  <div className="absolute left-5 top-5 flex gap-2" aria-label="Related Sustainable Development Goals">
                    {project.sdgs.map((sdg) => (
                      <div key={sdg.number} className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-white bg-white shadow-[0_10px_28px_-12px_rgba(0,0,0,0.65)] sm:h-16 sm:w-16" title={`SDG ${sdg.number}: ${sdg.title}`}>
                        <Image src={imagePath(sdg.image)} alt={`SDG ${sdg.number}: ${sdg.title}`} fill sizes="64px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#69806e]">{project.status}</p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#153321]">{project.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#506456]">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#edf4ed] px-3 py-1.5 text-xs font-semibold text-[#41614a]">{tag}</span>
                    ))}
                  </div>
                  <p className="mt-5 text-xs leading-5 text-[#718176]">Related SDGs indicate the project context. The repository must still justify the target connection and any impact claim.</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#226439]">
                    View project repository
                    <ArrowIcon />
                  </span>
                </div>
              </a>
            ))}

            <div className="flex min-h-[24rem] flex-col justify-between rounded-[1.8rem] border border-dashed border-[#acc2b0] bg-[#edf4ed] p-7 text-[#34543e] sm:min-h-[31rem]">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#afc6b3] bg-white text-xl">+</span>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-[#173823]">More project stories are coming.</h3>
                <p className="mt-4 text-sm leading-7 text-[#526a58]">
                  As ENGG2202 teams complete evidence, attribution, consent,
                  safety and public-release checks, selected work will join this collection.
                </p>
              </div>
              <p className="border-t border-[#ceddcf] pt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#667b6a]">Your project could become part of this collection</p>
            </div>
          </div>
        </section>

        <section className="border-y border-[#d8e4d9] bg-white px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[90rem] gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57735e]">Before a project appears here</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#153321]">Responsible release is part of the engineering.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                'Evidence, revisions and enough guidance for another person to understand or continue the work',
                'SDG rationale, sources, licence and stakeholder consent are clear',
                'Safety, privacy, location and claims have been checked before publication',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-[#d7e3d9] bg-[#f8fbf8] p-4 text-sm font-semibold leading-6 text-[#3d5945]">{item}</div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

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

function ReleaseIcon({ type }: { type: "understand" | "reuse" | "trust" }) {
  if (type === "understand") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20M8 7h8M8 11h6" /></svg>;
  }
  if (type === "reuse") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true"><path d="M8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3" /><path d="M10 14 21 3M15 3h6v6" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true"><path d="M12 3 20 6v5c0 5.2-3.5 8.5-8 10-4.5-1.5-8-4.8-8-10V6l8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></svg>;
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
                Each card opens a public GitHub repository where students share
                the files, decisions, tests and versions behind the project.
                Others can use that record to understand the work, reuse it
                responsibly and improve it.
              </p>
            </div>
            <SdgMosaic />
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="flex flex-col gap-4 border-b border-[#d5e2d7] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57735e]">Project directory</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#153321]">Explore the decisions and evidence behind each project.</h2>
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
                  <Image src={imagePath(project.image)} alt="Solar weather station and related green technology engineering systems" fill preload sizes="(min-width: 1280px) 30vw, (min-width: 768px) 48vw, 100vw" className="object-cover object-left transition duration-700 group-hover:scale-[1.035]" />
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
                    View GitHub repository
                    <ArrowIcon />
                  </span>
                </div>
              </a>
            ))}

            <div className="flex min-h-[24rem] flex-col justify-between rounded-[1.8rem] border border-dashed border-[#acc2b0] bg-[#edf4ed] p-7 text-[#34543e] sm:min-h-[31rem]">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#afc6b3] bg-white text-xl">+</span>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.15em] text-[#67806d]">From active learning to contribution</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#173823]">More project stories will grow here.</h3>
                <p className="mt-4 text-sm leading-7 text-[#526a58]">
                  Each team leaves a clear record of its decisions, evidence,
                  revisions and shareable materials. An open GitHub repository
                  gives the next team something they can study, question and
                  improve.
                </p>
                <div className="mt-7 grid grid-cols-2 gap-2 text-center text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#41614a] sm:grid-cols-4">
                  {['Evidence', 'Explain', 'Release', 'Build on'].map((item, index) => (
                    <div key={item} className="rounded-full bg-white px-2 py-2.5 shadow-sm"><span className="mr-1 text-[#2d7c43]">0{index + 1}</span>{item}</div>
                  ))}
                </div>
              </div>
              <p className="border-t border-[#ceddcf] pt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#667b6a]">Leave something the next team can use</p>
            </div>
          </div>
        </section>

        <section className="border-y border-[#d8e4d9] bg-white px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[90rem]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57735e]">A public repository is part of the engineering outcome</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-[#153321]">Open source should be understandable, reusable and trustworthy.</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#526858]">A public repository should not contain every file by default. Teams organise the evidence, include what another person needs, and check what is safe and appropriate to share.</p>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              {[
                { type: 'understand' as const, number: '01', title: 'Make it understandable', copy: 'Show the question, decisions, setup, evidence, versions and limits behind the polished result.' },
                { type: 'reuse' as const, number: '02', title: 'Make it reusable', copy: 'Provide a clear README, source files, instructions, licence and attribution so another team can continue responsibly.' },
                { type: 'trust' as const, number: '03', title: 'Make it trustworthy', copy: 'Check safety, privacy, consent, sensitive locations and sustainability claims before public release.' },
              ].map((item) => (
                <article key={item.number} className="relative overflow-hidden rounded-[1.7rem] border border-[#d7e3d9] bg-[#f8fbf8] p-6 text-[#3d5945]">
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#dff0df]" />
                  <div className="relative flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173f28] text-white"><ReleaseIcon type={item.type} /></span>
                    <span className="text-xs font-bold tracking-[0.16em] text-[#78907d]">{item.number}</span>
                  </div>
                  <h3 className="relative mt-8 text-xl font-semibold tracking-[-0.025em] text-[#173823]">{item.title}</h3>
                  <p className="relative mt-3 text-sm leading-7 text-[#526858]">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

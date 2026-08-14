"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CourseEditorialGallery from "../../components/course-editorial-gallery";
import SiteShell from "../../components/site-shell";
import { imagePath } from "../../lib/image-path";

const fadeIn = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function Engg1101GalleryPage() {
  return (
    <SiteShell>
      <main className="relative overflow-hidden bg-[#f5f5f7]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/90 blur-3xl" />
          <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-slate-200/60 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-8">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="rounded-[2rem] border border-white/70 bg-gradient-to-b from-white to-[#f4f4f6] p-6 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.35)] sm:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">Story</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              The Story of ENGG1101
            </h1>
            <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700 sm:text-lg">
              The Story of ENGG1101 students tackling real challenges through prototype building, live pitching, teamwork, iterative problem-solving, and senior-to-junior mentoring.
            </p>
          </motion.section>

          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="relative z-10 -mt-4 rounded-[2rem] border border-slate-200/80 bg-[#f7f5f1] p-4 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.18)] sm:-mt-6 sm:p-5"
          >
            <article className="grid gap-5 rounded-[1.65rem] border border-slate-200/70 bg-white/80 p-5 shadow-[0_18px_52px_-40px_rgba(15,23,42,0.22)] sm:p-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6 lg:p-6">
              <div className="relative flex min-h-[300px] items-center overflow-hidden rounded-[1.4rem] bg-white px-4 py-5 sm:px-5 lg:min-h-[320px]">
                <span className="pointer-events-none absolute left-2 top-0 text-[6.5rem] font-semibold leading-none tracking-tight text-slate-100 sm:text-[8rem]">
                  01
                </span>
                <div className="relative max-w-2xl space-y-4 pt-12 sm:space-y-5">
                  <h2 className="text-[1.8rem] font-semibold leading-[0.96] tracking-tight text-[#0f4d94] sm:text-[2.25rem] lg:text-[2.7rem]">
                    Our Year-1 students are solving Hong Kong's real engineering challenges.
                  </h2>
                  <div className="h-1.5 w-28 rounded-full bg-[#0f4d94]" />
                  <p className="inline bg-white px-2 py-1 text-[1.2rem] font-semibold italic leading-snug text-[#0f4d94] box-decoration-clone sm:text-[1.4rem] lg:text-[1.65rem]">
                    &ldquo;I learnt a lot of new things about engineering - from drones to 3D printing.&rdquo;
                  </p>
                  <p className="text-sm font-medium tracking-[0.14em] text-slate-500 sm:text-base">
                    -- ENGG1101 student
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-3.5">
                <figure className="group sm:col-span-2">
                  <div className="relative aspect-[16/7.8] overflow-hidden rounded-[1.3rem] bg-slate-200 shadow-[0_14px_30px_-20px_rgba(15,23,42,0.5)]">
                    <Image
                      src={imagePath("/images/Course/prototype1.jpg")}
                      alt="Students testing a prototype tied to a real engineering challenge"
                      fill
                      priority
                      quality={72}
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover object-center"
                    />
                  </div>
                </figure>
                <figure className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.3rem] bg-slate-200 shadow-[0_14px_30px_-20px_rgba(15,23,42,0.5)]">
                    <Image
                      src={imagePath("/images/Course/prototype2.jpg")}
                      alt="Another technical prototype developed for practical use cases"
                      fill
                      quality={72}
                      sizes="(max-width: 1024px) 100vw, 20vw"
                      className="object-cover object-center"
                    />
                  </div>
                </figure>
                <figure className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.3rem] bg-slate-200 shadow-[0_14px_30px_-20px_rgba(15,23,42,0.5)]">
                    <Image
                      src={imagePath("/images/Course/experimentinworkshop.jpg")}
                      alt="Workshop experimentation translating ideas into hardware"
                      fill
                      quality={72}
                      sizes="(max-width: 1024px) 100vw, 20vw"
                      className="object-cover object-center"
                    />
                  </div>
                </figure>
              </div>
            </article>
          </motion.section>

          <CourseEditorialGallery compact startIndex={1} />
        </div>
      </main>
    </SiteShell>
  );
}

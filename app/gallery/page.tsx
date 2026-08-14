"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SiteShell from "../components/site-shell";
import { imagePath } from "../lib/image-path";

type GalleryPhoto = {
  src: string;
  alt: string;
  span: string;
};

const galleryPhotos: GalleryPhoto[] = [
  {
    src: imagePath("/images/Course/20250707014_Pilot_Workshop-scaled.jpg"),
    alt: "Pilot workshop on building your own prototype arm",
    span: "md:col-span-3 md:row-span-2",
  },
  {
    src: imagePath("/images/Course/edwin_workshop.jpg"),
    alt: "Instructor is guiding students during a workshop session",
    span: "md:col-span-3 md:row-span-1",
  },
  {
    src: imagePath("/images/Course/edwin_lecture.jpg"),
    alt: "Instructor is delivering a lecture on sustainable technologies",
    span: "md:col-span-3 md:row-span-2",
  },
  {
    src: imagePath("/images/Course/kyle_lecture.jpg"),
    alt: "Instructor is delivering a lecture on rapid prototyping",
    span: "md:col-span-3 md:row-span-1",
  },
  {
    src: imagePath("/images/Course/kyle_workshop1.jpg"),
    alt: "Student team is posing with their prototype",
    span: "md:col-span-3 md:row-span-2",
  },
  {
    src: imagePath("/images/Course/kyle_workshop2.jpg"),
    alt: "Student team is posing with their prototype",
    span: "md:col-span-3 md:row-span-2",
  },
  {
    src: imagePath("/images/Course/kyle_workshop3.jpg"),
    alt: "Student team is posing with their prototype",
    span: "md:col-span-3 md:row-span-1",
  },
  {
    src: imagePath("/images/Course/ryan_lecture.jpg"),
    alt: "Instructor is delivering a lecture on aerial robotics",
    span: "md:col-span-3 md:row-span-2",
  },
  {
    src: imagePath("/images/Course/studentgroup.jpg"),
    alt: "Student team is posing with their prototype",
    span: "md:col-span-3 md:row-span-1",
  },
  {
    src: imagePath("/images/Course/Timmy_groupphoto.jpg"),
    alt: "Students and instructor",
    span: "md:col-span-3 md:row-span-1",
  },
  {
    src: imagePath("/images/Course/timmy_lecture.jpg"),
    alt: "Instructor is delivering a lecture on design thinking",
    span: "md:col-span-3 md:row-span-2",
  },
  {
    src: imagePath("/images/Course/with_TO1.jpg"),
    alt: "Instructor is engaging in a lab showcase",
    span: "md:col-span-3 md:row-span-1",
  },
  {
    src: imagePath("/images/Course/with_TO2.jpg"),
    alt: "Instructor is engaging in a lab showcase",
    span: "md:col-span-3 md:row-span-1",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function GalleryPage() {
  return (
    <SiteShell>
      <main className="relative overflow-hidden bg-[#f5f5f7]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/90 blur-3xl" />
          <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-slate-200/60 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-8">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="rounded-[2.25rem] border border-white/70 bg-gradient-to-b from-white to-[#f4f4f6] p-8 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.35)] sm:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">Course Gallery</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Course Moments Gallery
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
              A curated visual archive of studio moments, workshops, lectures and project collaboration across the course journey.
            </p>
          </motion.section>

          <section className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:auto-rows-[210px] md:grid-cols-6 md:gap-6">
            {galleryPhotos.map((photo, index) => (
              <motion.figure
                key={photo.src}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeIn}
                transition={{ duration: 0.55, delay: index * 0.03 }}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/70 shadow-[0_16px_45px_-32px_rgba(15,23,42,0.55)] ${photo.span}`}
              >
                <div className="relative h-64 w-full sm:h-72 md:h-full">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.figure>
            ))}
          </section>
        </div>
      </main>
    </SiteShell>
  );
}

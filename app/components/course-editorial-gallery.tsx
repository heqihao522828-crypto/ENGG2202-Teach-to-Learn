"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { imagePath } from "../lib/image-path";

type NarrativePhoto = {
  src: string;
  alt: string;
};

type NarrativeEntry = {
  statement: string;
  quote: string;
  byline: string;
  align: "left" | "right";
  photos: NarrativePhoto[];
};

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const entries: NarrativeEntry[] = [
  {
    statement:
      "Our Year-1 students are solving Hong Kong's real engineering challenges.",
    quote:
      "I learnt a lot of new things about engineering - from drones to 3D printing.",
    byline: "ENGG1101 student",
    align: "left",
    photos: [
      {
        src: imagePath("/images/Course/prototype1.jpg"),
        alt: "Students testing a prototype tied to a real engineering challenge",
      },
      {
        src: imagePath("/images/Course/prototype2.jpg"),
        alt: "Another technical prototype developed for practical use cases",
      },
      {
        src: imagePath("/images/Course/experimentinworkshop.jpg"),
        alt: "Workshop experimentation translating ideas into hardware",
      },
    ],
  },
  {
    statement:
      "No two projects looked the same - creativity was never optional.",
    quote:
      "Being able to actually build something rather than just studying theory has been exciting.",
    byline: "ENGG1101 student",
    align: "right",
    photos: [
      {
        src: imagePath("/images/Course/studentwithprototype1.jpg"),
        alt: "One team showing its own prototype direction",
      },
      {
        src: imagePath("/images/Course/studentwithprototype2.jpg"),
        alt: "A different group with a distinct build concept",
      },
      {
        src: imagePath("/images/Course/studentwithprototype3.jpg"),
        alt: "Another unique prototype demonstrating creative variation",
      },
    ],
  },
  {
    statement:
      "They didn't just build it, they had to convince a real audience.",
    quote:
      "It was amazing to build a robotic arm from scratch and design algorithm to make it move.",
    byline: "ENGG Student",
    align: "left",
    photos: [
      {
        src: imagePath("/images/Course/student_presentation1.jpg"),
        alt: "Students presenting and pitching to a live audience",
      },
      {
        src: imagePath("/images/Course/student_presentation2.jpg"),
        alt: "Project communication and Q&A during presentation",
      },
      {
        src: imagePath("/images/Course/poster_demo.png"),
        alt: "Poster demo board used to convince judges and visitors",
      },
    ],
  },
  {
    statement:
      "A year-long team project is a leader ship challenge, not just group work.",
    quote:
      "The workshop is really interesting - I can train my cooperation skills with my teammates.",
    byline: "ENGG Student",
    align: "right",
    photos: [
      {
        src: imagePath("/images/Course/workshopgroupphoto.jpg"),
        alt: "Full team photo showing collaboration over a long project",
      },
      {
        src: imagePath("/images/Course/studentgroup.jpg"),
        alt: "Teammates coordinating roles and responsibilities",
      },
      {
        src: imagePath("/images/Course/Timmy_groupphoto.jpg"),
        alt: "Leadership and trust built through year-long teamwork",
      },
    ],
  },
  {
    statement:
      "When they hit a wall, they figured out how to climb over it themselves.",
    quote:
      "I like the active learning aspect. It allowed me to network adn have fun while learning.",
    byline: "ENGG1101 student",
    align: "left",
    photos: [
      {
        src: imagePath("/images/Course/experimentinworkshop2.jpg"),
        alt: "Students troubleshooting and iterating after hitting roadblocks",
      },
      {
        src: imagePath("/images/Course/teachinginworkshop.jpg"),
        alt: "Guided support in workshop while teams refine solutions",
      },
      {
        src: imagePath("/images/Course/edwin_workshop.jpg"),
        alt: "Hands-on iteration that turns failed attempts into progress",
      },
    ],
  },
  {
    statement:
      "Year-2+ students came back to teach the next cohort unprompted.",
    quote:
      "Help me understand engineering in a pratical way.",
    byline: "ENGG1101 student",
    align: "right",
    photos: [
      {
        src: imagePath("/images/Course/with_TO1.jpg"),
        alt: "Senior students returning to share experience with juniors",
      },
      {
        src: imagePath("/images/Course/with_TO2.jpg"),
        alt: "Mentors and senior peers guiding the next cohort",
      },
      {
        src: imagePath("/images/Course/kyle_lecture.jpg"),
        alt: "Peer teaching in class to support newer engineering students",
      },
    ],
  },
];

function PhotoCard({
  photo,
  priority = false,
  featured = false,
}: {
  photo: NarrativePhoto;
  priority?: boolean;
  featured?: boolean;
}) {
  return (
    <figure className="group">
      <div
        className={`relative overflow-hidden rounded-[1.6rem] bg-slate-200 shadow-[0_14px_30px_-20px_rgba(15,23,42,0.5)] ${
          featured ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          quality={72}
          sizes={featured ? "(max-width: 1024px) 100vw, 42vw" : "(max-width: 1024px) 100vw, 20vw"}
          className="object-cover object-center transition duration-500 ease-out group-hover:scale-[1.02]"
        />
      </div>
    </figure>
  );
}

export default function CourseEditorialGallery({
  compact = false,
  sectionId,
  startIndex = 0,
}: {
  compact?: boolean;
  sectionId?: string;
  startIndex?: number;
}) {
  const sectionClassName = compact ? "relative -mt-8 sm:-mt-10" : "mt-12";
  const containerClassName = compact
    ? "rounded-[1.8rem] border border-slate-200/80 bg-[#f7f5f1] px-4 py-4 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.18)] sm:px-5 sm:py-5 lg:px-6"
    : "rounded-[2.2rem] border border-slate-200/80 bg-[#f7f5f1] px-6 py-8 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.18)] sm:px-8 sm:py-10 lg:px-10";
  const entriesClassName = compact ? "space-y-5 sm:space-y-6" : "space-y-12 sm:space-y-14";
  const articleClassName = compact
    ? "grid gap-5 rounded-[1.6rem] border border-slate-200/70 bg-white/80 p-5 shadow-[0_18px_52px_-40px_rgba(15,23,42,0.22)] sm:p-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6 lg:p-6"
    : "grid gap-8 rounded-[1.8rem] border border-slate-200/70 bg-white/80 p-5 shadow-[0_18px_52px_-40px_rgba(15,23,42,0.22)] sm:p-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:p-8";
  const textWrapperClassName = compact ? "relative max-w-2xl space-y-4 pt-12 sm:space-y-5" : "max-w-2xl space-y-5";
  const headingClassName = compact
    ? "text-[1.8rem] font-semibold leading-[0.96] tracking-tight text-[#0f4d94] sm:text-[2.25rem] lg:text-[2.7rem]"
    : "text-4xl font-semibold leading-[1.1] tracking-tight text-[#0f4d94] sm:text-5xl lg:text-[3.35rem]";
  const quoteClassName = compact
    ? "inline bg-white px-2 py-1 text-[1.15rem] font-semibold italic leading-snug text-[#0f4d94] box-decoration-clone sm:text-[1.35rem] lg:text-[1.55rem]"
    : "inline bg-white px-2 py-1 text-2xl font-semibold italic leading-snug text-[#0f4d94] box-decoration-clone sm:text-3xl";
  const sectionInitial = compact ? false : "hidden";
  const sectionWhileInView = compact ? undefined : "visible";
  const articleInitial = compact ? false : "hidden";
  const articleWhileInView = compact ? undefined : "visible";

  return (
    <section id={sectionId} className={sectionClassName}>
      <motion.div
        initial={sectionInitial}
        whileInView={sectionWhileInView}
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={containerClassName}
      >
        <div className={entriesClassName}>
          {entries.slice(startIndex).map((entry, entryIndex) => {
            const textFirst = entry.align === "left";

            return (
              <motion.article
                key={entry.statement}
                initial={articleInitial}
                whileInView={articleWhileInView}
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeIn}
                transition={{ duration: 0.65, delay: entryIndex * 0.04 }}
                className={articleClassName}
              >
                <div className={`${textFirst ? "lg:order-1" : "lg:order-2"} relative flex min-h-[280px] items-center overflow-hidden rounded-[1.35rem] bg-white px-4 py-5 sm:px-5 lg:min-h-[300px]`}>
                  {compact ? (
                    <span className="pointer-events-none absolute left-2 top-0 text-[6rem] font-semibold leading-none tracking-tight text-slate-100 sm:text-[7.5rem]">
                      {String(startIndex + entryIndex + 1).padStart(2, "0")}
                    </span>
                  ) : null}
                  <div className={textWrapperClassName}>
                    <h3 className={headingClassName}>
                      {entry.statement}
                    </h3>
                    <div className="h-1.5 w-28 rounded-full bg-[#0f4d94]" />
                    <p className={quoteClassName}>
                      &ldquo;{entry.quote}&rdquo;
                    </p>
                    <p className="text-sm font-medium tracking-[0.14em] text-slate-500 sm:text-base">
                      -- {entry.byline}
                    </p>
                  </div>
                </div>

                <div className={`${textFirst ? "lg:order-2" : "lg:order-1"} grid gap-3 sm:grid-cols-2 sm:gap-3.5`}>
                  {entry.photos.map((photo, photoIndex) => (
                    <div key={photo.src} className={photoIndex === 0 ? "sm:col-span-2" : ""}>
                      <PhotoCard
                        photo={photo}
                        priority={entryIndex === 0 && photoIndex === 0}
                        featured={photoIndex === 0}
                      />
                    </div>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
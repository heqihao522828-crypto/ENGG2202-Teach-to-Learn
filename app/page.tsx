"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SiteShell from "./components/site-shell";
import { imagePath } from "./lib/image-path";

const courses = [
  {
    title: "Engineering Challenge 1",
    description:
      "A first-year course where students build their engineering toolkit and fundamentals through hands-on, team-based activities.",
    status: "ENGG1101",
    detailsHref: "/engg1101",
  },
  {
    title: "Engineering Challenge 2",
    description:
      "A second-year or above, project-based course in which teams prototype and solve a real, open-ended engineering challenge, applying their skills through design, iteration, and structured reflection.",
    status: "ENGG2202",
    detailsHref: "/engg2202",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.01, y: -2 },
};

const heroImages = [
  {
    src: imagePath("/images/Course/20250707014_Pilot_Workshop-scaled.jpg"),
    alt: "Pilot workshop in the engineering active learning studio",
  },
  {
    src: imagePath("/images/Course/edwin_workshop.jpg"),
    alt: "Students collaborating during a workshop session",
  },
  {
    src: imagePath("/images/Course/kyle_lecture.jpg"),
    alt: "Lecture-style teaching session for active learning",
  },
  {
    src: imagePath("/images/Course/kyle_workshop1.jpg"),
    alt: "Hands-on workshop activity with students and teaching staff",
  },
  {
    src: imagePath("/images/Course/kyle_workshop2.jpg"),
    alt: "Active learning workshop scene in the studio",
  },
  {
    src: imagePath("/images/Course/kyle_workshop3.jpg"),
    alt: "Collaborative project work during a studio workshop",
  },
  {
    src: imagePath("/images/Course/ryan_lecture.jpg"),
    alt: "Lecture session led by teaching staff",
  },
  {
    src: imagePath("/images/Course/timmy_lecture.jpg"),
    alt: "Teaching session in the active learning environment",
  },
  {
    src: imagePath("/images/Course/with_TO1.jpg"),
    alt: "Students and teaching team collaborating in a workshop session",
  },
  {
    src: imagePath("/images/Course/with_TO2.jpg"),
    alt: "Active learning team photo during course activities",
  },
  {
    src: imagePath("/images/Course/experimentinworkshop.jpg"),
    alt: "Workshop experimentation turning ideas into tangible hardware",
  },
  {
    src: imagePath("/images/Course/studentwithprototype1.jpg"),
    alt: "A student team presenting their prototype direction",
  },
  {
    src: imagePath("/images/Course/studentwithprototype2.jpg"),
    alt: "Another prototype concept developed through team collaboration",
  },
  {
    src: imagePath("/images/Course/student_presentation1.jpg"),
    alt: "Students pitching their project in a live presentation",
  },
];

const heroSlide = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
};

const consultationBookingUrl =
  "https://bookings.cloud.microsoft/book/ENGG1101@hkuhk.onmicrosoft.com/?ismsaljsauthenabled";

const heroTextContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.2,
    },
  },
};

const heroTextItem = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72 },
  },
};

const essentials = [
  {
    title: "Design & Innovation",
    description:
      "Create impactful systems with creativity, technology, and user needs in mind.",
    icon: "pencil",
    titleClass: "text-[#a16207]",
  },
  {
    title: "Problem Solving",
    description:
      "Analyze challenges critically and develop practical, effective engineering solutions.",
    icon: "briefcase",
    titleClass: "text-[#0284c7]",
  },
  {
    title: "Interdisciplinary Thinking",
    description:
      "Connect knowledge across fields to tackle complex, real-world problems.",
    icon: "brain",
    titleClass: "text-[#1e3a8a]",
  },
  {
    title: "Value & Attitude",
    description:
      "Build responsible engineering habits with empathy, ethics, and collaborative mindset.",
    icon: "globe",
    titleClass: "text-[#14532d]",
  },
  {
    title: "Communication",
    description:
      "Express technical ideas clearly through visuals, writing, and team dialogue.",
    icon: "network",
    titleClass: "text-[#581c87]",
  },
  {
    title: "Lifelong Learning",
    description:
      "Stay curious, adaptive, and ready to learn from evolving engineering practice.",
    icon: "book",
    titleClass: "text-[#134e4a]",
  },
];

const studentComments = [
  "Very skilled and provides detailed explanations and feedback.",
  "I liked that the tutor was very clear, supportive, and approachable throughout the course.",
  "They explained concepts in a simple way that made them easy to understand, gave helpful feedback on our work, and were always willing to answer questions patiently.",
  "The hands-on activities were broad and fun, and I really enjoyed all the workshops.",
  "The course introduced us to hands-on projects, 3D printing, software, and robotics concepts in a practical way.",
  "I liked that it was practical. I enjoyed working on different projects and receiving feedback from the teacher and tutor.",
  "Hands-on experience, from assembling robot arms to using CAD software and connecting wires, helped me gain practical knowledge instead of only learning theory.",
  "The workshop tasks made the class interactive and gave us the chance to create our ideas using modules provided by the Faculty.",
  "The course taught the most important aspect of engineering: learning by doing. We learned how to identify problems that matter and prototype solutions for real-world problems.",
  "The course was engaging during workshops, and the group project encouraged active learning and helped us turn our thoughts into reality.",
  "The teachers were nice, passionate, dedicated, and approachable. We could ask questions about our project, course content, or engineering beyond the syllabus.",
  "The project was fun. Even when it was challenging, we made it through and built a working prototype.",
  "The course teaches useful engineering skills and connects different fields, with well-organized workshop instructions suitable for beginners.",
];

function renderCourseTitle(title: string) {
  const match = /^Engineering Challenge\s+(\d+)$/i.exec(title);

  if (!match) {
    return title;
  }

  return (
    <>
      Engineering <span className="whitespace-nowrap">Challenge {match[1]}</span>
    </>
  );
}

function EssentialIcon({ type }: { type: string }) {
  const baseClass = "h-6 w-6 text-slate-700";

  if (type === "pencil") {
    return (
      <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    );
  }

  if (type === "briefcase") {
    return (
      <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    );
  }

  if (type === "brain") {
    return (
      <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 2.8A3 3 0 0 0 6 13v1a3 3 0 0 0 3 3" />
        <path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 2.8A3 3 0 0 1 18 13v1a3 3 0 0 1-3 3" />
        <path d="M9 6h6M9 10h6M9 14h6M12 3v14" />
      </svg>
    );
  }

  if (type === "globe") {
    return (
      <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 0 18" />
        <path d="M12 3a14 14 0 0 0 0 18" />
      </svg>
    );
  }

  if (type === "network") {
    return (
      <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="m7 15 3-5 4 2 3-4" />
        <circle cx="10" cy="10" r="1" />
        <circle cx="14" cy="12" r="1" />
        <circle cx="17" cy="8" r="1" />
      </svg>
    );
  }

  return (
    <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [studentCommentIndex, setStudentCommentIndex] = useState(0);
  const preloadedHeroImages = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined" || heroImages.length < 2) {
      return;
    }

    for (let offset = 1; offset <= 2; offset += 1) {
      const nextImage = heroImages[(heroIndex + offset) % heroImages.length];

      if (!nextImage || preloadedHeroImages.current.has(nextImage.src)) {
        continue;
      }

      const image = new window.Image();
      image.src = nextImage.src;
      preloadedHeroImages.current.add(nextImage.src);
    }
  }, [heroIndex]);

  useEffect(() => {
    if (heroImages.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setHeroIndex((currentIndex) => (currentIndex + 1) % heroImages.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (studentComments.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setStudentCommentIndex((currentIndex) => (
        currentIndex + 1
      ) % studentComments.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <SiteShell>
      <main id="top" className="mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-8">
        <motion.section
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, ease: "easeOut" }}
          variants={fadeIn}
          className="relative overflow-hidden rounded-[2rem] bg-slate-950/5"
        >
          <div className="absolute inset-0">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={heroImages[heroIndex].src}
                className="absolute inset-0 will-change-transform"
                variants={heroSlide}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={heroImages[heroIndex].src}
                  alt={heroImages[heroIndex].alt}
                  fill
                  priority={heroIndex === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:gap-16 lg:py-28">
            <motion.div
              className="max-w-3xl space-y-8 text-white"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.55 }}
              variants={heroTextContainer}
            >
              <motion.div variants={heroTextItem} className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-100/80">
                HKU Engineering active learning
              </motion.div>

              <motion.div variants={heroTextItem} className="space-y-6">
                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                  <span className="block bg-gradient-to-r from-cyan-300/80 via-sky-400/80 to-emerald-400/80 bg-clip-text text-transparent">
                    Tackle Challenges.
                  </span>
                  <span className="block bg-gradient-to-r from-amber-300/80 via-orange-400/80 to-rose-400/80 bg-clip-text text-transparent">
                    Innovate for the World.
                  </span>
                </h1>

                <p className="max-w-2xl text-base leading-8 text-slate-100/85 sm:text-lg">
                  Design-led learning for engineering practice, studio culture
                  and collaborative innovation.
                </p>
              </motion.div>

              <motion.div variants={heroTextItem} className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#courses"
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-950/95 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-24px_rgba(0,0,0,0.32)] transition hover:bg-slate-900 sm:w-auto"
                >
                  Explore Courses
                </a>

                <a
                  href="#schedule"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 sm:w-auto"
                >
                  View Schedule
                </a>
              </motion.div>
            </motion.div>

            {heroImages.length > 1 ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center px-6 sm:bottom-8">
                <div
                  className="pointer-events-auto flex items-center gap-1.5"
                  aria-label="Hero image position indicators"
                >
                  {heroImages.map((image, index) => {
                    const isActive = index === heroIndex;

                    return (
                      <button
                        key={image.src}
                        type="button"
                        onClick={() => setHeroIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={isActive ? "true" : undefined}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-4 bg-white"
                            : "w-2 bg-white/55 hover:bg-white/80"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </motion.section>

        <motion.section
          id="about"
          className="scroll-mt-28 mt-16 overflow-hidden rounded-[2.25rem] border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]"
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            variants={fadeIn}
            className="grid gap-8 p-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:p-10"
          >
            <div className="space-y-5 lg:pt-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700/80">
                About
              </p>

              <div className="space-y-4 sm:space-y-5">
                <h2 className="max-w-xl text-[1.95rem] font-semibold tracking-tight text-slate-950 leading-[1.08] sm:text-[2.35rem] lg:text-[2.55rem]">
                  <span className="block">Empowering Engineering Students through</span>
                  <span className="block text-[#1e3a8a]">Active Learning.</span>
                </h2>

                <p className="max-w-[62ch] text-base leading-8 text-slate-700">
                  We help students turn bold ideas into real-world impact through
                  hands-on, team-based projects. Every challenge is a chance to
                  create, test, and grow. By building together, students learn
                  to lead with curiosity, solve problems with purpose, and shape
                  a better future—one prototype at a time.
                </p>
              </div>
            </div>

            <motion.div
              whileInView="visible"
              initial="hidden"
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              variants={fadeIn}
              className="group overflow-hidden rounded-[2rem] bg-slate-100 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.22)]"
            >
              <div className="relative aspect-[4/3] min-h-[320px] lg:aspect-[16/10]">
                <Image
                  src={imagePath("/images/Course/studentgroup.jpg")}
                  alt="Student group working together in an engineering active learning session"
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/20 via-transparent to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        <section id="courses" className="mt-16 space-y-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            variants={fadeIn}
            className="space-y-4"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700/80">
              Courses
            </p>

            <div className="space-y-3 sm:flex sm:items-end sm:justify-between sm:gap-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Active learning through real{" "}
                  <span className="text-[#0f4d2e]">engineering challenges.</span>
                </h2>

                <p className="mt-3 max-w-4xl text-[0.98rem] leading-7 text-slate-700 lg:max-w-5xl">
                  Active learning through real engineering challenges. Across Engineering Challenges I (ENGG1101) and II (ENGG2202), students move from building core engineering fundamentals
                  to tackling open-ended, real-world problems, learning by doing as teams design, prototype, and reflect.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="w-full">
            <figure className="w-full overflow-hidden rounded-[1.6rem] border border-slate-200/90 bg-white shadow-[0_20px_56px_-34px_rgba(15,23,42,0.32)]">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={imagePath("/images/Course/engg1101poster.png")}
                  alt="ENGG1101 course poster"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 100vw"
                  className="object-contain object-center bg-slate-50"
                />
              </div>
            </figure>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course) => (
              <motion.article
                key={course.title}
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={cardHover}
                className={`group flex h-full flex-col overflow-hidden rounded-[2rem] border p-8 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.18)] transition ${
                  course.status === "ENGG2202"
                    ? "border-slate-800 bg-slate-950"
                    : "border-slate-200/80 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`text-sm font-semibold uppercase tracking-[0.22em] ${
                      course.status === "ENGG2202"
                        ? "text-slate-200"
                        : "text-slate-900"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>

                <h3
                  className={`mt-8 text-2xl font-semibold leading-tight ${
                    course.status === "ENGG2202"
                      ? "text-white"
                      : "text-slate-950"
                  }`}
                >
                  {renderCourseTitle(course.title)}
                </h3>

                <p
                  className={`mt-4 text-sm leading-7 ${
                    course.status === "ENGG2202"
                      ? "text-slate-300"
                      : "text-slate-700"
                  }`}
                >
                  {course.description}
                </p>

                <div
                  className={`mt-auto flex items-center gap-2 pt-8 text-sm font-semibold ${
                    course.status === "ENGG2202"
                      ? "text-white"
                      : "text-slate-950"
                  }`}
                >
                  {course.detailsHref?.startsWith("http") ? (
                    <a
                      href={course.detailsHref}
                      className={`rounded-full border px-3 py-2 transition ${
                        course.status === "ENGG2202"
                          ? "border-white bg-white text-slate-950 hover:bg-slate-100 hover:border-slate-100"
                          : "border-slate-950 bg-slate-950 text-white hover:bg-slate-800 hover:border-slate-800"
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View details
                    </a>
                  ) : course.detailsHref ? (
                    <Link
                      href={course.detailsHref}
                      className={`rounded-full border px-3 py-2 transition ${
                        course.status === "ENGG2202"
                          ? "border-white bg-white text-slate-950 hover:bg-slate-100 hover:border-slate-100"
                          : "border-slate-950 bg-slate-950 text-white hover:bg-slate-800 hover:border-slate-800"
                      }`}
                    >
                      View details
                    </Link>
                  ) : (
                    <span
                      className={`rounded-full border px-3 py-2 ${
                        course.status === "ENGG2202"
                          ? "border-white bg-white text-slate-950"
                          : "border-slate-950 bg-slate-950 text-white"
                      }`}
                    >
                      View details
                    </span>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

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
                  Check the story of ENGG1101
                </h2>
                <p className="text-sm leading-7 text-slate-700 sm:text-base">
                  The story of ENGG1101 students tackling real challenges through prototype building, live pitching, teamwork, iterative problem-solving, and senior-to-junior mentoring.
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

        <section
          id="schedule"
          className="mt-16 rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.18)]"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            variants={fadeIn}
            className="space-y-5"
          >
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700/80">
                Consultation
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                ENGG1101 Engineering Challenges Consultation
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Book a teacher consultation timeslot for ENGG1101 Engineering Challenges.
              </p>
            </div>

            <motion.section
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="rounded-[1.75rem] border border-emerald-200/90 bg-[#edf9f5] px-8 py-8 text-slate-900 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.2)] transition-transform duration-200 ease-out sm:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                <div className="space-y-4">
                  <h3 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Schedule a Consultation
                  </h3>
                  <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    Choose an available slot and confirm your booking online.
                  </p>
                  <a
                    href={consultationBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Open consultation booking
                  </a>
                </div>

                <div className="relative overflow-hidden rounded-[1.5rem] border border-emerald-200 bg-white p-3 shadow-[0_20px_50px_-36px_rgba(16,185,129,0.35)]">
                  <div className="absolute inset-x-8 top-0 h-16 rounded-full bg-emerald-200/70 blur-2xl" aria-hidden="true" />
                  <div className="relative overflow-hidden rounded-[1.2rem] border border-emerald-100">
                    <Image
                      src={imagePath("/images/Course/iep-meeting.jpg")}
                      alt="ENGG1101 consultation meeting"
                      width={900}
                      height={600}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200/80 bg-white/92 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] sm:p-10">
          <div className="space-y-10">
            <div className="space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700/80">
                Essentials
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                6 <span className="text-[#7f1d1d]">Essentials</span> for Every Engineer
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {essentials.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: 0.05 * index }}
                  variants={fadeIn}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="group rounded-[1.5rem] border border-slate-200/80 bg-[#f8fafc] p-6 text-left shadow-[0_20px_45px_-35px_rgba(15,23,42,0.22)] transition"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-[0_10px_25px_-20px_rgba(15,23,42,0.35)]">
                    <EssentialIcon type={item.icon} />
                  </div>
                  <h3 className={`text-xl font-semibold tracking-tight ${item.titleClass}`}>
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-[0.98rem] leading-7 text-slate-700">
                    {item.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200/80 bg-white/92 p-6 shadow-[0_20px_55px_-42px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700/80">
              Student Voices
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Student Feedback on Teaching and Learning
            </h2>

            <div className="mt-6 flex min-h-[14rem] items-center justify-center overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-[#f8fafc] px-5 py-7 text-center shadow-[0_18px_42px_-36px_rgba(15,23,42,0.24)] sm:min-h-[12rem] sm:px-8">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={studentCommentIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="mx-auto flex min-h-full max-w-3xl items-center justify-center text-center text-[0.98rem] leading-8 text-slate-700 sm:text-base"
                >
                  <span className="flex flex-col items-center gap-2">
                    <span>&ldquo;{studentComments[studentCommentIndex]}&rdquo;</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      (2025 Intake)
                    </span>
                  </span>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              {studentComments.map((comment, index) => {
                const isActive = index === studentCommentIndex;

                return (
                  <button
                    key={comment}
                    type="button"
                    onClick={() => setStudentCommentIndex(index)}
                    aria-label={`Show student comment ${index + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-6 bg-slate-900"
                        : "w-2.5 bg-slate-300 hover:bg-slate-500"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <div className="mt-6 text-center text-xs text-slate-500">
          © 2026 Active Learning Teaching Team, Faculty of Engineering, The
          University of Hong Kong
        </div>
      </main>
    </SiteShell>
  );
}

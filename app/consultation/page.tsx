"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SiteShell from "../components/site-shell";
import { imagePath } from "../lib/image-path";

const consultationBookingUrl =
  "https://bookings.cloud.microsoft/book/ENGG1101@hkuhk.onmicrosoft.com/?ismsaljsauthenabled";

export default function ConsultationPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-8">
        <motion.section whileHover={{ scale: 1.01, y: -2 }} transition={{ duration: 0.22, ease: "easeOut" }} className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.18)] transition-transform duration-200 ease-out">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700/80">
              Consultation
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              ENGG1101 Engineering Challenges Consultation
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Book a teacher consultation timeslot for ENGG1101 Engineering Challenges.
            </p>
          </div>

          <motion.section
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mt-8 rounded-[1.75rem] border border-emerald-200/90 bg-[#edf9f5] px-8 py-8 text-slate-900 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.2)] transition-transform duration-200 ease-out sm:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Schedule a Consultation
                </h2>
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
        </motion.section>
      </main>
    </SiteShell>
  );
}

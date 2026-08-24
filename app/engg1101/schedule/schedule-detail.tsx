"use client";

import Link from "next/link";
import SiteShell from "../../components/site-shell";
import { LECTURE_SLOT, SUBCLASSES } from "../../../src/data/engg1101Schedule";
import { formatDate, formatWorkshopSlot, getSubclassSessions, isTodayOrLater, type Subclass } from "./schedule-data";

type ScheduleDetailProps = {
  subclass: Subclass;
};

export default function ScheduleDetail({ subclass }: ScheduleDetailProps) {
  const sessions = getSubclassSessions(subclass);
  const nextSession = sessions.find((session) => isTodayOrLater(session.date));

  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-8">
        <div className="print-hidden">
          <Link href="/engg1101/schedule" className="inline-flex text-sm font-semibold text-cyan-800 underline decoration-cyan-400 underline-offset-4 hover:text-cyan-950">‹ All subclasses</Link>
        </div>

        <section className="mt-5 rounded-[2rem] border border-cyan-200 bg-cyan-50/70 p-7 shadow-[0_20px_60px_-42px_rgba(8,145,178,0.22)] sm:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">ENGG1101 · Semester 1</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Subclass {subclass.id}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">Semester 1, 2026/27 · Lecture Group {subclass.lectureGroup} ({subclass.lectureTeacher})</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <p className="rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800">Lecture: Wed {LECTURE_SLOT.start} - {LECTURE_SLOT.end}</p>
            <p className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800">Workshop: {formatWorkshopSlot(subclass)}</p>
          </div>
        </section>

        <nav className="print-hidden mt-6 flex flex-wrap gap-2" aria-label="Choose another subclass">
          {SUBCLASSES.map((option) => (
            <Link
              key={option.id}
              href={`/engg1101/schedule/${option.id}`}
              aria-current={option.id === subclass.id ? "page" : undefined}
              className={option.id === subclass.id ? "flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white" : "flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 transition hover:border-cyan-500 hover:bg-cyan-50"}
            >
              {option.id}
            </Link>
          ))}
        </nav>

        <section className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_-42px_rgba(15,23,42,0.14)]">
          <div className="border-b border-slate-200 px-7 py-6 sm:px-8"><h2 className="text-2xl font-semibold tracking-tight text-slate-950">Session schedule</h2></div>
          <table className="schedule-table w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-600">
              <tr>{["#", "Date", "Type", "Session", "Time", "Venue"].map((heading) => <th key={heading} scope="col" className="px-5 py-4 font-semibold">{heading}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {sessions.map((session, index) => (
                <tr key={`${session.session}-${session.date}`}>
                  <td data-label="#" className="px-5 py-4 font-semibold text-slate-950">{index + 1}</td>
                  <td data-label="Date" className="px-5 py-4 whitespace-nowrap">{formatDate(session.date)}{nextSession?.session === session.session && nextSession.date === session.date ? <span className="ml-2 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">Next</span> : null}</td>
                  <td data-label="Type" className="px-5 py-4"><span className={session.type === "Lecture" ? "rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-800" : "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"}>{session.type}</span></td>
                  <td data-label="Session" className="px-5 py-4 font-semibold text-slate-900">{session.session}</td>
                  <td data-label="Time" className="px-5 py-4 whitespace-nowrap">{session.start} - {session.end}</td>
                  <td data-label="Venue" className="px-5 py-4">{session.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </SiteShell>
  );
}

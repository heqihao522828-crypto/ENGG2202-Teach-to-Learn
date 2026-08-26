"use client";

import Link from "next/link";
import SiteShell from "../../components/site-shell";
import { LECTURE_SLOT, SUBCLASSES } from "../../../src/data/engg1101Schedule";
import { formatDate, formatWorkshopSlot, getSubclassSessions, isTodayOrLater, type Subclass } from "./schedule-data";

type ScheduleDetailProps = {
  subclass: Subclass;
};

function calendarDateTime(date: string, time: string) {
  return `${date.replaceAll("-", "")}T${time.replace(":", "")}00`;
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export default function ScheduleDetail({ subclass }: ScheduleDetailProps) {
  const sessions = getSubclassSessions(subclass);
  const nextSession = sessions.find((session) => isTodayOrLater(session.date));

  function downloadCalendar() {
    const calendar = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//HKU Engineering//ENGG1101 Schedule//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      ...sessions.flatMap((session) => [
        "BEGIN:VEVENT",
        `UID:engg1101-${subclass.id}-${session.session.replace(" ", "-").toLowerCase()}-${session.date}@activelearning.engg.hku.hk`,
        `DTSTART;TZID=Asia/Hong_Kong:${calendarDateTime(session.date, session.start)}`,
        `DTEND;TZID=Asia/Hong_Kong:${calendarDateTime(session.date, session.end)}`,
        `SUMMARY:${escapeIcs(`ENGG1101 ${session.session}`)}`,
        `LOCATION:${escapeIcs(session.venue)}`,
        "END:VEVENT",
      ]),
      "END:VCALENDAR",
      "",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `engg1101-semester-1-subclass-${subclass.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-8">
        <div className="print-hidden">
          <Link href="/engg1101/schedule" className="inline-flex text-sm font-semibold text-cyan-800 underline decoration-cyan-400 underline-offset-4 hover:text-cyan-950">‹ All subclasses</Link>
        </div>

        <section className="mt-5 rounded-[2rem] border border-cyan-200 bg-cyan-50/70 p-7 shadow-[0_20px_60px_-42px_rgba(8,145,178,0.22)] sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">ENGG1101 · Semester 1</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Subclass {subclass.id}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">Semester 1, 2026/27 · Lecture Group {subclass.lectureGroup} ({subclass.lectureTeacher})</p>
            </div>
            <button type="button" onClick={downloadCalendar} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-cyan-300 bg-white px-4 py-2.5 text-sm font-semibold text-cyan-950 shadow-[0_12px_24px_-20px_rgba(8,145,178,0.55)] transition hover:-translate-y-0.5 hover:border-cyan-500 hover:bg-cyan-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18M12 14v4m-2-2h4" />
              </svg>
              Add to calendar
            </button>
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

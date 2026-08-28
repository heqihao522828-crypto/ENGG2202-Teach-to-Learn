import Link from "next/link";
import SiteShell from "../../components/site-shell";
import { SUBCLASSES } from "../../../src/data/engg1101Schedule";

const orderedSubclasses = [...SUBCLASSES].sort((a, b) => a.id.localeCompare(b.id));

export default function Engg1101SchedulePage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-8">
        <Link href="/engg1101" className="mb-5 inline-flex text-sm font-semibold text-cyan-800 underline decoration-cyan-400 underline-offset-4 hover:text-cyan-950">‹ ENGG1101</Link>
        <section className="rounded-[2rem] border border-cyan-200 bg-cyan-50/70 p-7 shadow-[0_20px_60px_-42px_rgba(8,145,178,0.22)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">ENGG1101</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Schedule for Semester 1</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">Choose your subclass letter to see every scheduled lecture and workshop for Semester 1, AY2026-27.</p>

          <div className="mt-7 grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-16" aria-label="Choose your subclass">
            {orderedSubclasses.map((subclass) => (
              <Link key={subclass.id} href={`/engg1101/schedule/${subclass.id}`} className="flex min-h-12 items-center justify-center rounded-xl border border-cyan-200 bg-white text-lg font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-500 hover:bg-cyan-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700">
                {subclass.id}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_-42px_rgba(15,23,42,0.14)]">
          <div className="border-b border-slate-200 px-7 py-6 sm:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">All subclasses</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full table-fixed text-left text-sm">
              <colgroup>
                <col className="w-1/3" />
                <col className="w-1/3" />
                <col className="w-1/3" />
              </colgroup>
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  {["Subclass", "Teacher", "Lecture & workshop details"].map((heading) => <th key={heading} scope="col" className="px-5 py-4 text-center font-semibold">{heading}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {orderedSubclasses.map((subclass) => (
                  <tr key={subclass.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4 text-center font-semibold text-slate-950">{subclass.id}</td>
                    <td className="px-5 py-4 text-center">{subclass.lectureTeacher}</td>
                    <td className="px-5 py-4 text-center"><Link href={`/engg1101/schedule/${subclass.id}`} className="inline-block font-semibold text-cyan-800 underline decoration-cyan-400 underline-offset-4 hover:text-cyan-950">View details</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

import Link from "next/link";
import SiteShell from "../../../components/site-shell";

export default function SubclassNotFound() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.14)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">ENGG1101 · Semester 1</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Subclass not found</h1>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">Choose a subclass letter from A to P to view its schedule.</p>
          <Link href="/engg1101/schedule" className="mt-7 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">View all subclasses</Link>
        </section>
      </main>
    </SiteShell>
  );
}

import Link from "next/link";
import SiteShell from "../../components/site-shell";

export default function Engg2202SchedulePage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-8">
        <Link href="/engg2202" className="mb-5 inline-flex text-sm font-semibold text-cyan-800 underline decoration-cyan-400 underline-offset-4 hover:text-cyan-950">‹ ENGG2202</Link>
        <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700/80">ENGG2202</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Schedule for Semester 1 </h1>
          <p className="mt-4 text-base leading-8 text-slate-700">The Semester 1 schedule for Academic Year 2026/27 is to be confirmed.</p>
        </section>
      </main>
    </SiteShell>
  );
}

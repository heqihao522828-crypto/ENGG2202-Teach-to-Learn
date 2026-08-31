"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteShell from "../components/site-shell";

export default function AssessmentPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/about#assessment");
  }, [router]);

  return (
    <SiteShell>
      <main className="flex min-h-[70vh] items-center justify-center bg-[#eef6ec] px-5 py-16 text-center">
        <div className="max-w-lg rounded-[2rem] border border-[#d4e1d6] bg-white p-8 shadow-[0_30px_80px_-58px_rgba(15,60,32,0.55)] sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57745e]">Assessment has moved</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#143421]">Opening the course information on the About page.</h1>
          <Link href="/about#assessment" className="mt-7 inline-flex rounded-full bg-[#173f28] px-5 py-3 text-sm font-bold text-white">
            Continue to assessment
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}

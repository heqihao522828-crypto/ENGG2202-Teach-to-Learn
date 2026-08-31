"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { imagePath } from "../lib/image-path";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Project Journey", href: "/engg2202" },
  { label: "Green Technology", href: "/sdgs" },
  { label: "Student Projects", href: "/gallery" },
  { label: "Student Guide", href: "/guide" },
  { label: "About", href: "/about" },
];

function ExternalArrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M6 3h7v7" />
      <path d="m13 3-8 8" />
      <path d="M11 9v4H3V5h4" />
    </svg>
  );
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#102319]">
      <header className="sticky top-0 z-50 border-b border-[#dce8df] bg-[#fbfdfb]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[90rem] items-center gap-5 px-5 py-3 sm:px-8 lg:px-10">
          <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="ENGG2202 Engineering Challenges II home">
            <span className="flex shrink-0 items-center gap-1 sm:gap-1.5">
              <Image
                src={imagePath("/images/Logo/hkuengglogo.png")}
                alt="HKU Engineering"
                width={160}
                height={36}
                className="h-7 w-[124px] shrink-0 object-contain sm:h-9 sm:w-[160px]"
                preload
              />
              <Image
                src={imagePath("/images/Logo/active-learning-ug-team.png")}
                alt="Active Learning UG Teaching Team"
                width={58}
                height={36}
                className="hidden h-9 w-[58px] shrink-0 object-contain sm:block"
              />
            </span>
            <span className="min-w-0 sm:hidden">
              <span className="block truncate text-[0.55rem] font-bold uppercase tracking-[0.13em] text-[#607667]">
                ENGG2202
              </span>
              <span className="block truncate text-xs font-semibold tracking-tight text-[#153c25]">
                Engineering Challenges II
              </span>
            </span>
            <span className="hidden h-7 w-px bg-[#ccd9cf] sm:block" aria-hidden="true" />
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#52705d]">
                ENGG2202
              </span>
              <span className="block truncate text-sm font-semibold tracking-tight text-[#153c25]">
                Engineering Challenges II
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center xl:flex" aria-label="Primary navigation">
            <ul className="flex items-center gap-1 text-sm font-semibold">
              {navigation.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`rounded-full px-3.5 py-2.5 transition ${
                        isActive
                          ? "bg-[#163f27] text-white"
                          : "text-[#355842] hover:bg-[#e9f3ea] hover:text-[#123d24]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href="https://activelearning.engg.hku.hk/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto hidden items-center gap-1.5 rounded-full border border-[#b9cfbf] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#214b31] transition hover:border-[#1f6d3b] hover:bg-white xl:ml-3 xl:inline-flex"
          >
            Active Learning Hub
            <ExternalArrow />
          </a>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#b9cfbf] text-[#214b31] transition hover:bg-white xl:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div id="mobile-nav-menu" className="border-t border-[#dce8df] bg-[#fbfdfb] px-5 py-4 sm:px-8 xl:hidden">
            <nav aria-label="Mobile navigation">
              <ul className="grid gap-1">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-[#2d563a] hover:bg-[#e9f3ea]">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-2 border-t border-[#dce8df] pt-3">
                  <a href="https://activelearning.engg.hku.hk/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl px-3 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#526c5a] hover:bg-[#e9f3ea]">
                    Active Learning Hub
                    <ExternalArrow />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        ) : null}
      </header>

      {children}
    </div>
  );
}

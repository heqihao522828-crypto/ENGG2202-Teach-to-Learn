"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { imagePath } from "../lib/image-path";

const navigation = [
  { label: "Home", href: "/#about" },
  { label: "ENGG1101", href: "/engg1101" },
  { label: "ENGG2202", href: "/engg2202" },
  { label: "Gallery", href: "/gallery" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

const scheduleLinks = [
  { label: "ENGG1101", href: "/engg1101/schedule" },
  { label: "ENGG2202", href: "/engg2202/schedule" },
];

export default function SiteShell({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/" || typeof window === "undefined" || !window.location.hash) {
      return;
    }

    const hash = window.location.hash;
    window.requestAnimationFrame(() => {
      scrollToHash(hash);
    });
  }, [pathname]);

  function scrollToHash(hash: string) {
    const targetId = hash.replace(/^#/, "");
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
      return false;
    }

    const headerElement = document.querySelector("header");
    const headerOffset = headerElement instanceof HTMLElement ? headerElement.offsetHeight : 0;
    const top = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset - 16;

    window.scrollTo({ top, behavior: "smooth" });
    return true;
  }

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setIsMobileMenuOpen(false);

    if (!href.startsWith("/#")) {
      return;
    }

    const hash = href.slice(1);

    if (pathname !== "/") {
      event.preventDefault();
      router.push(href);
      return;
    }

    event.preventDefault();
    window.history.pushState(null, "", href);
    scrollToHash(hash);
  }

  return (
    <div className="relative min-h-screen bg-[#fbfbfb] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-8">
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center">
              <Image
                src={imagePath("/images/Logo/hkuengglogo.png")}
                alt="HKU ENGG"
                width={160}
                height={36}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          <div className="hidden h-6 w-px bg-slate-200 lg:block" aria-hidden="true" />

          <nav className="hidden min-w-0 flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-6 text-sm font-semibold text-slate-800 xl:gap-8">
              {navigation.slice(0, 3).map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("http") ? (
                    <a
                      href={item.href}
                      className="transition-colors hover:text-slate-950"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="transition-colors hover:text-slate-950" onClick={(event) => handleNavClick(event, item.href)}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="group relative" onMouseEnter={() => setIsScheduleOpen(true)} onMouseLeave={() => setIsScheduleOpen(false)}>
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen((open) => !open)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setIsScheduleOpen(false);
                    }
                  }}
                  className="inline-flex items-center gap-1 transition-colors hover:text-slate-950"
                  aria-expanded={isScheduleOpen}
                  aria-controls="schedule-menu"
                >
                  Schedule
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className={`h-3.5 w-3.5 transition-transform ${isScheduleOpen ? "rotate-180" : ""}`} aria-hidden="true">
                    <path d="m4 6 4 4 4-4" />
                  </svg>
                </button>
                {isScheduleOpen ? (
                  <div id="schedule-menu" className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.28)]">
                    {scheduleLinks.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setIsScheduleOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-cyan-50 hover:text-cyan-950">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </li>
              {navigation.slice(3).map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("http") ? (
                    <a
                      href={item.href}
                      className="transition-colors hover:text-slate-950"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="transition-colors hover:text-slate-950" onClick={(event) => handleNavClick(event, item.href)}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:border-slate-400 hover:text-slate-900 lg:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </svg>
              )}
            </button>

            <div className="hidden items-center gap-4 sm:flex">
              <a href="https://www.instagram.com/hkuenggal/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-800 hover:text-slate-950">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="mailto:enggal@hku.hk" aria-label="Email" className="text-slate-800 hover:text-slate-950">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <polyline points="3 7 12 13 21 7"></polyline>
                </svg>
              </a>
              <a href="https://github.com/hkuenggal" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-slate-800 hover:text-slate-950">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.252-4.555-1.11-4.555-4.944 0-1.091.39-1.983 1.03-2.681-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.642.698 1.029 1.59 1.029 2.681 0 3.842-2.338 4.688-4.566 4.935.359.309.679.92.679 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481C19.138 20.165 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div id="mobile-nav-menu" className="border-t border-slate-200/80 bg-white px-4 py-3 sm:px-8 lg:hidden">
            <nav aria-label="Mobile navigation">
              <ul className="grid gap-2">
                {navigation.slice(0, 3).map((item) => (
                  <li key={`mobile-${item.href}`}>
                    {item.href.startsWith("http") ? (
                      <a
                        href={item.href}
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                        onClick={(event) => handleNavClick(event, item.href)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
                <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">Schedule</p>
                  <ul className="mt-2 grid gap-1 border-l border-slate-200 pl-3">
                    {scheduleLinks.map((item) => (
                      <li key={`mobile-${item.href}`}>
                        <Link href={item.href} className="block py-1.5 text-sm font-semibold text-cyan-800 transition hover:text-cyan-950" onClick={() => setIsMobileMenuOpen(false)}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                {navigation.slice(3).map((item) => (
                  <li key={`mobile-${item.href}`}>
                    {item.href.startsWith("http") ? (
                      <a
                        href={item.href}
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                        onClick={(event) => handleNavClick(event, item.href)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        ) : null}
      </header>

      {children}
    </div>
  );
}

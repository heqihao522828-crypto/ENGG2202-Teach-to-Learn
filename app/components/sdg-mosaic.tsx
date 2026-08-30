"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { imagePath } from "../lib/image-path";

const sets = [
  ["06", "07", "09", "13"],
  ["07", "11", "12", "13"],
  ["06", "09", "11", "12"],
];

const positions = [
  "left-[10%] top-[18%] h-24 w-24 rotate-[-8deg] sm:h-28 sm:w-28",
  "right-[13%] top-[8%] h-32 w-32 rotate-[7deg] sm:h-36 sm:w-36",
  "left-[25%] bottom-[9%] h-28 w-28 rotate-[5deg] sm:h-36 sm:w-36",
  "right-[26%] bottom-[15%] h-20 w-20 rotate-[-7deg] sm:h-24 sm:w-24",
];

export default function SdgMosaic() {
  const [setIndex, setSetIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIsVisible(false);
      window.setTimeout(() => {
        setSetIndex((current) => (current + 1) % sets.length);
        setIsVisible(true);
      }, 650);
    }, 4800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative hidden min-h-[300px] overflow-hidden rounded-[2rem] border border-[#e0e8df] bg-[#fbfdfb] lg:block" aria-label="Selected Sustainable Development Goal icons connected to green technology">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#f0f7ef_0%,#fbfdfb_68%)]" />
      <p className="absolute left-7 top-7 z-10 text-xs font-bold uppercase tracking-[0.18em] text-[#67816c]">Green technology focus</p>
      <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
      {sets[setIndex].map((goal, index) => (
        <div key={`${setIndex}-${goal}`} className={`absolute ${positions[index]} z-20 transition-all duration-[1400ms] ease-in-out`}>
          <Image src={imagePath(`/images/teach-to-learn/sdg/goal-${goal}.png`)} alt={`SDG ${goal}`} fill sizes="144px" className="rounded-2xl object-cover shadow-[0_18px_35px_-16px_rgba(18,61,36,0.58)]" />
        </div>
      ))}
      </div>
      <div className="absolute bottom-7 left-7 right-7 z-10 flex items-center justify-between text-xs font-semibold text-[#6c806f]">
        <span>06 · 07 · 09 · 11 · 12 · 13</span>
        <span className="rounded-full bg-[#eaf3e8] px-3 py-1.5 text-[#376044]">Relevant goals</span>
      </div>
    </div>
  );
}

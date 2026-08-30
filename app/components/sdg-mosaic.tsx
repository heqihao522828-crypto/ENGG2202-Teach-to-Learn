import Image from "next/image";
import { imagePath } from "../lib/image-path";

const goals = ["06", "07", "09", "11", "12", "13"];

export default function SdgMosaic() {
  return (
    <div className="relative hidden min-h-[300px] overflow-hidden rounded-[2rem] border border-[#e0e8df] bg-white lg:block" aria-label="Six Sustainable Development Goal icons connected to green technology">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#f0f7ef_0%,#ffffff_68%)]" />
      <p className="absolute left-7 top-7 z-10 text-xs font-bold uppercase tracking-[0.18em] text-[#67816c]">Green technology focus</p>
      <div className="absolute inset-x-8 bottom-8 top-20 grid grid-cols-3 grid-rows-2 items-center justify-items-center gap-4">
        {goals.map((goal, index) => (
          <div key={goal} className={`sdg-float relative aspect-square w-[72px] sm:w-[86px] ${index % 3 === 1 ? "-translate-y-3" : index % 3 === 2 ? "translate-y-2" : ""}`} style={{ animationDelay: `${index * 180}ms` }}>
            <Image src={imagePath(`/images/teach-to-learn/sdg/goal-${goal}.png`)} alt={`SDG ${goal}`} fill sizes="96px" className="rounded-xl object-cover shadow-[0_18px_35px_-16px_rgba(18,61,36,0.58)]" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-5 left-7 right-7 z-10 flex items-center justify-between text-xs font-semibold text-[#6c806f]"><span>06 · 07 · 09 · 11 · 12 · 13</span><span className="rounded-full bg-[#eaf3e8] px-3 py-1.5 text-[#376044]">Relevant goals</span></div>
    </div>
  );
}

import Image from "next/image";
import { imagePath } from "../lib/image-path";

const goals = Array.from({ length: 17 }, (_, index) => String(index + 1).padStart(2, "0"));

export default function SdgMosaic() {
  return (
    <div className="relative hidden min-h-[300px] overflow-hidden rounded-[2rem] border border-[#e0e8df] bg-white lg:block" aria-label="The 17 Sustainable Development Goal icons">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#f0f7ef_0%,#ffffff_68%)]" />
      <p className="absolute left-7 top-7 z-10 text-xs font-bold uppercase tracking-[0.18em] text-[#67816c]">Green technology focus</p>
      <div className="absolute inset-x-7 bottom-8 top-20 grid grid-cols-6 grid-rows-3 items-center justify-items-center gap-2 sm:gap-3">
        {goals.map((goal, index) => (
          <div key={goal} className="sdg-flip-card relative aspect-square w-[54px] sm:w-[66px]" style={{ animationDelay: `${index * 420 + (index % 2 ? 210 : 0)}ms` }}>
            <Image src={imagePath(`/images/teach-to-learn/sdg/goal-${goal}.png`)} alt={`SDG ${goal}`} fill sizes="72px" className="rounded-lg object-cover shadow-[0_12px_24px_-14px_rgba(18,61,36,0.58)]" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-5 left-7 right-7 z-10 flex items-center justify-between text-xs font-semibold text-[#6c806f]"><span>All 17 goals</span><span className="rounded-full bg-[#eaf3e8] px-3 py-1.5 text-[#376044]">Sustainable development</span></div>
    </div>
  );
}

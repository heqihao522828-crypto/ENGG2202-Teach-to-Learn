import Image from "next/image";
import { imagePath } from "../lib/image-path";

const goals = Array.from({ length: 17 }, (_, index) => String(index + 1).padStart(2, "0"));

export default function SdgMosaic() {
  return (
    <div className="relative hidden min-h-[300px] lg:block" aria-label="The 17 Sustainable Development Goal icons">
      <div className="absolute inset-x-4 inset-y-3 grid grid-cols-6 grid-rows-3 items-center justify-items-center gap-x-5 gap-y-3 sm:inset-x-2 sm:gap-x-6 sm:gap-y-4">
        {goals.map((goal, index) => (
          <div key={goal} className="sdg-pulse relative aspect-square w-[58px] sm:w-[68px]" style={{ animationDelay: `${index * 180}ms` }}>
            <Image src={imagePath(`/images/teach-to-learn/sdg/goal-${goal}.png`)} alt={`SDG ${goal}`} fill sizes="76px" className="rounded-lg object-cover shadow-[0_12px_24px_-14px_rgba(18,61,36,0.5)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

import Image from "next/image";
import { imagePath } from "../lib/image-path";

const goals = [
  ...Array.from({ length: 17 }, (_, index) => ({
    id: String(index + 1).padStart(2, "0"),
    src: `/images/teach-to-learn/sdg/goal-${String(index + 1).padStart(2, "0")}.png`,
    alt: `Sustainable Development Goal ${index + 1}`,
  })),
  {
    id: "wheel",
    src: "/images/teach-to-learn/sdg/sdg-wheel.png",
    alt: "United Nations Sustainable Development Goals colour wheel",
  },
];

export default function SdgMosaic() {
  return (
    <div className="relative hidden min-h-[330px] lg:block" aria-label="The 17 Sustainable Development Goal icons and the SDG colour wheel">
      <div className="absolute inset-x-0 inset-y-2 grid grid-cols-6 grid-rows-3 items-center justify-items-center gap-x-4 gap-y-5 xl:gap-x-6">
        {goals.map((goal, index) => (
          <div
            key={goal.id}
            className={`${goal.id === "wheel" ? "sdg-wheel-spin" : "sdg-pulse"} relative aspect-square w-[72px] xl:w-[82px]`}
            style={goal.id === "wheel" ? undefined : { animationDelay: `${index * 180}ms` }}
          >
            <Image
              src={imagePath(goal.src)}
              alt={goal.alt}
              fill
              sizes="82px"
              className={goal.id === "wheel" ? "object-contain mix-blend-multiply" : "rounded-xl object-cover shadow-[0_14px_28px_-16px_rgba(18,61,36,0.5)]"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

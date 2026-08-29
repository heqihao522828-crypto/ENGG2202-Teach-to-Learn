import Image from "next/image";
import { imagePath } from "../lib/image-path";

const stageVisuals: Record<
  string,
  { image: string; alt: string; objectPosition?: string }
> = {
  "02": {
    image: "/images/teach-to-learn/mastery-learn.png",
    alt: "Line illustration of research, investigation and a developing idea",
  },
  "03": {
    image: "/images/teach-to-learn/mastery-explain.png",
    alt: "Line illustration translating complex engineering reasoning into a clear plan",
  },
  "04": {
    image: "/images/teach-to-learn/mastery-apply.png",
    alt: "Line illustration of hands integrating a component into a green technology prototype",
  },
  "05": {
    image: "/images/teach-to-learn/stage-improve-iteration.png",
    alt: "Line illustration of an environmental sensing prototype being tested, adjusted and retested",
  },
  "06": {
    image: "/images/teach-to-learn/mastery-teach.png",
    alt: "Line illustration of one learner helping another use an engineering prototype",
  },
};

const focusSdgs = ["06", "07", "11", "13"];

type StageArtworkProps = {
  stage: string;
  className?: string;
  sizes?: string;
  compact?: boolean;
};

export default function StageArtwork({
  stage,
  className = "",
  sizes = "(min-width: 1024px) 30vw, 100vw",
  compact = false,
}: StageArtworkProps) {
  if (stage === "01") {
    if (compact) {
      return (
        <div className={`relative overflow-hidden bg-white ${className}`}>
          <Image
            src={imagePath("/images/teach-to-learn/sdg/goal-13.png")}
            alt="SDG 13: Climate Action"
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      );
    }

    return (
      <div
        className={`relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#ffffff_0%,#e7f3e7_45%,#cfdfd1_100%)] ${className}`}
        role="img"
        aria-label="Official Sustainable Development Goal icons representing possible Green Technology challenge directions"
      >
        <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full border-[24px] border-[#d7f43c]/38" />
        <div className="absolute inset-0 grid grid-cols-4 items-center gap-2 p-4 sm:gap-3 sm:p-5">
          {focusSdgs.map((goal, index) => (
            <div
              key={goal}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 border-white bg-white shadow-[0_12px_30px_-18px_rgba(14,53,29,0.7)] ${
                index % 2 === 0 ? "-translate-y-2" : "translate-y-2"
              }`}
            >
              <Image
                src={imagePath(`/images/teach-to-learn/sdg/goal-${goal}.png`)}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const visual = stageVisuals[stage] ?? stageVisuals["02"];

  return (
    <div className={`relative overflow-hidden bg-[#eef5ed] ${className}`}>
      <Image
        src={imagePath(visual.image)}
        alt={visual.alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: visual.objectPosition ?? "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#123d24]/8 via-transparent to-white/12" />
    </div>
  );
}

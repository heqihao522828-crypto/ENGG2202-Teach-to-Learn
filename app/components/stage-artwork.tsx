import Image from "next/image";
import { imagePath } from "../lib/image-path";

const stageVisuals: Record<
  string,
  { image: string; alt: string }
> = {
  "01": {
    image: "/images/teach-to-learn/stage-focus-site-v2.png",
    alt: "A dry campus planter, rainwater downpipe and sunlight showing a Green Technology challenge",
  },
  "02": {
    image: "/images/teach-to-learn/stage-define-evidence-v2.png",
    alt: "A soil-moisture probe, rainwater supply and field notes for problem validation",
  },
  "03": {
    image: "/images/teach-to-learn/stage-plan-options-v2.png",
    alt: "Rainwater harvesting, storage and solar pump options converging on a project plan",
  },
  "04": {
    image: "/images/teach-to-learn/stage-learn-prototype-v2.png",
    alt: "A first working solar-powered rainwater irrigation prototype for a campus planter",
  },
  "05": {
    image: "/images/teach-to-learn/stage-improve-iteration-v2.png",
    alt: "Evidence comparing soil moisture and irrigation system revisions",
  },
  "06": {
    image: "/images/teach-to-learn/stage-contribute-release-v2.png",
    alt: "A documented solar-powered rainwater system, handover guide and reusable parts kit",
  },
};

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
}: StageArtworkProps) {
  const visual = stageVisuals[stage] ?? stageVisuals["01"];

  return (
    <div className={`relative overflow-hidden bg-[#f7f3e8] ${className}`}>
      <Image
        src={imagePath(visual.image)}
        alt={visual.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

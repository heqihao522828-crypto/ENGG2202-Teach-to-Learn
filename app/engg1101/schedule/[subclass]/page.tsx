import { notFound } from "next/navigation";
import ScheduleDetail from "../schedule-detail";
import { findSubclass } from "../schedule-data";
import { SUBCLASSES } from "../../../../src/data/engg1101Schedule";

type ScheduleDetailPageProps = {
  params: Promise<{ subclass: string }>;
};

export function generateStaticParams() {
  return SUBCLASSES.flatMap(({ id }) => [
    { subclass: id },
    { subclass: id.toLowerCase() },
  ]);
}

export default async function ScheduleDetailPage({ params }: ScheduleDetailPageProps) {
  const { subclass: subclassId } = await params;
  const subclass = findSubclass(subclassId);

  if (!subclass) {
    notFound();
  }

  return <ScheduleDetail subclass={subclass} />;
}

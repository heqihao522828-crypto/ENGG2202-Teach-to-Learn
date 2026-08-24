import {
  LECTURE_DATES,
  LECTURE_SLOT,
  LECTURE_VENUE_FIRST,
  LECTURE_VENUE_MAIN,
  SUBCLASSES,
  TOPICS,
  WORKSHOP_DATES,
} from "../../../src/data/engg1101Schedule";

export type Subclass = (typeof SUBCLASSES)[number];
export type SessionType = "Lecture" | "Workshop";

export type ScheduleSession = {
  date: string;
  type: SessionType;
  session: string;
  topic: string;
  start: string;
  end: string;
  venue: string;
};

const workshopDates = WORKSHOP_DATES as Record<string, readonly string[]>;
const lectureDates = LECTURE_DATES as Record<string, readonly string[]>;
const lectureVenueFirst = LECTURE_VENUE_FIRST as Record<number, string>;
const lectureVenueMain = LECTURE_VENUE_MAIN as Record<number, string>;
const topics = TOPICS as Record<string, string>;

export function findSubclass(id: string) {
  return SUBCLASSES.find((subclass) => subclass.id === id.toUpperCase());
}

export function getSubclassSessions(subclass: Subclass): ScheduleSession[] {
  const lectures = lectureDates[subclass.lectureParity].map((date, index) => {
    const session = `Lecture ${index + 1}`;

    return {
      date,
      type: "Lecture" as const,
      session,
      topic: topics[session],
      start: LECTURE_SLOT.start,
      end: LECTURE_SLOT.end,
      venue: index === 0 ? lectureVenueFirst[subclass.lectureGroup] : lectureVenueMain[subclass.lectureGroup],
    };
  });

  const workshops = workshopDates[`${subclass.workshopDay}-${subclass.cohort}`].map((date, index) => {
    const session = `Workshop ${index + 1}`;

    return {
      date,
      type: "Workshop" as const,
      session,
      topic: topics[session],
      start: subclass.workshopStart,
      end: subclass.workshopEnd,
      venue: subclass.workshopVenue,
    };
  });

  return [...lectures, ...workshops].sort((first, second) => first.date.localeCompare(second.date));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Hong_Kong",
  }).format(new Date(`${date}T00:00:00+08:00`));
}

export function formatWorkshopSlot(subclass: Subclass) {
  return `${subclass.workshopDay} ${subclass.workshopStart} - ${subclass.workshopEnd}`;
}

export function isTodayOrLater(date: string) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return date >= today;
}

// ENGG1101 · AY2026-27 Semester 1 · verified against the official timetabling sheet.
// Every date below already accounts for public holidays and Reading Week.
// DO NOT generate dates programmatically from a "every 2 weeks" rule — the real spacing is uneven.

export const LECTURE_SLOT = { day: "Wed", start: "12:00", end: "12:50" };

// Lectures alternate weekly. Groups 1 & 2 sit on "odd" weeks, groups 3 & 4 on "even" weeks.
// 2 Sep 2026 is the exception: ALL four groups have Lecture 1, each in its own room.
export const LECTURE_DATES = {
  odd: ["2026-09-02", "2026-09-16", "2026-09-30", "2026-10-28", "2026-11-11", "2026-11-25"],
  even: ["2026-09-02", "2026-09-23", "2026-10-07", "2026-10-21", "2026-11-04", "2026-11-18"],
};

// Venue for Lecture 1 only (2 Sep 2026) — the four groups are split.
export const LECTURE_VENUE_FIRST = { 1: "CPD-LG07", 2: "CPD-LG08", 3: "CPD-LG09", 4: "CPD-3.04" };

// Venue for Lecture 2–6 — groups pair up and share a room on alternating weeks.
export const LECTURE_VENUE_MAIN = { 1: "CPD-LG07", 3: "CPD-LG07", 2: "CPD-3.04", 4: "CPD-3.04" };

// Workshops: 3 hours, 5 rounds, biweekly-ish. Keyed by "{day}-{cohort}".
export const WORKSHOP_DATES = {
  "Mon-ODD": ["2026-09-07", "2026-09-21", "2026-10-05", "2026-11-02", "2026-11-16"],
  "Mon-EVEN": ["2026-09-14", "2026-09-28", "2026-10-26", "2026-11-09", "2026-11-23"],
  "Tue-ODD": ["2026-09-08", "2026-09-22", "2026-10-06", "2026-10-27", "2026-11-10"],
  "Tue-EVEN": ["2026-09-15", "2026-09-29", "2026-10-20", "2026-11-03", "2026-11-17"],
  "Thu-ODD": ["2026-09-03", "2026-09-17", "2026-10-22", "2026-11-05", "2026-11-19"],
  "Thu-EVEN": ["2026-09-10", "2026-09-24", "2026-10-08", "2026-10-29", "2026-11-12"],
};

// The 16 subclasses. lectureGroup drives the lecture dates + rooms;
// workshopDay + cohort drive the workshop dates. THE TWO ARE INDEPENDENT.
export const SUBCLASSES = [
  { id: "A", lectureGroup: 4, lectureTeacher: "Dr. Timmy Cheng", lectureParity: "even", workshopTeacher: "Dr. Timmy Cheng", workshopDay: "Mon", cohort: "ODD", workshopStart: "12:00", workshopEnd: "14:50", workshopVenue: "Innowing 1 MakerSpace A" },
  { id: "B", lectureGroup: 3, lectureTeacher: "Mr. Kyle He", lectureParity: "even", workshopTeacher: "Mr. Kyle He", workshopDay: "Mon", cohort: "ODD", workshopStart: "10:00", workshopEnd: "12:50", workshopVenue: "Innowing 1 Open Event Space" },
  { id: "C", lectureGroup: 2, lectureTeacher: "Dr. Edwin Dung", lectureParity: "odd", workshopTeacher: "Dr. Edwin Dung", workshopDay: "Mon", cohort: "ODD", workshopStart: "10:00", workshopEnd: "12:50", workshopVenue: "CB 102A" },
  { id: "D", lectureGroup: 4, lectureTeacher: "Dr. Timmy Cheng", lectureParity: "even", workshopTeacher: "Dr. Timmy Cheng", workshopDay: "Thu", cohort: "ODD", workshopStart: "14:00", workshopEnd: "16:50", workshopVenue: "Innowing 1 MakerSpace A" },
  { id: "E", lectureGroup: 2, lectureTeacher: "Dr. Edwin Dung", lectureParity: "odd", workshopTeacher: "Dr. Edwin Dung", workshopDay: "Thu", cohort: "ODD", workshopStart: "14:00", workshopEnd: "16:50", workshopVenue: "COB LG2-06" },
  { id: "F", lectureGroup: 1, lectureTeacher: "Dr. Ryan Wang", lectureParity: "odd", workshopTeacher: "Dr. Ryan Wang", workshopDay: "Thu", cohort: "ODD", workshopStart: "14:00", workshopEnd: "16:50", workshopVenue: "CB 102A" },
  { id: "G", lectureGroup: 4, lectureTeacher: "Dr. Timmy Cheng", lectureParity: "even", workshopTeacher: "Dr. Timmy Cheng", workshopDay: "Mon", cohort: "EVEN", workshopStart: "12:00", workshopEnd: "14:50", workshopVenue: "Innowing 1 MakerSpace A" },
  { id: "H", lectureGroup: 3, lectureTeacher: "Mr. Kyle He", lectureParity: "even", workshopTeacher: "Mr. Kyle He", workshopDay: "Mon", cohort: "EVEN", workshopStart: "10:00", workshopEnd: "12:50", workshopVenue: "CB 102A" },
  { id: "I", lectureGroup: 2, lectureTeacher: "Dr. Edwin Dung", lectureParity: "odd", workshopTeacher: "Dr. Edwin Dung", workshopDay: "Mon", cohort: "EVEN", workshopStart: "10:00", workshopEnd: "12:50", workshopVenue: "Innowing 1 Open Event Space" },
  { id: "J", lectureGroup: 3, lectureTeacher: "Mr. Kyle He", lectureParity: "even", workshopTeacher: "Mr. Kyle He", workshopDay: "Thu", cohort: "EVEN", workshopStart: "14:00", workshopEnd: "16:50", workshopVenue: "Innowing 1 MakerSpace A" },
  { id: "K", lectureGroup: 4, lectureTeacher: "Dr. Timmy Cheng", lectureParity: "even", workshopTeacher: "Dr. Timmy Cheng", workshopDay: "Thu", cohort: "EVEN", workshopStart: "14:00", workshopEnd: "16:50", workshopVenue: "COB LG2-06" },
  { id: "L", lectureGroup: 1, lectureTeacher: "Dr. Ryan Wang", lectureParity: "odd", workshopTeacher: "Dr. Ryan Wang", workshopDay: "Thu", cohort: "EVEN", workshopStart: "14:00", workshopEnd: "16:50", workshopVenue: "CB 102A" },
  { id: "M", lectureGroup: 2, lectureTeacher: "Dr. Edwin Dung", lectureParity: "odd", workshopTeacher: "Dr. Edwin Dung", workshopDay: "Tue", cohort: "ODD", workshopStart: "13:00", workshopEnd: "15:50", workshopVenue: "Innowing 1 MakerSpace A" },
  { id: "N", lectureGroup: 3, lectureTeacher: "Mr. Kyle He", lectureParity: "even", workshopTeacher: "Mr. Kyle He", workshopDay: "Tue", cohort: "EVEN", workshopStart: "13:00", workshopEnd: "15:50", workshopVenue: "Innowing 1 MakerSpace A" },
  { id: "O", lectureGroup: 1, lectureTeacher: "Dr. Ryan Wang", lectureParity: "odd", workshopTeacher: "Dr. Ryan Wang", workshopDay: "Tue", cohort: "ODD", workshopStart: "13:00", workshopEnd: "15:50", workshopVenue: "Innowing 1 Open Event Space" },
  { id: "P", lectureGroup: 1, lectureTeacher: "Dr. Ryan Wang", lectureParity: "odd", workshopTeacher: "Dr. Ryan Wang", workshopDay: "Tue", cohort: "EVEN", workshopStart: "13:00", workshopEnd: "15:50", workshopVenue: "Innowing 1 Open Event Space" },
];

// Session topics — TO BE FILLED IN LATER by the teaching team.
// Keys must stay exactly as written. Empty string renders as an em dash in the UI.
export const TOPICS = {
  "Lecture 1": "", "Lecture 2": "", "Lecture 3": "",
  "Lecture 4": "", "Lecture 5": "", "Lecture 6": "",
  "Workshop 1": "", "Workshop 2": "", "Workshop 3": "",
  "Workshop 4": "", "Workshop 5": "",
};

// Displayed in the "Non-teaching dates" notice. No class falls on any of these.
export const CLOSURES = [
  { date: "2026-10-01", label: "National Day — public holiday" },
  { date: "2026-10-12/2026-10-17", label: "Reading / Field Trip Week" },
  { date: "2026-10-19", label: "Chung Yeung Festival — public holiday" },
];

export const TERM = {
  lastTeachingDay: "2026-11-30",
  revisionPeriod: "2026-12-01 – 2026-12-05",
  examPeriod: "2026-12-07 – 2026-12-23",
};

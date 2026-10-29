import { assembleResultsCopy, studentFacingText } from "./copy";
import { yearOneCost } from "./cost";
import { assertHonest } from "./honesty";
import { estimateScholarship } from "./scholarship";
import {
  PLACEHOLDER,
  type Catalogue,
  type Course,
  type CourseLevel,
  type EligibilityState,
  type MatchResult,
  type StudentProfile,
  type SubjectFamily,
  type SourcedNumber,
} from "./types";

const CANONICAL_COURSE_ID: Partial<Record<`${CourseLevel}:${SubjectFamily}`, string>> =
  {
    "undergraduate:business": "bsc-business-management",
    "undergraduate:computing": "bsc-computer-science",
    "undergraduate:engineering": "beng-civil-engineering",
    "undergraduate:law": "llb-law",
    "undergraduate:other": "bsc-psychology",
    "postgraduate-taught:business": "msc-international-business-management",
    "postgraduate-taught:computing": "msc-computer-science",
  };

const NEAREST_FAMILY: Partial<Record<SubjectFamily, SubjectFamily>> = {
  health: "other",
  media: "other",
};

const KERALA_YEAR12_PERCENT = 65;
const OTHER_BOARD_YEAR12_PERCENT = 70;
const DIPLOMA_PERCENT = 55;

export function isValidMarksPercent(value: number): boolean {
  return Number.isFinite(value) && value >= 1 && value <= 100;
}

export function isWrongLevel(profile: StudentProfile): boolean {
  return (
    profile.level === "postgraduate-taught" &&
    profile.educationStage !== "graduate"
  );
}

function isCbseGroup(board: string): boolean {
  return /cbse|isc|cicse|aissce/.test(board);
}

/**
 * India-page board bands, already recorded on every UG course note.
 * Use the stricter published figure for the student's board; never a UK tariff.
 */
export function publishedMinPercent(
  course: Course,
  profile: StudentProfile,
): SourcedNumber {
  const stored = course.indiaEntry.minPercent;
  if (stored === PLACEHOLDER) return PLACEHOLDER;
  if (course.indiaEntry.qualification !== "class-12") return stored;

  const board = profile.boardOrDegree.toLowerCase();
  if (board.includes("kerala")) return Math.max(stored, KERALA_YEAR12_PERCENT);
  if (board.includes("diploma")) return DIPLOMA_PERCENT;
  if (isCbseGroup(board)) return stored;
  if (board.includes("state")) return Math.max(stored, OTHER_BOARD_YEAR12_PERCENT);
  return stored;
}

function degreeLooksLikeComputing(boardOrDegree: string): boolean {
  return /computer|computing|\bit\b|information technology|software|data science/.test(
    boardOrDegree.toLowerCase(),
  );
}

function courseRequiresComputingDegree(course: Course): boolean {
  const blob = [
    ...course.extraConditions,
    ...(course.indiaEntry.subjectConditions ?? []),
  ]
    .join(" ")
    .toLowerCase();
  if (/any subject/.test(blob)) return false;
  return /computer science|computing content|significant maths and computing/.test(
    blob,
  );
}

export function isSubjectGap(profile: StudentProfile, course: Course): boolean {
  if (
    course.subjectFamily === "computing" &&
    course.level === "postgraduate-taught" &&
    courseRequiresComputingDegree(course) &&
    !degreeLooksLikeComputing(profile.boardOrDegree)
  ) {
    return true;
  }
  return false;
}

function extraConditionCaveats(course: Course): string[] {
  const extras = [
    ...course.extraConditions,
    ...(course.indiaEntry.subjectConditions ?? []),
  ].filter(
    (line) => !/ielts/i.test(line) && !/^page states/i.test(line),
  );

  return extras.map(
    (line) => `This course also asks for: ${line} — an adviser will check.`,
  );
}

function scoreCourse(course: Course, profile: StudentProfile): number {
  let score = 0;
  const canonical = CANONICAL_COURSE_ID[`${course.level}:${course.subjectFamily}`];
  if (canonical && course.id === canonical) score += 50;
  if (course.scholarshipEligible) score += 10;
  if (course.startDates.length > 0) score += 8;
  if (
    profile.startPreference &&
    course.startDates.includes(profile.startPreference)
  ) {
    score += 15;
  }
  if (course.level === "postgraduate-taught" && course.durationYears === 1) {
    score += 12;
  }
  if (course.id === "mba") score -= 20;
  return score;
}

function pickCourse(courses: Course[], profile: StudentProfile): Course | null {
  if (courses.length === 0) return null;
  const ranked = [...courses].sort((a, b) => {
    const diff = scoreCourse(b, profile) - scoreCourse(a, profile);
    if (diff !== 0) return diff;
    return a.title.localeCompare(b.title);
  });
  return ranked[0] ?? null;
}

function familiesPresent(
  courses: Course[],
  level: CourseLevel,
): Set<SubjectFamily> {
  const found = new Set<SubjectFamily>();
  for (const course of courses) {
    if (course.level === level) found.add(course.subjectFamily);
  }
  return found;
}

function poolForProfile(
  catalogue: Catalogue,
  profile: StudentProfile,
): { courses: Course[]; nearestNote?: string } {
  const atLevel = catalogue.courses.filter((course) => course.level === profile.level);
  const exact = atLevel.filter(
    (course) => course.subjectFamily === profile.subjectInterest,
  );
  if (exact.length > 0) return { courses: exact };

  const present = familiesPresent(catalogue.courses, profile.level);
  const hinted = NEAREST_FAMILY[profile.subjectInterest];
  const fallbackFamily =
    hinted && present.has(hinted)
      ? hinted
      : [...present][0];

  if (!fallbackFamily) return { courses: [] };

  return {
    courses: atLevel.filter((course) => course.subjectFamily === fallbackFamily),
    nearestNote: `We matched you to the nearest subject we have sourced (${fallbackFamily}), not ${profile.subjectInterest}.`,
  };
}

function decideEligibility(input: {
  profile: StudentProfile;
  course: Course | null;
  minPercent: SourcedNumber | null;
}): EligibilityState {
  const { profile, course, minPercent } = input;

  if (isWrongLevel(profile)) return "wrong_level";
  if (!isValidMarksPercent(profile.marksPercent)) return "unknown";
  if (!course) return "unknown";
  if (minPercent === PLACEHOLDER || minPercent === null) return "unknown";
  if (isSubjectGap(profile, course)) return "subject_gap";
  if (
    profile.educationStage === "class-12-current" &&
    profile.level === "undergraduate"
  ) {
    return "too_early";
  }
  if (profile.marksPercent < minPercent) return "below_requirement";
  return "appears_to_meet";
}

function numericMin(minPercent: SourcedNumber | null): number | null {
  return typeof minPercent === "number" ? minPercent : null;
}

export function match(profile: StudentProfile, catalogue: Catalogue): MatchResult {
  const reasons: string[] = [];
  const wrongLevel = isWrongLevel(profile);

  const pool = wrongLevel
    ? { courses: [] as Course[], nearestNote: undefined }
    : poolForProfile(catalogue, profile);

  if (pool.nearestNote) reasons.push(pool.nearestNote);

  const course = pickCourse(pool.courses, profile);
  const minPercent = course ? publishedMinPercent(course, profile) : null;
  const eligibility = decideEligibility({ profile, course, minPercent });

  if (wrongLevel) {
    reasons.push(
      "A master’s needs a bachelor’s. We did not match an MSc, and we did not silently remap you to a bachelor’s.",
    );
    if (profile.subjectInterest) {
      reasons.push(
        `If you want, an adviser can show bachelor’s options in ${profile.subjectInterest} — that would be a new choice.`,
      );
    }
  }

  if (course) {
    reasons.push(`Matched to ${course.title} at ${course.campus}.`);
    reasons.push(
      ...extraConditionCaveats(course),
    );
  } else if (!wrongLevel) {
    reasons.push("No sourced course in this subject and level.");
  }

  if (
    profile.educationStage === "graduate" &&
    profile.level === "undergraduate"
  ) {
    reasons.push(
      "You already hold a bachelor’s and chose a bachelor’s course. A master’s may fit better; we have not switched you.",
    );
  }

  if (eligibility === "subject_gap") {
    const dataScience = catalogue.courses.find(
      (item) => item.id === "msc-data-science",
    );
    if (dataScience) {
      reasons.push(
        `${dataScience.title} is published as accepting a bachelor’s in any subject. That is a different course, not a silent remap of Computer Science. An adviser can talk it through, with the source on the course page.`,
      );
    }
  }

  if (
    eligibility === "too_early" &&
    typeof minPercent === "number" &&
    isValidMarksPercent(profile.marksPercent)
  ) {
    reasons.push(
      `Provisional reading against the published ${minPercent}% guide, using expected marks of ${profile.marksPercent}%.`,
    );
  }

  if (
    eligibility === "below_requirement" &&
    typeof minPercent === "number"
  ) {
    reasons.push(
      `Published India threshold ${minPercent}%; your marks ${profile.marksPercent}%.`,
    );
  }

  const scholarshipEstimate = estimateScholarship(course, catalogue.scholarships);
  const cost = yearOneCost({
    tuitionGbp: course?.tuitionGbpYearOne ?? PLACEHOLDER,
    scholarship: scholarshipEstimate,
    costs: catalogue.costs,
  });

  const copy = assembleResultsCopy({
    profile,
    course,
    eligibility,
    scholarship: scholarshipEstimate,
    cost,
    minPercent: numericMin(minPercent),
  });

  const result: MatchResult = {
    course,
    eligibility,
    reasons,
    scholarshipEstimate,
    yearOneCost: cost,
    lifeCopy: copy.lifeCopy,
    nextStep: copy.nextStep,
    disclaimers: copy.disclaimers,
  };

  assertHonest(
    studentFacingText({
      lifeCopy: result.lifeCopy,
      nextStep: result.nextStep,
      reasons: result.reasons,
      disclaimers: result.disclaimers,
      scholarshipNote: result.scholarshipEstimate.note,
    }),
  );

  return result;
}

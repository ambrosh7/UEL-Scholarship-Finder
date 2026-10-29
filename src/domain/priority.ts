import type {
  AdviserPriority,
  Course,
  MatchResult,
  StudentProfile,
} from "./types";

export type PriorityInput = {
  profile: StudentProfile;
  match: MatchResult;
  consentWhatsapp: boolean;
  consentShareWithUel?: boolean;
  asOf?: Date;
};

const MONTH_MS = 1000 * 60 * 60 * 24 * 30.44;

function parseYearMonth(isoYm: string): Date | null {
  const match = /^(\d{4})-(\d{2})$/.exec(isoYm);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return new Date(Date.UTC(year, month - 1, 1));
}

export function startWithinMonths(
  course: Course | null,
  asOf: Date,
  months: number,
): boolean {
  if (!course) return false;
  return course.startDates.some((isoYm) => {
    const start = parseYearMonth(isoYm);
    if (!start) return false;
    const diffMs = start.getTime() - asOf.getTime();
    if (diffMs < 0) return false;
    return diffMs / MONTH_MS <= months;
  });
}

function thresholdGap(match: MatchResult, profile: StudentProfile): number | null {
  const min = match.course?.indiaEntry.minPercent;
  if (typeof min !== "number") return null;
  return profile.marksPercent - min;
}

/**
 * Adviser rank only. Never surface this on the student page.
 */
export function rankLead(input: PriorityInput): AdviserPriority {
  const asOf = input.asOf ?? new Date();
  const { profile, match } = input;

  if (!input.consentWhatsapp) {
    return {
      priority: 3,
      reasons: ["No WhatsApp consent — not a callable lead."],
    };
  }

  if (match.eligibility === "wrong_level") {
    return {
      priority: 3,
      reasons: [
        "Wrong level: a master's needs a bachelor's. Do not treat this as a ready master's lead.",
      ],
    };
  }

  const gap = thresholdGap(match, profile);
  const farBelowGraduate =
    match.eligibility === "below_requirement" &&
    profile.educationStage === "graduate" &&
    gap !== null &&
    gap < -10;

  if (farBelowGraduate) {
    return {
      priority: 3,
      reasons: [
        "Marks far below the published requirement, with no path this tool can honestly offer.",
      ],
    };
  }

  const reasons: string[] = [];
  let score = 0;

  if (match.eligibility === "appears_to_meet") {
    score += 3;
    reasons.push("Appears to meet published requirements.");
  }

  if (startWithinMonths(match.course, asOf, 6)) {
    score += 2;
    reasons.push("A listed start date is within about six months.");
  }

  if (
    profile.funding === "loan" ||
    profile.decisionMaker === "family" ||
    profile.decisionMaker === "self-if-parents-pay"
  ) {
    score += 2;
    reasons.push("Funding or family decision shows real intent.");
  }

  if (
    match.eligibility === "below_requirement" &&
    profile.educationStage === "class-12-current" &&
    gap !== null &&
    gap >= -5
  ) {
    score += 2;
    reasons.push(
      "Still in Class 12 and close to the published guide — time to improve or talk options.",
    );
  }

  if (
    match.eligibility === "too_early" &&
    (profile.decisionMaker === "family" ||
      profile.decisionMaker === "self-if-parents-pay")
  ) {
    score += 1;
    reasons.push("Family is deciding; they can plan before results.");
  }

  let priority: 1 | 2 | 3 = 3;
  if (score >= 5 && match.eligibility === "appears_to_meet") priority = 1;
  else if (score >= 2) priority = 2;

  if (reasons.length === 0) {
    reasons.push("No high-intent signals.");
  }

  return { priority, reasons };
}

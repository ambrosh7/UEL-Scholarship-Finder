import { costStackLines, formatGbp, scholarshipExampleLine } from "./cost";
import type {
  Course,
  EligibilityState,
  LifeInterest,
  LifeSlots,
  ScholarshipEstimate,
  StudentProfile,
  YearOneCost,
} from "./types";

export function buildLifeSlots(profile: StudentProfile): LifeSlots {
  return {
    city: profile.city,
    interest: primaryInterest(profile),
    level: profile.level,
    subjectFamily: profile.subjectInterest,
    careerHope: profile.careerHope,
    funding: profile.funding,
    decisionMaker: profile.decisionMaker,
  };
}

export function primaryInterest(profile: StudentProfile): LifeInterest {
  return profile.interests[0] ?? "other";
}

export function eligibilitySentence(
  eligibility: EligibilityState,
  course: Course | null,
  profile: StudentProfile,
  minPercent: number | null,
): string {
  const marks = profile.marksPercent;
  const min = minPercent !== null ? `${minPercent}%` : "the published India guide";

  switch (eligibility) {
    case "appears_to_meet":
      return course
        ? `You appear to meet the published entry requirements for ${course.title}. UEL still decides any place.`
        : "You appear to meet the published entry requirements. UEL still decides any place.";
    case "below_requirement":
      return `Your marks (${marks}%) are below the published requirement of ${min}. An adviser can talk through options. A scholarship is only a possibility if you later receive an offer — not a consolation for marks.`;
    case "wrong_level":
      return "A master’s needs a bachelor’s degree. We have not matched you to a master’s course, and we have not switched you to a bachelor’s behind your back.";
    case "subject_gap":
      return course
        ? `Your background may not match ${course.title}. We have not treated this as meeting computing entry.`
        : "Your background may not match this subject. We have not treated this as meeting entry.";
    case "too_early": {
      const standing = provisionalStanding(marks, minPercent);
      return `You can plan now; you apply when results are in. If you achieve around ${marks}%, you would be ${standing} the published ${min} guide. That is not a final result.`;
    }
    case "unknown":
      return "We do not have enough sourced data to judge eligibility. We need a percentage between 1 and 100, or a sourced India threshold.";
  }
}

export function provisionalStanding(
  marks: number,
  minPercent: number | null,
): "below" | "around" | "above" {
  if (minPercent === null) return "around";
  if (Math.abs(marks - minPercent) <= 2) return "around";
  return marks >= minPercent ? "above" : "below";
}

export function resultsHeadline(input: {
  profile: StudentProfile;
  course: Course | null;
  eligibility: EligibilityState;
}): string {
  const { profile, course, eligibility } = input;
  const interest = primaryInterest(profile);

  if (eligibility === "wrong_level") {
    return "A master’s comes after a bachelor’s.";
  }
  if (eligibility === "subject_gap") {
    return "Computing at master’s level needs a computing background.";
  }
  if (eligibility === "unknown") {
    return "We can still show a course — we cannot yet judge the grades.";
  }
  if (eligibility === "below_requirement") {
    return course
      ? `${course.title} is still worth a conversation.`
      : "A course to talk through, with honest marks.";
  }
  if (eligibility === "too_early") {
    if (profile.decisionMaker === "family") {
      return "A business degree to plan with your family, before results are in.";
    }
    return "You can plan now, and apply when results are in.";
  }

  if (profile.decisionMaker === "self-if-parents-pay") {
    return course
      ? `${course.title} — a year-one picture you can show your father.`
      : "A year-one picture you can show your father.";
  }

  if (interest === "football" && profile.subjectInterest === "computing") {
    return "Computing in London, with football on the weekends.";
  }
  if (interest === "food") {
    return "Business in London, and a city you can actually eat in.";
  }
  if (interest === "cricket") {
    return "A London year that still has room for cricket.";
  }

  return course ? `${course.title} at UEL.` : "A UEL course that fits what you told us.";
}

export function interestFragment(profile: StudentProfile, course: Course | null): string {
  const campus = course?.campus ?? "East London";
  const hasFootball = profile.interests.includes("football");
  const hasCricket = profile.interests.includes("cricket");
  const hasFood = profile.interests.includes("food");
  const city = profile.city;

  if (hasFootball && hasCricket) {
    return `${city ? `From ${city}, ` : ""}${campus} sits in East London, near parks and pitches around the Queen Elizabeth Olympic Park. Weekends can look like football or cricket with other students, then the rest of the city when you want it.`;
  }
  if (hasFootball) {
    return `${city ? `From ${city}, ` : ""}${campus} is in East London, a short ride from the parks around the Queen Elizabeth Olympic Park. Weekends can look like football with other students — not a brochure campus, a city you play in.`;
  }
  if (hasCricket) {
    return `${city ? `From ${city}, ` : ""}${campus} is in East London. There is room in a London week for cricket in the parks, and for the rest of the city when the match is over.`;
  }
  if (hasFood) {
    return `${city ? `From ${city}, ` : ""}East London is a practical place to cook. Shops and markets around Stratford make it easier to find the spices and vegetables you already know, and to try other food when you want a change.`;
  }
  return `${city ? `From ${city}, ` : ""}London is the city around campus: docks, markets, and a large Indian student community. We have not invented a hobby for you.`;
}

export function fundingFragment(profile: StudentProfile): string {
  if (profile.funding === "loan") {
    return "You said an education loan is arranged. The year-one figures are in pounds, with a dated rupee snapshot, so you have a number you can take to a lender. They are estimates for 2026/27, not a bill.";
  }
  if (profile.decisionMaker === "family") {
    return "Your family will decide together, and cost is the question to put on the table first: tuition, a possible international scholarship range, living, visa, and the lines still marked PLACEHOLDER.";
  }
  if (profile.decisionMaker === "self-if-parents-pay") {
    return "You would go if your parents agree to pay, and how you would pay is not decided yet. This is the year-one picture to show your father: the fee, the scholarship range UEL may apply in an offer, and the other first-year costs.";
  }
  if (profile.funding === "unsure") {
    return "How you would pay is not decided yet. The stack below is the number to discuss, not a loan product.";
  }
  return "Year-one costs are listed in pounds. Missing lines stay as PLACEHOLDER rather than a guessed low total.";
}

export function careerFragment(profile: StudentProfile): string | null {
  if (profile.careerHope === "work-in-uk") {
    return "You hope to look for work in the UK after graduating. Some graduates do look; that is not guaranteed, and this tool cannot promise a job, a visa, or the right to stay.";
  }
  if (profile.careerHope === "return-home") {
    return "You said you may take this degree home. That is a hope about your own plan, not a job UEL can promise.";
  }
  if (profile.careerHope === "travel" || profile.careerHope === "balance") {
    return "You want a life as well as a degree. London is a year in a city, not a guarantee of work or a certain salary.";
  }
  return null;
}

export function scholarshipFragment(scholarship: ScholarshipEstimate): string {
  if (scholarship.note) return scholarship.note;
  if (scholarship.eligible) {
    return `International scholarships are typically ${formatGbp(scholarship.amountMinGbp)}–${formatGbp(scholarship.amountMaxGbp)} off first-year tuition, decided by UEL and confirmed in an offer letter.`;
  }
  return "The international scholarship does not apply to this match.";
}

export function nextStepCopy(
  eligibility: EligibilityState,
  profile: StudentProfile,
): string {
  switch (eligibility) {
    case "appears_to_meet":
      if (profile.decisionMaker === "self-if-parents-pay") {
        return "Share this with your father, then speak with an adviser about applying. UEL decides any place and any scholarship.";
      }
      if (profile.funding === "loan") {
        return "Speak with an adviser about applying, with the year-one numbers for your lender. UEL decides any place and any scholarship.";
      }
      return "Speak with an adviser about applying. UEL decides any place and any scholarship.";
    case "too_early":
      return "Share this with your family and plan the application for when results are in. An adviser can walk through the timing.";
    case "below_requirement":
      return "Ask an adviser about options. The scholarship is not a prize for low marks; it is only a possibility if UEL later makes an offer.";
    case "wrong_level":
      return "If you want, we can show bachelor’s options in the same subject. That would be a new choice, not a silent switch. A master’s waits until you have a bachelor’s.";
    case "subject_gap":
      return "Ask an adviser about subject fit. If UEL publishes another computing-related master’s that accepts a wider background, they can show you the source — we will not pretend this is a match.";
    case "unknown":
      return "Come back with a percentage between 1 and 100, or talk to an adviser who can check the sourced India rules with you.";
  }
}

export const STANDARD_DISCLAIMERS = [
  "UEL decides the place and the scholarship. This is not an offer.",
  "International scholarships are typically £500–£5,000 off first-year tuition, decided by UEL, confirmed in an offer letter.",
  "Costs are estimates for 2026/27, with source dates. PLACEHOLDER means confirm on GOV.UK / UEL. GBP is the source of truth; INR is a labelled RBI snapshot, not live FX.",
] as const;

export function assembleResultsCopy(input: {
  profile: StudentProfile;
  course: Course | null;
  eligibility: EligibilityState;
  scholarship: ScholarshipEstimate;
  cost: YearOneCost;
  minPercent: number | null;
}): { lifeCopy: string; nextStep: string; disclaimers: string[] } {
  const { profile, course, eligibility, scholarship, cost, minPercent } = input;
  const parts: string[] = [
    resultsHeadline({ profile, course, eligibility }),
    "",
    eligibilitySentence(eligibility, course, profile, minPercent),
  ];

  if (course) {
    parts.push(
      `${course.title} at ${course.campus}. Academic year ${cost.academicYear}.`,
    );
  }

  parts.push(scholarshipFragment(scholarship));
  const example = scholarshipExampleLine(cost);
  if (example) parts.push(example);

  parts.push(fundingFragment(profile));
  parts.push(interestFragment(profile, course));

  const career = careerFragment(profile);
  if (career) parts.push(career);

  parts.push(costStackLines(cost).join(" "));

  return {
    lifeCopy: parts.filter((line) => line.length > 0).join(" "),
    nextStep: nextStepCopy(eligibility, profile),
    disclaimers: [...STANDARD_DISCLAIMERS],
  };
}

export function parentWhatsApp(input: {
  profile: StudentProfile;
  course: Course | null;
  eligibility: EligibilityState;
  scholarship: ScholarshipEstimate;
  cost: YearOneCost;
  minPercent: number | null;
}): string {
  const { profile, course, eligibility, cost, minPercent } = input;
  const title = course?.title ?? "No course matched";
  const marks = profile.marksPercent;
  const min = minPercent !== null ? `${minPercent}%` : "the published guide";

  let eligibilityPlain: string;
  switch (eligibility) {
    case "appears_to_meet":
      eligibilityPlain = "They appear to meet the published entry requirements. UEL still decides any place.";
      break;
    case "too_early":
      eligibilityPlain = `Still in Class 12. If they achieve around ${marks}%, that would be ${provisionalStanding(marks, minPercent)} the published ${min}. Not a final result.`;
      break;
    case "below_requirement":
      eligibilityPlain = `Marks (${marks}%) are below the published ${min}.`;
      break;
    case "wrong_level":
      eligibilityPlain = "A master’s needs a bachelor’s. We did not match a master’s course.";
      break;
    case "subject_gap":
      eligibilityPlain = "Subject background may not match this course.";
      break;
    case "unknown":
      eligibilityPlain = "Not enough sourced data to judge grades.";
      break;
  }

  const scholarshipLine =
    input.scholarship.eligible
      ? "International scholarship: typically £500–£5,000 off first-year tuition, decided by UEL in an offer letter — not a promised amount."
      : "International scholarship: not applied on this match.";

  const lines = [
    "UEL Fit & Scholarship Finder (not an offer).",
    `Course: ${title}. ${eligibilityPlain}`,
    scholarshipLine,
    `Year-one costs are 2026/27 estimates in GBP (tuition ${formatGbp(cost.tuitionGbp)}). Flights may still be PLACEHOLDER. INR is a dated RBI snapshot, not live FX.`,
    "An adviser can talk this through. UEL decides any place and any scholarship.",
  ];

  return lines.join(" ");
}

export function studentFacingText(input: {
  lifeCopy: string;
  nextStep: string;
  reasons: string[];
  disclaimers: string[];
  scholarshipNote?: string;
}): string {
  return [
    input.lifeCopy,
    input.nextStep,
    ...input.reasons,
    ...input.disclaimers,
    input.scholarshipNote ?? "",
  ].join("\n");
}

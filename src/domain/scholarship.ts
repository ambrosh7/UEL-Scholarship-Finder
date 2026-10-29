import {
  PLACEHOLDER,
  UEL_INTERNATIONAL_SCHOLARSHIP_ID,
  type Course,
  type ScholarshipEstimate,
  type ScholarshipPolicy,
  type SourcedNumber,
} from "./types";

export function internationalScholarshipPolicy(
  policies: readonly ScholarshipPolicy[],
): ScholarshipPolicy | undefined {
  return policies.find((policy) => policy.id === UEL_INTERNATIONAL_SCHOLARSHIP_ID);
}

/**
 * Home-fee postgraduate awards are not for this Indian international student.
 * Kept as a named constant so tests can prove we never apply it.
 */
export const HOME_POSTGRADUATE_SCHOLARSHIP = "50% postgraduate scholarship";

export function estimateScholarship(
  course: Course | null,
  policies: readonly ScholarshipPolicy[],
): ScholarshipEstimate {
  const policy = internationalScholarshipPolicy(policies);

  if (!course) {
    return {
      eligible: false,
      amountMinGbp: policy?.amountMinGbp ?? PLACEHOLDER,
      amountMaxGbp: policy?.amountMaxGbp ?? PLACEHOLDER,
      appliesTo: "first-year-tuition",
      autoAssessed: policy?.autoAssessed ?? true,
      requiresOffer: policy?.requiresOffer ?? true,
      note: "No course was matched, so this is not a personal scholarship reading. UEL’s international scholarship is typically £500–£5,000 off first-year tuition, decided after an offer.",
    };
  }

  if (!course.scholarshipEligible) {
    return {
      eligible: false,
      amountMinGbp: PLACEHOLDER,
      amountMaxGbp: PLACEHOLDER,
      appliesTo: "first-year-tuition",
      autoAssessed: policy?.autoAssessed ?? true,
      requiresOffer: policy?.requiresOffer ?? true,
      note: "The international scholarship does not apply to this course. UEL excludes foundation, pre-masters, short courses, exchange, and franchised programmes.",
    };
  }

  if (!policy) {
    return {
      eligible: false,
      amountMinGbp: PLACEHOLDER,
      amountMaxGbp: PLACEHOLDER,
      appliesTo: "first-year-tuition",
      autoAssessed: true,
      requiresOffer: true,
      note: "PLACEHOLDER — confirm the international scholarship on UEL.",
    };
  }

  return {
    eligible: true,
    amountMinGbp: policy.amountMinGbp,
    amountMaxGbp: policy.amountMaxGbp,
    appliesTo: "first-year-tuition",
    autoAssessed: policy.autoAssessed,
    requiresOffer: policy.requiresOffer,
    note: "International scholarships are typically £500–£5,000 off first-year tuition. They are considered automatically after a complete application. UEL decides the amount; it appears in an offer letter. This is not your award, and the figure is not based on your marks.",
  };
}

export function labelledTuitionExample(
  tuitionGbp: SourcedNumber,
  exampleAwardGbp: number,
): { afterGbp: SourcedNumber; label: string } {
  if (tuitionGbp === PLACEHOLDER) {
    return {
      afterGbp: PLACEHOLDER,
      label: "Example only — tuition is still PLACEHOLDER.",
    };
  }

  const after = tuitionGbp - exampleAwardGbp;
  return {
    afterGbp: after,
    label: `If UEL awarded £${exampleAwardGbp.toLocaleString("en-GB")}, first-year tuition would be £${after.toLocaleString("en-GB")}. That is an example, not your award.`,
  };
}

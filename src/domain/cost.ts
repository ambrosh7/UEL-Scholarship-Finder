import { labelledTuitionExample } from "./scholarship";
import {
  ACADEMIC_YEAR,
  PLACEHOLDER,
  type CostOfLiving,
  type ScholarshipEstimate,
  type SourcedNumber,
  type YearOneCost,
} from "./types";

const STACK_FIELDS = [
  ["tuitionGbp", "Tuition"],
  ["londonLivingGbp", "London living"],
  ["visaGbp", "Student visa"],
  ["ihsGbp", "IHS"],
  ["depositGbp", "Tuition deposit"],
  ["accommodationGbp", "Accommodation"],
  ["flightsGbp", "Flights"],
] as const satisfies ReadonlyArray<readonly [keyof YearOneCost, string]>;

export type YearOneCostSummary = {
  complete: boolean;
  sourcedTotalGbp: number;
  placeholderFields: string[];
};

export function gbpToInr(
  gbp: SourcedNumber,
  inrPerGbp: SourcedNumber,
): SourcedNumber {
  if (gbp === PLACEHOLDER || inrPerGbp === PLACEHOLDER) return PLACEHOLDER;
  return Math.round(gbp * inrPerGbp);
}

export function formatGbp(value: SourcedNumber): string {
  if (value === PLACEHOLDER) return "PLACEHOLDER — confirm on GOV.UK / UEL";
  return `£${value.toLocaleString("en-GB")}`;
}

export function yearOneCost(input: {
  tuitionGbp: SourcedNumber;
  scholarship: ScholarshipEstimate;
  costs: CostOfLiving;
}): YearOneCost {
  const { tuitionGbp, scholarship, costs } = input;

  return {
    academicYear: costs.academicYear ?? ACADEMIC_YEAR,
    tuitionGbp,
    scholarshipMinGbp: scholarship.eligible ? scholarship.amountMinGbp : 0,
    scholarshipMaxGbp: scholarship.eligible ? scholarship.amountMaxGbp : 0,
    londonLivingGbp: costs.londonLivingGbp,
    visaGbp: costs.visaGbp,
    ihsGbp: costs.ihsGbp,
    depositGbp: costs.depositGbp,
    accommodationGbp: costs.accommodationGbp,
    flightsGbp: costs.flightsGbp,
    inrPerGbp: costs.inrPerGbp,
    inrSourceUrl: costs.inrSourceUrl,
    inrCheckedOn: costs.checkedOn,
  };
}

/**
 * Sum sourced lines only. Never subtract the scholarship range.
 * A complete=false summary must not be shown as “year one: £X”.
 */
export function summariseYearOneCost(cost: YearOneCost): YearOneCostSummary {
  const placeholderFields: string[] = [];
  let sourcedTotalGbp = 0;

  for (const [key, label] of STACK_FIELDS) {
    const value = cost[key];
    if (value === PLACEHOLDER) {
      placeholderFields.push(label);
    } else if (typeof value === "number") {
      // GOV.UK living already covers maintenance; halls rent is a typical room, not extra.
      if (key === "accommodationGbp" && typeof cost.londonLivingGbp === "number") {
        continue;
      }
      sourcedTotalGbp += value;
    }
  }

  return {
    complete: placeholderFields.length === 0,
    sourcedTotalGbp,
    placeholderFields,
  };
}

export function costStackLines(cost: YearOneCost): string[] {
  const scholarshipLine =
    typeof cost.scholarshipMinGbp === "number" &&
    cost.scholarshipMinGbp === 0 &&
    typeof cost.scholarshipMaxGbp === "number" &&
    cost.scholarshipMaxGbp === 0
      ? "International scholarship: not applied on this match."
      : `International scholarship (range, not deducted from tuition): ${formatGbp(cost.scholarshipMinGbp)}–${formatGbp(cost.scholarshipMaxGbp)} off first-year tuition.`;

  const inrRate =
    cost.inrPerGbp === PLACEHOLDER
      ? PLACEHOLDER
      : `${cost.inrPerGbp} rupees per pound`;

  return [
    `Tuition (${cost.academicYear}): ${formatGbp(cost.tuitionGbp)}`,
    scholarshipLine,
    `Living in London (GOV.UK visa financial requirement, 9 months): ${formatGbp(cost.londonLivingGbp)}`,
    `Student visa (from outside the UK): ${formatGbp(cost.visaGbp)}`,
    `Immigration Health Surcharge (student rate, one year): ${formatGbp(cost.ihsGbp)}`,
    `Tuition deposit: ${formatGbp(cost.depositGbp)}`,
    `Typical room (academic year): ${formatGbp(cost.accommodationGbp)}`,
    `Flights from India to London: ${formatGbp(cost.flightsGbp)}`,
    `INR snapshot: RBI reference ${inrRate}, dated ${cost.inrCheckedOn}. Not live FX. ${cost.inrSourceUrl}`,
  ];
}

export function scholarshipExampleLine(cost: YearOneCost): string | null {
  if (
    cost.tuitionGbp === PLACEHOLDER ||
    typeof cost.scholarshipMinGbp !== "number" ||
    cost.scholarshipMinGbp === 0
  ) {
    return null;
  }

  const exampleAward = 2000;
  return labelledTuitionExample(cost.tuitionGbp, exampleAward).label;
}

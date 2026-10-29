import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  costStackLines,
  gbpToInr,
  summariseYearOneCost,
  yearOneCost,
} from "./cost";
import { loadCatalogue } from "../data/loadCatalogue";
import { studentA } from "./fixtures/gold";
import { match } from "./match";
import { estimateScholarship } from "./scholarship";
import { PLACEHOLDER } from "./types";

const catalogue = loadCatalogue();

describe("year-one cost stack", () => {
  it("keeps placeholders visible and does not invent a grand total", () => {
    const result = match(studentA, catalogue);
    const summary = summariseYearOneCost(result.yearOneCost);

    assert.equal(result.yearOneCost.londonLivingGbp, 13761);
    assert.equal(result.yearOneCost.visaGbp, 558);
    assert.equal(result.yearOneCost.ihsGbp, 776);
    assert.equal(result.yearOneCost.flightsGbp, PLACEHOLDER);
    assert.equal(summary.complete, false);
    assert.ok(summary.placeholderFields.includes("Flights"));
    assert.ok(!summary.placeholderFields.includes("Student visa"));

    const lines = costStackLines(result.yearOneCost).join("\n");
    assert.match(lines, /PLACEHOLDER — confirm on GOV\.UK \/ UEL/);
    assert.doesNotMatch(result.lifeCopy, /Year one: £\d/);
  });

  it("does not subtract the max scholarship from tuition", () => {
    const result = match(studentA, catalogue);
    assert.equal(result.yearOneCost.tuitionGbp, result.course?.tuitionGbpYearOne);
    assert.equal(result.yearOneCost.scholarshipMaxGbp, 5000);
    const summary = summariseYearOneCost(result.yearOneCost);
    assert.equal(typeof result.yearOneCost.tuitionGbp, "number");
    const tuition = result.yearOneCost.tuitionGbp as number;
    assert.ok(summary.sourcedTotalGbp >= tuition);
  });

  it("stores the dated RBI snapshot, not live FX", () => {
    const result = match(studentA, catalogue);
    assert.equal(result.yearOneCost.inrPerGbp, catalogue.costs.inrPerGbp);
    assert.equal(result.yearOneCost.inrSourceUrl, catalogue.costs.inrSourceUrl);
    assert.equal(result.yearOneCost.inrCheckedOn, catalogue.costs.checkedOn);
    assert.equal(
      gbpToInr(100, catalogue.costs.inrPerGbp),
      typeof catalogue.costs.inrPerGbp === "number"
        ? Math.round(100 * catalogue.costs.inrPerGbp)
        : PLACEHOLDER,
    );
    assert.equal(gbpToInr(PLACEHOLDER, catalogue.costs.inrPerGbp), PLACEHOLDER);
  });

  it("still builds a stack when scholarship is ineligible", () => {
    const course = catalogue.courses[0];
    const scholarship = estimateScholarship(
      { ...course, scholarshipEligible: false },
      catalogue.scholarships,
    );
    const cost = yearOneCost({
      tuitionGbp: course.tuitionGbpYearOne,
      scholarship,
      costs: catalogue.costs,
    });
    assert.equal(cost.scholarshipMinGbp, 0);
    assert.equal(cost.scholarshipMaxGbp, 0);
    assert.equal(cost.academicYear, "2026/27");
  });
});

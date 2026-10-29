import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadCatalogue } from "../data/loadCatalogue";
import { studentA } from "./fixtures/gold";
import { match } from "./match";
import {
  HOME_POSTGRADUATE_SCHOLARSHIP,
  estimateScholarship,
  labelledTuitionExample,
} from "./scholarship";

const catalogue = loadCatalogue();

describe("scholarship range", () => {
  it("returns £500–£5,000 for an eligible course, never a personal figure", () => {
    const result = match(studentA, catalogue);
    assert.equal(result.scholarshipEstimate.eligible, true);
    assert.equal(result.scholarshipEstimate.amountMinGbp, 500);
    assert.equal(result.scholarshipEstimate.amountMaxGbp, 5000);
    assert.equal(result.scholarshipEstimate.autoAssessed, true);
    assert.equal(result.scholarshipEstimate.requiresOffer, true);
    assert.ok(result.scholarshipEstimate.note);
    assert.match(result.scholarshipEstimate.note ?? "", /not your award/i);
    assert.match(result.scholarshipEstimate.note ?? "", /not based on your marks/i);
  });

  it("does not apply the Home 50% postgraduate scholarship", () => {
    const result = match(studentA, catalogue);
    const blob = JSON.stringify(result.scholarshipEstimate).toLowerCase();
    assert.ok(!blob.includes("50%"));
    assert.ok(!blob.includes(HOME_POSTGRADUATE_SCHOLARSHIP.toLowerCase()));
    assert.ok(!result.lifeCopy.toLowerCase().includes("50% postgraduate"));
  });

  it("labels a worked example as an example", () => {
    const example = labelledTuitionExample(16020, 2000);
    assert.equal(example.afterGbp, 14020);
    assert.match(example.label, /example, not your award/i);
  });

  it("does not show the range on an excluded course", () => {
    const course = {
      ...catalogue.courses[0],
      scholarshipEligible: false,
    };
    const estimate = estimateScholarship(course, catalogue.scholarships);
    assert.equal(estimate.eligible, false);
    assert.match(estimate.note ?? "", /does not apply/i);
  });
});

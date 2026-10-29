import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildLifeSlots,
  parentWhatsApp,
  primaryInterest,
} from "./copy";
import { findForbiddenClaims } from "./honesty";
import { loadCatalogue } from "../data/loadCatalogue";
import { studentA, studentB } from "./fixtures/gold";
import { match } from "./match";

const catalogue = loadCatalogue();

describe("life slots", () => {
  it("maps Student A to football and Student B to food", () => {
    assert.equal(primaryInterest(studentA), "football");
    assert.equal(buildLifeSlots(studentA).city, "Hyderabad");
    assert.equal(primaryInterest(studentB), "food");
    assert.equal(buildLifeSlots(studentB).decisionMaker, "family");
  });

  it("does not invent a hobby for interest = other", () => {
    const result = match(
      { ...studentA, interests: ["other"], careerHope: "undecided" },
      catalogue,
    );
    assert.doesNotMatch(result.lifeCopy, /football/i);
    assert.match(result.lifeCopy, /have not invented a hobby/i);
  });
});

describe("parent WhatsApp", () => {
  it("stays under 120 words and does not promise what UEL decides", () => {
    const result = match(studentB, catalogue);
    const text = parentWhatsApp({
      profile: studentB,
      course: result.course,
      eligibility: result.eligibility,
      scholarship: result.scholarshipEstimate,
      cost: result.yearOneCost,
      minPercent:
        result.course && typeof result.course.indiaEntry.minPercent === "number"
          ? result.course.indiaEntry.minPercent
          : null,
    });
    assert.ok(text.split(/\s+/).filter(Boolean).length < 120);
    assert.equal(findForbiddenClaims(text).length, 0);
    assert.match(text, /not an offer/i);
    assert.doesNotMatch(text, /your weekends playing football/i);
  });
});

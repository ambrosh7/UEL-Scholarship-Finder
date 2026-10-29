import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  careerFragment,
  interestFragment,
  resultsHeadline,
  studentFacingText,
} from "./copy";
import { findForbiddenClaims } from "./honesty";
import { loadCatalogue } from "../data/loadCatalogue";
import { match } from "./match";
import {
  GOLD_ANSWERS,
  profileFromAnswers,
  type WizardAnswers,
} from "./questions";

const catalogue = loadCatalogue();

function facingFromAnswers(answers: WizardAnswers) {
  const profile = profileFromAnswers(answers);
  const result = match(profile, catalogue);
  return {
    profile,
    result,
    text: studentFacingText({
      lifeCopy: result.lifeCopy,
      nextStep: result.nextStep,
      reasons: result.reasons,
      disclaimers: result.disclaimers,
      scholarshipNote: result.scholarshipEstimate.note,
    }),
  };
}

describe("Phase 5 prototype slice", () => {
  it("Student A six answers keep the Task 4 shape without inventing Hyderabad or a UK job", () => {
    const { profile, result, text } = facingFromAnswers(GOLD_ANSWERS.studentA);
    assert.equal(profile.city, undefined);
    assert.equal(profile.careerHope, undefined);
    assert.equal(result.course?.id, "bsc-computer-science");
    assert.equal(result.eligibility, "appears_to_meet");
    assert.equal(
      resultsHeadline({
        profile,
        course: result.course,
        eligibility: result.eligibility,
      }),
      "Computing in London, with football on the weekends.",
    );
    assert.match(interestFragment(profile, result.course), /football/i);
    assert.doesNotMatch(interestFragment(profile, result.course), /Hyderabad/);
    assert.equal(careerFragment(profile), null);
    assert.match(text, /loan/i);
    assert.equal(findForbiddenClaims(text).length, 0);
    assert.doesNotMatch(text, /you will get a uk job/i);
  });

  it("Mumbai-style graduate + business master’s does not silent-remap to a bachelor’s", () => {
    const { result, text } = facingFromAnswers(GOLD_ANSWERS.mumbaiGraduate);
    assert.equal(result.course?.level, "postgraduate-taught");
    assert.equal(result.course?.subjectFamily, "business");
    assert.notEqual(result.course?.level, "undergraduate");
    assert.match(text, /father/i);
    assert.equal(findForbiddenClaims(text).length, 0);
  });

  it("Task 6: Class 12 + master’s is wrong_level with no MSc", () => {
    const { result, text } = facingFromAnswers(GOLD_ANSWERS.class12Masters);
    assert.equal(result.eligibility, "wrong_level");
    assert.equal(result.course, null);
    assert.match(text, /bachelor/i);
    assert.match(text, /did not match an MSc/i);
    assert.equal(findForbiddenClaims(text).length, 0);
  });

  it("Task 6: marks below the published guide still show a course", () => {
    const { result, text } = facingFromAnswers({
      ...GOLD_ANSWERS.studentA,
      marksPercent: 55,
    });
    assert.equal(result.eligibility, "below_requirement");
    assert.ok(result.course);
    assert.match(text, /55%/);
    assert.match(text, /possibility if you later receive an offer/i);
    assert.equal(findForbiddenClaims(text).length, 0);
  });

  it("Task 6: B.Com + computing master’s is a subject gap, not a pass", () => {
    const { result, text } = facingFromAnswers(GOLD_ANSWERS.bcomComputingMasters);
    assert.equal(result.eligibility, "subject_gap");
    assert.notEqual(result.eligibility, "appears_to_meet");
    assert.match(text, /not treated this as meeting/i);
    assert.equal(findForbiddenClaims(text).length, 0);
  });
});

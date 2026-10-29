import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { studentA, studentB } from "./fixtures/gold";
import { findForbiddenClaims } from "./honesty";
import { loadCatalogue } from "../data/loadCatalogue";
import { match } from "./match";
import {
  CAREER_OPTIONS,
  DECIDE_OPTIONS,
  FUNDING_OPTIONS,
  GOLD_ANSWERS,
  INTEREST_OPTIONS,
  LANDING,
  LEVEL_OPTIONS,
  PROTOTYPE_QUESTION_IDS,
  QUESTIONS,
  SUBJECT_OPTIONS,
  profileFromAnswers,
  studentFacingQuestionCopy,
} from "./questions";

const catalogue = loadCatalogue();

describe("question spec freeze", () => {
  it("has six prototype primary questions, as a subset of the full spec", () => {
    assert.equal(PROTOTYPE_QUESTION_IDS.length, 6);
    const ids = QUESTIONS.map((question) => question.id);
    for (const id of PROTOTYPE_QUESTION_IDS) {
      assert.ok(ids.includes(id), `${id} missing from full spec`);
      const spec = QUESTIONS.find((question) => question.id === id);
      assert.equal(spec?.prototype, true);
    }
  });

  it("keeps funding unknown and self-if-parents-pay", () => {
    assert.ok(FUNDING_OPTIONS.some((option) => option.value === "unsure"));
    assert.ok(
      FUNDING_OPTIONS.some((option) => option.label === "Not yet decided"),
    );
    assert.ok(
      DECIDE_OPTIONS.some((option) => option.value === "self-if-parents-pay"),
    );
    assert.ok(
      DECIDE_OPTIONS.some(
        (option) =>
          option.label === "I will decide, if my parents agree to fund it",
      ),
    );
  });

  it("keeps football, cricket, food, and other", () => {
    const values = INTEREST_OPTIONS.map((option) => option.value);
    assert.deepEqual(values, ["football", "cricket", "food", "other"]);
  });

  it("lists business / management before computing", () => {
    assert.equal(SUBJECT_OPTIONS[0]?.value, "business");
    assert.equal(SUBJECT_OPTIONS[1]?.value, "computing");
  });

  it("does not ask for a name or number on the landing copy", () => {
    const landing = `${LANDING.headline} ${LANDING.subline} ${LANDING.honesty} ${LANDING.button}`;
    assert.match(landing, /on your phone/i);
    assert.doesNotMatch(landing, /whatsapp/i);
    assert.doesNotMatch(landing, /mobile number/i);
    assert.doesNotMatch(landing, /\byour name\b/i);
  });

  it("passes the honesty corpus", () => {
    const copy = studentFacingQuestionCopy();
    assert.equal(findForbiddenClaims(copy).length, 0);
    assert.doesNotMatch(copy, /limited seats/i);
    assert.doesNotMatch(copy, /50% postgraduate scholarship/i);
  });

  it("does not ask for a placement rate or UK degree class", () => {
    const copy = studentFacingQuestionCopy();
    assert.doesNotMatch(copy, /2:1|2:2|first class/i);
    assert.doesNotMatch(copy, /placement/i);
    assert.ok(CAREER_OPTIONS.some((option) => option.value === "work-in-uk"));
    assert.match(
      CAREER_OPTIONS.find((option) => option.value === "work-in-uk")?.label ?? "",
      /hope/i,
    );
  });

  it("maps Student A and B gold answers onto the Phase 2 fixtures", () => {
    const a = profileFromAnswers(GOLD_ANSWERS.studentA);
    assert.equal(a.level, studentA.level);
    assert.equal(a.educationStage, studentA.educationStage);
    assert.equal(a.subjectInterest, studentA.subjectInterest);
    assert.equal(a.marksPercent, studentA.marksPercent);
    assert.equal(a.boardOrDegree, studentA.boardOrDegree);
    assert.deepEqual(a.interests, studentA.interests);
    assert.equal(a.funding, studentA.funding);
    assert.equal(a.decisionMaker, studentA.decisionMaker);

    const b = profileFromAnswers(GOLD_ANSWERS.studentB);
    assert.equal(b.educationStage, studentB.educationStage);
    assert.equal(b.subjectInterest, studentB.subjectInterest);
    assert.equal(b.interests[0], "food");
    assert.equal(b.decisionMaker, "family");
  });

  it("prototype gold answers still produce the Phase 2 eligibility codes", () => {
    const a = match(profileFromAnswers(GOLD_ANSWERS.studentA), catalogue);
    assert.equal(a.course?.subjectFamily, "computing");
    assert.equal(a.eligibility, "appears_to_meet");

    const b = match(profileFromAnswers(GOLD_ANSWERS.studentB), catalogue);
    assert.equal(b.course?.subjectFamily, "business");
    assert.equal(b.eligibility, "too_early");

    const mum = match(profileFromAnswers(GOLD_ANSWERS.mumbaiGraduate), catalogue);
    assert.equal(mum.course?.level, "postgraduate-taught");
    assert.equal(mum.course?.subjectFamily, "business");

    const t61 = match(profileFromAnswers(GOLD_ANSWERS.class12Masters), catalogue);
    assert.equal(t61.eligibility, "wrong_level");

    const t63 = match(
      profileFromAnswers(GOLD_ANSWERS.bcomComputingMasters),
      catalogue,
    );
    assert.equal(t63.eligibility, "subject_gap");
  });

  it("exposes bachelor’s and master’s as the only level options", () => {
    assert.deepEqual(
      LEVEL_OPTIONS.map((option) => option.label),
      ["Bachelor’s degree", "Master’s degree"],
    );
  });
});

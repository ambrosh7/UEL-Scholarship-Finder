import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parentWhatsApp, studentFacingText } from "./copy";
import {
  bcomComputingMasters,
  class12Masters,
  mumbaiGraduate,
  studentA,
  studentB,
} from "./fixtures/gold";
import { findForbiddenClaims } from "./honesty";
import { loadCatalogue } from "../data/loadCatalogue";
import { isValidMarksPercent, match } from "./match";
import { PLACEHOLDER, type Course, type StudentProfile } from "./types";

const catalogue = loadCatalogue();

function facing(result: ReturnType<typeof match>): string {
  return studentFacingText({
    lifeCopy: result.lifeCopy,
    nextStep: result.nextStep,
    reasons: result.reasons,
    disclaimers: result.disclaimers,
    scholarshipNote: result.scholarshipEstimate.note,
  });
}

function courseById(id: string): Course {
  const course = catalogue.courses.find((item) => item.id === id);
  assert.ok(course, `missing course ${id}`);
  return course;
}

function numericMin(course: Course): number {
  assert.notEqual(course.indiaEntry.minPercent, PLACEHOLDER);
  assert.equal(typeof course.indiaEntry.minPercent, "number");
  return course.indiaEntry.minPercent as number;
}

describe("G-A Student A (Hyderabad)", () => {
  const result = match(studentA, catalogue);
  const cs = courseById("bsc-computer-science");
  const min = numericMin(cs);
  const text = facing(result);

  it("matches computing UG, not business", () => {
    assert.ok(result.course);
    assert.equal(result.course.subjectFamily, "computing");
    assert.equal(result.course.level, "undergraduate");
    assert.notEqual(result.course.subjectFamily, "business");
  });

  it("uses the sourced India threshold, not a hardcoded 60%", () => {
    assert.equal(
      result.eligibility,
      studentA.marksPercent >= min ? "appears_to_meet" : "below_requirement",
    );
  });

  it("shows a scholarship range, not a personal amount", () => {
    assert.equal(result.scholarshipEstimate.eligible, true);
    assert.equal(result.scholarshipEstimate.amountMinGbp, 500);
    assert.equal(result.scholarshipEstimate.amountMaxGbp, 5000);
    assert.equal(result.scholarshipEstimate.appliesTo, "first-year-tuition");
    assert.match(text, /£500/);
    assert.match(text, /£5,000|£5000/);
    assert.equal(findForbiddenClaims(text).length, 0);
  });

  it("uses football and loan framing, not food", () => {
    assert.match(result.lifeCopy, /football/i);
    assert.match(result.lifeCopy, /loan/i);
    assert.doesNotMatch(result.lifeCopy, /cook/i);
  });

  it("treats UK work as a hope, not an outcome", () => {
    assert.match(text, /not guaranteed/i);
    assert.doesNotMatch(text, /you will get a uk job/i);
  });
});

describe("G-B Student B (Kochi)", () => {
  const result = match(studentB, catalogue);
  const text = facing(result);

  it("matches business UG with too_early and a provisional reading", () => {
    assert.ok(result.course);
    assert.equal(result.course.subjectFamily, "business");
    assert.equal(result.course.level, "undergraduate");
    assert.equal(result.eligibility, "too_early");
    assert.match(text, /if you achieve around 75%/i);
    assert.match(text, /published/i);
  });

  it("uses cost-first tone, food, and parent WhatsApp slots", () => {
    assert.match(result.lifeCopy, /family/i);
    assert.match(result.lifeCopy, /cost|PLACEHOLDER|tuition/i);
    assert.match(result.lifeCopy, /cook|food|spices/i);
    assert.doesNotMatch(result.lifeCopy, /football/i);

    const whatsapp = parentWhatsApp({
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
    assert.match(whatsapp, /family|Class 12|published/i);
    assert.match(whatsapp, /£500/);
    assert.equal(findForbiddenClaims(whatsapp).length, 0);
    assert.ok(whatsapp.split(/\s+/).length < 120);
  });
});

describe("G-MUM Mumbai graduate", () => {
  const result = match(mumbaiGraduate, catalogue);

  it("matches a one-year management PG and does not remap to UG", () => {
    assert.ok(result.course);
    assert.equal(result.course.level, "postgraduate-taught");
    assert.equal(result.course.subjectFamily, "business");
    assert.equal(result.course.durationYears, 1);
    assert.notEqual(result.course.level, "undergraduate");
    assert.notEqual(result.eligibility, "wrong_level");
    assert.equal(result.eligibility, "appears_to_meet");
  });

  it("gives a father a cost stack and a show-your-father next step", () => {
    assert.equal(typeof result.yearOneCost.tuitionGbp, "number");
    assert.match(result.nextStep, /father/i);
    assert.match(result.lifeCopy, /father|parents/i);
    assert.match(result.lifeCopy, /football|cricket/i);
  });
});

describe("G-T6-1 Class 12 + master’s", () => {
  const result = match(class12Masters, catalogue);

  it("returns wrong_level and does not match an MSc", () => {
    assert.equal(result.eligibility, "wrong_level");
    assert.equal(result.course, null);
    assert.match(result.nextStep, /bachelor/i);
    assert.match(facing(result), /not a silent switch|behind your back/i);
  });
});

describe("G-T6-2 marks below requirement", () => {
  const cs = courseById("bsc-computer-science");
  const min = numericMin(cs);
  const profile: StudentProfile = { ...studentA, marksPercent: min - 5 };
  const result = match(profile, catalogue);

  it("still shows the course as below_requirement", () => {
    assert.ok(result.course);
    assert.equal(result.course.subjectFamily, "computing");
    assert.equal(result.eligibility, "below_requirement");
    assert.match(facing(result), new RegExp(String(min)));
    assert.match(result.nextStep, /not a prize for low marks/i);
  });
});

describe("G-T6-3 B.Com → computing master’s", () => {
  const result = match(bcomComputingMasters, catalogue);

  it("returns subject_gap on a computing master’s, not appears_to_meet", () => {
    assert.ok(result.course);
    assert.equal(result.course.level, "postgraduate-taught");
    assert.equal(result.course.subjectFamily, "computing");
    assert.equal(result.eligibility, "subject_gap");
    assert.notEqual(result.eligibility, "appears_to_meet");
    assert.match(facing(result), /not a silent remap|adviser/i);
  });
});

describe("EC-ELIG-01 marks exactly on the threshold", () => {
  it("is appears_to_meet", () => {
    const cs = courseById("bsc-computer-science");
    const min = numericMin(cs);
    const result = match({ ...studentA, marksPercent: min }, catalogue);
    assert.equal(result.eligibility, "appears_to_meet");
  });
});

describe("EC-ELIG-05 bad marks", () => {
  it("rejects 0, 101 and non-finite values", () => {
    assert.equal(isValidMarksPercent(0), false);
    assert.equal(isValidMarksPercent(101), false);
    assert.equal(isValidMarksPercent(Number.NaN), false);
    assert.equal(isValidMarksPercent(82), true);
  });

  it("returns unknown and does not crash", () => {
    const high = match({ ...studentA, marksPercent: 101 }, catalogue);
    assert.equal(high.eligibility, "unknown");
    const zero = match({ ...studentA, marksPercent: 0 }, catalogue);
    assert.equal(zero.eligibility, "unknown");
  });
});

describe("EC-ELIG-04 graduate who picks a bachelor’s", () => {
  it("matches UG and does not auto-switch to a master’s", () => {
    const profile: StudentProfile = {
      ...mumbaiGraduate,
      level: "undergraduate",
      subjectInterest: "engineering",
    };
    const result = match(profile, catalogue);
    assert.ok(result.course);
    assert.equal(result.course.level, "undergraduate");
    assert.match(facing(result), /already hold a bachelor/i);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { studentFacingText } from "./copy";
import {
  EVAL_AS_OF,
  class12Masters,
  mumbaiGraduate,
  studentA,
} from "./fixtures/gold";
import { loadCatalogue } from "../data/loadCatalogue";
import { match } from "./match";
import { rankLead } from "./priority";
import type { StudentProfile } from "./types";

const catalogue = loadCatalogue();

describe("adviser priority", () => {
  it("ranks Student A with consent as priority 1", () => {
    const result = match(studentA, catalogue);
    const rank = rankLead({
      profile: studentA,
      match: result,
      consentWhatsapp: true,
      asOf: EVAL_AS_OF,
    });
    assert.equal(rank.priority, 1);
    assert.ok(rank.reasons.length > 0);
  });

  it("ranks a wrong-level bounce with no consent as priority 3", () => {
    const result = match(class12Masters, catalogue);
    const rank = rankLead({
      profile: class12Masters,
      match: result,
      consentWhatsapp: false,
      asOf: EVAL_AS_OF,
    });
    assert.equal(rank.priority, 3);
    assert.match(rank.reasons.join(" "), /consent/i);
  });

  it("ranks close-but-below Class 12 as medium, not the same as a far-below graduate", () => {
    const cs = catalogue.courses.find((item) => item.id === "bsc-computer-science");
    assert.ok(cs);
    assert.equal(typeof cs.indiaEntry.minPercent, "number");
    const min = cs.indiaEntry.minPercent as number;

    const class12Below: StudentProfile = {
      level: "undergraduate",
      educationStage: "class-12-current",
      boardOrDegree: "CBSE",
      marksPercent: min - 2,
      subjectInterest: "computing",
      interests: ["other"],
    };
    const class12BelowMatch = match(class12Below, catalogue);
    const class12BelowRank = rankLead({
      profile: class12Below,
      match: {
        ...class12BelowMatch,
        eligibility: "below_requirement",
      },
      consentWhatsapp: true,
      asOf: EVAL_AS_OF,
    });
    assert.equal(class12BelowRank.priority, 2);

    const farGraduate: StudentProfile = {
      ...mumbaiGraduate,
      subjectInterest: "computing",
      boardOrDegree: "B.Com",
      marksPercent: min - 20,
      level: "undergraduate",
    };
    const farMatch = match(farGraduate, catalogue);
    const farRank = rankLead({
      profile: {
        ...farGraduate,
        educationStage: "graduate",
        level: "postgraduate-taught",
        marksPercent: 30,
      },
      match: {
        ...farMatch,
        eligibility: "below_requirement",
      },
      consentWhatsapp: true,
      asOf: EVAL_AS_OF,
    });
    assert.equal(farRank.priority, 3);
  });

  it("never puts the rank in student-facing copy", () => {
    const result = match(studentA, catalogue);
    const rank = rankLead({
      profile: studentA,
      match: result,
      consentWhatsapp: true,
      asOf: EVAL_AS_OF,
    });
    const text = studentFacingText({
      lifeCopy: result.lifeCopy,
      nextStep: result.nextStep,
      reasons: result.reasons,
      disclaimers: result.disclaimers,
      scholarshipNote: result.scholarshipEstimate.note,
    });
    assert.doesNotMatch(text, /priority 1/i);
    assert.doesNotMatch(text, /hot lead/i);
    assert.ok(rank.priority === 1);
  });
});

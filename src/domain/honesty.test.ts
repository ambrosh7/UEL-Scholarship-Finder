import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { studentFacingText } from "./copy";
import {
  bcomComputingMasters,
  class12Masters,
  mumbaiGraduate,
  studentA,
  studentB,
} from "./fixtures/gold";
import {
  assertHonest,
  findForbiddenClaims,
} from "./honesty";
import { loadCatalogue } from "../data/loadCatalogue";
import { match } from "./match";
import { HOME_POSTGRADUATE_SCHOLARSHIP } from "./scholarship";

const catalogue = loadCatalogue();

const CORPUS_FAILS: Array<{ id: string; text: string }> = [
  { id: "place", text: "You have a place at UEL." },
  { id: "youre-in", text: "You're in." },
  { id: "personal-award", text: "You will get £2,000." },
  { id: "your-scholarship", text: "Your scholarship is £5,000." },
  { id: "visa", text: "You will get a visa." },
  { id: "uk-job", text: "You will get a UK job." },
  { id: "employed", text: "92% employed." },
  { id: "limited-seats", text: "Limited seats. Apply now." },
  { id: "only-left", text: "Only 3 left." },
  { id: "home-pg", text: HOME_POSTGRADUATE_SCHOLARSHIP },
];

const CORPUS_ALLOWED = [
  "You appear to meet the published requirements.",
  "International scholarships are typically £500–£5,000, decided by UEL, confirmed in an offer letter.",
  "Estimates for 2026/27. PLACEHOLDER — confirm on GOV.UK / UEL.",
  "Some graduates look for work in the UK; that is not guaranteed.",
];

describe("honesty corpus", () => {
  it("fails forbidden claims", () => {
    for (const row of CORPUS_FAILS) {
      const hits = findForbiddenClaims(row.text);
      assert.ok(
        hits.length > 0,
        `${row.id} should fail honesty: ${row.text}`,
      );
      assert.throws(() => assertHonest(row.text));
    }
  });

  it("allows honest phrasing", () => {
    for (const text of CORPUS_ALLOWED) {
      assert.equal(findForbiddenClaims(text).length, 0);
      assert.equal(assertHonest(text), text);
    }
  });
});

describe("generated match copy is honest", () => {
  const profiles = [
    studentA,
    studentB,
    mumbaiGraduate,
    class12Masters,
    bcomComputingMasters,
  ];

  for (const profile of profiles) {
    it(`passes for ${profile.city ?? profile.boardOrDegree} / ${profile.level}`, () => {
      const result = match(profile, catalogue);
      const text = studentFacingText({
        lifeCopy: result.lifeCopy,
        nextStep: result.nextStep,
        reasons: result.reasons,
        disclaimers: result.disclaimers,
        scholarshipNote: result.scholarshipEstimate.note,
      });
      assert.equal(findForbiddenClaims(text).length, 0);
      assert.doesNotMatch(text, /limited seats/i);
      assert.doesNotMatch(text, /50% postgraduate scholarship/i);
      assert.doesNotMatch(text, /\bpriority\b/i);
      assert.doesNotMatch(text, /hot lead/i);
    });
  }
});

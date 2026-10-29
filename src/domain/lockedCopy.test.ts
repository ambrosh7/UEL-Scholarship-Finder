import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadCatalogue } from "../data/loadCatalogue";
import { studentA, studentB } from "./fixtures/gold";
import { findForbiddenClaims } from "./honesty";
import { loadLockedCopy, wordCount } from "./lockedCopy";
import { match } from "./match";

const catalogue = loadCatalogue();
const pageA = loadLockedCopy("results-a.md");
const pageB = loadLockedCopy("results-b.md");
const whatsappB = loadLockedCopy("whatsapp-b.md");

describe("Task 4 locked copy", () => {
  it("keeps Student A under 300 words with football, loan, and a range", () => {
    const n = wordCount(pageA.onScreen);
    assert.ok(n < 300, `Student A is ${n} words`);
    assert.match(pageA.onScreen, /Computing in London, with football on the weekends/);
    assert.match(pageA.onScreen, /Computer Science BSc \(Hons\)/);
    assert.match(pageA.onScreen, /appear to meet the published entry requirements/);
    assert.match(pageA.onScreen, /£16,020/);
    assert.match(pageA.onScreen, /£500/);
    assert.match(pageA.onScreen, /£5,000/);
    assert.match(pageA.onScreen, /football/i);
    assert.match(pageA.onScreen, /loan/i);
    assert.match(pageA.onScreen, /Hyderabad/);
    assert.doesNotMatch(pageA.onScreen, /cook|food and cooking/i);
    assert.match(pageA.onScreen, /Talk to an adviser/);
    assert.match(pageA.onScreen, /not guaranteed/);
  });

  it("keeps Student B under 300 words with food, family, and too_early", () => {
    const n = wordCount(pageB.onScreen);
    assert.ok(n < 300, `Student B is ${n} words`);
    assert.match(pageB.onScreen, /plan with your family/);
    assert.match(pageB.onScreen, /Business Management BSc \(Hons\)/);
    assert.match(pageB.onScreen, /you apply when results are in/);
    assert.match(pageB.onScreen, /around 75%/);
    assert.match(pageB.onScreen, /cook|spices/);
    assert.match(pageB.onScreen, /family will decide together/);
    assert.match(pageB.onScreen, /Forward this to your parents/);
    assert.doesNotMatch(pageB.onScreen, /football/i);
  });

  it("keeps WhatsApp B under 120 words and forwardable", () => {
    const n = wordCount(whatsappB.onScreen);
    assert.ok(n < 120, `WhatsApp B is ${n} words`);
    assert.match(whatsappB.onScreen, /Business Management BSc \(Hons\)/);
    assert.match(whatsappB.onScreen, /£16,020/);
    assert.match(whatsappB.onScreen, /£500/);
    assert.match(whatsappB.onScreen, /not an offer/i);
    assert.doesNotMatch(whatsappB.onScreen, /weekends playing football/i);
  });

  it("puts honesty next to the scholarship, not only at the end", () => {
    for (const page of [pageA, pageB]) {
      const scholarshipAt = page.onScreen.search(/£500/);
      const honestyAt = page.onScreen.search(/This is not an offer/);
      assert.ok(scholarshipAt >= 0);
      assert.ok(honestyAt >= 0);
      assert.ok(
        Math.abs(honestyAt - scholarshipAt) < 400,
        "Honesty should sit beside the scholarship block",
      );
      const lastThird = page.onScreen.slice(Math.floor(page.onScreen.length * 0.66));
      assert.doesNotMatch(
        lastThird,
        /^[\s\S]*This is not an offer[\s\S]*$This is not an offer/,
      );
    }
  });

  it("passes the honesty corpus on student-facing copy", () => {
    for (const text of [pageA.onScreen, pageB.onScreen, whatsappB.onScreen]) {
      assert.equal(findForbiddenClaims(text).length, 0);
    }
  });

  it("agrees with match() on course, eligibility, fee, and range", () => {
    const a = match(studentA, catalogue);
    assert.equal(a.course?.id, pageA.meta.courseId);
    assert.equal(a.course?.title, pageA.meta.courseTitle);
    assert.equal(a.eligibility, pageA.meta.eligibility);
    assert.equal(a.course?.tuitionGbpYearOne, pageA.meta.tuitionGbp);
    assert.equal(a.scholarshipEstimate.amountMinGbp, pageA.meta.scholarshipMinGbp);
    assert.equal(a.scholarshipEstimate.amountMaxGbp, pageA.meta.scholarshipMaxGbp);
    assert.ok(pageA.onScreen.includes(a.course?.title ?? "NO_COURSE"));
    assert.match(pageA.onScreen, /£16,020/);

    const b = match(studentB, catalogue);
    assert.equal(b.course?.id, pageB.meta.courseId);
    assert.equal(b.course?.title, pageB.meta.courseTitle);
    assert.equal(b.eligibility, pageB.meta.eligibility);
    assert.equal(b.course?.tuitionGbpYearOne, pageB.meta.tuitionGbp);
    assert.equal(b.course?.id, whatsappB.meta.courseId);
    assert.equal(b.eligibility, whatsappB.meta.eligibility);
    assert.ok(pageB.onScreen.includes(b.course?.title ?? "NO_COURSE"));
    assert.ok(whatsappB.onScreen.includes(b.course?.title ?? "NO_COURSE"));
  });

  it("has why-it-works notes under each piece", () => {
    for (const notes of [pageA.notes, pageB.notes]) {
      assert.match(notes, /### Headline/);
      assert.match(notes, /### Course/);
      assert.match(notes, /### Scholarship/);
      assert.match(notes, /### First-year cost/);
      assert.match(notes, /### Life in London/);
      assert.match(notes, /### Next step/);
    }
    assert.match(whatsappB.notes, /forward/i);
    assert.doesNotMatch(pageA.notes, /^This page has a headline/);
  });

  it("keeps PLACEHOLDER lines and the dated RBI snapshot", () => {
    for (const text of [pageA.onScreen, pageB.onScreen]) {
      assert.match(text, /PLACEHOLDER/);
      assert.match(text, /126\.4657/);
      assert.match(text, /2026\/27/);
      assert.match(text, /GOV\.UK/);
    }
  });
});

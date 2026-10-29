import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { loadCatalogue } from "../data/loadCatalogue";
import { eligibilitySentence, resultsHeadline } from "./copy";
import { loadLockedCopy } from "./lockedCopy";
import { match, publishedMinPercent } from "./match";
import { GOLD_ANSWERS, LANDING, profileFromAnswers } from "./questions";

const pack = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../../docs/written-pack.md"),
  "utf8",
);

const catalogue = loadCatalogue();
const pageA = loadLockedCopy("results-a.md");
const pageB = loadLockedCopy("results-b.md");
const whatsappB = loadLockedCopy("whatsapp-b.md");

describe("Phase 6 written pack", () => {
  it("holds Tasks 1, 3, 4 and 6 in one document", () => {
    assert.match(pack, /^# UEL Fit & Scholarship Finder/m);
    assert.match(pack, /## Task 1 — Understanding the student/);
    assert.match(pack, /## Task 3 — The questions/);
    assert.match(pack, /## Task 4 — The results page/);
    assert.match(pack, /## Task 6 — Judgement/);
  });

  it("keeps landing wording and the prototype six", () => {
    assert.match(pack, new RegExp(LANDING.headline.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(pack, /Which qualification are you considering\?/);
    assert.match(pack, /What is your current stage of study\?/);
    assert.match(pack, /Which subject are you considering\?/);
    assert.match(pack, /What do you enjoy outside your studies\?/);
    assert.match(pack, /Who will decide whether you apply\?/);
    assert.match(pack, /How would the first year be funded\?/);
    assert.match(pack, /I will decide, if my parents agree to fund it/);
    assert.match(pack, /Not yet decided/);
  });

  it("embeds the locked Task 4 pages without contradicting match()", () => {
    assert.match(pack, /Computing in London, with football on the weekends/);
    assert.match(pack, /A business degree to plan with your family, before results are in/);
    assert.ok(pack.includes(pageA.onScreen.split("\n")[0] ?? ""));
    assert.match(pack, new RegExp(pageA.meta.courseTitle.replace(/[()]/g, "\\$&")));
    assert.match(pack, new RegExp(pageB.meta.courseTitle.replace(/[()]/g, "\\$&")));
    assert.match(pack, /I looked at UEL/);
    assert.match(whatsappB.onScreen, /not an offer/i);
  });

  it("describes Task 6 from live match(), not a new design", () => {
    const t61 = match(profileFromAnswers(GOLD_ANSWERS.class12Masters), catalogue);
    const t62 = match(
      profileFromAnswers({ ...GOLD_ANSWERS.studentA, marksPercent: 55 }),
      catalogue,
    );
    const t63 = match(
      profileFromAnswers(GOLD_ANSWERS.bcomComputingMasters),
      catalogue,
    );
    const parent = match(profileFromAnswers(GOLD_ANSWERS.studentB), catalogue);

    assert.equal(t61.eligibility, "wrong_level");
    assert.equal(t61.course, null);
    assert.match(
      pack,
      new RegExp(
        resultsHeadline({
          profile: profileFromAnswers(GOLD_ANSWERS.class12Masters),
          course: t61.course,
          eligibility: t61.eligibility,
        }).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      ),
    );

    assert.equal(t62.eligibility, "below_requirement");
    assert.ok(t62.course);
    const min =
      t62.course && typeof publishedMinPercent(t62.course, profileFromAnswers({ ...GOLD_ANSWERS.studentA, marksPercent: 55 })) === "number"
        ? (publishedMinPercent(
            t62.course,
            profileFromAnswers({ ...GOLD_ANSWERS.studentA, marksPercent: 55 }),
          ) as number)
        : null;
    assert.match(
      pack,
      new RegExp(
        eligibilitySentence(
          t62.eligibility,
          t62.course,
          profileFromAnswers({ ...GOLD_ANSWERS.studentA, marksPercent: 55 }),
          min,
        ).slice(0, 40).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      ),
    );

    assert.equal(t63.eligibility, "subject_gap");
    assert.match(pack, /Computing at master’s level needs a computing background/);
    assert.match(pack, /Data Science MSc/);

    assert.equal(parent.eligibility, "too_early");
    assert.match(pack, /\{Name\} sent you this|sent you this/);
    assert.match(pack, /No second form/);
  });

  it("does not treat the prototype as inventing city or a UK job", () => {
    assert.match(pack, /does not add “From Hyderabad”/);
    assert.match(pack, /UK-work sentence/);
  });
});

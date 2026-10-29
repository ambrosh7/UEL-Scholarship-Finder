import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GOLD_ANSWERS } from "../domain/questions";
import { completeProfile, firstIncompleteStep } from "./profile";

describe("wizard profile", () => {
  it("does not invent city or career from the prototype six answers", () => {
    const profile = completeProfile({ ...GOLD_ANSWERS.studentA });
    assert.ok(profile);
    assert.equal(profile.city, undefined);
    assert.equal(profile.careerHope, undefined);
  });

  it("sends an incomplete money screen back to step 6", () => {
    assert.equal(
      firstIncompleteStep({
        ...GOLD_ANSWERS.studentA,
        funding: undefined,
      }),
      6,
    );
    assert.equal(firstIncompleteStep({}), 1);
  });
});

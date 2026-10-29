import { isValidMarksPercent } from "@/domain/match";
import { profileFromAnswers, type WizardAnswers } from "@/domain/questions";
import type { PartialAnswers } from "./session";

export function answersAreComplete(
  answers: PartialAnswers,
): answers is WizardAnswers {
  return (
    answers.level !== undefined &&
    answers.educationStage !== undefined &&
    answers.subjectInterest !== undefined &&
    typeof answers.marksPercent === "number" &&
    isValidMarksPercent(answers.marksPercent) &&
    Boolean(answers.boardOrDegree) &&
    Array.isArray(answers.interests) &&
    answers.interests.length > 0 &&
    answers.decisionMaker !== undefined &&
    answers.funding !== undefined
  );
}

export function completeProfile(answers: PartialAnswers) {
  if (!answersAreComplete(answers)) return null;
  return profileFromAnswers(answers);
}

export function firstIncompleteStep(
  answers: PartialAnswers,
): 1 | 2 | 3 | 4 | 5 | 6 {
  if (!answers.level) return 1;
  if (!answers.educationStage) return 2;
  if (!answers.subjectInterest) return 3;
  if (
    typeof answers.marksPercent !== "number" ||
    !isValidMarksPercent(answers.marksPercent) ||
    !answers.boardOrDegree
  ) {
    return 4;
  }
  if (!answers.interests?.[0]) return 5;
  if (!answers.decisionMaker || !answers.funding) return 6;
  return 6;
}

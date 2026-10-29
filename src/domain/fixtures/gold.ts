import type { StudentProfile } from "../types";

/** G-A / EC-FIX-01 — Hyderabad, computing UG, football, loan. */
export const studentA: StudentProfile = {
  level: "undergraduate",
  educationStage: "school-finished",
  boardOrDegree: "CBSE",
  marksPercent: 82,
  subjectInterest: "computing",
  city: "Hyderabad",
  interests: ["football"],
  careerHope: "work-in-uk",
  funding: "loan",
  decisionMaker: "self",
};

/** G-B / EC-FIX-02 — Kochi, still Class 12, business, food, family. */
export const studentB: StudentProfile = {
  level: "undergraduate",
  educationStage: "class-12-current",
  boardOrDegree: "CBSE",
  marksPercent: 75,
  subjectInterest: "business",
  city: "Kochi",
  interests: ["food"],
  funding: "family",
  decisionMaker: "family",
};

/** G-MUM / EC-FIX-03 — Mumbai engineering graduate, business master’s. */
export const mumbaiGraduate: StudentProfile = {
  level: "postgraduate-taught",
  educationStage: "graduate",
  boardOrDegree: "B.E. Mechanical",
  marksPercent: 72,
  subjectInterest: "business",
  city: "Mumbai",
  interests: ["football", "cricket"],
  careerHope: "work-in-uk",
  funding: "unsure",
  decisionMaker: "self-if-parents-pay",
};

/** G-T6-1 / EC-T6-01 — Class 12 who picks a master’s. */
export const class12Masters: StudentProfile = {
  level: "postgraduate-taught",
  educationStage: "class-12-current",
  boardOrDegree: "CBSE",
  marksPercent: 80,
  subjectInterest: "business",
  city: "Pune",
  interests: ["other"],
};

/** G-T6-3 / EC-T6-03 — B.Com graduate wanting a computing master’s. */
export const bcomComputingMasters: StudentProfile = {
  level: "postgraduate-taught",
  educationStage: "graduate",
  boardOrDegree: "B.Com",
  marksPercent: 65,
  subjectInterest: "computing",
  city: "Ahmedabad",
  interests: ["other"],
};

export const EVAL_AS_OF = new Date("2026-10-28T12:00:00Z");

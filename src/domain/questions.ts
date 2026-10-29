/**
 * Frozen on-screen wording for Task 3 / Phase 5.
 * Must stay in lockstep with docs/questions.md.
 * No screen may use a string that is not in that file.
 */

import type {
  CareerHope,
  DecisionMaker,
  EducationStage,
  Funding,
  LifeInterest,
  StudentProfile,
  SubjectFamily,
} from "./types";

export const LANDING = {
  headline: "See what a UEL scholarship could mean for your first year in London.",
  subline:
    "A short set of questions on your phone. This is not an application. This is not an offer.",
  honesty: "UEL decides any place and any scholarship.",
  button: "Start",
} as const;

export const SCREEN_HEADINGS = {
  money: "Decision and funding",
} as const;

export const BUTTONS = {
  continue: "Continue",
  seeMyResult: "View my result",
  unlockFullResult: "View the full result",
  showMyResult: "View my result",
  forwardToParents: "Share with your parents",
  talkToAdviser: "Speak with an adviser",
  showFather: "Share with your father",
  done: "Done",
} as const;

export const TEASER = {
  heading: "Your course match is ready.",
  scholarshipLine:
    "An international scholarship of £500–£5,000 may apply. UEL decides the amount, in an offer letter.",
  honesty: "This is not an offer.",
  wrongLevelLine:
    "A master’s needs a bachelor’s. We have not matched you to a master’s course.",
  button: BUTTONS.unlockFullResult,
} as const;

export const GATE = {
  heading: "Your result is ready.",
  subline:
    "Enter your name and an Indian mobile number to see the full year-one picture.",
  nameLabel: "Full name",
  phoneLabel: "Indian mobile number",
  phonePlaceholder: "98765 43210",
  phonePrefix: "+91",
  consentWhatsapp: "Contact me on WhatsApp about this result.",
  consentShareWithUel: "UEL can use my details to continue the conversation.",
  button: BUTTONS.showMyResult,
} as const;

export const THANKS = {
  heading: "What happens next",
  weWill:
    "We will WhatsApp you if you asked us to. An adviser may call if you look likely to apply, or if you need to apply soon.",
  weWillNot:
    "We will not promise a place, a scholarship amount, a visa, or a job.",
  uel: "Nothing has been sent to UEL unless you said they can use your details.",
  button: BUTTONS.done,
} as const;

export const MARKS_WORDING = {
  "class-12-current": "What percentage do you expect in Class 12?",
  "school-finished": "What overall percentage did you achieve in Class 12?",
  graduate: "What overall percentage did you achieve in your bachelor’s degree?",
} as const;

export const MARKS_HELPER =
  "Enter the overall percentage as shown on your marksheet." as const;

export const FUNDING_HELPER =
  "If cost is a concern at home, we still show the full picture — including PLACEHOLDER lines — not a reduced figure that later falls apart." as const;

export type Option<Value extends string = string> = {
  label: string;
  value: Value;
  prototype?: boolean;
};

export const LEVEL_OPTIONS = [
  { label: "Bachelor’s degree", value: "undergraduate" },
  { label: "Master’s degree", value: "postgraduate-taught" },
] as const satisfies readonly Option[];

export const STAGE_OPTIONS = [
  { label: "Currently in Class 12", value: "class-12-current" },
  { label: "Completed Class 12", value: "school-finished" },
  { label: "Graduate", value: "graduate" },
] as const satisfies readonly Option[];

export const SUBJECT_OPTIONS = [
  { label: "Business / Management", value: "business", prototype: true },
  { label: "Computer Science", value: "computing", prototype: true },
  { label: "Engineering", value: "engineering", prototype: false },
  { label: "Law", value: "law", prototype: false },
  { label: "Psychology", value: "other", prototype: false },
  { label: "A different subject", value: "other", prototype: true },
] as const satisfies readonly Option[];

export const BOARD_OPTIONS = [
  { label: "CBSE", value: "CBSE" },
  { label: "ISC / CISCE", value: "ISC" },
  { label: "Kerala State Board", value: "Kerala state board" },
  { label: "Another State Board", value: "state board" },
  { label: "A different board", value: "other board" },
] as const satisfies readonly Option[];

export const DEGREE_OPTIONS = [
  { label: "Engineering (B.E. / B.Tech)", value: "B.E." },
  { label: "Commerce (B.Com)", value: "B.Com" },
  { label: "Computing and IT", value: "Computer Science" },
  { label: "Another bachelor’s subject", value: "bachelor" },
] as const satisfies readonly Option[];

export const INTEREST_OPTIONS = [
  { label: "Football", value: "football" },
  { label: "Cricket", value: "cricket" },
  { label: "Food and cooking", value: "food" },
  { label: "A different interest", value: "other" },
] as const satisfies readonly Option[];

export const CITY_OPTIONS = [
  { label: "Mumbai", value: "Mumbai" },
  { label: "Hyderabad", value: "Hyderabad" },
  { label: "Kochi", value: "Kochi" },
  { label: "A different city", value: "__other__" },
  { label: "Prefer not to say", value: "__skip__" },
] as const satisfies readonly Option[];

export const CAREER_OPTIONS = [
  {
    label: "I hope to work in the UK after graduation",
    value: "work-in-uk",
  },
  { label: "I hope to return to India", value: "return-home" },
  { label: "Travel", value: "travel" },
  { label: "Work–life balance", value: "balance" },
  { label: "Not sure yet", value: "undecided" },
] as const satisfies readonly Option[];

export const DECIDE_OPTIONS = [
  { label: "I will decide", value: "self" },
  { label: "My family will decide", value: "family" },
  {
    label: "I will decide, if my parents agree to fund it",
    value: "self-if-parents-pay",
  },
] as const satisfies readonly Option[];

export const FUNDING_OPTIONS = [
  { label: "Education loan", value: "loan" },
  { label: "Family funding", value: "family" },
  { label: "Not yet decided", value: "unsure" },
] as const satisfies readonly Option[];

export const START_OPTIONS = [
  { label: "January 2027", value: "2027-01" },
  { label: "September 2027", value: "2027-09" },
  { label: "Not sure yet", value: "__skip__" },
] as const satisfies readonly Option[];

export const MATHS_OPTIONS = [
  { label: "Yes, 50% or above", value: "maths-met" },
  { label: "Yes, below 50%", value: "maths-below" },
  { label: "No, or not sure", value: "maths-unknown" },
] as const satisfies readonly Option[];

export const QUESTIONS = [
  {
    id: "q-level",
    prototype: true,
    screen: 1,
    wording: "Which qualification are you considering?",
    format: "choose-one",
    audience: "everyone",
    options: LEVEL_OPTIONS,
  },
  {
    id: "q-stage",
    prototype: true,
    screen: 2,
    wording: "What is your current stage of study?",
    format: "choose-one",
    audience: "everyone",
    options: STAGE_OPTIONS,
  },
  {
    id: "q-subject",
    prototype: true,
    screen: 3,
    wording: "Which subject are you considering?",
    format: "choose-one",
    audience: "everyone",
    options: SUBJECT_OPTIONS,
  },
  {
    id: "q-marks",
    prototype: true,
    screen: 4,
    wordingByStage: MARKS_WORDING,
    helper: MARKS_HELPER,
    format: "typed",
    audience: "everyone",
  },
  {
    id: "q-board",
    prototype: true,
    screen: 4,
    wording: "Which examination board?",
    format: "dropdown",
    audience: "class-12-or-finished",
    options: BOARD_OPTIONS,
  },
  {
    id: "q-degree",
    prototype: true,
    screen: 4,
    wording: "What was the subject of your bachelor’s degree?",
    format: "dropdown",
    audience: "graduate",
    options: DEGREE_OPTIONS,
  },
  {
    id: "q-interest",
    prototype: true,
    screen: 5,
    wording: "What do you enjoy outside your studies?",
    format: "choose-one",
    audience: "everyone",
    options: INTEREST_OPTIONS,
  },
  {
    id: "q-city",
    prototype: false,
    screen: 5,
    wording: "Where in India are you based?",
    format: "choose-one",
    audience: "everyone",
    options: CITY_OPTIONS,
  },
  {
    id: "q-career",
    prototype: false,
    screen: 5,
    wording: "What do you hope this degree leads to?",
    format: "choose-one",
    audience: "everyone",
    options: CAREER_OPTIONS,
  },
  {
    id: "q-decide",
    prototype: true,
    screen: 6,
    wording: "Who will decide whether you apply?",
    format: "choose-one",
    audience: "everyone",
    options: DECIDE_OPTIONS,
  },
  {
    id: "q-funding",
    prototype: true,
    screen: 6,
    wording: "How would the first year be funded?",
    helper: FUNDING_HELPER,
    format: "choose-one",
    audience: "everyone",
    options: FUNDING_OPTIONS,
  },
  {
    id: "q-start",
    prototype: false,
    screen: 7,
    wording: "When would you prefer to start?",
    format: "choose-one",
    audience: "everyone",
    options: START_OPTIONS,
  },
  {
    id: "q-maths",
    prototype: false,
    screen: 8,
    wording: "Did you study Mathematics in Class 12? Some of these courses require it.",
    format: "choose-one",
    audience: "computing-or-engineering-ug",
    options: MATHS_OPTIONS,
  },
] as const;

export type QuestionId = (typeof QUESTIONS)[number]["id"];

export function questionWording(id: QuestionId): string {
  const question = QUESTIONS.find((item) => item.id === id);
  if (!question || !("wording" in question)) {
    throw new Error(`No on-screen wording for ${id}`);
  }
  return question.wording;
}

export const PROTOTYPE_QUESTION_IDS = [
  "q-level",
  "q-stage",
  "q-subject",
  "q-marks",
  "q-interest",
  "q-decide",
] as const;

export const UTM_EXAMPLE =
  "/?utm_source=instagram&utm_medium=reel&utm_campaign=reel-april&utm_content=creator-priya";

export type WizardAnswers = {
  level: StudentProfile["level"];
  educationStage: EducationStage;
  marksPercent: number;
  subjectInterest: SubjectFamily;
  boardOrDegree: string;
  interests: LifeInterest[];
  decisionMaker: DecisionMaker;
  funding: Funding;
  city?: string;
  careerHope?: CareerHope;
  startPreference?: string;
};

export function profileFromAnswers(answers: WizardAnswers): StudentProfile {
  const profile: StudentProfile = {
    level: answers.level,
    educationStage: answers.educationStage,
    boardOrDegree: answers.boardOrDegree,
    marksPercent: answers.marksPercent,
    subjectInterest: answers.subjectInterest,
    interests: answers.interests,
    funding: answers.funding,
    decisionMaker: answers.decisionMaker,
  };
  if (answers.city) profile.city = answers.city;
  if (answers.careerHope) profile.careerHope = answers.careerHope;
  if (answers.startPreference) profile.startPreference = answers.startPreference;
  return profile;
}

/** Exact prototype-six answers for the Task 4 / Task 6 fixtures. */
export const GOLD_ANSWERS = {
  studentA: {
    level: "undergraduate",
    educationStage: "school-finished",
    subjectInterest: "computing",
    marksPercent: 82,
    boardOrDegree: "CBSE",
    interests: ["football"],
    decisionMaker: "self",
    funding: "loan",
  },
  studentB: {
    level: "undergraduate",
    educationStage: "class-12-current",
    subjectInterest: "business",
    marksPercent: 75,
    boardOrDegree: "CBSE",
    interests: ["food"],
    decisionMaker: "family",
    funding: "family",
  },
  mumbaiGraduate: {
    level: "postgraduate-taught",
    educationStage: "graduate",
    subjectInterest: "business",
    marksPercent: 72,
    boardOrDegree: "B.E.",
    interests: ["football"],
    decisionMaker: "self-if-parents-pay",
    funding: "unsure",
  },
  class12Masters: {
    level: "postgraduate-taught",
    educationStage: "class-12-current",
    subjectInterest: "business",
    marksPercent: 80,
    boardOrDegree: "CBSE",
    interests: ["other"],
    decisionMaker: "self",
    funding: "unsure",
  },
  bcomComputingMasters: {
    level: "postgraduate-taught",
    educationStage: "graduate",
    subjectInterest: "computing",
    marksPercent: 65,
    boardOrDegree: "B.Com",
    interests: ["other"],
    decisionMaker: "self",
    funding: "unsure",
  },
} as const satisfies Record<string, WizardAnswers>;

export function studentFacingQuestionCopy(): string {
  const chunks: string[] = [
    LANDING.headline,
    LANDING.subline,
    LANDING.honesty,
    LANDING.button,
    SCREEN_HEADINGS.money,
    TEASER.heading,
    TEASER.scholarshipLine,
    TEASER.honesty,
    TEASER.wrongLevelLine,
    GATE.heading,
    GATE.subline,
    GATE.nameLabel,
    GATE.phoneLabel,
    GATE.consentWhatsapp,
    GATE.consentShareWithUel,
    THANKS.heading,
    THANKS.weWill,
    THANKS.weWillNot,
    THANKS.uel,
    MARKS_WORDING["class-12-current"],
    MARKS_WORDING["school-finished"],
    MARKS_WORDING.graduate,
    MARKS_HELPER,
    FUNDING_HELPER,
    ...Object.values(BUTTONS),
  ];

  for (const question of QUESTIONS) {
    if ("wording" in question) chunks.push(question.wording);
    if ("helper" in question && question.helper) chunks.push(question.helper);
    if ("options" in question) {
      for (const option of question.options) chunks.push(option.label);
    }
  }

  return chunks.join("\n");
}

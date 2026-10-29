/**
 * Domain types for the UEL Fit & Scholarship Finder.
 * Academic year for this build is 2026/27.
 * Missing facts are PLACEHOLDER — never invented numbers.
 */

export const PLACEHOLDER = "PLACEHOLDER" as const;
export type Placeholder = typeof PLACEHOLDER;

export const ACADEMIC_YEAR = "2026/27" as const;
export type AcademicYear = typeof ACADEMIC_YEAR;

export type SourcedNumber = number | Placeholder;

export type CourseLevel = "undergraduate" | "postgraduate-taught";

export type SubjectFamily =
  | "computing"
  | "business"
  | "engineering"
  | "health"
  | "media"
  | "law"
  | "other";

export type Campus =
  | "Stratford"
  | "Docklands"
  | "University Square Stratford"
  | "unknown";

export type EducationStage = "class-12-current" | "school-finished" | "graduate";

export type LifeInterest = "football" | "cricket" | "food" | "other";

export type CareerHope =
  | "work-in-uk"
  | "return-home"
  | "travel"
  | "balance"
  | "undecided";

export type Funding = "loan" | "family" | "unsure";

export type DecisionMaker = "self" | "family" | "self-if-parents-pay";

export type EligibilityState =
  | "appears_to_meet"
  | "below_requirement"
  | "wrong_level"
  | "subject_gap"
  | "too_early"
  | "unknown";

export type SourceCollector =
  | "scrapy"
  | "live-check"
  | "govuk-spot-check"
  | "rbi";

export const UEL_INTERNATIONAL_SCHOLARSHIP_ID =
  "uel-international-scholarship" as const;

export type IndiaEntry = {
  qualification: "class-12" | "bachelor";
  boards?: string[];
  minPercent: SourcedNumber;
  subjectConditions?: string[];
  notes?: string;
};

export type Course = {
  id: string;
  title: string;
  level: CourseLevel;
  subjectFamily: SubjectFamily;
  campus: Campus;
  durationYears: SourcedNumber;
  tuitionGbpYearOne: SourcedNumber;
  startDates: string[];
  indiaEntry: IndiaEntry;
  extraConditions: string[];
  scholarshipEligible: boolean;
  sourceUrl: string;
  checkedOn: string;
  issues?: string[];
};

export type ScholarshipPolicy = {
  id: typeof UEL_INTERNATIONAL_SCHOLARSHIP_ID;
  amountMinGbp: SourcedNumber;
  amountMaxGbp: SourcedNumber;
  appliesTo: "first-year-tuition";
  autoAssessed: boolean;
  requiresOffer: boolean;
  eligibleLevels: CourseLevel[];
  exclusions: string[];
  sourceUrl: string;
  checkedOn: string;
};

export type CostOfLiving = {
  academicYear: AcademicYear;
  londonLivingGbp: SourcedNumber;
  visaGbp: SourcedNumber;
  ihsGbp: SourcedNumber;
  depositGbp: SourcedNumber;
  accommodationGbp: SourcedNumber;
  flightsGbp: SourcedNumber;
  inrPerGbp: SourcedNumber;
  inrSourceUrl: string;
  notes: string[];
  sourceUrl: string;
  checkedOn: string;
};

export type StudentProfile = {
  level: CourseLevel;
  educationStage: EducationStage;
  boardOrDegree: string;
  marksPercent: number;
  subjectInterest: SubjectFamily;
  city?: string;
  interests: LifeInterest[];
  careerHope?: CareerHope;
  funding?: Funding;
  decisionMaker?: DecisionMaker;
  startPreference?: string;
};

export type LifeSlots = {
  city?: string;
  interest: LifeInterest;
  level: CourseLevel;
  subjectFamily: string;
  careerHope?: CareerHope;
  funding?: Funding;
  decisionMaker?: DecisionMaker;
};

export type ScholarshipEstimate = {
  eligible: boolean;
  amountMinGbp: SourcedNumber;
  amountMaxGbp: SourcedNumber;
  appliesTo: "first-year-tuition";
  autoAssessed: boolean;
  requiresOffer: boolean;
  note?: string;
};

export type YearOneCost = {
  academicYear: AcademicYear;
  tuitionGbp: SourcedNumber;
  scholarshipMinGbp: SourcedNumber;
  scholarshipMaxGbp: SourcedNumber;
  londonLivingGbp: SourcedNumber;
  visaGbp: SourcedNumber;
  ihsGbp: SourcedNumber;
  depositGbp: SourcedNumber;
  accommodationGbp: SourcedNumber;
  flightsGbp: SourcedNumber;
  inrPerGbp: SourcedNumber;
  inrSourceUrl: string;
  inrCheckedOn: string;
};

export type MatchResult = {
  course: Course | null;
  eligibility: EligibilityState;
  reasons: string[];
  scholarshipEstimate: ScholarshipEstimate;
  yearOneCost: YearOneCost;
  lifeCopy: string;
  nextStep: string;
  disclaimers: string[];
};

export type LeadAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  influencerId?: string;
  landingPath: string;
  referrer?: string;
};

export type AdviserPriority = {
  priority: 1 | 2 | 3;
  reasons: string[];
};

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  consentWhatsapp: boolean;
  consentShareWithUel: boolean;
  profile: StudentProfile;
  match: MatchResult;
  attribution: LeadAttribution;
  priority: 1 | 2 | 3;
  priorityReasons: string[];
};

export type SourceRow = {
  field: string;
  value: string;
  url: string;
  checkedOn: string;
  collector: SourceCollector;
  issues: string;
};

export type Catalogue = {
  courses: Course[];
  scholarships: ScholarshipPolicy[];
  costs: CostOfLiving;
};

import {
  ACADEMIC_YEAR,
  PLACEHOLDER,
  UEL_INTERNATIONAL_SCHOLARSHIP_ID,
  type Campus,
  type Catalogue,
  type CostOfLiving,
  type Course,
  type CourseLevel,
  type IndiaEntry,
  type ScholarshipPolicy,
  type SourceCollector,
  type SourceRow,
  type SourcedNumber,
  type SubjectFamily,
} from "../domain/types";

export class CatalogueValidationError extends Error {
  constructor(public readonly path: string, message: string) {
    super(`${path}: ${message}`);
    this.name = "CatalogueValidationError";
  }
}

const COURSE_LEVELS: readonly CourseLevel[] = [
  "undergraduate",
  "postgraduate-taught",
];

const SUBJECT_FAMILIES: readonly SubjectFamily[] = [
  "computing",
  "business",
  "engineering",
  "health",
  "media",
  "law",
  "other",
];

const CAMPUSES: readonly Campus[] = [
  "Stratford",
  "Docklands",
  "University Square Stratford",
  "unknown",
];

const SOURCE_COLLECTORS: readonly SourceCollector[] = [
  "scrapy",
  "live-check",
  "govuk-spot-check",
  "rbi",
];

function fail(path: string, message: string): never {
  throw new CatalogueValidationError(path, message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPlaceholder(value: unknown): value is typeof PLACEHOLDER {
  return value === PLACEHOLDER;
}

function parseSourcedNumber(value: unknown, path: string): SourcedNumber {
  if (isPlaceholder(value)) return PLACEHOLDER;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  fail(path, `expected a number or "${PLACEHOLDER}"`);
}

function parseNonEmptyString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    fail(path, "expected a non-empty string");
  }
  return value;
}

function parseCheckedOn(value: unknown, path: string): string {
  const text = parseNonEmptyString(value, path);
  if (text === PLACEHOLDER) return text;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    fail(path, `expected ISO date YYYY-MM-DD or "${PLACEHOLDER}"`);
  }
  return text;
}

function parseStringArray(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) fail(path, "expected an array of strings");
  return value.map((item, index) =>
    parseNonEmptyString(item, `${path}[${index}]`),
  );
}

function parseOptionalStringArray(
  value: unknown,
  path: string,
): string[] | undefined {
  if (value === undefined) return undefined;
  return parseStringArray(value, path);
}

function parseBoolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") fail(path, "expected a boolean");
  return value;
}

function parseUnion<T extends string>(
  value: unknown,
  path: string,
  allowed: readonly T[],
): T {
  if (typeof value === "string" && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  fail(path, `expected one of ${allowed.join(", ")}`);
}

function parseIndiaEntry(value: unknown, path: string): IndiaEntry {
  if (!isRecord(value)) fail(path, "expected an object");

  const entry: IndiaEntry = {
    qualification: parseUnion(value.qualification, `${path}.qualification`, [
      "class-12",
      "bachelor",
    ]),
    minPercent: parseSourcedNumber(value.minPercent, `${path}.minPercent`),
  };

  if (value.boards !== undefined) {
    entry.boards = parseStringArray(value.boards, `${path}.boards`);
  }
  if (value.subjectConditions !== undefined) {
    entry.subjectConditions = parseStringArray(
      value.subjectConditions,
      `${path}.subjectConditions`,
    );
  }
  if (value.notes !== undefined) {
    entry.notes = parseNonEmptyString(value.notes, `${path}.notes`);
  }

  return entry;
}

export function parseCourse(value: unknown, path: string): Course {
  if (!isRecord(value)) fail(path, "expected an object");

  const course: Course = {
    id: parseNonEmptyString(value.id, `${path}.id`),
    title: parseNonEmptyString(value.title, `${path}.title`),
    level: parseUnion(value.level, `${path}.level`, COURSE_LEVELS),
    subjectFamily: parseUnion(
      value.subjectFamily,
      `${path}.subjectFamily`,
      SUBJECT_FAMILIES,
    ),
    campus: parseUnion(value.campus, `${path}.campus`, CAMPUSES),
    durationYears: parseSourcedNumber(value.durationYears, `${path}.durationYears`),
    tuitionGbpYearOne: parseSourcedNumber(
      value.tuitionGbpYearOne,
      `${path}.tuitionGbpYearOne`,
    ),
    startDates: parseStringArray(value.startDates, `${path}.startDates`),
    indiaEntry: parseIndiaEntry(value.indiaEntry, `${path}.indiaEntry`),
    extraConditions: parseStringArray(
      value.extraConditions,
      `${path}.extraConditions`,
    ),
    scholarshipEligible: parseBoolean(
      value.scholarshipEligible,
      `${path}.scholarshipEligible`,
    ),
    sourceUrl: parseNonEmptyString(value.sourceUrl, `${path}.sourceUrl`),
    checkedOn: parseCheckedOn(value.checkedOn, `${path}.checkedOn`),
  };

  if (value.issues !== undefined) {
    course.issues = parseStringArray(value.issues, `${path}.issues`);
  }

  return course;
}

export function parseCourses(value: unknown): Course[] {
  if (!Array.isArray(value)) fail("courses", "expected an array");
  return value.map((item, index) => parseCourse(item, `courses[${index}]`));
}

export function parseScholarshipPolicy(
  value: unknown,
  path: string,
): ScholarshipPolicy {
  if (!isRecord(value)) fail(path, "expected an object");

  if (value.id !== UEL_INTERNATIONAL_SCHOLARSHIP_ID) {
    fail(
      `${path}.id`,
      `expected "${UEL_INTERNATIONAL_SCHOLARSHIP_ID}"`,
    );
  }

  return {
    id: UEL_INTERNATIONAL_SCHOLARSHIP_ID,
    amountMinGbp: parseSourcedNumber(value.amountMinGbp, `${path}.amountMinGbp`),
    amountMaxGbp: parseSourcedNumber(value.amountMaxGbp, `${path}.amountMaxGbp`),
    appliesTo: parseUnion(value.appliesTo, `${path}.appliesTo`, [
      "first-year-tuition",
    ]),
    autoAssessed: parseBoolean(value.autoAssessed, `${path}.autoAssessed`),
    requiresOffer: parseBoolean(value.requiresOffer, `${path}.requiresOffer`),
    eligibleLevels: (() => {
      if (!Array.isArray(value.eligibleLevels)) {
        fail(`${path}.eligibleLevels`, "expected an array");
      }
      return value.eligibleLevels.map((item, index) =>
        parseUnion(
          item,
          `${path}.eligibleLevels[${index}]`,
          COURSE_LEVELS,
        ),
      );
    })(),
    exclusions: parseStringArray(value.exclusions, `${path}.exclusions`),
    sourceUrl: parseNonEmptyString(value.sourceUrl, `${path}.sourceUrl`),
    checkedOn: parseCheckedOn(value.checkedOn, `${path}.checkedOn`),
  };
}

export function parseScholarships(value: unknown): ScholarshipPolicy[] {
  if (!Array.isArray(value)) fail("scholarships", "expected an array");
  return value.map((item, index) =>
    parseScholarshipPolicy(item, `scholarships[${index}]`),
  );
}

export function parseCostOfLiving(value: unknown): CostOfLiving {
  const path = "costs";
  if (!isRecord(value)) fail(path, "expected an object");

  if (value.academicYear !== ACADEMIC_YEAR) {
    fail(`${path}.academicYear`, `expected "${ACADEMIC_YEAR}"`);
  }

  return {
    academicYear: ACADEMIC_YEAR,
    londonLivingGbp: parseSourcedNumber(
      value.londonLivingGbp,
      `${path}.londonLivingGbp`,
    ),
    visaGbp: parseSourcedNumber(value.visaGbp, `${path}.visaGbp`),
    ihsGbp: parseSourcedNumber(value.ihsGbp, `${path}.ihsGbp`),
    depositGbp: parseSourcedNumber(value.depositGbp, `${path}.depositGbp`),
    accommodationGbp: parseSourcedNumber(
      value.accommodationGbp,
      `${path}.accommodationGbp`,
    ),
    flightsGbp: parseSourcedNumber(value.flightsGbp, `${path}.flightsGbp`),
    inrPerGbp: parseSourcedNumber(value.inrPerGbp, `${path}.inrPerGbp`),
    inrSourceUrl: parseNonEmptyString(value.inrSourceUrl, `${path}.inrSourceUrl`),
    notes: parseOptionalStringArray(value.notes, `${path}.notes`) ?? [],
    sourceUrl: parseNonEmptyString(value.sourceUrl, `${path}.sourceUrl`),
    checkedOn: parseCheckedOn(value.checkedOn, `${path}.checkedOn`),
  };
}

export function parseSourcesCsv(csv: string): SourceRow[] {
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.length > 0);
  if (lines.length === 0) {
    fail("sources.csv", "expected a header row");
  }

  const header = lines[0].split(",").map((cell) => cell.trim());
  const expected = ["field", "value", "url", "checkedOn", "collector", "issues"];
  if (header.length !== expected.length || header.some((h, i) => h !== expected[i])) {
    fail(
      "sources.csv",
      `expected header ${expected.join(",")} (got ${header.join(",")})`,
    );
  }

  return lines.slice(1).map((line, index) => {
    const path = `sources.csv[${index + 2}]`;
    const cells = splitCsvLine(line);
    if (cells.length !== expected.length) {
      fail(path, `expected ${expected.length} columns, got ${cells.length}`);
    }

    const [field, value, url, checkedOn, collector, issues] = cells;
    return {
      field: parseNonEmptyString(field, `${path}.field`),
      value: parseNonEmptyString(value, `${path}.value`),
      url: parseNonEmptyString(url, `${path}.url`),
      checkedOn: parseCheckedOn(checkedOn, `${path}.checkedOn`),
      collector: parseUnion(collector, `${path}.collector`, SOURCE_COLLECTORS),
      issues,
    };
  });
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

export function parseCatalogue(input: {
  courses: unknown;
  scholarships: unknown;
  costs: unknown;
}): Catalogue {
  return {
    courses: parseCourses(input.courses),
    scholarships: parseScholarships(input.scholarships),
    costs: parseCostOfLiving(input.costs),
  };
}

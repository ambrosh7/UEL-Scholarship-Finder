import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { EligibilityState } from "./types";

export type LockedCopyMeta = {
  courseId: string;
  courseTitle: string;
  eligibility: EligibilityState;
  tuitionGbp: number;
  scholarshipMinGbp: number;
  scholarshipMaxGbp: number;
  campus?: string;
  academicYear?: string;
};

export type LockedCopyFile = {
  meta: LockedCopyMeta;
  onScreen: string;
  notes: string;
};

const COPY_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/copy",
);

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!match) {
    throw new Error("Locked copy is missing YAML frontmatter");
  }
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: match[2] };
}

function section(body: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(
    `## ${escaped}\\n([\\s\\S]*?)(?=\\n## |$)`,
  ).exec(body);
  if (!match) {
    throw new Error(`Locked copy is missing ## ${heading}`);
  }
  return match[1].trim();
}

export function parseLockedCopy(raw: string): LockedCopyFile {
  const { meta, body } = parseFrontmatter(raw);
  return {
    meta: {
      courseId: meta.courseId,
      courseTitle: meta.courseTitle,
      eligibility: meta.eligibility as EligibilityState,
      tuitionGbp: Number(meta.tuitionGbp),
      scholarshipMinGbp: Number(meta.scholarshipMinGbp),
      scholarshipMaxGbp: Number(meta.scholarshipMaxGbp),
      campus: meta.campus,
      academicYear: meta.academicYear,
    },
    onScreen: section(body, "On screen"),
    notes: section(body, "Why this would work"),
  };
}

export function loadLockedCopy(filename: string): LockedCopyFile {
  const raw = readFileSync(join(COPY_DIR, filename), "utf8");
  return parseLockedCopy(raw);
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

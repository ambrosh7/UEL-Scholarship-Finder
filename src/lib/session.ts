import type { WizardAnswers } from "@/domain/questions";
import type { LeadAttribution as Attribution } from "@/domain/types";

const ANSWERS_KEY = "uel-finder-answers";
const ATTRIBUTION_KEY = "uel-finder-attribution";
const LEAD_KEY = "uel-finder-lead";
const STEP_KEY = "uel-finder-step";

export type StoredLeadRef = {
  id: string;
  phone: string;
};

export type PartialAnswers = Partial<WizardAnswers> & {
  marksInput?: string;
};

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing or quota — answers stay in memory for this visit.
  }
}

export function loadAnswers(): PartialAnswers {
  return readJson<PartialAnswers>(ANSWERS_KEY) ?? {};
}

export function saveAnswers(answers: PartialAnswers): void {
  writeJson(ANSWERS_KEY, answers);
}

export function clearAnswers(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(ANSWERS_KEY);
  } catch {
    // ignore
  }
}

export function loadAttribution(): Attribution | null {
  return readJson<Attribution>(ATTRIBUTION_KEY);
}

export function captureAttributionOnce(): Attribution {
  const existing = loadAttribution();
  if (existing) return existing;

  const params = new URLSearchParams(window.location.search);
  const attribution: Attribution = {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    influencerId: params.get("utm_content") ?? undefined,
    landingPath: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || undefined,
  };
  writeJson(ATTRIBUTION_KEY, attribution);
  return attribution;
}

export function loadLeadRef(): StoredLeadRef | null {
  return readJson<StoredLeadRef>(LEAD_KEY);
}

export function saveLeadRef(ref: StoredLeadRef): void {
  writeJson(LEAD_KEY, ref);
}

export function clearLeadRef(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(LEAD_KEY);
  } catch {
    // ignore
  }
}

export function loadStep(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STEP_KEY);
}

export function saveStep(step: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STEP_KEY, step);
  } catch {
    // ignore
  }
}

/** New run from landing / Done. Keeps UTM attribution. */
export function clearWizardSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(ANSWERS_KEY);
    sessionStorage.removeItem(STEP_KEY);
    sessionStorage.removeItem(LEAD_KEY);
  } catch {
    // ignore
  }
}

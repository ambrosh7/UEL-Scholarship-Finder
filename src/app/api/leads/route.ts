import { loadCatalogue } from "@/data/loadCatalogue";
import { match } from "@/domain/match";
import { rankLead } from "@/domain/priority";
import { toE164India } from "@/lib/phone";
import { findLeadByPhone, saveLead } from "@/server/leadStore";
import type { Lead, LeadAttribution, StudentProfile } from "@/domain/types";

type LeadBody = {
  name?: unknown;
  phone?: unknown;
  consentWhatsapp?: unknown;
  consentShareWithUel?: unknown;
  profile?: StudentProfile;
  attribution?: LeadAttribution;
};

function isProfile(value: unknown): value is StudentProfile {
  if (typeof value !== "object" || value === null) return false;
  const p = value as StudentProfile;
  return (
    (p.level === "undergraduate" || p.level === "postgraduate-taught") &&
    typeof p.educationStage === "string" &&
    typeof p.boardOrDegree === "string" &&
    typeof p.marksPercent === "number" &&
    typeof p.subjectInterest === "string" &&
    Array.isArray(p.interests)
  );
}

export async function POST(request: Request) {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (name.length < 2) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  const phone =
    typeof body.phone === "string" ? toE164India(body.phone) : null;
  if (!phone) {
    return Response.json(
      { error: "Enter a valid Indian mobile number" },
      { status: 400 },
    );
  }

  if (!isProfile(body.profile)) {
    return Response.json({ error: "Answers are incomplete" }, { status: 400 });
  }

  const consentWhatsapp = body.consentWhatsapp === true;
  const consentShareWithUel = body.consentShareWithUel === true;

  const existing = findLeadByPhone(phone);
  const catalogue = loadCatalogue();
  const matchResult = match(body.profile, catalogue);
  const rank = rankLead({
    profile: body.profile,
    match: matchResult,
    consentWhatsapp,
    consentShareWithUel,
  });

  const attribution: LeadAttribution =
    body.attribution ?? existing?.attribution ?? { landingPath: "/" };

  const lead: Lead = {
    id: existing?.id ?? crypto.randomUUID(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    name,
    phone,
    consentWhatsapp,
    consentShareWithUel,
    profile: body.profile,
    match: matchResult,
    attribution,
    priority: rank.priority,
    priorityReasons: rank.reasons,
  };

  saveLead(lead);
  return Response.json({ id: lead.id });
}

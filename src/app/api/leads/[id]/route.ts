import { getLead } from "@/server/leadStore";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const lead = getLead(id);
  if (!lead) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({
    id: lead.id,
    name: lead.name,
    profile: lead.profile,
    match: lead.match,
    consentShareWithUel: lead.consentShareWithUel,
  });
}

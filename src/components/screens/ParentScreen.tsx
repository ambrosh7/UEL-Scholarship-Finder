import { PhoneShell } from "@/components/layout/PhoneShell";
import { ParentView } from "@/components/results/ParentView";
import { getLead } from "@/server/leadStore";

export function ParentScreen({ id }: { id: string }) {
  const lead = getLead(id);

  return (
    <PhoneShell>
      {lead ? (
        <ParentView
          childName={lead.name}
          profile={lead.profile}
          match={lead.match}
        />
      ) : (
        <p className="px-5 py-10 text-base leading-relaxed text-muted">
          We could not find this result. Ask them to send the link again — you
          do not need to answer the questions.
        </p>
      )}
    </PhoneShell>
  );
}

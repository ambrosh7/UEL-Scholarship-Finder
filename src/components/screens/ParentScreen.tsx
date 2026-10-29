"use client";

import { use, useEffect, useState } from "react";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { ParentView } from "@/components/results/ParentView";
import type { MatchResult, StudentProfile } from "@/domain/types";

type ParentPayload = {
  name: string;
  profile: StudentProfile;
  match: MatchResult;
};

export function ParentScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [payload, setPayload] = useState<ParentPayload | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/leads/${id}`)
      .then(async (response) => {
        if (!response.ok) {
          if (!cancelled) setMissing(true);
          return;
        }
        const data = (await response.json()) as ParentPayload;
        if (!cancelled) setPayload(data);
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <PhoneShell>
      {missing ? (
        <p className="px-5 py-10 text-base leading-relaxed text-muted">
          We could not find this result. Ask them to send the link again — you
          do not need to answer the questions.
        </p>
      ) : payload ? (
        <ParentView
          childName={payload.name}
          profile={payload.profile}
          match={payload.match}
        />
      ) : (
        <p className="px-5 py-10 text-base text-muted">Loading…</p>
      )}
    </PhoneShell>
  );
}

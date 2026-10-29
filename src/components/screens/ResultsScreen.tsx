"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { PinnedBar, PinnedCta } from "@/components/layout/PinnedCta";
import { ResultsView } from "@/components/results/ResultsView";
import { loadCatalogue } from "@/data/loadCatalogue";
import { parentWhatsApp } from "@/domain/copy";
import { match, publishedMinPercent } from "@/domain/match";
import { BUTTONS } from "@/domain/questions";
import { completeProfile } from "@/lib/profile";
import { loadAnswers, loadLeadRef } from "@/lib/session";
import { useIsClient } from "@/lib/useIsClient";

export function ResultsScreen() {
  const router = useRouter();
  const catalogue = useMemo(() => loadCatalogue(), []);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    const ref = loadLeadRef();
    const stored = completeProfile(loadAnswers());
    if (!ref || !stored) {
      router.replace("/");
    }
  }, [isClient, router]);

  if (!isClient) {
    return (
      <PhoneShell>
        <p className="px-5 py-10 text-base text-muted">Loading…</p>
      </PhoneShell>
    );
  }

  const ref = loadLeadRef();
  const profile = completeProfile(loadAnswers());
  if (!ref || !profile) {
    return (
      <PhoneShell>
        <p className="px-5 py-10 text-base text-muted">Loading…</p>
      </PhoneShell>
    );
  }

  const result = match(profile, catalogue);
  const min =
    result.course && typeof publishedMinPercent(result.course, profile) === "number"
      ? (publishedMinPercent(result.course, profile) as number)
      : null;
  const showFather =
    profile.decisionMaker === "self-if-parents-pay" &&
    result.eligibility === "appears_to_meet";
  const whatsapp = parentWhatsApp({
    profile,
    course: result.course,
    eligibility: result.eligibility,
    scholarship: result.scholarshipEstimate,
    cost: result.yearOneCost,
    minPercent: min,
  });
  const parentLink = `${window.location.origin}/p/${ref.id}`;

  async function copyParents() {
    try {
      await navigator.clipboard.writeText(`${whatsapp} Parent link: ${parentLink}`);
    } catch {
      window.prompt("Copy this for your parents", whatsapp);
    }
  }

  return (
    <PhoneShell
      footer={
        <PinnedBar>
          <PinnedCta onClick={() => router.push("/thanks")}>
            {BUTTONS.talkToAdviser}
          </PinnedCta>
          <PinnedCta variant="secondary" onClick={() => void copyParents()}>
            {showFather ? BUTTONS.showFather : BUTTONS.forwardToParents}
          </PinnedCta>
        </PinnedBar>
      }
    >
      <ResultsView profile={profile} match={result} />
    </PhoneShell>
  );
}

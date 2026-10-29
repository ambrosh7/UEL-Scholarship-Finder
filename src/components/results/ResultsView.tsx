import {
  careerFragment,
  eligibilitySentence,
  fundingFragment,
  interestFragment,
  nextStepCopy,
  resultsHeadline,
  scholarshipFragment,
} from "@/domain/copy";
import { publishedMinPercent } from "@/domain/match";
import { TEASER } from "@/domain/questions";
import type { MatchResult, StudentProfile } from "@/domain/types";
import { AppEyebrow } from "@/components/ui/AppEyebrow";
import { ScholarshipBlock } from "@/components/ui/ScholarshipBlock";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { CostStack } from "./CostStack";

type ResultsViewProps = {
  profile: StudentProfile;
  match: MatchResult;
};

function numericMin(profile: StudentProfile, match: MatchResult): number | null {
  if (!match.course) return null;
  const min = publishedMinPercent(match.course, profile);
  return typeof min === "number" ? min : null;
}

export function ResultsView({ profile, match }: ResultsViewProps) {
  const min = numericMin(profile, match);
  const headline = resultsHeadline({
    profile,
    course: match.course,
    eligibility: match.eligibility,
  });
  const extraReasons = match.reasons.filter(
    (reason) => !reason.startsWith("Matched to "),
  );

  return (
    <article className="flex flex-col gap-5 px-4 pt-5 pb-8 sm:px-5">
      <AppEyebrow />
      <h1 className="headline-lg">{headline}</h1>

      {match.course ? (
        <SurfaceCard>
          <p className="font-serif text-[18px] leading-6 text-ink-deep">
            {match.course.title}
          </p>
          <p className="mt-1 text-[13px] tracking-[0.04em] text-muted">
            {match.course.campus}
          </p>
          <p className="mt-3 text-[15px] leading-6 text-ink-text">
            {eligibilitySentence(match.eligibility, match.course, profile, min)}
          </p>
        </SurfaceCard>
      ) : (
        <p className="body-md">
          {eligibilitySentence(match.eligibility, match.course, profile, min)}
        </p>
      )}

      {extraReasons.map((reason) => (
        <p key={reason} className="text-[15px] leading-6 text-muted">
          {reason}
        </p>
      ))}

      <ScholarshipBlock
        range={scholarshipFragment(match.scholarshipEstimate)}
        honesty={TEASER.honesty}
      />

      <CostStack cost={match.yearOneCost} />

      <div className="flex flex-col gap-3.5 border-t border-line pt-5 text-[15px] leading-6 text-ink-text">
        <p>{fundingFragment(profile)}</p>
        <p>{interestFragment(profile, match.course)}</p>
        {careerFragment(profile) ? <p>{careerFragment(profile)}</p> : null}
      </div>

      <p className="rounded-xl border-l-[3px] border-ink bg-surface-low px-4 py-3.5 text-[15px] leading-6 text-ink-deep">
        {nextStepCopy(match.eligibility, profile)}
      </p>
    </article>
  );
}

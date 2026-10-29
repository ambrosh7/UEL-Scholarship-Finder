import { parentWhatsApp, scholarshipFragment } from "@/domain/copy";
import { publishedMinPercent } from "@/domain/match";
import { LANDING, TEASER } from "@/domain/questions";
import type { MatchResult, StudentProfile } from "@/domain/types";
import { AppEyebrow } from "@/components/ui/AppEyebrow";
import { HonestyCard } from "@/components/ui/HonestyCard";
import { ScholarshipBlock } from "@/components/ui/ScholarshipBlock";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { CostStack } from "./CostStack";

type ParentViewProps = {
  childName?: string;
  profile: StudentProfile;
  match: MatchResult;
};

export function ParentView({ childName, profile, match }: ParentViewProps) {
  const min =
    match.course && typeof publishedMinPercent(match.course, profile) === "number"
      ? (publishedMinPercent(match.course, profile) as number)
      : null;
  const whatsapp = parentWhatsApp({
    profile,
    course: match.course,
    eligibility: match.eligibility,
    scholarship: match.scholarshipEstimate,
    cost: match.yearOneCost,
    minPercent: min,
  });

  return (
    <article className="flex flex-col gap-5 px-4 pt-5 pb-8 sm:px-5">
      <AppEyebrow />
      <h1 className="headline-lg">
        {childName
          ? `${childName} sent you this`
          : "A year-one picture for your family"}
      </h1>
      <HonestyCard>
        {TEASER.honesty} {LANDING.honesty}
      </HonestyCard>
      {match.course ? (
        <SurfaceCard>
          <p className="font-serif text-[18px] leading-6 text-ink-deep">
            {match.course.title}
          </p>
          <p className="mt-1 text-[13px] tracking-[0.04em] text-muted">
            {match.course.campus}
          </p>
        </SurfaceCard>
      ) : (
        <p className="body-md">No course was matched.</p>
      )}
      <ScholarshipBlock
        range={scholarshipFragment(match.scholarshipEstimate)}
        honesty={TEASER.honesty}
      />
      <CostStack cost={match.yearOneCost} />
      <p className="text-[15px] leading-6 text-ink-text">{whatsapp}</p>
    </article>
  );
}

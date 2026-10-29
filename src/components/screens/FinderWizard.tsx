"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { PinnedBar, PinnedCta } from "@/components/layout/PinnedCta";
import { WizardHeader } from "@/components/layout/WizardHeader";
import { ChoiceList } from "@/components/screens/ChoiceList";
import { CheckRow } from "@/components/ui/CheckRow";
import { Field } from "@/components/ui/Field";
import { ScholarshipBlock } from "@/components/ui/ScholarshipBlock";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { loadCatalogue } from "@/data/loadCatalogue";
import { isValidMarksPercent, match } from "@/domain/match";
import {
  BOARD_OPTIONS,
  BUTTONS,
  DECIDE_OPTIONS,
  DEGREE_OPTIONS,
  FUNDING_HELPER,
  FUNDING_OPTIONS,
  GATE,
  INTEREST_OPTIONS,
  LEVEL_OPTIONS,
  MARKS_HELPER,
  MARKS_WORDING,
  SCREEN_HEADINGS,
  STAGE_OPTIONS,
  SUBJECT_OPTIONS,
  TEASER,
  questionWording,
} from "@/domain/questions";
import type {
  CourseLevel,
  DecisionMaker,
  EducationStage,
  Funding,
  LifeInterest,
  SubjectFamily,
} from "@/domain/types";
import { toE164India } from "@/lib/phone";
import { completeProfile, firstIncompleteStep } from "@/lib/profile";
import {
  clearWizardSession,
  loadAnswers,
  loadAttribution,
  loadStep,
  saveAnswers,
  saveLeadRef,
  saveStep,
  type PartialAnswers,
} from "@/lib/session";
import { useIsClient } from "@/lib/useIsClient";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | "teaser" | "gate";

const PROTOTYPE_SUBJECTS = SUBJECT_OPTIONS.filter(
  (option) => option.prototype !== false,
);

function restoredStep(answers: PartialAnswers): Step {
  const stored = loadStep();
  const complete = Boolean(completeProfile(answers));
  if ((stored === "teaser" || stored === "gate") && complete) return stored;
  if (
    stored === "1" ||
    stored === "2" ||
    stored === "3" ||
    stored === "4" ||
    stored === "5" ||
    stored === "6"
  ) {
    return Number(stored) as Step;
  }
  return firstIncompleteStep(answers);
}

export function FinderWizard() {
  const router = useRouter();
  const catalogue = useMemo(() => loadCatalogue(), []);
  const isClient = useIsClient();
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<PartialAnswers>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consentWhatsapp, setConsentWhatsapp] = useState(false);
  const [consentShareWithUel, setConsentShareWithUel] = useState(false);
  const [gateError, setGateError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isClient && !hydrated) {
    const startFresh =
      new URLSearchParams(window.location.search).get("new") === "1";
    if (startFresh) {
      clearWizardSession();
      setAnswers({});
      setStep(1);
      window.history.replaceState(null, "", "/find");
    } else {
      const storedAnswers = loadAnswers();
      setAnswers(storedAnswers);
      setStep(restoredStep(storedAnswers));
    }
    setHydrated(true);
  }

  function update(patch: PartialAnswers) {
    setAnswers((prev) => {
      const next = { ...prev, ...patch };
      saveAnswers(next);
      return next;
    });
  }

  function go(next: Step) {
    setStep(next);
    saveStep(String(next));
    window.scrollTo(0, 0);
  }

  function back() {
    if (step === 1) {
      router.push("/");
      return;
    }
    if (step === "teaser") {
      go(6);
      return;
    }
    if (step === "gate") {
      go("teaser");
      return;
    }
    go((step - 1) as Step);
  }

  const profile = completeProfile(answers);
  const preview = profile ? match(profile, catalogue) : null;

  const marksWording =
    answers.educationStage !== undefined
      ? MARKS_WORDING[answers.educationStage]
      : MARKS_WORDING["school-finished"];

  const canContinue = (() => {
    switch (step) {
      case 1:
        return Boolean(answers.level);
      case 2:
        return Boolean(answers.educationStage);
      case 3:
        return Boolean(answers.subjectInterest);
      case 4:
        return (
          typeof answers.marksPercent === "number" &&
          isValidMarksPercent(answers.marksPercent) &&
          Boolean(answers.boardOrDegree)
        );
      case 5:
        return Boolean(answers.interests?.[0]);
      case 6:
        return Boolean(answers.decisionMaker && answers.funding);
      default:
        return true;
    }
  })();

  async function submitGate() {
    setGateError("");
    if (!profile) {
      setGateError("Please go back and finish the questions.");
      return;
    }
    if (name.trim().length < 2) {
      setGateError("Enter your name.");
      return;
    }
    const e164 = toE164India(phone);
    if (!e164) {
      setGateError("Enter a valid Indian mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: e164,
          consentWhatsapp,
          consentShareWithUel,
          profile,
          attribution: loadAttribution() ?? { landingPath: "/" },
        }),
      });
      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !data.id) {
        setGateError(data.error ?? "Could not save your details.");
        return;
      }
      saveLeadRef({ id: data.id, phone: e164 });
      router.push("/results");
    } catch {
      setGateError("Could not save your details. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <PhoneShell>
        <p className="px-5 py-10 text-base text-muted">Loading…</p>
      </PhoneShell>
    );
  }

  const questionStep = typeof step === "number" ? step : 6;

  let body: ReactNode;
  let ctaLabel: string = BUTTONS.continue;
  let onCta = () => go((questionStep + 1) as Step);

  if (step === 1) {
    body = (
      <ChoiceList
        name="level"
        question={questionWording("q-level")}
        options={[...LEVEL_OPTIONS]}
        value={answers.level}
        onChange={(value) => update({ level: value as CourseLevel })}
      />
    );
  } else if (step === 2) {
    body = (
      <ChoiceList
        name="stage"
        question={questionWording("q-stage")}
        options={[...STAGE_OPTIONS]}
        value={answers.educationStage}
        onChange={(value) =>
          update({
            educationStage: value as EducationStage,
            boardOrDegree: undefined,
          })
        }
      />
    );
  } else if (step === 3) {
    body = (
      <ChoiceList
        name="subject"
        question={questionWording("q-subject")}
        options={PROTOTYPE_SUBJECTS.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        value={answers.subjectInterest}
        onChange={(value) =>
          update({ subjectInterest: value as SubjectFamily })
        }
      />
    );
  } else if (step === 4) {
    const graduate = answers.educationStage === "graduate";
    body = (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="headline-lg tracking-tight">{marksWording}</h1>
          <p className="body-md">{MARKS_HELPER}</p>
          <input
            type="number"
            inputMode="decimal"
            min={1}
            max={100}
            step="0.1"
            placeholder="82"
            value={answers.marksInput ?? (answers.marksPercent ?? "")}
            onChange={(event) => {
              const raw = event.target.value;
              const n = Number(raw);
              update({
                marksInput: raw,
                marksPercent: Number.isFinite(n) ? n : undefined,
              });
            }}
            className="h-14 w-full rounded-xl border border-line bg-white px-4 font-serif text-[24px] leading-7 text-ink-deep tabular outline-none placeholder:text-[#c9c2b8] focus:border-ink"
          />
        </div>
        {graduate ? (
          <ChoiceList
            name="degree"
            question={questionWording("q-degree")}
            options={[...DEGREE_OPTIONS]}
            value={answers.boardOrDegree}
            onChange={(value) => update({ boardOrDegree: value })}
          />
        ) : (
          <ChoiceList
            name="board"
            question={questionWording("q-board")}
            options={[...BOARD_OPTIONS]}
            value={answers.boardOrDegree}
            onChange={(value) => update({ boardOrDegree: value })}
          />
        )}
      </div>
    );
  } else if (step === 5) {
    body = (
      <ChoiceList
        name="interest"
        question={questionWording("q-interest")}
        options={[...INTEREST_OPTIONS]}
        value={answers.interests?.[0]}
        onChange={(value) =>
          update({ interests: [value as LifeInterest] })
        }
      />
    );
  } else if (step === 6) {
    ctaLabel = BUTTONS.seeMyResult;
    onCta = () => go("teaser");
    body = (
      <div className="flex flex-col gap-8">
        <h1 className="headline-lg tracking-tight">{SCREEN_HEADINGS.money}</h1>
        <ChoiceList
          name="decide"
          question={questionWording("q-decide")}
          options={[...DECIDE_OPTIONS]}
          value={answers.decisionMaker}
          onChange={(value) =>
            update({ decisionMaker: value as DecisionMaker })
          }
        />
        <ChoiceList
          name="funding"
          question={questionWording("q-funding")}
          helper={FUNDING_HELPER}
          options={[...FUNDING_OPTIONS]}
          value={answers.funding}
          onChange={(value) => update({ funding: value as Funding })}
        />
      </div>
    );
  } else if (step === "teaser") {
    ctaLabel = TEASER.button;
    onCta = () => go("gate");
    body = (
      <div className="flex flex-col gap-4">
        <h1 className="headline-lg tracking-tight">{TEASER.heading}</h1>
        <SurfaceCard>
          {preview?.eligibility === "wrong_level" || !preview?.course ? (
            <p className="font-serif text-[18px] leading-7 text-ink-deep">
              {TEASER.wrongLevelLine}
            </p>
          ) : (
            <>
              <p className="font-serif text-[20px] leading-7 text-ink-deep">
                {preview.course.title}
              </p>
              <p className="mt-1 text-[13px] tracking-[0.04em] text-muted">
                {preview.course.campus}
              </p>
            </>
          )}
        </SurfaceCard>
        <ScholarshipBlock
          range={TEASER.scholarshipLine}
          honesty={TEASER.honesty}
        />
      </div>
    );
  } else {
    ctaLabel = submitting ? "Please wait" : GATE.button;
    onCta = () => {
      void submitGate();
    };
    body = (
      <div className="flex flex-col gap-5">
        <h1 className="headline-lg tracking-tight">{GATE.heading}</h1>
        <p className="body-md">{GATE.subline}</p>
        <Field
          label={GATE.nameLabel}
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Field
          label={GATE.phoneLabel}
          prefix={GATE.phonePrefix}
          inputMode="numeric"
          autoComplete="tel"
          placeholder={GATE.phonePlaceholder}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <CheckRow checked={consentWhatsapp} onChange={setConsentWhatsapp}>
          {GATE.consentWhatsapp}
        </CheckRow>
        <CheckRow
          checked={consentShareWithUel}
          onChange={setConsentShareWithUel}
        >
          {GATE.consentShareWithUel}
        </CheckRow>
        {gateError ? (
          <p className="text-[16px] leading-6 text-critical">{gateError}</p>
        ) : null}
      </div>
    );
  }

  return (
    <PhoneShell
      header={
        <WizardHeader
          onBack={back}
          step={typeof step === "number" ? step : 6}
        />
      }
      footer={
        <PinnedBar>
          <PinnedCta
            onClick={onCta}
            disabled={
              (typeof step === "number" && !canContinue) ||
              submitting ||
              (step === "teaser" && !profile)
            }
          >
            {ctaLabel}
          </PinnedCta>
        </PinnedBar>
      }
    >
      <div className="px-4 py-5 pb-8 sm:px-5">{body}</div>
    </PhoneShell>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PhoneShell } from "@/components/layout/PhoneShell";
import {
  CtaArrow,
  PinnedBar,
  ctaPrimaryClass,
} from "@/components/layout/PinnedCta";
import { HonestyCard } from "@/components/ui/HonestyCard";
import { LANDING } from "@/domain/questions";
import { captureAttributionOnce, clearWizardSession } from "@/lib/session";

export function LandingScreen() {
  useEffect(() => {
    captureAttributionOnce();
  }, []);

  const sublines = LANDING.subline.split(/(?<=\.)\s+/);

  return (
    <PhoneShell
      footer={
        <PinnedBar>
          <Link
            href="/find?new=1"
            className={ctaPrimaryClass}
            onClick={() => clearWizardSession()}
          >
            <span>{LANDING.button}</span>
            <CtaArrow />
          </Link>
        </PinnedBar>
      }
    >
      <main className="flex flex-1 flex-col px-4 pt-7 pb-6 sm:px-5">
        <p className="eyebrow">Academic year 2026/27</p>
        <div className="mt-4 mb-6 h-0.5 w-10 rounded-full bg-brass" aria-hidden />
        <h1 className="headline-lg">{LANDING.headline}</h1>
        <div className="mt-5 flex flex-col gap-2">
          {sublines.map((line) => (
            <p key={line} className="body-md">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-auto pt-8">
          <HonestyCard>{LANDING.honesty}</HonestyCard>
        </div>
      </main>
    </PhoneShell>
  );
}

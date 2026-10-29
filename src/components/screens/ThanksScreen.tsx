"use client";

import Link from "next/link";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { PinnedBar, ctaPrimaryClass } from "@/components/layout/PinnedCta";
import { AppEyebrow } from "@/components/ui/AppEyebrow";
import { HonestyCard } from "@/components/ui/HonestyCard";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { THANKS } from "@/domain/questions";
import { clearWizardSession, loadLeadRef } from "@/lib/session";
import { useIsClient } from "@/lib/useIsClient";

export function ThanksScreen() {
  const isClient = useIsClient();
  const ref = isClient ? loadLeadRef() : null;
  const parentLink = ref
    ? `${window.location.origin}/p/${ref.id}`
    : undefined;

  return (
    <PhoneShell
      footer={
        <PinnedBar>
          <Link
            href="/"
            className={ctaPrimaryClass}
            onClick={() => clearWizardSession()}
          >
            {THANKS.button}
          </Link>
        </PinnedBar>
      }
    >
      <main className="flex flex-1 flex-col px-4 pt-5 pb-8 sm:px-5">
        <AppEyebrow />
        <h1 className="headline-lg mt-4">{THANKS.heading}</h1>
        <p className="body-md mt-4">{THANKS.weWill}</p>
        <div className="mt-6">
          <HonestyCard>{THANKS.weWillNot}</HonestyCard>
        </div>
        <p className="body-md mt-5">{THANKS.uel}</p>
        {parentLink ? (
          <div className="mt-6">
            <SurfaceCard>
              <p className="text-[13px] leading-5 text-ink-text">
                A parent can open this link — no extra questions:
              </p>
              <a
                href={parentLink}
                className="mt-2 block break-all font-medium text-ink underline decoration-brass/60 underline-offset-2"
              >
                {parentLink}
              </a>
            </SurfaceCard>
          </div>
        ) : null}
      </main>
    </PhoneShell>
  );
}

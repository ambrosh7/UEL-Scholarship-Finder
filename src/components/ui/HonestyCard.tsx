import type { ReactNode } from "react";

export function HonestyCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border-l-[3px] border-brass bg-surface-low px-4 py-3.5">
      <div className="text-[15px] leading-6 text-ink">{children}</div>
    </div>
  );
}

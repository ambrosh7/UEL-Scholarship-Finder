import type { ReactNode } from "react";

export function SurfaceCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface-low px-4 py-4">
      {children}
    </div>
  );
}

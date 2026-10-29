export function InstitutionBar() {
  return (
    <div className="shrink-0 bg-ink-deep text-white pt-[env(safe-area-inset-top)]">
      <div className="flex h-12 items-center justify-between px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-brass/80 text-[10px] font-semibold tracking-[0.12em]"
          >
            UEL
          </span>
          <div className="min-w-0">
            <p className="truncate text-[10px] leading-3 tracking-[0.16em] uppercase text-white/55">
              University of East London
            </p>
            <p className="truncate pt-0.5 text-[12px] leading-4 font-medium">
              Fit & Scholarship Finder
            </p>
          </div>
        </div>
        <span className="shrink-0 pl-3 text-[10px] tracking-[0.14em] uppercase text-brass">
          2026/27
        </span>
      </div>
    </div>
  );
}

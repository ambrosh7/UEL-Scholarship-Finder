type WizardHeaderProps = {
  onBack: () => void;
  step: number;
  total?: number;
};

export function WizardHeader({ onBack, step, total = 6 }: WizardHeaderProps) {
  const current = Math.min(step, total);
  return (
    <header className="shrink-0 border-b border-line bg-page px-4 pt-1 pb-2.5 sm:px-5">
      <div className="mb-2 flex h-11 items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink touch-manipulation active:bg-surface-low"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 5 8 12l7 7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="sr-only">Back</span>
        </button>
        <span className="eyebrow text-muted">
          {current} of {total}
        </span>
      </div>
      <div className="flex h-1 gap-1" aria-hidden>
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`h-full flex-1 rounded-full ${
              index < current ? "bg-ink" : "bg-surface-high"
            }`}
          />
        ))}
      </div>
    </header>
  );
}

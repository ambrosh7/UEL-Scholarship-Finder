type CheckRowProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: string;
};

export function CheckRow({ checked, onChange, children }: CheckRowProps) {
  return (
    <label className="flex min-h-14 cursor-pointer items-start gap-3 py-2 text-[15px] leading-5 text-ink-text touch-manipulation">
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
          checked ? "border-ink bg-ink text-white" : "border-line bg-white"
        }`}
      >
        {checked ? (
          <span className="text-[11px] font-bold" aria-hidden>
            ✓
          </span>
        ) : null}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span className="pt-0.5">{children}</span>
    </label>
  );
}

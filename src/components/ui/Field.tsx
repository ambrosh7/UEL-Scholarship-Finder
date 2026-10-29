import type { InputHTMLAttributes, ReactNode } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helper?: string;
  prefix?: ReactNode;
};

export function Field({
  label,
  helper,
  prefix,
  id,
  className = "",
  ...props
}: FieldProps) {
  const inputId = id ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="flex flex-col gap-1.5" htmlFor={inputId}>
      <span className="text-[13px] font-semibold tracking-[0.04em] text-ink">
        {label}
      </span>
      <div className="flex h-14 min-h-14 items-center overflow-hidden rounded-xl border border-line bg-white focus-within:border-ink">
        {prefix ? (
          <span className="flex h-full shrink-0 items-center border-r border-line bg-surface-low px-3.5 text-[16px] font-medium text-ink">
            {prefix}
          </span>
        ) : null}
        <input
          id={inputId}
          className={`h-14 min-h-14 w-full bg-transparent px-3.5 text-[16px] text-ink-text outline-none placeholder:text-[#b8b2a8] ${className}`}
          {...props}
        />
      </div>
      {helper ? (
        <span className="text-[12px] leading-4 text-muted">{helper}</span>
      ) : null}
    </label>
  );
}

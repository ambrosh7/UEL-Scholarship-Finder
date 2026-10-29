import type { ButtonHTMLAttributes, ReactNode } from "react";

type PinnedCtaProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export const ctaPrimaryClass =
  "flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-ink-deep px-4 text-[16px] leading-6 font-semibold text-white touch-manipulation active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-surface-high disabled:text-muted";

export const ctaSecondaryClass =
  "flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-ink bg-transparent px-4 text-[16px] leading-6 font-semibold text-ink touch-manipulation active:scale-[0.99]";

export function CtaArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PinnedCta({
  children,
  disabled,
  variant = "primary",
  className = "",
  ...props
}: PinnedCtaProps) {
  const styles = variant === "secondary" ? ctaSecondaryClass : ctaPrimaryClass;

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PinnedBar({ children }: { children: ReactNode }) {
  return (
    <div className="shrink-0 border-t border-line bg-page/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:px-5">
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

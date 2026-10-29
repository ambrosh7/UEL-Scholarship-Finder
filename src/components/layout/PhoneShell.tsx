import type { ReactNode } from "react";
import { InstitutionBar } from "./InstitutionBar";

type PhoneShellProps = {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
};

export function PhoneShell({ children, header, footer }: PhoneShellProps) {
  return (
    <div className="flex min-h-dvh justify-center bg-page md:bg-surround md:items-center md:py-8">
      <div
        data-phone-shell
        className="flex min-h-dvh w-full max-w-[430px] flex-col bg-page text-ink-text md:max-w-[390px] md:min-h-[844px] md:overflow-hidden md:rounded-[28px] md:shadow-[0_24px_80px_rgba(0,26,56,0.18)]"
      >
        <InstitutionBar />
        {header}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
}

type AppEyebrowProps = {
  children?: string;
};

export function AppEyebrow({ children = "Academic year 2026/27" }: AppEyebrowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-5 bg-brass" aria-hidden />
      <p className="eyebrow">{children}</p>
    </div>
  );
}

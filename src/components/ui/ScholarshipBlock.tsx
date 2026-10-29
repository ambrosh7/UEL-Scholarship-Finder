type ScholarshipBlockProps = {
  range: string;
  honesty: string;
};

export function ScholarshipBlock({ range, honesty }: ScholarshipBlockProps) {
  return (
    <section className="rounded-xl border border-ink/15 bg-[#f3f5f4] px-4 py-4">
      <div className="mb-2 h-0.5 w-8 rounded-full bg-brass" aria-hidden />
      <p className="font-serif text-[17px] leading-6 text-ink-deep">{range}</p>
      <p className="mt-2 text-[13px] leading-5 font-medium text-ink">{honesty}</p>
    </section>
  );
}

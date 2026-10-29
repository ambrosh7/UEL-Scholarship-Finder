import { costStackLines, summariseYearOneCost } from "@/domain/cost";
import type { YearOneCost } from "@/domain/types";

function splitLine(line: string): { label: string; value: string | null } {
  const idx = line.indexOf(": ");
  if (idx === -1) return { label: line, value: null };
  return { label: line.slice(0, idx), value: line.slice(idx + 2) };
}

export function CostStack({ cost }: { cost: YearOneCost }) {
  const summary = summariseYearOneCost(cost);
  const lines = costStackLines(cost);

  return (
    <div className="flex flex-col">
      <div className="mb-1 border-b border-ink/20 pb-2">
        <span className="eyebrow">First year · {cost.academicYear}</span>
      </div>
      <ul className="flex flex-col">
        {lines.map((line) => {
          const { label, value } = splitLine(line);
          const placeholder = Boolean(value?.includes("PLACEHOLDER"));
          return (
            <li key={line} className="flex flex-col gap-0.5 border-b border-line py-3">
              <span className="text-[13px] leading-5 text-muted">{label}</span>
              {value ? (
                <span
                  className={`text-[15px] leading-6 tabular ${
                    placeholder
                      ? "text-muted italic"
                      : "font-medium text-ink-deep"
                  }`}
                >
                  {value}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      {summary.complete ? null : (
        <p className="mt-3 text-[13px] leading-5 text-muted">
          Sourced lines so far: £
          {summary.sourcedTotalGbp.toLocaleString("en-GB")}. Not a complete
          year-one total while PLACEHOLDER lines remain (
          {summary.placeholderFields.join(", ")}).
        </p>
      )}
    </div>
  );
}

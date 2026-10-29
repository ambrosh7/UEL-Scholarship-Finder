type Choice = {
  label: string;
  value: string;
};

type ChoiceListProps = {
  question: string;
  helper?: string;
  options: readonly Choice[];
  value?: string;
  onChange: (value: string) => void;
  name: string;
};

export function ChoiceList({
  question,
  helper,
  options,
  value,
  onChange,
  name,
}: ChoiceListProps) {
  return (
    <fieldset className="flex flex-col">
      <legend className="headline-lg pr-2">{question}</legend>
      {helper ? <p className="body-md mt-3">{helper}</p> : null}
      <div className="mt-5 flex flex-col gap-2.5" role="radiogroup">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <label
              key={`${option.value}-${option.label}`}
              className={`flex min-h-14 cursor-pointer items-center justify-between rounded-xl border px-4 py-3.5 touch-manipulation ${
                selected
                  ? "border-ink bg-navy-wash text-ink"
                  : "border-line bg-white text-ink-text"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                className={`pr-3 text-[16px] leading-6 ${
                  selected ? "font-medium" : "font-normal"
                }`}
              >
                {option.label}
              </span>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  selected ? "border-ink bg-ink" : "border-[#c9c2b8] bg-white"
                }`}
                aria-hidden
              >
                <span
                  className={`block h-1.5 w-1.5 rounded-full ${
                    selected ? "bg-white" : "bg-transparent"
                  }`}
                />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

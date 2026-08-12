import type { ServiceMode } from "@/types";

interface AIModeSelectorProps {
  value: ServiceMode;
  onChange: (mode: ServiceMode) => void;
}

const MODE_OPTIONS: Array<{
  value: ServiceMode;
  label: string;
}> = [
  {
    value: "general_emergency",
    label: "General emergency",
  },
  {
    value: "hospital",
    label: "Medical / hospital",
  },
  {
    value: "ambulance",
    label: "Ambulance",
  },
  {
    value: "police",
    label: "Police / security",
  },
  {
    value: "women_safety",
    label: "Women safety",
  },
  {
    value: "child_safety",
    label: "Child safety",
  },
  {
    value: "blood_bank",
    label: "Blood requirement",
  },
  {
    value: "food_support",
    label: "Food support",
  },
  {
    value: "shelter",
    label: "Shelter support",
  },
];

export function AIModeSelector({
  value,
  onChange,
}: AIModeSelectorProps) {
  return (
    <label className="humangrid-ai-mode-selector">
      <span>Emergency category</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as ServiceMode)
        }
        aria-label="Select emergency category"
      >
        {MODE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
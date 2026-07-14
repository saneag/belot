import type { FeatureToggleName } from "@belot/constants";

import { FeatureToggleRow } from "./featureToggleRow";

interface FeatureToggleListProps {
  labelTemplate: string;
  names: FeatureToggleName[];
  onToggle: (name: FeatureToggleName, enabled: boolean) => void;
  toggles: Record<FeatureToggleName, boolean>;
}

export function FeatureToggleList({
  labelTemplate,
  names,
  onToggle,
  toggles,
}: FeatureToggleListProps) {
  return (
    <div className="flex flex-col gap-3">
      {names.map((name) => (
        <FeatureToggleRow
          key={name}
          labelTemplate={labelTemplate}
          name={name}
          onToggle={onToggle}
          value={toggles[name]}
        />
      ))}
    </div>
  );
}

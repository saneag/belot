import type { FeatureToggleName } from "@belot/constants";

import { VStack } from "@/components/ui/vstack";

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
    <VStack className="gap-3">
      {names.map((name) => (
        <FeatureToggleRow
          key={name}
          labelTemplate={labelTemplate}
          name={name}
          onToggle={onToggle}
          value={toggles[name]}
        />
      ))}
    </VStack>
  );
}

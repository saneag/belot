import type { FeatureToggleName } from "@belot/constants";
import { formatLocalizationString } from "@belot/localizations";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FeatureToggleRowProps {
  labelTemplate: string;
  name: FeatureToggleName;
  onToggle: (name: FeatureToggleName, enabled: boolean) => void;
  value: boolean;
}

export function FeatureToggleRow({ labelTemplate, name, onToggle, value }: FeatureToggleRowProps) {
  const id = `feature-toggle-${name}`;

  return (
    <div className="border-border bg-input/20 flex min-h-14 items-center justify-between gap-3 rounded-lg border px-3 py-2">
      <Label htmlFor={id} className="text-sm">
        {name}
      </Label>
      <Switch
        id={id}
        checked={value}
        onCheckedChange={(enabled) => onToggle(name, enabled)}
        aria-label={formatLocalizationString(labelTemplate, [name])}
      />
    </div>
  );
}

import type { FeatureToggleName } from "@belot/constants";
import { formatLocalizationString } from "@belot/localizations";

import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";

interface FeatureToggleRowProps {
  labelTemplate: string;
  name: FeatureToggleName;
  onToggle: (name: FeatureToggleName, enabled: boolean) => void;
  value: boolean;
}

export function FeatureToggleRow({ labelTemplate, name, onToggle, value }: FeatureToggleRowProps) {
  return (
    <HStack className="min-h-14 items-center justify-between gap-3 rounded-lg border border-background-300 bg-background-100 px-3 py-2">
      <Text className="text-sm">{name}</Text>
      <Switch
        value={value}
        onToggle={(enabled) => onToggle(name, enabled)}
        accessibilityLabel={formatLocalizationString(labelTemplate, [name])}
        trackColor={{ false: "#d4d4d4", true: "#525252" }}
        thumbColor="#fafafa"
        ios_backgroundColor="#d4d4d4"
        size="md"
      />
    </HStack>
  );
}

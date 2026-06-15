import { useCallback } from "react";

import { POINTS_TYPE } from "@belot/constants";
import { formatLocalizationKey, useLocalizations } from "@belot/localizations";

import { CircleIcon, Icon } from "@/components/ui/icon";
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from "@/components/ui/radio";

interface DialogPointsTypeToggleProps {
  value: string;
  onChange: (pointsType: string) => void;
}

export default function DialogPointsTypeToggle({ value, onChange }: DialogPointsTypeToggleProps) {
  const messages = useLocalizations([
    {
      key: "settings.points.type.micropoints",
    },
    {
      key: "settings.points.type.points",
    },
  ]);

  const handleChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <RadioGroup value={value} className="flex flex-row items-center justify-center gap-4">
      {POINTS_TYPE.map((type) => (
        <Radio key={type.id} value={type.id} onPress={() => handleChange(type.id)}>
          <RadioIndicator>
            <RadioIcon as={CircleIcon} />
          </RadioIndicator>
          <RadioLabel>{messages[formatLocalizationKey(type.localizationKey)]}</RadioLabel>
        </Radio>
      ))}
    </RadioGroup>
  );
}

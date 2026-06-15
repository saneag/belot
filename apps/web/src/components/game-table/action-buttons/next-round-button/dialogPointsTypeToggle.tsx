import { useCallback } from "react";

import { POINTS_TYPE } from "@belot/constants";
import { formatLocalizationKey, useLocalizations } from "@belot/localizations";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
    <RadioGroup
      value={value}
      onValueChange={handleChange}
      className="flex items-center justify-center gap-4"
    >
      {POINTS_TYPE.map((type) => (
        <div key={type.id} className="flex items-center gap-2">
          <RadioGroupItem value={type.id} id={`dialog-points-type-${type.id}`} />
          <Label htmlFor={`dialog-points-type-${type.id}`}>
            {messages[formatLocalizationKey(type.localizationKey)]}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

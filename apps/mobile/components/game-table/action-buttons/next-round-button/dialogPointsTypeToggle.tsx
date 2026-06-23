import { POINTS_TYPE } from "@belot/constants";
import { usePointsTypeSelection } from "@belot/hooks";

import { CircleIcon } from "@/components/ui/icon";
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from "@/components/ui/radio";

interface DialogPointsTypeToggleProps {
  value: string;
  onChange: (pointsType: string) => void;
}

export default function DialogPointsTypeToggle({ value, onChange }: DialogPointsTypeToggleProps) {
  const { handleChange, getOptionLabel } = usePointsTypeSelection({ value, onChange });

  return (
    <RadioGroup value={value} className="flex flex-row items-center justify-center gap-4">
      {POINTS_TYPE.map((type) => (
        <Radio key={type.id} value={type.id} onPress={() => handleChange(type.id)}>
          <RadioIndicator>
            <RadioIcon as={CircleIcon} />
          </RadioIndicator>
          <RadioLabel>{getOptionLabel(type.localizationKey)}</RadioLabel>
        </Radio>
      ))}
    </RadioGroup>
  );
}

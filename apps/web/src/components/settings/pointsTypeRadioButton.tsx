import { POINTS_TYPE } from "@belot/constants";
import { type Settings, usePointsTypeSelection } from "@belot/hooks";

import { Button } from "@/components/ui/button";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { CircleQuestionMark } from "lucide-react";

interface PointsTypeRadioButtonProps {
  value: string;
  onChange: (newSettings: Partial<Settings>) => Promise<void>;
}

export const PointsTypeRadioButton = ({ value, onChange }: PointsTypeRadioButtonProps) => {
  const { messages, handleChange, getOptionLabel } = usePointsTypeSelection({
    value,
    onChange: (newValue) => onChange({ pointsType: newValue }),
    includeSettingsLabels: true,
  });

  return (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend variant="label" className="flex items-center">
        <span>{messages.settingsPointsType}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <CircleQuestionMark size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{messages.settingsPointsTypeHint}</TooltipContent>
        </Tooltip>
      </FieldLegend>

      <RadioGroup
        value={value}
        onValueChange={(value) => void handleChange(value)}
        className="flex gap-4"
      >
        {POINTS_TYPE.map((type) => (
          <div key={type.id} className="flex items-center gap-3">
            <RadioGroupItem value={type.id} id={type.id} />
            <Label htmlFor={type.id}>{getOptionLabel(type.localizationKey)}</Label>
          </div>
        ))}
      </RadioGroup>
    </FieldSet>
  );
};

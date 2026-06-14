import { useCallback } from "react";

import { POINTS_TYPE } from "@belot/constants";
import { Settings } from "@belot/hooks";
import { formatLocalizationKey, useLocalizations } from "@belot/localizations";

import ExtendedTooltip from "@/components/extendedTooltip";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { CircleIcon, Icon } from "@/components/ui/icon";
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { CircleQuestionMark } from "lucide-react-native";

interface PointsTypeRadioButtonProps {
  value: string;
  onChange: (newSettings: Partial<Settings>) => Promise<void>;
}

export const PointsTypeRadioButton = ({ value, onChange }: PointsTypeRadioButtonProps) => {
  const messages = useLocalizations([
    {
      key: "settings.points.type",
    },
    {
      key: "settings.points.type.hint",
    },
    {
      key: "settings.points.type.micropoints",
    },
    {
      key: "settings.points.type.points",
    },
  ]);

  const handleChange = useCallback(
    async (newValue: string) => {
      await onChange({ pointsType: newValue });
    },
    [onChange],
  );

  return (
    <VStack>
      <HStack className="items-center">
        <Text>{messages.settingsPointsType}</Text>
        <ExtendedTooltip
          tooltipText={messages.settingsPointsTypeHint}
          tooltipTextClassName="text-base"
          button={
            <Button variant="link" action="default" className="px-2">
              <Icon as={CircleQuestionMark} size="md" />
            </Button>
          }
        />
      </HStack>

      <RadioGroup value={value} className="flex flex-row gap-4">
        {POINTS_TYPE.map((type) => (
          <Radio key={type.id} value={type.id} onPress={() => void handleChange(type.id)}>
            <RadioIndicator>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>{messages[formatLocalizationKey(type.localizationKey)]}</RadioLabel>
          </Radio>
        ))}
      </RadioGroup>
    </VStack>
  );
};

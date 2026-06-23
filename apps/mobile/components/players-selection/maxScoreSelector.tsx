import { WIN_SCORE_OPTIONS } from "@belot/constants";
import { useMaxScoreSelection } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function MaxScoreSelector() {
  const label = useLocalization("players.maxScore.label");
  const { maxScore, handleMaxScoreChange } = useMaxScoreSelection();

  return (
    <VStack space="md">
      <Text className="text-center text-lg">{label}</Text>
      <HStack className="justify-center gap-2.5">
        {WIN_SCORE_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={maxScore === option ? "solid" : "outline"}
            action="primary"
            onPress={() => handleMaxScoreChange(option)}
            testID={`max-score-button-${option}`}
          >
            <ButtonText>{option}</ButtonText>
          </Button>
        ))}
      </HStack>
    </VStack>
  );
}

import { useCallback } from "react";

import { useGameStore } from "@belot/store";

import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

import { useLocalization } from "@/localizations/useLocalization";

import { Pencil } from "lucide-react-native";

import { RoundPlayerSelectProps } from "./roundPlayerSelect";

type RoundPlayerDisplayProps = RoundPlayerSelectProps;

export default function RoundPlayerDisplay({
  roundPlayer,
  setRoundPlayer,
}: RoundPlayerDisplayProps) {
  const stateRoundPlayer = useGameStore((state) => state.roundPlayer);

  const roundPlayerMsg = useLocalization("next.round.player.display", [
    stateRoundPlayer?.name ?? roundPlayer?.name,
  ]);

  const handleRoundPlayerEdit = useCallback(() => {
    setRoundPlayer(null);
  }, [setRoundPlayer]);

  return (
    <HStack className="flex-wrap items-center justify-center gap-1">
      <Text bold className="text-primary-500">
        {roundPlayerMsg}
      </Text>
      {!stateRoundPlayer && (
        <Button variant="link" className="h-fit p-1" onPress={handleRoundPlayerEdit}>
          <Icon as={Pencil} className="text-blue-500" size="sm" />
        </Button>
      )}
    </HStack>
  );
}

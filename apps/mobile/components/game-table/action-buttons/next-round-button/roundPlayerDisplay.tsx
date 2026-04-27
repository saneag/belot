import { Dispatch, SetStateAction, useCallback } from "react";

import { useLocalization } from "@belot/localizations";
import { Player } from "@belot/types";

import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

import { Pencil } from "lucide-react-native";

export interface RoundPlayerDisplayProps {
  roundPlayer: Player | null;
  setRoundPlayer: Dispatch<SetStateAction<Player | null>>;
}

export default function RoundPlayerDisplay({
  roundPlayer,
  setRoundPlayer,
}: RoundPlayerDisplayProps) {
  const roundPlayerMsg = useLocalization("next.round.player.display", [roundPlayer?.name]);

  const handleRoundPlayerEdit = useCallback(() => {
    setRoundPlayer(null);
  }, [setRoundPlayer]);

  return (
    <HStack className="flex-wrap items-center justify-center gap-1">
      <Text bold className="text-primary-500">
        {roundPlayerMsg}
      </Text>
      {roundPlayer && (
        <Button variant="link" className="h-fit p-1" onPress={handleRoundPlayerEdit}>
          <Icon as={Pencil} className="text-blue-500" size="sm" />
        </Button>
      )}
    </HStack>
  );
}

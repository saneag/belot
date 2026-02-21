import { useCallback, useMemo } from "react";

import { View } from "react-native";

import { useGameStore } from "@belot/store";
import { Player } from "@belot/types";
import { isPlayerNameValid } from "@belot/utils";

import { CloseIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useLocalization } from "@/localizations/useLocalization";

import { EmptyNameError, RepeatingNamesError } from "./inputErrors";
import { usePlayersSelectionContext } from "./playersSelectionContext";

export interface PlayersNamesInputProps {
  player: Player;
}

export default function PlayersNamesInput({ player }: PlayersNamesInputProps) {
  const playerNameInputLabel = useLocalization("players.names.input.label", [player.id + 1]);

  const { validations, resetValidations } = usePlayersSelectionContext();
  const updatePlayer = useGameStore((state) => state.updatePlayer);

  const isInvalid = useMemo(
    () => !isPlayerNameValid(validations, player.id),
    [player.id, validations],
  );

  const handlePlayerNameChange = useCallback(
    (value: string) => {
      updatePlayer(player.id, {
        name: value,
      });
      resetValidations();
    },
    [player.id, resetValidations, updatePlayer],
  );

  return (
    <View>
      <VStack>
        <Text className="ms-2 text-typography-500">{playerNameInputLabel}</Text>
        <Input isInvalid={isInvalid} className="w-[130px] bg-secondary-50/90" variant="rounded">
          <InputField
            value={player.name}
            onChangeText={handlePlayerNameChange}
            maxLength={15}
            className="pe-1 ps-2"
            type="text"
          />
          <InputSlot className="pe-2" onPress={() => handlePlayerNameChange("")}>
            <InputIcon as={player.name ? CloseIcon : undefined} />
          </InputSlot>
        </Input>
        <View>
          <EmptyNameError player={player} />
          <RepeatingNamesError player={player} />
        </View>
      </VStack>
    </View>
  );
}

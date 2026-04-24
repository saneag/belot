import { useHandlePlayersNames } from "@belot/hooks";
import { Player } from "@belot/types";

import { CloseIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useLocalization } from "@/localizations/useLocalization";

import { EmptyNameError, RepeatingNamesError } from "./inputErrors";

export interface PlayersNamesInputProps {
  player: Player;
}

export default function PlayersNamesInput({ player }: PlayersNamesInputProps) {
  const playerNameInputLabel = useLocalization("players.names.input.label", [player.id + 1]);

  const { isInvalid, handlePlayerNameChange } = useHandlePlayersNames({ player });

  return (
    <VStack>
      <Text className="ms-2 text-typography-500">{playerNameInputLabel}</Text>
      <Input isInvalid={isInvalid} className="w-[136px] bg-secondary-50/90" variant="rounded">
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
      <VStack space="xs">
        <EmptyNameError player={player} />
        <RepeatingNamesError player={player} />
      </VStack>
    </VStack>
  );
}

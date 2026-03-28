import { useCallback, useMemo } from "react";

import { useGameStore } from "@belot/store";
import { type Player } from "@belot/types";
import { isPlayerNameValid } from "@belot/utils/src";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { useLocalization } from "@/localizations/useLocalization";

import { X } from "lucide-react";

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
    <div className="flex flex-col">
      <span className="ms-2 text-gray-400">{playerNameInputLabel}</span>
      <Field data-invalid={isInvalid} className="w-32.5">
        <InputGroup className="bg-secondary/95 rounded-2xl border-none">
          <InputGroupInput
            aria-invalid={isInvalid}
            className="ps-2 pe-1"
            maxLength={15}
            type="text"
            value={player.name}
            onChange={(e) => handlePlayerNameChange(e.target.value)}
          />
          <InputGroupAddon
            align="inline-end"
            hidden={!player.name}
            onClick={() => handlePlayerNameChange("")}
            className="cursor-pointer"
          >
            <X />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <div className="flex flex-col">
        <EmptyNameError player={player} />
        <RepeatingNamesError player={player} />
      </div>
      {/* <Input className="bg-secondary-50/90 w-32.5">
        <InputField
          value={player.name}
          onChangeText={handlePlayerNameChange}
          maxLength={15}
          className="ps-2 pe-1"
          type="text"
        />
        <InputSlot className="pe-2" onPress={() => handlePlayerNameChange("")}>
          <InputIcon as={player.name ? CloseIcon : undefined} />
        </InputSlot>
      </Input>
      <VStack space="xs">
        <EmptyNameError player={player} />
        <RepeatingNamesError player={player} />
      </VStack> */}
    </div>
  );
}

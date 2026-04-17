import { useCallback, useMemo } from "react";

import { useGameStore } from "@belot/store";
import { type Player } from "@belot/types";
import { isPlayerNameValid } from "@belot/utils/src";

import { Field } from "@/components/ui/field";
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
      <Field data-invalid={isInvalid} className="w-34">
        <InputGroup className="bg-input-field/90 rounded-2xl border-none">
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
    </div>
  );
}

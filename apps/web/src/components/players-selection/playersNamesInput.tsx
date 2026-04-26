import { useHandlePlayersNames } from "@belot/hooks";
import { type Player } from "@belot/types";

import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { useLocalization } from "@/localizations/useLocalization";

import { X } from "lucide-react";

import { EmptyNameError, RepeatingNamesError } from "./inputErrors";

export interface PlayersNamesInputProps {
  player: Player;
}

export default function PlayersNamesInput({ player }: PlayersNamesInputProps) {
  const playerNameInputLabel = useLocalization("players.names.input.label", [player.id + 1]);

  const { isInvalid, handlePlayerNameChange } = useHandlePlayersNames({ player });

  return (
    <div className="flex flex-col">
      <Field data-invalid={isInvalid} className="w-34 gap-0">
        <FieldLabel className="ms-2 mb-0.5">{playerNameInputLabel}</FieldLabel>
        <InputGroup className="bg-input-field/90 rounded-2xl">
          <InputGroupInput
            aria-invalid={isInvalid}
            className="rounded-2xl ps-2 pe-1"
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
        <div className="flex flex-col">
          <EmptyNameError player={player} />
          <RepeatingNamesError player={player} />
        </div>
      </Field>
    </div>
  );
}

import { usePlayersSelectionContext } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";
import { isPlayerNameValid, isPlayersNamesEmpty, isPlayersNamesRepeating } from "@belot/utils/src";

import { FieldDescription } from "@/components/ui/field";

import { type PlayersNamesInputProps } from "./playersNamesInput";

type InputErrorsProps = PlayersNamesInputProps;

export function EmptyNameError({ player }: InputErrorsProps) {
  const { validations } = usePlayersSelectionContext();

  const emptyError = useLocalization("players.names.input.empty.error");

  const isInvalid = !isPlayerNameValid(validations, player.id);
  const isNameEmpty = isInvalid && isPlayersNamesEmpty(validations, player.id);

  return (
    isNameEmpty && (
      <FieldDescription className="text-center text-sm text-red-500">{emptyError}</FieldDescription>
    )
  );
}

export function RepeatingNamesError({ player }: InputErrorsProps) {
  const { validations } = usePlayersSelectionContext();

  const duplicatedName = useLocalization("players.names.input.duplicated.name.error");

  const isInvalid = !isPlayerNameValid(validations, player.id);
  const isRepeatingName = isInvalid && isPlayersNamesRepeating(validations, player.id);

  return (
    isRepeatingName && (
      <FieldDescription className="text-center text-sm text-red-500">
        {duplicatedName}
      </FieldDescription>
    )
  );
}

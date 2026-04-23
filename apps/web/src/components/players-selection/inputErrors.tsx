import { isPlayerNameValid, isPlayersNamesEmpty, isPlayersNamesRepeating } from "@belot/utils/src";

import { usePlayersSelectionContext } from "@/hooks/players-selection/usePlayersSelectionContext";
import { useLocalization } from "@/localizations/useLocalization";

import { type PlayersNamesInputProps } from "./playersNamesInput";

type InputErrorsProps = PlayersNamesInputProps;

export function EmptyNameError({ player }: InputErrorsProps) {
  const { validations } = usePlayersSelectionContext();

  const emptyError = useLocalization("players.names.input.empty.error");

  const isInvalid = !isPlayerNameValid(validations, player.id);
  const isNameEmpty = isInvalid && isPlayersNamesEmpty(validations, player.id);

  return isNameEmpty && <span className="text-center text-sm text-red-500">{emptyError}</span>;
}

export function RepeatingNamesError({ player }: InputErrorsProps) {
  const { validations } = usePlayersSelectionContext();

  const duplicatedName = useLocalization("players.names.input.duplicated.name.error");

  const isInvalid = !isPlayerNameValid(validations, player.id);
  const isRepeatingName = isInvalid && isPlayersNamesRepeating(validations, player.id);

  return (
    isRepeatingName && <span className="text-center text-sm text-red-500">{duplicatedName}</span>
  );
}

import { isPlayerNameValid, isPlayersNamesEmpty, isPlayersNamesRepeating } from "@belot/utils";

import { Text } from "@/components/ui/text";

import { useLocalization } from "@/localizations/useLocalization";

import { PlayersNamesInputProps } from "./playersNamesInput";
import { usePlayersSelectionContext } from "./playersSelectionContext";

type InputErrorsProps = PlayersNamesInputProps;

export function EmptyNameError({ player }: InputErrorsProps) {
  const { validations } = usePlayersSelectionContext();

  const emptyError = useLocalization("players.names.input.empty.error");

  const isInvalid = !isPlayerNameValid(validations, player.id);
  const isNameEmpty = isInvalid && isPlayersNamesEmpty(validations, player.id);

  return (
    isNameEmpty && (
      <Text bold className="text-center text-red-500" size="sm">
        {emptyError}
      </Text>
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
      <Text bold className="text-center text-red-500" size="sm">
        {duplicatedName}
      </Text>
    )
  );
}

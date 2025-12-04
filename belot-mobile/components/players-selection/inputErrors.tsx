import { HelperText } from 'react-native-paper';
import {
  isPlayerNameValid,
  isPlayersNamesEmpty,
  isPlayersNamesRepeating,
} from '@belot/shared';
import { useLocalization } from '@/localizations/useLocalization';
import { PlayersNamesInputProps } from './playersNamesInput';

export function EmptyNameError({
  validations,
  player,
}: Omit<PlayersNamesInputProps, 'resetValidation'>) {
  const emptyError = useLocalization('players.names.input.empty.error');

  const isInvalid = !isPlayerNameValid(validations, player.id);
  const isNameEmpty = isInvalid && isPlayersNamesEmpty(validations, player.id);

  return (
    isNameEmpty && (
      <HelperText
        type="error"
        variant="bodySmall"
        padding="none"
        visible={isNameEmpty}
      >
        {emptyError}
      </HelperText>
    )
  );
}

export function RepeatingNamesError({
  validations,
  player,
}: Omit<PlayersNamesInputProps, 'resetValidation'>) {
  const duplicatedName = useLocalization(
    'players.names.input.duplicated.name.error'
  );

  const isInvalid = !isPlayerNameValid(validations, player.id);
  const isRepeatingName =
    isInvalid && isPlayersNamesRepeating(validations, player.id);

  return (
    isRepeatingName && (
      <HelperText
        type="error"
        variant="bodySmall"
        padding="none"
        visible={isRepeatingName}
      >
        {duplicatedName}
      </HelperText>
    )
  );
}

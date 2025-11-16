import { HelperText } from 'react-native-paper';
import {
  isPlayerNameValid,
  isPlayersNamesEmpty,
  isPlayersNamesRepeating,
} from '../../helpers/playerNamesValidations';
import { PlayersNamesInputProps } from './playersNamesInput';

export function EmptyNameError({
  validations,
  player,
}: Omit<PlayersNamesInputProps, 'resetValidation'>) {
  const isInvalid = !isPlayerNameValid(validations, player.id);
  const isNameEmpty = isInvalid && isPlayersNamesEmpty(validations, player.id);

  return (
    isNameEmpty && (
      <HelperText
        type='error'
        variant='bodySmall'
        padding='none'
        visible={isNameEmpty}>
        Please enter a name
      </HelperText>
    )
  );
}

export function RepeatingNamesError({
  validations,
  player,
}: Omit<PlayersNamesInputProps, 'resetValidation'>) {
  const isInvalid = !isPlayerNameValid(validations, player.id);
  const isRepeatingName =
    isInvalid && isPlayersNamesRepeating(validations, player.id);

  return (
    isRepeatingName && (
      <HelperText
        type='error'
        variant='bodySmall'
        padding='none'
        visible={isRepeatingName}>
        Duplicated name
      </HelperText>
    )
  );
}

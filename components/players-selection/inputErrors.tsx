import { HelperText } from 'react-native-paper';
import {
  isPlayerNameValid,
  isPlayersNamesEmpty,
  isPlayersNamesRepeating,
} from '../../helpers/playerNamesValidations';
import { PlayersNamesInputProps } from './playersNamesInput';

export function EmptyNameError({
  validations,
  index,
}: Omit<PlayersNamesInputProps, 'resetValidation'>) {
  const isInvalid = !isPlayerNameValid(validations, index);
  const isNameEmpty = isInvalid && isPlayersNamesEmpty(validations, index);

  return (
    isNameEmpty && (
      <HelperText
        type='error'
        variant='bodySmall'
        visible={isNameEmpty}>
        Please enter a name
      </HelperText>
    )
  );
}

export function RepeatingNamesError({
  validations,
  index,
}: Omit<PlayersNamesInputProps, 'resetValidation'>) {
  const isInvalid = !isPlayerNameValid(validations, index);
  const isRepeatingName =
    isInvalid && isPlayersNamesRepeating(validations, index);

  return (
    isRepeatingName && (
      <HelperText
        type='error'
        variant='bodySmall'
        visible={isRepeatingName}>
        You have already a similar name
      </HelperText>
    )
  );
}

import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
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
      <Text
        variant='bodySmall'
        style={style.error}>
        Please enter a name
      </Text>
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
      <Text
        variant='bodySmall'
        style={style.error}>
        You have already a similar name
      </Text>
    )
  );
}

const style = StyleSheet.create({
  error: {
    paddingStart: 5,
  },
});

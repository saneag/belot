import { useCallback } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { isPlayerNameValid } from '../../helpers/playerNamesValidations';
import { usePlayersStore } from '../../store/players';
import DismissKeyboardView from '../dismissKeyboardView';
import { EmptyNameError, RepeatingNamesError } from './inputErrors';
import { PlayersNamesProps } from './playersNames';

export interface PlayersNamesInputProps extends PlayersNamesProps {
  index: number;
}

export default function PlayersNamesInput({
  validations,
  resetValidation,
  index,
}: PlayersNamesInputProps) {
  const playersNames = usePlayersStore((state) => state.playersNames);
  const setPlayersNames = usePlayersStore((state) => state.setPlayersNames);

  const isInvalid = !isPlayerNameValid(validations, index);

  const handlePlayersNamesChange = useCallback(
    (value: string, index: number) => {
      setPlayersNames({
        ...playersNames,
        [index]: value,
      });

      resetValidation();
    },
    [playersNames, resetValidation, setPlayersNames]
  );

  return (
    <DismissKeyboardView>
      <View>
        <TextInput
          mode='outlined'
          label={`Player ${index + 1}`}
          value={playersNames[index] ?? ''}
          onChangeText={(value) => handlePlayersNamesChange(value, index)}
          style={{ borderRadius: 12, maxHeight: 60, width: 130 }}
          error={isInvalid}
          theme={{
            roundness: 12,
          }}
          right={
            playersNames[index] && (
              <TextInput.Icon
                icon='close'
                onPress={() => handlePlayersNamesChange('', index)}
              />
            )
          }
        />
        <EmptyNameError
          index={index}
          validations={validations}
        />
        <RepeatingNamesError
          index={index}
          validations={validations}
        />
      </View>
    </DismissKeyboardView>
  );
}

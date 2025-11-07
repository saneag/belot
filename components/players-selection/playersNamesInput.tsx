import { useCallback } from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { isPlayerNameValid } from '../../helpers/playerNamesValidations';
import { usePlayersStore } from '../../store/players';
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
  const playersCount = usePlayersStore((state) => state.playersCount);
  const playersNames = usePlayersStore((state) => state.playersNames);
  const setPlayersNames = usePlayersStore((state) => state.setPlayersNames);

  const isInvalid = !isPlayerNameValid(validations, index);

  const handlePlayersNamesChange = useCallback(
    (value: string, index: number) => {
      setPlayersNames({
        [index]: value,
      });

      resetValidation();
    },
    [resetValidation, setPlayersNames]
  );

  return (
    <View>
      {playersCount === 4 && index === 0 && <Text>Team 1</Text>}
      {playersCount === 4 && index === 2 && (
        <Text style={{ marginTop: 10 }}>Team 2</Text>
      )}
      <TextInput
        mode='outlined'
        label={`Player ${index + 1}`}
        value={playersNames[index]}
        onChangeText={(value) => handlePlayersNamesChange(value, index)}
        style={{ borderRadius: 12, maxHeight: 60 }}
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
  );
}

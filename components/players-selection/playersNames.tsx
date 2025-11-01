import { usePlayersStore } from '@/store/players';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import {
  isPlayerNameValid,
  isPlayersNamesEmpty,
  isPlayersNamesRepeating,
} from '../../helpers/playerNamesValidations';
import { PlayersNamesValidation } from '../../types/validations';

interface PlayersNamesProps {
  validations: PlayersNamesValidation;
  resetValidation: VoidFunction;
}

export default function PlayersNames({
  validations,
  resetValidation,
}: PlayersNamesProps) {
  const playersCount = usePlayersStore((state) => state.playersCount);
  const playersNames = usePlayersStore((state) => state.playersNames);
  const setPlayersNames = usePlayersStore((state) => state.setPlayersNames);

  const players = useMemo(
    () => Array.from({ length: playersCount }),
    [playersCount]
  );

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
    <View style={{ gap: 15 }}>
      {players.map((_, index) => {
        const isInvalid = !isPlayerNameValid(validations, index);
        const isNameEmpty =
          isInvalid && isPlayersNamesEmpty(validations, index);
        const isRepeatingName =
          isInvalid && isPlayersNamesRepeating(validations, index);

        return (
          <View key={index}>
            <View style={{ gap: 5 }}>
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
              {isNameEmpty && (
                <Text
                  variant='bodySmall'
                  style={style.error}>
                  Please enter a name
                </Text>
              )}
              {isRepeatingName && (
                <Text
                  variant='bodySmall'
                  style={style.error}>
                  You have already a similar name
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const style = StyleSheet.create({
  error: {
    paddingStart: 5,
  },
});

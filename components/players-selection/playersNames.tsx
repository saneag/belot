import { usePlayersStore } from '@/store/players';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

interface PlayersNamesProps {
  isFormValid: boolean;
  setIsFormValid: (isValid: boolean) => void;
}

export default function PlayersNames({
  isFormValid,
  setIsFormValid,
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
      setIsFormValid(true);
    },
    [setIsFormValid, setPlayersNames]
  );

  return (
    <View style={{ gap: 15 }}>
      {players.map((_, index) => (
        <TextInput
          key={index}
          mode='outlined'
          label={`Player ${index + 1}`}
          value={playersNames[index]}
          onChangeText={(value) => handlePlayersNamesChange(value, index)}
          style={{ borderRadius: 12, maxHeight: 60 }}
          error={!isFormValid && !playersNames[index].trim()}
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
      ))}
    </View>
  );
}

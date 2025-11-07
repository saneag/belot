import { usePlayersStore } from '@/store/players';
import { useMemo } from 'react';
import { View } from 'react-native';
import { PlayersNamesValidation } from '../../types/validations';
import PlayersNamesInput from './playersNamesInput';

export interface PlayersNamesProps {
  validations: PlayersNamesValidation;
  resetValidation: VoidFunction;
}

export default function PlayersNames({
  validations,
  resetValidation,
}: PlayersNamesProps) {
  const playersCount = usePlayersStore((state) => state.playersCount);

  const players = useMemo(
    () => Array.from({ length: playersCount }),
    [playersCount]
  );

  return (
    <View style={{ gap: 10 }}>
      {players.map((_, index) => {
        return (
          <View key={index}>
            <PlayersNamesInput
              validations={validations}
              resetValidation={resetValidation}
              index={index}
            />
          </View>
        );
      })}
    </View>
  );
}

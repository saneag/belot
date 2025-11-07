import { usePlayersStore } from '@/store/players';
import { useMemo } from 'react';
import { View } from 'react-native';
import {
  getRightPosition,
  getTopPosition,
} from '../../helpers/playerNamesHelpers';
import { PlayersNamesValidation } from '../../types/validations';
import PlayersNamesInput from './playersNamesInput';
import PlayersTable from './playersTable';

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
    <PlayersTable>
      {players.map((_, index) => {
        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              top: getTopPosition(index, playersCount),
              right: getRightPosition(index, playersCount),
            }}>
            <PlayersNamesInput
              validations={validations}
              resetValidation={resetValidation}
              index={index}
            />
          </View>
        );
      })}
    </PlayersTable>
  );
}

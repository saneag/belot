import { useMemo } from 'react';
import { View } from 'react-native';
import {
  getPlayersCount,
  getRightPosition,
  getRotation,
  getTopPosition,
} from '@belot/shared';
import { useGameStore } from '@/store/game';
import { PlayersNamesValidation } from '@/types/validations';
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
  const players = useGameStore((state) => state.players);

  const playersCount = useMemo(() => getPlayersCount(players), [players]);

  return (
    <PlayersTable>
      {players.map((player, index) => (
        <View
          key={player.id}
          style={{
            position: 'absolute',
            top: getTopPosition(index, playersCount),
            right: getRightPosition(index, playersCount),
            transform: getRotation(index, playersCount),
          }}
        >
          <PlayersNamesInput
            validations={validations}
            resetValidation={resetValidation}
            player={player}
          />
        </View>
      ))}
    </PlayersTable>
  );
}

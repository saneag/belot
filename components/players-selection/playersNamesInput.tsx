import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { isPlayerNameValid } from '../../helpers/playerNamesValidations';
import { useGameStore } from '../../store/game';
import { Player } from '../../types/game';
import { EmptyNameError, RepeatingNamesError } from './inputErrors';
import { PlayersNamesProps } from './playersNames';

export interface PlayersNamesInputProps extends PlayersNamesProps {
  player: Player;
}

export default function PlayersNamesInput({
  validations,
  resetValidation,
  player,
}: PlayersNamesInputProps) {
  const updatePlayer = useGameStore((state) => state.updatePlayer);

  const isInvalid = useMemo(
    () => !isPlayerNameValid(validations, player.id),
    [player.id, validations]
  );

  const handlePlayerNameChange = useCallback(
    (value: string) => {
      updatePlayer(player.id, {
        name: value,
      });
      resetValidation();
    },
    [player.id, resetValidation, updatePlayer]
  );

  return (
    <View>
      <TextInput
        mode="outlined"
        label={`Player ${player.id + 1}`}
        value={player.name}
        onChangeText={handlePlayerNameChange}
        style={{ maxHeight: 60, width: 130 }}
        error={isInvalid}
        theme={{
          roundness: 30,
        }}
        maxLength={15}
        right={
          player.name && (
            <TextInput.Icon
              icon="close"
              onPress={() => handlePlayerNameChange('')}
            />
          )
        }
      />
      <EmptyNameError player={player} validations={validations} />
      <RepeatingNamesError player={player} validations={validations} />
    </View>
  );
}

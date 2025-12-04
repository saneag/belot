import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useLoadPreviousGame } from '@/hooks/useLoadPreviousGame';
import { useLocalization } from '@/localizations/useLocalization';
import { PlayersNamesValidation } from '@belot/shared';
import DismissKeyboardView from '../dismissKeyboardView';
import LoadPreviousGameButton from './loadPreviousGameButton';
import PlayersCount from './playersCount';
import PlayersNames from './playersNames';
import ResetButton from './resetButton';
import SubmitButton from './submitButton';

export default function PlayersSelection() {
  const playersSetupMsg = useLocalization('players.setup');

  const [validations, setValidations] = useState<PlayersNamesValidation>({
    emptyNames: [],
    repeatingNames: [],
  });

  const resetValidation = useCallback(() => {
    setValidations({
      emptyNames: [],
      repeatingNames: [],
    });
  }, []);

  useLoadPreviousGame();

  return (
    <DismissKeyboardView>
      <Text style={style.header}>{playersSetupMsg}</Text>

      <View style={style.form}>
        <PlayersCount resetValidations={resetValidation} />
        <PlayersNames
          validations={validations}
          resetValidation={resetValidation}
        />

        <View style={style.buttonsGroup}>
          <View style={style.submitButtons}>
            <ResetButton resetValidation={resetValidation} />
            <SubmitButton setValidations={setValidations} />
          </View>
          <LoadPreviousGameButton />
        </View>
      </View>
    </DismissKeyboardView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  buttonsGroup: {
    gap: 20,
  },
  submitButtons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
  },
});

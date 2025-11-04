import { useLoadPlayersNames } from '@/hooks/useLoadPlayersNames';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { PlayersNamesValidation } from '../../types/validations';
import PlayersCount from './playersCount';
import PlayersNames from './playersNames';
import ResetButton from './resetButton';
import SubmitButton from './submitButton';

export default function PlayersSelection() {
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

  useLoadPlayersNames();

  return (
    <>
      <Text style={styles.header}>Setup</Text>

      <View style={styles.form}>
        <PlayersCount />
        <PlayersNames
          validations={validations}
          resetValidation={resetValidation}
        />

        <View style={styles.buttonsGroup}>
          <ResetButton resetValidation={resetValidation} />
          <SubmitButton setValidations={setValidations} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    marginBottom: 20,
  },
  form: {
    gap: 20,
  },
  buttonsGroup: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

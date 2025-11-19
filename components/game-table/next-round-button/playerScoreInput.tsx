import { useCallback } from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

export default function PlayerScoreInput() {
  const handleInputChange = useCallback((value: string) => {}, []);

  return (
    <View>
      <TextInput
        label="Score"
        mode="outlined"
        maxLength={3}
        keyboardType="number-pad"
        style={{ minHeight: 60 }}
        value={''}
        onChangeText={handleInputChange}
        selectTextOnFocus
      />
      <HelperText type="info">Please enter micropoints</HelperText>
    </View>
  );
}

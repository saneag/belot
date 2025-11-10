import { Dispatch, SetStateAction, useCallback } from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

export interface PlayerScoreInputProps {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
}

export default function PlayerScoreInput({
  inputValue,
  setInputValue,
}: PlayerScoreInputProps) {
  const handleInputChange = useCallback(
    (value: string) => {
      const numberValue = value.replace(/[^0-9]/g, '');
      setInputValue(numberValue);
    },
    [setInputValue]
  );

  return (
    <View>
      <TextInput
        label='Score'
        mode='outlined'
        maxLength={3}
        keyboardType='number-pad'
        style={{ minHeight: 60 }}
        value={inputValue}
        onChangeText={handleInputChange}
        selectTextOnFocus
      />
      <HelperText type='info'>Please enter micropoints</HelperText>
    </View>
  );
}

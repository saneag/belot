import { ReactNode } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

interface DismissKeyboardViewProps {
  children: ReactNode;
}

export default function DismissKeyboardView({
  children,
}: DismissKeyboardViewProps) {
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
}

import { ReactNode } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';

interface DismissKeyboardViewProps {
  children: ReactNode;
}

export default function DismissKeyboardView({
  children,
}: DismissKeyboardViewProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
}

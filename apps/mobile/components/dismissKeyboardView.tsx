import { ReactNode } from "react";

import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

interface DismissKeyboardViewProps {
  children: ReactNode;
}

export default function DismissKeyboardView({ children }: DismissKeyboardViewProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {Array.isArray(children) ? <View>{children}</View> : children}
    </TouchableWithoutFeedback>
  );
}

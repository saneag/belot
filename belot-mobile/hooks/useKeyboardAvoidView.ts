import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

export const useKeyboardAvoidView = () => {
  const [bottom, setBottom] = useState(0);

  useEffect(() => {
    function onKeyboardChange(e: KeyboardEvent) {
      if (Platform.OS === 'ios') {
        if (
          e?.startCoordinates &&
          e.endCoordinates.screenY < e.startCoordinates.screenY
        ) {
          setBottom(e.endCoordinates.height / 2);
        } else {
          setBottom(0);
        }
      } else {
        if (e?.endCoordinates?.height) {
          setBottom(e.endCoordinates.height / 2);
        } else {
          setBottom(0);
        }
      }
    }

    if (Platform.OS === 'ios') {
      const subscription = Keyboard.addListener(
        'keyboardWillChangeFrame',
        onKeyboardChange
      );
      return () => subscription.remove();
    }

    const subscriptions = [
      Keyboard.addListener('keyboardDidHide', onKeyboardChange),
      Keyboard.addListener('keyboardDidShow', onKeyboardChange),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, []);

  return bottom;
};

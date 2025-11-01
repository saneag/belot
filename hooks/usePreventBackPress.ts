import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export const usePreventBackPress = () => {
  useEffect(() => {
    const onBackPress = () => true;

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => subscription.remove();
  }, []);
};

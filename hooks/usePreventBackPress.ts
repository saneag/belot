import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

export const usePreventBackPress = (showConfirmationDialog?: VoidFunction) => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        showConfirmationDialog?.();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [showConfirmationDialog])
  );
};

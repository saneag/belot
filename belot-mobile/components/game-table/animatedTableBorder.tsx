import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useAppTheme } from '../../helpers/themeHelpers';

const INITIAL_BORDER_WIDTH = 1;

export default function AnimatedTableBorder() {
  const { colors } = useAppTheme();

  const borderAnimation = useRef(
    new Animated.Value(INITIAL_BORDER_WIDTH)
  ).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnimation, {
          toValue: 2.5,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnimation, {
          toValue: INITIAL_BORDER_WIDTH,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    );

    animationRef.current.start();

    return () => {
      animationRef.current?.stop();
      borderAnimation.setValue(INITIAL_BORDER_WIDTH);
    };
  }, [borderAnimation]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style.animatedBorder,
        {
          borderColor: colors.blue,
          borderWidth: borderAnimation,
        },
      ]}
    />
  );
}

const style = StyleSheet.create({
  animatedBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderStartEndRadius: 8,
    borderEndEndRadius: 8,
  },
});

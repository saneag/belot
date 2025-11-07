import { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { TABLE_HEIGHT, TABLE_WIDTH } from '../../constants/gameConstants';

interface PlayersTableProps {
  children: ReactNode;
}

export default function PlayersTable({ children }: PlayersTableProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={style.container}>
      <View
        style={[
          style.circle,
          {
            left: width / 2,
            transform: [{ translateX: -150 }],
          },
        ]}>
        {children}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    position: 'relative',
    height: 280,
  },
  circle: {
    width: TABLE_WIDTH,
    height: TABLE_HEIGHT,
    marginTop: 15,
    borderRadius: 1200,
    borderWidth: 4,
    borderColor: '#3f3f3fff',
    // shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // elevation (Android)
    elevation: 4,
  },
});

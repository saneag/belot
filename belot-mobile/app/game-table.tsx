import { StyleSheet, View } from 'react-native';
import { Divider } from 'react-native-paper';
import GameTable from '@/components/game-table';
import Header from '@/components/game-table/header';

export default function GameTableScreen() {
  return (
    <View style={style.container}>
      <Header />
      <Divider bold style={style.divider} />
      <GameTable />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'space-between',
  },
  divider: {
    marginBottom: 10,
  },
});

import { createStackNavigator } from "@react-navigation/stack";

import GameTableScreen from "@/app/game-table";
import PlayersSelectionScreen from "@/app/players-selection";
import SettingsScreen from "@/app/settings-screen";
import StartingScreen from "@/app/starting-screen";

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator
      initialRouteName="starting-screen"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "transparent", padding: 0, margin: 0 },
      }}
    >
      <Stack.Screen name="starting-screen" component={StartingScreen} />
      <Stack.Screen name="players-selection" component={PlayersSelectionScreen} />
      <Stack.Screen name="game-table" component={GameTableScreen} />
      <Stack.Screen name="settings-screen" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

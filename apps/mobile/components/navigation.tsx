import { createStackNavigator } from "@react-navigation/stack";

import GameTableScreen from "@/app/game-table";
import PlayersSelectionScreen from "@/app/players-selection";
import StartingScreen from "@/app/starting-screen";
import { routes } from "@/constants/routes";

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator
      initialRouteName={routes.startingScreen}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "transparent", padding: 0, margin: 0 },
      }}
    >
      <Stack.Screen name={routes.startingScreen} component={StartingScreen} />
      <Stack.Screen name={routes.playersSelection} component={PlayersSelectionScreen} />
      <Stack.Screen name={routes.gameTable} component={GameTableScreen} />
    </Stack.Navigator>
  );
}

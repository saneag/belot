import { routes } from '@/constants/routes';
import { createStackNavigator } from '@react-navigation/stack';
import PlayersSelectionScreen from '../app/players-selection';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator
      initialRouteName={routes.playersSelection}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent', padding: 0, margin: 0 },
      }}>
      <Stack.Screen
        name={routes.playersSelection}
        component={PlayersSelectionScreen}
      />
    </Stack.Navigator>
  );
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { routes } from '../constants/routes';
import PlayersSelectionScreen from '../screens/players-selection';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={routes.playersSelection}>
        <Stack.Screen
          name={routes.playersSelection}
          component={PlayersSelectionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

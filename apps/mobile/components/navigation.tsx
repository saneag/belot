import { withLayoutContext } from "expo-router";

import { createStackNavigator } from "@react-navigation/stack";

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext(Navigator);

export const stackScreenOptions = {
  headerShown: false,
  animation: "scale_from_center" as const,
  detachPreviousScreen: true,
  cardStyle: { backgroundColor: "transparent" },
};

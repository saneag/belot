import { View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";

import { useStartingScreenActions } from "@/hooks/starting-screen/useStartingScreenActions";

export default function StartingScreen() {
  const actions = useStartingScreenActions();

  return (
    <View className="flex-1 items-center justify-center">
      <VStack className="gap-3">
        {actions.map((action) => (
          <Button key={action.index} onPress={action.onPress} action="primary" variant="solid">
            <ButtonText>{action.label}</ButtonText>
          </Button>
        ))}
      </VStack>
    </View>
  );
}

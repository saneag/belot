import { useEffect } from "react";

import { Image, Pressable, View } from "react-native";

import { useNavigation, useRouter } from "expo-router";

import { useGameStore } from "@belot/store";

import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";

import { useStartingScreenActions } from "@/hooks/starting-screen/useStartingScreenActions";

export default function StartingScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const pendingReset = useGameStore((state) => state.pendingReset);
  const reset = useGameStore((state) => state.reset);

  useEffect(() => {
    return navigation.addListener("transitionEnd" as never, () => {
      if (pendingReset) {
        reset();
      }
    });
  }, [navigation, pendingReset, reset]);

  const actions = useStartingScreenActions();

  return (
    <View className="flex-1 items-center justify-center">
      <Pressable
        className="absolute top-10"
        onLongPress={() => void router.push("/dev-tools")}
        delayLongPress={1200}
      >
        <VStack className="items-center justify-center gap-3">
          <Image
            source={require("../assets/images/ic_launcher_no_bg.png")}
            style={{ width: 100, height: 100 }}
          />
          <Heading size="4xl" className="text-center font-normal">
            Belot-score
          </Heading>
        </VStack>
      </Pressable>
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

import { useState } from "react";

import { TextInput, View } from "react-native";

import { Link, useRouter } from "expo-router";

import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useAuth } from "@/auth/authContext";

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();
  return (
    <View className="flex-1 justify-center px-6">
      <VStack className="gap-3">
        <Text>Sign in</Text>
        <TextInput
          placeholder="Username or email"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          className="rounded border p-3"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="rounded border p-3"
        />
        <Button
          onPress={() =>
            void signIn({ identifier, password })
              .then(() => router.replace("/starting-screen"))
              .catch((e: unknown) => setError(e instanceof Error ? e.message : "Unable to sign in"))
          }
        >
          <ButtonText>Sign in</ButtonText>
        </Button>
        {error ? <Text>{error}</Text> : null}
        <Link href={"/register" as never}>Create account</Link>
      </VStack>
    </View>
  );
}

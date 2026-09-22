import { useState } from "react";

import { TextInput, View } from "react-native";

import { Link, useRouter } from "expo-router";

import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useAuth } from "@/auth/authContext";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  const router = useRouter();
  return (
    <View className="flex-1 justify-center px-6">
      <VStack className="gap-3">
        <Text>Create account</Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          className="rounded border p-3"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
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
            void signUp({ username, email, password })
              .then(() => router.replace("/starting-screen"))
              .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : "Unable to register"),
              )
          }
        >
          <ButtonText>Register</ButtonText>
        </Button>
        {error ? <Text>{error}</Text> : null}
        <Link href={"/login" as never}>Sign in</Link>
      </VStack>
    </View>
  );
}

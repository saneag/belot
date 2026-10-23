import { useState } from "react";

import { TextInput, View } from "react-native";

import { Link, useRouter } from "expo-router";

import {
  formatLocalizationKey,
  getAuthErrorLocalizationKey,
  useLocalizations,
} from "@belot/localizations";

import { BackButton } from "@/components/backButton";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useAuth } from "@/auth/authContext";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorKey, setErrorKey] = useState<ReturnType<typeof getAuthErrorLocalizationKey> | null>(
    null,
  );
  const { signUp } = useAuth();
  const router = useRouter();
  const messages = useLocalizations([
    { key: "auth.create.account.title" },
    { key: "auth.username.placeholder" },
    { key: "auth.email.placeholder" },
    { key: "auth.password.placeholder" },
    { key: "auth.register" },
    { key: "login" },
    { key: errorKey ?? "auth.error.generic" },
  ]);
  const errorMessage = messages[formatLocalizationKey(errorKey ?? "auth.error.generic")];
  return (
    <View className="flex-1 justify-center px-6">
      <BackButton />
      <VStack className="gap-3">
        <Text>{messages.authCreateAccountTitle}</Text>
        <TextInput
          placeholder={messages.authUsernamePlaceholder}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          className="rounded border p-3"
        />
        <TextInput
          placeholder={messages.authEmailPlaceholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="rounded border p-3"
        />
        <TextInput
          placeholder={messages.authPasswordPlaceholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="rounded border p-3"
        />
        <Button
          onPress={() =>
            void signUp({ username, email, password })
              .then(() => router.replace("/starting-screen"))
              .catch((error: unknown) => setErrorKey(getAuthErrorLocalizationKey(error)))
          }
        >
          <ButtonText>{messages.authRegister}</ButtonText>
        </Button>
        {errorKey ? <Text>{errorMessage}</Text> : null}
        <Link className="self-center" replace href="/login">
          {messages.login}
        </Link>
      </VStack>
    </View>
  );
}

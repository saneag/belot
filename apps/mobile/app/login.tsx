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

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorKey, setErrorKey] = useState<ReturnType<typeof getAuthErrorLocalizationKey> | null>(
    null,
  );
  const { signIn } = useAuth();
  const router = useRouter();
  const messages = useLocalizations([
    { key: "login" },
    { key: "auth.identifier.placeholder" },
    { key: "auth.password.placeholder" },
    { key: "auth.create.account.link" },
    { key: errorKey ?? "auth.error.generic" },
  ]);
  const errorMessage = messages[formatLocalizationKey(errorKey ?? "auth.error.generic")];
  return (
    <View className="flex-1 justify-center px-6">
      <BackButton />
      <VStack className="gap-3">
        <Text>{messages.login}</Text>
        <TextInput
          placeholder={messages.authIdentifierPlaceholder}
          value={identifier}
          onChangeText={setIdentifier}
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
            void signIn({ identifier, password })
              .then(() => router.replace("/starting-screen"))
              .catch((error: unknown) => setErrorKey(getAuthErrorLocalizationKey(error)))
          }
        >
          <ButtonText>{messages.login}</ButtonText>
        </Button>
        {errorKey ? <Text>{errorMessage}</Text> : null}
        <Link className="self-center" replace href="/register">
          {messages.authCreateAccountLink}
        </Link>
      </VStack>
    </View>
  );
}

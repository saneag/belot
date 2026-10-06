import { useState } from "react";

import { TextInput, View } from "react-native";

import { Link, useRouter } from "expo-router";

import { getAuthErrorLocalizationKey, useLocalization } from "@belot/localizations";

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
  const title = useLocalization("auth.create.account.title");
  const usernameLabel = useLocalization("auth.username.placeholder");
  const emailLabel = useLocalization("auth.email.placeholder");
  const passwordLabel = useLocalization("auth.password.placeholder");
  const registerLabel = useLocalization("auth.register");
  const loginLabel = useLocalization("login");
  const errorMessage = useLocalization(errorKey ?? "auth.error.generic");
  return (
    <View className="flex-1 justify-center px-6">
      <BackButton />
      <VStack className="gap-3">
        <Text>{title}</Text>
        <TextInput
          placeholder={usernameLabel}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          className="rounded border p-3"
        />
        <TextInput
          placeholder={emailLabel}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="rounded border p-3"
        />
        <TextInput
          placeholder={passwordLabel}
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
          <ButtonText>{registerLabel}</ButtonText>
        </Button>
        {errorKey ? <Text>{errorMessage}</Text> : null}
        <Link className="self-center" replace href="/login">
          {loginLabel}
        </Link>
      </VStack>
    </View>
  );
}

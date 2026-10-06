import { useState } from "react";

import { TextInput, View } from "react-native";

import { Link, useRouter } from "expo-router";

import { getAuthErrorLocalizationKey, useLocalization } from "@belot/localizations";

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
  const loginLabel = useLocalization("login");
  const identifierPlaceholder = useLocalization("auth.identifier.placeholder");
  const passwordPlaceholder = useLocalization("auth.password.placeholder");
  const createAccountLabel = useLocalization("auth.create.account.link");
  const errorMessage = useLocalization(errorKey ?? "auth.error.generic");
  return (
    <View className="flex-1 justify-center px-6">
      <BackButton />
      <VStack className="gap-3">
        <Text>{loginLabel}</Text>
        <TextInput
          placeholder={identifierPlaceholder}
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          className="rounded border p-3"
        />
        <TextInput
          placeholder={passwordPlaceholder}
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
          <ButtonText>{loginLabel}</ButtonText>
        </Button>
        {errorKey ? <Text>{errorMessage}</Text> : null}
        <Link className="self-center" replace href="/register">
          {createAccountLabel}
        </Link>
      </VStack>
    </View>
  );
}

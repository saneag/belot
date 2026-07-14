import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import DismissKeyboardView from "@/components/dismissKeyboardView";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface PasswordUnlockFormProps {
  error: string | null;
  isLocked: boolean;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  password: string;
  passwordLabel: string;
  tryAgainMessage: string;
  unlockButtonLabel: string;
}

export function PasswordUnlockForm({
  error,
  isLocked,
  onPasswordChange,
  onSubmit,
  password,
  passwordLabel,
  tryAgainMessage,
  unlockButtonLabel,
}: PasswordUnlockFormProps) {
  return (
    <KeyboardAwareScrollView
      className="w-full flex-1 bg-phone-screen-background"
      contentContainerStyle={{ flexGrow: 1, width: "100%" }}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <DismissKeyboardView>
        <VStack className="w-full flex-1 justify-center gap-3">
          <VStack className="w-full gap-2">
            <Text>{passwordLabel}</Text>
            <Input className="w-full" isDisabled={isLocked}>
              <InputField
                value={password}
                onChangeText={onPasswordChange}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Input>
          </VStack>
          {error ? <Text className="text-error-700">{error}</Text> : null}
          {isLocked ? <Text className="text-typography-500">{tryAgainMessage}</Text> : null}
          <Button onPress={onSubmit} isDisabled={isLocked || password.length === 0}>
            <ButtonText>{unlockButtonLabel}</ButtonText>
          </Button>
        </VStack>
      </DismissKeyboardView>
    </KeyboardAwareScrollView>
  );
}

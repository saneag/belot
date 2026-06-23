import { FEATURE_TOGGLES, type FeatureToggleName } from "@belot/constants";
import { useDevTools } from "@belot/hooks";
import { formatLocalizationString } from "@belot/localizations";

import { BackButton } from "@/components/backButton";
import { PageHeader } from "@/components/pageHeader";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { getFromStorage, setToStorage } from "@/helpers/storageHelpers";

const FEATURE_TOGGLE_NAMES = Object.keys(FEATURE_TOGGLES) as FeatureToggleName[];

export default function DevToolsScreen() {
  const {
    auth,
    handleSubmit,
    isLocked,
    messages,
    password,
    setFeatureToggle,
    setPassword,
    toggles,
  } = useDevTools({ getFromStorage, setToStorage });

  return (
    <VStack className="relative w-full flex-1">
      <BackButton />
      <PageHeader title={messages.devToolsTitle} />

      <VStack className="flex-1 justify-center gap-3 px-6 pt-20">
        {auth.isAuthenticated ? (
          FEATURE_TOGGLE_NAMES.map((name) => (
            <HStack
              key={name}
              className="min-h-14 items-center justify-between gap-3 rounded-lg border border-background-300 bg-background-100 px-3 py-2"
            >
              <Text className="text-sm">{name}</Text>
              <Switch
                value={toggles[name]}
                onToggle={(enabled) => void setFeatureToggle(name, enabled)}
                accessibilityLabel={formatLocalizationString(messages.devToolsFeatureToggleLabel, [
                  name,
                ])}
                trackColor={{ false: "#d4d4d4", true: "#525252" }}
                thumbColor="#fafafa"
                ios_backgroundColor="#d4d4d4"
                size="md"
              />
            </HStack>
          ))
        ) : (
          <VStack className="gap-3">
            <VStack className="gap-2">
              <Text>{messages.devToolsPasswordLabel}</Text>
              <Input isDisabled={isLocked}>
                <InputField
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </Input>
            </VStack>
            {auth.error ? <Text className="text-error-700">{auth.error}</Text> : null}
            {isLocked ? (
              <Text className="text-typography-500">{messages.devToolsTryAgainIn}</Text>
            ) : null}
            <Button onPress={handleSubmit} isDisabled={isLocked || password.length === 0}>
              <ButtonText>{messages.devToolsUnlockButton}</ButtonText>
            </Button>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
}

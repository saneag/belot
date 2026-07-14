import { FEATURE_TOGGLES, type FeatureToggleName } from "@belot/constants";
import { useDevTools } from "@belot/hooks";

import { BackButton } from "@/components/backButton";
import { FeatureToggleList } from "@/components/dev-tools/featureToggleList";
import { PasswordUnlockForm } from "@/components/dev-tools/passwordUnlockForm";
import { PageHeader } from "@/components/pageHeader";
import { VStack } from "@/components/ui/vstack";

import { getDevToolsPassword } from "@/helpers/devToolsPassword";
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
  } = useDevTools({ devToolsPassword: getDevToolsPassword(), getFromStorage, setToStorage });

  return (
    <VStack className="relative w-full flex-1">
      <BackButton />
      <PageHeader title={messages.devToolsTitle} />

      <VStack className="flex-1 justify-center gap-3 px-6 pt-20">
        {auth.isAuthenticated ? (
          <FeatureToggleList
            labelTemplate={messages.devToolsFeatureToggleLabel}
            names={FEATURE_TOGGLE_NAMES}
            onToggle={(name, enabled) => void setFeatureToggle(name, enabled)}
            toggles={toggles}
          />
        ) : (
          <PasswordUnlockForm
            error={auth.error}
            isLocked={isLocked}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            password={password}
            passwordLabel={messages.devToolsPasswordLabel}
            tryAgainMessage={messages.devToolsTryAgainIn}
            unlockButtonLabel={messages.devToolsUnlockButton}
          />
        )}
      </VStack>
    </VStack>
  );
}

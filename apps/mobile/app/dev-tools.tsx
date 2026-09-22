import { Redirect } from "expo-router";

import { FEATURE_TOGGLES, type FeatureToggleName } from "@belot/constants";
import { useFeatureToggles } from "@belot/hooks";

import { BackButton } from "@/components/backButton";
import { FeatureToggleList } from "@/components/dev-tools/featureToggleList";
import { PageHeader } from "@/components/pageHeader";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useAuth } from "@/auth/authContext";

const FEATURE_TOGGLE_NAMES = Object.keys(FEATURE_TOGGLES) as FeatureToggleName[];

export default function DevToolsScreen() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Redirect href={"/login" as never} />;
  if (user.role !== "admin")
    return (
      <VStack className="flex-1 items-center justify-center">
        <Text>You do not have permission to manage feature toggles.</Text>
      </VStack>
    );
  const { setFeatureToggle, toggles } = useFeatureToggles();

  return (
    <VStack className="relative w-full flex-1">
      <BackButton />
      <PageHeader title="Feature toggles" />

      <VStack className="flex-1 justify-center gap-3 px-6 pt-20">
        <FeatureToggleList
          labelTemplate="{0} feature toggle"
          names={FEATURE_TOGGLE_NAMES}
          onToggle={(name, enabled) => void setFeatureToggle(name, enabled)}
          toggles={toggles}
        />
      </VStack>
    </VStack>
  );
}

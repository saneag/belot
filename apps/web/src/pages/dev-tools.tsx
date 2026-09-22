import { Navigate } from "react-router-dom";

import { FEATURE_TOGGLES, type FeatureToggleName } from "@belot/constants";
import { useFeatureToggles } from "@belot/hooks";

import { BackButton } from "@/components/backButton";
import { FeatureToggleList } from "@/components/dev-tools/featureToggleList";
import { PageHeader } from "@/components/pageHeader";

import { useAuth } from "@/auth/authContext";

const FEATURE_TOGGLE_NAMES = Object.keys(FEATURE_TOGGLES) as FeatureToggleName[];

export default function DevToolsPage() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: "/dev-tools" }} replace />;
  if (user.role !== "admin")
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        You do not have permission to manage feature toggles.
      </div>
    );
  const { setFeatureToggle, toggles } = useFeatureToggles();

  return (
    <div className="relative flex h-full flex-col items-center">
      <BackButton />
      <PageHeader title="Feature toggles" />

      <div className="flex w-full flex-1 flex-col justify-center px-6 pt-20">
        <FeatureToggleList
          labelTemplate="{0} feature toggle"
          names={FEATURE_TOGGLE_NAMES}
          onToggle={(name, enabled) => void setFeatureToggle(name, enabled)}
          toggles={toggles}
        />
      </div>
    </div>
  );
}

import { useState } from "react";

import { useLocalizations } from "@belot/localizations";
import { formatRemainingTime } from "@belot/utils";

import type { FeatureToggleStorage } from "./featureToggles/types";
import { useFeatureToggles } from "./featureToggles/useFeatureToggle";
import { useDevToolsAuth } from "./useDevToolsAuth";

export const useDevTools = ({ getFromStorage, setToStorage }: FeatureToggleStorage) => {
  const [password, setPassword] = useState("");

  const { toggles, setFeatureToggle } = useFeatureToggles();

  const auth = useDevToolsAuth({ getFromStorage, setToStorage });
  const isLocked = auth.status === "locked";

  const messages = useLocalizations([
    { key: "dev.tools.title" },
    { key: "dev.tools.password.label" },
    { key: "dev.tools.unlock.button" },
    { key: "dev.tools.feature.toggle.label" },
    { key: "dev.tools.try.again.in", args: [formatRemainingTime(auth.remainingBlockMs)] },
  ]);

  const handleSubmit = () => {
    void auth.submitPassword(password);
    setPassword("");
  };

  return {
    auth,
    handleSubmit,
    isLocked,
    messages,
    password,
    setFeatureToggle,
    setPassword,
    toggles,
  };
};

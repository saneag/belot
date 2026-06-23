import { useEffect } from "react";

import { POINTS_TYPE } from "@belot/constants";
import { useGameStore } from "@belot/store";

import { useFeatureToggle } from "./featureToggles/useFeatureToggle";

export const useIsPointsTypeEnabled = () => {
  const isSettingsScreenEnabled = useFeatureToggle("settings-screen");
  const isPointsTypeEnabled = useFeatureToggle("points-type");

  return isSettingsScreenEnabled && isPointsTypeEnabled;
};

export const useEffectivePointsType = () => {
  const isPointsTypeEnabled = useIsPointsTypeEnabled();
  const storePointsType = useGameStore((state) => state.pointsType);

  return isPointsTypeEnabled ? storePointsType : POINTS_TYPE[0].id;
};

export const useSyncPointsTypeFeature = () => {
  const isPointsTypeEnabled = useIsPointsTypeEnabled();
  const pointsType = useGameStore((state) => state.pointsType);
  const setPointsType = useGameStore((state) => state.setPointsType);

  useEffect(() => {
    if (!isPointsTypeEnabled && pointsType !== POINTS_TYPE[0].id) {
      setPointsType(POINTS_TYPE[0].id);
    }
  }, [isPointsTypeEnabled, pointsType, setPointsType]);
};

import { DimensionValue, TransformsStyle } from "react-native";

import { TABLE_HEIGHT, TABLE_WIDTH } from "@belot/constants";

export const getTopPosition = (
  index: number,
  playersCount: number,
  isError: boolean,
): DimensionValue => {
  const topPosition = -30;
  const bottomPosition = TABLE_HEIGHT - 55;
  const middlePosition = bottomPosition / 2 - (isError ? 15 : 5);

  const layouts: Record<number, number[]> = {
    2: [topPosition, bottomPosition],
    3: [topPosition, middlePosition, bottomPosition],
    4: [topPosition, middlePosition, bottomPosition, middlePosition],
  };

  return layouts[playersCount]?.[index] ?? "auto";
};

export const getRightPosition = (
  index: number,
  playersCount: number,
  isError: boolean,
): DimensionValue => {
  const defaultRightShift = 5;
  const middlePosition = TABLE_WIDTH / 2 - (isError ? 0 : -10);

  const layouts: Record<number, number[]> = {
    2: [defaultRightShift, defaultRightShift],
    3: [defaultRightShift, -middlePosition, defaultRightShift],
    4: [
      defaultRightShift,
      -middlePosition,
      defaultRightShift,
      middlePosition + defaultRightShift + 5,
    ],
  };

  return layouts[playersCount]?.[index] ?? "auto";
};

export const getRotation = (index: number, playersCount: number): TransformsStyle["transform"] => {
  const layouts: Record<number, TransformsStyle["transform"][]> = {
    2: [],
    3: [[], [{ rotateZ: "90deg" }], []],
    4: [[], [{ rotateZ: "90deg" }], [], [{ rotateZ: "-90deg" }]],
  };

  return layouts[playersCount]?.[index] ?? [];
};

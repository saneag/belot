import { TABLE_HEIGHT, TABLE_WIDTH } from "@belot/constants";

export const getTopPosition = (index: number, playersCount: number, isError: boolean) => {
  const topPosition = -45;
  const bottomPosition = TABLE_HEIGHT - 45;
  const middlePosition = bottomPosition / 2 - 10 - (isError ? 10 : 0);

  const layouts: Record<number, number[]> = {
    2: [topPosition, bottomPosition],
    3: [topPosition, middlePosition, bottomPosition],
    4: [topPosition, middlePosition, bottomPosition, middlePosition],
  };

  return layouts[playersCount]?.[index] ?? "auto";
};

export const getRightPosition = (index: number, playersCount: number, isError: boolean) => {
  const defaultRightShift = 15;
  const middlePosition = TABLE_WIDTH / 2 + defaultRightShift - (isError ? 10 : 0);

  const layouts: Record<number, number[]> = {
    2: [defaultRightShift, defaultRightShift],
    3: [0, -middlePosition, 0],
    4: [0, -middlePosition, 0, middlePosition + 5],
  };

  return layouts[playersCount]?.[index] ?? "auto";
};

export const getRotation = (index: number, playersCount: number): string => {
  const layouts: Record<number, string[]> = {
    2: [],
    3: ["", "rotateZ(90deg)", ""],
    4: ["", "rotateZ(90deg)", "", "rotateZ(-90deg)"],
  };

  return layouts[playersCount]?.[index] ?? "";
};

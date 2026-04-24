import { TABLE_HEIGHT, TABLE_WIDTH } from "@belot/constants";
import type {
  GetRightPositionProps,
  GetRotationProps,
  GetTopPositionProps,
  Player,
  Team,
} from "@belot/types";

export const getPlayersCount = (players: Player[]) => players.length;

export const getPlayersNames = (players: Player[]) => players.map((player) => player.name);

export const getTeamsNames = (teams: Team[]) => teams.map((team) => team.name);

export const getTopPosition = ({
  index,
  playersCount,
  isError,
  topPosition = -45,
  topShift = 10,
  topErrorShift = 10,
  bottomShift = 45,
}: GetTopPositionProps) => {
  const bottomPosition = TABLE_HEIGHT - bottomShift;
  const middlePosition = bottomPosition / 2 - topShift - (isError ? topErrorShift : 0);

  const layouts: Record<number, number[]> = {
    2: [topPosition, bottomPosition],
    3: [topPosition, middlePosition, bottomPosition],
    4: [topPosition, middlePosition, bottomPosition, middlePosition],
  };

  return layouts[playersCount]?.[index] ?? "auto";
};

export const getRightPosition = ({
  index,
  playersCount,
  isError,
  rightPosition = 0,
  rightShift = 15,
  rightErrorShift = 10,
  additionalRightShift = 5,
}: GetRightPositionProps) => {
  const middlePosition = TABLE_WIDTH / 2 + rightShift - (isError ? rightErrorShift : 0);

  const layouts: Record<number, number[]> = {
    2: [rightPosition, rightPosition],
    3: [rightPosition, -middlePosition, rightPosition],
    4: [rightPosition, -middlePosition, rightPosition, middlePosition + additionalRightShift],
  };

  return layouts[playersCount]?.[index] ?? "auto";
};

export const getRotation = ({
  index,
  playersCount,
  isObjectRotation = false,
}: GetRotationProps) => {
  const rotateValue = "90deg";

  if (isObjectRotation) {
    const mobileLayouts: Record<number, object[]> = {
      2: [],
      3: [[], [{ rotateZ: rotateValue }], []],
      4: [[], [{ rotateZ: rotateValue }], [], [{ rotateZ: `-${rotateValue}` }]],
    };

    return mobileLayouts[playersCount]?.[index] ?? [];
  }

  const layouts: Record<number, string[]> = {
    2: [],
    3: ["", `rotateZ(${rotateValue})`, ""],
    4: ["", `rotateZ(${rotateValue})`, "", `rotateZ(-${rotateValue})`],
  };

  return layouts[playersCount]?.[index] ?? "";
};

interface CommonProps {
  index: number;
  playersCount: number;
  isError: boolean;
}

export interface GetTopPositionProps extends CommonProps {
  topPosition?: number;
  topShift?: number;
  topErrorShift?: number;
  bottomShift?: number;
}

export interface GetRightPositionProps extends CommonProps {
  rightPosition?: number;
  rightShift?: number;
  rightErrorShift?: number;
  additionalRightShift?: number;
}

export interface GetRotationProps extends Omit<CommonProps, "isError"> {
  isObjectRotation?: boolean;
}

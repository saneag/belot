import { RoundScore, useGameStore } from '@belot/shared';
import { Dispatch, Fragment, ReactNode, SetStateAction } from 'react';
import { Pressable, PressableProps } from 'react-native';

interface TableRowContainerProps {
  children: ReactNode;
  roundScore: RoundScore;
  setScore: Dispatch<SetStateAction<RoundScore | null>>;
}

export default function EditableTableRowContainer({
  children,
  roundScore,
  setScore,
}: TableRowContainerProps) {
  const isScoreEdit = useGameStore((state) => state.isScoreEdit);

  const Container = isScoreEdit ? Pressable : Fragment;
  const containerProps = isScoreEdit
    ? ({
        onPress: () => {
          console.log('roundScore', roundScore);
          setScore(roundScore);
        },
      } as PressableProps)
    : {};

  return <Container {...containerProps}>{children}</Container>;
}

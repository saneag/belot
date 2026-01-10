import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ScrollView } from 'react-native';
import { Player, RoundScore, Team, useGameStore } from '@belot/shared';
import TableRow from '../tableRow';
import PointCells from './pointCells';
import { useAppTheme } from '../../../helpers/themeHelpers';
import AnimatedTableBorder from '../animatedTableBorder';
import ConfirmationDialog from '../../confirmation-dialog';
import ScoreEditDialogContent from './scoreEditDialogContent';
import EditableTableRowContainer from './editableTableRowContainer';

interface TableBodyProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function TableBody({ setWinner }: TableBodyProps) {
  const { colors } = useAppTheme();

  const [score, setScore] = useState<RoundScore | null>(null);

  const players = useGameStore((state) => state.players);
  const playersCount = useMemo(() => players.length, [players.length]);
  const roundsScores = useGameStore((state) => state.roundsScores);
  const gameMode = useGameStore((state) => state.mode);
  const isScoreEdit = useGameStore((state) => state.isScoreEdit);

  const scrollViewRef = useRef<ScrollView>(null);
  const roundsScoresCount = useMemo(
    () => roundsScores.length,
    [roundsScores.length]
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [roundsScores]);

  const getRowStyles = (index: number) =>
    index !== 0 &&
    index % playersCount === 0 && {
      borderTopWidth: 3,
      borderColor: colors.primary,
    };

  return (
    <ScrollView ref={scrollViewRef} style={{ position: 'relative' }}>
      {isScoreEdit && <AnimatedTableBorder />}
      {roundsScores.map(
        (roundScore, index) =>
          index !== roundsScoresCount - 1 && (
            <EditableTableRowContainer
              key={roundScore.id}
              roundScore={roundScore}
              setScore={setScore}
            >
              <TableRow
                showTopBorder={index !== 0}
                style={{
                  ...getRowStyles(index),
                }}
              >
                <PointCells score={roundScore} gameMode={gameMode} />
              </TableRow>
            </EditableTableRowContainer>
          )
      )}
      <ConfirmationDialog
        title="Score edit"
        content={<ScoreEditDialogContent score={score} setWinner={setWinner} />}
        renderShowDialog={() => <></>}
        primaryButton="confirm"
        visible={!!score}
        setVisible={() => setScore(null)}
      />
    </ScrollView>
  );
}

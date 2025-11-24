import { useRouter } from 'expo-router';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useGameStore } from '../../../store/game';
import { GameMode, Player, Team } from '../../../types/game';
import ConfirmationDialog from '../../confirmation-dialog';

interface WindDialogProps {
  winner: Player | Team | null;
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function WindDialog({ winner, setWinner }: WindDialogProps) {
  const router = useRouter();

  const gameMode = useGameStore((state) => state.mode);
  const reset = useGameStore((state) => state.reset);

  const [isVisible, setIsVisible] = useState(false);

  const handleGameReset = useCallback(() => {
    reset();
    setWinner(null);
    router.back();
  }, [reset, router, setWinner]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (winner) {
      setIsVisible(true);
    }
  }, [winner]);

  return (
    <ConfirmationDialog
      title={`${winner?.name} ${gameMode === GameMode.classic ? 'player' : 'team'} win`}
      content="You can reset the game or check current game points. Do you want to reset the game?"
      renderShowDialog={() => <></>}
      visible={isVisible}
      setVisible={setIsVisible}
      confirmationCallback={handleGameReset}
      cancelCallback={handleClose}
      asChild
    />
  );
}

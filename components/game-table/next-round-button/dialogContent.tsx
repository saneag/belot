import { Text } from 'react-native-paper';

interface DialogContentProps {
  isEmptyGame: boolean;
}

export default function DialogContent({ isEmptyGame }: DialogContentProps) {
  const content = isEmptyGame
    ? 'Do you want to skip the round?'
    : "Sum of players' score doesn't equal to round points";

  return <Text>{content}</Text>;
}

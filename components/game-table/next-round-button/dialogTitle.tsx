import { Text } from 'react-native-paper';

interface DialogTitleProps {
  isEmptyGame: boolean;
}

export default function DialogTitle({ isEmptyGame }: DialogTitleProps) {
  const title = isEmptyGame ? 'Round skip' : 'You entered an invalid score';

  return <Text>{title}</Text>;
}

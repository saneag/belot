import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native-paper';

export default function TimeTracker() {
  const [timeSpent, setTimeSpent] = useState(0);
  const hours = Math.floor(timeSpent / 3600);
  const minutes = Math.floor((timeSpent % 3600) / 60);
  const seconds = timeSpent % 60;

  const isMoreThanTenSeconds = useRef(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (seconds === 10 && !isMoreThanTenSeconds.current) {
      isMoreThanTenSeconds.current = true;
    }
  }, [seconds]);

  return (
    <Text>
      Time: {hours > 0 && hours.toString().padStart(2, '0') + ':'}
      {minutes > 0 && minutes.toString().padStart(2, '0') + ':'}
      {seconds.toString().padStart(isMoreThanTenSeconds.current ? 2 : 1, '0')}
    </Text>
  );
}

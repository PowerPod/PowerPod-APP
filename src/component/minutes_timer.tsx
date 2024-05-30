import React, { useEffect, useState } from 'react'
import { Colors, Text } from 'react-native-ui-lib'

type Props = {
  initialMinutes: number;
  darkTheme?: boolean;
  isRunning: boolean;
};

const MinutesTimer: React.FC<Props> = ({ initialMinutes = 0, darkTheme = false, isRunning }) => {
  const [minutes, setMinutes] = useState(0)

  useEffect(() => {

    if (isRunning) {
      setMinutes(initialMinutes)
    } else {
      setMinutes(0)
    }

    return () => {
      setMinutes(0)
    }
  }, [isRunning, initialMinutes])

  return <Text text80M style={{ color: darkTheme ? Colors.white : Colors.primary }} numberOfLines={1}
               ellipsizeMode='tail'>
    {minutes} min
  </Text>
}

export default MinutesTimer

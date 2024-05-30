import React, { useEffect, useState } from 'react'
import { Colors, Text } from 'react-native-ui-lib'

type Props = {
  initialPT: number;
  darkTheme?: boolean;
  isRunning: boolean;
};

export const AutoMintPT: React.FC<Props> = ({ initialPT, darkTheme = false, isRunning = false }) => {

  const [earnPT, setEarnPT] = useState(0)

  useEffect(() => {
    setEarnPT(initialPT)
  }, [initialPT])

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (isRunning) {
      interval = setInterval(() => {
        setEarnPT((prevPT) => prevPT + 0.05722)
      }, 50)
    } else {
      if (interval) {
        clearInterval(interval)
      }
      setEarnPT(0)
    }

    return () => {
      clearInterval(interval)
      setEarnPT(0)
    }
  }, [isRunning])

  return (
    <>
      <Text text80M style={{ color: darkTheme ? Colors.white : Colors.primary, fontVariant: ['tabular-nums'] }}
            marginR-4
            numberOfLines={1}
            ellipsizeMode='tail'>{(earnPT).toFixed(4)}</Text>
    </>
  )
}

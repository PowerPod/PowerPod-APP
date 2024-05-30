import React, { useEffect, useState } from 'react'
import { Colors, ProgressBar, Text, View } from 'react-native-ui-lib'

type Props = {
  style?: any;
};
const CountdownTimer: React.FC<Props> = ({ style }) => {
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const targetHour = currentHour < 12 ? 12 : 24

    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, 0, 0)
    const timeDifference = targetTime.getTime() - now.getTime()

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1)
    }, 1000)

    setCountdown(Math.floor(timeDifference / 1000))

    return () => {
      clearInterval(interval)
    }
  }, [])

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }


  const progress = (time: number) => {
    const remainingTime = (time / (12 * 60 * 60)).toFixed(2)
    return 100 - parseFloat(remainingTime) * 100
  }

  return (
    <View row centerV>
      <ProgressBar
        fullWidth
        progress={progress(countdown)}
        progressColor={Colors.black}
        style={{ width: '80%', marginRight: 10 }} />
      <Text style={style}>{formatTime(countdown)}</Text>
    </View>
  )
}

export default CountdownTimer

import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native-ui-lib'
import { StyleSheet } from 'react-native'

type Props = {
  startTime: number;
  epoch: number;
  style?: any;
};
const CountdownClock: React.FC<Props> = ({ startTime, epoch, style }) => {
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const now = new Date()
    const targetTime = startTime * 1000 + epoch * 12 * 60 * 60 * 1000

    if (targetTime < now.getTime()) {
      setCountdown(0)
      return
    }

    const timeDifference = targetTime - now.getTime()

    setCountdown(Math.floor(timeDifference / 1000))

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1)
    }, 1000)


    return () => {
      clearInterval(interval)
    }
  }, [startTime, epoch])


  // useEffect(() => {
  //   console.log("======::",countdown)
  // }, [countdown])

  const formatHours = (time: number) => {
    if (time < 0) {
      return '00'
    }
    const hours = Math.floor(time / 3600)
    return `${hours.toString().padStart(2, '0')}`
  }

  const formatMinutes = (time: number) => {
    if (time < 0) {
      return '00'
    }
    const minutes = Math.floor((time % 3600) / 60)
    return `${minutes.toString().padStart(2, '0')}`
  }

  const formatSeconds = (time: number) => {
    if (time < 0) {
      return '00'
    }
    const seconds = time % 60
    return `${seconds.toString().padStart(2, '0')}`
  }

  return (
    <View row center style={style}>
      <View style={styles.timer}>
        <Text text50M>{formatHours(countdown)}</Text>
      </View>
      <Text text50M marginH-4>:</Text>
      <View style={styles.timer}>
        <Text text50M>{formatMinutes(countdown)}</Text>
      </View>
      <Text text50M marginH-4>:</Text>
      <View style={styles.timer}>
        <Text text50M>{formatSeconds(countdown)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  timer: {
    width: 40,
    height: 40,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#465700',
    backgroundColor: '#A6C500',
  }
})
export default CountdownClock

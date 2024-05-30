import React, { useEffect, useState } from 'react'
import { StyleSheet, Animated } from 'react-native'
import { Colors, Image, Text, View } from 'react-native-ui-lib'
import BigNumber from 'bignumber.js'
import { secondToHourMinute } from '@util/utils'

interface RotatingGradientRingsProps {
  detail?: any
}

const RotatingGradientRings = ({ detail }: RotatingGradientRingsProps) => {

  const [countdown, setCountdown] = useState(0)
  const rotateAnim = new Animated.Value(0)

  useEffect(() => {
    if (detail) {
      const _remaining = new BigNumber(detail.duration).minus(new BigNumber(detail.actualChargeDuration)).toNumber()
      setCountdown(_remaining > 0 ? _remaining : 0)
    }
  }, [detail])

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 60000,
        useNativeDriver: true
      })
    ).start()

    return () => clearInterval(interval)
  }, [])

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg']
  })

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <View flex-1>
      <View style={styles.container}>
        <Image source={require('assets/circle_bg.png')}
               style={{ width: 360, height: 360, top: 70, position: 'absolute', zIndex: 1 }} />
        <Image source={require('assets/circle_fg.png')}
               style={{ width: 240, height: 245, top: 100, position: 'absolute', zIndex: 2 }} />

        <Text style={styles.statusText}>{detail?.chargeStatus}</Text>
        <Text style={styles.countdownText}>{formatTime(countdown)}</Text>
        <Text style={styles.label}>Remaining</Text>

        <Text style={styles.paidText}>Paid duration: {secondToHourMinute(detail?.duration)}</Text>

      </View>


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  countdownText: {
    position: 'absolute',
    fontSize: 44,
    color: '#fff',
    top: 180,
    fontWeight: '700',
    zIndex: 3
  },
  statusText: {
    position: 'absolute',
    fontSize: 16,
    color: Colors.accent,
    fontWeight: '500',
    top: 150,
    zIndex: 3
  },
  label: {
    position: 'absolute',
    fontSize: 16,
    color: Colors.$textNeutralLight,
    top: 230,
    zIndex: 3
  },
  paidText: {
    position: 'absolute',
    fontSize: 16,
    color: Colors.$textNeutralLight,
    top: 300,
    zIndex: 3
  }
})

export default RotatingGradientRings

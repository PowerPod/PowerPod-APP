import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-ui-lib'
import { router } from 'expo-router'
import { BarCodeScanner } from 'expo-barcode-scanner'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

export default function CameraScreen() {

  const [hasPermission, setHasPermission] = useState(false)
  const [scanned, setScanned] = useState(false)

  const linePosition = useSharedValue(200)
  const lineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: linePosition.value }],
    }
  })

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanned(true)

    router.back()
    router.push(`/consumer/charge/${data}`)
  }

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }

    getBarCodeScannerPermissions().then()

    linePosition.value = withRepeat(
      withTiming(-linePosition.value, { duration: 2000, easing: Easing.linear }), -1, true)

  }, [])

  if (hasPermission === null) {
    return (
      <View flex center>
        <Text>Requesting for camera permission</Text>
      </View>
    )
  }
  if (!hasPermission) {
    return (
      <View flex center>
        <Text>No access to camera</Text>
      </View>
    )
  }

  return (
    <View flex>

      <View flex-1>
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ flex: 1 }}
        />
        <Animated.View style={[styles.line, lineStyle]} />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({


  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 2,
    backgroundColor: 'red',
  }

})

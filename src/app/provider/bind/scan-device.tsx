import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ImageBackground, StyleSheet } from 'react-native'
import { Button, Colors, Dialog, Image, Text, View } from 'react-native-ui-lib'
import { BarCodeScanner } from 'expo-barcode-scanner'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@store/auth.store'
import EdgeFunction from '@util/supabse/edge_function'
import * as Progress from 'react-native-progress'
import Toast from 'react-native-toast-message'
import APIProviderService from '@util/api/api_provider_service'
import { APIError } from '@util/api/api_error'


export default function ScanDeviceScreen() {

  const router = useRouter()
  const linePosition = useSharedValue(200)
  const lineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: linePosition.value }],
    }
  })

  const [hasPermission, setHasPermission] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [pairingResult, setPairingResult] = useState<string>('')

  const user = useAuthStore((state) => state.user)
  const [isSigning, setIsSigning] = useState(false)

  const [isDialogVisible, setDialogVisible] = useState(false)

  const hideDialog = function () {
    setDialogVisible(false)
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


  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanned(true)
    linePosition.value = withTiming(0)
    setPairingResult(data)
  }

  const registerDevice = async (deviceID: string) => {

    setIsSigning(true)
    try {
      if (user) {
        const address = user.address
        const nonce = await APIProviderService.nonce(address)
        const {
          signature,
          message
        } = await APIProviderService.verify(address, 'bind', nonce, deviceID, 'Bind your device.')

        setDialogVisible(true)
        setIsSigning(false)

        await APIProviderService.deviceBound(message, signature)

        hideDialog()
        router.push('/provider/bind/step3')

      }
    } catch (error) {

      console.log(error)

      hideDialog()
      setIsSigning(false)

      if (error instanceof APIError) {
        if (error.code === '405') {
          Toast.show({
            type: 'error',
            text1: 'An error occurred while binding the device, please try again.',
          })
        } else if (error.code === '406') {
          Toast.show({
            type: 'info',
            text1: 'The user has cancelled the signature.',
          })
        } else if (error.code === 'DB0001') {
          Toast.show({
            type: 'error',
            text1: 'The device has been bound already. Please contact support.',
          })
        }
      }


    }
  }

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
      {scanned ? (
        <View flex centerH>

          <Image source={require('@assets/circle_wave.png')} width={270} height={270}
                 style={{ zIndex: -1, position: 'absolute', marginTop: 70 }}>
          </Image>
          <Image source={require('@assets/pulse_big.png')} width={200} height={250} style={{ marginTop: 80 }} />


          <Text marginH-24 marginT-42 text70 $textNeutral highlightString={pairingResult}
                highlightStyle={{ color: Colors.$textPrimary }}>Device {pairingResult} found! Please sign message with
            your wallet to bind the device.</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ flex: 1 }}
          />
          <Animated.View style={[styles.line, lineStyle]} />
        </View>
      )}

      {scanned && <Button marginB-56 marginH-32 label={'Bind Device'}
                          iconSource={(iconStyle) => isSigning ?
                            <Progress.Circle size={20} color={Colors.grey40} indeterminate={true}
                                             style={{ marginRight: 8 }} /> : <></>
                          }
                          disabled={isSigning}
                          onPress={() => {
                            registerDevice(pairingResult).then()
                          }} />}

      <Dialog
        visible={isDialogVisible}
        width={160}
        height={160}
        onDismiss={() => {
          hideDialog()
        }}
        containerStyle={{
          backgroundColor: Colors.white,
          borderRadius: 12
        }}
      >
        <View flex center>
          <ActivityIndicator size='large' />
          <Text marginT-8 $textNeutral text90>binding</Text>
        </View>
      </Dialog>
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

import React, { useEffect, useState } from 'react'
import { ImageBackground, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import {
  BorderRadiuses,
  Button,
  ButtonSize,
  Colors,
  Constants,
  Dialog,
  Text,
  View
} from 'react-native-ui-lib'
import { router, useLocalSearchParams } from 'expo-router'
import { LucideChevronLeft } from 'lucide-react-native'
import APIService from '@util/api/api_driver_service'
import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'
import * as Progress from 'react-native-progress'
import RotatingGradientRings from '@component/rotating_rings'
import { Device } from '@util/types/api_entity'

export default function ChargingOrderStatusScreen() {

  //ui
  const [isStopped, setIsStopped] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogVisible, setDialogVisible] = useState(false)

  //data
  const { deviceId, orderId } = useLocalSearchParams<{
    deviceId: string,
    orderId: string
  }>()

  const [orderDetail, setOrderDetail] = useState<any>()
  const [deviceDetail, setDeviceDetail] = useState<Device>()

  //function
  const hideDialog = function () {
    setDialogVisible(false)
  }

  const fetchOrderDetail = () => {
    APIService.orderDetail(orderId)
      .then((result) => {
          console.log('order:', result)
          if (result.code === '0') {
            setOrderDetail(result.data)
          } else {
            console.log(result)
          }
        }
      )
  }

  const fetchDeviceDetail = () => {
    APIService.fetchDeviceDetail(deviceId)
      .then((result) => {
          if (result.code === '0') {
            setDeviceDetail(result.data)
          } else {
            console.log(result)
          }
        }
      )
  }

  const stopCharging = () => {
    setIsLoading(true)
    APIService.orderStopCharging(orderId)
      .then((result) => {
          hideDialog()
          if (result.code === '0') {
            Toast.show({ type: 'success', text1: 'Stop charging success' })
            setIsStopped(true)
            fetchOrderDetail()
          } else {
            Toast.show({ type: 'success', text1: 'Occurred an error,Please try again' })
            setIsStopped(false)
          }

          setIsLoading(false)
        }
      )
  }

  useEffect(() => {
    fetchOrderDetail()
    fetchDeviceDetail()
  }, [])


  return (
    <ImageBackground source={require('@assets/bg3x.png')}
                     style={{ width: '100%', height: '100%' }}
                     resizeMode={'stretch'}>
      <View flex>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}>
          <LucideChevronLeft size={24} color={Colors.black} />
        </Pressable>

        <RotatingGradientRings detail={orderDetail} />

        <View flex-1 centerH padding-16>
          <View row spread marginT-50 width={'80%'}>
            <View center>
              <Text text60M white>{deviceDetail?.maxPower} kW</Text>
              <Text text70M $textNeutral>Power</Text>
            </View>
            <View center>
              <Text text60M white>220</Text>
              <Text text70M $textNeutral>Voltage</Text>
            </View>

            <View center>
              <Text text60M white>-- kWh</Text>
              <Text text70M $textNeutral>Quantity</Text>
            </View>
          </View>

          <Button label={isStopped ? 'Charging Stopped' : 'End Charging'}
                  style={{ width: '80%', marginTop: 60, backgroundColor: Colors.accent }}
                  size={ButtonSize.large}
                  $textPrimary
                  text80M
                  onPress={() => setDialogVisible(true)}
                  disabled={isStopped}
                  iconSource={(iconStyle) => isLoading ?
                    <Progress.Circle size={20} color={Colors.grey40} indeterminate={true}
                                     style={{ marginRight: 8 }} /> : <></>
                  }
                  borderRadius={BorderRadiuses.br10} />

          <Text marginT-4 $textNeutral text90R>No refunds will be received for early termination</Text>

        </View>

        <Dialog
          visible={isDialogVisible}
          onDismiss={() => {
            hideDialog()
          }}
          containerStyle={{
            backgroundColor: Colors.white,
            borderRadius: 12,
            marginBottom: Constants.isIphoneX ? 0 : 20,
          }}
        >
          <View padding-16>
            <Text text50 $textDefault>Confirm Stop Charging?</Text>
            <Text text80 marginT-20 marginB-20>After stop charging, you need restart a new order, </Text>
            <View row margin-20 right>
              <Button text60 label='Cancel' link linkColor={Colors.red30} onPress={hideDialog} />
              <Button marginL-40 text60 label='Stop' link onPress={stopCharging} />
            </View>
          </View>
        </Dialog>

        <StatusBar style='light' />
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: Constants.statusBarHeight,
    marginLeft: 24,
    width: 45,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 220,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

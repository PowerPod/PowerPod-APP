import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Colors, Text, View } from 'react-native-ui-lib'
import { useLocalSearchParams } from 'expo-router'
import APIService from '@util/api/api_driver_service'
import { convertUTCToLocalTime, minuteToHourMinute } from '@util/utils'

export default function OrderDetailScreen() {

  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const [orderDetail, setOrderDetail] = useState<any>()

  useEffect(() => {
    APIService
      .orderDetail(orderId)
      .then((result) => {
        if (result.code === '0') {
          setOrderDetail(result.data)
        } else {
          console.log(result)
        }
      })
      .catch((reason) => {
        console.log(reason)
      })

  }, [orderId])

  return (
    <ScrollView>
      <View flex-1 padding-16 bg-white>
        <View row spread marginB-16>
          <Text $textNeutral>Status</Text>
          <Text $textPrimary>{orderDetail?.chargeStatus}</Text>
        </View>

        <CustomRow label='Device ID' value={orderDetail?.deviceId} />
        <CustomRow label='Date' value={convertUTCToLocalTime(Number(orderDetail?.createTime) * 1000)} />
        <CustomRow label='Place' value={orderDetail?.detailAddress} />
        <Divider />

        <Text text60R $textPrimary marginB-16>Transaction</Text>
        <CustomRow label='Payment' value={'$' + orderDetail?.amount} />
        <CustomRow label='Tx hash' value={orderDetail?.txHash} />
        <Divider />

        <Text text60R $textPrimary marginB-16>Time</Text>
        <CustomRow label='Paid duration' value={minuteToHourMinute(orderDetail?.duration)} />
        <CustomRow label='Duration' value={minuteToHourMinute(orderDetail?.actualChargeDuration)} />
        <Divider />

        <Text text60R $textPrimary marginB-16>Rewards</Text>
        <CustomRow label='PT rewards' value={orderDetail?.chargeUserAward + ' PT'} />


      </View>
    </ScrollView>
  )
}


// 1. CustomRow component
function CustomRow({ label, value }: {
  label: string,
  value: string | undefined
}) {
  return (
    <View row spread marginB-16>
      <Text $textNeutral>{label}</Text>
      <Text $textPrimary>{value}</Text>
    </View>
  )
}

// 2. Divider component
function Divider() {
  return <View height={0.5} backgroundColor={Colors.$outlineDefault} marginV-16 />
}


const styles = StyleSheet.create({})

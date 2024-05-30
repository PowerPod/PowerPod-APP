import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Colors, Image, LoaderScreen, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { router } from 'expo-router'
import APIService from '@util/api/api_driver_service'
import { useAuthStore } from '@store/auth.store'
import { convertUTCToLocalTime } from '@util/utils'

interface Order {
  transactionId: string
  amount: number
  chargeStatus: string
  location: string
  detailAddress: string
  createTime: string
}

export default function OrderListScreen() {
  //ui
  const [isLoading, setIsLoading] = useState(false)

  //data
  const [orderList, setOrderList] = useState<Order[]>([])
  const user = useAuthStore((state) => state.user)

  useEffect(() => {

    if (!user) {
      return
    }

    setIsLoading(true)
    APIService
      .orderList({
        pageNum: 1,
        pageSize: 100,
        address: user?.address
      })
      .then((result) => {

        console.log(result.data)

        if (result.code === '0') {
          setOrderList(result.data.transactions)
        } else {
          console.log(result)
        }
        setIsLoading(false)
      })
  }, [])

  return (
    isLoading
      ? <LoaderScreen message='Loading' color={Colors.grey40} />
      : <FlatList
        data={orderList}
        renderItem={
          ({ item }) => <OrderItem item={item} />
        }
        ListEmptyComponent={<EmptyStatus />}
        ItemSeparatorComponent={() => <View height={0.5} backgroundColor={Colors.$outlineDefault} />}
        keyExtractor={(item) => item.transactionId} />

  )
}


function OrderItem({ item }: { item: Order }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => router.push({
      pathname: '/consumer/orders/detail',
      params: { orderId: item.transactionId }
    })}>
      <View padding-16 bg-white>
        <View row spread>
          <Text text70M $textPrimary>${item.amount}</Text>
          <Text>{item.chargeStatus}</Text>
        </View>

        <Text marginT-8 $textNeutral>Date: {convertUTCToLocalTime(Number(item.createTime) * 1000)}</Text>
        <Text $textNeutral>Address: {item.detailAddress}</Text>
      </View>
    </TouchableOpacity>
  )
}

function EmptyStatus() {
  return <View flex center>
    <Image source={require('@assets/gas-station.png')} style={{ width: 36, height: 36 }} />
    <Text marginT-12 $textNeutral text90M>No available piles</Text>
  </View>
}


const styles = StyleSheet.create({})

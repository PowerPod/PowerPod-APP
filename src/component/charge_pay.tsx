import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { View, Text, Incubator, Colors, RadioButton, Button, ButtonSize } from 'react-native-ui-lib'
import { LucideWallet } from 'lucide-react-native'
import { useAuthStore } from '@store/auth.store'
import APIService from '@util/api/api_driver_service'
import Toast from 'react-native-toast-message'
import { EvmService } from '@particle-network/rn-auth'
import {
  CONTRACT_ADDRESS_MINT_PPD, CONTRACT_ADDRESS_PAYMENT,
  CONTRACT_ADDRESS_USDT, readContractWithPT,
  writeContractWithPayment,
  writeContractWithPT
} from '@util/contractHelper'
import BigNumber from 'bignumber.js'
import * as Progress from 'react-native-progress'
import * as particleAuth from '@particle-network/rn-auth'
import { CommonError } from '@particle-network/rn-connect'
import { Max_Value } from '@util/utils'
import { router } from 'expo-router'


interface ChargePayCardProps {
  deviceId: string
  price?: number
  receiver?: string
}

export default function ChargePayCard({ deviceId, price, receiver }: ChargePayCardProps) {

  const [sliderValue, setSliderValue] = useState(0)
  const user = useAuthStore((state) => state.user)
  const [usdtBalance, setUsdtBalance] = useState(0)
  const [usdtAllowance, setUsdtAllowance] = useState(0)
  const [isPaying, setIsPaying] = useState(false)

  useEffect(() => {

    /* Get USDT balance */
    if (user) {
      EvmService.getTokenByTokenAddress(user.address, [CONTRACT_ADDRESS_USDT]).then(
        (tokens: any) => {
          if (tokens.length > 0) {
            const usdt = tokens[0]
            setUsdtBalance(new BigNumber(usdt.amount).div(1e6).toNumber())
          }

        }
      )
    }
  }, [])

  const handleOrderCreate = useCallback(async () => {

    setIsPaying(true)
    if (price === undefined) {
      return
    }
    if (user === null || user === undefined) {
      console.log('user is null')
      return
    }
    if (receiver === undefined) {
      console.log('receiver is undefined')
      return
    }

    if (sliderValue === 0) {
      Toast.show({ text1: 'Please select charging hours', type: 'error' })
      return
    }

    const amount = price * sliderValue
    if (amount > usdtBalance) {
      Toast.show({ text1: 'Insufficient USDT balance', type: 'error' })
      return
    }

    try {
      const orderData = {
        address: user?.address!,
        deviceId: deviceId,
        amount: amount,
        duration: sliderValue * 60 * 60
      }

      const response = await APIService.orderCreate(orderData)
      if (response.code === '0') {
        const usdtDecimals = new BigNumber(amount).times(1e6).toFixed(0)
        const contractPaymentParams = [
          response.data.transactionId,
          usdtDecimals,
          receiver
        ]

        //1.approve usdt
        const fromAccount = user?.address
        if (fromAccount) {

          const tx_data = await EvmService.erc20Approve(CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_PAYMENT, usdtDecimals)
          const tx_hash = await EvmService.createTransaction(user?.address, tx_data, new BigNumber(0), CONTRACT_ADDRESS_USDT)
          const result = await particleAuth.signAndSendTransaction(tx_hash)

          console.log('payment', result)
          if (result.status) {

            setTimeout(async () => {
              //call payment contract method
              const tx_payment = await writeContractWithPayment(fromAccount, 'payBill', contractPaymentParams)
              particleAuth.signAndSendTransaction(tx_payment)
                .then((resp) => {
                  if (resp.status) {
                    Toast.show({
                      type: 'success',
                      text1: 'Order created successfully.',
                    })

                    //TODO
                    router.push({
                      pathname: `/consumer/charge/order`,
                      params: { deviceId: deviceId, orderId: response.data.transactionId }
                    })

                  }
                  setIsPaying(false)
                })
                .catch((reason) => {
                  console.log('payment', reason)
                  Toast.show({
                    type: 'error',
                    text1: 'Order created failed, please try again.',
                  })

                  setIsPaying(false)
                })
            }, 15000)
          } else {
            const error = result.data as CommonError
            console.log(error)
          }
        }
      }
    } catch (error) {
      Toast.show({ text1: 'Error creating order', type: 'error' })
      console.error('Error creating order:', error)
      setIsPaying(false)
    }
  }, [price, deviceId, receiver, sliderValue])

  return (
    <View>
      <Text text500 $textNeutral marginB-s1>Charging Hours</Text>
      <Incubator.Slider
        thumbStyle={{
          width: 18,
          height: 18,
          borderWidth: 2.5,
          borderRadius: 18,
          backgroundColor: Colors.black,
          borderColor: Colors.white
        }}
        minimumValue={0}
        maximumValue={8}
        step={0.1}
        onValueChange={
          (value) => setSliderValue(value)
        }
      />
      <View row spread>
        <Text text500 $textNeutral>
          {0}h
        </Text>
        <Text text500 $textNeutral>
          max. {8}h
        </Text>
      </View>

      <Text text500 $textNeutral marginT-s8>Need Pay</Text>
      <View row marginT-s1 style={{ alignItems: 'flex-end' }}>
        <Text text700 $textPrimary style={styles.fontV}>${(sliderValue * (price || 0)).toFixed(2)}</Text>
        <Text $textNeutral marginL-s2 style={styles.fontV}>{sliderValue}h</Text>
      </View>

      <Text text500 $textNeutral marginT-s8>Payment</Text>
      <View row marginT-s2 style={styles.paymentBorder}>
        <RadioButton selected={true} marginR-12 />
        <View row centerV>
          <LucideWallet size={24} color={Colors.$iconPrimary} />
          <View marginL-12>
            <Text text70M $textPrimary>Crypto Wallet</Text>
            <Text text80R $textNeutral>Balance: {usdtBalance.toFixed(2)} USDT</Text>
          </View>
        </View>
      </View>

      <Button label='Pay' size={ButtonSize.large} br20
              style={styles.button}
              iconSource={(iconStyle) => isPaying ?
                <Progress.Circle size={20} color={Colors.grey40} indeterminate={true}
                                 style={{ marginRight: 8 }} /> : <></>
              }
              disabled={isPaying}
              onPress={handleOrderCreate} />
    </View>
  )
}

const styles = StyleSheet.create({
  paymentBorder: {
    borderColor: Colors.$backgroundPrimaryHeavy,
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  button: {
    width: '90%',
    marginTop: 80,
    alignItems: 'center',
    alignSelf: 'center'
  },
  fontV: {
    fontVariant: ['tabular-nums']
  }
})

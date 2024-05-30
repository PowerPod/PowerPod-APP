import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button, ButtonSize, Colors, Text, TextField, TextFieldRef, TouchableOpacity, View } from 'react-native-ui-lib'
import EdgeFunction from '@util/supabse/edge_function'
import { useAuthStore } from '@store/auth.store'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { getDeviceChargeStatistics } from '@util/supabse/database'
import * as Progress from 'react-native-progress'
import { BoltIcon } from 'react-native-heroicons/solid'
import PTIcon from '@component/svg/pt'
import { LucideSquareMenu } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { StatusBar } from 'expo-status-bar'

export default function SwapPTScreen() {

  const { id } = useLocalSearchParams<{ id: string }>()

  const inputWithValidation = React.createRef<TextFieldRef>()
  const valueRef = useRef<string>('0')
  const balanceRef = useRef<number>(0)

  const user = useAuthStore((state) => state.user)

  const [balance, setBalance] = useState<string>('--')
  const [receivePT, setReceivePT] = useState<number>(0)
  const [value, setValue] = useState<string>()

  const [loading, setLoading] = useState(false)

  const validateMax = () => {
    if (inputWithValidation.current) {
      if (valueRef.current) {
        return Number(valueRef.current) <= Number(balanceRef.current)
      }
      return false
    }
  }

  const validateMin = () => {
    if (inputWithValidation.current) {
      if (valueRef.current) {
        return Number(valueRef.current) >= 10
      }
      return false
    }
  }

  const handleValueChange = (newValue: string) => {

    console.log('input', newValue)

    const validated = newValue.match(/^(\d*\.?\d{0,3}$)/)
    if (validated) {
      setValue(newValue)
      valueRef.current = newValue
      setReceivePT(Number(valueRef.current) * 1000)
    }
  }

  const handleSwap = async () => {
    if (inputWithValidation.current && validateMin() && validateMax()) {
      setLoading(true)

      try {
        if (user) {
          const address = user.address
          const nonce = await EdgeFunction.getNonce(address)
          const {
            signature,
            message
          } = await EdgeFunction.verifySwap(address, nonce.nonce, id, 'swap', valueRef.current)

          if (typeof signature === 'string') {
            const data = await EdgeFunction.swapPT(message, signature)
            console.log(data)

            setLoading(false)
            inputWithValidation.current?.clear()

            Toast.show({
              type: 'success',
              text1: 'Transaction submitted.',
            })

            queryDeviceChargeStatistics(id).then()
          }
        }
      } catch (error) {
        setLoading(false)
        console.log('error code:', error)

        Toast.show({
          type: 'error',
          text1: 'An error occurred while transacting, please try again.',
        })
      }

    } else {
      // ToastAndroid.show('Validation failed', ToastAndroid.SHORT)
      console.log('Validation failed')
    }
  }

  async function queryDeviceChargeStatistics(deviceID: string) {

    const { data, error } = await getDeviceChargeStatistics(deviceID)
    if (error) {
      console.log(error)
    }
    if (data) {
      console.log('statistic:', data)
      balanceRef.current = data.remaining_amount! - data.freeze_amount
      setBalance((data.remaining_amount! - data.freeze_amount).toFixed(3))
    }
  }

  useEffect(() => {
    queryDeviceChargeStatistics(id).then()
  }, [])

  return (
    <>
      <Stack.Screen options={{
        headerStyle: { backgroundColor: Colors.bgColor },
        headerRight: () => (
          <TouchableOpacity padding-8
                            onPress={() => router.push({ pathname: '/provider/device/swap_record', params: { id } })}>
            <LucideSquareMenu size={24} color={Colors.$900} />
          </TouchableOpacity>
        ),
      }} />
      <View flex bg-bgColor padding-16>

        <TextField
          ref={inputWithValidation}
          value={value}
          text50M
          onChangeText={handleValueChange}
          fieldStyle={styles.withFrame}
          placeholder={'min 10'}
          keyboardType={'numeric'}
          validate={['required', validateMin, validateMax]}
          enableErrors
          validateOnChange
          validationMessagePosition={'top'}
          validationMessageStyle={{ paddingLeft: 12 }}
          validationMessage={['Please enter a valid number.', 'At last 10 kWh', 'Insufficient balance']}
          leadingAccessory={
            <BoltIcon size={20} color={Colors.$textWarning} style={{ marginRight: 8 }} />
          }
          trailingAccessory={
            <View row centerV>
              <Button outline
                      label='Max'
                      size={ButtonSize.xSmall}
                      outlineColor={Colors.$outlineDefault}
                      text90R
                      marginR-8
                      $textNeutral
                      style={{ width: 20 }}
                      onPress={() => {
                        setValue(balanceRef.current.toString())
                        handleValueChange(balanceRef.current.toString())
                      }}
              />
              <Text text80M $textPrimary>
                kWh
              </Text>
            </View>
          }
          marginB-s1
          marginT-s3
        />

        <View row right>
          <Text text80 $textNeutralLight>Balance:</Text>
          <Text text80 $textNeutralLight>{balance} kWh</Text>
        </View>


        <View marginT-32 paddingH-16>
          <Text text70 $textNeutral>
            You will receive
          </Text>
          <View row centerV marginT-4>
            <PTIcon width={20} height={20} />
            <Text text70M $textPrimary marginL-8>{receivePT} PT</Text>
          </View>
        </View>

        <Button label={'Swap'}
                marginT-32
                borderRadius={6}
                size={ButtonSize.large}
                iconSource={(iconStyle) => loading ?
                  <Progress.Circle size={20} color={Colors.grey40} indeterminate={true}
                                   style={{ marginRight: 8 }} /> : <></>
                }
                disabled={loading}
                onPress={handleSwap} />

        <Text $textNeutralLight text90R marginT-8>
          The charging power of each device can be exchange for PT tokens. Rate is 1 kWh = 1000 PT.
        </Text>
      </View>
      <StatusBar style={'dark'} />

    </>
  )
}

const styles = StyleSheet.create({
  withFrame: {
    borderWidth: 1,
    borderColor: Colors.$outlineDefault,
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.white
  }

})

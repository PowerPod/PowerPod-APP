import React, { useEffect } from 'react'
import { Image, ImageBackground, StyleSheet } from 'react-native'
import * as particleAuth from '@particle-network/rn-auth'
import { LoginType, SupportAuthType, Wallet } from '@particle-network/rn-auth'
import { Button, Colors, Text, View } from 'react-native-ui-lib'
import { useAuthStore, useDeviceStore, useWalletStore } from '@store/auth.store'
import { router } from 'expo-router'
import { preference } from '@store/preference'


export default function LoginPage() {

  const setUser = useAuthStore((state) => state.login)
  const clearDeviceList = useDeviceStore((state) => state.clearDeviceList)
  const clearTokenList = useWalletStore((state) => state.clearTokenList)

  const login = async () => {
    const type = LoginType.Email
    const supportAuthType = [SupportAuthType.Email, SupportAuthType.Apple, SupportAuthType.Google]
    const result = await particleAuth.login(type, '', supportAuthType)

    if (result.status == 1) {
      const userInfo = result.data as particleAuth.UserInfo
      console.log(userInfo)

      setUser({
        address: userInfo.wallets.find((value: Wallet) => value.chain_name === 'evm_chain')?.public_address!,
        email: userInfo.email!,
        uuid: userInfo.uuid,
      })

      router.replace('/')

    } else {
      const error = result.data
      console.log(error)
    }

  }

  useEffect(() => {
    clearDeviceList()
    preference.clear()
    clearTokenList()
  }, [])

  return (
    <ImageBackground source={require('assets/login_bg.png')} style={{ width: '100%', height: '100%' }}>
      <View style={styles.container}>

        <Image source={require('assets/icon_logo.png')} style={{ width: 52, height: 52 }} />
        <Image source={require('assets/powerpod.png')} style={{ width: 165, height: 20, marginTop: 32 }} />

        <Text text80 $textNeutralLight marginT-8>Charge for change</Text>

        <Button label={'Login'} onPress={login} marginT-80
                outlineColor={Colors.black}
                borderRadius={100}
                backgroundColor={Colors.accent}
                color={Colors.black}
                enableShadow
                style={{
                  width: '80%',
                  shadowColor: '#D8FF00',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 0,
                  elevation: 15,
                }} />
        <Text marginT-10 $textNeutralLight>Account will be automatically registered</Text>
      </View>
    </ImageBackground>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

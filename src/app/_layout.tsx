import { Stack, useNavigation, useRootNavigationState, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { configureDesignSystem } from '@util/designSystem'
import { useAuthStore } from '@store/auth.store'
import { initParticleAuth, isParticleLogin } from '@util/particleAuthHelper'
import { UserInfo, Wallet } from '@particle-network/rn-auth'
import { Colors, View } from 'react-native-ui-lib'
import Toast from 'react-native-toast-message'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

require('react-native-ui-lib/config').setConfig({ appScheme: 'default' })
SplashScreen.preventAutoHideAsync().then(r => console.log('star'))

function useProtectedRoute() {

  const router = useRouter()
  const navigation = useNavigation<any>()

  const segments = useSegments()
  const rootNavigationState = useRootNavigationState()
  const navigationKey = useMemo(() => {
    return rootNavigationState?.key
  }, [rootNavigationState])

  const user = useAuthStore((state) => state.user)

  useLayoutEffect(() => {
    const inAuthGroup = segments[0] === 'auth'

    if (!navigationKey) {
      return
    }

    if (!user && !inAuthGroup) {
      navigation.reset({ index: 0, routes: [{ name: 'auth' }] })
    } else if (user && inAuthGroup) {
      router.replace('/')
    }


  }, [user, segments, navigationKey])
}

export default function RootLayout() {

  const [appIsReady, setAppIsReady] = useState(false)
  const login = useAuthStore(state => state.login)

  useEffect(() => {
    async function prepare() {

      try {
        configureDesignSystem()
        initParticleAuth()
        const result = await isParticleLogin()

        if (result.status) {
          const userInfo = result.data
          const usInf = userInfo as UserInfo
          login({
            address: usInf.wallets.find((value: Wallet) => value.chain_name === 'evm_chain')?.public_address!,
            email: usInf.email!,
            uuid: usInf.uuid
          })

        }

        //other load resources
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (e) {
        console.log(e)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare().then()
  }, [])


  useEffect(() => {
      if (appIsReady) {
        SplashScreen.hideAsync().then((result) => {
          console.log('splash', result)
        })
      }
    },
    [appIsReady],
  )

  useProtectedRoute()

  if (!appIsReady) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <View flex>
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='auth' options={{ headerShown: false }} />
          <Stack.Screen name='provider' options={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 1000
          }} />
          <Stack.Screen name='consumer'
                        options={{
                          headerShown: false,
                          animation: 'fade',
                          animationDuration: 1000
                        }} />
          <Stack.Screen name='choose-role' options={{ headerShown: false }} />

          <Stack.Screen name='setting' options={{
            headerShown: true,
            headerTitle: 'Setting',
            headerStyle: { backgroundColor: Colors.bgColor },
            headerShadowVisible: false
          }} />

        </Stack>

        <Toast />
      </View>
    </GestureHandlerRootView>
  )
}

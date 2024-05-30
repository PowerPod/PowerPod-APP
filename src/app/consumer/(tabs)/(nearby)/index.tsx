import React, { useCallback, useEffect, useState } from 'react'
import { Colors, LoaderScreen, SegmentedControl, Spacings, Text, View } from 'react-native-ui-lib'
import { FlatList, ImageBackground, StyleSheet } from 'react-native'
import { router, Stack, useFocusEffect } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useHeaderHeight } from '@react-navigation/elements'
import { CardStation } from '@component/card_station'
import { preference } from '@store/preference'
import APIService from '@util/api/api_driver_service'
import * as Location from 'expo-location'
import Toast from 'react-native-toast-message'
import { SharedDeviceItem } from '@util/types/api_entity'

/**
 * Renders the NearbyScreen component, which displays a list of nearby devices.
 * @author yz
 */
export default function NearbyScreen() {

  //ui state
  const [initIndex, setInitIndex] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const headerHeight = useHeaderHeight() + 10

  //data
  const [deviceList, setDeviceList] = useState<SharedDeviceItem[]>([])

  useEffect(() => {

    async function requestLocation() {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync()

      if (foregroundStatus === 'granted') {
        const getLoc = (await Location.getCurrentPositionAsync()) as any
        return getLoc.coords
      } else {
        Toast.show({ type: 'info', text1: 'Permission to access location was denied' })
      }
    }

    setIsLoading(true)
    requestLocation().then((position) => {
      if (position) {
        const { latitude, longitude } = position
        APIService
          .fetchDevices(String(longitude), String(latitude))
          .then((data) => {
            setDeviceList(data)
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            setIsLoading(false)
          })
      }
    })

  }, [])

  function onChangeIndex(index: number) {

    setTimeout(() => {
      if (index === 1) {
        preference.setRole('consumer')
        router.replace('/consumer/')
      } else {
        preference.setRole('provider')
        router.replace('/provider/')
      }

    }, 200)

  }

  useFocusEffect(useCallback(() => {
    setInitIndex(1)
  }, []))

  return (
    <ImageBackground source={require('@assets/bg3x.png')} style={{ width: '100%', height: '100%' }}
                     resizeMode={'stretch'}>
      <Stack.Screen options={{
        headerTransparent: true,
        headerTitle: () => (
          <SegmentedControl
            initialIndex={initIndex}
            segments={[{ label: 'Provider' }, { label: 'Driver' }]}
            backgroundColor={Colors.rgba(40, 40, 40, 0.7)}
            activeBackgroundColor={Colors.white}
            activeColor={Colors.$textPrimary}
            inactiveColor={Colors.$textNeutralLight}
            style={{ height: 36, borderColor: '#404040' }}
            segmentsStyle={{ height: '100%', width: 90 }}
            onChangeIndex={onChangeIndex}
          />
        )
      }} />
      <View flex-1 bg-bgColor marginH-4
            style={{ marginTop: headerHeight, borderTopStartRadius: 24, borderTopEndRadius: 24 }}>
        {isLoading ? (
            <LoaderScreen message={'Loading'} color={Colors.grey40} />
          ) :
          (deviceList.length == 0) ? (
            <EmptyStatus />
          ) : (
            <FlatList
              data={deviceList}
              renderItem={({ item, index }) => {
                return (
                  <CardStation item={item} />
                )
              }}
              contentContainerStyle={styles.gridList}
              style={{ marginTop: Spacings.s5 }}
            />
          )}
      </View>

      <StatusBar style='light' />

    </ImageBackground>
  )
}

function EmptyStatus() {
  return <View flex center>
    <Text marginT-12 $textNeutral text90M>No available piles</Text>
  </View>
}

const styles = StyleSheet.create({
  gridList: {
    paddingHorizontal: Spacings.s5,
    gap: 20
  },
})

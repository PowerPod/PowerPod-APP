import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, ImageBackground, Platform, StyleSheet } from 'react-native'
import {
  ActionSheet,
  Button,
  Colors,
  SegmentedControl,
  Spacings,
  Text,
  TouchableOpacity,
  View
} from 'react-native-ui-lib'
import { router, Stack, useFocusEffect, useRouter } from 'expo-router'

import { CardDeviceT2 } from '@component/card_device_t2'
import { StatusBar } from 'expo-status-bar'
import { useHeaderHeight } from '@react-navigation/elements'
import { useAuthStore, useDeviceStore } from '@store/auth.store'
import { getLatestChargeSessionsForDevices } from '@util/supabse/database'
import { CardDeviceT1 } from '@component/card_device_t1'
import { ChargeSessionEntity } from '@util/types/db_entity'
import { ButtonSize } from 'react-native-ui-lib/src/components/button/ButtonTypes'
import { PlusCircleIcon, PlusIcon } from 'lucide-react-native'
import { preference } from '@store/preference'
import { ChargeSession, D_CHARGING, D_IDLE, DeviceStatus } from '@util/types/api_entity'
import APIProviderService from '@util/api/api_provider_service'

function EmptyStatus() {
  return <View flex center>
    <Text $textNeutralHeavy text70BO>No device yet</Text>
    <Text marginT-4 $textNeutral text80>Add and share a device to earn</Text>
    <Button marginT-24
            label='Add Device'
            onPress={() => {
              router.push('/provider/bind/')
            }}
            outline
            outlineColor={Colors.$outlineDefault}
            size={ButtonSize.large}
            labelStyle={{ marginLeft: 4 }}
            iconSource={(iconStyle) => (<PlusIcon width={16} height={16} color={Colors.$textNeutralHeavy} />)}
            color={Colors.$textNeutralHeavy}
            style={{ width: 146 }}
            borderRadius={100} />
  </View>
}

export default function ProviderMainScreen() {

  // UI
  const router = useRouter()
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [initIndex, setInitIndex] = useState(0)

  //Data
  const [deviceIds, setDeviceIds] = useState<string[]>()
  const { deviceList, addDevice, updateDeviceStatus } = useDeviceStore()
  // const [latestData, setLatestData] = useState<ChargeSession[]>([])
  const [renderedChargeSessions, setRenderedChargeSessions] = useState<Record<string, ChargeSession | undefined>>({})
  const user = useAuthStore((state) => state.user)


  //Function
  useEffect(() => {

    async function fetchUserDeviceList() {
      if (user) {
        const data = await APIProviderService.queryDeviceList(user.address)
        //save device to local storage
        data.forEach((value, index, array) => {
          addDevice(value)
        })
        const publisherNames = data.map((device) => device.deviceId)
        setDeviceIds(publisherNames)
      }
    }

    setIsLoading(deviceList.length == 0)
    fetchUserDeviceList()
      .catch((error) => {
        console.error(error)
      })
    setIsLoading(false)

  }, [])

  useEffect(() => {

    let timer: NodeJS.Timeout
    let devicesStatusTimer: NodeJS.Timeout

    function fetchDeviceStatus(publisherNames: string[]) {
      if (publisherNames.length > 0) {
        APIProviderService.queryDeviceStatus(publisherNames).then((response) => {
          updateDeviceStatus(response)
        })
      }
    }

    if (deviceIds) {
      timer = setInterval(() => {
        APIProviderService.queryDeviceChargeSession(deviceIds)
          .then((values) => {

            if (deviceIds && values && values.length > 0) {
              const renderedSessions: Record<string, ChargeSession | undefined> = {}
              deviceIds.forEach((dId) => {
                renderedSessions[dId] = values.find((value) => value.deviceId === dId)
              })
              setRenderedChargeSessions(renderedSessions)
            }

          })

      }, 10000)

      devicesStatusTimer = setInterval(() => {
        fetchDeviceStatus(deviceIds)
      }, 5000)
    }
    return () => {
      clearInterval(timer)
      clearInterval(devicesStatusTimer)
    }
  }, [deviceIds])

  // useEffect(() => {
  //   console.log('data changed', deviceIds, latestData)
  //   if (deviceIds) {
  //     const renderedSessions: Record<string, ChargeSession | undefined> = {}
  //     deviceIds.forEach((dId) => {
  //       renderedSessions[dId] = latestData.find((value) => value.deviceId === dId)
  //     })
  //     setRenderedChargeSessions(renderedSessions)
  //   }
  // }, [latestData, deviceIds])

  useEffect(() => {
  }, [deviceList])

  const headerHeight = useHeaderHeight() + 10

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
    setInitIndex(0)
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
            style={{ marginTop: headerHeight, borderTopStartRadius: 20, borderTopEndRadius: 20 }}>
        <View row spread paddingH-20 paddingT-12 centerV>
          <Text text50BO $textPrimary>Devices</Text>
          <TouchableOpacity onPress={() => setShowActionSheet(true)}>
            <PlusCircleIcon size={24} color={Colors.$500} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
            <View flex center>
              <Text>loading</Text>
              <ActivityIndicator size='large' />
            </View>
          ) :
          (deviceList.length == 0) ? (
            <EmptyStatus />
          ) : (
            <FlatList
              data={deviceList}
              renderItem={({ item, index }) => {

                console.log('render', item.deviceId)
                if (item.type === 0) {
                  return (<CardDeviceT1 item={item}
                                        chargeSession={renderedChargeSessions[item.deviceId]} />)
                }
                return (
                  <CardDeviceT2 item={item}
                                chargeSession={renderedChargeSessions[item.deviceId]}
                                onSuccess={(type: string) => {

                                  //TODO if need!!!
                                  updateDeviceStatus([{
                                    ...item,
                                    status: type === 'start' ? D_CHARGING : D_IDLE,
                                  }])

                                  // const index = deviceListStatus.findIndex((value) => value.deviceId === item.deviceId)
                                  // const newDeviceListStatus = deviceListStatus.map((value, i) => {
                                  //   if (i === index) {
                                  //     return {
                                  //       ...value,
                                  //       status: type === 'start' ? 'charging' : 'idle',
                                  //       statusInt: type === 'start' ? 2 : 1,
                                  //     }
                                  //   }
                                  //   return value
                                  // })
                                  // setDeviceListStatus(newDeviceListStatus)

                                }}
                  />)
              }}
              contentContainerStyle={styles.gridList}
              style={{ marginTop: Spacings.s3 }}
            />
          )}
      </View>
      <StatusBar style='light' />

      <ActionSheet
        cancelButtonIndex={2}
        destructiveButtonIndex={0}
        options={[
          { label: 'Add device', onPress: () => router.push('/provider/bind/') },
          {
            label: 'Buy device', onPress: async () => {
            }
          },
          { label: 'Cancel', onPress: () => console.log('cancel') }
        ]}
        visible={showActionSheet}
        useNativeIOS={Platform.OS === 'ios'}
        onDismiss={() => setShowActionSheet(false)}
      />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  gridList: {
    paddingHorizontal: Spacings.s5,
    gap: 20
  },
  imageBg: {
    position: 'absolute',
    flexShrink: 0,
    width: 220,
    height: 215,
    top: 5,
    right: -55,
  },
  address: {
    gap: 4,
  },
  addressText: {
    overflow: 'hidden',
    color: Colors.$textNeutral,
    lineHeight: 20
  },
  statusText: {
    lineHeight: 20,
    color: Colors.black
  }
})

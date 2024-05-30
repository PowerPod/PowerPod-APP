import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button, ButtonSize, Colors, Constants, Image, TouchableOpacity, View } from 'react-native-ui-lib'
import { Carousel } from 'react-native-ui-lib/src/components/carousel'
import { LucideChevronLeft } from 'lucide-react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import { router, useLocalSearchParams } from 'expo-router'
import ChargeStationDetail from '@component/station-detail'
import * as Location from 'expo-location'
import Toast from 'react-native-toast-message'
import APIService from '@util/api/api_driver_service'
import { Device, SharedDevice } from '@util/types/api_entity'
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet'
import ChargePayCard from '@component/charge_pay'
import { getDeviceBindInfo, getUserDeviceListFromDB } from '@util/supabse/database'
import { useAuthStore } from '@store/auth.store'


export default function ChargeStationDetailScreen() {

  //ui
  const headerHeight = useHeaderHeight()
  const { id } = useLocalSearchParams<{ id: string }>()
  const bottomSheetRef = useRef<BottomSheet>(null)

  //data
  const [deviceOwnerAddress, setDeviceOwnerAddress] = useState<string>()
  const [device, setDevice] = useState<SharedDevice>()
  const [chargingAddress, setChargingAddress] = useState<string>()
  const [chargingOrderId, setChargingOrderId] = useState<string>()

  const user = useAuthStore((state) => state.user)


  useEffect(() => {
    async function requestLocation() {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync()

      if (foregroundStatus === 'granted') {
        const getLoc = (await Location.getLastKnownPositionAsync()) as any
        return getLoc.coords
      } else {
        Toast.show({ type: 'info', text1: 'Permission to access location was denied' })
      }
    }

    requestLocation().then((location) => {
      APIService.fetchDeviceDetail(id, String(location.latitude), String(location.longitude))
        .then((response) => {
          if (response) {
            setDevice(response)
          }

        })
        .catch((e) => {
          console.error(e)
          Toast.show({ text1: 'The device was not found.', type: 'info' })
        })
    })

    //fetch device binding info
    getDeviceBindInfo(id)
      .then((response) => {
        const _bindingInfo = response.data
        if (_bindingInfo) {
          setDeviceOwnerAddress(_bindingInfo.owner_address)
        }
      })
      .catch((e) => {
        console.error(e)
      })

    //fetch device charging status
    APIService.fetchDeviceChargingAddress(id)
      .then((response) => {

        setChargingAddress(undefined)
        setChargingOrderId(undefined)

        if (response.code === '0') {
          const _chargingAddress = response.data.address
          const _chargingOrderId = response.data.transactionId
          if (_chargingAddress != null) {
            setChargingAddress(_chargingAddress)
            setChargingOrderId(_chargingOrderId)
          }
        }

      })
      .catch((e) => {
        console.error(e)
      })


  }, [])

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  // renders
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} />
    ), [])

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <Carousel
        style={{ position: 'absolute' }}
        containerStyle={{ height: 260 }}
        loop={true}
        pageControlProps={{
          size: 6,
          containerStyle: styles.loopCarousel,
          color: 'white',
          inactiveColor: Colors.grey40,
        }}
        pageControlPosition={Carousel.pageControlPositions.OVER}
        onChangePage={
          () => console.log('page changed')
        }>
        {device?.images?.map((imageUri, index) => (
          <View flex centerV key={index}>
            <Image
              overlayType={Image.overlayTypes.BOTTOM}
              style={{ flex: 1, height: 260 }}
              resizeMode='cover'
              source={{ uri: imageUri }} />
          </View>
        ))}
      </Carousel>

      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.backButton} onPress={() => router.back()}>
        <LucideChevronLeft size={24} color={Colors.black} />
      </TouchableOpacity>

      <View flex-1 bg-white padding-16 absF style={styles.container}>
        <ChargeStationDetail deviceEntity={device} />
      </View>

      <Button label={chargingAddress ? 'Charging' : 'Start Charging'}
              size={ButtonSize.large}
              style={chargingAddress ? ((chargingAddress !== user?.address) ? styles.buttonDisabled : styles.buttonGreen) : styles.button}
              disabled={chargingAddress ? chargingAddress !== user?.address : false}
              onPress={() => {

                if (chargingAddress === undefined) {
                  bottomSheetRef.current?.expand()
                } else {
                  router.push({
                    pathname: `/consumer/charge/order`,
                    params: { deviceId: id, orderId: chargingOrderId! }
                  })
                }
              }} />


      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose
        onChange={handleSheetChanges}
        index={-1}
        backdropComponent={renderBackdrop}
        snapPoints={[200, '60%']}
      >
        <BottomSheetView style={styles.contentContainer}>
          <ChargePayCard deviceId={id} price={device?.amount} receiver={deviceOwnerAddress} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  loopCarousel: {
    position: 'absolute',
    left: '50%',
    bottom: 45,
    right: '50%',
    backgroundColor: 'transparent'
  },

  itemSeparator: {
    width: 'auto',
    height: 1,
    backgroundColor: Colors.$outlineDisabled,
  },
  container: {
    top: 230,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  backButton: {
    position: 'absolute',
    top: Constants.statusBarHeight,
    left: 24,
    width: 45,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 220,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 48,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center'
  },
  buttonGreen: {
    position: 'absolute',
    bottom: 48,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#93B800',
  },
  buttonDisabled: {
    position: 'absolute',
    bottom: 48,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#93B800',
    opacity: 0.5
  }

})

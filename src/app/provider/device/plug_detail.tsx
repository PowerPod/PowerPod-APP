import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator, Animated,
  FlatList,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native'
import {
  ActionSheet,
  Button,
  ButtonSize,
  Colors, Constants,
  Dialog,
  Icon, Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native-ui-lib'
import { StatusBar } from 'expo-status-bar'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react-native'
import { getDeviceChargeSession, getDeviceChargeStatistics } from '@util/supabse/database'
import { ChargeEntity, ChargeSessionEntity } from '@util/types/db_entity'
import { calculatePTCount, convertUTCToLocalTime, prettySeconds } from '@util/utils'
import { LinearGradient } from 'expo-linear-gradient'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import { useAuthStore, useDeviceStore } from '@store/auth.store'
import EdgeFunction from '@util/supabse/edge_function'
import { SafeAreaView } from 'react-native-safe-area-context'
import BgEllipseSvg from '@component/svg/bg_ellipse'
import { Animations } from 'react-native-reanimated/lib/typescript/reanimated2/layoutReanimation/web/config'
import APIProviderService from '@util/api/api_provider_service'
import { ChargeSession, ChargeStatistic } from '@util/types/api_entity'

export default function PlugDetailScreen() {
  const router = useRouter()

  const { id, type } = useLocalSearchParams<{ id: string, type: string }>()
  const user = useAuthStore((state) => state.user)
  const [chargeDataList, setChargeDataList] = useState<ChargeSession[]>([])
  const [chargeStatistic, setChargeStatistic] = useState<ChargeStatistic>()

  const [isLoading, setIsLoading] = useState(false)
  const [showPT, setShowPT] = useState(false)

  const [showActionSheet, setShowActionSheet] = useState(false)
  const [isDialogVisible, setDialogVisible] = useState(false)
  const { deviceList, removeDevice } = useDeviceStore()
  const device = deviceList.find(device => device.deviceId === id)
  const isDeviceSharing = device?.isShared

  const hideDialog = function () {
    setDialogVisible(false)
  }

  const unbindDevice = async (deviceID: string) => {
    try {
      if (user) {
        const address = user.address
        const nonce = await EdgeFunction.getNonce(address)
        const { signature, message } = await EdgeFunction.verify(address, nonce.nonce, deviceID, 'Unbind your device.')
        if (typeof signature === 'string') {
          setDialogVisible(true)
          const data = await EdgeFunction.unbindDevice(message, signature)
          console.log(data)
          removeDevice(id)
          hideDialog()
        }
      }
    } catch (error) {
      console.log('error code:', error)
    }
  }


  useEffect(() => {

    function queryDeviceChargeStatistics(deviceID: string) {
      setShowPT(false)
      APIProviderService.queryDeviceChargeStatistics(deviceID)
        .then((result) => {
          setChargeStatistic(result)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setShowPT(true)
        })

    }

    function queryDeviceChargeSessionList(deviceID: string) {
      setIsLoading(true)
      APIProviderService.queryDeviceChargeSessionById(deviceID)
        .then((result) => {
          setChargeDataList(result)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    //exec init function
    queryDeviceChargeSessionList(id)
    queryDeviceChargeStatistics(id)

  }, [])


  function getDefaultSkeletonProps() {
    return {
      shimmerColors: [Colors.$backgroundNeutral, Colors.$backgroundNeutralMedium, Colors.$backgroundNeutral],
      // style: [{borderRadius}, style],
      // width: size || width,
      // height: size || height,
      // shimmerStyle
    }
  }

  const titleBarOpacityAnim = useRef(new Animated.Value(0)).current

  return (
    <ImageBackground source={require('@assets/bg3x.png')} style={{ width: '100%', height: '100%' }}
                     resizeMode={'cover'}>

      <SafeAreaView edges={['top']}>

        <View>
          <Animated.View style={[styles.titleBar, {
            opacity: titleBarOpacityAnim.interpolate({
              inputRange: [20, 50],
              outputRange: [0, 1],
            }),
          }]}>
            <View row spread bg-white centerV>
              <TouchableOpacity padding-8 onPress={() => router.back()}>
                <ChevronLeftIcon size={24} color={Colors.black} />
              </TouchableOpacity>
              <Text text60BO>{type === '1' ? 'PowerPod Pulse I' : 'PowerPod Plug'}</Text>
              <TouchableOpacity padding-8 onPress={() => setShowActionSheet(true)}>
                <MoreHorizontalIcon size={24} color={Colors.black} />
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={5}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: titleBarOpacityAnim } } }],
              { useNativeDriver: true },
            )}>
            <View>
              <View flex center style={styles.cardBorder}>
                <View flex row spread centerV width='100%'>
                  <TouchableOpacity padding-8 onPress={() => router.back()}>
                    <ChevronLeftIcon size={24} color={Colors.black} />
                  </TouchableOpacity>

                  <Text text60BO>{type === '1' ? 'PowerPod Pulse I' : 'PowerPod Plug'}</Text>

                  <TouchableOpacity padding-8 onPress={() => setShowActionSheet(true)}>
                    <MoreHorizontalIcon size={24} color={Colors.black} />
                  </TouchableOpacity>
                </View>

                <Text text90M $textNeutral marginB-24>P3UUY3A51001</Text>

                <BgEllipseSvg width={240} height={240} style={{ position: 'absolute', zIndex: -1, top: 84 }} />
                <Image source={type === '1' ? require('@assets/pulse_big.png') : require('@assets/plug1.png')}
                       style={type === '1' ? {
                         width: 180,
                         height: 240,
                       } : {
                         width: 180,
                         height: 240,
                       }}
                       resizeMode={'cover'} />

                <Button label={isDeviceSharing ? 'Share Mode: On' : 'Enable Share Mode to Earn More'}
                        marginT-24
                        bg-$backgroundWarningLight
                        style={{ width: '100%' }}
                        labelStyle={{ color: Colors._textLime, fontWeight: '700' }}
                        onPress={() => {
                          router.push({ pathname: '/provider/(share)/', params: { deviceId: id } })
                        }} />
              </View>


              <View bg-white br60 marginH-4 marginT-4>
                <View padding-16>
                  <View row spread marginB-16>
                    <Text text20_700>Earned</Text>
                    {/*<TouchableOpacity>*/}
                    {/*  <Button label={'Rank'} link onPress={() => router.push('/provider/device/my_pt')} />*/}
                    {/*</TouchableOpacity>*/}
                  </View>
                  <View row spread>
                    <View row centerV>
                      <Icon source={require('assets/ic_sm_power.png')} size={16} marginR-4 />
                      <Text $textNeutral text80M>Power</Text>
                    </View>
                    <View right>
                      <ShimmerPlaceholder
                        {...getDefaultSkeletonProps()}
                        LinearGradient={LinearGradient}
                        height={18}
                        width={70}
                        visible={showPT}>
                        <Text $textPrimary text80M>{chargeStatistic?.totalAmount ?? 0} kWh</Text>
                      </ShimmerPlaceholder>
                      <View row centerV>
                        <ShimmerPlaceholder
                          {...getDefaultSkeletonProps()}
                          LinearGradient={LinearGradient}
                          height={18}
                          width={70}
                          visible={showPT}>
                          <Text
                            $textWarning
                            text80M>{chargeStatistic?.remainingAmount ?? 0}</Text>
                        </ShimmerPlaceholder>
                        <Text marginL-4 $textWarning text80M>kWh Unredeemed</Text>
                      </View>
                    </View>

                  </View>
                  <View row spread centerV>
                    <View row centerV>
                      <Icon source={require('assets/ic_sm_pt.png')} size={16} marginR-4 />
                      <Text $textNeutral text80M>Earned</Text>
                    </View>
                    <View row marginT-16 centerV>
                      <ShimmerPlaceholder
                        {...getDefaultSkeletonProps()}
                        LinearGradient={LinearGradient}
                        height={18}
                        width={70}
                        visible={showPT}>
                        <Text text80M
                              $textPrimary>{calculatePTCount((chargeStatistic?.totalAmount ?? 0) - (chargeStatistic?.remainingAmount ?? 0))}</Text>
                      </ShimmerPlaceholder>
                      <Text marginL-8 $textPrimary text80M>PT</Text>
                    </View>
                  </View>

                  <Button size={ButtonSize.large}
                          label={'Swap PT'}
                          outline
                          outlineColor={Colors.$outlineDefault}
                          backgroundColor={Colors.white}
                          labelStyle={{ color: Colors.$textPrimary }}
                          marginT-8
                          onPress={() => router.push({
                            pathname: '/provider/device/swap_pt',
                            params: { id: id }
                          })} />
                </View>

              </View>


              <View bg-white br60 marginH-4 marginT-4>

                <View padding-16>
                  <Text text20_700>Records</Text>
                </View>

                <View style={styles.itemSeparator}></View>

                <FlatList data={chargeDataList}
                          horizontal={false}
                          scrollEnabled={false}
                          renderItem={(item) => (
                            <View centerV paddingV-12 paddingH-16 style={styles.itemSeparator}>
                              <Text text80BO $textNeutralHeavy>{item.item.totalAmount} kWh</Text>
                              <View row spread>
                                <Text text90R $textNeutral>Duration {prettySeconds(item.item.totalSecs)}</Text>
                                <Text text90R $textNeutral>Starts
                                  at {convertUTCToLocalTime(item.item.createTime)}</Text>
                              </View>
                            </View>
                          )}
                          keyExtractor={item => item.deviceId}
                          ListEmptyComponent={
                            () => (
                              isLoading ? (
                                <View flex height={300} paddingV-12 paddingH-16>
                                  <ShimmerPlaceholder
                                    {...getDefaultSkeletonProps()}
                                    width={360}
                                    visible={!isLoading}
                                    LinearGradient={LinearGradient}
                                  />
                                  <ShimmerPlaceholder
                                    {...getDefaultSkeletonProps()}
                                    shimmerStyle={{ marginTop: 4 }}
                                    width={300}
                                    visible={!isLoading}
                                    LinearGradient={LinearGradient}
                                  />
                                  <ShimmerPlaceholder
                                    {...getDefaultSkeletonProps()}
                                    shimmerStyle={{ marginTop: 4 }}
                                    width={360}
                                    visible={!isLoading}
                                    LinearGradient={LinearGradient}
                                  />
                                  <ShimmerPlaceholder
                                    {...getDefaultSkeletonProps()}
                                    shimmerStyle={{ marginTop: 4 }}
                                    width={300}
                                    visible={!isLoading}
                                    LinearGradient={LinearGradient}
                                  />
                                </View>
                              ) : (
                                <View flex center height={200}>
                                  <Text>No data available</Text>
                                </View>
                              )
                            )
                          }

                />

              </View>
            </View>
          </Animated.ScrollView>
        </View>
        <StatusBar style={'light'} />
      </SafeAreaView>

      <ActionSheet
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        options={[
          {
            label: 'Detach device',
            onPress: () => {
              unbindDevice(id).then(() => {
                if (router.canGoBack()) {
                  router.back()
                }
              })
            }
          },
          { label: 'cancel', onPress: () => console.log('cancel') }
        ]}
        visible={showActionSheet}
        useNativeIOS={Platform.OS === 'ios'}
        onDismiss={() => setShowActionSheet(false)}
      />

      <Dialog
        visible={isDialogVisible}
        width={160}
        height={160}
        onDismiss={() => {
          hideDialog()
        }}
        containerStyle={{
          backgroundColor: Colors.white,
          borderRadius: 12
        }}
      >
        <View flex center>
          <ActivityIndicator size='large' />
          <Text marginT-8 $textNeutral text90>Unbinding</Text>
        </View>
      </Dialog>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  itemSeparator: {
    borderBottomWidth: 0.5,
    borderColor: Colors.$outlineDisabled,
  },
  cardBorder: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 4
  },
  titleBar: {
    position: 'absolute',
    display: 'flex',
    top: 0,
    left: 4,
    right: 4,
    zIndex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 12,
  }
})

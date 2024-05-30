import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Button, ButtonSize, Colors, Image, Text, View } from 'react-native-ui-lib'
import { CardStatusComponent } from '@component/card_status'
import PT2Icon from '@component/svg/pt2'
import { useRouter } from 'expo-router'
import MinutesTimer from '@component/minutes_timer'
import { AutoMintPT } from '@component/auto_mint'
import { ChargeSession, D_CHARGING, D_IDLE, D_OFFLINE, DeviceItem, DeviceStatus } from '@util/types/api_entity'
import { DialogStartCharging } from '@component/dialog/start_charging_dialog'
import { DialogStopCharging } from '@component/dialog/stop_charging_dialog'
import APIService from '@util/api/api_driver_service'
import Toast from 'react-native-toast-message'
import { Color } from 'ansi-fragments/build/fragments/Color'
import TagShared from '@component/tag_shared'


type Props = {
  item: DeviceItem,
  chargeSession: ChargeSession | undefined,
  onSuccess: (type: string) => void
};

export const CardDeviceT2: React.FC<Props> = ({ item, chargeSession, onSuccess }) => {

  const router = useRouter()
  const [earnPT, setEarnPT] = useState(0)
  const [duration, setDuration] = useState(0)

  const [isVisibleA, setVisibleA] = useState(false)
  const [isVisibleB, setVisibleB] = useState(false)

  const onStartCharging = () => {
    APIService.startCharging(item.deviceId).then((response) => {
      setTimeout(() => {
        if (response.code === '0') {
          onSuccess('start')
          Toast.show({
            type: 'success',
            text1: 'Start charging'
          })
        } else {
          Toast.show({
            type: 'error',
            text1: 'Oops, something went wrong!'
          })
        }

        setVisibleA(false)
      }, 4000)

    })
  }

  const onStopCharging = () => {
    APIService.stopCharging(item.deviceId).then((response) => {
      setTimeout(() => {
        if (response.code === '0') {
          onSuccess('stop')
          Toast.show({
            type: 'success',
            text1: 'Stop charging'
          })
        } else {
          Toast.show({
            type: 'error',
            text1: 'Oops, something went wrong!'
          })
        }
        setVisibleB(false)
      }, 4000)
    })
  }

  useEffect(() => {
    console.log('chargeSession2: ', chargeSession)
    if (chargeSession) {
      setEarnPT(chargeSession.totalAmount)
      setDuration(chargeSession.totalSecs)
    } else {
      setEarnPT(0)
      setDuration(0)
    }
  }, [chargeSession])


  function onPress() {
    router.push({
      pathname: '/provider/device/plug_detail',
      params: { id: item.deviceId, type: item.type }
    })
  }

  return (
    <View flex br40 bg-white padding-16 style={styles.boardContainer}>
      <Image source={require('assets/ic_tag_p.png')} width={95} height={95} style={styles.imgTag} />
      <Pressable onPress={onPress}>
        <View>
          <View row>
            <View br20 bg-bgColor width={80} height={80} center>
              <Image source={require('assets/ic_pulse_I.png')}
                     style={{ width: 60, height: 80 }}
                     resizeMode={'cover'} />
            </View>
            <View flex paddingL-16>
              <Text text70 $textPrimary>PowerPod Pulse I</Text>
              <Text text90R $textNeutralLight>ID: {item.deviceId}</Text>
            </View>
          </View>

          <View row spread style={styles.txtPosition}>
            <CardStatusComponent status={item?.status} />

            <View flex>
              <Text text90R $textNeutral marginB-6>Duration</Text>
              <MinutesTimer initialMinutes={Math.floor(duration / 60)} isRunning={item?.status === D_CHARGING} />
            </View>

            <View flex>
              <Text text90R $textNeutral marginB-6>Earn</Text>
              <View row centerV>
                <AutoMintPT initialPT={earnPT * 1000} isRunning={item?.status === D_CHARGING} />
                <PT2Icon width={12} height={12} />
              </View>
            </View>
          </View>
        </View>
      </Pressable>

      {item?.isShared &&
        <TagShared style={styles.sharingText} />
      }

      {!item.isShared &&
        <Button label={item.status === D_CHARGING ? 'Stop Charging' : 'Start Charging'}
                disabled={item.status === D_OFFLINE}
                size={ButtonSize.large}
                marginT-16
                text70M
                backgroundColor={item.status === D_CHARGING ? Colors.$textPrimary : Colors.white}
                disabledBackgroundColor={Colors.$100}
                labelStyle={
                  item.status === D_CHARGING ? { color: Colors.white, marginLeft: 4 } :
                    item.status === D_IDLE ? { color: Colors.$textPrimary, marginLeft: 4 } :
                      { color: Colors.$300, marginLeft: 4 }}
                onPress={() => {
                  if (item?.status === D_CHARGING) {
                    setVisibleB(true)
                  } else if (item.status === D_IDLE) {
                    setVisibleA(true)
                  }

                }} />
      }

      <DialogStartCharging
        onPress={onStartCharging}
        isVisible={isVisibleA}
        onDismiss={() => setVisibleA(false)}
      />

      <DialogStopCharging
        isVisible={isVisibleB}
        onPress={onStopCharging}
        onDismiss={() => setVisibleB(false)} />

    </View>

  )
}

const styles = StyleSheet.create({
  boardContainer: {
    minHeight: 180,
    overflow: 'hidden'
  },
  txtPosition: {

    marginTop: 24,
    width: '100%'
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: Colors.$outlineDisabled
  },
  sharingText: {
    position: 'absolute',
    top: 16,
    right: 12,
  },
  imgTag: {
    position: 'absolute',
    bottom: 0,
    right: 0
  }


})

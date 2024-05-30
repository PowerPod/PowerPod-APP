import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Colors, Text, View, Image } from 'react-native-ui-lib'
import { CardStatusComponent } from '@component/card_status'
import PTIcon from '@component/svg/pt'
import { AutoMintPT } from '@component/auto_mint'
import MinutesTimer from '@component/minutes_timer'
import Animated from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { ChargeSession, D_CHARGING, D_OFFLINE, DeviceItem, DeviceStatus } from '@util/types/api_entity'


type Props = {
  item: DeviceItem;
  chargeSession: ChargeSession | undefined;
};

export const CardDeviceT1: React.FC<Props> = ({ item, chargeSession }) => {

  const router = useRouter()
  const [earnPT, setEarnPT] = useState(0)
  const [plugStatus, setPlugStatus] = useState<DeviceStatus>()
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    console.log('chargeSession: ', chargeSession)
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
    <Pressable onPress={onPress}>
      <View flex br40 bg-black padding-16 style={styles.boardContainer}>
        <Image source={require('assets/ic_tag_p.png')} style={styles.imgTag} />

        <Animated.Image source={require('assets/plug1.png')} style={styles.imageBg} resizeMethod='auto'
                        sharedTransitionTag={`tag${item.deviceId}`} />
        <View>
          <Text text90 $textGeneral marginB-6>
            ID: {item.id}
          </Text>
          <CardStatusComponent status={plugStatus?.status ?? D_OFFLINE} darkTheme />
        </View>

        <View style={styles.txtPosition}>
          <View row centerV spread style={{ width: 180 }}>
            <Text text90R $textNeutralLight>Duration</Text>
            <MinutesTimer initialMinutes={Math.floor(duration / 60)} darkTheme
                          isRunning={plugStatus?.status === D_CHARGING} />
          </View>

          <View row centerV spread style={{ width: 180 }}>
            <Text text90R $textNeutralLight>Earn</Text>
            <View row centerV>
              <AutoMintPT initialPT={earnPT} darkTheme isRunning={plugStatus?.status === D_CHARGING} />
              <PTIcon width={12} height={12} />
            </View>
          </View>
        </View>

      </View>
    </Pressable>

  )
}

const styles = StyleSheet.create({
  boardContainer: {
    minHeight: 180,
    overflow: 'hidden'
  },
  imageBg: {
    position: 'absolute',
    flexShrink: 0,
    width: 220,
    height: 215,
    top: 5,
    right: -55,
  },

  txtPosition: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    gap: 4
  },
  imgTag: {
    position: 'absolute',
    bottom: 0,
    right: 0
  }


})

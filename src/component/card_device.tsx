import React, { useEffect, useRef, useState } from 'react'
import { GestureResponderEvent, ImageBackground, Pressable, StyleSheet } from 'react-native'
import { AnimatedImage, Colors, Text, View } from 'react-native-ui-lib'
import { CardBackground } from '@component/card_bg'
import { CardStatusComponent, PlugStatus } from '@component/card_status'
import PTIcon from '@component/svg/pt'
import { AutoMintPT } from '@component/auto_mint'
import MinutesTimer from '@component/minutes_timer'
import Animated from 'react-native-reanimated'
import { MoreHorizontalIcon } from 'lucide-react-native'


type Props = {
  title?: string;
  onPress?: () => void
};

export const CardDevice: React.FC<Props> = ({ title, onPress }) => {

  const [status, setStatus] = React.useState(PlugStatus.Charging)
  const [number, setNumber] = useState(1)

  const secondRef = useRef(1)
  const [duration, setDuration] = useState(1)
  const [income, setIncome] = useState('0.0000')

  const intervalRef = useRef<NodeJS.Timeout | null>(null)


  function onPressff(event: GestureResponderEvent) {
    setNumber(number + 1)
    if (number % 2 == 0) {
      setStatus(PlugStatus.Charging)
      console.log('charging')
    } else {
      setStatus(PlugStatus.Idle)
      console.log('idle')
    }
  }

  return (
    <Pressable onPress={onPress}>
      <View flex br10 bg-white padding-16>

        <View row spread>
          <Animated.Image source={require('assets/plug1.png')} style={styles.imageBg} resizeMethod='auto'
                          sharedTransitionTag='tag1' />

          <View>
            <Text>Powerpod Plug</Text>
            <Text text90 $textGeneral marginB-6>
              ID: 2910
            </Text>
          </View>

          <MoreHorizontalIcon size={24} />

        </View>


        <CardStatusComponent status={status} />

        <View style={styles.txtPosition}>
          <View row centerV spread style={{ width: 180 }}>
            <Text text90 $textNeutralLight>Duration</Text>
            {/*<Text text90 white numberOfLines={1} ellipsizeMode='tail'>*/}
            {/*  {duration} min*/}
            {/*</Text>*/}
            <MinutesTimer initialMinutes={0} />
          </View>

          <View row centerV spread style={{ width: 180 }}>
            <Text text90 $textNeutralLight>Income</Text>
            <View row centerV>
              {/*<Text text90 white marginR-4 numberOfLines={1} ellipsizeMode='tail'>*/}
              {/*  {income}*/}
              {/*</Text>*/}
              <AutoMintPT initialPT={2400} />
              <PTIcon width={12} height={12} />
            </View>
          </View>
        </View>

      </View>
    </Pressable>

  )
}

const styles = StyleSheet.create({

  imageBg: {
    flexShrink: 0,
    width: 220,
    height: 215,
  },

  txtPosition: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    gap: 4
  },


})

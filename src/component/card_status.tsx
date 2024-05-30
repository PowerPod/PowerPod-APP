import React from 'react'
import { Colors, Text, View } from 'react-native-ui-lib'
import Animated, {
  Easing,
  PinwheelIn,
  PinwheelOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native'
import { ZapIcon } from 'lucide-react-native'
import PlugOfflineIcon from '@component/svg/plug_offline'
import PlugOnlineIcon from '@component/svg/plug_online'
import { D_CHARGING, D_IDLE, D_OFFLINE } from '@util/types/api_entity'

type StatusComponentProps = {
  status: string,
  darkTheme?: boolean
};

export const CardStatusComponent: React.FC<StatusComponentProps> = (
  {
    status,
    darkTheme = false
  }) => {

  const textWidth = useSharedValue(0)
  const [inner, setInner] = React.useState(true)


  const animatedStyle = useAnimatedStyle(() => {
    // console.log(`${textWidth.value}`)
    return { width: textWidth.value, opacity: textWidth.value / 80 }
  }, [textWidth])

  const oldCount = useSharedValue<string>(D_OFFLINE)
  const newCount = useSharedValue<string>(status)

  React.useEffect(() => {
    newCount.value = status
    textWidth.value = withTiming(80, { easing: Easing.bounce, duration: 1500 })

    setInner(!inner)

    return () => {
      textWidth.value = 0
    }
  }, [status])

  const renderIcon = () => {
    if (status === D_OFFLINE) {
      return <PlugOfflineIcon color={darkTheme ? Colors.white : Colors.black} />
    } else if (status === D_IDLE) {
      return <PlugOnlineIcon width={16} height={16} color={darkTheme ? Colors.white : Colors.black} />
    } else if (status === D_CHARGING) {
      return <ZapIcon size={16} color={darkTheme ? Colors.white : Colors.black} />
    }
  }

  const renderText = () => {
    if (status === D_OFFLINE) {
      return 'Offline'
    } else if (status === D_IDLE) {
      return 'Idle'
    } else if (status === D_CHARGING) {
      return 'Charging'
    }
  }

  return (
    <View flex>
      <Text text90R marginB-6
            style={{ color: darkTheme ? Colors.$textNeutralLight : Colors.$textNeutral }}>Status</Text>
      <View flex row centerV>
        <View
          style={styles.box}>
          {inner && (
            <Animated.View style={styles.icon} entering={PinwheelIn} exiting={PinwheelOut}>
              {renderIcon()}
            </Animated.View>
          )}

          {!inner && (
            <Animated.View style={styles.icon} entering={PinwheelIn} exiting={PinwheelOut}>
              {renderIcon()}
            </Animated.View>
          )}
        </View>
        <Animated.Text numberOfLines={1} style={[{
          fontSize: 14,
          color: darkTheme ? Colors.white : Colors.primary,
          fontWeight: '500',
          lineHeight: 20,
          marginLeft: 2
        }, animatedStyle]}> {renderText()}</Animated.Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 14,
    height: 14,
    justifyContent: 'center',
  }


})

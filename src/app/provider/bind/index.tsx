import { StatusBar } from 'expo-status-bar'
import { Platform, StyleSheet } from 'react-native'
import { Button, ButtonSize, Colors, Image, View } from 'react-native-ui-lib'
import { useState } from 'react'
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { QrCodeIcon } from 'react-native-heroicons/solid'

export default function ModalScreen() {

  const router = useRouter()
  const [step, setStep] = useState(1)
  const progress = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['yellow', 'white']
      ),
    }
  })

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['white', 'yellow']
      ),
    }
  })

  const handleNext = () => {
    setStep(2)
    progress.value = withTiming(1 - progress.value, { duration: 500 })
  }

  const handleScan = async () => {
    setStep(1)
    progress.value = withTiming(progress.value - 1, { duration: 500 })
    router.push('/provider/bind/scan-device')
  }

  return (
    <View flex padding-16 centerH>

      <View row centerV marginT-12>
        <Animated.View style={[{ padding: 8, borderRadius: 10 }, animatedStyle]}>
          <Image source={require('@assets/gas-station.png')} width={24} height={24} />
        </Animated.View>

        <Image source={require('@assets/line-step.png')} height={1} width={85} marginH-8 />

        <Animated.View style={[{ padding: 8, borderRadius: 10 }, animatedStyle2]}>
          <QrCodeIcon size={24} color={Colors.black} />
          {/*<Image source={require('assets/gas-station.png')} width={24} height={24} />*/}
        </Animated.View>

      </View>
      {step === 1 && (
        <>
          <Animated.Text exiting={FadeOut.duration(500)} style={{ marginVertical: 26 }}>
            Step 1: Connect the plug to the charging gun
          </Animated.Text>

          <Animated.Image source={require('@assets/img-step1.png')}
                          resizeMode='cover' style={{ height: 358, width: 358, borderRadius: 20, overflow: 'hidden' }}
                          exiting={FadeOut.duration(500)}
          />

          <Button marginT-26 label='Next' size={ButtonSize.large} style={{ width: '100%' }} br30 onPress={handleNext} />
        </>
      )}


      {step === 2 && (
        <>
          <Animated.Text entering={FadeIn.duration(500)} style={{ marginVertical: 26 }}>
            Step 2: Scan the QR Code on the screen
          </Animated.Text>

          <Animated.Image
            entering={FadeIn.duration(1000)}
            source={require('@assets/img-step2.png')}
            style={{ height: 358, width: 358, borderRadius: 20 }} resizeMode='cover'
            borderRadius={30}
          />

          <Button
            marginT-26
            label='Scan Now'
            size={ButtonSize.large}
            style={{ width: '100%' }}
            br30
            onPress={handleScan}
          />
        </>)}


      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

const styles = StyleSheet.create({})

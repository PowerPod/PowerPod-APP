import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Button, ButtonSize, Chip, Colors, Image, Text, View } from 'react-native-ui-lib'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function Step3Screen() {
  return (
    <View flex>
      <View centerH>
        <Image source={require('@assets/circle_wave.png')} width={270} height={270}
               style={{ zIndex: -1, position: 'absolute', marginTop: 70 }}>
        </Image>
        <Image source={require('@assets/pulse_big.png')} width={200} height={250} style={{ marginTop: 80 }} />
        <Chip iconSource={require('@assets/ic_check.png')}
              iconStyle={{ width: 30, height: 30 }}
              containerStyle={{
                backgroundColor: '#D7FF82',
                borderColor: '#D7FF82',
                padding: 16,
                position: 'absolute',
                right: 60,
                bottom: 0
              }}
        />
      </View>

      <View centerH marginT-48>
        <Text text50M marginV-12>Successfully Paired</Text>

        <Text marginH-16 $textNeutral>Congratulations! Your device has been successfully activated.</Text>
      </View>

      <Button label='Done'
              marginT-48
              marginH-16
              size={ButtonSize.large}
              borderRadius={6}
              onPress={() => router.replace('/')} />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

const styles = StyleSheet.create({})

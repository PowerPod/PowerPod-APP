import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { Text, View } from 'react-native-ui-lib'

export default function TagShared({ style }: { style?: ViewStyle }) {
  return (
    <View flex br10 bg-$backgroundWarningLight paddingH-7 paddingV-2 style={style}>
      <Text $textPrimary text90>Shared</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

import React from 'react'
import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from 'react-native-ui-lib'

export default function DeviceLayout() {

  return (
    <Stack screenOptions={{ headerBackTitleVisible: false, headerTintColor: Colors.black }}>
      <Stack.Screen name='index' options={{ title: 'Home', headerShown: true }} />
    </Stack>
  )
}

const styles = StyleSheet.create({})

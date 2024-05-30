import React from 'react'
import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router'

export default function BindLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ title: 'Add Device', headerShown: true }} />
      <Stack.Screen name='scan-device' options={{ title: 'Scan QR' }} />
      <Stack.Screen name='step3' options={{ title: 'Bind Device', headerShown: true }} />

    </Stack>
  )
}

const styles = StyleSheet.create({})

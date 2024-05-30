import React from 'react'
import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router'

export default function ConsumerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='charge' options={{ title: 'Charge' }} />
      <Stack.Screen name='camera-scan' options={{ title: 'Scan QR', presentation: 'modal', headerShown: true }} />
    </Stack>
  )
}

const styles = StyleSheet.create({})

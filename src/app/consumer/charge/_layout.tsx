import React from 'react'
import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from 'react-native-ui-lib'

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name='[id]' options={{ headerShown: false, title: 'Device' }} />
      <Stack.Screen name='order' options={{
        headerShown: false,
        title: 'Charge Status'
      }} />
    </Stack>
  )
}

const styles = StyleSheet.create({})

import React from 'react'
import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from 'react-native-ui-lib'

export default function Layout() {
  return (
    <Stack screenOptions={{ headerBackTitleVisible: false, headerTintColor: Colors.black }}>
      <Stack.Screen name='index' options={{ headerShown: true, title: 'Orders' }} />
      <Stack.Screen name='detail' options={{ title: 'Order Detail' }} />
    </Stack>
  )
}

const styles = StyleSheet.create({})

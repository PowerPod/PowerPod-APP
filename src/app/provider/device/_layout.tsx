import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Colors } from 'react-native-ui-lib'
import { Stack } from 'expo-router'

export default function DeviceLayout() {
  return (
    <Stack screenOptions={{ headerBackTitleVisible: false, headerTintColor: Colors.black }}>

      <Stack.Screen name='plug_detail' options={{
        headerShown: false
      }} />
      <Stack.Screen name='swap_pt' options={{
        headerShown: true,
        headerTitle: 'Swap PT',
        headerStyle: { backgroundColor: Colors.white },
        headerShadowVisible: false
      }} />
      <Stack.Screen name='swap_record' options={{
        headerShown: true,
        headerTitle: 'Swap Records',
        headerStyle: { backgroundColor: Colors.white },
        headerShadowVisible: false
      }} />
      <Stack.Screen name='my_pt' options={{
        headerShown: true,
        headerTitle: 'Rank',
        headerStyle: { backgroundColor: Colors.bgColor },
        headerShadowVisible: false
      }} />
    </Stack>
  )
}

const styles = StyleSheet.create({})

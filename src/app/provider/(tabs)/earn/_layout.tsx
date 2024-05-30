import React from 'react'
import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from 'react-native-ui-lib'

export default function EarnLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: 'Earn',
        headerTitleStyle: { color: Colors.white }
      }} />

    </Stack>
  )
}

const styles = StyleSheet.create({})

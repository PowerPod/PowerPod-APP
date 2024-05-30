import React from 'react'
import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from 'react-native-ui-lib'

export default function ProviderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, headerBackTitleVisible: false, headerTintColor: Colors.black }}>
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='(share)/index' options={{ headerShown: true, title: 'Share Device' }} />
      <Stack.Screen name='bind' options={{ presentation: 'modal' }} />
      <Stack.Screen name='invest_history' options={{
        headerShown: true,
        headerTitle: 'Invest History',
        headerStyle: { backgroundColor: Colors.white },
        headerShadowVisible: false
      }} />
      <Stack.Screen name='device' />
    </Stack>
  )
}

const styles = StyleSheet.create({})

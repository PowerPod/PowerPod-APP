import React from 'react'
import { StyleSheet, View } from 'react-native'
import { router, Tabs } from 'expo-router'
import { LucideClipboardList, LucideFuel, LucideMap, LucideScan, LucideWallet } from 'lucide-react-native'
import { Colors, Icon } from 'react-native-ui-lib'

export default function ConsumerTabsLayout() {


  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
    }}>
      <Tabs.Screen name='(nearby)' options={{
        title: 'Device', headerShown: false,
        headerShadowVisible: false,
        tabBarIcon: ({ focused, color, size }) =>
          focused ? <Icon assetName={'ic_home_focused'} size={size} /> :
            <Icon assetName={'ic_home'} size={size} />
      }} />

      <Tabs.Screen name='map' options={{
        title: 'Map', tabBarIcon: ({ focused, color, size }) =>
          focused ? <Icon assetName='ic_map_focused' size={size} /> :
            <Icon assetName='ic_map' size={size} />
      }} />

      <Tabs.Screen name='camera' options={{
        title: '',
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <View
            style={{
              position: 'absolute',
              bottom: 0, // space from bottom bar
              height: 48,
              width: 48,
              borderRadius: 48,
              borderWidth: 1,
              borderColor: Colors.$outlineDefault,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LucideScan color={color} size={24} />
          </View>
        )
      }} listeners={{
        tabPress: (e) => {
          e.preventDefault()
          router.push('/consumer/camera-scan')
        }
      }}
      />


      <Tabs.Screen name='orders' options={{
        title: 'Orders',
        tabBarIcon: ({ focused, color, size }) => focused ? <Icon assetName='ic_order_focused' size={size} /> :
          <Icon assetName='ic_order' size={size} />
      }} />

      <Tabs.Screen name='wallet' options={{
        title: 'Wallet', headerShown: false,
        tabBarIcon: ({ focused, color, size }) => focused ? <Icon assetName='ic_wallet_focused' size={size} /> :
          <Icon assetName='ic_wallet' size={size} />
      }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({})

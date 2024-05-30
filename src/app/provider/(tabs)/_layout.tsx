import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Tabs } from 'expo-router'
import { Colors, Icon } from 'react-native-ui-lib'
import { BoltIcon, UserIcon } from 'react-native-heroicons/solid'
import PTTabIcon from '@component/svg/pt_tab'


export default function ProviderTabLayout() {
  const [selectedTab, setSelectedTab] = useState<string | null>(null)

  const handleTabChange = (tabName: string | null) => {
    setSelectedTab(tabName)
  }

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: selectedTab === 'earn' ? Colors.accent : Colors.primary,
      headerTitleAlign: 'center',
      tabBarStyle: {
        backgroundColor: selectedTab === 'earn' ? Colors.$700 : 'white',
        borderTopWidth: selectedTab === 'earn' ? 0 : 0.25
      },

    }}>
      <Tabs.Screen name='(device)' options={{
        tabBarLabel: 'Devices',
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => focused ? <Icon assetName='ic_home_focused' size={size} /> :
          <Icon assetName='ic_home' size={size} />
      }} listeners={{ tabPress: () => handleTabChange(null) }}

      />

      <Tabs.Screen name='earn' options={{
        headerShown: false,
        headerShadowVisible: false,
        tabBarLabel: 'Earn',
        tabBarIcon: ({ focused, color, size }) => (
          // focused ? <Icon assetName='ic_earn_focused' size={size} /> :
          //   <Icon assetName='ic_earn' size={size} tintColor={selectedTab === 'earn' ? 'yellow' : color} />
          <PTTabIcon width={size} height={size}
                     color={selectedTab === 'earn' ? 'yellow' : color} />
        )
      }} listeners={{ tabPress: () => handleTabChange('earn') }}

      />
      <Tabs.Screen name='me' options={{
        headerShown: false,
        tabBarLabel: 'Wallet',
        tabBarIcon: ({ focused, color, size }) => focused ? <Icon assetName='ic_wallet_focused' size={size} /> :
          <Icon assetName='ic_wallet' size={size} />
      }} listeners={{ tabPress: () => handleTabChange(null) }}

      />

    </Tabs>
  )
}

const styles = StyleSheet.create({})

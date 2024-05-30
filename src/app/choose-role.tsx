import React, { useEffect, useState } from 'react'
import { ImageSourcePropType, StyleSheet } from 'react-native'
import { Colors, Constants, Image, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { StatusBar } from 'expo-status-bar'
import { useAuthStore } from '@store/auth.store'
import { router } from 'expo-router'
import { preference } from '@store/preference'


export default function ChooseRolePage() {

  const { user } = useAuthStore()
  const [role, setRole] = useState<string>()

  useEffect(() => {
    const role = preference.getRole()
    if (role) {
      setRole(role)
    }
  }, [])

  function handleChoose(type: string) {
    preference.setRole(type)
    setRole(type)
  }

  useEffect(() => {
    if (user) {
      if (role === 'provider') {
        router.replace('/provider/')
      } else if (role === 'consumer') {
        router.replace('/consumer/')
      }
    }
  }, [role])


  function RoleCard({ title, desc, type, icon, handleChoose }: {
    title: string,
    desc: string,
    type: string,
    icon: ImageSourcePropType,
    handleChoose: (type: string) => void
  }) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => handleChoose(type)}>
        <View paddingH-12 paddingV-16 marginT-16 center br40 row
              style={styles.card}>
          <View style={styles.cardImageBg}>
            <Image source={icon} style={styles.cardImage} />
          </View>
          <View flex-1 marginL-20>
            <Text text70M white>
              {title}
            </Text>
            <Text text80 marginT-4 $textNeutral>
              {desc}
            </Text>
          </View>

        </View>
      </TouchableOpacity>
    )

  }

  return (
    <View flex padding-32 backgroundColor={Colors.black}>
      <Text style={styles.title}>Select an role to continue</Text>
      <RoleCard title='I’m a provider'
                desc='Earn income by renting charging equipment'
                type={'provider'}
                icon={require('assets/ic_pulse_I.png')}
                handleChoose={handleChoose} />
      <RoleCard title='I’m a driver'
                desc='Find nearby charging equipmentand charge your car'
                type={'consumer'}
                icon={require('assets/icon_role_driver.png')}
                handleChoose={handleChoose} />

      <StatusBar style={'light'} />
    </View>

  )
}

const styles = StyleSheet.create({
  title: {
    marginTop: Constants.statusBarHeight + 12,
    color: Colors.white,
    fontSize: 32,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 40,
    textAlign: 'left'
  },
  card: {
    borderWidth: 1,
    borderColor: '#262626',
    borderStyle: 'solid',
    overflow: 'hidden'
  },
  cardImage: {
    width: 53,
    height: 38
  },
  cardImageBg: {
    width: 56,
    height: 56,
    backgroundColor: '#262626',
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

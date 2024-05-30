import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Colors, Constants, Dialog, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { ChevronRightIcon, LockKeyholeIcon, LogOutIcon, MailIcon } from 'lucide-react-native'
import { useAuthStore, useDeviceStore, useWalletStore } from '@store/auth.store'
import { loginOut } from '@util/particleAuthHelper'
import * as particleAuth from '@particle-network/rn-auth'
import { StatusBar } from 'expo-status-bar'

export default function SettingScreen() {

  const user = useAuthStore((state) => state.user)
  const loginOutUser = useAuthStore((state) => state.logout)

  const [isDialogVisible, setDialogVisible] = useState(false)

  const hideDialog = function () {
    setDialogVisible(false)
  }
  return (
    <View flex padding-16>
      <TouchableOpacity>
        <View row centerV padding-12>
          <MailIcon size={24} color={Colors.black} />
          <Text flex marginL-8 text80M>Email</Text>
          <Text text90R $textNeutral>{user?.email}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        particleAuth.openAccountAndSecurity()
      }}>
        <View row centerV padding-12>
          <LockKeyholeIcon size={24} color={Colors.black} />
          <Text flex marginL-8 text80M>Account and Security</Text>
          <ChevronRightIcon size={24} color={Colors.grey40} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        setDialogVisible(true)
      }}>
        <View row centerV padding-12>
          <LogOutIcon size={24} color={Colors.black} />
          <Text flex marginL-8 text80M>Logout</Text>
          <ChevronRightIcon size={24} color={Colors.grey40} />
        </View>
      </TouchableOpacity>


      <Dialog
        visible={isDialogVisible}
        containerStyle={{
          backgroundColor: Colors.white,
          borderRadius: 12,
          marginBottom: Constants.isIphoneX ? 0 : 20,
        }}
      >
        <View padding-16>
          <Text text50 $textDefault>Confirm logout?</Text>
          <Text text80 marginT-20 marginB-20>After logging out, you will need to enter your email and master password
            again to access your account.</Text>
          <View row margin-20 right>
            <Button text60 label='Cancel' link linkColor={Colors.red30} onPress={hideDialog} />
            <Button marginL-40 text60 label='Log out' link onPress={() => {
              loginOut().then(() => loginOutUser())
              hideDialog()
            }} />
          </View>
        </View>
      </Dialog>

      <StatusBar style={'dark'} />
    </View>
  )
}

const styles = StyleSheet.create({})

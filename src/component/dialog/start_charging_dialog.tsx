import React, { useEffect, useState } from 'react'
import { Button, ButtonSize, Colors, Image, Incubator, Text } from 'react-native-ui-lib'
import { StyleSheet } from 'react-native'
import * as Progress from 'react-native-progress'

type Props = {
  isVisible: boolean;
  onPress: () => void;
  onDismiss: () => void;
};

export const DialogStartCharging = ({ isVisible, onPress, onDismiss }: Props) => {

  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Incubator.Dialog
      center
      containerStyle={styles.dialog}
      visible={isVisible}
      onDismiss={() => {
        setIsSubmitting(false)
        onDismiss()
      }}
    >
      <Image source={require('assets/charing_guid.png')} style={{ width: '100%', height: 350 }} resizeMode='stretch' />
      <Text marginT-4 marginB-32 $textNeutral>Please make sure you have connected as shown in the figure.</Text>

      <Button label='Start Charing'
              size={ButtonSize.medium}
              onPress={() => {
                setIsSubmitting(true)
                onPress()
              }}
              text70M
              iconSource={(iconStyle) => isSubmitting ?
                <Progress.Circle size={20} color={Colors.grey40} indeterminate={true}
                                 style={{ marginRight: 8 }} /> : <></>
              }
              style={{ width: '100%' }} />

    </Incubator.Dialog>
  )
}

const styles = StyleSheet.create({
  dialog: {
    padding: 16,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

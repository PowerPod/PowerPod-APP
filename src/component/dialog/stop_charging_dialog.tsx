import React, { useState } from 'react'
import { Button, ButtonSize, Colors, Image, Incubator, Text } from 'react-native-ui-lib'
import { StyleSheet } from 'react-native'
import * as Progress from 'react-native-progress'

type Props = {
  isVisible: boolean;
  onPress: () => void;
  onDismiss: () => void;
};

export const DialogStopCharging = ({ isVisible, onPress, onDismiss }: Props) => {

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
      <Text marginT-4 marginB-4 $textPrimary text70M>Alert Dialog</Text>
      <Text marginT-4 marginB-32 $textNeutral text80>Are you sure you want to stop charging?</Text>

      <Button label='Stop Charing'
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
              backgroundColor={Colors.orange40}
              style={{ width: '100%' }} />

    </Incubator.Dialog>
  )
}

const styles = StyleSheet.create({
  dialog: {
    padding: 16,
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  }
})

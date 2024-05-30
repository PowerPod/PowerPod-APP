import React from 'react'
import { Text, View } from 'react-native'

type Props = {
  title?: string;
};

export const ExampleComponent: React.FC<Props> = ({ title }) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  )
}
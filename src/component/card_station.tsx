import React, { useRef, useState } from 'react'
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native'
import { Colors, Image, Text, View } from 'react-native-ui-lib'
import { PlugIcon, StarIcon, ZapIcon } from 'lucide-react-native'
import { router } from 'expo-router'
import { D_CHARGING, D_IDLE, D_OFFLINE, SharedDeviceItem } from '@util/types/api_entity'
import PlugOfflineIcon from '@component/svg/plug_offline'
import PlugOnlineIcon from '@component/svg/plug_online'

type Props = {
  item?: SharedDeviceItem;
};

export const CardStation: React.FC<Props> = ({ item }) => {

  function onPress(event: GestureResponderEvent) {
    router.push(`/consumer/charge/${item?.deviceId}`)
  }

  const renderStatusColor = (status: string | undefined) => {
    if (status === D_OFFLINE) {
      return Colors.$textNeutralLight
    } else if (status === D_IDLE) {
      return Colors._textLime500
    } else if (status === D_CHARGING) {
      return '#ef4444'
    }
    return Colors.$textNeutralLight
  }

  return (
    <Pressable onPress={onPress}>
      <View flex row br20 bg-white padding-12>

        <Image source={require('assets/ic_pulse_I.png')} width={36} height={36} marginR-12 />

        <View flex>
          <View flex row spread>
            <Text text70M $textPrimary>{item?.deviceName}</Text>

            <Text color={renderStatusColor(item?.status)}
                  style={{ textTransform: 'capitalize' }}>{item?.status}</Text>
          </View>

          <View flex row spread marginT-2 top>
            <Text flexS text80 $textNeutral marginR-8 numberOfLines={2} ellipsizeMode='tail'
                  style={{ flexWrap: 'wrap', textAlign: 'auto', minHeight: 48 }}>{item?.detailAddress}</Text>
            <Text $textNeutral>{item?.distance} km</Text>
          </View>

          <View row spread marginT-12>
            <View row centerV>
              <Text $textNeutral>{item?.plugType}</Text>
              <Text $textNeutral>·</Text>
              <Text $textNeutral>{item?.maxPower}kW</Text>
            </View>

            <View row bottom>
              <Text text80 $textPrimary>$</Text>
              <Text text80M $textPrimary>{item?.amount}</Text>
              <Text text80 $textNeutral>/h</Text>
            </View>

          </View>
        </View>

      </View>
    </Pressable>

  )
}

const styles = StyleSheet.create({

  imageBg: {
    flexShrink: 0,
    width: 220,
    height: 215,
  },

  txtPosition: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    gap: 4
  },


})

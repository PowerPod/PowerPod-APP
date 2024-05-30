import React, { useCallback, useEffect, useState } from 'react'
import { Linking, Platform, StyleSheet } from 'react-native'
import { Avatar, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { ClockIcon, LucideNavigation, LucidePhoneCall, LucideStar, NavigationIcon, ZapIcon } from 'lucide-react-native'
import ImagesScroll from '@component/images_scroll'
import { D_CHARGING, D_IDLE, D_OFFLINE, Device, SharedDevice } from '@util/types/api_entity'
import APIService from '@util/api/api_driver_service'

/**
 *  Show device detail
 *
 * @param showImages
 * @param deviceId if not null, fetch device detail
 * @param deviceEntity if not null, use it. Only when deviceId is null.
 * @constructor
 */
export default function ChargeStationDetail({ showImages = false, deviceId, deviceEntity }: {
  showImages?: boolean,
  deviceId?: string,
  deviceEntity?: SharedDevice
}) {

  const [device, setDevice] = useState<SharedDevice>()

  const callLocalNavigator = useCallback(() => {
    const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' })
    const latLng = `${device?.lat},${device?.lon}`
    const label = device?.detailAddress
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    })

    if (url != null) {
      Linking.openURL(url).then()
    }
  }, [device])

  const callLocalPhone = useCallback(() => {
    const phoneNumber = device?.phone
    const url = `tel:${phoneNumber}`
    Linking.openURL(url).then()
  }, [device])

  const renderStatusColor = (status: string | undefined) => {
    if (status === D_OFFLINE) {
      return Colors.$textNeutral
    } else if (status === D_IDLE) {
      return Colors._textLime500
    } else if (status === D_CHARGING) {
      return '#ef4444'
    }
    return Colors.$textNeutral
  }

  useEffect(() => {

    if (deviceId) {
      //fetch device detail
      APIService.fetchDeviceDetail(deviceId)
        .then((response) => {
          if (response) {
            setDevice(response)
          }
        })
    } else {
      if (deviceEntity) {
        setDevice(deviceEntity)
      }
    }

  }, [deviceId, deviceEntity])

  return <>
    <View row>
      <Avatar
        source={require('assets/ic_pulse_I.png')}
        badgeProps={{ size: 10, backgroundColor: Colors.$backgroundWarningHeavy }}
        badgePosition='BOTTOM_RIGHT'
      />

      <View marginL-12>
        <Text text70M $textPrimary>{device?.deviceName}</Text>
        <View row marginT-8>
          <Text text80 color={renderStatusColor(device?.status)}
                style={{ textTransform: 'capitalize' }}>{device?.status}</Text>
          <Text text80 $textNeutral> · </Text>
          <Text text80 $textNeutral>{device?.distance}km</Text>
        </View>
      </View>
    </View>

    <View style={styles.dividerH} />

    {showImages &&
      <View style={{ height: 120 }}>
        <ImagesScroll images={device?.images || []} />
      </View>
    }

    <View>
      <View marginV-12>
        <TouchableOpacity activeOpacity={0.7} onPress={() => callLocalNavigator()}>
          <View row spread centerV>
            <View>
              <Text text80 $textNeutral>Address</Text>
              <Text text500 $textPrimary marginT-4>{device?.detailAddress}</Text>
            </View>

            <View br100 bg-$outlineDisabled padding-12>
              <NavigationIcon size={16} color={Colors.$textPrimary} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View spread marginV-12>
        <View row spread paddingV-4>
          <Text text80 $textNeutral>Price</Text>
          <Text text500 marginL-4 $textPrimary>${device?.amount ?? 0}/h</Text>
        </View>

        <View row spread paddingV-4>
          <Text text80 $textNeutral>Max Power</Text>
          <Text text500 marginL-4 $textPrimary>{device?.maxPower}kW</Text>
        </View>

        <View row spread paddingV-4>
          <Text text80 $textNeutral>Plug Type</Text>
          <Text text500 marginL-4 $textPrimary>{device?.plugType}</Text>
        </View>

        <View row spread paddingV-4>
          <Text text80 $textNeutral>Open Time</Text>
          <Text text500 marginL-4 $textPrimary>{device?.startTime} - {device?.endTime}</Text>
        </View>
      </View>
    </View>

    <View marginV-12 row spread>
      <TouchableOpacity activeOpacity={0.7} onPress={() => callLocalNavigator()}>
        <View style={styles.itemBoard}>
          <LucideNavigation size={16} color={Colors.$textNeutral} />
          <Text text80 $textNeutral>Navigate</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.7} onPress={() => callLocalPhone()}>
        <View style={styles.itemBoard}>
          <LucidePhoneCall size={16} color={Colors.$textNeutral} />
          <Text text80 $textNeutral>Call</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.itemBoard}>
        <LucideStar size={16} color={Colors.$textNeutral} />
        <Text text80 $textNeutral>Rate</Text>
      </View>
    </View>
  </>
}

const styles = StyleSheet.create({
  dividerH: {
    width: 'auto',
    height: 0.5,
    marginVertical: 12,
    backgroundColor: Colors.$outlineDefault,
  },

  itemBoard: {
    width: 100,
    height: 70,
    borderWidth: 1,
    borderColor: Colors.$outlineDefault,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

import React, { useCallback, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Colors, SegmentedControl, Text, View } from 'react-native-ui-lib'
import { StatusBar } from 'expo-status-bar'

export default function PTStatisticsScreen() {

  const [showRank, setShowRank] = useState(false)
  const onChangeIndex = useCallback((index: number) => {
    if (index === 1) {
      setShowRank(true)
    } else {
      setShowRank(false)
    }

  }, [])

  return (
    <View bg-bgColor>
      <View center>
        <SegmentedControl
          segments={[{ label: 'Your mint' }, { label: '' }]}
          backgroundColor={Colors.white} activeBackgroundColor={Colors.black}
          activeColor={Colors.white} inactiveColor={Colors.black}
          style={{ height: 40, marginTop: 24 }} segmentsStyle={{ height: '100%', width: 115 }}
          onChangeIndex={onChangeIndex}
        />
      </View>

      {!showRank && <View>
        <View bg-black margin-16 br60 padding-16 row spread>

          <View flex-1 center marginV-16>
            <Text white text60>300 PT</Text>
            <Text $textNeutral text90 marginT-12>Current remaining</Text>
          </View>

          <View flex-1 center marginV-16>
            <Text white text60>1610 PT</Text>
            <Text $textNeutral text90 marginT-12>Cumulative mining</Text>
          </View>
        </View>

        <FlatList
          data={[{ id: '1', deviceId: '3019', name: '1 kwh' }, { id: '2', deviceId: '3019', name: '2 kwh' }, {
            id: '3',
            deviceId: '3022',
            name: '3 kwh'
          }, {
            id: '4',
            deviceId: '3022',
            name: '4 kwh'
          }, { id: '5', deviceId: '4021', name: '5 kwh' }]}
          horizontal={false}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          renderItem={(item) => (
            <View row centerV paddingV-7>
              <Text flex-2 text80L $textDefault center>{item.item.deviceId}</Text>
              <Text flex-2 text80L $textDefault center>11.01 PT</Text>
              <Text flex-2 text80L $textDefault center>{item.item.name}</Text>
              <Text flex-3 text80L $textDefault center>10 min ago</Text>
            </View>
          )}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            () => (
              <View row paddingV-7>
                <Text flex-2 text90R $textNeutralLight center>Device ID</Text>
                <Text flex-2 text90R $textNeutralLight center>Mint</Text>
                <Text flex-2 text90R $textNeutralLight center>Power</Text>
                <Text flex-3 text90R $textNeutralLight center>Time</Text>
              </View>
            )
          }

        />
      </View>
      }

      {showRank &&
        <View>
          <FlatList
            data={[{ id: '1', address: '0x767...2837', mining: 9863.00 }, {
              id: '2',
              address: '0x26a...3242',
              mining: 7655.23
            }, {
              id: '3',
              address: '0xah1...dj34d',
              mining: 3453.00
            }, {
              id: '4',
              address: '0xabc...3422',
              mining: 2343.11
            }, { id: '5', address: '0xa67...3200', mining: 1342.54 }]}
            horizontal={false}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
            renderItem={(item) => (
              <View row centerV paddingV-7>
                <Text flex-2 text80 $textDefault center>{item.item.id}</Text>
                <Text flex-3 text80 $textDefault center>{item.item.address}</Text>
                <Text flex-2 text80 $textDefault center>{item.item.mining} kWh</Text>
              </View>
            )}
            keyExtractor={item => item.id}
            ListHeaderComponent={
              () => (
                <View row paddingV-7>
                  <Text flex-2 text90R $textNeutralLight center>#</Text>
                  <Text flex-3 text90R $textNeutralLight center>Address</Text>
                  <Text flex-2 text90R $textNeutralLight center>Mining</Text>
                </View>
              )
            }

          />
        </View>
      }

      <StatusBar style={'dark'} />
    </View>
  )
}

const styles = StyleSheet.create({})

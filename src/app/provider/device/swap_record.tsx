import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Colors, Text, View } from 'react-native-ui-lib'
import { getPTSwapRecords } from '@util/supabse/database'
import { useLocalSearchParams } from 'expo-router'
import { useAuthStore } from '@store/auth.store'
import { SwapPTEntity } from '@util/types/db_entity'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import { LinearGradient } from 'expo-linear-gradient'
import { convertUTCToLocalTime } from '@util/utils'

export default function SwapRecordScreen() {

  const { id } = useLocalSearchParams<{ id: string }>()
  const user = useAuthStore((state) => state.user)

  const [isLoading, setLoading] = useState(true)
  const [result, setResult] = useState<SwapPTEntity[]>()

  function getDefaultSkeletonProps() {
    return {
      shimmerColors: [Colors.$backgroundNeutral, Colors.$backgroundNeutralMedium, Colors.$backgroundNeutral],
    }
  }

  useEffect(() => {

    queryPTSwapRecords(id).then()

    async function queryPTSwapRecords(deviceID: string) {
      setLoading(true)
      const { data, error } = await getPTSwapRecords(deviceID, user?.address!)
      if (error) {
        setLoading(false)
        console.log(error)
      }
      if (data) {
        setResult(data)
      }
      setLoading(false)
    }

  }, [])


  return (
    <View flex bg-white>
      <FlatList
        data={result}
        horizontal={false}
        scrollEnabled={true}
        renderItem={({ item }) => (
          <View paddingH-16 paddingV-12 style={styles.divider}>
            <Text text80BO $textPrimary>{item.amount * 1000} PT</Text>

            <View row spread>
              <Text text80R $textNeutral>{item.amount}kWh</Text>
              <Text text80R $textNeutral>{convertUTCToLocalTime(item.updated_at)}</Text>
              <Text text80R $textSuccess style={{ fontWeight: '500' }}
                    color={item.status == 'succeed' ? Colors.$textSuccess : Colors.$textDanger}>{item.status}</Text>
            </View>
          </View>
        )}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={
          () => (
            isLoading ? (
              <View flex center padding-16>
                <ShimmerPlaceholder
                  {...getDefaultSkeletonProps()}
                  width={350}
                  height={18}
                  visible={!isLoading}
                  LinearGradient={LinearGradient}
                />
                <ShimmerPlaceholder
                  {...getDefaultSkeletonProps()}
                  shimmerStyle={{ marginTop: 6 }}
                  width={350}
                  height={18}
                  visible={!isLoading}
                  LinearGradient={LinearGradient}
                />
                <ShimmerPlaceholder
                  {...getDefaultSkeletonProps()}
                  shimmerStyle={{ marginTop: 6 }}
                  width={350}
                  height={18}
                  visible={!isLoading}
                  LinearGradient={LinearGradient}
                />
              </View>
            ) : (
              <View flex center height={200}>
                <Text>No records yet.</Text>
              </View>
            )
          )
        }
        // ListHeaderComponent={
        //   () => (
        //     <View row paddingV-7>
        //       <Text flex-2 text90R $textNeutralLight center>Power(kWh)</Text>
        //       <Text flex-2 text90R $textNeutralLight center>PT</Text>
        //       <Text flex-3 text90R $textNeutralLight center>Date</Text>
        //       <Text flex-2 text90R $textNeutralLight center>State</Text>
        //     </View>
        //   )
        // }

      />

    </View>
  )
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    borderColor: Colors.$outlineDisabled
  }
})

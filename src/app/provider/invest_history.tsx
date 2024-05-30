import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, ImageBackground, StyleSheet } from 'react-native'
import {
  Button,
  ButtonSize,
  Chip,
  Colors,
  LoaderScreen,
  SegmentedControl,
  Spacings,
  Text,
  View
} from 'react-native-ui-lib'
import { StatusBar } from 'expo-status-bar'
import {
  EpochData,
  fetchEpochSummaryData,
  fetchEpochWithIds,
  fetchInvestmentData,
  InvestmentData,
  processInvestmentData
} from '@util/TheGraphQLHepler'
import BigNumber from 'bignumber.js'
import { useAuthStore, useMintStore } from '@store/auth.store'
import { writeContractWithMintPPD } from '@util/contractHelper'
import * as particleAuth from '@particle-network/rn-auth'
import { CommonError } from '@particle-network/rn-connect'
import { calculatePPD, calculateTotalPPD, unit256ToDecimal } from '@util/ppdUtils'
import Toast from 'react-native-toast-message'
import { LucideAArrowUp, LucideCheck } from 'lucide-react-native'

interface ExtendedInvestmentData extends InvestmentData {
  ppdAmount: number;
}

export default function InvestHistoryPage() {
  const [showEpoch, setShowEpoch] = useState(false)
  const [investmentData, setInvestmentData] = useState<ExtendedInvestmentData[]>()
  const [epochList, setEpochList] = useState<EpochData[] | null>()
  const [epochGlobal, setEpochGlobal] = useState<EpochData | null>()

  const [loading, setLoading] = useState(true)

  const user = useAuthStore((state) => state.user)

  //TODO Statistics of data for each round are collected from the backend.The totalPPDInEpoch data is accurate when PPD is halved.
  const { epoch, totalPPDInEpoch, startTime } = useMintStore()

  const onChangeIndex = useCallback((index: number) => {
    if (index === 1) {
      setShowEpoch(true)
    } else {
      setShowEpoch(false)
    }

  }, [])

  const onClaimClick = async (item: InvestmentData, index: number) => {
    const fromAccount = user?.address
    if (fromAccount) {
      const methodName = 'claimTokens'
      const params = [String(item.period)]
      const transaction = await writeContractWithMintPPD(fromAccount, methodName, params)
      console.log('claim tx:', transaction)

      const result = await particleAuth.signAndSendTransaction(transaction)
      if (result.status) {
        //change the claim status
        const newInvestmentData = [...investmentData!]
        newInvestmentData[index].isClaimed = true
        setInvestmentData(newInvestmentData)

        Toast.show({
          type: 'success',
          text1: 'Transaction submitted.',
        })
      } else {
        const error = result.data as CommonError
        console.log(error)

        Toast.show({
          type: 'error',
          text1: 'Transaction failed, please try again.',
        })
      }
    }
  }

  useEffect(() => {
    const fetchData = async (address: string) => {
      const userInvestList = await fetchInvestmentData(address)
      console.log(JSON.stringify(userInvestList))
      if (userInvestList) {
        const _investData = processInvestmentData(userInvestList.investeds, userInvestList.tokensClaimeds)
        const _periods = _investData.map(item => Number(item.period))
        const _epochList = await fetchEpochWithIds(_periods)

        const mergedData = _investData.map(item => {
          const epochData = _epochList?.find(epoch => epoch.period === item.period)
          return {
            ...item,
            ppdAmount: BigNumber(item.amount).div(BigNumber(epochData?.totalInvested!)).times(calculatePPD(Number(epochData?.period), startTime, epoch, totalPPDInEpoch)).toNumber(),
          }
        })

        setInvestmentData(mergedData)
      }


      const epochList = await fetchEpochSummaryData()
      console.log(epochList)
      if (epochList) {
        setEpochList(epochList.periodSummaries)
        setEpochGlobal(epochList.globalSummaries?.[0])
      }

    }

    if (user) {
      fetchData(user.address).then(
        () => setLoading(false)
      )
    }
  }, [])


  return (
    <View flex-1 bg-white>
      <View centerH>
        <SegmentedControl
          segments={[{ label: 'Your Invest' }, { label: 'Epoch' }]}
          backgroundColor={Colors.white} activeBackgroundColor={Colors.black}
          activeColor={Colors.white} inactiveColor={Colors.black}
          style={{ height: 40, marginTop: 24 }}
          segmentsStyle={{ height: '100%', width: 115 }}
          onChangeIndex={onChangeIndex}
        />
      </View>

      {!showEpoch && !loading && <View>
        <FlatList
          data={investmentData}
          renderItem={({ item, index }) => {
            const _isCurrentEpoch = Number(item.period) === epoch
            return (
              <View row spread centerV paddingV-12>
                <View flex-3>
                  <Text text80 $textNeutral>Epoch {item.period}</Text>
                  <Text text60BO $textNeutralHeavy marginT-8>+{new BigNumber(item.ppdAmount).toFixed(2)} PPD</Text>
                  <Text text80 $textNeutralLight marginT-8>{unit256ToDecimal(item.amount, 2)} PT Invested</Text>

                </View>
                <View flex-1 centerV right>

                  {_isCurrentEpoch && <Text text70R $textNeutral marginR-4>Pending</Text>}

                  {!_isCurrentEpoch && item.isClaimed &&
                    <View row center marginR-4>
                      <LucideCheck size={16} color={Colors._textLime500} strokeWidth={2} />
                      <Text
                        style={{
                          color: Colors._textLime500,
                          fontSize: 16,
                          fontWeight: '500',
                          marginLeft: 4,
                        }}>
                        Claimed
                      </Text>
                    </View>


                  }
                  {!_isCurrentEpoch && !item.isClaimed &&
                    <Button
                      label={'Claim'}
                      outline
                      color={Colors.$textPrimary}
                      outlineColor={Colors.$outlineDefault}
                      style={{ minWidth: 80, paddingVertical: 8 }}
                      onPress={() => onClaimClick(item, index)}
                    />}

                </View>

              </View>
            )
          }}
          keyExtractor={(item) => item.period}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 64 }}
          ItemSeparatorComponent={() => (
            <View style={styles.itemSeparator} />
          )}
        />

      </View>
      }

      {showEpoch && !loading &&
        <View>

          <View padding-16>
            <ImageBackground source={require('@assets/rank_bg.png')} borderRadius={16}
                             style={{ width: '100%', height: 117 }}>
              <View margin-16 row spread>
                <View flex-1 center marginV-16>
                  <Text white text60>{unit256ToDecimal(epochGlobal?.totalInvested!, 0)} PT</Text>
                  <Text $textNeutral text90 marginT-12>Total Investment</Text>
                </View>

                <View flex-1 center marginV-16>
                  <Text white text60>{calculateTotalPPD(startTime, epoch, totalPPDInEpoch)} PPD</Text>
                  <Text $textNeutral text90 marginT-12>Total Generated</Text>
                </View>
              </View>
            </ImageBackground>
          </View>
          <FlatList
            data={epochList}
            horizontal={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
            renderItem={({ item, index }) => (
              <View row centerV paddingV-7>
                <Text flex-2 center style={styles.item}>No. {item.period}</Text>
                <Text flex-2 style={styles.item} center>{item.totalUniqueInvestors}</Text>
                <Text flex-2 style={styles.item}>{unit256ToDecimal(item.totalInvested, 2)}</Text>
                <Text flex-2
                      style={styles.item}
                      center>{new BigNumber(unit256ToDecimal(item.totalInvested)).div(new BigNumber(calculatePPD(Number(item.period), startTime, epoch, totalPPDInEpoch))).toFixed(2)}</Text>
              </View>
            )}
            keyExtractor={item => item.period}
            ListHeaderComponent={
              () => (
                <View row paddingV-7>
                  <Text flex-2 text90R $textNeutralLight center>Epoch</Text>
                  <Text flex-2 text90R $textNeutralLight center>Address</Text>
                  <Text flex-2 text90R $textNeutralLight center>PT</Text>
                  <Text flex-3 text90R $textNeutralLight center>PT/PPD</Text>
                </View>
              )
            }

          />
        </View>
      }

      {loading &&
        <View flex center>
          <LoaderScreen loaderColor={Colors.grey40} message='Loading...' overlay />
        </View>
      }

      <StatusBar style={'dark'} />
    </View>
  )
}

const styles = StyleSheet.create({
  itemSeparator: {
    width: '100%',
    height: 0.8,
    backgroundColor: Colors.$200,
  },
  item: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    color: Colors.$textPrimary,
  }
})

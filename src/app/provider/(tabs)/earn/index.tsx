import React, { useEffect, useRef, useState } from 'react'
import { ImageBackground, ScrollView, StyleSheet } from 'react-native'
import { Button, Colors, Dialog, Text, TextField, View } from 'react-native-ui-lib'
import { BorderRadiusesLiterals } from 'react-native-ui-lib/src/style/borderRadiuses'
import { useHeaderHeight } from '@react-navigation/elements'
import CountdownClock from '@component/countdown_clock'
import { router } from 'expo-router'
import { useAuthStore, useMintStore } from '@store/auth.store'
import {
  CONTRACT_ADDRESS_MINT_PPD,
  getPTTokenBalance,
  readContractWithMintPPD,
  readContractWithPT,
  writeContractWithMintPPD,
  writeContractWithPT
} from '@util/contractHelper'
import * as particleAuth from '@particle-network/rn-auth'
import { CommonError } from '@particle-network/rn-connect'
import { Max_Value } from '@util/utils'
import * as Progress from 'react-native-progress'
import BigNumber from 'bignumber.js'
import Toast from 'react-native-toast-message'
import { unit256ToDecimal } from '@util/ppdUtils'

export default function EarnScreen() {
  const headerHeight = useHeaderHeight()
  const [isDialogVisible, setDialogVisible] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [generatedToken, setGeneratedToken] = useState('0.0')
  const [ptBalance, setPtBalance] = useState('0')
  const [yourComp, setYourComp] = useState<number>(0.0)

  const [isLoading, setLoading] = useState(false)

  const [inputWithInvest, setInputWithInvest] = useState('')
  const secondRef = useRef(1.0)
  const inputValueRef = useRef<string>('0')
  const ptBalanceValueRef = useRef<number>(0)
  const user = useAuthStore((state) => state.user)

  const {
    epoch,
    setEpoch,
    totalInvestedInEpoch,
    setTotalInvestedInEpoch,
    totalPPDInEpoch,
    setTotalPPDInEpoch,
    startTime
  } = useMintStore()


  const fetchInitData = async () => {
    const currentEpoch = await readContractWithMintPPD('getCurrentPeriod', [])
    setEpoch(currentEpoch)

    const _totalPPDInEpoch = await readContractWithMintPPD('periodAllocation', [])
    setTotalPPDInEpoch(_totalPPDInEpoch)

    const currentPTInvested = await readContractWithMintPPD('totalInvestedInPeriod', [currentEpoch.toString()])
    setTotalInvestedInEpoch(currentPTInvested)

    if (user) {
      const _comp = await readContractWithMintPPD('investments', [currentEpoch.toString(), user?.address])
      const rate = currentPTInvested === 0 ? 0 : new BigNumber(_comp).div(new BigNumber(currentPTInvested)).times(100).toNumber()
      setYourComp(rate)
    }
  }

  const onClickApprove = async () => {
    setLoading(true)
    const fromAccount = user?.address
    if (fromAccount) {
      const methodName = 'approve'
      const params = [CONTRACT_ADDRESS_MINT_PPD, Max_Value] // this is the method params.

      // const transaction = await EvmService.erc20Approve(ptContractAddress, mintPPDContractAddress, '12000000000000000000')
      const transaction = await writeContractWithPT(fromAccount, methodName, params)

      const result = await particleAuth.signAndSendTransaction(transaction)
      if (result.status) {
        const signature = result.data as string
        checkPTApprove().then()

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

    setLoading(false)

  }

  const onClickInvest = async () => {
    setLoading(true)
    const fromAccount = user?.address
    if (fromAccount && Number(inputValueRef.current) > 0) {
      const methodName = 'investPT'
      const params = [String(epoch), new BigNumber(inputValueRef.current).times(1e18).toFixed(0)]

      const transaction = await writeContractWithMintPPD(fromAccount, methodName, params)

      const result = await particleAuth.signAndSendTransaction(transaction)
      if (result.status) {
        const signature = result.data as string
        console.log(signature)
        setInputWithInvest('')

        setDialogVisible(false)

        checkPTBalance(true).then()
        checkPTApprove().then()

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
    setLoading(false)
  }

  const checkPTApprove = async () => {
    const fromAccount = user?.address

    if (fromAccount) {
      const result = await readContractWithPT('allowance', [fromAccount, CONTRACT_ADDRESS_MINT_PPD])
      setIsApproved(result >= ptBalanceValueRef.current * 1e18)
    }
  }

  const checkPTBalance = async (enableDelay: boolean = false) => {
    const fromAccount = user?.address
    if (fromAccount) {
      if (enableDelay) {
        setTimeout(async () => {
          const result = await getPTTokenBalance(fromAccount)
          ptBalanceValueRef.current = result
          setPtBalance(result.toFixed(2))
        }, 20000)
      } else {
        const result = await getPTTokenBalance(fromAccount)
        ptBalanceValueRef.current = result
        setPtBalance(result.toFixed(2))
      }
    }
  }

  const initInvestDialog = () => {
    checkPTBalance().then()
    checkPTApprove().then()
    setDialogVisible(true)
  }

  const setInvestAmount = (text: string) => {
    setInputWithInvest(text)
    inputValueRef.current = text
  }

  useEffect(() => {
    fetchInitData().then()
    checkPTBalance().then()
    checkPTApprove().then()

    //loop pt
    const fetchData = async () => {
      const currentPTInvested = await readContractWithMintPPD('totalInvestedInPeriod', [epoch.toString()])
      setTotalInvestedInEpoch(currentPTInvested)

      if (user) {
        const _comp = await readContractWithMintPPD('investments', [epoch.toString(), user?.address])
        const rate = currentPTInvested === 0 ? 0 : new BigNumber(_comp).div(new BigNumber(currentPTInvested)).times(100).toNumber()
        setYourComp(rate)
      }
    }

    const fetchDataInterval = setInterval(() => {
      fetchData().then()
    }, 10000)

    return () => {
      clearInterval(fetchDataInterval)
    }

  }, [])

  let intervalRef: NodeJS.Timeout
  useEffect(() => {

    const now = new Date()
    const targetTime = startTime * 1000 + epoch * 12 * 60 * 60 * 1000
    secondRef.current = targetTime - now.getTime()

    if (secondRef.current < 0) {
      console.log('time out', secondRef.current, epoch)
      setGeneratedToken('0.00')
      return
    }

    let _isEpochEnd = false
    intervalRef = setInterval(() => {
      //countdown
      secondRef.current = secondRef.current - 50
      if (secondRef.current >= 0) {
        const ppdGenerated = totalPPDInEpoch / 1e18 * (1 - (secondRef.current / 1000 / (12 * 60 * 60)))
        setGeneratedToken(ppdGenerated.toFixed(4))
      }
      //when timer end, fetch data
      if (secondRef.current <= 0 && !_isEpochEnd) {
        _isEpochEnd = true
        fetchInitData().then()
      }

    }, 50)

    return () => {
      if (intervalRef) {
        clearInterval(intervalRef)
      }
    }

  }, [totalPPDInEpoch, epoch])


  return (
    <ImageBackground source={require('@assets/bg3x.png')}
                     style={{ width: '100%', height: '100%' }}
                     resizeMode={'stretch'}>

      <View paddingH-4 flex-1 style={{ marginTop: headerHeight }}>
        <ScrollView showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior='always'>
          <View row marginT-4>
            <View flex-1 centerH paddingV-12>
              <Text marginB-4 text90M $textNeutral>Current Epoch</Text>
              <Text text60M white>{epoch}</Text>
            </View>
            <View bg-$outlinePrimary style={styles.divider} />
            <View flex-1 centerH paddingV-12>
              <Text marginB-4 text90M $textNeutral>My Comp. at last hour</Text>
              <Text text60M
                    white>{yourComp.toFixed(2)} %</Text>
            </View>
          </View>
          <View row spread>
            <View flex-1 bg-$outlinePrimary style={styles.dividerH} />
            <View flex-1 bg-$outlinePrimary style={styles.dividerH} />
          </View>
          <View row>
            <View flex-1 centerH paddingV-12>
              <Text marginB-4 text90M $textNeutral>Current Invest</Text>
              <Text text60M white>{unit256ToDecimal(totalInvestedInEpoch, 0)} PT</Text>
            </View>

            <View bg-$outlinePrimary style={styles.divider} />
            <View flex-1 centerH paddingV-12>
              <Text marginB-4 text90M $textNeutral>Ratio from last Epoch</Text>
              <Text text60M
                    white>{totalPPDInEpoch === 0 ? 0 : (totalInvestedInEpoch / totalPPDInEpoch).toFixed(2)} PT/PPD</Text>
            </View>
          </View>

          <ImageBackground source={require('@assets/hexagon.png')}
                           style={{
                             height: 333,
                             marginTop: 14,
                             marginHorizontal: 28
                           }}
                           resizeMode='cover'>

            <View padding-24 centerH>
              <View marginT-48 style={styles.numberBoard}>
                <Text text90R black>No {epoch}</Text>
              </View>

              <Text text90R marginT-12 marginB-4>Countdown</Text>

              <CountdownClock startTime={startTime} epoch={epoch} style={styles.value} />

              <Text text90R marginT-24>This epoch generated</Text>
              <Text text50M marginT-4 style={{ fontVariant: ['tabular-nums'] }}>{generatedToken} PPD</Text>
            </View>

          </ImageBackground>

          <View centerH>
            <Button label={'Invest'}
                    onPress={initInvestDialog} marginT-12
                    outlineColor={Colors.black}
                    borderRadius={100}
                    backgroundColor={isDialogVisible ? Colors._textLime : Colors.accent}
                    color={Colors.black}
                    enableShadow
                    style={{
                      width: '80%',
                      shadowColor: '#D8FF00',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.4,
                      shadowRadius: 0,
                    }} />
          </View>


          <Text margin-18 $textNeutral>
            The $PT you invest will become a share, thereby obtaining the corresponding $PPD. The share will change with
            the pool.
          </Text>

          <Button label={'Invest History'} link color={Colors.accent} style={{ marginBottom: 32 }}
                  onPress={() => router.push('/provider/invest_history')} />

          <Dialog
            visible={isDialogVisible}
            onDismiss={() => setDialogVisible(false)}
            overlayBackgroundColor={Colors.rgba(Colors.black, 0.6)}
            containerStyle={styles.dialog}>
            <ImageBackground source={require('@assets/dialog_invest.png')}
                             style={{ width: '100%', height: 312 }}
                             resizeMode='contain'>

              <View padding-24>
                <View centerH marginB-24>
                  <Text white text70M>Invest</Text>
                </View>
                <View style={styles.inputBoard}>
                  <Text text90L $textNeutral>You invest</Text>
                  <TextField
                    placeholder='0'
                    value={inputWithInvest}
                    placeholderTextColor={Colors.$700}
                    text50BO white
                    onChangeText={(text) => setInvestAmount(text)}
                    validate={['required', 'number']}
                    validationMessage={['This field is required', 'This field must be a number']}
                    keyboardType='numeric'
                    fieldStyle={styles.input}
                    maxLength={10}
                    trailingAccessory={
                      <Text text50 $textNeutralLight>
                        PT
                      </Text>
                    }
                  />

                </View>
                <View marginT-2>
                  <Text $textNeutralLight text90M style={{ textAlign: 'right' }}>
                    Balance: {ptBalance}
                  </Text>
                </View>

                {/*<View centerH paddingV-12>*/}
                {/*  <Text text80M $textNeutral>You max receive</Text>*/}
                {/*  <View row bottom>*/}
                {/*    <Text text50 white>2,323.09</Text>*/}
                {/*    <Text text80M white> PDD</Text>*/}
                {/*  </View>*/}
                {/*</View>*/}

                <Button label={isApproved ? 'Invest' : 'Approve'}
                        marginT-42
                        size={Button.sizes.large} color='black'
                        onPress={isApproved ? onClickInvest : onClickApprove}
                        iconSource={(iconStyle) => isLoading ?
                          <Progress.Circle size={20} color={Colors.grey40} indeterminate={true}
                                           style={{ marginRight: 8 }} /> : <></>
                        }
                        disabled={isLoading}
                        borderRadius={BorderRadiusesLiterals.br20} backgroundColor={Colors.accent} />
              </View>
            </ImageBackground>
          </Dialog>

        </ScrollView>


      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  inputBoard: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#171717',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderStyle: 'solid',
    gap: 4,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#171717',
  }
  ,
  divider: {
    width: 1,
    height: 'auto',
    // backgroundColor: Colors.$outlinePrimary,
    marginVertical: 12
  },
  dividerH: {
    width: 'auto',
    height: 1,
    // backgroundColor: Colors.$outlinePrimary,
    marginHorizontal: 12
  },
  label: {
    color: '#737373',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  value: {
    color: Colors.$900,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
  },
  numberBoard: {
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#365314',
    borderStyle: 'solid',
  },
  dialog: {}


})

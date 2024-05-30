import React, { useEffect, useState } from 'react'
import { FlatList, ImageBackground, Pressable, ScrollView, StyleSheet } from 'react-native'
import { Button, Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { useHeaderHeight } from '@react-navigation/elements'
import { CopyIcon, UserIcon } from 'lucide-react-native'
import * as particleAuth from '@particle-network/rn-auth'
import { EvmService, WalletDisplay } from '@particle-network/rn-auth'
import { shortenAddress } from '@util/utils'
import * as particleWallet from '@particle-network/rn-wallet'
import * as particleConnect from '@particle-network/rn-connect'
import { AccountInfo, CommonError, WalletType } from '@particle-network/rn-connect'
import { ChainInfo, EthereumSepolia } from '@particle-network/chains'
import PTIcon from '@component/svg/pt'
import * as Clipboard from 'expo-clipboard'
import { Token, useAuthStore, useWalletStore } from '@store/auth.store'
import { LinearGradient } from 'expo-linear-gradient'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import { CONTRACT_ADDRESS_PPD, CONTRACT_ADDRESS_PT, CONTRACT_ADDRESS_USDT } from '@util/contractHelper'
import themeColors from '@util/themeColors'
import IconWalletBuy from '@component/svg/wallet_buy'
import IconWalletSend from '@component/svg/wallet_send'
import IconWalletReceive from '@component/svg/wallet_receive'
import { router, Stack } from 'expo-router'
import Toast from 'react-native-toast-message'
import { BuyCryptoConfig, OpenBuyNetwork } from '@particle-network/rn-wallet'


export default function MeScreen() {

  const headerHeight = useHeaderHeight()

  const [tokenData, setTokenData] = useState({
    nativeToken: 0,
    nativeAddress: '',
    ppdToken: 0,
    ppdAddress: '',
    ptToken: 0,
    ptAddress: '',
    usdtToken: 0,
    usdtAddress: ''
  })

  const [showData, setIsShowData] = useState(false)
  const [chainInfoTxt, setChainInfoTxt] = useState<ChainInfo>()

  const user = useAuthStore((state) => state.user)
  const { tokenList, refreshTokenList, clearTokenList } = useWalletStore()

  const coinIcons: { [key: string]: React.JSX.Element } = {
    'USDT': <Icon source={require('@assets/icon_usdt.png')} size={32} />,
    'PPD': <Icon source={require('@assets/icon_ppd.png')} size={32} />,
    'PT': <PTIcon height={32} width={32} />,
    default: <Icon source={require('@assets/icon_eth.png')} size={32} />
  }

  useEffect(() => {

    let ignore = false

    //obtain token list from blockchain
    const interval = setInterval(() => {
      if (user) {
        EvmService.getTokenByTokenAddress(user.address, ['native', CONTRACT_ADDRESS_PPD, CONTRACT_ADDRESS_PT, CONTRACT_ADDRESS_USDT]).then(
          (tokens: any) => {
            if (!ignore) {
              refreshTokenList(tokens)
              setIsShowData(true)
            }
          }
        )
      }
    }, 10000)


    particleConnect.connect(WalletType.Particle).then((result) => {
      if (result.status) {
        const accountInfo = result.data as AccountInfo

        initWalletSetting(accountInfo.publicAddress)
          .then(r => console.log('success init wallet'))

      } else {
        const error = result.data as CommonError
        console.log(error)
      }
    })

    particleAuth.getChainInfo().then((info) => {
      console.log('debug', info)
      setChainInfoTxt(info)
    })

    return () => {
      ignore = true
      clearInterval(interval)
    }


  }, [])


  useEffect(() => {
    if (tokenList.length > 0) {
      setIsShowData(true)
      setTokenData({
        nativeToken: parseFloat(showTokenBalance(tokenList, 'ETH')),
        nativeAddress: showTokenAddress(tokenList, 'ETH'),
        ppdToken: parseFloat(showTokenBalance(tokenList, 'PPD')),
        ppdAddress: showTokenAddress(tokenList, 'PPD'),
        ptToken: parseFloat(showTokenBalance(tokenList, 'PT')),
        ptAddress: showTokenAddress(tokenList, 'PT'),
        usdtToken: parseFloat(showTokenBalance(tokenList, 'USDT')),
        usdtAddress: showTokenAddress(tokenList, 'USDT'),
      })
    }
  }, [tokenList])

  // useEffect(() => {
  //   if (preference.getRole() === 'consumer') {
  //     setShowBuy(true)
  //   } else {
  //     setShowBuy(false)
  //   }
  //
  // }, [preference.getRole()])

  const showTokenBalance = (tokens: Token[], symbol: string) => {
    const result = tokens.find(token => token.symbol === symbol)
    if (result) {
      return (Number(result.amount) / (10 ** result.decimals)).toFixed(3)
    }
    return '0'
  }

  const showTokenAddress = (tokens: Token[], symbol: string) => {
    const result = tokens.find(token => token.symbol === symbol)
    if (result) {
      return result.address
    }
    return ''
  }

  const copyToClipboard = async () => {
    console.log('copyToClipboard')
    if (user) {
      await Clipboard.setStringAsync(user.address).then(() => {
        Toast.show({
          type: 'success',
          text1: 'Copied!',
          text2: 'Wallet address has been copied to clipboard',
        })
      })
    }
  }

  async function initWalletSetting(address: string) {
    particleWallet.createSelectedWallet(
      address,
      WalletType.Particle
    )

    particleWallet.setShowLanguageSetting(false)
    particleWallet.setShowTestNetwork(true)
    particleWallet.setSupportChain([EthereumSepolia])

    particleWallet.setPayDisabled(true)
    particleWallet.setSwapDisabled(true)

    particleWallet.setDisplayTokenAddresses(['native', CONTRACT_ADDRESS_PPD, CONTRACT_ADDRESS_PT, CONTRACT_ADDRESS_USDT])
    particleWallet.setPriorityTokenAddresses(['native', CONTRACT_ADDRESS_PPD, CONTRACT_ADDRESS_PT, CONTRACT_ADDRESS_USDT])
  }

  function getDefaultSkeletonProps() {
    return {
      shimmerColors: [Colors.$backgroundNeutral, Colors.$backgroundNeutralMedium, Colors.$backgroundNeutral],
      // style: [{borderRadius}, style],
      // width: size || width,
      // height: size || height,
      // shimmerStyle
    }
  }

  return (
    <View>
      <Stack.Screen options={{
        headerLeft: () => (
          <View row backgroundColor={Colors.rgba(40, 40, 40, 0.8)} br60 padding-4 centerV>
            <Icon source={{ uri: chainInfoTxt?.icon }} size={20} />
            <Text white text500 marginL-4>{chainInfoTxt?.fullname}</Text>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity padding-8 onPress={() =>
            router.push('/setting')
          }>
            <UserIcon size={24} color={Colors.white} />
          </TouchableOpacity>
        ),
      }}

      />
      <ImageBackground source={require('@assets/bg3x.png')} style={{ width: '100%', height: '100%' }}
                       resizeMode={'stretch'}>
        <View flex marginH-4 bg-bgColor
              style={{ marginTop: headerHeight, borderTopEndRadius: 24, borderTopStartRadius: 24, paddingTop: 30 }}>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View centerH>
              <ShimmerPlaceholder
                {...getDefaultSkeletonProps()}
                LinearGradient={LinearGradient}
                height={32}
                width={150}
                style={{ marginTop: 14 }}
                visible={showData}>
                <Text text40BO style={{ fontStyle: 'italic' }}>{tokenData.ppdToken} PPD</Text>
              </ShimmerPlaceholder>
              <Button label={shortenAddress(user?.address!)}
                      size={Button.sizes.medium}
                      backgroundColor={Colors.white}
                      outlineColor={Colors.$outlinePrimary}
                      marginT-12
                      $textNeutral
                      iconOnRight
                      iconSource={() => (<CopyIcon size={12} color={Colors.$textNeutral} style={{ marginLeft: 8 }} />)}
                      outlineWidth={1}
                      onPress={copyToClipboard}
              />

              <View row spread marginV-24 style={{ width: '70%' }}>

                <Pressable onPress={() => {
                  const config = new BuyCryptoConfig(user?.address, 'USDT', 'USD', 10, OpenBuyNetwork.Ethereum)
                  particleWallet.navigatorBuyCrypto(config)
                  // particleWallet.navigatorWallet(WalletDisplay.Token)
                }}>
                  <View centerH>
                    <IconWalletBuy width={40} height={40} color={themeColors.colors.zinc.$700} />
                    <Text marginT-8 $textNeutralHeavy text500>Buy</Text>
                  </View>
                </Pressable>

                <Pressable onPress={() => {
                  particleWallet.navigatorTokenSend(CONTRACT_ADDRESS_PPD, '', '0')
                }}>
                  <View centerH>
                    <IconWalletSend width={40} height={40} color={themeColors.colors.zinc.$700} />
                    <Text marginT-8 $textNeutralHeavy text500>Send</Text>
                  </View>
                </Pressable>

                <Pressable onPress={() => {
                  particleWallet.navigatorTokenReceive(CONTRACT_ADDRESS_PPD)
                }}>
                  <View centerH>
                    <IconWalletReceive width={40} height={40} color={themeColors.colors.zinc.$700} />
                    <Text text500 marginT-8 $textNeutralHeavy>Receive</Text>
                  </View>
                </Pressable>


              </View>
            </View>


            <FlatList
              data={[
                { coin: 'ETH', balance: tokenData.nativeToken, address: tokenData.nativeAddress },
                { coin: 'PPD', balance: tokenData.ppdToken, address: tokenData.ppdAddress },
                { coin: 'PT', balance: tokenData.ptToken, address: tokenData.ptAddress },
                { coin: 'USDT', balance: tokenData.usdtToken, address: tokenData.usdtAddress }]}

              style={{
                borderRadius: 12,
                backgroundColor: Colors.white,
                marginHorizontal: 12,
                marginBottom: 12
              }}
              keyExtractor={item => item.coin}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const selectedIcon = coinIcons[item.coin] || coinIcons.default

                return (
                  <Pressable onPress={() => {
                    console.log(item.coin, ':', item.address)
                    particleWallet.navigatorTokenTransactionRecords(item.address)
                  }}>
                    <View row marginV-24 marginH-16 centerV>
                      {selectedIcon}
                      <Text flex-1 marginL-6 text65>{item.coin}</Text>
                      <ShimmerPlaceholder
                        {...getDefaultSkeletonProps()}
                        LinearGradient={LinearGradient}
                        height={20}
                        width={50}
                        visible={showData}>
                        <Text text65>{item.balance}</Text>
                      </ShimmerPlaceholder>
                    </View>
                  </Pressable>
                )
              }}
              ItemSeparatorComponent={() => (
                <View style={styles.itemSeparator} />
              )}
            />

            {/*<View br30 bg-white margin-12>*/}
            {/*  <Text text60 margin-16>Mint</Text>*/}
            {/*  <Pressable onPress={() => {*/}
            {/*    router.push('/me/my_pt')*/}
            {/*  }}>*/}
            {/*    <View row marginV-24 marginH-16 centerV>*/}
            {/*      <Text flex-1>Charge Mint</Text>*/}
            {/*      <PTIcon width={32} height={32} />*/}
            {/*      <Text text65 marginH-6>342.00</Text>*/}
            {/*      <Text text65R>PT</Text>*/}
            {/*    </View>*/}
            {/*  </Pressable>*/}

            {/*</View>*/}
          </ScrollView>

        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  itemSeparator: {
    borderBottomWidth: 0.8,
    borderColor: Colors.$outlineDefault,
  },
})

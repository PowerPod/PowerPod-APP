import * as particleAuth from '@particle-network/rn-auth'
import * as particleConnect from '@particle-network/rn-connect'
import * as particleWallet from '@particle-network/rn-wallet'
import { Env, ParticleInfo } from '@particle-network/rn-auth'
import { OptimismGoerli } from '@particle-network/chains'
import { DappMetaData } from '@particle-network/rn-connect'

export const initParticleAuth = () => {

  ParticleInfo.projectId = '' // your project id
  ParticleInfo.clientKey = '' // your client key

  const chainInfo = OptimismGoerli
  const env = Env.Dev

  // init particle auth
  particleAuth.init(chainInfo, env)

  //init connect
  const dappMetaData = new DappMetaData('',
    'Particle Connect',
    'https://connect.particle.network/icons/512.png',
    'https://connect.particle.network',
    'Particle Wallet', '', '')

  particleConnect.init(chainInfo, env, dappMetaData)

  //init wallet
  const walletMetaData = {
    walletConnectProjectId: '',
    name: 'Particle Connect',
    icon: 'https://connect.particle.network/icons/512.png',
    url: 'https://connect.particle.network',
    description: 'Particle Wallet',
  }
  particleWallet.initWallet(walletMetaData)


}

export const isParticleLogin = async () => {
  return await particleAuth.isLogin()
}

export const getUserInfo = async () => {
  const result = await particleAuth.getUserInfo()
  return JSON.parse(result)
}

export const loginOut = async () => {
  const result = await particleAuth.fastLogout()
  if (result.status) {
    console.log(result.data)
  } else {
    const error = result.data
    console.log(error)
  }
}

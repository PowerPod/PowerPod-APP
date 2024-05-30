import * as Device from 'expo-device'


export const deviceBrand = Device.brand
export const deviceModel = Device.modelName
export const deviceOS = Device.osName
export const deviceOSVersion = Device.osVersion
export const deviceType = Device.deviceType
export const deviceIsDevice = Device.isDevice

export const deviceInfo = {
  deviceBrand,
  deviceModel,
  deviceOS,
  deviceOSVersion,
  deviceType,
  deviceIsDevice,
}

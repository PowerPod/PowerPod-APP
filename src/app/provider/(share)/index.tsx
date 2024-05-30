import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import {
  BorderRadiuses,
  Button,
  ButtonSize,
  Colors,
  DateTimePicker, Dividers, Icon,
  Keyboard,
  Picker,
  Switch,
  Text,
  TextField, TouchableOpacity,
  View
} from 'react-native-ui-lib'
import { LocateFixedIcon, LucidePlus } from 'lucide-react-native'
import * as Location from 'expo-location'
import { LocationObject } from 'expo-location'
import { pickPlace } from 'react-native-place-picker'
import { LatLng } from 'react-native-maps/lib/sharedTypes'
import APIService from '@util/api/api_driver_service'
import { convertToBusinessTime } from '@util/utils'
import * as Progress from 'react-native-progress'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'
import ImageGridView from '@component/image_gridview'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { StatusBar } from 'expo-status-bar'


const { KeyboardAwareInsetsView } = Keyboard


export default function ShareDeviceScreen() {

  const router = useRouter()
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>()

  const [location, setLocation] = useState<LocationObject>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isExistDeviceInfo, setIsExistDeviceInfo] = useState(false)

  const [address, setAddress] = useState('')
  const [locationName, setLocationName] = useState('')
  const [plugType, setPlugType] = useState('')
  const [geo, setGeo] = useState<LatLng>()
  const [deviceName, setDeviceName] = useState('')
  const [powerMax, setPowerMax] = useState('')
  const [businessHoursStart, setBusinessHoursStart] = useState<string>()
  const [businessHoursEnd, setBusinessHoursEnd] = useState<string>()
  const [phone, setPhone] = useState('')
  const [price, setPrice] = useState('')
  const [isSharingEnabled, setIsSharingEnabled] = useState(false)


  //ui status
  const [isUploading, setIsUploading] = useState(false)

  //image size
  const MAX_FILE_SIZE_MB = 2
  const MAX_IMAGE_WIDTH = 1920
  const MAX_IMAGE_HEIGHT = 1080

  const options = [
    { label: 'J1772(Type1)', value: 'J-1772' },
    { label: 'Mennekes(Type2)', value: 'Mennekes' },
    { label: 'NACS(Tesla)', value: 'Tesla' }
  ]

  //handle images
  const [images, setImages] = useState<string[]>([])
  const [imagesLocal, setImagesLocal] = useState<string[]>([])

  const handleAddImage = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync()

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    })


    if (!result.canceled) {

      setImagesLocal([...imagesLocal, result.assets[0].uri])
      setIsUploading(true)

      let shouldCompress = false
      let compressedImage

      const _file = result.assets[0]
      const { width, height, fileSize } = _file

      if ((fileSize || 0) > MAX_FILE_SIZE_MB * 1024 * 1024 || width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
        shouldCompress = true
      }

      if (shouldCompress) {
        //compress image
        compressedImage = await ImageManipulator.manipulateAsync(_file.uri, [
            { resize: { width: width / 2, height: height / 2 } }
          ],
          {
            compress: 0.7,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true
          })
      }

      //upload image to server
      const uploadResult = await APIService.uploadFile(_file.fileName, compressedImage ? compressedImage.base64 : _file.base64)

      if (uploadResult && uploadResult.code === '0') {

        setImages([...images, uploadResult.data.url])
      } else {
        console.log('Failed to upload image')
        setImagesLocal(imagesLocal.slice(0, -1))
      }

      setIsUploading(false)

    }
  }

  const pickLocation = useCallback(() => {

    pickPlace({
      initialCoordinates: {
        latitude: location?.coords.latitude || 0,
        longitude: location?.coords.longitude || 0,
      },
      presentationStyle: 'modal',
      searchPlaceholder: 'Search...',
      title: 'Pick Location',
      color: Colors.$900,
      enableLargeTitle: false,
      enableSearch: true,
      enableGeocoding: true,
      enableUserLocation: true,
    })
      .then((r) => {
        console.log(r)

        setAddress((r.address?.streetName || '') + ',' + (r.address?.city || '') + ',' + (r.address?.state || ''))
        setGeo({ latitude: r.coordinate.latitude, longitude: r.coordinate.longitude })
        setLocationName(r.address?.name || '')

      })
      .catch(console.log)

  }, [])

  const deleteImage = (index: number) => {
    const newImages = images.filter((image, i) => i !== index)
    setImages(newImages)

    const newImagesLocal = imagesLocal.filter((image, i) => i !== index)
    setImagesLocal(newImagesLocal)
  }


  const handleShareDevice = async () => {

    //TODO validation


    setIsSubmitting(true)

    const deviceData = {
      deviceId: deviceId,
      deviceName: deviceName,
      location: locationName,
      lon: geo?.longitude,
      lat: geo?.latitude,
      detailAddress: address,
      plugType: plugType,
      maxPower: powerMax,
      price: price,
      phone: phone,
      isShared: isSharingEnabled,
      startTime: businessHoursStart,
      endTime: businessHoursEnd,
      images: images
    }

    console.log(isExistDeviceInfo)

    const response = isExistDeviceInfo ? await APIService.updateShareDevice(deviceId, deviceData) : await APIService.shareDevice(deviceData)

    if (response && response.code === '0') {
      Toast.show({
        type: 'success',
        text1: 'Submission successful',
        visibilityTime: 2000,
        onHide: () => {
          if (router.canGoBack()) {
            router.back()
          }
        }
      })
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error sharing device',
        visibilityTime: 2000
      })
    }

    setIsSubmitting(false)
  }


  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission to access location was denied'
        })
        return
      }

      let location = await Location.getLastKnownPositionAsync({})
      if (location) {
        setLocation(location)
      }
    })()

    APIService.fetchDeviceDetail(deviceId)
      .then((device) => {
        if (device) {
          console.log('device:', device)

          setIsExistDeviceInfo(true)

          setDeviceName(device.deviceName)
          setPlugType(device.plugType)
          setGeo({ latitude: Number.parseFloat(device.lat), longitude: Number.parseFloat(device.lon) })
          setAddress(device.detailAddress)
          setLocationName(device.location)
          setPowerMax(String(device.maxPower))
          setPrice(String(device.amount))
          setPhone(device.phone)
          setIsSharingEnabled(device.isShared)
          setBusinessHoursStart(device.startTime)
          setBusinessHoursEnd(device.endTime)
          if (device.images) {
            setImages(device.images)
            setImagesLocal(device.images)
          }
        }

      })
      .catch((e) => {
        console.error(e)
      })

  }, [])

  return (
    <ScrollView keyboardShouldPersistTaps='always'>
      <View flex bg-bgColor padding-16>

        <View bg-white br40 padding-16>
          <View row spread>
            <Text $textPrimary text70M marginB-2>Share Mode</Text>
            <Switch value={isSharingEnabled} onValueChange={(status) => setIsSharingEnabled(status)} />
          </View>

        </View>

        <View flex bg-white br40 padding-16 marginT-8>

          <TextField
            placeholder='Device Name'
            defaultValue={deviceName}
            style={styles.inputText}
            maxLength={40}
            onChangeText={value => setDeviceName(value)}
            fieldStyle={styles.withFrame}
          />

          <View style={Dividers.d10} />

          <Picker
            value={plugType}
            fieldStyle={styles.withFrame}
            fieldType={'form'}
            items={options}
            style={styles.inputText}
            placeholder={'Pick Plug Type'}
            onChange={(item) => setPlugType(item?.toString() || '')}>

          </Picker>

          <View style={Dividers.d10} />

          <TextField
            defaultValue={powerMax}
            placeholder='Max Power'
            style={styles.inputText}
            maxLength={4}
            onChangeText={value => setPowerMax(value)}
            fieldStyle={styles.withFrame}
            validate={['required', 'number', (value: string | any[]) => value.length > 0]}
            keyboardType='numeric'
            trailingAccessory={
              <Text text70 $textNeutral>
                kW
              </Text>
            }
          />

        </View>

        <View flex bg-white br40 padding-16 marginT-8>

          {!address &&
            <TouchableOpacity onPress={() => pickLocation()}>
              <View flex row centerV>
                <Icon source={require('assets/ic_location.png')} size={28} marginR-12 />
                <Text style={[styles.withFrame, styles.inputText]} color={'#93B800'}>Pick Location</Text>
              </View>
            </TouchableOpacity>
          }

          {address &&
            <TextField
              onChangeText={value => setAddress(value)}
              defaultValue={address}
              fieldStyle={styles.address}
              style={styles.inputText}
              maxLength={60}
              leadingAccessory={
                <Icon source={require('assets/ic_location.png')} size={28} marginR-12 />
              }
              trailingAccessory={
                <TouchableOpacity onPress={() => pickLocation()} paddingV-8 paddingL-8>
                  <LocateFixedIcon size={16} color={Colors.$iconNeutral} />
                </TouchableOpacity>
              }
            />}
          <View style={[Dividers.d10, { marginLeft: 40 }]} />


          <TextField
            onChangeText={value => setPrice(value)}
            keyboardType='numeric'
            placeholder='Price'
            maxLength={6}
            leadingAccessory={
              <Icon source={require('assets/ic_price.png')} size={28} marginR-12 />
            }
            style={styles.inputText}
            defaultValue={price}
            validate={['required', 'price', (value: string | any[]) => Number(value) < 10]}
            fieldStyle={styles.withFrame}
            trailingAccessory={
              <Text text70 $textNeutral>
                usd/h
              </Text>
            }
          />

          <View style={[Dividers.d10, { marginLeft: 40 }]} />

          <TextField
            onChangeText={value => setPhone(value)}
            placeholder='Phone Number'
            style={styles.inputText}
            maxLength={20}
            validate={['number']}
            keyboardType='numeric'
            defaultValue={phone}
            leadingAccessory={
              <Icon source={require('assets/ic_phone.png')} size={28} marginR-12 />
            }
            fieldStyle={styles.withFrame}
          />

          <View style={[Dividers.d10, { marginLeft: 40 }]} />


          <View row style={styles.withFrame} centerV>

            <Icon source={require('assets/ic_price.png')} size={28} marginR-12 />

            <DateTimePicker
              editable
              mode={'time'}
              placeholder={'Start Time'}
              style={styles.inputText}
              is24Hour
              defaultValue={businessHoursStart}
              dateTimeFormatter={(date, mode) => {
                return convertToBusinessTime(date)
              }}
              onChange={(time) => setBusinessHoursStart(convertToBusinessTime(time))}
            />

            <Text text70 marginH-24>to</Text>

            <DateTimePicker
              editable
              mode={'time'}
              placeholder={'End Time'}
              style={styles.inputText}
              is24Hour
              defaultValue={businessHoursEnd}
              dateTimeFormatter={(date, mode) => {
                return convertToBusinessTime(date)
              }}
              onChange={(time) => setBusinessHoursEnd(convertToBusinessTime(time))}
            />

          </View>


        </View>

        <View bg-white br40 padding-16 marginT-8>
          <Text $textPrimary text80M marginB-2>Photo</Text>
          <ImageGridView
            images={imagesLocal}
            onAddImage={handleAddImage}
            deleteImage={deleteImage}
            isUploading={isUploading}
          />
        </View>


        <Button marginT-24 label='Save' onPress={handleShareDevice}
                iconSource={(iconStyle) => isSubmitting ?
                  <Progress.Circle size={20} color={Colors.grey40} indeterminate={true}
                                   style={{ marginRight: 8 }} /> : <></>
                }
                disabled={isSubmitting}
        />

      </View>
      <KeyboardAwareInsetsView />
      <StatusBar style={'dark'} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  withFrame: {
    borderWidth: 0,
    paddingVertical: 10,
    height: 48,
  },
  address: {
    borderWidth: 0,
    paddingVertical: 10,
    height: 48,
  },
  inputText: {
    fontSize: 16,
    fontWeight: '500'
  }
})

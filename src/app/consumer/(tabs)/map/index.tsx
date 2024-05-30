import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import MapView, { Marker, Region } from 'react-native-maps'
import * as Location from 'expo-location'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Button, ButtonSize, Colors, View } from 'react-native-ui-lib'
import { StatusBar } from 'expo-status-bar'
import ChargeStationDetail from '@component/station-detail'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import APIService from '@util/api/api_driver_service'
import { Device } from '@util/types/api_entity'
import Toast from 'react-native-toast-message'
import { mapStyle } from '@util/map_style_json'

export default function MapScreen() {

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Device>()

  //google mapview ref
  const mapViewRef = useRef<MapView>(null)

  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  })

  const [initRegion, setInitRegion] = useState<Region>()


  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  function handleMarkerPress(billboard: any) {

    setSelectedDevice(billboard)

    bottomSheetRef.current?.close() // Close the BottomSheet first

    setTimeout(() => {
      bottomSheetRef.current?.collapse() // Collapse the BottomSheet after a delay
    }, 350)
  }

  //mapview region changed
  async function fetchDevicesAndUpdateMap(region: Region) {
    const { latitude, latitudeDelta, longitude, longitudeDelta } = region
    const data = await APIService.fetchDevicesByCondition({
      lon: String(longitude),
      lonDelta: String(longitudeDelta),
      lat: String(latitude),
      latDelta: String(latitudeDelta)
    })
    if (data && data.data.devices) {
      setDevices(data.data.devices)
    }
  }

  useEffect(() => {
    async function requestLocation() {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync()

      if (foregroundStatus === 'granted') {
        const getLoc = (await Location.getCurrentPositionAsync()) as any
        console.log('location:', getLoc.coords.latitude, getLoc.coords.longitude)
        setLocation({
          latitude: getLoc.coords.latitude,
          longitude: getLoc.coords.longitude,
        })

        setInitRegion({
          latitude: getLoc.coords.latitude,
          longitude: getLoc.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        })
      } else {
        Toast.show({
          type: 'info',
          text1: 'Permission to access location was denied',
        })
      }
    }

    requestLocation().then()
  }, [])

  useEffect(() => {
    setDevices([{
      'deviceId': '001',
      'deviceName': 'Device I',
      'price': 1,
      'startTime': '7:00',
      'endTime': '18:00',
      'maxPower': 7,
      'detailAddress': 'japan',
      'distance': '10km',
      'lat': '36.677484',
      'lon': '117.031229',
      'location': '',
      'phone': ''
    }, {
      'deviceId': '002',
      'deviceName': 'Device II',
      'price': 2,
      'startTime': '7:00',
      'endTime': '18:00',
      'maxPower': 7,
      'detailAddress': 'delhi',
      'distance': '15km',
      'lat': '36.661184',
      'lon': '117.051729',
      'location': '',
      'phone': ''
    }])
  }, [])

  // const homePlace = {
  //   description: 'Home',
  //   geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
  // };

  return (
    <View flex>
      <MapView
        ref={mapViewRef}
        region={initRegion}
        onRegionChangeComplete={(region, details) => {
          fetchDevicesAndUpdateMap(region).then()
        }}
        showsUserLocation
        customMapStyle={mapStyle}
        showsMyLocationButton={true}
        style={{ flex: 1 }}>
        {devices.map((device, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: Number.parseFloat(device.lat),
              longitude: Number.parseFloat(device.lon),
            }}
            onPress={(event) => handleMarkerPress(device)}
            title={device.deviceName || 'PowerPod Pulse I'}
            description={device.detailAddress}
          />
        ))}
      </MapView>
      <View flex row style={styles.searchBar}>
        <GooglePlacesAutocomplete
          placeholder='Search'
          onPress={(data, details = null) => {
            console.log(data, '||', details)

            if (details?.geometry.location === undefined) {
              return
            }
            mapViewRef.current?.animateToRegion({
              latitude: details?.geometry.location.lat,
              longitude: details?.geometry.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }, 1000)
          }}
          enablePoweredByContainer={false}
          nearbyPlacesAPI='GooglePlacesSearch'
          debounce={400}
          renderDescription={(row) => row.description}
          minLength={2}
          fetchDetails
          styles={{
            separator: styles.separator,
          }}
          query={{
            key: 'AIzaSyAP4wGO7RUZeiyvB2xzWz7cm2PfaPZsgyA',
            language: 'en',
          }} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose
        onChange={handleSheetChanges}
        index={-1}
        snapPoints={[240, '50%', '90%']}
      >
        <BottomSheetView style={styles.contentContainer}>
          <ChargeStationDetail showImages deviceId={selectedDevice?.deviceId} />

          <Button label='Start Charging' size={ButtonSize.large} br20
                  style={styles.button}
                  onPress={() => {
                    console.log('charge')
                  }} />

        </BottomSheetView>
      </BottomSheet>

      <StatusBar style='dark' />
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16
  },
  button: {
    position: 'absolute',
    bottom: 48,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center'
  },
  searchBar: {
    position: 'absolute',
    top: 60,
    width: '90%',
    alignSelf: 'center',
  },
  textInput: {
    width: 300,
    height: 32,
    marginLeft: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.$200
  }

})

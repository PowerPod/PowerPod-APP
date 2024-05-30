import React, { useCallback, useMemo, useRef, useState } from 'react'
import { SafeAreaView, StyleSheet, TextInput } from 'react-native'
import * as Location from 'expo-location'
import BottomSheet from '@gorhom/bottom-sheet'
import MapView, { Marker } from 'react-native-maps'
import { Button, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import ImageGridView from '@component/image_gridview'


export default function LocationSelectScreen() {
  const [address, setAddress] = useState<any>('')
  const [text, setText] = React.useState('')

  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  const [location, setLocation] = useState<any>({
    latitude: 0,
    longitude: 0,
    timestamp: 0,
  })

  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1533069027836-fa937181a8ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1560196327-cca0a731441b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
    'https://images.unsplash.com/photo-1636287304505-6b5acba3fd28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80',
  ])


  const requestLocation = async () => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync()

    console.log(foregroundStatus)
    if (foregroundStatus === 'granted') {
      const getLoc: any = await Location.getLastKnownPositionAsync()

      console.log(getLoc)
      setLocation({
        latitude: getLoc.coords.latitude,
        longitude: getLoc.coords.longitude,
        timestamp: getLoc.timestamp,
      })
    }
  }

  const handleAddImage = async () => {
    // await ImagePicker.requestMediaLibraryPermissionsAsync();
    //
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 1,
    // });
    //
    // console.log(result);
    //
    // if (!result.canceled) {
    //   setImages([...images, result.assets[0].uri]);
    // }
  }
  const deleteImage = (index: number) => {
    const newImages = images.filter((image, i) => i !== index)
    setImages(newImages)
  }

  const findLocation = async (address: any) => {
    let locations: any[] = await Location.geocodeAsync(address)

    if (locations[0].accuracy > 50) {
      setLocation({
        latitude: locations[0].latitude,
        longitude: locations[0].longitude,
      })
    }
    console.log(locations)
  }

  const changeLocation = (newLocation: any) => {
    console.log(newLocation)

    //get current timestamp
    const timestamp = new Date().getTime()
    setLocation({
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
      timestamp: timestamp,
    })
  }

  //adding in the ethers expect of calling and interacting with the contract
  const registerBillboardOnChain = async () => {
    setLoading(true)
    setLoading(false)
  }
  const bottomSheetRef = useRef<BottomSheet>(null)

  // variables
  const snapPoints = useMemo(() => ['10%', '60%'], [])

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          draggable
          onDragEnd={(e) => {
            changeLocation(e.nativeEvent.coordinate)
          }}
        />
      </MapView>

      <View style={styles.searchBar}>
        <TouchableOpacity onPress={requestLocation}>
          <Text style={{ fontSize: 20 }}> + </Text>
        </TouchableOpacity>
        <TextInput
          placeholder='Search address..'
          style={styles.searchInput}
          value={address}
          onChangeText={(text) => {
            setAddress(text)
          }}
        />

        <TouchableOpacity
          onPress={() => {
            findLocation(address).then()
          }}
        >
          <Text> → </Text>
        </TouchableOpacity>
      </View>


      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text>Create Billboard</Text>

          <TextInput
            placeholder='Name'
            style={styles.modalInput}
            onChangeText={(text) => setText(text)}
          />
          <TextInput
            placeholder='Description'
            style={styles.modalInput}
            onChangeText={(text) => setText(text)}
          />

          <ImageGridView
            images={images}
            onAddImage={handleAddImage}
            deleteImage={deleteImage}
          />

          <Button
            label={loading ? 'loading...' : 'Register Billboard'}
            onPress={registerBillboardOnChain}
            disabled={loading}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  modalView: {
    width: '80%',
    margin: 20,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  searchInput: {
    width: '80%',
  },
  searchBar: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  container: {
    flex: 1,
  },
})

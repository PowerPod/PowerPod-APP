import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import { GridView, View, Image, Colors } from 'react-native-ui-lib'
import { GridListItemProps } from 'react-native-ui-lib/src/components/gridListItem'
import { LucidePlus } from 'lucide-react-native'
import * as Progress from 'react-native-progress'
import { OverlayIntensityType } from 'react-native-ui-lib/src/components/overlay'


const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height


export default function ImageGridView({ images, onAddImage, deleteImage, isUploading }: {
  images: string[],
  onAddImage: () => void,
  deleteImage: (index: number) => void,
  isUploading: boolean
}) {

  const imagesWithAdd = [...images, ''] // Add one empty value to make an add button

  //images to GridListItemProps
  const imageProps: GridListItemProps[] = imagesWithAdd.map((image, index) => ({
    renderCustomItem: () => {

      const _isLoading = index === imagesWithAdd.length - 2 && isUploading

      if (index === imagesWithAdd.length - 1) {
        return (
          <View flex center marginB-10>
            <TouchableOpacity style={styles.addButton} onPress={onAddImage}>
              <LucidePlus size={24} color={Colors.$outlineDefault} />
            </TouchableOpacity>
          </View>
        )
      } else {
        return (
          <View flex center marginB-10>
            <Image source={{ uri: image }}
                   style={styles.image}
                   borderRadius={8}
                   customOverlayContent={
                     <View center style={styles.image}>
                       {_isLoading ?
                         <Progress.Circle size={24} color={Colors.grey40} indeterminate={true} /> : <></>}
                     </View>
                   }
            />

            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(index)}>
              <Ionicons name='close-outline' size={16} color='white' />
            </TouchableOpacity>

          </View>
        )
      }
    },
    onPress: () => {
      console.log('click')
    },
  }))


  return (
    <GridView
      items={imageProps}
      numColumns={3}
      keepItemSize
    />
  )
};

const styles = StyleSheet.create({

  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.$outlineDefault,
    borderWidth: 1,
    borderRadius: 8,
    width: 110,
    height: 110,
  },
  addButtonText: {
    fontSize: 18,
    color: 'white',
  },
  deleteButton: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.rgba(20, 20, 20, 0.5),
    borderRadius: 100,
  },

  image: {
    width: 110,
    height: 110,
  },
})



import React from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height


export default function ImagesScroll({ images }: { images: string[] }) {

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={styles.container}
                contentContainerStyle={styles.contentContainer}>
      {images.map((image, index) => (
        <View style={styles.imageContainer} key={index}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      ))}
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  image: {
    borderRadius: 8,
    width: 100,
    height: 100,
  },
})



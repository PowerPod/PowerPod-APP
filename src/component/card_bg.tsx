import React from 'react'
import { Canvas, Paint, Line, Path, Skia, useCanvasRef } from '@shopify/react-native-skia'
import { PaintStyle } from '@shopify/react-native-skia/src/skia/types/Paint/Paint'
import { Colors, Fader, View } from 'react-native-ui-lib'
import position = Fader.position
import { Color } from '@shopify/react-native-skia/src/skia/types'

type Props = {
  color: Color;
  style?: any; // Add style prop to the type definition
};


export const CardBackground: React.FC<Props> = ({ color, style }) => {

//   const ref = useCanvasRef()
//
//   const animatedColor1 = useSharedValue('#000000') // 方格1的颜色
//   const animatedColor2 = useSharedValue('#000000') // 方格2的颜色
//
//   const animateStyle1 = useAnimatedStyle(() => {
//     return {
//       backgroundColor: animatedColor1.value
//     }
//   })
//
//   const animateStyle2 = useAnimatedStyle(() => {
//     return {
//       backgroundColor: animatedColor2.value
//     }
//   })
//
//   const generateRandomColor = () => {
//     const letters = '0123456789ABCDEF'
//     let color = '#'
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)]
//     }
//     return color
//   }
//
//
// // 随机变换颜色动画
//   const startColorAnimation = () => {
//     animatedColor1.value = withTiming(generateRandomColor(), { duration: 1000 })
//     animatedColor2.value = withTiming(generateRandomColor(), { duration: 1000 })
//   }
//
//
  const Grid = () => {
    const offsetX = 8
    const offsetY = 4

    const gridSize = 12
    const gridRows = 7

    const cellSize = 30 // 方格大小

    return (
      <>
        {Array.from({ length: gridSize }).map((_, i) => {
          const vector1 = Skia.Point(i * cellSize + offsetX, 0)
          const vector2 = Skia.Point(i * cellSize + offsetX, gridSize * cellSize)

          return (
            <Line
              p1={vector1}
              p2={vector2}
              strokeWidth={0.6}
              color={color}
              opacity={0.5}
              key={i} />
          )
        })}
        {Array.from({ length: gridRows }).map((_, i) => {
          const vector1 = Skia.Point(0, i * cellSize + offsetY)
          const vector2 = Skia.Point(gridSize * cellSize, i * cellSize + offsetY)

          return (
            <Line
              p1={vector1}
              p2={vector2}
              strokeWidth={0.6}
              color={color}
              opacity={0.5}
              key={i} />
          )
        })}

      </>
    )


  }

  return (
    <View flex style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Canvas style={{ flex: 1 }}>
        <Grid />
      </Canvas>
    </View>
  )
}

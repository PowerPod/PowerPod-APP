import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from 'react-native-svg'

const PlugOnlineIcon = (props: SvgProps) => <Svg viewBox='0 0 16 16' width='16'
                                                 height='16' fill='none' {...props}>

  <G id='plug-off' clipPath='url(#clip0_5283_34746)'>
    <Path id='Vector'
          d='M10.7487 10.7278L10.6307 10.8458C10.2737 11.2171 9.8463 11.5135 9.37341 11.7175C8.90052 11.9216 8.39168 12.0293 7.87665 12.0344C7.36163 12.0394 6.85077 11.9417 6.37397 11.747C5.89717 11.5522 5.464 11.2643 5.09981 10.9001C4.73561 10.5359 4.44771 10.1027 4.25295 9.62593C4.05818 9.14913 3.96047 8.63827 3.96552 8.12325C3.97057 7.60823 4.07829 7.09938 4.28237 6.62649C4.48644 6.1536 4.78279 5.72616 5.15405 5.36918L5.26005 5.26318'
          stroke={props.color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    <Path id='Vector_2' d='M2.6665 13.3333L4.99984 11' stroke={props.color} strokeWidth='1.5' strokeLinecap='round'
          strokeLinejoin='round' />
    <Path id='Vector_3' d='M9.99984 2.6665L7.6665 4.99984' stroke={props.color} strokeWidth='1.5' strokeLinecap='round'
          strokeLinejoin='round' />
    <Path id='Vector_4' d='M13.3333 6L11 8.33333' stroke={props.color} strokeWidth='1.5' strokeLinecap='round'
          strokeLinejoin='round' />
    <Path id='Vector_5' d='M2 2L14 14' stroke={props.color} strokeWidth='1.5' strokeLinecap='round'
          strokeLinejoin='round' />
  </G>
  <Defs>
    <ClipPath id='clip0_5283_34746'>
      <Rect width='16' height='16' fill='white' />
    </ClipPath>
  </Defs>
</Svg>
export default PlugOnlineIcon

import * as React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

const PTTabIcon = (props: SvgProps) => <Svg viewBox='0 0 24 24' width='24'
                                            height='24' fill='currentColor' {...props}>
  <G>
    <Path id='Subtract' fillRule='evenodd' clipRule='evenodd'
          d='M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM14.5315 6.23842C16.6045 6.23842 18.2911 7.92504 18.2911 9.99802C18.2911 12.071 16.6045 13.7576 14.5315 13.7576H11.9437L12.6949 11.6269L12.7819 11.3798H14.5312C15.2934 11.3798 15.9133 10.7597 15.9133 9.99769C15.9133 9.23573 15.2934 8.6156 14.5312 8.6156H11.8384L12.4331 6.43339L12.4865 6.23809H14.5315V6.23842ZM10.3156 11.3805H11.2601H11.9947L11.2601 13.4636L9.57479 18.2427H7.6482L8.64165 13.758H7.28564L8.61198 6.23912H11.1995H11.7166L11.1995 8.13734L10.3156 11.3805Z'
    />
  </G>
</Svg>
export default PTTabIcon

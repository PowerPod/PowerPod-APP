import * as React from 'react'
import { SvgProps, SvgXml } from 'react-native-svg'

const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" width="41" height="40" viewBox="0 0 41 40" fill="none">
  <g clip-path="url(#clip0_6235_65441)">
    <path d="M20.3333 33.3334H8.66668C7.78262 33.3334 6.93478 32.9822 6.30965 32.357C5.68453 31.7319 5.33334 30.8841 5.33334 30V10C5.33334 9.11597 5.68453 8.26812 6.30965 7.643C6.93478 7.01788 7.78262 6.66669 8.66668 6.66669H32C32.8841 6.66669 33.7319 7.01788 34.357 7.643C34.9822 8.26812 35.3333 9.11597 35.3333 10V20.8334" stroke="#3F3F46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.3333 28.3333H21.1667" stroke="#3F3F46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M27 31.6667H37" stroke="#3F3F46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32 26.6667V36.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_6235_65441">
      <rect width="40" height="40" fill="white" transform="translate(0.333344)"/>
    </clipPath>
  </defs>
</svg>
`
const IconWalletBuy = (props: SvgProps) => <SvgXml xml={xml} width='100%' height='100%' {...props} />
export default IconWalletBuy

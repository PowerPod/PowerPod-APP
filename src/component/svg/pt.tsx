import * as React from 'react'
import { SvgProps, SvgXml } from 'react-native-svg'

const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="15.25" fill="#FAFAFA"/>
  <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="15.25" stroke="#171717" stroke-width="1.5"/>
  <g filter="url(#filter0_i_6239_65499)">
    <path d="M18.2915 14.8451H17.0339L18.2107 10.5272L18.8992 8H18.2107H14.7659L13 18.0104H14.8054L13.4827 23.9812H16.0477L18.2915 17.6184L19.2695 14.8451H18.2915Z" fill="url(#paint0_linear_6239_65499)"/>
  </g>
  <defs>
    <filter id="filter0_i_6239_65499" x="13" y="8" width="6.26947" height="16.9813" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_6239_65499"/>
    </filter>
    <linearGradient id="paint0_linear_6239_65499" x1="16.1347" y1="8" x2="16.1347" y2="23.9812" gradientUnits="userSpaceOnUse">
      <stop/>
      <stop offset="1"/>
    </linearGradient>
  </defs>
</svg>
`
const PTIcon = (props: SvgProps) => <SvgXml xml={xml} width='100%' height='100%' {...props} />
export default PTIcon

import * as React from 'react'
import { SvgProps, SvgXml } from 'react-native-svg'

const xml = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <rect x="0.5" y="0.5" width="11" height="11" rx="5.5" fill="#FAFAFA"/>
  <g filter="url(#filter0_i_3747_1795)">
    <path d="M6.88876 3.00016C7.92373 3.00016 8.7658 3.84223 8.7658 4.8772C8.7658 5.91216 7.92373 6.75423 6.88876 6.75423H5.59677L5.97182 5.69045L6.01528 5.56706H6.8886C7.26918 5.56706 7.57863 5.25745 7.57863 4.87703C7.57863 4.49661 7.26918 4.187 6.8886 4.187H5.54419L5.8411 3.09751L5.8678 3H6.88876V3.00016Z" fill="url(#paint0_linear_3747_1795)"/>
    <path d="M5.2553 5.5669H4.78372L5.22503 3.94771L5.4832 3H5.22503H3.93319L3.271 6.75391H3.948L3.45201 8.99297H4.41388L5.2553 6.60691L5.62205 5.5669H5.2553Z" fill="url(#paint1_linear_3747_1795)"/>
  </g>
  <rect x="0.5" y="0.5" width="11" height="11" rx="5.5" stroke="#171717"/>
  <defs>
    <filter id="filter0_i_3747_1795" x="3.271" y="3" width="5.49487" height="6.99316" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3747_1795"/>
    </filter>
    <linearGradient id="paint0_linear_3747_1795" x1="7.15499" y1="3" x2="7.15499" y2="6.75423" gradientUnits="userSpaceOnUse">
      <stop/>
      <stop offset="1"/>
    </linearGradient>
    <linearGradient id="paint1_linear_3747_1795" x1="4.44652" y1="3" x2="4.44652" y2="8.99297" gradientUnits="userSpaceOnUse">
      <stop/>
      <stop offset="1"/>
    </linearGradient>
  </defs>
</svg>
`
const PT2Icon = (props: SvgProps) => <SvgXml xml={xml} width='100%' height='100%' {...props} />
export default PT2Icon

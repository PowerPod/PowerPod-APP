import * as React from 'react'
import { SvgProps, SvgXml } from 'react-native-svg'

const xml = `
 <svg xmlns="http://www.w3.org/2000/svg" width="41" height="40" viewBox="0 0 41 40" fill="none">
  <g clip-path="url(#clip0_6235_65445)">
    <path d="M5.66668 20C5.66668 21.9698 6.05467 23.9204 6.80849 25.7403C7.56231 27.5601 8.6672 29.2137 10.0601 30.6066C11.453 31.9995 13.1065 33.1044 14.9264 33.8582C16.7463 34.612 18.6969 35 20.6667 35C22.6365 35 24.587 34.612 26.4069 33.8582C28.2268 33.1044 29.8804 31.9995 31.2733 30.6066C32.6662 29.2137 33.7711 27.5601 34.5249 25.7403C35.2787 23.9204 35.6667 21.9698 35.6667 20C35.6667 16.0218 34.0863 12.2064 31.2733 9.3934C28.4602 6.58035 24.6449 5 20.6667 5C16.6884 5 12.8731 6.58035 10.0601 9.3934C7.24703 12.2064 5.66668 16.0218 5.66668 20Z" stroke="#3F3F46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M25.6667 15L15.6667 25" stroke="#3F3F46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M25.6667 25H15.6667V15" stroke="#3F3F46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_6235_65445">
      <rect width="40" height="40" fill="white" transform="translate(0.666679)"/>
    </clipPath>
  </defs>
</svg>
`
const IconWalletReceive = (props: SvgProps) => <SvgXml xml={xml} width='100%' height='100%' {...props} />
export default IconWalletReceive

import * as React from 'react'
import { SvgProps, SvgXml } from 'react-native-svg'

const xml = `<svg width="256" height="257" viewBox="0 0 256 257" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle id="Ellipse 716" cx="128" cy="128.53" r="128" fill="url(#paint0_radial_12056_1432)"/>
<defs>
<radialGradient id="paint0_radial_12056_1432" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(128 128.53) rotate(90) scale(128)">
<stop stop-color="#D7FF82"/>
<stop offset="1" stop-color="#D7FF82" stop-opacity="0"/>
</radialGradient>
</defs>
</svg>

`
const BgEllipseSvg = (props: SvgProps) => <SvgXml xml={xml} width='100%' height='100%' {...props} />
export default BgEllipseSvg

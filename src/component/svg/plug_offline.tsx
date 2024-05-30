import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from 'react-native-svg'

// const xml = `
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <g id="plug-x" clip-path="url(#clip0_5283_34766)">
//   <path id="Vector" d="M9.03344 11.822C8.53426 11.9791 8.00839 12.0334 7.48763 11.9816C6.96686 11.9297 6.46203 11.7728 6.00363 11.5203C5.54524 11.2678 5.14281 10.9249 4.82068 10.5125C4.49854 10.1001 4.26339 9.62657 4.12944 9.12067C3.95437 8.46056 3.95693 7.76589 4.13688 7.10709C4.31683 6.44829 4.66777 5.84878 5.15411 5.36933L6.52344 4L11.3001 8.77667" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
//   <path id="Vector_2" d="M2.6665 13.3333L4.99984 11" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
//   <path id="Vector_3" d="M9.99984 2.6665L7.6665 4.99984" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
//   <path id="Vector_4" d="M13.3333 6L11 8.33333" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
//   <path id="Vector_5" d="M10.6665 10.6665L13.3332 13.3332" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
//   <path id="Vector_6" d="M13.3332 10.6665L10.6665 13.3332" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
//   </g>
//   <defs>
//   <clipPath id="clip0_5283_34766">
//   <rect width="16" height="16" fill="white"/>
//   </clipPath>
//   </defs>
//   </svg>
// `
// const PlugOfflineIcon = (props: SvgProps) => <SvgXml xml={xml} width='100%' height='100%' {...props} />
// export default PlugOfflineIcon


const PlugOfflineIcon = (props: SvgProps) => <Svg viewBox='0 0 16 16' width='16'
                                                  height='16' fill='none' {...props}>

  <G id='plug-x' clipPath='url(#clip0_5283_34766)'>
    <Path id='Vector'
          d='M9.03344 11.822C8.53426 11.9791 8.00839 12.0334 7.48763 11.9816C6.96686 11.9297 6.46203 11.7728 6.00363 11.5203C5.54524 11.2678 5.14281 10.9249 4.82068 10.5125C4.49854 10.1001 4.26339 9.62657 4.12944 9.12067C3.95437 8.46056 3.95693 7.76589 4.13688 7.10709C4.31683 6.44829 4.66777 5.84878 5.15411 5.36933L6.52344 4L11.3001 8.77667'
          stroke={props.color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    <Path id='Vector_2' d='M2.6665 13.3333L4.99984 11' stroke={props.color} strokeWidth='1.5' strokeLinecap='round'
          strokeLinejoin='round' />
    <Path id='Vector_3' d='M9.99984 2.6665L7.6665 4.99984' stroke={props.color} strokeWidth='1.5' strokeLinecap='round'
          strokeLinejoin='round' />
    <Path id='Vector_4' d='M13.3333 6L11 8.33333' stroke={props.color} strokeWidth='1.5' strokeLinecap='round'
          strokeLinejoin='round' />
    <Path id='Vector_5' d='M10.6665 10.6665L13.3332 13.3332' stroke={props.color} strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round' />
    <Path id='Vector_6' d='M13.3332 10.6665L10.6665 13.3332' stroke={props.color} strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round' />
  </G>
  <Defs>
    <ClipPath id='clip0_5283_34766'>
      <Rect width='16' height='16' fill='white' />
    </ClipPath>
  </Defs>
</Svg>
export default PlugOfflineIcon

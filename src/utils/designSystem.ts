import { Colors, Typography } from 'react-native-ui-lib'
import { Appearance } from './types/enums'
import themeColors from './themeColors'

//test
const neutral = themeColors.colors.neutral

const colors = {
  primary: neutral.$900,
  secondary: '#dcfce7',
  accent: themeColors.colors.theme,

  _black: Colors.rgba(20, 20, 20, 1),
  _black2: Colors.rgba(50, 50, 50, 1),
  _white: Colors.rgba(245, 246, 246, 1),
  _white2: Colors.rgba(230, 230, 230, 1),
}

const themes: Record<Appearance, ThemeColors> = {
  system: {} as any,
  light: {

    textColor: colors._black,
    bgColor: colors._white,
    bg2Color: colors._black2,

    $backgroundPrimaryHeavy: neutral.$900,
    $outlineDefault: neutral.$200,
    $outlinePrimary: neutral.$600,
    $outlineDisabled: neutral.$100,

    $textPrimary: neutral.$900,
    $textNeutral: neutral.$500,
    $textNeutralLight: neutral.$400,
    $textNeutralHeavy: neutral.$700,
    $textDisabled: neutral.$100,
    $textGeneral: neutral.$200,
    $textSuccess: themeColors.colors.emerald.$500,

    $iconPrimary:neutral.$900,
  },
  dark: {

    textColor: colors._white,
    bgColor: colors._black,
    bg2Color: colors._black2,

    $backgroundPrimaryHeavy: neutral.$900,
    $outlineDefault: neutral.$200,
    $outlinePrimary: neutral.$700,
    $outlineDisabled: neutral.$100,

    $textPrimary: neutral.$900,
    $textNeutral: neutral.$500,
    $textNeutralLight: neutral.$400,
    $textNeutralHeavy: neutral.$700,
    $textDisabled: neutral.$100,
    $textGeneral: neutral.$200,
    $textSuccess: themeColors.colors.emerald.$500,

    $iconPrimary:neutral.$900,

  },
}

const setColorsScheme = (appearance: Appearance) => {
  if (appearance === 'system') Colors.setScheme('default')
  else Colors.setScheme(appearance)
}

export const configureDesignSystem = () => {

  // if (appearance === 'system') {
  //   Colors.loadColors(colors);
  //   Colors.loadSchemes(themes);
  // } else {
  Colors.loadColors({ ...colors, ...neutral })
  Colors.loadSchemes(themes)
  // }

  setColorsScheme('light')

  Typography.loadTypographies({
    section: { fontSize: 26, fontWeight: '600' },
  })
}

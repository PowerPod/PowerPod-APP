// System
type PVoid = Promise<void>;

// Design system
type ThemeColors = {

  // _temp
  textColor: string,
  bgColor: string,
  bg2Color: string,

  // bg&outline
  $backgroundPrimaryHeavy: string,
  $outlineDefault: string,
  $outlinePrimary: string,
  $outlineDisabled: string,

  // text
  $textPrimary: string,
  $textNeutral: string,
  $textNeutralLight: string,
  $textNeutralHeavy: string,
  $textDisabled: string,
  $textGeneral: string,
  $textSuccess: string,

  //icon
  $iconPrimary: string,
};

type Device = {
  created_at: string,
  deviceId: string | null,
  id: number,
  userId: string | null,
}

type TokenRpcList = {
  native: number,
  tokens: [{
    address: string,
    amount: number,
    decimals: number,
    image: string,
    name: string,
    symbol: string
  }]
}

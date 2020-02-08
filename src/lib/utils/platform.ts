import { Platform, Dimensions } from 'react-native'

export const isAndroid = () => {
  return Platform.OS === 'android'
}

export const isIOS = () => {
  return Platform.OS === 'ios'
}

export const vw = (
  percentageWidth: number,
  rounded: boolean = false
): number => {
  const value = Dimensions.get('window').width * (percentageWidth / 100)
  return rounded ? Math.round(value) : value
}

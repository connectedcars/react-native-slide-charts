import { Platform, Dimensions } from 'react-native'
import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback'

export const isAndroid = () => {
  return Platform.OS === 'android'
}

export const isIOS = () => {
  return Platform.OS === 'ios'
}

export const vw = (percentageWidth: number, rounded: boolean = false): number => {
  const value = Dimensions.get('window').width * (percentageWidth / 100)
  return rounded ? Math.round(value) : value
}

export const hapticFeedbackOptions = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: false
}

export const reactNativeHapticFeedbackIOS = (impactType: HapticFeedbackTypes) => {
  if (isIOS()) {
    ReactNativeHapticFeedback.trigger(impactType, hapticFeedbackOptions)
  }
}
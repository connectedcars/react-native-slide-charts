import React from 'react'
import { LinearGradient, Stop } from 'react-native-svg'
import { GradientProps } from './types'

export const defaultAreaChartFillGradient = (props: GradientProps) => {
  return (
    <LinearGradient x1='50%' y1='0%' x2='50%' y2='100%' {...props}>
      <Stop stopColor='#0081EB' offset='0%' stopOpacity='0.2' />
      <Stop stopColor='#FFFFFF' offset='100%' stopOpacity='0.2' />
    </LinearGradient>
  )
}

export const defaultBarChartFillGradient = (props: GradientProps) => {
  return (
    <LinearGradient x1='50%' y1='0%' x2='50%' y2='100%' {...props}>
      <Stop stopColor='#0081EB' offset='0%' stopOpacity='0.4' />
      <Stop stopColor='#0081EB' offset='100%' stopOpacity='0.4' />
    </LinearGradient>
  )
}

export const defaultBarChartSelectedFillGradient = (props: GradientProps) => {
  return (
    <LinearGradient x1='50%' y1='0%' x2='50%' y2='100%' {...props}>
      <Stop stopColor='#0081EB' offset='0%' stopOpacity='1' />
      <Stop stopColor='#0081EB' offset='100%' stopOpacity='1' />
    </LinearGradient>
  )
}

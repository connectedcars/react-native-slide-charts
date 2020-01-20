import React from 'react'
import { Defs, LinearGradient, Stop } from 'react-native-svg'
import { GradientProps } from '../../charts/utils/types'

export const verticalLineGradient = (props: GradientProps) => (
  <Defs key={'verticalLineGradient'}>
    <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" {...props}>
      <Stop stopColor="#ffffff" offset="0%" stopOpacity="1" />
      <Stop stopColor="#dadada" offset="30%" stopOpacity="1" />
      <Stop stopColor="#dadada" offset="100%" stopOpacity="1" />
    </LinearGradient>
  </Defs>
)

export const horizontalLineGradient = (props: GradientProps & { count: number }) => (
  <Defs key={props.id}>
    <LinearGradient x1="0%" y1="0%" x2="100%" y2="0%" id={props.id}>
      <Stop stopColor="#dadada" offset="0%" stopOpacity="1" />
      <Stop stopColor="#dadada" offset="50%" stopOpacity="1" />
      <Stop stopColor="#dadada" offset="100%" stopOpacity="1" />
    </LinearGradient>
  </Defs>
)

export const axisLabelColor = '#777777'

export const axisMarkerColor = '#222222'

export const averageMarkerColor = '#77777780'

export const averageLineDefaultColor = '#77777780'

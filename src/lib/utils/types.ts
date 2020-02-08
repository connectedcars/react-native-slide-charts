import { StyleProp, ViewStyle, Animated } from 'react-native'
import * as shape from 'd3-shape'
import { GradientProps } from '../components/chartComponents/charts/utils/types'
import {
  XAxisProps,
  YAxisProps,
} from '../components/chartComponents/axis/utils/types'
import { ToolTipProps } from '../components/toolTip/utils/types'
import { CursorProps } from '../components/Cursor/utils/types'

export type ExtendedAnimatedValue = Animated.Value & {
  // __getValue is a unexposed method on Animated.Value
  __getValue?: () => number | undefined
}

type SharedChartComponentProps = {
  data?: Array<{ x: number | Date; y: number }>
  yRange?: [number, number]
  xRange?: [number, number] | [Date, Date]
  yAxisProps?: YAxisProps
  xAxisProps?: XAxisProps
  toolTipProps?: ToolTipProps
  callbackWithX?: (x: number | Date) => void
  callbackWithY?: (y: number) => void
  showIndicatorCallback?: (opacity: number) => void
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  scrollable?: boolean
  fillColor?: string
}

type SharedChartProps = SharedChartComponentProps & {
  xScale?: 'time' | 'linear'
  axisWidth?: number
  axisHeight?: number
  chartPaddingTop?: number
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  height?: number
  width?: number
  alwaysShowIndicator?: boolean
  renderFillGradient?: (props: GradientProps) => JSX.Element | null
  animated?: boolean
  shouldCancelWhenOutside?: boolean
  throttleAndroid?: boolean
}

type SharedChartDefaultProps = {
  data: Array<{ x: number | Date; y: number }>
  height: number
  width: number
  axisWidth: number
  axisHeight: number
  chartPaddingTop: number
  paddingTop: number
  paddingBottom: number
  paddingLeft: number
  paddingRight: number
  alwaysShowIndicator: boolean
  xScale: 'time' | 'linear'
  renderFillGradient: (props: GradientProps) => JSX.Element | null
  animated: boolean
  shouldCancelWhenOutside: boolean
  throttleAndroid: boolean
}

type SharedBarChartProps = {
  barSelectedColor?: string
  barWidth?: number
  hideSelection?: boolean
  selectionChangedCallback?: (bar: number) => void
}

export type SlideBarChartProps = SharedChartProps &
  SharedBarChartProps & {
    barSpacing?: number
    renderSelectedFillGradient?: (props: GradientProps) => JSX.Element | null
  }

export type SlideBarChartDefaultProps = SharedChartDefaultProps & {
  barSpacing: number
  renderSelectedFillGradient: (props: GradientProps) => JSX.Element | null
}

export type SlideBarChartComponentProps = SlideBarChartDefaultProps &
  SharedChartComponentProps &
  SharedBarChartProps

export type SlideAreaChartProps = SharedChartProps & {
  curveType?: shape.CurveFactory | shape.CurveFactoryLineOnly
  cursorProps?: CursorProps
  chartLineColor?: string
  chartLineWidth?: number
}

export type SlideAreaChartDefaultProps = SharedChartDefaultProps & {
  curveType: shape.CurveFactory | shape.CurveFactoryLineOnly
  cursorProps: CursorProps
  chartLineColor: string
  chartLineWidth: number
}

export type SlideAreaChartComponentProps = SlideAreaChartDefaultProps &
  SharedChartComponentProps

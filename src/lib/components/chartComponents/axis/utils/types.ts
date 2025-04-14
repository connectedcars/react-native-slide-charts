import { ScaleTime, ScaleLinear } from 'd3'
import { TSpanProps } from 'react-native-svg/lib/typescript/'
import { GradientProps } from '../../charts/utils/types'
import { AlignmentBaseline, TextAnchor } from 'react-native-svg/lib/typescript/lib/extract/types'

type AxisProps = {
  data: Array<{ x: number | Date; y: number }>
  scaleX: ScaleTime<number, number> | ScaleLinear<number, number>
  scaleY: ScaleLinear<number, number>
  yRange: [number, number]
  width: number
  height: number
  axisWidth: number
  axisHeight: number
  paddingLeft: number
  paddingRight: number
}

type YAxisPartialProps = {
  averageLineColor?: string
  verticalLineWidth?: number
  interval?: number
  numberOfTicks?: number
  axisLabel?: string
  verticalLineColor?: string
  horizontalLineColor?: string
  showAverageLine?: boolean
  markAverageLine?: boolean
  hideMarkers?: boolean
}

export type YAxisProps = YAxisPartialProps & {
  fullBaseLine?: boolean
  markFirstLine?: boolean
  axisLabelStyle?: TSpanProps & { color: string }
  axisMarkerStyle?: TSpanProps & { color: string }
  axisAverageMarkerStyle?: TSpanProps & { color: string }
  renderVerticalLineGradient?: (props: GradientProps) => React.ReactNode | null
  renderHorizontalLineGradient?: (
    props: GradientProps & { count: number }
  ) => React.ReactNode | null
  horizontalLineWidth?: number
  showBaseLine?: boolean
  labelTopPadding?: number
  axisLabelAlignment?: YAxisLabelAlignment
  rotateAxisLabel?: boolean
  markerChartOffset?: number
  labelLeftOffset?: number
  averageMarkerDecimals?: number
}

export type YAxisDefaultProps = {
  fullBaseLine: boolean
  markFirstLine: boolean
  axisLabelStyle: TSpanProps & { color: string }
  axisMarkerStyle: TSpanProps & { color: string }
  axisAverageMarkerStyle: TSpanProps & { color: string }
  renderVerticalLineGradient: (props: GradientProps) => React.ReactNode | null
  renderHorizontalLineGradient: (
    props: GradientProps & { count: number }
  ) => React.ReactNode | null
  averageLineColor: string
  verticalLineWidth: number
  horizontalLineWidth: number
  showBaseLine: boolean
  labelTopPadding: number
  axisLabelAlignment: YAxisLabelAlignment
  rotateAxisLabel: boolean
  markerChartOffset: number
  labelLeftOffset: number
  averageMarkerDecimals: number
}

export type YAxisComponentProps = YAxisDefaultProps &
  YAxisPartialProps &
  AxisProps & { paddingTop: number; paddingBottom: number }

export type YAxisMarkerProps = {
  x: number
  y: number
  fill: string
  alignmentBaseline: AlignmentBaseline
  key: string
  labelStyle: TSpanProps & { color: string }
  label?: string | number | null
  textAnchor?: TextAnchor
  rotated?: boolean
}

type XAxisPartialProps = {
  axisLabel?: string
  specialStartMarker?: string
  specialEndMarker?: string
  markerSpacing?: number
}

export type XAxisProps = XAxisPartialProps & {
  axisLabelStyle?: TSpanProps & { color: string }
  axisLabelAlignment?: XAxisLabelAlignment
  labelTopPadding?: number
  axisMarkerLabels?: string[]
  markerTopPadding?: number
  adjustForSpecialMarkers?: boolean
  minimumSpacing?: number
  labelBottomOffset?: number
}

export type XAxisDefaultProps = {
  axisLabelStyle: TSpanProps & { color: string }
  axisLabelAlignment: XAxisLabelAlignment
  labelTopPadding: number
  axisMarkerLabels: string[]
  markerTopPadding: number
  adjustForSpecialMarkers: boolean
  minimumSpacing: number
  labelBottomOffset: number
}

export type XAxisComponentProps = XAxisDefaultProps &
  XAxisPartialProps &
  AxisProps & {
    barWidth?: number
    barSpacing?: number
  }

export type XAxisMarkerProps = {
  x: number
  y: number
  fill: string
  textAnchor: TextAnchor
  key: string
  labelStyle: TSpanProps & { color: string }
  label?: string | number | null
  alignmentBaseline?: AlignmentBaseline
}

export enum XAxisLabelAlignment {
  right = 'right',
  left = 'left',
  center = 'center',
}

export enum YAxisLabelAlignment {
  top = 'top',
  bottom = 'bottom',
  middle = 'middle',
  aboveTicks = 'aboveTicks',
}

export type LabelAndAlignment = {
  markerAlignment: TextAnchor
  label?: string
  specialX?: number
}

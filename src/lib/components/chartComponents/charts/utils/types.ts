import { ScaleLinear, ScaleTime } from 'd3'
import { YAxisProps, XAxisProps } from '../../axis/utils/types'

export type GradientProps = {
  id: string
}

type SharedChartProps = {
  data: Array<{ x: number | Date; y: number }>
  scaleX: ScaleTime<number, number> | ScaleLinear<number, number>
  scaleY: ScaleLinear<number, number>
  yRange: [number, number]
  width: number
  axisWidth: number
  axisHeight: number
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number
  height: number
  renderFillGradient: (props: GradientProps) => JSX.Element | null
  yAxisProps?: YAxisProps
  xAxisProps?: XAxisProps
}

export type BarChartProps = SharedChartProps & {
  renderSelectedFillGradient: (props: GradientProps) => JSX.Element | null
  animated: boolean
  barSpacing: number
  barWidth?: number
  barFillColor?: string
  barSelectedColor?: string
  barSelectedIndex?: number
  hideSelection?: boolean
}

export type AreaChartProps = SharedChartProps & {
  line: string
  graphLineColor: string
  graphLineWidth: number
  graphFillColor?: string
}

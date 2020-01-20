import { TextStyle } from 'react-native'
import { ScaleTime, ScaleLinear } from 'd3'

export type ToolTipTextRenderersInput = {
  x: number
  y: number
  scaleX: ScaleTime<number, number> | ScaleLinear<number, number>
  scaleY: ScaleLinear<number, number>
  selectedBarNumber: number
}

type ToolTipPartialProps = {
  height?: number
  width?: number
}

export type ToolTipProps = ToolTipPartialProps & {
  borderRadius?: number
  fontSize?: number
  textStyles?: TextStyle[]
  toolTipTextRenderers?: Array<(toolTipTextRenderersInput: ToolTipTextRenderersInput) => { text: string }>
  backgroundColor?: string
  displayTriangle?: boolean
  lockTriangleCenter?: boolean
  displayToolTip?: boolean
}

export type ToolTipDefaultProps = {
  borderRadius: number
  fontSize: number
  textStyles: TextStyle[]
  toolTipTextRenderers: Array<(toolTipTextRenderersInput: ToolTipTextRenderersInput) => { text: string }>
  backgroundColor: string
  displayTriangle: boolean
  lockTriangleCenter: boolean
  displayToolTip: boolean
}

export type ToolTipComponentProps = ToolTipDefaultProps & ToolTipPartialProps

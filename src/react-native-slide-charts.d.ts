import { SlideBarChartProps, SlideAreaChartProps } from './lib/utils/types'
import {
  YAxisProps,
  XAxisProps,
  XAxisMarkerProps,
  LabelAndAlignment,
} from './lib/components/chartComponents/axis/utils/types'
import { CursorProps } from './lib/components/cursor/utils/types'
import {
  ToolTipProps,
  ToolTipTextRenderersInput,
} from './lib/components/toolTip/utils/types'
import { GradientProps } from './lib/components/chartComponents/charts/utils/types'

export const SlideBarChart: React.ComponentClass<SlideBarChartProps>
export const SlideAreaChart: React.ComponentClass<SlideAreaChartProps>
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

export {
  SlideBarChartProps,
  SlideAreaChartProps,
  YAxisProps,
  XAxisProps,
  XAxisMarkerProps,
  LabelAndAlignment,
  CursorProps,
  ToolTipProps,
  ToolTipTextRenderersInput,
  GradientProps,
}

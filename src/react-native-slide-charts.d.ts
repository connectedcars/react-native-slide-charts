import { SlideBarChartProps, SlideAreaChartProps } from './lib/utils/types'
import {
  YAxisProps,
  XAxisProps,
  XAxisMarkerProps,
  XAxisLabelAlignment,
  YAxisLabelAlignment,
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

export {
  SlideBarChartProps,
  SlideAreaChartProps,
  YAxisProps,
  XAxisProps,
  XAxisMarkerProps,
  XAxisLabelAlignment,
  YAxisLabelAlignment,
  LabelAndAlignment,
  CursorProps,
  ToolTipProps,
  ToolTipTextRenderersInput,
  GradientProps,
}

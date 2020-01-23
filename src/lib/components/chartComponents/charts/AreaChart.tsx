import React, { Component } from 'react'
import { Svg, Defs } from 'react-native-svg'
import YAxis from '../axis/YAxis'
import XAxis from '../axis/XAxis'
import AnimatedPath from '../../AnimatedPath'
import { AreaChartProps } from './utils/types'

class AreaChart extends Component<AreaChartProps> {
  animatedPathRef = React.createRef<any>()
  animatedFillRef = React.createRef<any>()

  // Directly manipulate the line of the area and line to allow for non state based animation
  setNativeLineProps(line: string) {
    const {
      height,
      axisHeight,
      data,
      scaleX,
      axisWidth,
      width,
      paddingBottom,
      paddingLeft,
      paddingRight,
    } = this.props
    const startX = data.length > 1 ? scaleX(data[0].x) : axisWidth + paddingLeft
    const stopX =
      data.length > 1 ? scaleX(data[data.length - 1].x) : width - paddingRight
    if (
      this.animatedPathRef.current != null &&
      this.animatedFillRef.current != null
    ) {
      const topOfLine = height - axisHeight - paddingBottom
      this.animatedPathRef.current.setNativeProps({ d: line })
      this.animatedFillRef.current.setNativeProps({
        d: `${line} L ${stopX} ${topOfLine} L ${startX} ${topOfLine}`,
      })
    }
  }

  render() {
    const {
      width,
      height,
      line,
      scaleY,
      xAxisProps,
      yAxisProps,
      axisWidth,
      chartLineWidth,
      yRange,
      renderFillGradient,
      fillColor,
      chartLineColor,
      data,
      scaleX,
      axisHeight,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    } = this.props

    const startX = data.length > 1 ? scaleX(data[0].x) : axisWidth + paddingLeft
    const stopX =
      data.length > 1 ? scaleX(data[data.length - 1].x) : width - paddingRight

    return (
      <Svg {...{ width, height }}>
        <Defs>{renderFillGradient({ id: 'gradient' })}</Defs>
        <YAxis
          data={data}
          scaleX={scaleX}
          scaleY={scaleY}
          yRange={yRange}
          width={width}
          height={height}
          axisWidth={axisWidth}
          axisHeight={axisHeight}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          paddingTop={paddingTop}
          paddingBottom={paddingBottom}
          {...yAxisProps}
        />
        <XAxis
          data={data}
          scaleX={scaleX}
          scaleY={scaleY}
          yRange={yRange}
          width={width}
          height={height}
          axisHeight={axisHeight}
          axisWidth={axisWidth}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          {...xAxisProps}
        />
        <AnimatedPath
          ref={this.animatedFillRef}
          d={`${line} L ${stopX} ${scaleY(yRange[0])} L ${startX} ${scaleY(
            yRange[0]
          )}`}
          fill={fillColor || 'url(#gradient)'}
        />
        <AnimatedPath
          ref={this.animatedPathRef}
          d={line}
          fill='transparent'
          stroke={chartLineColor}
          strokeWidth={chartLineWidth}
        />
      </Svg>
    )
  }
}

export default AreaChart

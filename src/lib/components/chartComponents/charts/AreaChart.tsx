import React, { Component } from 'react'
import { Svg, Defs } from 'react-native-svg'
import YAxis from '../axis/YAxis'
import XAxis from '../axis/XAxis'
import AnimatedPath from '../../AnimatedPath'
import { AreaChartProps } from './utils/types'

class AreaChart extends Component<AreaChartProps> {
  animatedPathRef = React.createRef<any>()
  animatedFillRef = React.createRef<any>()

  sliceLine(line: string, index: number | undefined) {
    if (index !== undefined) {
      return line.split("C").slice(0, index + 1).join("C");
    }
    return line;
  }

  // Directly manipulate the line of the area and line to allow for non state based animation
  setNativeLineProps(line: string) {
    const {
      data,
      scaleX,
      scaleY,
      yRange,
      axisWidth,
      paddingLeft,
      lineSliceIndex,
    } = this.props
    const startX = data.length > 1 ? scaleX(data[0].x) : axisWidth + paddingLeft
    if (
      this.animatedPathRef.current != null &&
      this.animatedFillRef.current != null
      ) {
      const slicedLine = this.sliceLine(line, lineSliceIndex);
      this.animatedPathRef.current.setNativeProps({ d: slicedLine })
      this.animatedFillRef.current.setNativeProps({
        d: `${slicedLine} V ${scaleY(yRange[0])} L ${startX} ${scaleY(
          yRange[0]
        )}`,
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
      lineSliceIndex,
    } = this.props

    const slicedLine = this.sliceLine(line, lineSliceIndex);
    const startX = data.length > 1 ? scaleX(data[0].x) : axisWidth + paddingLeft

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
          d={`${slicedLine} V ${scaleY(yRange[0])} L ${startX} ${scaleY(
            yRange[0]
          )}`}
          fill={fillColor || 'url(#gradient)'}
        />
        <AnimatedPath
          ref={this.animatedPathRef}
          d={slicedLine}
          fill='transparent'
          stroke={chartLineColor}
          strokeWidth={chartLineWidth}
          strokeLinecap="round"
        />
      </Svg>
    )
  }
}

export default AreaChart

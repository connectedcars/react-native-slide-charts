import React, { Component } from 'react'
import { Line, Text, TSpan} from 'react-native-svg'
import {
  verticalLineGradient, horizontalLineGradient, axisLabelColor,
  axisMarkerColor, averageLineDefaultColor, averageMarkerColor
} from './utils/colors'
import {
  YAxisComponentProps, YAxisDefaultProps, YAxisMarkerProps, YAxisLabelAlignment,
} from './utils/types'
import { AlignmentBaseline, TextAnchor } from 'react-native-svg/lib/typescript/lib/extract/types'

class YAxis extends Component<YAxisComponentProps> {

  static defaultProps: YAxisDefaultProps = {
    renderVerticalLineGradient: verticalLineGradient,
    verticalLineWidth: 1,
    horizontalLineWidth: 1,
    axisLabelStyle: { fontSize: 13, color: axisLabelColor },
    axisMarkerStyle: { fontSize: 13, color: axisMarkerColor },
    axisAverageMarkerStyle: { fontSize: 13, color: averageMarkerColor },
    renderHorizontalLineGradient: horizontalLineGradient,
    fullBaseLine: false,
    averageLineColor: averageLineDefaultColor,
    markFirstLine: false,
    showBaseLine: true,
    labelTopPadding: 4,
    axisLabelAlignment: YAxisLabelAlignment.aboveTicks,
    rotateAxisLabel: false,
    markerChartOffset: 4,
    labelLeftOffset: 0,
    averageMarkerDecimals: 0,
  }

  addAxisMarker = ({
    x,
    y,
    fill,
    alignmentBaseline,
    key,
    labelStyle,
    label,
    textAnchor,
    rotated
  }: YAxisMarkerProps) => (
      <Text
        x={x}
        y={y}
        fill={fill}
        alignmentBaseline={alignmentBaseline}
        textAnchor={textAnchor || 'end'}
        key={key}
        transform={rotated ? `rotate(270, ${x}, ${y})` : undefined}
      >
        <TSpan {...labelStyle}>
          {label ?? ''}
        </TSpan>
      </Text>
    )

  // Only update axis if the data or width changes
  shouldComponentUpdate(nextProps: YAxisComponentProps) {
    const { data, width, height, axisHeight, axisWidth } = this.props
    if (
      data.length !== nextProps.data.length
      || JSON.stringify(data) !== JSON.stringify(nextProps.data)
      || width !== nextProps.width
      || height !== nextProps.height
      || axisHeight !== nextProps.axisHeight
      || axisWidth !== nextProps.axisWidth
    ) {
      return true
    }
    return false
  }

  render() {
    const {
      data,
      scaleX,
      scaleY,
      numberOfTicks,
      width,
      axisWidth,
      fullBaseLine,
      interval,
      markFirstLine,
      axisLabel,
      renderVerticalLineGradient,
      verticalLineColor,
      verticalLineWidth,
      axisLabelStyle,
      axisMarkerStyle,
      axisAverageMarkerStyle,
      horizontalLineWidth,
      horizontalLineColor,
      renderHorizontalLineGradient,
      yRange,
      showAverageLine,
      markAverageLine,
      averageMarkerDecimals,
      averageLineColor,
      showBaseLine,
      labelTopPadding,
      axisLabelAlignment,
      axisHeight,
      rotateAxisLabel,
      markerChartOffset,
      labelLeftOffset,
      hideMarkers,
      paddingLeft,
      paddingRight,
      paddingTop,
    } = this.props

    const lines: React.ReactNode[] = []
    const axisMarkers: React.ReactNode[] = []
    const gradients: Array<React.ReactNode | undefined | null> = []
    const stopX = data.length > 1 ? scaleX(data[data.length - 1].x) : width - paddingRight
    const startX = data.length > 1 ? scaleX(data[0].x) : axisWidth + paddingLeft

    const tickInterval = interval != null ? interval :
      (Math.abs(yRange[0] - yRange[1]) / ((numberOfTicks ?? 0) + 1))
    for (let i = 0; i <= (numberOfTicks ?? 0); i++) {
      const y = scaleY(yRange[0] + (i * tickInterval))

      if (y >= paddingTop) {
        // Create the horizontal lines that designate the yAxis scale
        if (i !== 0 || showBaseLine) {
          gradients.push(renderHorizontalLineGradient({ id: `gradientHorizontalLine-${i}`, count: i }))
          lines.push(
            <Line
              x1={(i === 0 && fullBaseLine) ? paddingLeft : startX}
              y1={`${scaleY(yRange[0] + (i * tickInterval))}`}
              x2={stopX} y2={`${scaleY(yRange[0] + (i * tickInterval))}`}
              stroke={horizontalLineColor || `url(#gradientHorizontalLine-${i})`}
              strokeWidth={horizontalLineWidth}
              key={`horizontalLine-${i}`}
            />
          )
        }

        // Add labels to the yAxis scale
        if ((i !== 0 || markFirstLine) && axisWidth > 0 && !hideMarkers) {
          axisMarkers.push(this.addAxisMarker({
            x: startX - markerChartOffset,
            y: ((i === 0 && markFirstLine && fullBaseLine) ||
              (i === 0 && markFirstLine && axisHeight === 0)) ?
              scaleY(yRange[0] + (i * tickInterval)) - 2 :
              scaleY(yRange[0] + (i * tickInterval)),
            fill: axisMarkerStyle.color || axisMarkerColor,
            alignmentBaseline: ((i === 0 && markFirstLine && fullBaseLine) ||
              (i === 0 && markFirstLine && axisHeight === 0)) ?
              'baseline' :
              'middle',
            key: `${i}-text`,
            labelStyle: axisMarkerStyle,
            label: yRange[0] + (i * tickInterval)
          }))
        }
      }
    }

    // Place label above yAxis scale designating the units if set
    if (axisLabel != null && axisWidth > 0) {
      const tickInterval = interval != null ? interval :
        numberOfTicks != null ? (Math.abs(yRange[0] - yRange[1]) / (numberOfTicks + 1))
          : undefined

      /**
       * Determine label alignment, there is a lot of logic here to make sure
       * regardless of the alignment and if the chart has markers with the ticks
       * the label is shown in a usable way
       */
      let y = paddingTop + labelTopPadding
      let alignmentBaseline: AlignmentBaseline = 'hanging'
      let x = startX - markerChartOffset
      let textAnchor: TextAnchor = 'end'
      if (rotateAxisLabel) {
        alignmentBaseline = 'baseline'
        textAnchor = 'end'
      }
      if (axisLabelAlignment === YAxisLabelAlignment.aboveTicks) {
        if (tickInterval != null && numberOfTicks != null) {
          textAnchor = rotateAxisLabel ? 'middle' : 'end'
          alignmentBaseline = rotateAxisLabel ? 'baseline' : 'middle'
          y = scaleY(yRange[0] + ((numberOfTicks + 1) * tickInterval))
        }
      } else if (axisLabelAlignment === YAxisLabelAlignment.bottom) {
        alignmentBaseline = 'baseline'
        y = fullBaseLine ? scaleY(yRange[0]) - 2 : scaleY(yRange[0])
        if (rotateAxisLabel) {
          alignmentBaseline = (markFirstLine && !hideMarkers) ? 'hanging' : 'baseline'
          textAnchor = 'start'
        }
        if (markFirstLine && !hideMarkers) {
          x = paddingLeft + labelLeftOffset
          textAnchor = 'start'
        }
      } else if (axisLabelAlignment === YAxisLabelAlignment.middle) {
        alignmentBaseline = 'middle'
        y = (scaleY(yRange[0])) / 2 + paddingTop
        if (rotateAxisLabel) {
          alignmentBaseline = ((numberOfTicks && !hideMarkers) || markAverageLine) ? 'hanging' : 'baseline'
          textAnchor = 'middle'
        }
        if ((numberOfTicks && !hideMarkers) || markAverageLine) {
          x = paddingLeft + labelLeftOffset
          textAnchor = rotateAxisLabel ? 'middle' : 'start'
        }
      }
      if (y >= paddingTop) {
        axisMarkers.push(this.addAxisMarker({
          x,
          y,
          fill: axisLabelStyle.color || axisLabelColor,
          alignmentBaseline,
          key: 'verticalLabel',
          labelStyle: axisLabelStyle,
          label: axisLabel,
          textAnchor,
          rotated: rotateAxisLabel,
        }))
      }
    }


    // Create the vertical lines designating the start and end of the chart
    if (verticalLineWidth > 0) {
      const lineFromX = (x: number, key: string) => (
        <Line
          x1={`${x}`}
          y1={`${paddingTop}`}
          x2={`${x}`}
          y2={`${scaleY(yRange[0])}`}
          stroke={verticalLineColor || 'url(#gradientVerticalLine)'}
          strokeWidth={verticalLineWidth}
          key={key}
        />
      )
      lines.push(lineFromX(startX, 'verticalLeft'))
      lines.push(lineFromX(stopX - verticalLineWidth / 2, 'verticalRight'))
      gradients.push(renderVerticalLineGradient({ id: 'gradientVerticalLine' }))
    }

    // Draw the horizontal dashed average line
    if (showAverageLine) {
      const startX = data.length > 1 ? scaleX(data[0].x) : axisWidth + paddingLeft
      const stopX = data.length > 1 ? scaleX(data[data.length - 1].x) : width - paddingRight
      const average = data.length > 0 ?
        data.map(dataPoint => dataPoint.y).reduce((a, b) => a + b, 0) / data.length :
        0
      lines.push(
        <Line
          x1={startX}
          y1={scaleY(average)}
          x2={stopX}
          y2={scaleY(average)}
          stroke={averageLineColor}
          strokeDasharray={[4]}
          strokeWidth={horizontalLineWidth}
          key={`average-line`}
        />
      )
    }

    // Add labels to the yAxis scale
    if (markAverageLine) {
      const average = data.length > 0 ?
        data.map(dataPoint => dataPoint.y).reduce((a, b) => a + b, 0) / data.length :
        0
      axisMarkers.push(this.addAxisMarker({
        x: startX - markerChartOffset,
        y: scaleY(average),
        fill: axisAverageMarkerStyle.color || axisMarkerColor,
        alignmentBaseline: 'middle',
        key: `average-text`,
        labelStyle: axisAverageMarkerStyle,
        label: average.toFixed(averageMarkerDecimals)
      }))
    }

    return (
      <>
        {gradients.concat(lines, axisMarkers).map(marker => marker)}
      </>
    )
  }
}

export default YAxis

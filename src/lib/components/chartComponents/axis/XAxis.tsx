import React, { Component } from 'react'
import { Text, TSpan } from 'react-native-svg'
import { axisLabelColor } from './utils/colors'
import {
  XAxisComponentProps, XAxisDefaultProps, XAxisLabelAlignment,
  LabelAndAlignment, XAxisMarkerProps
} from './utils/types'

class XAxis extends Component<XAxisComponentProps> {

  static defaultProps: XAxisDefaultProps = {
    axisLabelStyle: { fontSize: 13, color: axisLabelColor },
    axisLabelAlignment: XAxisLabelAlignment.right,
    labelTopPadding: 4,
    markerTopPadding: 4,
    axisMarkerLabels: [],
    minimumSpacing: 0,
    adjustForSpecialMarkers: false,
    labelBottomOffset: 0,
  }

  // Only update axis if the data, height, or width changes
  shouldComponentUpdate(nextProps: XAxisComponentProps) {
    const { data, axisMarkerLabels, width, height, axisHeight, axisWidth } = this.props
    if (
      data.length !== nextProps.data.length
      || JSON.stringify(data) !== JSON.stringify(nextProps.data)
      || JSON.stringify(axisMarkerLabels) !== JSON.stringify(nextProps.axisMarkerLabels)
      || width !== nextProps.width
      || height !== nextProps.height
      || axisHeight !== nextProps.axisHeight
      || axisWidth !== nextProps.axisWidth
    ) {
      return true
    }
    return false
  }

  // Returns an svg text marker
  renderAxisMarker = ({
    x,
    y,
    fill,
    textAnchor,
    key,
    labelStyle,
    label,
    alignmentBaseline
  }: XAxisMarkerProps) => (
      <Text
        x={x}
        y={y}
        fill={fill}
        alignmentBaseline={alignmentBaseline || 'hanging'}
        textAnchor={textAnchor}
        key={key}
      >
        <TSpan {...labelStyle} >
          {label}
        </TSpan>
      </Text>
    )

  // For charts that want an x-label, label can be left, right, or center justified
  // If the chart has markers and a label the label is pinned to the bottom
  renderAxisLabel = () => {
    const {
      axisLabelAlignment, scaleY, yRange, labelTopPadding, axisLabelStyle, height, labelBottomOffset,
      axisLabel, data, width, scaleX, axisMarkerLabels, axisWidth, paddingLeft, paddingRight
    } = this.props
    const stopX = data.length > 1 ? scaleX(data[data.length - 1].x) : width - paddingRight

    // Align label at start, end, or center of chart
    const labelAnchor = axisLabelAlignment === XAxisLabelAlignment.right ? 'end' :
      axisLabelAlignment === XAxisLabelAlignment.left ? 'start' :
        'middle'
    const xLabelXAxis = axisLabelAlignment === XAxisLabelAlignment.right ? stopX :
      axisLabelAlignment === XAxisLabelAlignment.left ? paddingLeft + axisWidth :
        paddingLeft + axisWidth + (width - axisWidth - paddingLeft - paddingRight) / 2

    // If there are markers the label is bottom justified in both alignment and position
    return this.renderAxisMarker({
      x: xLabelXAxis,
      y: (axisMarkerLabels.length > 0) ?
        height - labelBottomOffset :
        scaleY(yRange[0]) + labelTopPadding,
      fill: axisLabelStyle.color || axisLabelColor,
      textAnchor: labelAnchor,
      key: 'horizontalLabel',
      labelStyle: axisLabelStyle,
      label: axisLabel,
      alignmentBaseline: (axisMarkerLabels.length > 0) ? 'baseline' : undefined
    })
  }

  // Determine the x-axis label for each marker, and where it should be aligned
  determineLabelAndAlignment = (
    numberOfMarks: number,
    numberOfBars: number,
    marker: string,
    i: number
  ): LabelAndAlignment => {
    const {
      axisMarkerLabels, specialStartMarker, specialEndMarker, data, scaleX, axisWidth,
      width, markerSpacing, minimumSpacing, adjustForSpecialMarkers, paddingLeft, paddingRight
    } = this.props
    const startX = data.length > 1 ? scaleX(data[0].x) : axisWidth + paddingLeft
    const stopX = data.length > 1 ? scaleX(data[data.length - 1].x) : width - paddingRight
    if (axisMarkerLabels.length > 1) {
      if (i === 0) {

        // If the fist element should be left aligned to the start of the chart
        return {
          label: specialStartMarker || marker,
          markerAlignment: adjustForSpecialMarkers ?
            (specialStartMarker ? 'start' : 'middle') :
            (numberOfBars === numberOfMarks ? 'middle' : 'start'),
          specialX: adjustForSpecialMarkers ?
            (specialStartMarker ? startX : undefined) :
            (numberOfBars === numberOfMarks ? undefined : startX),
        }
      }
      if (i === numberOfMarks - 1) {

        // If the last element should be right aligned to the end of the chart
        return {
          label: specialEndMarker || marker,
          markerAlignment: adjustForSpecialMarkers ?
            (specialEndMarker ? 'end' : 'middle') :
            (numberOfBars === numberOfMarks ? 'middle' : 'end'),
          specialX: adjustForSpecialMarkers ?
            (specialEndMarker ? stopX : undefined) :
            (numberOfBars === numberOfMarks ? undefined : stopX),
        }
      }
      if (markerSpacing) {
        if (
          i % (markerSpacing + 1) !== 0 ||
          (axisMarkerLabels.length - 1) - (i + 1) < minimumSpacing
        ) {
          return { markerAlignment: 'middle' }
        }
      }
    }
    return { label: marker, markerAlignment: 'middle' }
  }

  render() {
    const {
      data,
      scaleX,
      scaleY,
      width,
      axisLabel,
      axisLabelStyle,
      yRange,
      axisMarkerLabels,
      axisWidth,
      markerTopPadding,
      barSpacing,
      barWidth,
      axisHeight,
      paddingLeft,
      paddingRight,
    } = this.props

    if (axisHeight === 0) { return null }

    const numberOfBars = data.length
    const startX = data.length > 1 ? scaleX(data[0].x) : axisWidth + paddingLeft
    const stopX = data.length > 1 ? scaleX(data[data.length - 1].x) : width - paddingRight
    const chartWidth = stopX - startX
    const numberOfMarks = axisMarkerLabels.length
    const axisMarkers: JSX.Element[] = axisMarkerLabels.map((marker, i) => {
      let markerX = startX
      let labelAndAlignment: LabelAndAlignment = {
        label: marker,
        markerAlignment: 'middle',
        specialX: undefined
      }

      // If there is a label given for every item we line up items directly under each bar
      if ((barWidth || barSpacing) && numberOfBars > 0 && numberOfBars === numberOfMarks) {
        if (barWidth) {
          const barSpacingFromWidth = (chartWidth - (numberOfBars * barWidth)) / (numberOfBars > 1 ? numberOfBars - 1 : 2)
          markerX = numberOfBars > 1 ?
            startX + (i * (barWidth + barSpacingFromWidth)) + (barWidth / 2) :
            startX + barSpacingFromWidth + (barWidth / 2)
        } else if (barSpacing) {
          const barWidthFromSpacing = numberOfBars > 1 ?
            (chartWidth - ((numberOfBars - 1) * barSpacing)) / numberOfBars :
            chartWidth
          markerX = startX + (i * (barWidthFromSpacing + barSpacing)) + (barWidthFromSpacing / 2)
        }
        labelAndAlignment = this.determineLabelAndAlignment(numberOfMarks, numberOfBars, marker, i)
      } else {

        // If we have labels that are not in alignment with each bar we evenly distribute them
        markerX = numberOfMarks > 1 ? startX + (i * chartWidth / (numberOfMarks - 1)) : startX + chartWidth / 2
        labelAndAlignment = this.determineLabelAndAlignment(numberOfMarks, numberOfBars, marker, i)
      }
      return this.renderAxisMarker({
        x: labelAndAlignment.specialX ?? markerX,
        y: scaleY(yRange[0]) + markerTopPadding,
        fill: axisLabelStyle.color || axisLabelColor,
        textAnchor: labelAndAlignment.markerAlignment,
        key: `horizontalMarker-${i}`,
        labelStyle: axisLabelStyle,
        label: labelAndAlignment.label
      })
    })

    // Render markers and label
    return (
      <>
        {axisMarkers.map(marker => marker)}
        {axisLabel != null && this.renderAxisLabel()}
      </>
    )
  }
}

export default XAxis

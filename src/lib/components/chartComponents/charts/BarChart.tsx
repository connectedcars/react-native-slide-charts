import React, { Component } from 'react'
import { Animated } from 'react-native'
import { interpolatePath } from 'd3-interpolate-path'
import { Svg, Defs } from 'react-native-svg'
import { ScaleLinear } from 'd3-scale'
import AnimatedPath from '../../AnimatedPath'
import YAxis from '../axis/YAxis'
import XAxis from '../axis/XAxis'
import { BarChartProps } from './utils/types'

type State = {
  y: Animated.Value
  data: Array<{ x: number | Date; y: number }>
}

class BarChart extends Component<BarChartProps, State> {

  barRefs: any[] = []
  bars: Array<{ bar: string, flatBar: string }> = []
  barInterpolators: Array<Function> = []
  mounted: boolean = false

  state: State = {
    y: new Animated.Value(0),
    data: this.props.data
  }

  animateChart = (value: number) => {
    const { data } = this.props.animated ? this.state : this.props
    data.forEach((_item, index) => {
      if (this.barRefs[index] != null) {
        this.barRefs[index].setNativeProps({ d: this.barInterpolators[index](value) })
      }
    })
  }

  // Create two paths to animate between
  createPaths = (
    widthOfBar: number,
    barStartX: number,
    bottomOfBar: number,
    scaleY: ScaleLinear<number, number>,
    item: { x: number | Date, y: number }
  ) => {
    return {
      flatBar: `M ${barStartX} ${bottomOfBar}
        L ${barStartX + widthOfBar} ${bottomOfBar}
        L ${barStartX + widthOfBar} ${bottomOfBar}
        L ${barStartX} ${bottomOfBar}`,
      bar: `M ${barStartX} ${scaleY(item.y)}
        L ${barStartX + widthOfBar} ${scaleY(item.y)}
        L ${barStartX + widthOfBar} ${bottomOfBar}
        L ${barStartX} ${bottomOfBar}`
    }
  }

  // Create the bar and animation interpolation
  createBarsAndInterpreter = (
    widthOfBar: number,
    barStartX: number,
    bottomOfBar: number,
    scaleY: ScaleLinear<number, number>,
    item: { x: number | Date, y: number },
    index: number
  ) => {
    const { fillColor, barSelectedIndex, barSelectedColor, hideSelection } = this.props
    this.bars[index] = this.createPaths(widthOfBar, barStartX, bottomOfBar, scaleY, item)
    this.barInterpolators[index] = interpolatePath(this.bars[index].flatBar, this.bars[index].bar, null)
    const barSelected = barSelectedIndex === index
    return (
      <AnimatedPath
        ref={this.barRefs[index]}
        key={`bar-${index}`}
        d={this.bars[index].flatBar}
        fill={barSelected && !hideSelection ?
          (barSelectedColor || 'url(#selectedGradient)') :
          (fillColor || 'url(#gradient)')}
      />
    )
  }

  componentDidMount() {
    this.state.y.addListener(({ value }) => this.animateChart(value))
    if (this.props.animated) {
      setTimeout(() => {
        Animated.timing(this.state.y, { toValue: 1, duration: 250, useNativeDriver: true }).start()
        this.mounted = true
      }, 500)
    } else {
      this.mounted = true
      this.state.y.setValue(1)
    }
  }

  componentDidUpdate() {
    if (!this.props.animated) {
      this.state.y.setValue(1)
    }
  }

  shouldComponentUpdate(nextProps: BarChartProps, nextState: State) {

    const { data, width, height } = this.props

    // If animations are off always update the component
    if (!nextProps.animated) {
      return true
    }

    // If animations on check for props.data change and run animation down
    if (
      nextProps.data.length !== data.length
      || JSON.stringify(nextProps.data) !== JSON.stringify(data)
      || width !== nextProps.width
      || height !== nextProps.height
    ) {
      if (data.filter(dataObject => dataObject.y !== 0).length > 0) {
        Animated.timing(this.state.y, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
          this.setState({ data: nextProps.data })
        })
      } else {
        Animated.timing(this.state.y, { toValue: 0, duration: 250, useNativeDriver: true }).stop()
        this.setState({ data: nextProps.data })
      }
      return false
    }

    // If animations on check for state.data change and run animation up
    if (
      nextState.data.length !== this.state.data.length
      || JSON.stringify(nextState.data) !== JSON.stringify(this.state.data)
    ) {
      Animated.timing(this.state.y, { toValue: 0, duration: 250, useNativeDriver: true }).stop()
      Animated.timing(this.state.y, { toValue: 1, duration: 250, useNativeDriver: true }).start()
      return true
    }

    // Fallback in case of edge cases for animation
    if (
      JSON.stringify(nextState.data) === JSON.stringify(this.state.data)
      && this.state.y !== new Animated.Value(1)
      && this.state.data.filter(dataObject => dataObject.y !== 0).length > 0
      && this.mounted
    ) {
      Animated.timing(this.state.y, { toValue: 0, duration: 250, useNativeDriver: true }).stop()
      Animated.timing(this.state.y, { toValue: 1, duration: 250, useNativeDriver: true }).stop()
      Animated.timing(this.state.y, { toValue: 1, duration: 250, useNativeDriver: true }).start()
      return true
    }

    // If animations on only update on change selection if state.data & props.data match lengths
    if (
      this.props.barSelectedIndex !== nextProps.barSelectedIndex &&
      nextState.data.length === nextProps.data.length
    ) {
      return true
    }
    return false
  }

  render() {
    const {
      width,
      height,
      scaleY,
      axisWidth,
      yRange,
      renderFillGradient,
      renderSelectedFillGradient,
      scaleX,
      animated,
      barWidth,
      barSpacing,
      yAxisProps,
      xAxisProps,
      axisHeight,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    } = this.props

    const { data } = animated ? this.state : this.props

    const startX = data.length > 1 ? scaleX(data[0].x) : axisWidth + paddingLeft
    const stopX = data.length > 1 ? scaleX(data[data.length - 1].x) : width - paddingRight

    const numberOfBars = data.length
    const chartWidth = stopX - startX
    const horizontalLineWidth = yAxisProps?.horizontalLineWidth
    const bottomOfBar = scaleY(yRange[0]) - (horizontalLineWidth ? horizontalLineWidth / 2 : 1 / 2)
    let paths: React.ReactNode[] = []

    // Create an array of the bars with proper size and position
    if (barWidth != null && numberOfBars > 1) {

      // Determine bar spacing based on width and align first and last bar at ends
      const barSpacingFromWidth = (chartWidth - (numberOfBars * barWidth)) / (numberOfBars - 1)
      paths = data.map((item: { x: number | Date, y: number }, index: number) => {
        const barStartX = startX + (index * (barWidth + barSpacingFromWidth))
        return this.createBarsAndInterpreter(barWidth, barStartX, bottomOfBar, scaleY, item, index)
      })
    } else if (barWidth != null && numberOfBars > 0) {

      // If there is only one bar and a barWidth, align it center
      const barSpacingFromWidth = (chartWidth - (numberOfBars * barWidth)) / 2
      paths = data.map((item: { x: number | Date, y: number }, index: number) => {
        const barStartX = startX + barSpacingFromWidth
        return this.createBarsAndInterpreter(barWidth, barStartX, bottomOfBar, scaleY, item, index)
      })
    } else if (barSpacing != null && numberOfBars > 1) {

      // Bar spacing has a default prop so this is the default case where the bars fill the available area
      const barWidthFromSpacing = (chartWidth - ((numberOfBars - 1) * barSpacing)) / numberOfBars
      paths = data.map((item: { x: number | Date, y: number }, index: number) => {
        const barStartX = startX + (index * (barWidthFromSpacing + barSpacing))
        return this.createBarsAndInterpreter(barWidthFromSpacing, barStartX, bottomOfBar, scaleY, item, index)
      })
    } else if (barSpacing != null && numberOfBars > 0) {

      // Bar spacing has a default prop but we modify for one bar usage
      const barWidthFromSpacing = chartWidth / 11
      paths = data.map((item: { x: number | Date, y: number }, index: number) => {
        const barStartX = startX + chartWidth / 11 * 5
        return this.createBarsAndInterpreter(barWidthFromSpacing, barStartX, bottomOfBar, scaleY, item, index)
      })
    }

    return (
      <Svg {...{ width, height }}>
        <Defs>
          {renderFillGradient({ id: 'gradient' })}
          {renderSelectedFillGradient({ id: 'selectedGradient' })}
        </Defs>
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
          axisWidth={axisWidth}
          axisHeight={axisHeight}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          barSpacing={barSpacing}
          barWidth={barWidth}
          {...xAxisProps}
        />
        {paths.length > 0 && paths.map(path => path)}
      </Svg >
    )
  }
}

export default BarChart

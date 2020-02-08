import React, { Component } from 'react'
import { View, StyleSheet, Animated, TextInput, TouchableWithoutFeedback } from 'react-native'
import { isAndroid, vw } from './utils/platform'
import ToolTip from './components/toolTip/ToolTip'
import { scaleTime, scaleLinear, ScaleTime, ScaleLinear } from 'd3-scale'
import Cursor from './components/Cursor/Cursor'
import BarChart from './components/chartComponents/charts/BarChart'
import {
  defaultBarChartFillGradient, defaultBarChartSelectedFillGradient
} from './components/chartComponents/charts/utils/colors'
import { PanGestureHandler } from 'react-native-gesture-handler'
import {
  ExtendedAnimatedValue, SlideBarChartDefaultProps, SlideBarChartComponentProps, SlideBarChartProps
} from './utils/types'
import { isValidDate, getDataMin, getDataMax } from './utils/range'

type State = {
  x: ExtendedAnimatedValue
  selectedBarNumber?: number
  cursorY: Animated.Value
  toolTipY: Animated.Value
  width: number
  height: number
}

class SlideBarChart extends Component<SlideBarChartComponentProps, State> {

  static defaultProps: SlideBarChartDefaultProps = {
    data: [],
    xScale: 'linear',
    chartPaddingTop: 16,
    paddingTop: 8,
    paddingBottom: 0,
    paddingLeft: 8,
    paddingRight: 8,
    axisWidth: 0,
    axisHeight: 0,
    height: 200,
    width: vw(100),
    alwaysShowIndicator: true,
    barSpacing: 1,
    animated: true,
    renderFillGradient: defaultBarChartFillGradient,
    renderSelectedFillGradient: defaultBarChartSelectedFillGradient,
    shouldCancelWhenOutside: true,
    throttleAndroid: false,
  }

  cursor = React.createRef<Cursor>()
  label = React.createRef<TextInput>()
  toolTip = React.createRef<ToolTip>()
  scaleX: ScaleTime<number, number> | ScaleLinear<number, number> = scaleLinear().domain([0, 1]).range([0, 1])
  scaleY: ScaleLinear<number, number> = scaleLinear().domain([0, 1]).range([0, 1])
  line: string | null = null
  chartWidth = this.props.width - this.props.axisWidth - this.props.paddingLeft - this.props.paddingRight
  mounted = false
  nextValue = this.chartWidth / 2
  next: any
  selectedBarNumber = 0
  previousSelectedBarNumber = 0
  previousData = [...this.props.data]
  previousYRange = this.props.yRange ?
    [this.props.yRange[0], this.props.yRange[1]] :
    [
      getDataMin(this.props.data),
      getDataMax(this.props.data)
    ]
  yRange: [number, number] = [
    getDataMin(this.props.data),
    getDataMax(this.props.data)
  ]

  state: State = {
    x: new Animated.Value(0) as ExtendedAnimatedValue,
    selectedBarNumber: undefined,
    cursorY: new Animated.Value(0),
    toolTipY: new Animated.Value(1),
    width: this.props.width,
    height: this.props.height,
  }

  // Function to get x position
  getX(
    selectedBarNumber: number, numberOfBars: number, barWidthForToolTip: number,
    barSpacingForToolTip: number, axisWidth: number, paddingLeft: number
  ): number {
    return numberOfBars > 1 ?
      (selectedBarNumber * barWidthForToolTip) + (selectedBarNumber * barSpacingForToolTip) +
      (barWidthForToolTip / 2) + axisWidth + paddingLeft :
      barSpacingForToolTip + (barWidthForToolTip / 2) + axisWidth + paddingLeft
  }

  // If the indicator should only appear when touched this toggles the opacity
  showIndicator(opacity: number): void {
    if (!this.props.alwaysShowIndicator) {
      if (this.toolTip.current != null) {
        this.toolTip.current.setNativeProps({ opacity })
      }
      if (this.props.showIndicatorCallback) {
        this.props.showIndicatorCallback(opacity)
      }

      // If the cursor is set back to 0 opacity then the selected bar should be de-selected
      if (opacity === 0) {
        this.setState({ selectedBarNumber: undefined })
      }
    }
  }

  // Animates the initial rendering of the chart vertically
  animateChart = (value: number) => {
    const {
      axisWidth,
      yRange,
      data,
      barWidth,
      barSpacing,
      toolTipProps,
      paddingLeft,
    } = this.props
    const yRangeCalculated = yRange ? yRange : this.yRange
    const width = toolTipProps?.width
    const toolTipTextRenderers = toolTipProps?.toolTipTextRenderers || []
    const numberOfBars = data.length > 0 ? data.length : 1
    const barWidthForToolTip = barWidth ??
      (this.chartWidth - (numberOfBars - 1) * barSpacing) / numberOfBars
    const barSpacingForToolTip = barWidth ?
      (this.chartWidth - (barWidth * numberOfBars)) / (numberOfBars > 1 ? numberOfBars - 1 : 2) :
      barSpacing
    const x = this.getX(
      this.selectedBarNumber,
      numberOfBars,
      barWidthForToolTip,
      barSpacingForToolTip,
      axisWidth,
      paddingLeft
    )
    const y = this.scaleY(data[this.selectedBarNumber]?.y ?? 0)

    // Move the tool tip upward when it mounts alongside the chart
    if (this.toolTip.current != null) {
      const realPercentage = (x - axisWidth - paddingLeft) / this.chartWidth
      this.toolTip.current.setNativeToolTipPositionProps(
        ((1 - value) * this.scaleY(yRangeCalculated[0])) + (y * value),
        x,
        0,
        realPercentage,
        4
      )
      this.toolTip.current.setNativeTriangleXPositionProps(realPercentage)

      // Only animate the text if the width is fixed as otherwise
      // it creates some jumpiness on re-layouts
      if (width != null) {
        for (let i = 0; i < toolTipTextRenderers.length; i++) {
          this.toolTip.current.setNativeTextProps(i, toolTipTextRenderers[i]({
            x,
            y: ((1 - value) * this.scaleY(yRangeCalculated[0])) + (y * value),
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            selectedBarNumber: this.selectedBarNumber
          }))
        }
      }
    }
  }

  // Animates the re-rendering of the chart vertically only
  animateChartReRender = (value: number) => {
    const { height, paddingTop, axisHeight, paddingBottom, chartPaddingTop } = this.props
    const scaleY = scaleLinear()
      .domain([this.previousYRange[0], this.previousYRange[1]])
      .range([height - axisHeight - paddingBottom, paddingTop + chartPaddingTop])
    const y = scaleY(this.previousData[this.previousSelectedBarNumber]?.y ?? 0)

    // Move the tool tip vertically
    if (this.toolTip.current != null) {
      this.toolTip.current.setNativeToolTipPositionPropY(
        ((1 - value) * this.scaleY(this.previousYRange[0])) + (y * value),
        0,
        4
      )
    }
  }

  // To prevent jumping around before the animation kicks in we initially
  // reset all the initial values to 0 in the Y-axis
  setChartToZero = () => {
    const {
      axisWidth,
      yRange,
      barWidth,
      barSpacing,
      data,
      toolTipProps,
      alwaysShowIndicator,
      paddingLeft,
    } = this.props
    const yRangeCalculated = yRange ? yRange : this.yRange
    const width = toolTipProps?.width
    const toolTipTextRenderers = toolTipProps?.toolTipTextRenderers || []
    if (this.toolTip.current != null) {
      const numberOfBars = data.length > 0 ? data.length : 1
      const barWidthForToolTip = barWidth ??
        (this.chartWidth - (numberOfBars - 1) * barSpacing) / numberOfBars
      const barSpacingForToolTip = barWidth ?
        (this.chartWidth - (barWidth * numberOfBars)) / (numberOfBars > 1 ? numberOfBars - 1 : 2) :
        barSpacing
      const barWidthSize = this.chartWidth / numberOfBars
      const xInput = this.chartWidth / 2

      // Set selected bar at 50% of chart width
      this.selectedBarNumber = Math.floor(xInput / barWidthSize) > 0 ?
        Math.floor(xInput / barWidthSize) < numberOfBars - 1 ?
          Math.floor(xInput / barWidthSize) :
          numberOfBars - 1 :
        0
      this.setState({ selectedBarNumber: alwaysShowIndicator ? this.selectedBarNumber : undefined })

      // Get the proper x and percentage of the chart to position the toolTip in its starting position
      const x = this.getX(
        this.selectedBarNumber,
        numberOfBars,
        barWidthForToolTip,
        barSpacingForToolTip,
        axisWidth,
        paddingLeft
      )
      const realPercentage = (x - axisWidth - paddingLeft) / this.chartWidth
      this.toolTip.current.setNativeToolTipPositionProps(this.scaleY(yRangeCalculated[0]), x, 0, realPercentage, 4)
      this.toolTip.current.setNativeTriangleXPositionProps(realPercentage)
      for (let i = 0; i < toolTipTextRenderers.length; i++) {

        /**
         * The initial animation is a bit jumpy if we are adjusting the text width,
         * width of the toolTip and absolute location of the toolTip all at once
         * so if the toolTip width is not fixed we set the initial text data to the
         * data at point X and don't animate the data upward on the initial animation from 0
         */
        if (width != null) {
          this.toolTip.current.setNativeTextProps(i, toolTipTextRenderers[i]({
            x,
            y: this.scaleY(yRangeCalculated[0]),
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            selectedBarNumber: this.selectedBarNumber
          }))
        } else {
          this.toolTip.current.setNativeTextProps(i, toolTipTextRenderers[i]({
            x,
            y: this.scaleY(data[this.selectedBarNumber]?.y ?? 0),
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            selectedBarNumber: this.selectedBarNumber
          }))
        }
      }
    }
  }

  /**
   * Android sampling of the listener cannot be throttled like it can on iOS,
   * so we throttle the events here to prevent too many calls being sent across
   * the bridge which we have seen to cause lag on slow Android devices
   */
  moveCursorBinary(value: number, isTouch = false) {
    if (this.props.throttleAndroid && isAndroid()) {
      this.nextValue = value
      if (this.next) { return }
      this.next = setTimeout(() => {
        this.moveCursorBinaryCore(this.nextValue, isTouch)
      }, 10)
    } else {
      this.moveCursorBinaryCore(value, isTouch)
    }
  }

  moveCursorBinaryCore(value: number, isTouch: boolean) {
    if (!this.mounted) {
      this.mounted = true

      if (isAndroid()) {
        this.next = undefined
        return
      }
    }
    const {
      data,
      axisWidth,
      toolTipProps,
      callbackWithX,
      callbackWithY,
      barWidth,
      barSpacing,
      paddingLeft,
      selectionChangedCallback,
    } = this.props
    const numberOfBars = data.length > 0 ? data.length : 1
    const barWidthSize = this.chartWidth / numberOfBars
    const xInput = value
    this.selectedBarNumber = Math.floor(xInput / barWidthSize) > 0 ?
      Math.floor(xInput / barWidthSize) < numberOfBars - 1 ?
        Math.floor(xInput / barWidthSize) :
        numberOfBars - 1 :
      0

    // No need to move anything if the bar hasn't changed
    if (this.selectedBarNumber === this.state.selectedBarNumber) {
      this.showIndicator(1)
      this.next = undefined
      return
    }
    if (isTouch && selectionChangedCallback) {
      selectionChangedCallback(this.selectedBarNumber)
    }
    this.setState({ selectedBarNumber: this.selectedBarNumber })
    const barWidthForToolTip = barWidth ??
      (this.chartWidth - (numberOfBars - 1) * barSpacing) / numberOfBars
    const barSpacingForToolTip = barWidth ?
      (this.chartWidth - (barWidth * numberOfBars)) / (numberOfBars > 1 ? numberOfBars - 1 : 2) :
      barSpacing
    const x = this.getX(
      this.selectedBarNumber,
      numberOfBars,
      barWidthForToolTip,
      barSpacingForToolTip,
      axisWidth,
      paddingLeft
    )
    const y = this.scaleY(data[this.selectedBarNumber]?.y ?? 0)
    if (this.toolTip.current != null) {
      const realPercentage = (x - axisWidth - paddingLeft) / this.chartWidth
      this.toolTip.current.setNativeToolTipPositionProps(y, x, 0, realPercentage, 4)
      this.toolTip.current.setNativeTriangleXPositionProps(realPercentage)
      const toolTipTextRenderers = toolTipProps?.toolTipTextRenderers || []
      for (let i = 0; i < toolTipTextRenderers.length; i++) {
        this.toolTip.current.setNativeTextProps(i, toolTipTextRenderers[i]({
          x,
          y,
          scaleX: this.scaleX,
          scaleY: this.scaleY,
          selectedBarNumber: this.selectedBarNumber
        }))
      }
    }

    // Callbacks with the given X and Y coordinates can be used for custom functionality
    if (callbackWithX) { callbackWithX(this.scaleX.invert(x)) }
    if (callbackWithY) { callbackWithY(this.scaleY.invert(y)) }

    this.showIndicator(1)

    // next is reset so the Android throttle works
    this.next = undefined
  }

  renderTouchable() {
    const { onPress, axisWidth, shouldCancelWhenOutside, paddingLeft, paddingRight, scrollable } = this.props
    const { x } = this.state

    /**
     * If onPress is provided the chart likely will not have a cursor shown (provided by props)
     * and therefore it makes more sense to allow the chart to be clicked than scrolled
     */
    if (onPress) {
      return (
        <TouchableWithoutFeedback
          onPress={onPress}
          style={[
            { marginLeft: axisWidth + paddingLeft, marginRight: paddingRight },
            StyleSheet.absoluteFill
          ]}
        >
          <View
            style={[{ backgroundColor: '#FFFFFF00' }, StyleSheet.absoluteFill]}
          />
        </TouchableWithoutFeedback>
      )
    }

    return (
      <View
        style={[
          { marginLeft: axisWidth + paddingLeft, marginRight: paddingRight },
          StyleSheet.absoluteFill
        ]}
      >
        <PanGestureHandler
          shouldCancelWhenOutside={shouldCancelWhenOutside}
          minPointers={0}
          activeOffsetX={[-3, 3]}
          failOffsetY={scrollable ? [-6, 6] : undefined}
          onGestureEvent={Animated.event([{ nativeEvent: { x } }], { useNativeDriver: true })}

          /**
           * nativeEvent.state enum
           * 
           * UNDETERMINED = 0
           * FAILED
           * BEGAN
           * CANCELLED
           * ACTIVE
           * END
           */
          onHandlerStateChange={evt => {
            if (
              evt.nativeEvent.state === 1 ||
              evt.nativeEvent.state === 3 ||
              evt.nativeEvent.state === 5
            ) {
              this.showIndicator(0)
            } else if (evt.nativeEvent.state === 2) {
              this.showIndicator(1)
            }
          }}
        >
          <Animated.View
            onMoveShouldSetResponder={() => false}
            onResponderTerminationRequest={() => {

              // Set the indicator to 0 here instead of on termination so the
              // bars don't flash when the touch is taken by the PanGestureHandler
              this.showIndicator(0)
              return true
            }}
            onStartShouldSetResponder={() => true}
            onResponderRelease={() => this.showIndicator(0)}
            onResponderGrant={evt => {
              const touchLocation = evt.nativeEvent.pageX - axisWidth - paddingLeft
              const xToNumber = this.state.x.__getValue?.()
              if (xToNumber?.toFixed(2) === touchLocation.toFixed(2)) {
                this.showIndicator(1)
              }
              this.moveCursorBinary(touchLocation, true)
            }}
            style={[{ backgroundColor: '#FFFFFF00' }, StyleSheet.absoluteFill]}
          />
        </PanGestureHandler>
      </View>
    )
  }

  componentDidMount() {
    const {
      axisWidth,
      alwaysShowIndicator,
      callbackWithX,
      callbackWithY,
      data,
      barWidth,
      barSpacing,
      animated,
      paddingLeft,
    } = this.props

    if (alwaysShowIndicator) {
      this.moveCursorBinary(this.chartWidth / 2)
    }

    /**
     * Set the indicator to hidden here for initial movements and it
     * will not appear again until touched unless it is set to always be visible
     */
    this.showIndicator(0)

    // This is used when re-rendering and animating to push
    // the chart down with old data still used to determine Y
    this.state.toolTipY.addListener(({ value }) => this.animateChartReRender(value))

    // This will flatten the Y axis of the chart for
    // animation and set the toolTip X to the middle point
    this.state.cursorY.addListener(({ value }) => this.animateChart(value))
    if (animated) {
      this.setChartToZero()
    } else {
      this.state.cursorY.setValue(1)
    }
    setTimeout(() => {
      if (isAndroid()) {

        // Run callback on mount as we are skipping the initial Android movement to the position
        // due to it not being mounted at the proper time as noted above
        const numberOfBars = data.length > 0 ? data.length : 1
        const barWidthForToolTip = barWidth ??
          (this.chartWidth - (numberOfBars - 1) * barSpacing) / numberOfBars
        const barSpacingForToolTip = barWidth ?
          (this.chartWidth - (barWidth * numberOfBars)) / (numberOfBars > 1 ? numberOfBars - 1 : 2) :
          barSpacing
        const x = this.getX(
          this.selectedBarNumber,
          numberOfBars,
          barWidthForToolTip,
          barSpacingForToolTip,
          axisWidth,
          paddingLeft
        )
        if (callbackWithX) { callbackWithX(this.scaleX.invert(x)) }
        const y = this.scaleY(data[this.selectedBarNumber]?.y ?? 0)
        if (callbackWithY) { callbackWithY(this.scaleY.invert(y)) }
      }

      if (animated) {
        Animated.timing(
          this.state.cursorY,
          { toValue: 1, duration: 250, useNativeDriver: true }
        ).start(() =>
          this.state.x.addListener(({ value }) => {
            this.moveCursorBinary(value, true)
          })
        )
      } else {
        this.state.x.addListener(({ value }) => { this.moveCursorBinary(value, true) })
      }
    }, 500)
  }

  shouldComponentUpdate(nextProps: SlideBarChartProps) {

    // Update fallback yRange
    this.yRange = [
      getDataMin(nextProps.data || []),
      getDataMax(nextProps.data || [])
    ]
    return true
  }

  componentDidUpdate(prevProps: SlideBarChartComponentProps) {
    const { alwaysShowIndicator, data, animated, width, height } = this.props

    const previousYRangeCalculated = prevProps.yRange ? prevProps.yRange :
      [
        getDataMin(prevProps.data),
        getDataMax(prevProps.data)
      ]

    // Set all the old values needed for the down animation
    this.previousYRange = [previousYRangeCalculated[0], previousYRangeCalculated[1]]
    this.previousData = [...prevProps.data]
    this.previousSelectedBarNumber = this.selectedBarNumber

    // If width or height change we wait to update the chart dimensions with the down animation
    if (prevProps.width !== width) {
      setTimeout(() => {
        this.setState({ width })
      }, 250)
    }
    if (prevProps.height !== height) {
      setTimeout(() => {
        this.setState({ height })
      }, 250)
    }

    if (
      prevProps.data.length !== data.length
      || JSON.stringify(prevProps.data) !== JSON.stringify(data)
      || width !== prevProps.width
      || height !== prevProps.height
    ) {
      if (animated) {

        // If the chart is not currently zeroed out
        if (prevProps.data.filter(dataObject => dataObject.y !== 0).length > 0) {

          // Set old values to 100%, this should not change the position
          this.state.toolTipY.setValue(1)

          // Animate the tool tip down
          Animated.timing(
            this.state.toolTipY,
            { toValue: 0, duration: 250, useNativeDriver: true }
          ).start(() => {
            this.moveCursorBinary(this.chartWidth / 2)
            this.setChartToZero()
            this.state.cursorY.setValue(0)

            // If the next values aren't zeroed animate the tool tip up
            if (data.filter(dataObject => dataObject.y !== 0).length > 0) {
              Animated.timing(
                this.state.cursorY,
                { toValue: 1, duration: 250, useNativeDriver: true }
              ).start()
            }
          })
        } else {

          /**
           * To get to this block the previous data must have been
           * zeroed and the new data must be non zero, therefore we only
           * animate the toolTip back upward, the same logic is used in the chart
           */
          this.moveCursorBinary(this.chartWidth / 2)
          this.setChartToZero()
          Animated.timing(
            this.state.toolTipY,
            { toValue: 0, duration: 250, useNativeDriver: true, }
          ).stop()
          Animated.timing(
            this.state.cursorY,
            { toValue: 1, duration: 250, useNativeDriver: true }
          ).start()
        }
      } else {
        if (alwaysShowIndicator) {
          this.moveCursorBinary(this.chartWidth / 2)
        }
        this.state.cursorY.setValue(1)
      }
    }
  }

  render() {
    const {
      style,
      yRange,
      xRange,
      xScale,
      data,
      yAxisProps,
      xAxisProps,
      paddingTop,
      axisWidth,
      height,
      width,
      renderFillGradient,
      axisHeight,
      barSpacing,
      barWidth,
      renderSelectedFillGradient,
      fillColor,
      animated,
      toolTipProps,
      paddingBottom,
      paddingLeft,
      paddingRight,
      chartPaddingTop,
      hideSelection,
      onPress,
      barSelectedColor,
    } = this.props

    this.chartWidth = width - axisWidth - paddingLeft - paddingRight

    const yRangeCalculated = yRange ? yRange : this.yRange
    const xRangeCalculated = xRange ? xRange : [(data[0]?.x ?? 0), (data[data.length - 1]?.x ?? 1)]
    const xCalculatedScale = xScale ? xScale :
      isValidDate((data[0]?.x ?? 0)) ? 'time' : 'linear'
    this.scaleX = xCalculatedScale === 'linear' ?
      scaleLinear()
        .domain([xRangeCalculated[0], xRangeCalculated[1]])
        .range([axisWidth + paddingLeft, width - paddingRight]) :
      scaleTime()
        .domain([xRangeCalculated[0], xRangeCalculated[1]])
        .range([axisWidth + paddingLeft, width - paddingRight])
    this.scaleY = scaleLinear()
      .domain([yRangeCalculated[0], yRangeCalculated[1]])
      .range([height - axisHeight - paddingBottom, paddingTop + chartPaddingTop])

    return (
      <View style={[
        styles.container,
        style,
        {
          height: this.state.height,
          width: this.state.width,
          paddingHorizontal: 0,
          paddingVertical: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }
      ]}>
        <BarChart
          data={data}
          width={width}
          height={height}
          scaleY={this.scaleY}
          yRange={yRangeCalculated}
          scaleX={this.scaleX}
          axisWidth={axisWidth}
          axisHeight={axisHeight}
          renderFillGradient={renderFillGradient}
          renderSelectedFillGradient={renderSelectedFillGradient}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          paddingTop={paddingTop}
          paddingBottom={paddingBottom}
          barSelectedIndex={this.state.selectedBarNumber}
          barWidth={barWidth}
          barSpacing={barSpacing}
          fillColor={fillColor}
          hideSelection={!!onPress || hideSelection}
          barSelectedColor={barSelectedColor}
          animated={animated}
          yAxisProps={yAxisProps}
          xAxisProps={xAxisProps}
        />
        {!onPress && <ToolTip
          ref={this.toolTip}
          {...toolTipProps}
        />}
        {this.renderTouchable()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    backgroundColor: '#fff',
  },
})

export default SlideBarChart

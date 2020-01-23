import React, { Component } from 'react'
import {
  View, StyleSheet, Animated, TextInput, TouchableWithoutFeedback, Platform
} from 'react-native'
import * as shape from 'd3-shape'
import * as path from 'svg-path-properties'
import { PanGestureHandler } from 'react-native-gesture-handler'
import ToolTip from './components/toolTip/ToolTip'
import { scaleTime, scaleLinear, ScaleTime, ScaleLinear } from 'd3-scale'
import Cursor from './components/cursor/Cursor'
import AreaChart from './components/chartComponents/charts/AreaChart'
import { defaultAreaChartFillGradient } from './components/chartComponents/charts/utils/colors'
import SVGPathYFromX from './utils/SVGPathYFromX'
import { isAndroid, vw } from './utils/platform'
import { interpolatePath } from 'd3-interpolate-path'
import { ExtendedAnimatedValue, SlideAreaChartComponentProps, SlideAreaChartDefaultProps, SlideAreaChartProps } from './utils/types'
import { isValidDate, getDataMin, getDataMax } from './utils/range'

type State = {
  x: ExtendedAnimatedValue
  cursorY: Animated.Value,
}

class SlideAreaChart extends Component<SlideAreaChartComponentProps, State> {

  static defaultProps: SlideAreaChartDefaultProps = {
    data: [],
    xScale: 'linear',
    cursorProps: {
      cursorMarkerHeight: 24,
      cursorMarkerWidth: 24,
      cursorWidth: 2,
    },
    renderFillGradient: defaultAreaChartFillGradient,
    chartLineColor: '#0081EB',
    chartLineWidth: 3,
    chartPaddingTop: 16,
    paddingTop: 8,
    paddingBottom: 0,
    paddingLeft: 8,
    paddingRight: 8,
    axisWidth: 0,
    axisHeight: 0,
    height: 200,
    width: vw(100),
    curveType: shape.curveMonotoneX,
    alwaysShowIndicator: true,
    animated: true,
    shouldCancelWhenOutside: true,
    throttleAndroid: false,
  }

  cursor = React.createRef<Cursor>()
  label = React.createRef<TextInput>()
  toolTip = React.createRef<ToolTip>()
  graph = React.createRef<AreaChart>()
  scaleX: ScaleTime<number, number> | ScaleLinear<number, number> = scaleLinear().domain([0, 1]).range([0, 1])
  scaleY: ScaleLinear<number, number> = scaleLinear().domain([0, 1]).range([0, 1])
  line: string = ''
  startLine: string = ''
  properties: path.SvgPathProperties = path.svgPathProperties('')
  previousProperties: path.SvgPathProperties = path.svgPathProperties('')
  graphWidth: number = vw(100)
  mounted = false
  nextValue: number = vw(100) / 2
  next: any = undefined
  isAnimating: boolean = true
  yRange: [number, number] = [
    getDataMin(this.props.data),
    getDataMax(this.props.data)
  ]

  state: State = {
    x: new Animated.Value(
      (this.props.width - this.props.axisWidth - this.props.paddingLeft - this.props.paddingRight) / 2
    ) as ExtendedAnimatedValue,
    cursorY: new Animated.Value(0)
  }

  // Function to determine X range if not given
  calculateXRange = () => {
    const { xRange, data } = this.props
    return xRange ?
      xRange :
      data.length > 1 ?
        [(data[0]?.x ?? 0), (data[data.length - 1]?.x ?? 1)] :
        [(data[0]?.x ?? 0), (Number(data[0]?.x ?? 0) + 1)]
  }

  // Function to determine Y range if not given
  calculateYRange = () => {
    const { yRange } = this.props
    return yRange ? yRange : this.yRange
  }

  // Function to determine data for line
  calculateDataToArray = (): Array<[number, number]> => {
    const { data } = this.props

    const yRangeCalculated = this.calculateYRange()
    const xRangeCalculated = this.calculateXRange()

    return data.length > 1 ?
      data.map((obj): [number, number] => [Number(obj.x), obj.y]) :
      data.length > 0 ?
        data.reduce((arr: Array<[number, number]>, obj) => {
          return arr.concat([[Number(xRangeCalculated[0]), obj.y], [Number(xRangeCalculated[1]), obj.y]])
        }, []) :
        [[Number(xRangeCalculated[0]), yRangeCalculated[0]], [Number(xRangeCalculated[1]), yRangeCalculated[0]]]
  }

  // Determines the line for the graph
  calculateLine = () => {
    return shape
      .line()
      .x(d => this.scaleX(d[0]))
      .y(d => this.scaleY(d[1]))
      .curve(this.props.curveType)(this.calculateDataToArray()) ||
      ''
  }

  // Determines the start line for the graph
  calculateStartLine = () => {
    const yRangeCalculated = this.calculateYRange()
    return shape
      .line()
      .x(d => this.scaleX(d[0]))
      .y(this.scaleY(yRangeCalculated[0]))
      .curve(this.props.curveType)(this.calculateDataToArray()) ||
      ''
  }

  // If the indicator should only appear when touched this toggles the opacity
  showIndicator(opacity: number) {
    if (!this.props.alwaysShowIndicator) {
      if (this.cursor.current != null) {
        this.cursor.current.setNativeCursorIndicatorProps({ opacity })
        this.cursor.current.setNativeCursorLineProps({ opacity })
      }
      if (this.toolTip.current != null) {
        this.toolTip.current.setNativeProps({ opacity })
      }
      if (this.props.showIndicatorCallback) {
        this.props.showIndicatorCallback(opacity)
      }
    }
  }

  // Animates the initial rendering of the graph vertically
  animateGraph = (value: number) => {
    const { axisWidth, cursorProps, toolTipProps, paddingLeft } = this.props
    const toolTipTextRenderers = toolTipProps?.toolTipTextRenderers || []
    const cursorMarkerHeight = cursorProps.cursorMarkerHeight
    const cursorMarkerWidth = cursorProps.cursorMarkerWidth
    const cursorLineWidth = cursorProps.cursorWidth
    const yRangeCalculated = this.calculateYRange()

    // If graph shrinks animate X as well
    const stateX = this.state.x.__getValue?.()
    let x = this.graphWidth / 2 + axisWidth + paddingLeft
    let oldX: number | undefined = undefined
    if (stateX != null) {
      x = stateX + axisWidth + paddingLeft
      if (stateX > this.graphWidth) {
        oldX = stateX
        x = this.graphWidth + axisWidth + paddingLeft
      } else if (stateX < axisWidth + paddingLeft) {
        oldX = stateX
        x = axisWidth + paddingLeft
      }
    }

    const startY = SVGPathYFromX(this.previousProperties, x)
    const y = SVGPathYFromX(this.properties, x)

    /**
     * Create an interpolator between a flat line and our graph line and use that for the animation
     * additionally the tool tip and cursor are also started at zero and moved upward with the animation
     */
    const interpolator = interpolatePath(this.startLine, this.line, null)
    if (this.cursor.current != null) {
      this.cursor.current.setNativeCursorIndicatorProps({
        top: ((1 - value) * startY) - cursorMarkerHeight / 2 + (y * value),
        left: oldX != null ?
          ((1 - value) * oldX) - cursorMarkerWidth / 2 + (x * value) :
          x - cursorMarkerWidth / 2
      })
      this.cursor.current.setNativeCursorLineProps({
        top: ((1 - value) * startY) + (y * value),
        height: this.scaleY(yRangeCalculated[0]) - (((1 - value) * startY) + (y * value)),
        left: oldX != null ?
          ((1 - value) * oldX) - cursorLineWidth / 2 + (x * value) :
          x - cursorLineWidth / 2
      })
    }
    const toolTipX = oldX != null ?
      ((1 - value) * oldX) + (x * value) :
      x
    if (this.toolTip.current != null) {
      const realPercentage = (x - axisWidth - paddingLeft) / this.graphWidth
      this.toolTip.current.setNativeToolTipPositionProps(
        ((1 - value) * startY) + (y * value),
        toolTipX,
        cursorMarkerHeight,
        realPercentage
      )
      this.toolTip.current.setNativeTriangleXPositionProps(realPercentage)
      for (let i = 0; i < toolTipTextRenderers.length; i++) {
        this.toolTip.current.setNativeTextProps(
          i,
          toolTipTextRenderers[i]({
            x: toolTipX,
            y: ((1 - value) * startY) + (y * value),
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            selectedBarNumber: 0,
          }))
      }
    }
    if (this.graph.current != null) {
      const nextLine = interpolator(value)
      this.graph.current.setNativeLineProps(nextLine)
    }
  }

  // To prevent jumping around before the animation kicks in we initially reset all the initial values to 0 in the Y-axis
  setGraphToZero = () => {
    const { axisWidth, cursorProps, toolTipProps, paddingLeft } = this.props
    const toolTipTextRenderers = toolTipProps?.toolTipTextRenderers || []
    const cursorMarkerHeight = cursorProps.cursorMarkerHeight
    const cursorMarkerWidth = cursorProps.cursorMarkerWidth
    const cursorLineWidth = cursorProps.cursorWidth
    const yRangeCalculated = this.calculateYRange()

    if (this.cursor.current != null && this.toolTip.current != null && this.graph.current != null) {
      const x = (this.graphWidth / 2) + axisWidth + paddingLeft
      const realPercentage = (x - axisWidth - paddingLeft) / this.graphWidth
      this.cursor.current.setNativeCursorIndicatorProps({
        top: this.scaleY(yRangeCalculated[0]) - cursorMarkerHeight / 2,
        left: x - cursorMarkerWidth / 2
      })
      this.cursor.current.setNativeCursorLineProps({
        top: this.scaleY(yRangeCalculated[0]),
        height: 0,
        left: x - cursorLineWidth / 2
      })
      this.toolTip.current.setNativeToolTipPositionProps(
        this.scaleY(yRangeCalculated[0]),
        x,
        cursorMarkerHeight,
        realPercentage
      )
      this.toolTip.current.setNativeTriangleXPositionProps(realPercentage)
      for (let i = 0; i < toolTipTextRenderers.length; i++) {
        this.toolTip.current.setNativeTextProps(i, toolTipTextRenderers[i]({
          x,
          y: this.scaleY(yRangeCalculated[0]),
          scaleX: this.scaleX,
          scaleY: this.scaleY,
          selectedBarNumber: 0,
        }))
      }
      this.graph.current.setNativeLineProps(this.startLine)
    }
  }

  /**
   * Android sampling of the listener cannot be throttled like it can on iOS, so we throttle the events here
   * to prevent too many calls being sent across the bridge which we have seen to cause lag on slow Android devices
   */
  moveCursorBinary(value: number) {
    if (this.props.throttleAndroid && isAndroid()) {
      this.nextValue = value
      if (this.next) { return }
      this.next = setTimeout(() => {
        this.moveCursorBinaryCore(this.nextValue)
      }, 10)
    } else {
      this.moveCursorBinaryCore(value)
    }
  }

  moveCursorBinaryCore(value: number) {
    if (!this.mounted) {
      this.mounted = true

      if (isAndroid()) {
        this.next = undefined
        return
      }
    }
    const {
      cursorProps, axisWidth, toolTipProps, callbackWithX, callbackWithY, paddingLeft,
    } = this.props

    const toolTipTextRenderers = toolTipProps?.toolTipTextRenderers || []
    const cursorMarkerHeight = cursorProps.cursorMarkerHeight
    const cursorMarkerWidth = cursorProps.cursorMarkerWidth
    const cursorLineWidth = cursorProps.cursorWidth
    const yRangeCalculated = this.calculateYRange()

    if (value < 0) {
      value = 0
    } else if (value > this.graphWidth) {
      value = this.graphWidth
    }
    const x = value + axisWidth + paddingLeft

    // A binary search is used to get the Y value for a given X
    const y = SVGPathYFromX(this.properties, x)

    /**
     * The cursor, line, and toolTip are set to their appropriate positions based on the X and Y coordinates
     * of the line. The scales, margins, and sizes of elements must be supplied to ensure these locations are correct
     */
    if (this.cursor.current != null) {
      this.cursor.current.setNativeCursorIndicatorProps({
        top: y - cursorMarkerHeight / 2,
        left: x - cursorMarkerWidth / 2
      })
      this.cursor.current.setNativeCursorLineProps({
        top: y,
        left: x - cursorLineWidth / 2,
        height: this.scaleY(yRangeCalculated[0]) - y
      })
    }
    if (this.toolTip.current != null) {
      const realPercentage = (x - axisWidth - paddingLeft) / this.graphWidth
      this.toolTip.current.setNativeToolTipPositionProps(y, x, cursorMarkerHeight, realPercentage)
      this.toolTip.current.setNativeTriangleXPositionProps(realPercentage)
      for (let i = 0; i < toolTipTextRenderers.length; i++) {
        this.toolTip.current.setNativeTextProps(
          i,
          toolTipTextRenderers[i]({
            x,
            y,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            selectedBarNumber: 0,
          })
        )
      }
    }

    /**
     * Callbacks with the given X and Y coordinates can be used for custom functionality
     * such as moving a dot across a path on a map to represent a trip in action
     */
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
     * If onPress is provided the graph likely will not have a cursor shown (provided by props)
     * and therefore it makes more sense to allow the graph to be clicked than panned
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
          {
            marginLeft: axisWidth + paddingLeft,
            marginRight: paddingRight,
            ...Platform.select({ ios: {}, android: { elevation: 10 } })
          },
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
            if (evt.nativeEvent.state === 1 || evt.nativeEvent.state === 3 || evt.nativeEvent.state === 5) {
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
              // indicator doesn't flash when the touch is taken by the PanGestureHandler
              this.showIndicator(0)
              return true
            }}
            onStartShouldSetResponder={() => !this.isAnimating}
            onResponderRelease={() => this.showIndicator(0)}
            onResponderGrant={evt => {
              const touchLocation = evt.nativeEvent.pageX - axisWidth - paddingLeft
              const xToNumber = this.state.x.__getValue?.()
              if (xToNumber?.toFixed(2) === touchLocation.toFixed(2)) {
                this.showIndicator(1)
              }
              this.state.x.setValue(touchLocation)
              this.moveCursorBinary(touchLocation)
            }}
            style={[{ backgroundColor: '#FFFFFF00' }, StyleSheet.absoluteFill]}
          />
        </PanGestureHandler>
      </View>
    )
  }

  componentDidMount() {
    const {
      axisWidth, alwaysShowIndicator, callbackWithX, callbackWithY, animated, paddingLeft,
    } = this.props

    this.startLine = this.calculateStartLine()
    this.line = this.calculateLine()

    this.previousProperties = path.svgPathProperties(this.startLine)
    this.properties = path.svgPathProperties(this.line)

    if (alwaysShowIndicator) {
      this.moveCursorBinary(this.graphWidth / 2)
    }

    /**
     * Set the indicator to hidden here for initial movements and it will not appear again until touched
     * unless it is set to always be visible
     */
    this.showIndicator(0)

    // Only add the animation listener and flatten the chart if animated
    if (animated) {

      // Add the cursorY listener that is only used for the initial Y-axis animation on mount
      this.state.cursorY.addListener(({ value }) => this.animateGraph(value))

      // This will flatten the Y axis of the graph for animation and set the cursor X to the middle point
      this.setGraphToZero()
    }

    setTimeout(() => {

      /**
       * Run callback on mount as we are skipping the initial Android movement to the position
       * due to it not being mounted at the proper time as noted above
       */
      if (isAndroid()) {
        const x = (this.graphWidth / 2) + axisWidth + paddingLeft

        if (callbackWithX) { callbackWithX(this.scaleX.invert(x)) }
        const y = SVGPathYFromX(this.properties, x)
        if (callbackWithY) { callbackWithY(this.scaleY.invert(y)) }
      }

      // Run animation and on complete add the touch listener to prevent interrupting the animation
      if (animated) {
        Animated.spring(this.state.cursorY, { toValue: 1, friction: 7, useNativeDriver: true, }).start(() => {
          this.state.x.addListener(({ value }) => { this.moveCursorBinary(value) })
        })
      } else {

        // If we aren't animating the graph run the animate graph function at 1 to move 
        // the graph to the first position completely including any toolTip height calculations
        this.animateGraph(1)
        this.state.x.addListener(({ value }) => { this.moveCursorBinary(value) })
      }

      // Allow clicks on graph
      this.isAnimating = false
    }, 500)
  }

  shouldComponentUpdate(nextProps: SlideAreaChartProps) {

    // Update fallback yRange
    this.yRange = [
      getDataMin(nextProps.data || []),
      getDataMax(nextProps.data || [])
    ]
    return true
  }

  componentDidUpdate() {
    const { animated } = this.props

    // If new props received adjust the line accordingly with animation
    // to prevent jumping we remove the touch listener first
    this.state.x.removeAllListeners()
    this.isAnimating = true

    // Set the start line and start props to previous ones
    this.previousProperties = path.svgPathProperties(this.line)
    this.startLine = this.line

    // If animated reset to 0 here to prepare to animate
    if (animated) { this.state.cursorY.setValue(0) }

    // Create the new line
    this.line = this.calculateLine()
    this.properties = path.svgPathProperties(this.line)

    if (animated) {
      this.state.cursorY.addListener(({ value }) => this.animateGraph(value))
      Animated.spring(this.state.cursorY, { toValue: 1, friction: 7, useNativeDriver: true, }).start(() => {
        this.isAnimating = false
        this.state.x.addListener(({ value }) => { this.moveCursorBinary(value) })
      }
      )
    } else {

      // If we aren't animating the graph run the animate graph function at 1
      // to move the graph to the new position completely
      this.isAnimating = false
      this.animateGraph(1)
      this.state.x.addListener(({ value }) => { this.moveCursorBinary(value) })
    }
  }

  render() {
    const {
      style,
      data,
      xScale,
      chartLineWidth,
      xAxisProps,
      yAxisProps,
      toolTipProps,
      cursorProps,
      paddingTop,
      axisWidth,
      height,
      width,
      fillColor,
      renderFillGradient,
      chartLineColor,
      axisHeight,
      animated,
      paddingBottom,
      paddingLeft,
      paddingRight,
      chartPaddingTop,
      onPress,
    } = this.props

    this.graphWidth = width - axisWidth - paddingLeft - paddingRight

    const yRangeCalculated = this.calculateYRange()
    const xRangeCalculated = this.calculateXRange()
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

    const startLine = animated ?
      this.calculateStartLine() :
      this.calculateLine()

    return (
      <View style={[
        styles.container,
        style,
        {
          height,
          width,
          paddingHorizontal: 0,
          paddingVertical: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }
      ]}>
        <AreaChart
          ref={this.graph}
          data={data}
          width={width}
          height={height}
          line={startLine}
          scaleY={this.scaleY}
          yRange={yRangeCalculated}
          scaleX={this.scaleX}
          axisWidth={axisWidth}
          axisHeight={axisHeight}
          renderFillGradient={renderFillGradient}
          fillColor={fillColor}
          chartLineColor={chartLineColor}
          chartLineWidth={chartLineWidth}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          paddingBottom={paddingBottom}
          paddingTop={paddingTop}
          xAxisProps={xAxisProps}
          yAxisProps={yAxisProps}
        />
        {!onPress && <Cursor
          ref={this.cursor}
          {...cursorProps}
        />}
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

export default SlideAreaChart

import React, { Component } from 'react'
import { StyleSheet, View, Platform, TextInput, Animated, LayoutChangeEvent } from 'react-native'
import { Svg, Polygon } from 'react-native-svg'
import { isAndroid } from '../../utils/platform'
import { ToolTipDefaultProps, ToolTipComponentProps } from './utils/types'

type State = {
  height: number
  width: number
}

class ToolTip extends Component<ToolTipComponentProps, State> {

  static defaultProps: ToolTipDefaultProps = {
    backgroundColor: '#ffffff',
    displayTriangle: true,
    lockTriangleCenter: false,
    displayToolTip: true,
    borderRadius: 2,
    fontSize: 13,
    textStyles: [],
    toolTipTextRenderers: [],
  }

  state: State = {
    height: 0,
    width: 0
  }

  numberOfLines = this.props.toolTipTextRenderers.length
  toolTip = React.createRef<View>()
  triangle = React.createRef<View>()
  textInputs = Array.apply(null, Array(this.numberOfLines)).map(() => React.createRef<TextInput>())
  realPercentage = 0
  toolTipPosition = { x: 0, y: 0, cursorMarkerHeight: 0, standoff: 0 }

  setNativeProps = (nativeProps: Object) => {
    if (this.toolTip.current != null) {
      this.toolTip.current.setNativeProps(nativeProps)
    }
  }

  // Set toolTip X and Y coordinates within the svg
  setNativeToolTipPositionProps = (
    y: number,
    x: number,
    cursorMarkerHeight: number,
    realPercentage: number,
    standoff: number = 10
  ) => {
    this.realPercentage = realPercentage
    this.toolTipPosition = { x, y, cursorMarkerHeight, standoff }
    const { borderRadius } = this.props
    const width = this.props.width ?? this.state.width
    const labelPosition = x - (width / 10) - borderRadius - ((width - (width / 5) - (2 * borderRadius)) * realPercentage)
    if (this.toolTip.current != null) {
      this.toolTip.current.setNativeProps({
        top: y - cursorMarkerHeight / 2 - (this.state.height + width / 5) - standoff,
        left: labelPosition
      })
    }
  }

  // Set toolTip Y position only
  setNativeToolTipPositionPropY = (y: number, cursorMarkerHeight: number, standoff: number = 10) => {
    const width = this.props.width ?? this.state.width
    if (this.toolTip.current != null) {
      this.toolTip.current.setNativeProps({ top: y - cursorMarkerHeight / 2 - (this.state.height + width / 5) - standoff })
    }
  }

  // Set toolTip X position only
  setNativeToolTipPositionPropX = (x: number, realPercentage: number) => {
    const { borderRadius } = this.props
    const width = this.props.width ?? this.state.width
    const labelPosition = x - (width / 10) - borderRadius - ((width - (width / 5) - (2 * borderRadius)) * realPercentage)
    if (this.toolTip.current != null) {
      this.toolTip.current.setNativeProps({ left: labelPosition })
    }
  }

  // Set the position of the triangle below the toolTip based on percent along the toolTip it should be
  setNativeTriangleXPositionProps = (realPercentage: number) => {
    this.realPercentage = realPercentage
    const { borderRadius } = this.props
    const width = this.props.width ?? this.state.width
    if (this.triangle.current != null) {
      this.triangle.current.setNativeProps({ left: (width * 0.8 - (borderRadius * 2)) * realPercentage + borderRadius })
    }
  }

  setNativeTextProps = (id: number, nativeProps: Object) => {
    if (this.textInputs[id] != null && this.textInputs[id].current != null) {
      this.textInputs[id].current.setNativeProps(nativeProps)
    }
  }

  // Create the individual textInputs
  renderTextInputs = () => {
    const { fontSize, textStyles } = this.props
    const width = this.props.width ?? null
    const inputs: JSX.Element[] = []
    for (let i = 0; i < this.numberOfLines; i++) {

      // Added to account for android textInput padding / late rendering
      const baseHeight = (textStyles[i] != null && textStyles[i].fontSize != null) ?
        textStyles[i].fontSize :
        fontSize ? fontSize : 17
      const height = baseHeight ? baseHeight + 5 : 22
      inputs.push(
        <TextInput
          scrollEnabled={false}
          numberOfLines={1}
          key={`input-${i}`}
          ref={this.textInputs[i]}
          editable={false}
          allowFontScaling={false}
          multiline
          style={[
            styles.headerText,
            { fontSize },
            width ? { width } : null,
            textStyles[i],
            styles.textCentering,
            isAndroid() ? { height, paddingTop: 0, paddingBottom: 0 } : null,
          ]}
        />
      )
    }
    return inputs.reverse().map(input => input)
  }

  // Create the triangle below the toolTip if it should be shown
  renderTriangle = () => {
    const { backgroundColor, displayTriangle, lockTriangleCenter } = this.props
    if (!displayTriangle) { return null }

    const width = this.props.width ?? this.state.width
    const trianglePoint = `0,0 ${width / 5},0 ${width / 10},${width / 10}`
    const centerPosition = { left: width / 2 - width / 10 }
    return (
      <View
        ref={lockTriangleCenter ? null : this.triangle}
        style={[styles.triangleContainer, { top: this.state.height }, lockTriangleCenter ? centerPosition : null]}
      >
        <Svg height={width / 5} width={width / 5} >
          <Polygon points={trianglePoint} fill={backgroundColor} />
        </Svg>
      </View>
    )
  }

  /**
   * We watch for changes to the textInput sizes to adjust the width an height accordingly
   * this is required as we are absolutely positioning everything in the svg so we must know
   * dimension to accurately layout the toolTip etc.
   */
  updateLayoutOnChange = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    const oldHeight = this.state.height
    const oldWidth = this.state.width
    const { x, y, cursorMarkerHeight, standoff } = this.toolTipPosition

    // Height should not change significantly past the initial layout
    if (Math.abs(oldHeight - height) > 8) {
      this.setState({ height }, () => this.setNativeToolTipPositionPropY(y, cursorMarkerHeight, standoff))
    }

    // Prevent over updating the width, this can prevent jitteriness as some devices have minimal changes
    if (Math.abs(oldWidth - width) > 1) {
      if (!this.props.width) {
        this.setState({ width }, () => {
          this.setNativeToolTipPositionPropX(x, this.realPercentage)
          this.setNativeToolTipPositionPropY(y, cursorMarkerHeight, standoff)
          this.setNativeTriangleXPositionProps(this.realPercentage)
        })
      }
    }
  }

  /**
   * Only update the component when we have a height or width change from the layout, otherwise all
   * component updates are done through direct manipulation and don't require a render cycle on the js thread
   */
  shouldComponentUpdate(nextProps: ToolTipComponentProps, nextState: State) {
    if (
      this.state.height !== nextState.height
      || this.state.width !== nextState.width
      || this.props.toolTipTextRenderers.length !== nextProps.toolTipTextRenderers.length
    ) { return true }
    return false
  }

  render() {
    const { width, backgroundColor, displayToolTip, borderRadius, height, toolTipTextRenderers } = this.props
    if (!displayToolTip || this.textInputs.length === 0) { return null }
    this.numberOfLines = toolTipTextRenderers.length
    if (this.textInputs.length !== toolTipTextRenderers.length) {
      this.textInputs = Array.apply(null, Array(this.numberOfLines)).map(() => React.createRef<TextInput>())
    }

    return (
      <Animated.View
        ref={this.toolTip}
        style={[styles.container, { height: this.state.height }, height ? { height } : null, width ? { width } : null]}
      >
        <View
          style={[
            styles.square,
            { backgroundColor, borderRadius },
            height ? { height } : null,
            width ? { width } : { paddingLeft: 8, paddingRight: 8 },
          ]}
          onLayout={this.updateLayoutOnChange}
        >
          {this.renderTextInputs()}
        </View>
        {this.renderTriangle()}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  square: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        paddingBottom: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  triangleContainer: {
    position: 'absolute',
    ...Platform.select({
      android: {
        elevation: 8,
      },
    }),
  },
  headerText: {
    textAlign: 'center',
    color: '#222222',
  },
  textCentering: {
    paddingTop: 2
  }
})

export default ToolTip

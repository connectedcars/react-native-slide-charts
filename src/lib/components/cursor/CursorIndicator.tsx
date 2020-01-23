import React, { Component } from 'react'
import { StyleSheet, Animated, Platform, View } from 'react-native'
import { CursorIndicatorProps } from './utils/types'

class CursorIndicator extends Component<CursorIndicatorProps> {
  static defaultProps = {
    borderColor: '#FFF',
    backgroundColor: '#F4B700',
  }

  indicator = React.createRef<View>()

  shouldComponentUpdate() {
    return false
  }

  setNativeProps = (nativeProps: Object) => {
    if (this.indicator.current != null) {
      this.indicator.current.setNativeProps(nativeProps)
    }
  }

  render() {
    const { cursorRadius, borderColor, backgroundColor } = this.props
    const cursorStyle = {
      width: cursorRadius * 2,
      height: cursorRadius * 2,
      borderRadius: cursorRadius,
      borderColor,
      backgroundColor,
    }
    return (
      <Animated.View
        ref={this.indicator}
        style={[styles.cursor, cursorStyle]}
      />
    )
  }
}

const styles = StyleSheet.create({
  cursor: {
    position: 'absolute',
    borderWidth: 6,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
})

export default CursorIndicator

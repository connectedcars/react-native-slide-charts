import React, { Component } from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import { CursorLineProps } from './utils/types'

class CursorLine extends Component<CursorLineProps> {
  static defaultProps = {
    width: 2,
    backgroundColor: '#F4B700',
  }

  line = React.createRef<View>()

  shouldComponentUpdate() {
    return false
  }

  setNativeProps = (nativeProps: Object) => {
    if (this.line.current != null) {
      this.line.current.setNativeProps(nativeProps)
    }
  }

  render() {
    const { width, backgroundColor } = this.props
    return (
      <Animated.View ref={this.line} style={[styles.line, { width, backgroundColor }]} />
    )
  }
}

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
  },
})

export default CursorLine

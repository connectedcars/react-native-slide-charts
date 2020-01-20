import React, { Component } from 'react'
import { Animated } from 'react-native'
import { Path, PathProps } from 'react-native-svg'

class AnimatedPath extends Component<PathProps> {

  pathRef = React.createRef<any>()

  setNativeProps = (nativeProps: Object) => {
    if (this.pathRef.current != null) {
      this.pathRef.current.setNativeProps(nativeProps)
    }
  }

  shouldComponentUpdate(nextProps: PathProps) {
    const { fill, stroke, strokeWidth } = this.props
    if (
      nextProps.fill !== fill ||
      nextProps.stroke !== stroke ||
      nextProps.strokeWidth !== strokeWidth
    ) {
      return true
    }

    return false
  }

  render() {
    return (
      <Path
        ref={this.pathRef}
        {...this.props}
      />
    )
  }
}

export default Animated.createAnimatedComponent(AnimatedPath)

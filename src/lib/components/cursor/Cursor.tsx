import React, { Component } from 'react'
import CursorIndicator from './CursorIndicator'
import CursorLine from './CursorLine'
import { CursorProps } from './utils/types'

class Cursor extends Component<CursorProps> {

  static defaultProps = {
    cursorLine: true,
    displayCursor: true
  }

  cursorIndicator = React.createRef<CursorIndicator>()
  cursorLine = React.createRef<CursorLine>()

  shouldComponentUpdate() {
    return false
  }

  setNativeCursorIndicatorProps = (nativeProps: Object) => {
    if (this.cursorIndicator.current != null) {
      this.cursorIndicator.current.setNativeProps(nativeProps)
    }
  }

  setNativeCursorLineProps = (nativeProps: Object) => {
    if (this.cursorLine.current != null) {
      this.cursorLine.current.setNativeProps(nativeProps)
    }
  }

  renderCursorMarker() {
    const { cursorColor, cursorBorderColor, renderCursorMarker, cursorMarkerWidth } = this.props

    // Custom cursor marker
    if (renderCursorMarker) {
      return renderCursorMarker({ ...this.props, ref: this.cursorIndicator })
    }

    return (
      <CursorIndicator
        ref={this.cursorIndicator}
        cursorRadius={cursorMarkerWidth / 2}
        borderColor={cursorBorderColor}
        backgroundColor={cursorColor}
      />
    )
  }

  render() {
    const { cursorColor, cursorWidth, cursorLine, displayCursor } = this.props
    if (!displayCursor) { return null }
    return (
      <>
        {cursorLine && <CursorLine
          ref={this.cursorLine}
          width={cursorWidth}
          backgroundColor={cursorColor}
        />}
        {this.renderCursorMarker()}
      </>
    )
  }
}

export default Cursor

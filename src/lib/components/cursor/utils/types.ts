export type CursorProps = {
  cursorMarkerWidth: number
  cursorMarkerHeight: number
  cursorWidth: number
  cursorColor?: string
  cursorBorderColor?: string
  renderCursorMarker?: (props: CursorProps & { ref: React.RefObject<any> }) => React.ReactNode | null
  cursorLine?: boolean
  displayCursor?: boolean
}

export type CursorIndicatorProps = {
  cursorRadius: number
  borderColor: string
  backgroundColor: string
}

export type CursorLineProps = {
  width: number
  backgroundColor: string
}
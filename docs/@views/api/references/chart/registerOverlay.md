```typescript
(
  overlay: {
    name: string
    totalStep?: number
    lock?: boolean
    visible?: boolean
    zLevel?: number
    needDefaultPointFigure?: boolean
    needDefaultXAxisFigure?: boolean
    needDefaultYAxisFigure?: boolean
    mode?: 'normal' | 'weak_magnet' | 'strong_magnet'
    modeSensitivity?: number
    points?: Array<{ timestamp: number, dataIndex?: number, value?: number }>
    extendData?: any
    styles?: object
    createPointFigures?: (params: object) => {
      key?: string
      type: string
      attrs: any | any[]
      styles?: any
      ignoreEvent?: boolean |
        Array<
          'onClick' |
          'onDoubleClick' |
          'onRightClick' |
          'onPressedMoveStart' |
          'onPressedMoving' |
          'onPressedMoveEnd' |
          'onMouseEnter' |
          'onMouseLeave' |
          'onSelected' |
          'onDeselected'
        >
    } | Array<{
      key?: string
      type: string
      attrs: any | any[]
      styles?: any
      ignoreEvent?: boolean |
        Array<
          'onClick' |
          'onDoubleClick' |
          'onRightClick' |
          'onPressedMoveStart' |
          'onPressedMoving' |
          'onPressedMoveEnd' |
          'onMouseEnter' |
          'onMouseLeave' |
          'onSelected' |
          'onDeselected'
        >
    }>
    createXAxisFigures?: (params: object) => {
      key?: string
      type: string
      attrs: any | any[]
      styles?: any
      ignoreEvent?: boolean |
        Array<
          'onClick' |
          'onDoubleClick' |
          'onRightClick' |
          'onPressedMoveStart' |
          'onPressedMoving' |
          'onPressedMoveEnd' |
          'onMouseEnter' |
          'onMouseLeave' |
          'onSelected' |
          'onDeselected'
        >
    } | Array<{
      key?: string
      type: string
      attrs: any | any[]
      styles?: any
      ignoreEvent?: boolean |
        Array<
          'onClick' |
          'onDoubleClick' |
          'onRightClick' |
          'onPressedMoveStart' |
          'onPressedMoving' |
          'onPressedMoveEnd' |
          'onMouseEnter' |
          'onMouseLeave' |
          'onSelected' |
          'onDeselected'
        >
    }>
    createYAxisFigures?: (params: object) => {
      key?: string
      type: string
      attrs: any | any[]
      styles?: any
      ignoreEvent?: boolean |
        Array<
          'onClick' |
          'onDoubleClick' |
          'onRightClick' |
          'onPressedMoveStart' |
          'onPressedMoving' |
          'onPressedMoveEnd' |
          'onMouseEnter' |
          'onMouseLeave' |
          'onSelected' |
          'onDeselected'
        >
    } | Array<{
      key?: string
      type: string
      attrs: any | any[]
      styles?: any
      ignoreEvent?: boolean |
        Array<
          'onClick' |
          'onDoubleClick' |
          'onRightClick' |
          'onPressedMoveStart' |
          'onPressedMoving' |
          'onPressedMoveEnd' |
          'onMouseEnter' |
          'onMouseLeave' |
          'onSelected' |
          'onDeselected'
        >
    }>
    performEventPressedMove?: (params: object) => void
    performEventMoveForDrawing?: (params: object) => void
    onDrawStart?: (event: object) => boolean
    onDrawing?: (event: object) => boolean
    onDrawEnd?: (event: object) => boolean
    onClick?: (event: object) => boolean
    onDoubleClick?: (event: object) => boolean
    onRightClick?: (event: object) => boolean
    onPressedMoveStart?: (event: object) => boolean
    onPressedMoving?: (event: object) => boolean
    onPressedMoveEnd?: (event: object) => boolean
    onMouseEnter?: (event: object) => boolean
    onMouseLeave?: (event: object) => boolean
    onRemoved?: (event: object) => boolean
    onSelected?: (event: object) => boolean
    onDeselected?: (event: object) => boolean
  }
) => void
```
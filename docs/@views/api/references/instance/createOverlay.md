```typescript
(
  value:
    string |
    {
      name: string
      id?: string
      groupId?: string
      paneId?: string
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
    } |
    Array<
      string |
      {
        name: string
        id?: string
        groupId?: string
        paneId?: string
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
    >
) => void
```
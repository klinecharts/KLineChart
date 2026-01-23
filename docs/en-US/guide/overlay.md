# Overlay
This document introduces the built-in overlays in the chart and how to customize an overlay.

## Built-in overlay types
`horizontalRayLine`, `horizontalSegment`, `horizontalStraightLine`, `verticalRayLine`, `verticalSegment`, `verticalStraightLine`, `rayLine`, `segment`, `straightLine`, `priceLine`, `priceChannelLine`, `parallelStraightLine`, `fibonacciLine`, `brush`, `simpleAnnotation`, `simpleTag`

## Custom overlays
Create a custom overlay, register it globally via [registerOverlay](/api/chart/registerOverlay), then use it in the chart just like a built-in overlay. For more examples, refer to [https://github.com/klinecharts/KLineChart/tree/main/src/extension/overlay](https://github.com/klinecharts/KLineChart/tree/main/src/extension/overlay).

### Core flow
1. Register a template with `registerOverlay` (`name` must be unique).
2. Create an instance with `createOverlay` (supports `name`, object, or array).
3. Update instance attributes with `overrideOverlay`.
4. Remove an instance with `removeOverlay`.

### Relationship between `totalStep` and `points`
- Overlay drawing is step-based, and `totalStep` describes drawing-state steps.
- The actual number of required points is usually `totalStep - 1`.
- For example, built-in `segment` needs 2 points and uses `totalStep: 3`.
- If `createOverlay` receives `points.length >= totalStep - 1`, drawing is completed immediately without interactive drawing steps.

### Points and magnet modes
- During interaction, coordinates are converted to point data: `timestamp`, `dataIndex`, and `value`.
- `mode` supports:
  - `normal`: no magnet behavior.
  - `weak_magnet`: weak magnet behavior, affected by `modeSensitivity`.
  - `strong_magnet`: strong magnet behavior.
- Magnet behavior only applies to price dimension in the main pane (`candle_pane`).

### Default control figures
- `needDefaultPointFigure`: shows default control points (visible on hover/selection).
- `needDefaultXAxisFigure`: shows default text and background highlight on the X-axis after selection.
- `needDefaultYAxisFigure`: shows default text and background highlight on the Y-axis after selection.

### Three drawing callbacks
- `createPointFigures`: figures in the main drawing area.
- `createXAxisFigures`: figures in the X-axis area.
- `createYAxisFigures`: figures in the Y-axis area.
- Callback params include: `chart`, `overlay`, `coordinates`, `bounding`, `xAxis`, and `yAxis`.
- Return value can be one figure object or an array of figure objects.

### Events and interaction rules
- Lifecycle events: `onDrawStart`, `onDrawing`, `onDrawEnd`, `onRemoved`.
- Selection/hover events: `onMouseEnter`, `onMouseLeave`, `onSelected`, `onDeselected`, `onClick`, `onDoubleClick`, `onRightClick`.
- Drag events: `onPressedMoveStart`, `onPressedMoving`, `onPressedMoveEnd`.
- When `lock: true`, drag-moving is disabled.
- Right-click deletes the overlay by default. Call `event.preventDefault()` in `onRightClick` to stop default deletion.
- A figure supports `ignoreEvent`:
  - `true`: ignore all supported events.
  - `string[]`: ignore only specified events.

### Style merge priority
Final figure styles are merged in this order (later overrides earlier):
1. Global styles: `styles.overlay[type]`
2. Overlay instance styles: `overlay.styles?.[type]`
3. Figure-level styles: `figure.styles`

### Recommended minimal template
```typescript
registerOverlay({
  name: 'customLine',
  totalStep: 3,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  mode: 'weak_magnet',
  modeSensitivity: 8,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length < 2) {
      return []
    }
    return [{
      type: 'line',
      attrs: { coordinates }
    }]
  },
  // Optional: constrain dragging or drawing behaviors
  performEventPressedMove: ({ points }) => {
    // Adjust points when needed
  },
  performEventMoveForDrawing: ({ points }) => {
    // Adjust points when needed
  }
})
```

### Practical tips
- If you want to create and finish immediately in code, pass full `points` in `createOverlay`.
- If you want interactive drawing, pass only `name` or partial `points`.
- If multiple overlays need grouped management, set a shared `groupId` and use filters with `overrideOverlay/removeOverlay`.

# 覆盖物
本文档介绍了图表内置的覆盖物和如何自定义一个覆盖物。

## 内置覆盖物类型
`horizontalRayLine` ， `horizontalSegment` ， `horizontalStraightLine` ， `verticalRayLine` ， `verticalSegment` ， `verticalStraightLine` ， `rayLine` ， `segment` ， `straightLine` ， `priceLine` ， `priceChannelLine` ， `parallelStraightLine` ， `fibonacciLine` ， `simpleAnnotation` ， `simpleTag`

## 自定义覆盖物
自定义一个覆盖物，然后通过 [registerOverlay](/api/chart/registerOverlay) 全局添加，添加到图表即可和内置覆盖物一样去使用。更多示例可参考 [https://github.com/klinecharts/KLineChart/tree/main/src/extension/overlay](https://github.com/klinecharts/KLineChart/tree/main/src/extension/overlay) 下的文件。

### 核心流程
1. 通过 `registerOverlay` 注册模版（`name` 唯一）。
2. 通过 `createOverlay` 创建实例（可传 `name`、对象或数组）。
3. 通过 `overrideOverlay` 更新实例属性。
4. 通过 `removeOverlay` 删除实例。

### `totalStep` 和 `points` 的关系
- 覆盖物绘制是分步完成的，`totalStep` 表示“绘制状态步数”。
- 实际需要的点数量通常是 `totalStep - 1`。
- 例如内置 `segment` 需要 2 个点，配置是 `totalStep: 3`。
- 如果 `createOverlay` 传入的 `points.length >= totalStep - 1`，会直接完成绘制，不进入交互过程。

### 点位与吸附模式
- 交互时坐标会转换为点位信息：`timestamp`、`dataIndex`、`value`。
- `mode` 支持：
  - `normal`：不吸附。
  - `weak_magnet`：弱吸附，受 `modeSensitivity` 影响。
  - `strong_magnet`：强吸附。
- 吸附逻辑仅在主图（`candle_pane`）的价格维度生效。

### 默认控制图形
- `needDefaultPointFigure`：显示默认控制点（hover/选中时可见）。
- `needDefaultXAxisFigure`：选中覆盖物后在 X 轴显示默认文本与背景高亮。
- `needDefaultYAxisFigure`：选中覆盖物后在 Y 轴显示默认文本与背景高亮。

### 三类绘制回调
- `createPointFigures`：主绘图区图形。
- `createXAxisFigures`：X 轴图形。
- `createYAxisFigures`：Y 轴图形。
- 回调参数统一包含：`chart`、`overlay`、`coordinates`、`bounding`、`xAxis`、`yAxis`。
- 返回值可为单个图形或图形数组。

### 事件与交互规则
- 生命周期事件：`onDrawStart`、`onDrawing`、`onDrawEnd`、`onRemoved`。
- 选择与悬浮事件：`onMouseEnter`、`onMouseLeave`、`onSelected`、`onDeselected`、`onClick`、`onDoubleClick`、`onRightClick`。
- 拖拽事件：`onPressedMoveStart`、`onPressedMoving`、`onPressedMoveEnd`。
- `lock: true` 时不会响应拖拽移动。
- 右键默认行为是删除覆盖物；在 `onRightClick` 中调用 `event.preventDefault()` 可阻止默认删除。
- 图形项支持 `ignoreEvent`：
  - `true`：忽略全部事件。
  - `string[]`：忽略指定事件。

### 样式合并优先级
同一图形最终样式按以下顺序合并，后者覆盖前者：
1. 全局样式 `styles.overlay[type]`
2. 覆盖物实例样式 `overlay.styles?.[type]`
3. 图形返回值中的 `figure.styles`

### 建议的最小模板
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
  // 可选：限制拖拽或绘制行为
  performEventPressedMove: ({ points }) => {
    // 按需修正 points
  },
  performEventMoveForDrawing: ({ points }) => {
    // 按需修正 points
  }
})
```

### 实践建议
- 需要“程序一次性创建完成”时，直接在 `createOverlay` 传完整 `points`。
- 需要“用户交互绘制”时，只传 `name` 或传部分 `points`。
- 需要多覆盖物联动管理时，建议设置统一 `groupId`，并配合 `overrideOverlay/removeOverlay` 使用过滤条件。

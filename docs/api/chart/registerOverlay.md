---
outline: deep
---

# registerOverlay(overlay)
`registerOverlay` 用于自定义覆盖物。

## 参考 {#reference}
<!-- @include: @/@views/api/references/chart/registerOverlay.md -->

### 参数 {#parameters}
- `overlay` 覆盖物配置。
  - `name` 名称，用于创建或者修改的唯一标识。
  - `totalStep` 总的实现步骤。
  - `lock` 是否锁定不让拖动。
  - `visible` 是否可见。
  - `zLevel` 绘制层级，值越大，越靠前显示，只作用于覆盖物之间。
  - `needDefaultPointFigure` 是否需要默认的点对应的图形。
  - `needDefaultXAxisFigure` 是否需要默认的x轴上的图形。
  - `needDefaultYAxisFigure` 是否需要默认的y轴上的图形。
  - `mode` 模式，支持 `normal` ， `weak_magnet` 和 `strong_magnet` 。
  - `modeSensitivity` 模式灵敏度，仅 mode 是 `weak_magnet` 时有效。
  - `points` 点信息。
  - `extendData` 自定义扩展数据。
  - `styles` 样式配置。
  - `createPointFigures` 创建点对应的图形。
  - `createXAxisFigures` 创建x轴上的图形。
  - `createYAxisFigures` 创建y轴上的图形。
  - `performEventPressedMove` 按住移动事件特殊处理方法。
  - `performEventMoveForDrawing` 移动事件过程中特殊处理方法。
  - `onDrawStart` 开始绘制事件。
  - `onDrawing` 绘制中事件。
  - `onDrawEnd` 绘制结束事件。
  - `onClick` 点击事件。
  - `onDoubleClick` 双击事件。
  - `onRightClick` 右击事件。
  - `onPressedMoveStart` 按住开始移动事件。
  - `onPressedMoving` 按住移动中事件。
  - `onPressedMoveEnd` 按住移动结束事件。
  - `onMouseEnter` 鼠标移入事件。
  - `onMouseLeave` 鼠标移出事件。
  - `onRemoved` 删除事件。
  - `onSelected` 选中事件。
  - `onDeselected` 取消选中事件。

### 返回值 {#returns}
`registerOverlay` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import CustomOverlayBasic from '../../@views/api/samples/custom-overlay-basic/index.vue'
import CustomOverlayCustomFigure from '../../@views/api/samples/custom-figure-custom-overlay/index.vue'
</script>

### 基本使用 {#basic}
<CustomOverlayBasic/>

### 使用自定义基础图形 {#custom-figure}
<CustomOverlayCustomFigure/>
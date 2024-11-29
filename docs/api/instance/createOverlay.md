---
outline: deep
---

# createOverlay(value)
`createOverlay` 创建覆盖物。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/createOverlay.md-->

### 参数 {#parameters}
- `value` 覆盖物配置，可以是覆盖物名称，可以是覆盖物对象，也可以是覆盖物名称和对象组成的数组。
  - `name` 覆盖物名称。
  - `id` 覆盖物id。
  - `groupId` 编组id。
  - `paneId` 窗口id。
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
`createOverlay` 返回 `string` 或者 `null` 或者 `Array<string | null>` 。

## 用法 {#usage}
<script setup>
import CreateOverlayBasic from '../../@views/api/samples/createOverlay-basic/index.vue'
import CreateOverlayExtension from '../../@views/api/samples/custom-figure-custom-overlay/index.vue'
import CreateOverlayPoints from '../../@views/api/samples/createOverlay-points/index.vue'
import CreateOverlayBatch from '../../@views/api/samples/createOverlay-batch/index.vue'
</script>

### 基本使用 {#basic}
<CreateOverlayBasic/>

### 使用自定义覆盖物 {#extension}
<CreateOverlayExtension/>

### 立即完成创建 {#points}
<CreateOverlayPoints/>

### 批量创建 {#batch}
<CreateOverlayBatch/>

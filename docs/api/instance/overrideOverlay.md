---
outline: deep
---

# overlayOverlay(overlay)
`overlayOverlay` 覆盖覆盖物属性。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/overrideOverlay.md-->

### 参数
- `overlay` 覆盖物配置。
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

### 返回值
`overlayOverlay` 返回 `boolean` 。

## 用法 {#usage}
<script setup>
import OverrideOverlayBasic from '../../@views/api/samples/overrideOverlay-basic/index.vue'
import OverrideOverlayName from '../../@views/api/samples/overrideOverlay-name/index.vue'
import OverrideOverlayGroupId from '../../@views/api/samples/overrideOverlay-groupId/index.vue'
</script>

### 基本使用 {#basic}
<OverrideOverlayBasic/>

### 按名称覆盖属性 {#name}
<OverrideOverlayName/>

### 按组覆盖属性 {#groupId}
<OverrideOverlayGroupId/>


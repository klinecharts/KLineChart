---
outline: deep
---

# scrollToTimestamp(timestamp, animationDuration?)
`scrollToTimestamp` 滚动到指定的时间戳。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/scrollToTimestamp.md -->

### 参数
- `timestamp` 时间戳。
- `animationDuration` 动画持续时间，如果小于等于0，则无动画。

### 返回值
`scrollToTimestamp` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import ScrollToTimestamp from '../../../@views/api/samples/scrollToTimestamp/index.vue'
</script>

### 基本用法 {#basic}
<ScrollToTimestamp/>
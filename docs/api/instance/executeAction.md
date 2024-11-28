---
outline: deep
---

# executeAction(type, data)
`executeAction` 执行图表动作。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/executeAction.md -->

### 参数
- `type` 类型，仅支持 `onCrosshairChange` 。
- `data` 数据。

### 返回值
`executeAction` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import ExecuteAction from '../../@views/api/samples/executeAction/index.vue'
</script>

### 基本用法 {#basic}
<ExecuteAction/>
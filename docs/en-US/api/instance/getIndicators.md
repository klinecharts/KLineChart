---
outline: deep
---

# getIndicators(filter?)
`getIndicators` 获取指标信息。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/getIndicators.md -->

### 参数
- `filter` 过滤参数。
  - `name` 指标名称。
  - `paneId` 窗口id。


### 返回值
`getIndicators` 返回 `Map<string, Indicator[]>` 。

## 用法 {#usage}
<script setup>
import GetIndicators from '../../../@views/api/samples/getIndicators/index.vue'
</script>

### 基本使用 {#basic}
<GetIndicators/>
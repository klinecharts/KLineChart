---
outline: deep
---

# setDecimalFold(decimalFold)
`setDecimalFold` 设置图表小数折叠配置。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/setDecimalFold.md -->

### 参数
- `decimalFold` 折叠配置。
  - `threshold` 折叠阈值。
  - `format` 自定义折叠格式化。

### 返回值
`setDecimalFold` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import SetDecimalFoldThreshold from '../../../@views/api/samples/setDecimalFold-threshold/index.vue'
import SetDecimalFoldFormat from '../../../@views/api/samples/setDecimalFold-format/index.vue'
</script>

### 不折叠小数 {#threshold}
<SetDecimalFoldThreshold/>

### 自定义格式化
<SetDecimalFoldFormat/>
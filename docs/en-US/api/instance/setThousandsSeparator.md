---
outline: deep
---

# setThousandsSeparator(thousandsSeparator)
`setThousandsSeparator` 设置图表千分符配置。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setThousandsSeparator.md-->

### 参数
- `thousandsSeparator` 千分符配置。
  - `sign` 千分符符号。
  - `format` 自定义千分符格式化。

### 返回值
`setThousandsSeparator` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import SetThousandsSeparatorSign from '../../../@views/api/samples/setThousandsSeparator-sign/index.vue'
import SetThousandsSeparatorFormat from '../../../@views/api/samples/setThousandsSeparator-format/index.vue'
</script>

### 不显示千分符 {#sign}
<SetThousandsSeparatorSign/>

### 自定义格式化
<SetThousandsSeparatorFormat/>
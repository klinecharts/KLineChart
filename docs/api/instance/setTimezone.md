---
outline: deep
---

# setTimezone(timezone)
`setTimezone` 设置图表的时区。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setTimezone.md-->

### 参数 {#parameters}
- `timezone` 时区名，如 `Asia/Shanghai` ，时区对应名字列表请参阅 [时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) 。

### 返回值 {#returns}
`setTimezone` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import SetTimezone from '../../@views/api/samples/setTimezone/index.vue'
</script>

### 基本用法 {#basic}
<SetTimezone/>
---
outline: deep
---

# setTimezone(timezone)
`setTimezone` set the timezone for the chart.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/setTimezone.md-->

### Parameters
- `timezone` Timezone name, such as `Asia/Shanghai`. For a list of timezone names, see the [List of Timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) .

### Returns
`setTimezone` returns `undefined` .

## Usage {#usage}
<script setup>
import SetTimezone from '../../../@views/api/samples/setTimezone/index.vue'
</script>

### Basic usage {#basic}
<SetTimezone/>
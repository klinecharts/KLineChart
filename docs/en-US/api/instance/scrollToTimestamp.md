---
outline: deep
---

# scrollToTimestamp(timestamp, animationDuration?)
`scrollToTimestamp` scroll the right side of the chart to the specified timestamp.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/scrollToTimestamp.md -->

### Parameters {#parameters}
- `timestamp` Timestamp.
- `animationDuration` Animation duration. If it is less than or equal to 0, there is no animation.

### Returns {#returns}
`scrollToTimestamp` returns `undefined` .

## Usage {#usage}
<script setup>
import ScrollToTimestamp from '../../../@views/api/samples/scrollToTimestamp/index.vue'
</script>

### Basic usage {#basic}
<ScrollToTimestamp/>
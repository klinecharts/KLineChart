::: code-group
```js:line-numbers [JavaScript]
import { init } from 'klinecharts'

<!--@include: ../genData.js{,23}-->

const chart = init('data-chart')
chart.loadMore((timestamp) => {
  loadMoreTimer = setTimeout(() => {
    chart.applyMoreData(genData(timestamp), true)
  }, 2000)
})
chart.applyNewData(genData(), true)
updateData()

<!--@include: ./index.vue{33,44}-->
```

```html:line-numbers [HTML]
<div id="data-chart" style="height:450px"/>
```
:::
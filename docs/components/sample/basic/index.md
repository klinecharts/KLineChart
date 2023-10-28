::: code-group
```js:line-numbers [JavaScript]
import { init } from 'klinecharts'

<!--@include: ../genData.js{,23}-->

const chart = init('basic-chart')
chart.applyNewData(genData())
```

```js:line-numbers [HTML]
<div id="basic-chart" style="height:450px"/>
```
:::
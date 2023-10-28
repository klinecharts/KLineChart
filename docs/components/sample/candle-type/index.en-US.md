::: code-group
```js:line-numbers [JavaScript]
import { init } from 'klinecharts'

<!--@include: ../genData.js{,23}-->

const chart = init('candle-type-chart')
chart.applyNewData(genData())

<!--@include: ./index.vue{40,44}-->
```

```html:line-numbers [HTML]
<div>
  <div class="button-box">
    <button onclick="setType('candle_solid')">All Solid</button>
    <button onclick="setType('candle_stroke')">All Stroke</button>
    <button onclick="setType('candle_up_stroke')">Up Stroke</button>
    <button onclick="setType('candle_down_stroke')">Down Stroke</button>
    <button onclick="setType('ohlc')">ohlc</button>
    <button onclick="setType('area')">Area</button>
  </div>
  <div id="candle-type-chart" style="height:450px;"/>
</div>
```

```css:line-numbers [CSS]
<!--@include: ./index.vue{63,78}-->
```
:::
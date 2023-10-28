::: code-group
```js:line-numbers [JavaScript]
import { init } from 'klinecharts'

<!--@include: ../genData.js{,23}-->

const chart = init('axis-chart')
chart.applyNewData(genData())

<!--@include: ./index.vue{40,62}-->
```

```html:line-numbers [HTML]
<div>
  <div class="button-box">
    <button onclick="setPosition('right')">Right</button>
    <button onclick="setPosition('left')">Left</button>
    <button onclick="setInside(false)">Inside</button>
    <button onclick="setInside(true)">Outside</button>
    <button onclick="setType('normal')">Linear</button>
    <button onclick="setType('percentage')">Percentage</button>
    <button onclick="setType('log')">Logarithm</button>
    <button onclick="setReverse(false)">Regularity</button>
    <button onclick="setReverse(true)">Reverse</button>
  </div>
  <div id="axis-chart" style="height:450px;"/>
</div>
```

```css:line-numbers [CSS]
<!--@include: ./index.vue{93,108}-->
```
:::
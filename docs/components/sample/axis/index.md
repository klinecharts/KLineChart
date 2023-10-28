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
    <button onclick="setPosition('right')">右侧</button>
    <button onclick="setPosition('left')">左侧</button>
    <button onclick="setInside(false)">外部</button>
    <button onclick="setInside(true)">内部</button>
    <button onclick="setType('normal')">线性坐标</button>
    <button onclick="setType('percentage')">百分比坐标</button>
    <button onclick="setType('log')">对数坐标</button>
    <button onclick="setReverse(false)">正向</button>
    <button onclick="setReverse(true)">反向</button>
  </div>
  <div id="axis-chart" style="height:450px;"/>
</div>
```

```css:line-numbers [CSS]
<!--@include: ./index.vue{93,108}-->
```
:::
::: code-group
```js:line-numbers [JavaScript]
import { init, registerIndicator } from 'klinecharts'

<!--@include: ../genData.js{,23}-->

<!--@include: ./index.vue{12,47}-->

const chart = init('indicator-chart')
chart.applyNewData(genData())

<!--@include: ./index.vue{77,83}-->
```

```html:line-numbers [HTML]
<div>
  <div class="button-box">
    <span>主图：</span>
    <button onclick="setMainIndicator('MA')">MA</button>
    <button onclick="setMainIndicator('BOLL')">BOLL</button>
    <button onclick="setMainIndicator('Custom')">Custom</button>
    <span style="padding-left: 10px;">副图：</span>
    <button onclick="setSubIndicator('VOL')">VOL</button>
    <button onclick="setSubIndicator('MACD')">MACD</button>
    <button onclick="setSubIndicator('Custom')">Custom</button>
  </div>
  <div id="indicator-chart" style="height:450px"/>
</div>
```

```css:line-numbers [CSS]
<!--@include: ./index.vue{104,118}-->
```
:::
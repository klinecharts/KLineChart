::: code-group
```js:line-numbers [JavaScript]
import { init } from 'klinecharts'

<!--@include: ../genData.js{,23}-->

const chart = init('tooltip-chart')
chart.createIndicator('MA', false, { id: 'candle_pane' })
chart.createIndicator('VOL')
chart.applyNewData(genData())

<!--@include: ./index.vue{42,80}-->
```

```html:line-numbers [HTML]
<div>
  <div class="button-box">
    <span>Base tooltip: </span>
    <button onclick="setCandleTooltipShowRule('always')">Always</button>
    <button onclick="setCandleTooltipShowRule('follow_cross')">Follow Cross</button>
    <button onclick="setCandleTooltipShowRule('none')">Hide</button>
    <button onclick="setCandleTooltipShowType('standard')">Standard</button>
    <button onclick="setCandleTooltipShowType('rect')">Rect</button>
  </div>
  <div class="button-box">
    <span>Indicator tooltip: </span>
    <button onclick="setIndicatorTooltipShowRule('always')">Always</button>
    <button onclick="setIndicatorTooltipShowRule('follow_cross')">Follow Cross</button>
    <button onclick="setIndicatorTooltipShowRule('none')">Hide</button>
    <button onclick="setIndicatorTooltipShowType('standard')">Standard</button>
    <button onclick="setIndicatorTooltipShowType('rect')">Rect</button>
  </div>
  <div id="tooltip-chart" style="height:450px;"/>
</div>
```

```css:line-numbers [CSS]
<!--@include: ./index.vue{107,122}-->
```
:::
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
    <span>基础信息提示：</span>
    <button onclick="setCandleTooltipShowRule('always')">总是显示</button>
    <button onclick="setCandleTooltipShowRule('follow_cross')">跟随十字光标</button>
    <button onclick="setCandleTooltipShowRule('none')">不显示</button>
    <button onclick="setCandleTooltipShowType('standard')">默认</button>
    <button onclick="setCandleTooltipShowType('rect')">矩形框</button>
  </div>
  <div class="button-box">
    <span>指标信息提示：</span>
    <button onclick="setIndicatorTooltipShowRule('always')">总是显示</button>
    <button onclick="setIndicatorTooltipShowRule('follow_cross')">跟随十字光标</button>
    <button onclick="setIndicatorTooltipShowRule('none')">不显示</button>
    <button onclick="setIndicatorTooltipShowType('standard')">默认</button>
    <button onclick="setIndicatorTooltipShowType('rect')">矩形框</button>
  </div>
  <div id="tooltip-chart" style="height:450px;"/>
</div>
```

```css:line-numbers [CSS]
<!--@include: ./index.vue{107,122}-->
```
:::
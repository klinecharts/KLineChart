::: code-group
```js:line-numbers [JavaScript]
import { init, registerOverlay } from 'klinecharts'

<!--@include: ../genData.js{,23}-->

<!--@include: ./index.vue{12,37}-->

const chart = init('overlay-chart')
chart.applyNewData(genData())

<!--@include: ./index.vue{67,69}-->
```

```html:line-numbers [HTML]
<div>
  <div class="button-box">
    <button onclick="createOverlay('priceLine')">Price Line(Built-in)</button>
    <button onclick="createOverlay('circle')">Circle(Custom)</button>
  </div>
  <div id="overlay-chart" style="height:450px"/>
</div>
```

```css:line-numbers [CSS]
<!--@include: ./index.vue{84,98}-->
```
:::

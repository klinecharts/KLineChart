::: code-group
```js:line-numbers [JavaScript]
import { init, registerStyles } from 'klinecharts'

<!--@include: ../genData.js{,23}-->

<!--@include: ./index.vue{12,102}-->

const chart = init('theme-chart')
chart.createIndicator('VOL')
chart.applyNewData(genData())

<!--@include: ./index.vue{137,144}-->
```

```html:line-numbers [HTML]
<div>
  <div class="button-box">
    <button onclick="setTheme('light')">Light</button>
    <button onclick="setTheme('dark')">Dark</button>
    <button onclick="setTheme('green_rise_red_fall')">Green rise and red fall</button>
    <button onclick="setTheme('red_rise_green_fall')">Red rise and green fall</button>
  </div>
  <div id="theme-chart" style="height:450px"/>
</div>
```

```css:line-numbers [CSS]
<!--@include: ./index.vue{161,175}-->
```
:::
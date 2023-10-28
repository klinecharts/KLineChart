::: code-group
```js:line-numbers [JavaScript]
import { init, registerLocale } from 'klinecharts'

<!--@include: ../genData.js{,23}-->

<!--@include: ./index.vue{12,19}-->

const chart = init('language-chart')
chart.applyNewData(genData())

<!--@include: ./index.vue{49,51}-->
```

```html:line-numbers [HTML]
<div>
  <div class="button-box">
    <button onclick="setLang('zh-CN')">简体中文</button>
    <button onclick="setLang('en-US')">English</button>
    <button onclick="setLang('zh-HK')">繁体中文</button>
  </div>
  <div id="language-chart" style="height:450px"/>
</div>
```

```css:line-numbers [CSS]
<!--@include: ./index.vue{67,82}-->
```
:::
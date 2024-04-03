# 🚀 快速上手

## 获取KLineChart
KLineChart 支持多种下载方式，你可以通过`npm`或`yarn`等包管理工具，也可以通过`CDN`获取。

::: code-group
```bash [npm]
npm install klinecharts
```
```bash [yarn]
yarn add klinecharts
```
```html [cdn]
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/klinecharts/dist/umd/klinecharts.min.js"></script>
```
:::


## 创建第一个图表
KLineChart 不受前端框架限制，所以你可以在任何一个前端框架中使用。
::: code-group
```jsx [React]
import { useEffect } from 'react'
import { init, dispose } from 'klinecharts'

export default () => {
  useEffect(() => {
    // 初始化图表
    const chart = init('chart')

    // 为图表添加数据
    chart.applyNewData([
      { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
      { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
      { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
      { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
      { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
      { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
      { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
      { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
      { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
      { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
    ])

    return () => {
      // 销毁图表
      dispose('chart')
    }
  }, [])

  return <div id="chart" style={{ width: 600, height: 600 }}/>
}
```

```vue [Vue]
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { init, dispose } from 'klinecharts'

onMounted(() => {
  // 初始化图表
  const chart = init('chart')

  // 为图表添加数据
  chart.applyNewData([
    { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
    { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
    { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
    { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
    { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
    { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
    { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
    { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
    { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
    { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
  ])
})

onUnmounted(() => {
  // 销毁图表
  dispose('chart')
})
</script>

<template>
  <div id="chart" style="width:600px;height:600px"/>
</template>
```

```ts [Angular]
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { init, dispose } from 'klinecharts';

@Component({
  selector: 'app-chart',
  template: `<div id="chart" style="width:600px;height:600px"/>`,
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  ngAfterViewInit(): void {
    // 初始化图表
    const chart = init('chart');

    // 为图表添加数据
    chart?.applyNewData([
      { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
      { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
      { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
      { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
      { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
      { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
      { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
      { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
      { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
      { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
    ]);
  }

  ngOnDestroy(): void {
    // 销毁图表
    dispose('chart');
  }
}
```

```jsx [Preact]
import { useEffect } from 'preact/hooks'
import { init, dispose } from 'klinecharts'

export default () => {
  useEffect(() => {
    // 初始化图表
    const chart = init('chart')

    // 为图表添加数据
    chart.applyNewData([
      { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
      { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
      { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
      { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
      { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
      { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
      { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
      { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
      { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
      { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
    ])

    return () => {
      // 销毁图表
      dispose('chart')
    }
  }, [])

  return <div id="chart" style={{ width: 600, height: 600 }}/>
}

```

```jsx [Solid]
import { onMount, onCleanup } from 'solid-js'
import { init, dispose } from 'klinecharts'

export default () => {
  onMount(() => {
    // 初始化图表
    const chart = init('chart')

    // 为图表添加数据
    chart.applyNewData([
      { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
      { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
      { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
      { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
      { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
      { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
      { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
      { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
      { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
      { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
    ])
  })

  onCleanup(() => {
    // 销毁图表
    dispose('chart')
  })

  return <div id="chart" style={{ width: 600, height: 600 }}/>
}

```

```svelte [Svelte]
<div id="chart" style="width:600px;height:600px"/>

<script>
import { onMount, onDestroy } from 'svelte'

onMount(() => {
  // 初始化图表
  const chart = init('chart')

  // 为图表添加数据
  chart.applyNewData([
    { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
    { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
    { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
    { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
    { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
    { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
    { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
    { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
    { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
    { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
  ])
})

onDestroy(() => {
  // 销毁图表
  dispose('chart')
})
</script>
```

```html [Vanilla]
<!DOCTYPE html>
<html lang="cn" >
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="keywords" content="快速开始"/>
    <meta name="description" content="快速开始"/>
    <title>快速开始</title>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/klinecharts/dist/umd/klinecharts.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width:600px;height:600px"></div>
    <script>
      window.onload = function () {
        // 初始化图表
        var chart = klinecharts.init('chart')

        // 为图表添加数据
        chart.applyNewData([
          { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
          { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
          { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
          { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
          { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
          { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
          { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
          { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
          { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
          { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
        ])
      }
    </script>
  </body>
</html>
```
:::

这样你的第一个图表就创建完成了。

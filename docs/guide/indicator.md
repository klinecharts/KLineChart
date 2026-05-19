<script setup>
import Tip from '../@components/Tip.vue'
</script>

# 技术指标
本文档介绍了图表内置的技术指标和如何自定义一个技术指标。

## 内置技术指标
### 默认参数说明
| **指标名** | **默认计算参数** | **指标名** | **默认计算参数** | **指标名** | **默认计算参数** |
| :---: | :---: | :---: | :---: | :---: | :---: |
| MA | [5, 10, 30, 60] | BIAS | [6, 12, 24] | VR | [26, 6] |
| EMA | [6, 12, 20] | BRAR | [26] | WR | [6, 10, 14] |
| SMA | [12, 2] | CCI | [20] | MTM | [12, 6] |
| BBI | [3, 6, 12, 24] | DMI | [14, 6] | EMV | [14, 9] |
| VOL | [5, 10, 20] | CR | [26, 10, 20, 40, 60] | SAR | [2, 2, 20] |
| MACD | [12, 26, 9] | PSY | [12, 6] | AO | [5, 34] |
| BOLL | [20, 2] | DMA | [10, 50, 10] | ROC | [12, 6] |
| KDJ | [9, 3, 3] | TRIX | [12, 9] | PVT | 无 |
| RSI | [6, 12, 24] | OBV | [30] | AVP | 无 |

<Tip title="提示" :tip="['一些指标可以使用 <code>chart.createIndicator(\'MA\', { pane: { id: \'candle_pane\' }, isStack: true })</code> 叠加在蜡烛图上，而有些则不能。与蜡烛图兼容的内置指标有：BBI、BOLL、EMA、MA、SAR、SMA。']"/>

### 快速使用

创建内置指标最常用的方式：

```ts
// 创建一个独立窗口指标
chart.createIndicator('VOL')

// 将指标叠加到蜡烛图窗口
chart.createIndicator('MA', { pane: { id: 'candle_pane' }, isStack: true })
```

如果你不确定当前版本支持哪些指标，可以直接调用：

```ts
import { getSupportedIndicators } from 'klinecharts'

const indicators = getSupportedIndicators()
console.log(indicators)
```

### 数据字段依赖

大多数指标只依赖 `open / high / low / close / volume`，但下面两个指标依赖 `turnover` 字段：

- `EMV`
- `AVP`

如果数据里未提供 `turnover`，这两个指标的值会异常或不可用。数据结构可参考[数据接入](/guide/data-integration)。

## 自定义技术指标
创建一个自定义技术指标，只需要生成一个指标配置，然后通过图表 API [registerIndicator](/api/chart/registerIndicator) 全局注册，之后即可和内置指标一样通过 `createIndicator` 使用。

更多示例可参考 [https://github.com/klinecharts/KLineChart/tree/main/src/extension/indicator](https://github.com/klinecharts/KLineChart/tree/main/src/extension/indicator) 下的文件。

### 最小可用示例

```ts
import { registerIndicator } from 'klinecharts'

registerIndicator({
  name: 'CUSTOM_MID',
  shortName: 'MID',
  series: 'price',
  calcParams: [14],
  figures: [
    { key: 'mid', title: 'MID: ', type: 'line' }
  ],
  calc: (dataList, indicator) => {
    const [period] = indicator.calcParams
    return dataList.map((k, i) => {
      if (i < period - 1) {
        return { mid: null }
      }
      const start = i - period + 1
      const slice = dataList.slice(start, i + 1)
      const sum = slice.reduce((acc, item) => acc + item.close, 0)
      return { mid: sum / period }
    })
  }
})
```

### 常用配置说明

- `series`
  - `price` 跟随价格精度。
  - `volume` 跟随数量精度。
  - `normal` 使用指标自身精度。
- `regenerateFigures`
  - 当 `calcParams` 改变时动态重建 `figures`，适合 MA/EMA 这种多参数多线场景。
- `createTooltipDataSource`
  - 自定义 tooltip 展示内容（名称、参数、图例、功能按钮）。
- `draw`
  - 自定义绘制；返回 `true` 时会覆盖默认图形绘制。

### 更新与性能建议

- 如果只改样式或显示，不改计算逻辑，优先使用 [overrideIndicator](/api/instance/overrideIndicator) 更新属性。
- 当 `calcParams`、`figures` 或 `calc` 变化时，会触发指标重算。
- 高频更新场景中，尽量保持 `calc` 纯函数和轻量计算，避免在 `calc` 中执行重 IO 或大对象拷贝。

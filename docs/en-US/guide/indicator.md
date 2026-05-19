<script setup>
import Tip from '../../@components/Tip.vue'
</script>

# Technical indicator
This document introduces built-in technical indicators and how to customize one.

## Built-in technical indicators
### Default params
| **Name** | **Default calc params** | **Name** | **Default calc params** | **Name** | **Default calc params** |
| :---: | :---: | :---: | :---: | :---: | :---: |
| MA | [5, 10, 30, 60] | BIAS | [6, 12, 24] | VR | [26, 6] |
| EMA | [6, 12, 20] | BRAR | [26] | WR | [6, 10, 14] |
| SMA | [12, 2] | CCI | [20] | MTM | [12, 6] |
| BBI | [3, 6, 12, 24] | DMI | [14, 6] | EMV | [14, 9] |
| VOL | [5, 10, 20] | CR | [26, 10, 20, 40, 60] | SAR | [2, 2, 20] |
| MACD | [12, 26, 9] | PSY | [12, 6] | AO | [5, 34] |
| BOLL | [20, 2] | DMA | [10, 50, 10] | ROC | [12, 6] |
| KDJ | [9, 3, 3] | TRIX | [12, 9] | PVT | None |
| RSI | [6, 12, 24] | OBV | [30] | AVP | None |

<Tip title="Tip" :tip="['Some indicators can be overlaid on candles using <code>chart.createIndicator(\'MA\', { pane: { id: \'candle_pane\' }, isStack: true })</code>, while some cannot. Built-in candle-compatible indicators are: BBI, BOLL, EMA, MA, SAR, SMA.']"/>

### Quick usage

Most common usage:

```ts
// Create in a separate pane
chart.createIndicator('VOL')

// Overlay on candle pane
chart.createIndicator('MA', { pane: { id: 'candle_pane' }, isStack: true })
```

If you want to inspect all supported indicators in your current version:

```ts
import { getSupportedIndicators } from 'klinecharts'

const indicators = getSupportedIndicators()
console.log(indicators)
```

### Data field dependency

Most indicators rely on `open / high / low / close / volume`, but these two also rely on `turnover`:

- `EMV`
- `AVP`

If `turnover` is missing in your data source, these indicators may be incorrect or unavailable. See [Data integration](/en-US/guide/data-integration).

## Custom indicators
To create a custom indicator, define an indicator config, register it globally via [registerIndicator](/api/chart/registerIndicator), then use it like a built-in indicator through `createIndicator`.

More examples are available in [https://github.com/klinecharts/KLineChart/tree/main/src/extension/indicator](https://github.com/klinecharts/KLineChart/tree/main/src/extension/indicator).

### Minimal example

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

### Key options

- `series`
  - `price`: follows price precision.
  - `volume`: follows volume precision.
  - `normal`: uses indicator precision.
- `regenerateFigures`
  - Rebuilds `figures` when `calcParams` changes. Useful for multi-line indicators like MA/EMA.
- `createTooltipDataSource`
  - Customizes tooltip content (name, params, legends, features).
- `draw`
  - Custom drawing callback. Returning `true` overrides default figure drawing.

### Update and performance notes

- If only style/visibility changes are needed, prefer [overrideIndicator](/api/instance/overrideIndicator).
- Changing `calcParams`, `figures`, or `calc` triggers recalculation.
- For high-frequency updates, keep `calc` pure and lightweight. Avoid heavy I/O or large object copies in `calc`.

# KLineChart Integration Examples

## 1. Static data

```ts
import { init, dispose } from 'klinecharts'

const chart = init('chart')
chart.setSymbol({ ticker: 'TEST', pricePrecision: 2, volumePrecision: 0 })
chart.setPeriod({ span: 1, type: 'day' })
chart.setDataLoader({
  getBars: ({ callback }) => {
    fetch('https://klinecharts.com/datas/kline.json')
      .then(res => res.json())
      .then(dataList => callback(dataList))
  }
})
```

## 2. REST + WebSocket

```ts
const stops = new Map<string, () => void>()

chart.setDataLoader({
  async getBars({ type, timestamp, symbol, period, callback }) {
    const res = await fetch(`/api/kline?symbol=${symbol.ticker}&end=${timestamp ?? Date.now()}&type=${type}`)
    const { list, hasMoreBefore, hasMoreAfter } = await res.json()
    callback(list.map(normalize).sort((a, b) => a.timestamp - b.timestamp), {
      forward: hasMoreBefore, backward: hasMoreAfter
    })
  },
  subscribeBar({ symbol, period, callback }) {
    const key = `${symbol.ticker}_${period.span}${period.type}`
    const ws = new WebSocket(`wss://api.example.com/kline/${symbol.ticker}`)
    ws.onmessage = e => callback(normalize(JSON.parse(e.data)))
    stops.set(key, () => ws.close())
  },
  unsubscribeBar({ symbol, period }) {
    stops.get(`${symbol.ticker}_${period.span}${period.type}`)?.()
  }
})

function normalize(raw: { t: number, o: string, h: string, l: string, c: string, v: string }) {
  return { timestamp: raw.t * 1000, open: +raw.o, high: +raw.h, low: +raw.l, close: +raw.c, volume: +raw.v }
}
```

## 3. React component

```tsx
import { useEffect, useRef } from 'react'
import { init, dispose } from 'klinecharts'

export function KLineChart({ symbol, period, loader }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const chart = init(ref.current)
    chart.setSymbol({ ticker: symbol, pricePrecision: 2, volumePrecision: 0 })
    chart.setPeriod(period)
    chart.setDataLoader(loader)
    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(ref.current)
    return () => { ro.disconnect(); dispose(ref.current!) }
  }, [])
  useEffect(() => { /* chart ref */ chart?.setSymbol({ ticker: symbol, pricePrecision: 2, volumePrecision: 0 }) }, [symbol])
  useEffect(() => { chart?.setPeriod(period) }, [period])
  return <div ref={ref} style={{ width: '100%', height: 500 }} />
}
```

## 4. Period switching

```ts
const PERIODS = { '1m': { span: 1, type: 'minute' }, '1d': { span: 1, type: 'day' } }
function switchPeriod(key: keyof typeof PERIODS) {
  chart.setPeriod(PERIODS[key]) // reloads data automatically
}
```

## 5. CDN

```html
<div id="chart" style="width:600px;height:600px"></div>
<script src="https://cdn.jsdelivr.net/npm/klinecharts/dist/umd/klinecharts.min.js"></script>
<script>
  const chart = klinecharts.init('chart')
  chart.setSymbol({ ticker: 'TEST', pricePrecision: 2, volumePrecision: 0 })
  chart.setPeriod({ span: 1, type: 'day' })
  chart.setDataLoader({ getBars: ({ callback }) => fetch('https://klinecharts.com/datas/kline.json').then(r => r.json()).then(callback) })
</script>
```

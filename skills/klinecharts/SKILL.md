---
name: klinecharts
description: >-
  Integrates KLineChart npm package (v10) — canvas K-line/candlestick charts,
  setDataLoader, indicators, overlays, styles. Use when working with
  klinecharts, KLineChart, candlestick charts, setDataLoader, data loading,
  createIndicator, createOverlay, or financial chart integration in any framework.
  v10 API differs from v9.
---

# KLineChart Integration Guide

Helps developers integrate [KLineChart](https://klinecharts.com) (npm: `klinecharts`, currently v10) into their projects.

## Route by scenario

| User need | Start here |
|-----------|------------|
| First integration, quick chart | → [Minimal example](#minimal-example) |
| Real backend (REST/WebSocket) | → [Data loading](#data-loading-setdataloader) |
| React / Vue / other frameworks | → [Framework integration](#framework-integration) |
| Indicators / drawing tools | → [Indicators and overlays](#indicators-and-overlays) |
| Upgrading from v9 | → [v9 → v10 migration](#v9--v10-migration) |
| Blank chart / data not updating | → [Troubleshooting](#troubleshooting) |

Check `klinecharts` in `package.json` if the version is unclear. **v10 no longer uses `applyNewData` / `updateData`.**

## Minimal example

```ts
import { init, dispose } from 'klinecharts'

const chart = init('chart') // HTMLElement or id; container needs width and height
chart.setSymbol({ ticker: 'BTCUSDT', pricePrecision: 2, volumePrecision: 0 })
chart.setPeriod({ span: 1, type: 'day' })
chart.setDataLoader({
  getBars: ({ callback }) => {
    callback([
      { timestamp: 1517846400000, open: 7424.6, high: 7511.3, low: 6032.3, close: 7310.1, volume: 224461 },
    ])
  }
})
// cleanup: dispose('chart')
```

**Required order:** `init` → `setSymbol` → `setPeriod` → `setDataLoader`

## Data model

```ts
// KLineData — all price/volume fields must be numbers
{ timestamp: number, open: number, high: number, low: number, close: number, volume?: number, turnover?: number }

// Period
{ span: 5, type: 'minute' }  // 5-minute bars; type: second | minute | hour | day | week | month | year

// SymbolInfo
{ ticker: string, pricePrecision: number, volumePrecision: number }
```

`timestamp` must be in **milliseconds**. `turnover` is only required for EMV and AVP indicators.

## Data loading (setDataLoader)

v10 uses `setDataLoader` instead of legacy data APIs. `getBars` may be `async`, but must always call `callback`.

```ts
chart.setDataLoader({
  getBars: ({ type, timestamp, symbol, period, callback }) => {
    // type: 'init' | 'forward' | 'backward'
    // init: first load, timestamp = null
    // forward: scrolled to left edge, timestamp = leftmost bar time
    // backward: scrolled to right edge, timestamp = rightmost bar time
    callback(bars, { forward: true, backward: false })
  },
  subscribeBar: ({ symbol, period, callback }) => {
    // fires after init; call callback with one KLineData per push
    // same timestamp → update last bar; larger timestamp → append
  },
  unsubscribeBar: ({ symbol, period }) => {
    // tear down WebSocket/polling on symbol/period change or dispose
  }
})
```

**Rules:**
- Always call `callback` from `getBars`, even on failure (pass `[]`)
- Bars sorted ascending by `timestamp`, no duplicates
- `subscribeBar` pushes one bar at a time, not an array
- `more` controls pagination: `boolean` or `{ forward?, backward? }`

Changing period or symbol: `chart.setPeriod(...)` or `chart.setSymbol(...)` reloads automatically.

## Framework integration

The container **must have explicit width and height**. Call `init` on mount, `dispose` on unmount, and `chart.resize()` on size changes.

```tsx
// React pattern
useEffect(() => {
  const chart = init(containerRef.current!)
  chart.setSymbol({ ticker: 'TEST', pricePrecision: 2, volumePrecision: 0 })
  chart.setPeriod({ span: 1, type: 'day' })
  chart.setDataLoader(loader)
  const ro = new ResizeObserver(() => chart.resize())
  ro.observe(containerRef.current!)
  return () => { ro.disconnect(); dispose(containerRef.current!) }
}, [])
```

CDN: `klinecharts.init(...)` / `klinecharts.dispose(...)`

## Indicators and overlays

```ts
chart.createIndicator('MACD')  // separate pane
chart.createIndicator('MA', { isStack: true, pane: { id: 'candle_pane' } })  // stack on main chart

chart.createOverlay('segment')  // interactive drawing
chart.createOverlay({ name: 'priceLine', points: [{ timestamp, value }] })  // programmatic
```

Built-in indicators stackable on the main chart: **BBI, BOLL, EMA, MA, SAR, SMA**

Runtime lookup: `getSupportedIndicators()` / `getSupportedOverlays()`

Custom types: `registerIndicator(...)` / `registerOverlay(...)` — register before `init`.

## Common instance APIs

| Method | Purpose |
|--------|---------|
| `setStyles(partial)` | Update styles (shallow merge) |
| `setPaneOptions(opts)` | Pane height/state |
| `overrideYAxis(opts)` | Y-axis position/ticks |
| `subscribeAction(type, cb)` | Crosshair, click, etc. |
| `scrollToRealTime()` | Scroll to latest bar |
| `getDataList()` | Current bar data |
| `resetData()` | Reload data |
| `getConvertPictureUrl()` | Export image |

Action types: `onCrosshairChange`, `onCandleBarClick`, `onZoom`, `onScroll`, `onVisibleRangeChange`, `onPaneDrag`

## Initial layout

```ts
init(container, {
  layout: {
    panes: [
      { type: 'candle' },
      { type: 'indicator', content: ['MA', 'VOL'] }
    ]
  },
  locale: 'zh-CN',
  timezone: 'Asia/Shanghai',
  styles: 'dark'
})
```

## v9 → v10 migration

| v9 (removed) | v10 |
|---|---|
| `applyNewData(data)` | `getBars` with type `'init'` |
| `updateData(bar)` | `subscribeBar` callback |
| `applyMoreData(data, more)` | `getBars` `'forward'` / `'backward'` |
| `setLoadDataCallback` | `setDataLoader` |
| `setPriceVolumePrecision` | `setSymbol({ pricePrecision, volumePrecision })` |
| `setCustomApi` | `setFormatter` |
| indicator `calc` returns array | `calc` returns `Record<timestamp, value>` |

## Troubleshooting

1. **No data** — called setSymbol/setPeriod/setDataLoader in order? did getBars call callback? is timestamp in ms?
2. **Pagination broken** — are `more.forward` / `more.backward` correct in callback?
3. **Realtime not updating** — does subscribeBar push one bar? is timestamp ≥ last bar?
4. **Stale data after symbol switch** — does unsubscribeBar close the old subscription?
5. **Blank container** — is width/height 0? was resize called?

## Further reading

- Copy-paste prompts: [prompts.md](prompts.md)
- Full examples: [examples.md](examples.md)
- API reference: [api-reference.md](api-reference.md)
- Official docs: https://klinecharts.com/guide/data-integration

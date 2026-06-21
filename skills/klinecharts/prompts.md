# Prompt templates

Copy these prompts into your coding assistant. They are written for KLineChart v10 conventions.

## Quick start

```
Create a K-line chart with klinecharts v10 in my project. Container id is chart; use static mock data first.
```

```
I already ran npm install klinecharts. Write a React component with full init/dispose/resize lifecycle.
```

## Data loading

```
Wire KLineChart setDataLoader:
- getBars calls REST GET /api/kline?symbol=&period=&endTime=&limit=
- subscribeBar uses WebSocket wss://...
- backend fields are t/o/h/l/c/v (seconds timestamp); normalize them for me
```

```
Implement KLineChart pagination when dragging left: getBars type=forward, return more.forward correctly.
```

```
KLineChart period switch for 1m/5m/1h/1d: button clicks call setPeriod; write the full logic.
```

## Indicators and styles

```
KLineChart: stack MA(5,10,20) and BOLL on the main chart; show MACD and VOL in separate panes below.
```

```
KLineChart dark theme: bullish candles #26A69A, bearish #EF5350, grid lines #292929.
```

```
Register a custom KLineChart indicator for N-day average price using registerIndicator + createIndicator.
```

## Drawing and interaction

```
KLineChart: listen to onCrosshairChange and show hovered OHLCV outside the chart panel.
```

```
KLineChart: onCandleBarClick show bar details and add a priceLine overlay at the current price.
```

## Migration and debugging

```
My project still uses klinecharts v9 applyNewData/updateData. Migrate to v10 setDataLoader.
```

```
KLineChart chart renders but shows no data. Debug setSymbol/setPeriod/setDataLoader setup.
```

```
KLineChart subscribeBar pushes data but the last bar does not update. Check timestamp merge logic.
```

## Framework-specific

Replace `[framework]` with React / Vue 3 / Angular / Svelte / vanilla JS:

```
Build a full K-line page with [framework] + klinecharts v10: period switcher, MA+VOL indicators, REST history + WebSocket realtime.
```

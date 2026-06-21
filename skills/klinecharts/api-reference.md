# KLineChart API Reference (v10)

## Global APIs

| API | Description |
|-----|-------------|
| `init(ds, options?)` | Create chart; `ds` is HTMLElement or element id |
| `dispose(ds)` | Destroy chart |
| `registerIndicator(template)` | Register custom indicator |
| `registerOverlay(template)` | Register custom overlay |
| `registerStyles(name, styles)` | Register style template |
| `registerLocale(locale, messages)` | Register locale |
| `getSupportedIndicators()` | Built-in indicator list |
| `getSupportedOverlays()` | Built-in overlay list |
| `getFigureClass(name)` | Get figure class (custom drawing) |

## Instance APIs (common)

**Data:** `setSymbol`, `setPeriod`, `setDataLoader`, `getDataList`, `resetData`

**Indicators:** `createIndicator`, `removeIndicator`, `overrideIndicator`, `getIndicators`

**Overlays:** `createOverlay`, `removeOverlay`, `getOverlays`, `overrideOverlay`

**Styles:** `setStyles`, `setFormatter`, `setLocale`, `setTimezone`

**Layout:** `setPaneOptions`, `overrideYAxis`, `overrideXAxis`, `getDom`, `getSize`, `resize`

**Interaction:** `scrollToRealTime`, `scrollByDistance`, `scrollToTimestamp`, `zoomAtCoordinate`, `setBarSpace`, `subscribeAction`, `unsubscribeAction`, `convertToPixel`, `convertFromPixel`, `getConvertPictureUrl`

## Built-in indicators

MA, EMA, SMA, BOLL, BBI, SAR, MACD, KDJ, RSI, VOL, OBV, BIAS, BRAR, CCI, CR, DMI, DMA, EMV, MTM, PSY, ROC, TRIX, VR, WR, AO, PVT, AVP

Stackable on main chart: BBI, BOLL, EMA, MA, SAR, SMA

## Built-in overlays

segment, straightLine, rayLine, horizontalStraightLine, horizontalRayLine, horizontalSegment, verticalStraightLine, verticalRayLine, verticalSegment, priceLine, priceChannelLine, parallelStraightLine, fibonacciLine, simpleAnnotation, simpleTag, brush

## setDataLoader parameters

```ts
getBars: ({ type, timestamp, symbol, period, callback }) => void | Promise<void>
// type: 'init' | 'forward' | 'backward'
// callback: (data: KLineData[], more?: boolean | { forward?, backward? }) => void

subscribeBar: ({ symbol, period, callback }) => void
// callback: (data: KLineData) => void

unsubscribeBar: ({ symbol, period }) => void
```

Official docs: https://klinecharts.com

# 🙋 FAQ

## After initializing the chart, why can I only see a single line?
The chart always fills its container, so first check whether the container has a height.

## The candlesticks look almost like a single line and there is no visible fluctuation. What should I do?
You need to set the precision when setting the symbol. Call `setSymbol({ ticker: 'TestSymbol', pricePrecision: 6, volumePrecision: 6 })`.

## How do I create a time-sharing chart?
Use style settings.

```javascript
chart.setStyles({
  candle: {
    type: 'area',
  },
});
```

## The data calculated by a built-in technical indicator is not what I want. What should I do?
You can override `calc` through the chart methods `createIndicator` or `overrideIndicator`.

## How do I create an indicator other than the built-in technical indicators?
The chart supports custom technical indicators. See [Indicators](/en-US/guide/indicator) for details.

## How can I mark buy and sell points?
You can use overlays. One built-in overlay is `simpleAnnotation`, which can be created through the chart API: `createOverlay({ name: 'simpleAnnotation', ... })`.

## Why is there no data on the chart at all?
Check the following first:

- Whether `getBars` actually calls `callback(data)`
- Whether `setSymbol(...)` and `setPeriod(...)` have been set
- Whether the returned data matches the `KLineData[]` structure
- Whether `timestamp` is in milliseconds

For details, see [Data integration](/en-US/guide/data-integration).

## Why is real-time data not updating?
It is usually one of the following reasons:

- `callback(bar)` is not called inside `subscribeBar`
- The pushed data is not a single `KLineData`
- The `timestamp` of the latest data is smaller than the current last bar
- The previous subscription is not released correctly after switching the symbol or period

## Why do duplicate K-lines appear?
This is usually caused by inconsistent pagination boundary handling, or because the backend returns data with duplicate timestamps. It is recommended to sort and deduplicate the data before passing it into `callback(...)`.

## Why does old data still flicker after switching the symbol or period?
Usually the old real-time subscription was not released correctly in `unsubscribeBar`. It is recommended to maintain the subscription handle and close it promptly when switching or destroying the chart.

## The displayed time is incorrect. Is it a timezone issue or a timestamp issue?
Both are common:

- If the overall time is shifted, first check whether `setTimezone(...)` needs to be set
- If only some data points are abnormal, first check whether timestamps were mistakenly passed in seconds instead of milliseconds

## Why are indicator values incorrect?
Besides the calculation logic itself, also check whether the input data fields are complete.

For example:

- Most indicators depend on `open / high / low / close / volume`
- `EMV` and `AVP` also depend on `turnover`

## Why didn't my style changes take effect?
It is recommended to check the following in order:

- Whether `styles` was passed during initialization, or `setStyles(...)` was called at runtime
- Whether the input is an incremental config, or the nesting level was written incorrectly
- Whether it was overridden again by later code

For details, see [Style configuration](/en-US/guide/styles).

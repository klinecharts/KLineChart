<script setup>
import Tip from '../../@components/Tip.vue'
</script>

# Data Integration
This document explains how to integrate historical and real-time data into the chart.

The core of data integration is:
- Call `setSymbol(...)` to set the symbol
- Call `setPeriod(...)` to set the period
- Call `setDataLoader(...)` to set the data loader

Among the three functions inside `setDataLoader(...)`:
- `getBars`: returns historical data, used for both initialization and pagination
- `subscribeBar`: starts pushing the latest data after historical data has finished loading
- `unsubscribeBar`: stops the real-time subscription when switching symbol, switching period, or destroying the chart

## Common Integration Scenarios

In real projects, you will usually encounter the following data source combinations:

- REST historical data + WebSocket real-time data
  - The most common approach
  - `getBars` requests the REST API
  - `subscribeBar` subscribes to WebSocket
- REST historical data + polling real-time data
  - Suitable when WebSocket is not available
  - `subscribeBar` uses `setInterval` internally to fetch the latest record regularly
- Local cache / in-memory data + incremental push
  - Suitable for replay, paper trading, and offline demos
  - `getBars` slices data from a local array
  - `subscribeBar` pushes the next bar as time advances

No matter where your data comes from, it eventually comes down to the same thing:

- Historical data returns `KLineData[]`
- Real-time data returns a single `KLineData`

## KLineData Structure

The historical data received by the chart must follow a fixed format. Both historical and real-time data in `setDataLoader` eventually need to be converted into this structure:

```ts
{
  // Timestamp in milliseconds, required field
  timestamp: number
  // Open price, required field
  open: number
  // Close price, required field
  close: number
  // High price, required field
  high: number
  // Low price, required field
  low: number
  // Volume, optional field
  volume: number
  // Turnover, optional field. Required if you need to display 'EMV' and 'AVP'
  turnover: number
}
```
<Tip title="Important" :tip="['<code>timestamp</code> must be a millisecond timestamp', '<code>timestamp</code>, <code>open</code>, <code>close</code>, <code>high</code>, <code>low</code>, <code>volume</code>, and <code>turnover</code> must all be numeric types']"/>

## Data Field Mapping Example

Your backend fields usually will not exactly match `KLineData`, so in most cases you should normalize them first.

Assume the backend returns:

```ts
{
  t: 1711425600,
  o: '68000.1',
  h: '68920.5',
  l: '67500.2',
  c: '68610.8',
  v: '1234.56'
}
```

It can be mapped like this:

```ts
function normalizeToKLineData(data: any) {
  return {
    timestamp: data.t * 1000,
    open: Number(data.o),
    high: Number(data.h),
    low: Number(data.l),
    close: Number(data.c),
    volume: Number(data.v),
  }
}
```

If your API returns an array, it is also recommended to apply `map(normalizeToKLineData)` before calling `callback(...)`.

## setDataLoader Implementation Notes
Among the three functions in `setDataLoader({ getBars, subscribeBar, unsubscribeBar })`, `getBars` must be implemented. If you do not need real-time updates, you may leave out `subscribeBar` and `unsubscribeBar`.

<Tip title="Special Note" :tip="['<code>getBars</code> is triggered only after the chart has confirmed that symbol and period are set, and the visible area requires data.']"/>

### getBars Fetches Historical Data (Including Pagination)

The `getBars` function in `setDataLoader` is responsible for fetching and returning historical data when needed.

The signature of `getBars` comes from the chart's internal data loading contract:

```ts
getBars: ({
  type,
  timestamp,
  symbol,
  period,
  callback
}: DataLoaderGetBarsParams) => void | Promise<void>
```

You can understand it as:

- The chart tells you which segment of data it needs right now
- You request the backend or cache
- You return the result through `callback(...)`

Key meanings:

- `type`
  - `init`: triggered after initialization or after switching symbol/period. At this time `timestamp = null`.
  - `forward`: used to load older data on the left boundary, usually triggered when dragging to the left boundary.
  - `backward`: used to load newer data on the right boundary, usually triggered when dragging to the right boundary.
  - The exact meaning depends on how your data API is implemented.
- `timestamp`
  - `forward`: usually the `timestamp` of the current leftmost bar
  - `backward`: usually the `timestamp` of the current rightmost bar
  - `init`: `null`
- `callback(data, more)`
  - `data`: `KLineData[]`
  - `more`: tells the chart whether there is more data on the left or right boundary
    - You can pass `boolean` to mean both sides are the same
    - Or pass an object `{ forward?: boolean, backward?: boolean }` to control each side separately

The most common implementations are:

- `init`: load a recent chunk of historical data
- `forward`: load older data using the left boundary `timestamp`
- `backward`: load newer data using the right boundary `timestamp`

If your API only supports backward pagination in one direction, you can start by correctly handling only `init` and `forward`.

#### How `more` Should Be Returned

The purpose of `more` is not to tell the chart "how much data was returned this time", but to tell it "whether there is more data in this direction".

For example:

- After requesting older data, if the backend can continue paging, return `callback(bars, { forward: true })`
- After requesting older data, if the earliest page has been reached, return `callback(bars, { forward: false })`
- If you do not need separate control for left and right, you can also return `callback(bars, false)`

A practical rule is:

- If the backend returns fewer items than your page size, that direction usually has no more data
- If the backend explicitly returns `hasMore` or `nextCursor`, prefer the backend result

#### getBars Data Merge
- `type: 'init'`: clears existing data and replaces it with the new array.
- `type: 'forward'`: prepends the new data to the front of the array to fill older bars on the left.
- `type: 'backward'`: appends the new data to the end of the array to fill newer bars on the right.
- `more` only affects whether future left/right pagination can continue to be triggered.

#### getBars Implementation Suggestions
- Do not return unsorted data directly from `getBars`
- Try to avoid returning duplicate timestamps
- If the API fails, at minimum do not catch the error and then return nothing
- If you have concurrent requests, it is best to keep only the latest result for the current symbol/period


### subscribeBar Subscribes to Real-Time Single-Record Updates

The chart calls `subscribeBar` only after the `init` callback of `getBars` has completed, which means after historical data is ready.

The signature of `subscribeBar`:

```ts
subscribeBar: ({
  symbol,
  period,
  callback
}: DataLoaderSubscribeBarParams) => void
```
Where:
- `callback(data: KLineData)`: when your real-time source receives one data record, normalize it into `KLineData` and return it to the chart.

<Tip title="Important" :tip="['Push only one record at a time. You do not need to push the entire array every time.', 'Make sure <code>data.timestamp</code> is a millisecond timestamp.', 'What you push is the record corresponding to the current period, not arbitrary trade details.', 'When time enters the next period, the newly pushed data should use a new <code>timestamp</code>.']"/>

#### subscribeBar Data Merge
When the chart receives one real-time K-line record, it merges it with the current last record based on `data.timestamp`:
- If `data.timestamp` is greater: append it as a new last record
- If `data.timestamp` is the same: overwrite the last record with the new value
- If `data.timestamp` is smaller: treat it as old data and ignore it without inserting


## unsubscribeBar Unsubscribes from Real-Time Data
When you call `setSymbol`, `setPeriod`, `resetData`, or `dispose` to reset or destroy the chart, the chart internally triggers `unsubscribeBar`.

Best practice:
- Maintain a Map of subscription handles or cleanup functions on the `dataLoader` side
- `subscribeBar` creates the subscription and stores the cleanup function
- `unsubscribeBar` retrieves the corresponding cleanup function and stops the push


## Pseudo-Code Example from a Real Business Scenario
The following example shows the typical idea of "REST for history + WebSocket for real-time":

```ts
chart.setDataLoader({
  async getBars({ type, timestamp, symbol, period, callback }) {
    const response = await api.getKlineList({
      symbol: symbol.ticker,
      period: `${period.span}${period.type}`,
      endTime: timestamp ?? Date.now(),
      limit: 500,
      direction: type,
    })

    const bars = response.list
      .map(normalizeToKLineData)
      .sort((a, b) => a.timestamp - b.timestamp)

    callback(bars, {
      forward: response.hasMoreBefore,
      backward: response.hasMoreAfter,
    })
  },

  subscribeBar({ symbol, period, callback }) {
    const key = makeKey(symbol, period)
    const ws = createWsConnection(symbol.ticker, period)

    ws.onmessage = (message) => {
      const bar = normalizeToKLineData(JSON.parse(message.data))
      callback(bar)
    }

    stopMap.set(key, () => ws.close())
  },

  unsubscribeBar({ symbol, period }) {
    const key = makeKey(symbol, period)
    stopMap.get(key)?.()
    stopMap.delete(key)
  },
})
```

## Quick Troubleshooting
1. No data on the chart at all
   - Make sure `getBars` definitely calls `callback(data)` and returns `KLineData[]`
   - Make sure `timestamp` is in milliseconds
   - Make sure `setSymbol` and `setPeriod` have been set
2. Pagination or dragging to the boundary no longer triggers loading
   - Check whether `more.forward/backward` is returned correctly in `callback(bars, more)`
3. Real-time data is not updating
   - Make sure `subscribeBar` really calls `callback(KLineData)`
   - Check whether the `timestamp` you push is smaller than the latest record's `timestamp`
4. After switching symbol, old data is still flashing
   - Usually the old real-time subscription was not released
5. Duplicate K-lines appear after paging left
   - Usually the pagination boundary timestamp is handled inconsistently, or the backend data contains duplicate timestamps
6. Indicator values are incorrect
   - First check whether `volume` and `turnover` are passed correctly

<script setup>
import Tip from '../@components/Tip.vue'
</script>

# 数据接入
本文档介绍把历史数据和实时数据接入到图表中。

数据接入核心就是：
- 调用 `setSymbol(...)` 设置交易对
- 调用 `setPeriod(...)` 设置周期
- 调用 `setDataLoader(...)` 设置数据加载器

其中 `setDataLoader(...)` 里面的三个函数：
- `getBars`：返回历史数据，初始化和分页都靠它
- `subscribeBar`：历史数据加载完成后，开始推送最新一条数据
- `unsubscribeBar`：切换交易对、切换周期或销毁图表时，停止实时订阅

## 常见接入场景

真实项目里，通常会遇到下面几种数据源组合：

- REST 历史数据 + WebSocket 实时数据
  - 最常见的方式
  - `getBars` 请求 REST 接口
  - `subscribeBar` 订阅 WebSocket
- REST 历史数据 + 轮询实时数据
  - 适合没有 WebSocket 的场景
  - `subscribeBar` 内部通过 `setInterval` 定时拉取最新一条数据
- 本地缓存/内存数据 + 增量推送
  - 适合回放、模拟盘、离线演示
  - `getBars` 从本地数组切片
  - `subscribeBar` 按时间推进推送下一根数据

无论你的数据来自哪里，最终都要落到同一件事上：

- 历史数据返回 `KLineData[]`
- 实时数据返回单根 `KLineData`

## KLineData 数据结构

图表接收的历史数据需要满足固定格式，`setDataLoader` 中的历史数据和实时数据最终都需要转换成这个结构：

```ts
{
  // 时间戳，毫秒级别，必要字段
  timestamp: number
  // 开盘价，必要字段
  open: number
  // 收盘价，必要字段
  close: number
  // 最高价，必要字段
  high: number
  // 最低价，必要字段
  low: number
  // 成交量，非必须字段
  volume: number
  // 成交额，非必须字段，如果需要展示技术指标 'EMV' 和 'AVP'，则需要为该字段填充数据
  turnover: number
}
```
<Tip title="重要" :tip="['<code>timestamp</code> 必须是毫秒级时间戳', '<code>timestamp</code> ， <code>open</code> ， <code>close</code> ， <code>high</code> ， <code>low</code> ， <code>volume</code> ， <code>turnover</code> 必须是数字类型']"/>

## 数据字段映射示例

你的后端字段通常不会刚好和 `KLineData` 一致，所以接入时一般要先做一次标准化。

假设后端返回：

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

可以映射成：

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

如果你的接口返回的是数组，也建议在进入 `callback(...)` 之前统一做一层 `map(normalizeToKLineData)`。

## setDataLoader 实现说明
`setDataLoader({ getBars, subscribeBar, unsubscribeBar })` 中的三个函数 `getBars` 是必须要实现的，如果你不需要实时更新，可以不实现 `subscribeBar` 和 `unsubscribeBar` 。

<Tip title="特别说明" :tip="['当图表内部确认已设置交易对与周期，并且可见区域需要数据时，才会触发 <code>getBars</code> 。']"/>

### getBars 拉取历史数据（含分页）

`setDataLoader` 的 `getBars` 负责在需要历史数据时拉取并回填。

`getBars` 的参数签名来自图表内部的数据加载契约：

```ts
getBars: ({
  type,
  timestamp,
  symbol,
  period,
  callback
}: DataLoaderGetBarsParams) => void | Promise<void>
```

你可以直接把它理解成：

- 图表告诉你“现在需要哪一段数据”
- 你去请求后端或缓存
- 你把结果通过 `callback(...)` 回传给图表

其中关键含义：

- `type`
  - `init`：初始化/切换交易对或周期后触发。此时 `timestamp = null`。
  - `forward`：用于向左边界补充更早的数据（拖到左侧边界触发）。
  - `backward`：用于向右边界补充更晚的数据（拖到右侧边界触发）。
  - 具体含义以你的数据接口实现为准。
- `timestamp`
  - `forward`：通常为当前最左一根数据的 `timestamp`
  - `backward`：通常为当前最右一根数据的 `timestamp`
  - `init`：为 `null`
- `callback(data, more)`
  - `data`：`KLineData[]`
  - `more`：用于告诉图表“左右边界是否还有更多数据”
    - 你可以传 `boolean`（表示左右都相同）
    - 或传对象 `{ forward?: boolean, backward?: boolean }` 分别控制左右

最常见的实现方式：

- `init`：拉取最近一段历史数据
- `forward`：根据左边界 `timestamp` 拉取更早的数据
- `backward`：根据右边界 `timestamp` 拉取更新的数据

如果你的接口只支持“向前翻页”，也可以先只正确处理 `init` 和 `forward`。

#### more 应该怎么返回

`more` 的作用不是告诉图表“本次返回了多少数据”，而是告诉图表“这个方向上后面还有没有更多数据”。

例如：

- 请求更早数据后，后端还能继续翻页，那么返回 `callback(bars, { forward: true })`
- 请求更早数据后，已经到最早一页，那么返回 `callback(bars, { forward: false })`
- 如果左右都不用单独控制，也可以直接返回 `callback(bars, false)`

一个实用判断方式是：

- 如果后端返回数量小于你的分页 size，通常可以认为这个方向已经没有更多数据
- 如果后端明确返回 `hasMore` / `nextCursor`，优先使用后端结果

#### getBars 数据合并
- `type: 'init'`：清空已有数据，并用新的数组覆盖当前数据。
- `type: 'forward'`：把新数据拼接到数组前面（补充左侧更早的 K 线）。
- `type: 'backward'`：把新数据拼接到数组后面（补充右侧更晚的 K 线）。
- `more` 只影响“后续还能否继续触发向左/向右分页加载”。

#### getBars 实现建议
- 不要在 `getBars` 里直接返回未排序的数据
- 尽量避免返回重复时间戳的数据
- 如果接口报错，至少保证不要把异常捕获后又什么都不返回
- 如果你有并发请求，最好只保留当前 symbol/period 的最新一次结果


### subscribeBar 订阅实时单条数据更新

图表在执行 `init` 的 `getBars` 回调完成后（也就是历史数据就绪后）才会调用 `subscribeBar`。

`subscribeBar` 的参数签名：

```ts
subscribeBar: ({
  symbol,
  period,
  callback
}: DataLoaderSubscribeBarParams) => void
```
其中：
- `callback(data: KLineData)`：当你的实时源收到一条数据时，把它标准化成 `KLineData` 并回传给图表。

<Tip title="重要" :tip="['一次只推送一条数据，不需要每次推整个数组。', '保证 <code>data.timestamp</code> 为毫秒级时间戳。', '推送的是“当前周期对应的那一条数据”，不是任意成交明细。', '当时间进入下一个周期后，再推送的新数据应该使用新的 <code>timestamp</code> 。']"/>

#### subscribeBar 数据合并
当图表收到一根实时 K 线时，会按 `data.timestamp` 与当前最后一根做合并：
- `data.timestamp` 更大：追加为新的最后一根
- `data.timestamp` 相同：用新值覆盖最后一根
- `data.timestamp` 更小：作为旧数据忽略（不进行插入）


## unsubscribeBar 取消实时订阅
当你调用 `setSymbol` / `setPeriod` / `resetData` / `dispose` 对图表进行重置或销毁时，图表内部会触发 `unsubscribeBar`。

最佳实践：
- 你的 `dataLoader` 侧维护一个“订阅句柄/关闭函数”的 Map
- `subscribeBar` 建立订阅并把关闭函数存起来
- `unsubscribeBar` 拿到对应关闭函数并停止推送


## 真实业务中的伪代码示例
下面这个示例展示了“REST 拉历史 + WebSocket 推实时”的典型思路：

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

## 常见问题快速排查
1. 图表没有任何数据
   - 确认 `getBars` 的实现里一定会调用 `callback(data)` 返回 `KLineData[]`
   - 确认 `timestamp` 是毫秒级
   - 确认 `setSymbol` 与 `setPeriod` 已设置
2. 分页/拖动到边界不再触发加载
   - `callback(bars, more)` 里检查 `more.forward/backward` 是否正确返回
3. 实时没有更新
   - 确认 `subscribeBar` 内部确实调用了 `callback(KLineData)`
   - 确认你推送的 `timestamp` 是否小于最新一条数据的 `timestamp`
4. 切换交易对后，旧数据还在闪动
   - 通常是旧的实时订阅没有释放
5. 向左翻页后出现重复 K 线
   - 通常是分页边界时间处理不一致，或后端数据包含重复时间戳
6. 技术指标数值不对
   - 先检查 `volume`、`turnover` 是否正确传递

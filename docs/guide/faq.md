# 🙋 常见问题

## 初始化图表后，只能看到一条线，是怎么回事？
图表总是会填充容器，检查一下容器是否有高度。

## 蜡烛柱显示趋近于一条线，看不到波动，怎么办？
在设置交易对的时候要设置精度，调用`setSymbol({ ticker: 'TestSymbol', pricePrecision: 6, volumePrecision: 6 })`。

## 分时图怎么创建？
通过样式设置。

```javascript
chart.setStyles({
  candle: {
    type: 'area',
  },
});
```

## 内置的技术指标，计算出来的数据不是想要的，怎么办？
可以通过图表方法`createIndicator`或者`overrideIndicator`重写`calc`即可。

## 想创建一个内置技术指标之外的指标，怎么办？
图表支持自定义技术指标，详情参阅[技术指标](/guide/indicator)。

## 想标记一下买卖点，该怎么做？
可以使用覆盖物，内置的覆盖物有一个`simpleAnnotation`，用图表api创建即可`createOverlay({ name: 'simpleAnnotation', ... })`。

## 图表为什么完全没有数据？
优先检查下面几项：

- `getBars` 是否真的调用了 `callback(data)`
- `setSymbol(...)` 和 `setPeriod(...)` 是否已设置
- 返回的数据是否符合 `KLineData[]` 结构
- `timestamp` 是否是毫秒级时间戳

详情可以参阅[数据接入](/guide/data-integration)。

## 实时数据为什么没有更新？
通常是以下原因之一：

- `subscribeBar` 中没有调用 `callback(bar)`
- 推送的不是单根 `KLineData`
- 最新数据的 `timestamp` 小于当前最后一根
- 切换交易对或周期后，旧订阅没有正确释放

## 为什么会出现重复 K 线？
一般是分页边界处理不一致，或者后端返回了重复时间戳的数据。建议在进入 `callback(...)` 前先做排序和去重。

## 为什么切换交易对或周期后，旧数据还在闪动？
通常是旧的实时订阅没有在 `unsubscribeBar` 中正确释放。建议维护订阅句柄，并在切换或销毁时及时关闭。

## 时间显示不对，是时区问题还是时间戳问题？
这两个问题都很常见：

- 如果时间整体偏移，优先检查是否需要设置 `setTimezone(...)`
- 如果只有部分数据异常，优先检查时间戳是否误传成秒级

## 为什么指标数值不对？
除了计算逻辑本身，还要检查输入数据字段是否完整。

例如：

- 大部分指标依赖 `open / high / low / close / volume`
- `EMV` 和 `AVP` 还依赖 `turnover`

## 为什么样式改了没有生效？
建议依次检查：

- 是在初始化时传了 `styles`，还是运行时调用了 `setStyles(...)`
- 传入的是增量配置，还是误把层级写错了
- 是否被后续代码再次覆盖

详情参阅[样式配置](/guide/styles)。

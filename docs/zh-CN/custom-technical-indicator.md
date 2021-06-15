# 自定义技术指标
## 开始
首先说明一下自定义技术指标各个属性
```js
{
  // 技术指标名字，必要字段，是技术指标的唯一标识
  name: 'xxx',

  // 技术指标计算方法，必要字段
  // 该字段是一个回调方法，回调参数是当前图表的源数据和计算的参数
  // kLineDataList 图表的原始数据
  // calcParams 计算参数
  // plots 技术指标数据配置项
  calcTechnicalIndicator: (kLineDataList, calcParams, plots) => { return [...] },

  // 精度，可缺省，默认为4
  precision: 4,

  // 技术指标系列，值为'price', 'volume'和'normal'
  // 当值为price时，价格设置价格精度时会影响该技术指标的精度
  // 当值为volume时，价格设置数量精度时会影响该技术指标的精度
  series: 'normal',

  // 计算参数，是一个数组，可缺省
  calcParams: [],

  // 数据配置项，是一个数组
  plots: [],

  // 是否需要检查计算参数，可缺省，默认为true
  // 如果为true，当设置指标参数时，如果参数个数和默认的参数个数不一致，将不能生效
  shouldCheckParamCount: true,

  // 是否需要格式化大数据值
  shouldFormatBigNumber: false,

  // 是否需要辅助ohlc线
  shouldOhlc: false,

  // 基础比对数据，可缺省
  // 如果设置，当图形是bar时，将在此值上下绘制，如：MACD指标的macd值
  baseValue: null,

  // 指定的最小值，可缺省
  // 如果设置，在计算y轴上最小值时将以此为准
  minValue: null,

  // 指定的最大值，可缺省
  // 如果设置，在计算y轴上最大值时将以此为准
  maxValue: null,

  // 样式，可缺省，缺省则同步样式配置
  styles: null,

  // 重新生成plots，是一个回调方法，可缺省
  // 当计算参数发生改变时触发
  // 返回值需要一个plots
  regeneratePlots: (params) => {},

  // 自定义渲染，可缺省，
  // ctx canvas上下文
  // dataSource 数据源，包含了原始的k线数据和计算出来的指标数据以及起始绘制点位置
  // viewport 一些绘图可能需要的一些参数
  // xAxisConvert x轴上值和坐标转换的方法
  // yAxisConvert y轴上值和坐标转换的方法
  // isCandleTechnicalIndicator 指标是否是在蜡烛图上
  render: (
    ctx,
    dataSource,
    viewport,
    styleOptions,
    xAxisConvert,
    yAxisConvert,
    isCandleTechnicalIndicator
  ) => {}
}
```
`plots`的每一项格式如下：
```js
{
  // 必要字段，决定方法calcTechnicalIndicator的返回值
  key: '',
  // 可缺省，主要用于提示
  title: '',
  // 可缺省，绘制类型，目前支持'line', 'circle'和'bar'
  type: '',
  // 可缺省，是个一个回调方法，可以根据回调参数来设置颜色，只有当type是'circle'和'bar'才会生效
  // 返回一个颜色值的字符串
  color: (data, options) => {}
  // 可缺省，是个一个回调方法，可以根据回调参数来设置是否是空心，只有当type是'circle'和'bar'才会生效
  // 返回一个boolean值
  isStroke: (data, options) => {}
}
```
`calcTechnicalIndicator`是一个方法，需要返回计算的数据，是一个数组，格式需要根据plots来确定，具体可以看示例说明。

## 示例
现在我们需要自定义一个叫`VOL`的技术指标，这个技术指标包含两条成交量的均线，分别是`ma5`，`ma10`，
另外还是需要一个描述成交量的矩形柱`volume`，因此该技术指标配置如下：
```js
{
  name: 'VOL',
  // 指定y轴上的最小值
  minValue: 0,
  // 设置两个技术参数，分别用来计算ma5和ma10
  calcParams: [5, 10]
  plots: [
    // 第一条线ma5
    {
      key: 'ma5',
      // 我们希望提示的显示的是  MA5: 'xxx'
      title: 'MA5',
      // 需要绘制的是线
      type: 'line'
    },
    // 第二条线ma10
    {
      key: 'ma10',
      title: 'MA5',
      type: 'line'
    },
    // 成交量矩形柱
    {
      key: 'volume',
      title: 'VOLUME',
      // 需要绘制的是矩形柱
      type: 'bar',
      // 这里我们想让矩形柱根据涨跌来显示不同的颜色
      color: (data, options) => {
        const kLineData = data.currentData.kLineData || {}
        if (kLineData.close > kLineData.open) {
           return options.bar.upColor
        } else if (kLineData.close < kLineData.open) {
           return options.bar.downColor
        }
        return options.bar.noChangeColor
      }
    }
  ],
  calcTechnicalIndicator: (dataList, calcParams, plots) => {
    const volSums = []
    // 注意：返回数据个数需要和dataList的数据个数一致，如果无值，用{}代替即可。
    // 计算参数最好取回调参数calcParams，如果不是，后续计算参数发生变化的时候，这里计算不能及时响应
    return dataList.map((kLineData, i) => {
      const volume = kLineData.volume || 0
      const vol = { volume }
      calcParams.forEach((param, j) => {
        volSums[j] = (volSums[j] || 0) + volume
        if (i >= param - 1) {
          vol[plots[j].key] = volSums[j] / param
          volSums[j] -= dataList[i - (param - 1)].volume
        }
      })
      // 如果有值的情况下，这里每一项的数据格式应该是 { ma5: xxx, ma10: xxx, volume: xxx }
      // 每个key需要和plots中的子项key对应的值一致
      return vol
    })
  }
}
```
以上就完成了一个自定义技术指标，可以通过`extension.addTechnicalIndicator`全局添加，也通过图表实例方法`addCustomTechnicalIndicator`为单个图表实例添加。添加到图表即可和内置技术指标一样去使用。

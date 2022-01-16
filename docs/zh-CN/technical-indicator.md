# 技术指标

## 默认技术指标
| **指标名** | **默认计算参数** | **指标名** | **默认计算参数** | **指标名** | **默认计算参数** |
| :---: | :---: | :---: | :---: | :---: | :---: |
| MA | [5, 10, 30, 60] | BIAS | [6, 12, 24] | VR | [24, 30] |
| EMA | [6, 12, 20] | BRAR | [26] | WR | [6, 10, 14] |
| SMA | [12, 2] | CCI | [13] | MTM | [6, 10] |
| BBI | [3, 6, 12, 24] | DMI | [14, 6] | EMV | [14, 9] |
| VOL | [5, 10, 20] | CR | [26, 10, 20, 40, 60] | SAR | [2, 2,  20] |
| MACD | [12, 26, 9] | PSY | [12, 6] | AO | [5, 34] |
| BOLL | [20] | DMA | [10, 50, 10] | ROC | [12, 6] |
| KDJ | [9, 3, 3] | TRIX | [12, 20] | PVT | 无 |
| RSI | [6, 12, 24] | OBV | [30] | AVP | 无 |



## 技术指标模板
想要完成一个自定义技术指标，只需要生成一个技术指标信息，然后通过`extension.addTechnicalIndicatorTemplate`全局添加，或者通过图表实例方法  `addTechnicalIndicatorTemplate`为单个图表实例添加即可。添加到图表即可和内置技术指标一样去使用。
### 属性说明
#### 技术指标信息
```javascript
{
  // 技术指标名字，必要字段，是技术指标的唯一标识
  name: 'xxx',

  // 用于提示显示
  shortName: 'xxx',

  // 技术指标计算方法，必要字段
  // 该字段是一个回调方法，回调参数是当前图表的源数据和计算的参数，需要返回一个数组或者一个promise
  // kLineDataList 图表的原始数据
  // params 计算参数
  // plots 技术指标数据配置项
  calcTechnicalIndicator: (kLineDataList, { params, plots }) => { return [] },

  // 系列
  series: 'normal',

  // 精度，可缺省，默认为4
  precision: 4,

  // 计算参数，是一个数组，可缺省，可以是数字也可以是`{ value, allowDecimal }`
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
  regeneratePlots: (params) => { return [] },

  // 生成tooltip显示的数据，返回格式`{ title: 'xxx', value: 'xxx', color: 'xxx' }`的数组，可缺省
  // dataSource 数据源
  // viewport 尺寸信息
  // crosshair 十字光标信息
  // technicalIndicator 技术指标信息
  // xAxis x轴
  // yAxis y轴
  // defaultStyles 默认样式
  createTooltipDataSource: ({
    dataSource,
    viewport,
    crosshair,
    technicalIndicator,
    xAxis,
    yAxis,
    defaultStyles
  }) => { return [] }

  // 自定义渲染，可缺省，
  // ctx canvas上下文
  // dataSource 数据源，包含了原始的k线数据和计算出来的指标数据以及起始绘制点位置
  // viewport 尺寸信息
  // styles 样式
  // xAxis x轴
  // yAxis y轴
  render: ({
    ctx,
    dataSource,
    viewport,
    styles,
    xAxis,
    yAxis
  }) => {}
}
```
#### Plots子项信息
```javascript
{
  // 必要字段，决定方法calcTechnicalIndicator的返回值
  key: '',
  // 可缺省，主要用于提示
  title: '',
  // 可缺省，绘制类型，目前支持'line', 'circle'和'bar'
  type: '',
  // 基础比对数据，可缺省
  // 如果设置，当图形是bar时，将在此值上下绘制，如：MACD指标的macd值
  baseValue: null,
  // 可缺省
  // 可以是一个固定的值，也可以是一个方法，如果是方法，需要返回一个颜色值的字符串
  color: (data, options) => {},
  // 可缺省，只有当type是'circle'和'bar'才会生效
  // 可以是一个固定的boolean值，也可以是一个方法，如果是方法，需要返回一个boolean值
  isStroke: (data, options) => {}
}
```


### 示例
以下将以一个名为'MA'技术指标，一步步的介绍如何去做技术指标模板。
#### 步骤一
首先确定计算参数(calcParams)和配置项(plots)，'MA'技术指标需要展示两个周期的收盘价平均值连起来的线，一条为'ma1'，一条名为'ma2'。因此plots配置为：
```javascript
{
  // 计算参数是2个，一个计算5个周期时间的均值，即'ma1'，另一个计算10个周期时间的均值，即'ma10'
  calcParams: [5, 10],
  plots: [
    // 第一条线'ma5'
    { key: 'ma1', title: 'MA5: ', type: 'line' },
    // 第二条线'ma10'
    { key: 'ma2', title: 'MA10: ', type: 'line' }
  ]
}
```
#### 步骤二
确定其它属性
```javascript
{
  name: 'MA',
  shortName: 'MA',
  calcParams: [5, 10],
  plots: [
    { key: 'ma1', title: 'MA5: ', type: 'line' },
    { key: 'ma2', title: 'MA10: ', type: 'line' }
  ],
  // 当计算参数改变时，希望提示的和参数一样，即title的值需要改变
  regeneratePlots: (params) => {
    return params.map((p, i) => {
      return { key: `ma${i + 1}`, title: `MA${p}: `, type: 'line' }
    })
  },
  // 计算结果
  calcTechnicalIndicator: (kLineDataList, { params, plots }) => {
    // 注意：返回数据个数需要和kLineDataList的数据个数一致，如果无值，用{}代替即可。
    // 计算参数最好取回调参数params，如果不是，后续计算参数发生变化的时候，这里计算不能及时响应
    const closeSums = []
    return kLineDataList.map((kLineData, i) => {
      const ma = {}
      const close = kLineData.close
      params.forEach((param, j) => {
        closeSums[j] = (closeSums[j] || 0) + close
        if (i >= param - 1) {
          ma[plots[j].key] = closeSums[j] / param
          closeSums[j] -= dataList[i - (param - 1)].close
        }
      })
      // 如果有值的情况下，这里每一项的数据格式应该是 { ma1: xxx, ma2: xxx }
      // 每个key需要和plots中的子项key对应的值一致
      return ma
    })
  }
}
```



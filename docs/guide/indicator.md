# 技术指标
本文档介绍了图表内置的技术指标和如何自定义一个技术指标。

## 内置技术指标
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


## 自定义技术指标
创建一个自定义技术指标，只需要生成一个技术指标信息，然后通过`klinecharts.registerIndicator`全局添加，添加到图表即可和内置技术指标一样去使用。

### 属性说明
```typescript
{
  // 指标名
  name: string
  // 指标简短名称，用于显示，缺省将显示name
  shortName?: string
  // 精度，默认为4
  precision?: number
  // 计算参数
  calcParams?: any[]
  // 是否需要ohlc
  shouldOhlc?: boolean
  // 是否需要格式化大数据值，从1000开始格式化，比如100000是否需要格式化100K
  shouldFormatBigNumber?: boolean
  // 是否可见
  visible?: boolean
  // 层级
  zLevel?: number
  // 扩展数据
  extendData?: any
  // 系列，默认为'normal'
  series?: 'normal' | 'price' | 'volume'
  // 数据信息
  figures?: Array<{
    // 用于取计算结果中值
    key: string
    // 用于tooltip显示
    title?: string
    // 图形类型
    type?: string
    // 基准值，如果给定，将以这个值上下去绘制，一般用于type是'rect'
    baseValue?: number
    // 是一个方法，用于生成自定义图形的属性，
    attrs?: ({
      data: IndicatorFigureAttrsCallbackData
      coordinate: IndicatorFigureAttrsCallbackCoordinate
      bounding: Bounding
      barSpace: BarSpace
      xAxis: XAxis
      yAxis: YAxis
    }) => IndicatorFigureAttrs
    // 是一个方法，用于生成样式
    styles?: (
      data: {
        // 上一个图形的数据
        prev: {
          // k线数据，类型参阅[数据源]
          kLineData?: KLineData
          // 技术指标数据
          indicatorData?: any
        }
        // 当前图形的数据
        current: {
          kLineData?: KLineData
          indicatorData?: any
        }
        // 下一个图形的数据
        next: {
          kLineData?: KLineData
          indicatorData?: any
        }
      },
      // 技术图表实例
      indicator: Indicator
      // 默认的技术指标样式，即全局设置的技术指标样式，参阅[样式]中的indicator
      defaultStyles: IndicatorStyle
    ) => IndicatorFigureStyle
  }>
  // 指定的最小值，默认null
  minValue?: number
  // 指定的最大值，默认null
  maxValue?: number
  // 样式，支持增量，默认为null，类型参阅[样式]中的indicator
  styles?: IndicatorStyle
  // 计算方法，可以是一个promise
  calc: (
    // 数据源，类型参阅[数据源]
    dataList: KLineData[],
    // 技术指标实例
    indicator: Indicator
  ) => Promise<Array<any>> | Array<any>
  // 重新生成数图形配置方法，会在计算参数发生变化后触发，返回类型参阅figures，默认为null
  regenerateFigures?: (
    // 计算参数
    calcParms: any[]
  ) => Array<IndicatorFigure<D>>
  // 创建自定义提示文字
  createTooltipDataSource?: (params: {
    // 数据源，类型参阅[数据源]
    kLineDataList: KLineData[]
    // 技术指标实例
    indicator: Indicator
    // 可见区域信息
    visibleRange: {
      // 起点数据索引
      from: number
      // 终点数据索引
      to: number
      // 实际起点数据索引
      realFrom: number
      // 实际终点数据索引
      realTo: number
    },
    // 窗口尺寸信息
    bounding: {
      // 宽
      width: number
      // 高
      height: number
      // 距离左边距离
      left: number
      // 距离右边距离
      right: number
      // 距离顶部距离
      top: number
      // 距离底部距离
      bottom: number
    },
    // 十字光标的信息
    crosshair: {
      // 十字光标交叉点所在的窗口id
      paneId?: string
      // 真实的x坐标
      realX?: number
      // k线数据，类型参阅[数据源]
      kLineData?: KLineData
      // 数据索引
      dataIndex?: number
      // 真实数据索引
      realDataIndex?: number
    }
    // 默认的技术指标样式，即全局设置的技术指标样式，参阅[样式]中的indicator
    defaultStyles: IndicatorStyle
    // x轴组件，内置一些转换方法
    xAxis: XAxis
    // y轴组件，内置一些转换方法
    yAxis: YAxis
  }) => ({
    // 名字
    name?: string
    // 计算参数文字，如果name无值，则不会显示
    calcParamsText?: string
    // 值信息
    values?: Array<{
      title: string | {
        text: string
        color: string
      }
      value: string | {
        text: string
        color: string
      }
    }>
  }),
  // 自定义绘制，如果返回true，则figures配置的图形不会绘制
  draw?: (params: {
    // 画布上下文
    ctx: CanvasRenderingContext2D
    // 数据源，类型参阅[数据源]
    kLineDataList: KLineData[]
    // 技术指标实例
    indicator: Indicator
    // 可见区域信息
    visibleRange: {
      // 起点数据索引
      from: number
      // 终点数据索引
      to: number,
      // 实际起点数据索引
      realFrom: number
      // 实际终点数据索引
      realTo: number
    },
    // 窗口尺寸信息
    bounding: {
      // 宽
      width: number
      // 高
      height: number
      // 距离左边距离
      left: number
      // 距离右边距离
      right: number
      // 距离顶部距离
      top: number
      // 距离底部距离
      bottom: number
    },
    // 蜡烛柱的尺寸信息
    barSpace: {
      // 蜡烛柱尺寸
      bar: number
      halfBar: number
      // 蜡烛柱不包含蜡烛柱之间间隙的尺寸
      gapBar: number
      halfGapBar: number
    },
    // 默认的技术指标样式，即全局设置的技术指标样式，参阅[样式]中的indicator
    defaultStyles: IndicatorStyle
    // x轴组件，内置一些转换方法
    xAxis: XAxis
    // y轴组件，内置一些转换方法
    yAxis: YAxis
  }) => boolean
}
```

### 示例
以一个名为'MA'技术指标，介绍如何去做自定义技术指标。
#### 步骤一
首先确定计算参数(calcParams)和配置项(figures)，'MA'技术指标需要展示两个周期的收盘价平均值连起来的线，一条为'ma1'，一条名为'ma2'。因此figures配置为：
```javascript
{
  // 计算参数是2个，一个计算5个周期时间的均值，即'ma1'，另一个计算10个周期时间的均值，即'ma10'
  calcParams: [5, 10],
  figures: [
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
  figures: [
    { key: 'ma1', title: 'MA5: ', type: 'line' },
    { key: 'ma2', title: 'MA10: ', type: 'line' }
  ],
  // 当计算参数改变时，希望提示的和参数一样，即title的值需要改变
  regenerateFigures: (params) => {
    return params.map((p, i) => {
      return { key: `ma${i + 1}`, title: `MA${p}: `, type: 'line' }
    })
  },
  // 计算结果
  calc: (kLineDataList, { calcParams, figures }) => {
    // 注意：返回数据个数需要和kLineDataList的数据个数一致，如果无值，用{}代替即可。
    // 计算参数最好取回调参数calcParams，如果不是，后续计算参数发生变化的时候，这里计算不能及时响应
    const closeSums = []
    return kLineDataList.map((kLineData, i) => {
      const ma = {}
      const close = kLineData. close
      calcParams.forEach((param, j) => {
        closeSums[j] = (closeSums[j] || 0) + close
        if (i >= param - 1) {
          ma[figures[j].key] = closeSums[j] / param
          closeSums[j] -= kLineDataList[i - (param - 1)].close
        }
      })
      // 如果有值的情况下，这里每一项的数据格式应该是 { ma1: xxx, ma2: xxx }
      // 每个key需要和figures中的子项key对应的值一致
      return ma
    })
  }
}
```

这样一个自定义指标就完成了。



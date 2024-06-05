# Technical indicator
This document introduces the built-in technical indicators in the chart and how to customize a technical indicator.

## Built-in technical indicators
| **Name** | **Default calc params** | **Name** | **Default calc params** | **Name** | **Default calc params** |
| :---: | :---: | :---: | :---: | :---: | :---: |
| MA | [5, 10, 30, 60] | BIAS | [6, 12, 24] | VR | [24, 30] |
| EMA | [6, 12, 20] | BRAR | [26] | WR | [6, 10, 14] |
| SMA | [12, 2] | CCI | [13] | MTM | [6, 10] |
| BBI | [3, 6, 12, 24] | DMI | [14, 6] | EMV | [14, 9] |
| VOL | [5, 10, 20] | CR | [26, 10, 20, 40, 60] | SAR | [2, 2, 20] |
| MACD | [12, 26, 9] | PSY | [12, 6] | AO | [5, 34] |
| BOLL | [20] | DMA | [10, 50, 10] | ROC | [12, 6] |
| KDJ | [9, 3, 3] | TRIX | [12, 20] | PVT | None |
| RSI | [6, 12, 24] | OBV | [30] | AVP | None |


## Custom Technical Indicators
To create a custom technical indicator, you only need to generate a technical indicator information, and then add it globally through `klinecharts.registerIndicator`, add it to the chart and use it like the built-in technical indicator.

### Attribute description
```typescript
{
  // indicator name
  name: string
  // The short name of the indicator, used for display, the name will be displayed by default
  shortName?: string
  // precision, default is 4
  precision?: number
  // calculation parameter
  calcParams?: any[]
  // Do you need ohlc
  shouldOhlc?: boolean
  // Do you need to format large data values, starting from 1000, for example, do you need to format 100K for 100000
  shouldFormatBigNumber?: boolean
  // Do you need visible
  visible?: boolean
  // z level
  zLevel?: number
  // extended data
  extendData?: any
  // series, default is 'normal'
  series?: 'normal' | 'price' | 'volume'
  // Data information
  figures?: Array<{
    // Used to get the median value of the calculation result
    key: string
    // for tooltip display
    title?: string
    // graphic type
    type?: string
    // Base value, if given, it will be drawn up and down with this value, generally used when the type is 'rect'
    baseValue?: number
    // is a method
    attrs?: ({
      data: IndicatorFigureAttrsCallbackData
      coordinate: IndicatorFigureAttrsCallbackCoordinate
      bounding: Bounding
      barSpace: BarSpace
      xAxis: XAxis
      yAxis: YAxis
    }) => IndicatorFigureAttrs
    // is a method
    styles?: (
      data: {
        // The data of the previous graph
        prev: {
          // k-line data, type refer to [data source]
          kLineData?: KLineData,
          // technical indicator data
          indicatorData?: any
        },
        // data of the current graph
        current: {
          kLineData?: KLineData
          indicatorData?: any
        },
        // Data for the next graph
        next: {
          kLineData?: KLineData,
          indicatorData?: any
        }
      },
      // technical chart example
      indicator: Indicator
      // The default technical indicator style, that is, the technical indicator style set globally, refer to the indicator in [Style]
      defaultStyles: IndicatorStyle
    ) => IndicatorFigureStyle
  }>,
  // The specified minimum value, default null
  minValue?: number
  // The specified maximum value, default null
  maxValue?: number
  // style, support increment, default is null, type refer to indicator in [style]
  styles?: IndicatorStyle
  // calculation method, can be a promise
  calc: (
    // data source, see [data source] for type
    dataList: KLineData[],
    // technical indicator example
    indicator: indicator
  ) => Promise<Array<any>> | Array<any>
  // Regenerate figure graphic configuration method, which will be triggered after the calculation parameters change, refer to figures for the return type, the default is null
  regenerateFigures?: (
    // calculation parameter
    calcParms: any[]
  ) => Array<IndicatorFigure<D>>
  // Create a custom hint text
  createTooltipDataSource?: (params: {
    // data source, see [data source] for type
    kLineDataList: KLineData[]
    // technical indicator example
    indicator: Indicator
    // Visible area information
    visibleRange: {
      // start data index
      from: number
      // end data index
      to: number
      // real start data index
      realFrom: number
      // real end data index
      realTo: number
    },
    // window size information
    bounding: {
      // width
      width: number
      // high
      height: number
      // distance to the left
      left: number
      // distance to the right
      right: number
      // distance from top
      top: number
      // distance from bottom
      bottom: number
    },
    // Information about the cross cursor
    crosshair: {
      // The window id where the cross point of the cross cursor is located
      paneId?: string
      // real x coordinate
      realX?: number
      // k-line data, type refer to [data source]
      kLineData?: KLineData
      // data index
      dataIndex?: number
      // real data index
      realDataIndex?: number
    },
    // The default technical indicator style, that is, the technical indicator style set globally, refer to the indicator in [Style]
    defaultStyles: IndicatorStyle
    // x-axis component, some built-in conversion methods
    xAxis: XAxis
    // y-axis component, with some built-in conversion methods
    yAxis: YAxis
  }) => ({
    // name
    name?: string
    // Calculate the parameter text, if name has no value, it will not be displayed
    calcParamsText?: string
    // value information
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
  // Custom drawing, if true is returned, the graphics configured by figures will not be drawn
  draw?: (params: {
    // canvas context
    ctx: CanvasRenderingContext2D
    // data source, see [data source] for type
    kLineDataList: KLineData[]
    // technical indicator example
    indicator: Indicator
    // Visible area information
    visibleRange: {
      // start data index
      from: number
      // endpoint data index
      to: number
    },
    // window size information
    bounding: {
      // width
      width: number
      // high
      height: number
      // distance to the left
      left: number
      // distance to the right
      right: number
      // distance from top
      top: number
      // distance from bottom
      bottom: number
    },
    // information about the size of the candlestick
    barSpace: {
      // candlestick size
      bar: number
      halfBar: number
      // candlesticks do not include dimensions of gaps between candlesticks
      gapBar: number
      halfGapBar: number
    },
    // The default technical indicator style, that is, the technical indicator style set globally, refer to the indicator in [Style]
    defaultStyles: IndicatorStyle
    // x-axis component, some built-in conversion methods
    xAxis: XAxis
    // y-axis component, with some built-in conversion methods
    yAxis: YAxis
  }) => boolean
}
```

#### Step.1
First determine the calculation parameters (calcParams) and configuration items (figures). The 'MA' technical indicator needs to display the line connecting the average closing price of the two periods, one is 'ma1' and the other is 'ma2'. So figures are configured as:
```javascript
{
   // The calculation parameters are 2, one calculates the mean value of 5 cycle times, namely 'ma1', and the other calculates the mean value of 10 cycle times, namely 'ma10'
   calcParams: [5, 10],
   figures: [
     // first line 'ma5'
     { key: 'ma1', title: 'MA5: ', type: 'line' },
     // second line 'ma10'
     { key: 'ma2', title: 'MA10: ', type: 'line' }
   ]
}
```
#### Step.2
Determine other attributes
```javascript
{
   name: 'MA',
   shortName: 'MA',
   calcParams: [5, 10],
   figures: [
     { key: 'ma1', title: 'MA5: ', type: 'line' },
     { key: 'ma2', title: 'MA10: ', type: 'line' }
   ],
   // When the calculation parameters are changed, it is hoped that the prompt is the same as the parameters, that is, the value of title needs to be changed
   regenerateFigures: (params) => {
     return params. map((p, i) => {
       return { key: `ma${i + 1}`, title: `MA${p}: `, type: 'line' }
     })
   },
   // Calculation results
   calc: (kLineDataList, { calcParams, figures }) => {
     // Note: The number of returned data needs to be consistent with the number of data in kLineDataList. If there is no value, replace it with {}.
     // It is best to take the callback parameter calcParams as the calculation parameter. If not, when the subsequent calculation parameters change, the calculation here cannot respond in time
     const closeSums = []
     return kLineDataList. map((kLineData, i) => {
       const ma = {}
       const close = kLineData. close
       calcParams.forEach((param, j) => {
         closeSums[j] = (closeSums[j] || 0) + close
         if (i >= param - 1) {
           ma[figures[j].key] = closeSums[j] / param
           closeSums[j] -= kLineDataList[i - (param - 1)].close
         }
       })
       // If there is a value, the data format of each item here should be { ma1: xxx, ma2: xxx }
       // Each key needs to be consistent with the value corresponding to the subkey in figures
       return ma
     })
   }
}
```

So a custom indicator is completed.
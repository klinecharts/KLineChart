# Technical indicator

## Default technical indicators
| **Indicator name** | **Default calculation parameters** | **Indicator name** | **Default calculation parameters** | **Indicator name** | **Default calculation parameters** |
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



## Custom technical indicator
To complete a custom technical indicator, you only need to generate a technical indicator information, and then add it globally through `extension.addTechnicalIndicator`, or add it for a single chart instance through the chart instance method `addCustomTechnicalIndicator`. Adding to the chart can be used like the built-in technical indicators.
### Property description
#### Technical indicator information
```javascript
{
  // The name of the technical indicator, a necessary field, is the only identifier of the technical indicator
  name:'xxx',

  // Technical indicator calculation method, necessary fields
  // This field is a callback method, the callback parameters are the source data and calculated parameters of the current chart, and an array needs to be returned
  // kLineDataList chart raw data
  // calcParams calculation parameters
  // plots technical indicator data configuration item
  calcTechnicalIndicator: (kLineDataList, calcParams, plots) => {return [] },

  // Precision, can be the default, the default is 4
  precision: 4,

  // Technical indicator series, values are'price','volume' and'normal'
  // When the value is price, the price setting price accuracy will affect the accuracy of the technical indicator
  // When the value is volume, the price setting quantity accuracy will affect the accuracy of the technical indicator
  series:'normal',

  // The calculation parameter is an array, which can be defaulted
  calcParams: [],

  // The data configuration item is an array
  plots: [],

  // Do you need to check the calculation parameters, you can default it, the default is true
  // If true, when setting indicator parameters, if the number of parameters is inconsistent with the default number of parameters, it will not take effect
  shouldCheckParamCount: true,

  // Do you need to format big data values
  shouldFormatBigNumber: false,

  // Do you need auxiliary ohlc line
  shouldOhlc: false,

  // Basic comparison data, default
  // If set, when the graph is bar, it will be drawn above and below this value, such as: the macd value of the MACD indicator
  baseValue: null,

  // The specified minimum value, which can be defaulted
  // If set, this will prevail when calculating the minimum value on the y-axis
  minValue: null,

  // The specified maximum value can be defaulted
  // If set, this will prevail when calculating the maximum value on the y-axis
  maxValue: null,

  // Style, can be the default, the default is to synchronize the style configuration
  styles: null,

  // Regenerate plots, which is a callback method, which can be defaulted
  // trigger when the calculation parameter changes
  // The return value needs a plots
  regeneratePlots: (params) => {return [] },

  // Custom rendering, can be defaulted,
  // ctx canvas context
  // dataSource data source, including the original bar data and calculated indicator data as well as the starting point of drawing
  // viewport some parameters that may be required for drawing
  // xAxisConvert x-axis value and coordinate conversion method
  // yAxisConvert y-axis value and coordinate conversion method
  // IsCandleTechnicalIndicator indicator is on candlestick chart
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
#### Plots sub-item information
```javascript
{
  // Required fields, determine the return value of the method calcTechnicalIndicator
  key:'',
  // Can be defaulted, mainly for prompt
  title:'',
  // Default, drawing type, currently supports'line','circle' and'bar'
  type:'',
  // It can be defaulted. It is a callback method. The color can be set according to the callback parameters. It will only take effect when the type is'circle' and'bar'
  // Return a string of color values
  color: (data, options) => {},
  // It can be defaulted, it is a callback method, you can set whether it is hollow according to the callback parameters, and it will take effect only when the type is'circle' and'bar'
  // return a boolean value
  isStroke: (data, options) => {}
}
```


### Example
The following will customize a technical indicator named 'MA' to introduce step by step how to make a custom technical indicator.
#### step one
First determine the calculation parameters (calcParams) and configuration items (plots). The 'MA' technical indicator needs to display the line connecting the average closing prices of the two periods, one is 'ma1' and the other is called 'ma2'. So the plots configuration is:
```javascript
{
  // There are two calculation parameters, one calculates the average value of 5 cycle times, namely'ma1', and the other calculates the average value of 10 cycle times, namely'ma10'
  calcParams: [5, 10],
  plots: [
    // the first line'ma5'
    { key: 'ma1', title: 'MA5: ', type: 'line' },
    // second line'ma10'
    { key: 'ma2', title: 'MA10: ', type: 'line' }
  ]
}
```
#### Step two
Determine other attributes
```javascript
{
  name:'MA',
  calcParams: [5, 10],
  plots: [
    {key:'ma1', title:'MA5: ', type:'line' },
    {key:'ma2', title:'MA10: ', type:'line'}
  ],
  // When the calculation parameters are changed, I hope that the prompt is the same as the parameters, that is, the value of the title needs to be changed
  regeneratePlots: (params) => {
    return params.map((p, i) => {
      return { key: `ma${i + 1}`, title: `MA${p}: `, type:'line' }
    })
  },
  // Calculation results
  calcTechnicalIndicator: (kLineDataList, calcParams, plots) => {
    // Note: The number of returned data needs to be consistent with the number of data in kLineDataList. If there is no value, just use {} instead.
    // The calculation parameter is best to take the callback parameter calcParams, if not, when the subsequent calculation parameters change, the calculation here cannot respond in time
    const closeSums = []
    return kLineDataList.map((kLineData, i) => {
      const ma = {}
      const close = kLineData.close
      calcParams.forEach((param, j) => {
        closeSums[j] = (closeSums[j] || 0) + close
        if (i >= param-1) {
          ma[plots[j].key] = closeSums[j] / param
          closeSums[j] -= dataList[i-(param-1)].close
        }
      })
      // If there is a value, the data format of each item here should be {ma1: xxx, ma2: xxx}
      // Each key needs to be consistent with the value corresponding to the sub-item key in plots
      return ma
    })
  }
}
```

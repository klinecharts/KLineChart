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



## Technical indicator template
To complete a technical indicator template, you only need to generate a technical indicator information, and then add it globally through `extension.addTechnicalIndicatorTemplate`, or add it for a single chart instance through the chart instance method `addTechnicalIndicatorTemplate`. Adding to the chart can be used like the built-in technical indicators.
### Property description
#### Technical indicator information
```javascript
{
  // The name of the technical indicator, a necessary field, is the only identifier of the technical indicator
  name:'xxx',

  // For tooltip display
  shortName: 'xxx',

  // Technical indicator calculation method, necessary fields
  // This field is a callback method, the callback parameters are the source data and calculated parameters of the current chart, and an array needs to be returned
  // kLineDataList chart raw data
  // params calculation parameters
  // plots technical indicator data configuration item
  calcTechnicalIndicator: (kLineDataList, { params, plots }) => {return [] },

  // Series, can be the default
  series: 'normal',

  // Precision, can be the default, the default is 4
  precision: 4,

  // The calculation parameter is an array, which can be defaulted, number or { value, allowDecimal }
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
  // styles style
  // xAxis x-axis component
  // yAxis y-axis component
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
#### Plots sub-item information
```javascript
{
  // Required fields, determine the return value of the method calcTechnicalIndicator
  key: '',
  // By default, mainly for prompt
  title: '',
  // By default, drawing type, currently supports'line','circle' and'bar'
  type: '',
  // By default, basic comparison data
  // If set, when the graph is bar, it will be drawn above and below this value, such as: the macd value of the MACD indicator
  baseValue: null,
  // By default
  // Can be value or method, if it is a method, it needs to return a string of color values
  color: (data, options) => {},
  // By default, it only takes effect when type is 'circle' and 'bar'
  // Can be a fixed boolean value or a method, if it is a method, it needs to return a boolean value
  isStroke: (data, options) => {}
}
```


### Example
The following a technical indicator named 'MA' to introduce step by step how to make a technical indicator template.
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
  calcTechnicalIndicator: (kLineDataList, { params, plots }) => {
    // Note: The number of returned data needs to be consistent with the number of data in kLineDataList. If there is no value, just use {} instead.
    // The calculation parameter is best to take the callback parameter calcParams, if not, when the subsequent calculation parameters change, the calculation here cannot respond in time
    const closeSums = []
    return kLineDataList.map((kLineData, i) => {
      const ma = {}
      const close = kLineData.close
      params.forEach((param, j) => {
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

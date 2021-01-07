# Custom technical indicators
## Start
First explain the attributes of custom technical indicators.
```js
{
  // The name of the technical indicator, a necessary field, is the only identifier of the technical indicator
  name: 'xxx',

  // Technical indicator calculation method, necessary fields
  // This field is a callback method, and the callback parameters are the source data and calculated parameters of the current chart
  // kLineDataList: chart raw data
  // calcParams: calculation parameters
  // plots: technical indicator data configuration item
  calcTechnicalIndicator: (kLineDataList, calcParams, plots) => { return [...] },

  // Precision, can be the default, the default is 4
  precision: 4,

  // Technical indicator series, values are'price','volume' and'normal'
  // When the value is price, the price setting price accuracy will affect the accuracy of the technical indicator
  // When the value is volume, the price setting quantity accuracy will affect the accuracy of the technical indicator
  series: 'normal',

  // The calculation parameter is an array, which can be defaulted
  calcParams: [],

  // The data configuration item is an array
  plots: [],

  // Do you need to check the calculation parameters? It can be defaulted. The default is true.
  // If true, when setting indicator parameters, if the number of parameters is inconsistent with the default number of parameters, it will not take effect
  shouldCheckParamCount: true,

  // Do you need to format big data values
  shouldFormatBigNumber: false,

  // Do you need auxiliary ohlc line
  shouldOhlc: false,

  // Basic comparison data, default
  // If set, when the graph is bar, it will be drawn above and below this value, such as: the macd value of the MACD indicator
  baseValue: null,

  // The specified minimum value, which can be defaulted.
  // If set, this will prevail when calculating the minimum value on the y-axis.
  minValue: null,

  // The specified maximum value can be defaulted.
  // If set, this will prevail when calculating the maximum value on the y-axis.
  maxValue: null,

  // Style, can be the default, the default is to synchronize the style configuration
  styles: null,

  // Regenerate plots, which is a callback method, which can be defaulted.
  // Trigger when the calculation parameter changes.
  // The return value needs a plots.
  regeneratePlots: (params) => {},

  // Custom rendering, can be defaulted,
  // ctx: canvas context
  // dataSource: data source, including the original bar data and calculated indicator data as well as the starting point position
  // viewport: some parameters that may be required for drawing
  // xAxisConvert: x-axis value and coordinate conversion method
  // yAxisConvert: y-axis value and coordinate conversion method
  // isCandleTechnicalIndicator: indicator is on candlestick chart
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
The format of each item of `plots` is as follows:
```js
{
  // Required fields, determine the return value of the method calcTechnicalIndicator.
  key: '',
  // Can be defaulted, mainly for prompt.
  title: '',
  // Default, drawing type, currently supports 'line', 'circle' and 'bar'.
  type: '',
  // It can be defaulted. It is a callback method. The color can be set according to the callback parameters. It will only take effect when the type is' circle' and' bar'.
  // Return a string of color values
  color: (data, options) => {}
  // It can be defaulted, it is a callback method, you can set whether it is hollow according to the callback parameters, and it will take effect only when the type is 'circle' and 'bar'.
  // Return a boolean value
  isStroke: (data, options) => {}
}
```
`calcTechnicalIndicator` is a method that needs to return the calculated data. It is an array. The format needs to be determined according to plots. For details, see the example description.

## Example
Now we need to customize a technical indicator called `VOL`. This technical indicator contains two moving averages of volume, namely `ma5` and `ma10`,
In addition, a rectangular column `volume` is needed to describe the volume, so the technical indicator configuration is as follows:
```js
{
  name: 'VOL',
  // Specify the minimum value on the y axis.
  minValue: 0,
  // Set two technical parameters to calculate ma5 and ma10 respectively.
  calcParams: [5, 10]
  plots: [
    // First line ma5.
    {
      key: 'ma5',
      // We want to be prompted to display MA5:'xxx'.
      title: 'MA5',
      // What needs to be drawn is the line.
      type: 'line'
    },
    // Second line ma10.
    {
      key: 'ma10',
      title: 'MA5',
      type: 'line'
    },
    // Volume rectangle bar.
    {
      key: 'volume',
      title: 'VOLUME',
      // What needs to be drawn is a rectangular column.
      type: 'bar',
      // Here we want the rectangular bar to display different colors according to the rise and fall.
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

    // Note: The number of returned data needs to be consistent with the number of data in dataList. If there is no value, just use {} instead.
    // The calculation parameter is best to take the callback parameter calcParams, if not, when the subsequent calculation parameters change, the calculation here cannot respond in time.
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
      // If there is a value, the data format of each item here should be {ma5: xxx, ma10: xxx, volume: xxx}.
      // Each key needs to be consistent with the value corresponding to the sub-item key in plots.
      return vol
    })
  }
}
```
The above completes a custom technical indicator, which can be added global through `extension.addTechnicalIndicator`, or added for a single chart instance through the chart instance method `addCustomTechnicalIndicator`. Adding to the chart can be used like the built-in technical indicators.

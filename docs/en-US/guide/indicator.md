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
| BOLL | [20, 2] | DMA | [10, 50, 10] | ROC | [12, 6] |
| KDJ | [9, 3, 3] | TRIX | [12, 20] | PVT | None |
| RSI | [6, 12, 24] | OBV | [30] | AVP | None |


## Custom Indicators
To create a custom indicator, you only need to generate a indicator information, and then add it globally through the chart API [registerIndicator](/api/chart/registerIndicator) , add it to the chart and use it like a built-in indicator. For more examples, refer to the files under [https://github.com/klinecharts/KLineChart/tree/main/src/extension/indicator](https://github.com/klinecharts/KLineChart/tree/main/src/extension/indicator) .
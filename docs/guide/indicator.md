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
| BOLL | [20, 2] | DMA | [10, 50, 10] | ROC | [12, 6] |
| KDJ | [9, 3, 3] | TRIX | [12, 20] | PVT | 无 |
| RSI | [6, 12, 24] | OBV | [30] | AVP | 无 |

::: tip 提示
一些指标可以使用 `chart.createIndicator('MA', true, { id:'candle_pane' })` 叠加在蜡烛图上，而有些则不能。与蜡烛图兼容的指标有：BBI、BOLL、EMA、MA、SAR、SMA。另外也可以使用自定义指标的自定义绘制，将指标绘制在蜡烛图上，使其能够和蜡烛图兼容。
:::


## 自定义技术指标
创建一个自定义技术指标，只需要生成一个技术指标信息，然后通过图表API [registerIndicator](/api/chart/registerIndicator) 全局添加，添加到图表即可和内置技术指标一样去使用。更多示例可参考 [https://github.com/klinecharts/KLineChart/tree/main/src/extension/indicator](https://github.com/klinecharts/KLineChart/tree/main/src/extension/indicator) 下的文件。

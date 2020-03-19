import ChartData from '../data/ChartData'
import CandleStickSeries from './CandleStickSeries'
import XAxisSeries from './XAxisSeries'

export default class ChartSeries {
  constructor (container, styleOptions) {
    this._chartData = new ChartData(styleOptions)
    this._xAxisSeries = new XAxisSeries(container, this._chartData)
    this._candleStickSeries = new CandleStickSeries(container, this._chartData, this._xAxisSeries.xAxis())
    this._technicalIndicatorSeries = []
  }
}

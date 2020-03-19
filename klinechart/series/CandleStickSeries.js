import TechnicalIndicatorSeries from './TechnicalIndicatorSeries'
import CandleStickWidget from '../widget/CandleStickWidget'
import { ChartType } from '../data/options/styleOptions'
import YAxis, { YAxisType } from '../component/YAxis'

export default class CandleStickSeries extends TechnicalIndicatorSeries {
  constructor (props) {
    super(props)
    this._chartType = ChartType.CANDLE
  }

  _createYAxis () {
    return new YAxis(this._chartData, YAxisType.CANDLE_STICK)
  }

  _createMainWidget (container) {
    return new CandleStickWidget({
      container,
      chartData: this._chartData,
      xAxis: this._xAxis,
      yAxis: this._yAxis
    })
  }

  _isRealTime () {
    return this._chartType === ChartType.REAL_TIME
  }
}

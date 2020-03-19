import TechnicalIndicatorSeries from './TechnicalIndicatorSeries'
import CandleStickWidget from '../widget/CandleStickWidget'
import { TechnicalIndicatorType } from '../data/options/technicalIndicatorParamOptions'
import { ChartType } from '../data/options/styleOptions'

export default class CandleStickSeries extends TechnicalIndicatorSeries {
  constructor (container, chartData, xAxis, technicalIndicatorType = TechnicalIndicatorType.MA) {
    super(container, chartData, xAxis, technicalIndicatorType)
    this._chartType = ChartType.CANDLE
  }

  _createMainWidget (container) {
    return new CandleStickWidget(container, this._chartData, this._xAxis, this._yAxis)
  }

  _isRealTime () {
    return this._chartType === ChartType.REAL_TIME
  }
}

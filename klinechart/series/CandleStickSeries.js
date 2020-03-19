import TechnicalIndicatorSeries from './TechnicalIndicatorSeries'
import CandleStickWidget from '../widget/CandleStickWidget'

export default class CandleStickSeries extends TechnicalIndicatorSeries {
  _createMainWidget (container) {
    return new CandleStickWidget(container, this._chartData)
  }
}

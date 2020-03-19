import Series from './Series'
import TechnicalIndicatorWidget from '../widget/TechnicalIndicatorWidget'
import YAxisWidget from '../widget/YAxisWidget'

export default class TechnicalIndicatorSeries extends Series {
  _createMainWidget (container) {
    return new TechnicalIndicatorWidget(container, this._chartData)
  }

  _createYAxisWidget (container) {
    return new YAxisWidget(container, this._chartData)
  }
}

import CandleStickView from '../view/CandleStickView'
import CandleStickCrossHairView from '../view/CandleStickCrossHairView'
import TechnicalIndicatorWidget from './TechnicalIndicatorWidget'

export default class CandleStickWidget extends TechnicalIndicatorWidget {
  _createMainView () {
    return new CandleStickView(this._element, this._chartData)
  }

  _createCrossHairView () {
    return new CandleStickCrossHairView(this._element, this._chartData)
  }
}

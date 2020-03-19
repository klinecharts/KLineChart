import Widget from './Widget'
import CandleStickView from '../view/CandleStickView'
import CandleStickCrossHairView from '../view/CandleStickCrossHairView'

export default class CandleStickWidget extends Widget {
  _createMainView () {
    return new CandleStickView(this._element, this._chartData)
  }

  _createCrossHairView () {
    return new CandleStickCrossHairView(this._element, this._chartData)
  }
}

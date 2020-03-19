import Widget from './Widget'
import TechnicalIndicatorView from '../view/TechnicalIndicatorView'
import TechnicalIndicatorCrossHairView from '../view/TechnicalIndicatorCrossHairView'

export default class TechnicalIndicatorWidget extends Widget {
  _createMainView () {
    return new TechnicalIndicatorView(this._element, this._chartData)
  }

  _createCrossHairView () {
    return new TechnicalIndicatorCrossHairView(this._element, this._chartData)
  }
}

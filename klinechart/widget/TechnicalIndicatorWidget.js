import Widget from './Widget'
import TechnicalIndicatorView from '../view/TechnicalIndicatorView'
import TechnicalIndicatorCrossHairView from '../view/TechnicalIndicatorCrossHairView'

export default class TechnicalIndicatorWidget extends Widget {
  _initBefore (props) {
    this._xAxis = props.xAxis
    this._yAxis = props.yAxis
  }

  _createMainView () {
    return new TechnicalIndicatorView(this._element, this._chartData, this._xAxis, this._yAxis)
  }

  _createCrossHairView () {
    return new TechnicalIndicatorCrossHairView(this._element, this._chartData, this._xAxis, this._yAxis)
  }
}

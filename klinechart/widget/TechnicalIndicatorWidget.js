import Widget from './Widget'
import TechnicalIndicatorView from '../view/TechnicalIndicatorView'
import TechnicalIndicatorCrossHairView from '../view/TechnicalIndicatorCrossHairView'

export default class TechnicalIndicatorWidget extends Widget {
  constructor (container, chartData, xAxis, yAxis) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
  }

  _createMainView () {
    return new TechnicalIndicatorView(this._element, this._chartData, this._xAxis, this._yAxis)
  }

  _createCrossHairView () {
    return new TechnicalIndicatorCrossHairView(this._element, this._chartData, this._xAxis, this._yAxis)
  }
}

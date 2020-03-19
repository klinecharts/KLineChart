import Widget from './Widget'
import YAxisView from '../view/YAxisView'
import YAxisCrossHairView from '../view/YAxisCrossHairView'

export default class YAxisWidget extends Widget {
  _initBefore (props) {
    this._yAxis = props.yAxis
  }

  _createMainView () {
    return new YAxisView(this._element, this._chartData, this._yAxis)
  }

  _createCrossHairView () {
    return new YAxisCrossHairView(this._element, this._chartData, this._yAxis)
  }
}

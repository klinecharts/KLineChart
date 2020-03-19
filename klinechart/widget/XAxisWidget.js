import Widget from './Widget'
import XAxisView from '../view/XAxisView'
import XAxisCrossHairView from '../view/XAxisCrossHairView'

export default class XAxisWidget extends Widget {
  _initBefore (props) {
    this._xAxis = props.xAxis
  }

  _createMainView () {
    return new XAxisView(this._element, this._chartData, this._xAxis)
  }

  _createCrossHairView () {
    return new XAxisCrossHairView(this._element, this._chartData, this._xAxis)
  }
}

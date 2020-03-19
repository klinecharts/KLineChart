import Widget from './Widget'
import XAxisView from '../view/XAxisView'
import XAxisCrossHairView from '../view/XAxisCrossHairView'

export default class XAxisWidget extends Widget {
  _createMainView () {
    return new XAxisView(this._element, this._chartData)
  }

  _createCrossHairView () {
    return new XAxisCrossHairView(this._element, this._chartData)
  }
}

import Widget from './Widget'
import YAxisView from '../view/YAxisView'
import YAxisCrossHairView from '../view/YAxisCrossHairView'

export default class YAxisWidget extends Widget {
  _createMainView () {
    return new YAxisView(this._element, this._chartData)
  }

  _createCrossHairView () {
    return new YAxisCrossHairView(this._element, this._chartData)
  }
}

import Widget from './Widget'
import XAxisView from '../view/XAxisView'
import XAxisCrossHairView from '../view/XAxisCrossHairView'

export default class XAxisWidget extends Widget {
  _createMainView (container, props) {
    return new XAxisView(container, props.chartData, props.xAxis)
  }

  _createCrossHairView (container, props) {
    return new XAxisCrossHairView(container, props.chartData, props.xAxis)
  }
}

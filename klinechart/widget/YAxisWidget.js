import Widget from './Widget'
import YAxisView from '../view/YAxisView'
import YAxisCrossHairView from '../view/YAxisCrossHairView'

export default class YAxisWidget extends Widget {
  _createMainView (container, props) {
    return new YAxisView(container, props.chartData, props.yAxis)
  }

  _createCrossHairView (container, props) {
    return new YAxisCrossHairView(container, props.chartData, props.yAxis)
  }
}

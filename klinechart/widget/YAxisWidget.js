import Widget from './Widget'
import YAxisView from '../view/YAxisView'
import YAxisFloatLayerView from '../view/YAxisFloatLayerView'

export default class YAxisWidget extends Widget {
  _createMainView (container, props) {
    return new YAxisView(container, props.chartData, props.yAxis)
  }

  _createFloatLayerView (container, props) {
    return new YAxisFloatLayerView(container, props.chartData, props.yAxis)
  }
}

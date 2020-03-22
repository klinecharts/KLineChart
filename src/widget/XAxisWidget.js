import Widget from './Widget'
import XAxisView from '../view/XAxisView'
import XAxisFloatLayerView from '../view/XAxisFloatLayerView'

export default class XAxisWidget extends Widget {
  _createMainView (container, props) {
    return new XAxisView(container, props.chartData, props.xAxis)
  }

  _createFloatLayerView (container, props) {
    return new XAxisFloatLayerView(container, props.chartData, props.xAxis)
  }
}

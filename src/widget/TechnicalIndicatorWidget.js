import Widget from './Widget'
import TechnicalIndicatorView from '../view/TechnicalIndicatorView'
import TechnicalIndicatorFloatLayerView from '../view/TechnicalIndicatorFloatLayerView'

export default class TechnicalIndicatorWidget extends Widget {
  _createMainView (container, props) {
    return new TechnicalIndicatorView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }

  _createFloatLayerView (container, props) {
    return new TechnicalIndicatorFloatLayerView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }
}

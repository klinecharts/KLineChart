import Widget from './Widget'
import TechnicalIndicatorView from '../view/TechnicalIndicatorView'
import TechnicalIndicatorCrossHairView from '../view/TechnicalIndicatorCrossHairView'

export default class TechnicalIndicatorWidget extends Widget {
  _createMainView (container, props) {
    return new TechnicalIndicatorView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }

  _createCrossHairView (container, props) {
    return new TechnicalIndicatorCrossHairView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }
}

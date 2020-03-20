import CandleStickView from '../view/CandleStickView'
import CandleStickFloatLayerView from '../view/CandleStickFloatLayerView'
import TechnicalIndicatorWidget from './TechnicalIndicatorWidget'

export default class CandleStickWidget extends TechnicalIndicatorWidget {
  _createMainView (container, props) {
    return new CandleStickView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }

  _createFloatLayerView (container, props) {
    return new CandleStickFloatLayerView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }
}

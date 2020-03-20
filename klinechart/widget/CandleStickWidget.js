import CandleStickView from '../view/CandleStickView'
import CandleStickCrossHairView from '../view/CandleStickCrossHairView'
import TechnicalIndicatorWidget from './TechnicalIndicatorWidget'

export default class CandleStickWidget extends TechnicalIndicatorWidget {
  _createMainView (container, props) {
    return new CandleStickView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }

  _createCrossHairView (container, props) {
    return new CandleStickCrossHairView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }
}

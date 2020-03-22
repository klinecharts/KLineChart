import CandleStickView from '../view/CandleStickView'
import CandleStickFloatLayerView from '../view/CandleStickFloatLayerView'
import TechnicalIndicatorWidget from './TechnicalIndicatorWidget'
import { InvalidateLevel } from '../data/ChartData'
import GraphicMarkView from '../view/GraphicMarkView'

export default class CandleStickWidget extends TechnicalIndicatorWidget {
  _createMainView (container, props) {
    return new CandleStickView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }

  _createExpandView (container, props) {
    return new GraphicMarkView(container, props.chartData, props.xAxis, props.yAxis)
  }

  _createFloatLayerView (container, props) {
    return new CandleStickFloatLayerView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }

  invalidate (level) {
    if (level === InvalidateLevel.GRAPHIC_MARK) {
      this._expandView.flush()
    } else {
      super.invalidate(level)
    }
  }
}

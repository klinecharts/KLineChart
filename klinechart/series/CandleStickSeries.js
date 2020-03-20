import TechnicalIndicatorSeries from './TechnicalIndicatorSeries'
import CandleStickWidget from '../widget/CandleStickWidget'
import { ChartType } from '../data/options/styleOptions'
import YAxis, { YAxisType } from '../component/YAxis'

export default class CandleStickSeries extends TechnicalIndicatorSeries {
  constructor (props) {
    super(props)
    this._chartType = ChartType.CANDLE
  }

  _createYAxis (props) {
    return new YAxis(props.chartData, YAxisType.CANDLE_STICK)
  }

  _createMainWidget (container, props) {
    return new CandleStickWidget({
      container,
      chartData: props.chartData,
      xAxis: props.xAxis,
      yAxis: this._yAxis,
      additionalDataProvider: {
        technicalIndicatorType: this.technicalIndicatorType.bind(this),
        chartType: this.chartType.bind(this)
      }
    })
  }

  _isRealTime () {
    return this._chartType === ChartType.REAL_TIME
  }

  chartType () {
    return this._chartType
  }
}

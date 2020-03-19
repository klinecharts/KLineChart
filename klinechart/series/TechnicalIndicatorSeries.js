import Series from './Series'
import TechnicalIndicatorWidget from '../widget/TechnicalIndicatorWidget'
import YAxisWidget from '../widget/YAxisWidget'
import { TechnicalIndicatorType } from '../data/options/technicalIndicatorParamOptions'
import YAxis from '../component/YAxis'
import { InvalidateLevel } from '../data/ChartData'

export default class TechnicalIndicatorSeries extends Series {
  constructor (container, chartData, xAxis, technicalIndicatorType = TechnicalIndicatorType.MACD) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = new YAxis(chartData)
    this._technicalIndicatorType = technicalIndicatorType
    this._calcTechnicalIndicator()
  }

  _createMainWidget (container) {
    return new TechnicalIndicatorWidget(container, this._chartData, this._xAxis, this._yAxis)
  }

  _createYAxisWidget (container) {
    return new YAxisWidget(container, this._chartData, this._yAxis)
  }

  _computeAxis () {
    this._yAxis.calcMinMaxValue(this._technicalIndicatorType, this._isRealTime())
  }

  _isRealTime () {
    return false
  }

  /**
   * 计算指标
   * @private
   */
  _calcTechnicalIndicator () {
    if (this._chartData.calcTechnicalIndicator(this._technicalIndicatorType)) {
      this.invalidate(InvalidateLevel.FULL)
    }
  }

  /**
   * 获取技术指标类型
   * @returns {string}
   */
  technicalIndicatorType () {
    return this._technicalIndicatorType
  }

  setTechnicalIndicatorType (technicalIndicatorType) {
    if (this._technicalIndicatorType !== technicalIndicatorType) {
      this._technicalIndicatorType = technicalIndicatorType
      this._calcTechnicalIndicator()
    }
  }
}

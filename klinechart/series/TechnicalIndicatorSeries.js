import Series from './Series'
import TechnicalIndicatorWidget from '../widget/TechnicalIndicatorWidget'
import YAxisWidget from '../widget/YAxisWidget'
import { TechnicalIndicatorType } from '../data/options/technicalIndicatorParamOptions'
import YAxis, { YAxisType } from '../component/YAxis'
import { InvalidateLevel } from '../data/ChartData'

export default class TechnicalIndicatorSeries extends Series {
  constructor (props) {
    super(props)
    this._technicalIndicatorType = props.technicalIndicatorType || TechnicalIndicatorType.MACD
    this._calcTechnicalIndicator()
  }

  _initBefore (props) {
    this._tag = 'series_tag'
    this._yAxis = this._createYAxis(props)
  }

  _createYAxis (props) {
    return new YAxis(props.chartData, YAxisType.TECHNICAL_INDICATOR)
  }

  _createMainWidget (container, props) {
    return new TechnicalIndicatorWidget({
      container,
      chartData: props.chartData,
      xAxis: props.xAxis,
      yAxis: this._yAxis,
      additionalDataProvider: {
        technicalIndicatorType: this.technicalIndicatorType.bind(this),
        tag: this.tag.bind(this)
      }
    })
  }

  _createYAxisWidget (container, props) {
    return new YAxisWidget({
      container,
      chartData: props.chartData,
      yAxis: this._yAxis,
      additionalDataProvider: {
        tag: this.tag.bind(this)
      }
    })
  }

  _computeAxis () {
    this._yAxis.calcMinMaxValue(this._technicalIndicatorType, this._isRealTime())
    this._yAxis.computeAxis()
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
   * 获取标识
   * @returns {string}
   */
  tag () {
    return this._tag
  }

  /**
   * 设置series标识
   * @param tag
   */
  setTag (tag) {
    this._tag = tag
  }

  /**
   * 设置尺寸
   * @param mainWidgetSize
   * @param yAxisWidgetSize
   */
  setSize (mainWidgetSize, yAxisWidgetSize) {
    super.setSize(mainWidgetSize, yAxisWidgetSize)
    this._yAxis.setSize(yAxisWidgetSize.width, yAxisWidgetSize.height)
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

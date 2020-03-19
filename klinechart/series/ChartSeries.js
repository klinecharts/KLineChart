import ChartData from '../data/ChartData'
import CandleStickSeries from './CandleStickSeries'
import XAxisSeries from './XAxisSeries'

import { YAxisPosition, YAxisTextPosition } from '../data/options/styleOptions'

const DEFAULT_TECHNICAL_INDICATOR_HEIGHT_RATE = 0.2

const CANDLE_STICK_MIN_HEIGHT_RATE = 0.4

const TECHNICAL_INDICATOR_NAME_PREFIX = 'technical_indicator_'

export default class ChartSeries {
  constructor (container, styleOptions) {
    this._container = container
    this._technicalIndicatorBaseId = 0
    this._chartData = new ChartData(styleOptions)
    this._xAxisSeries = new XAxisSeries(container, this._chartData)
    this._candleStickSeries = new CandleStickSeries(container, this._chartData, this._xAxisSeries.xAxis())
    this._technicalIndicatorSeries = {}
  }

  _measureXAxisHeight () {
    const xAxis = this._chartData.styleOptions().xAxis
    const tickText = xAxis.tick.text
    const tickLine = xAxis.tick.line
    let height = tickText.size + tickText.margin
    if (xAxis.display && tickLine.display) {
      height += tickLine.length
    }
    if (xAxis.display && xAxis.line.display) {
      height += xAxis.line.size
    }
    height = Math.max(xAxis.minHeight, Math.min(height, xAxis.maxHeight))
    return (+Math.ceil(Number(height)).toFixed(0))
  }

  _measureYAxisWidth () {
    const yAxis = this._chartData.styleOptions().yAxis
    const tickText = yAxis.tick.text
    const tickLine = yAxis.tick.line
    const needsOffset = (((tickText.display || tickLine.display || tickText.margin > 0) && tickText.position === YAxisTextPosition.OUTSIDE) || yAxis.line.display) && yAxis.display
    if (needsOffset) {
      let width = 0
      if (tickText.position === YAxisTextPosition.OUTSIDE) {
        width += tickText.margin
        if (yAxis.display && tickLine.display) {
          width += tickLine.length
        }
      }
      const axisLineSize = yAxis.line.size
      if (yAxis.display && yAxis.line.display) {
        width += axisLineSize
      }
      if (width > axisLineSize) {
        width = Math.max(yAxis.minWidth, Math.min(width, yAxis.maxWidth))
      }
      return Math.ceil(width)
    }
    return 0
  }

  chartData () {
    return this._chartData
  }

  /**
   * 测量尺寸
   * @private
   */
  measureWidgetSize () {
    const seriesHeight = this._container.offsetHeight
    const seriesWidth = this._container.offsetWidth
    const xAxisHeight = this._measureXAxisHeight()
    const yAxisWidth = this._measureYAxisWidth()
    const seriesExcludeXAxisHeight = seriesHeight - xAxisHeight
    const seriesExcludeYAxisWidth = seriesWidth - yAxisWidth
    const technicalIndicatorSeriesCount = Object.values(this._technicalIndicatorSeries).length
    let technicalIndicatorSeriesHeight
    if (technicalIndicatorSeriesCount * DEFAULT_TECHNICAL_INDICATOR_HEIGHT_RATE > CANDLE_STICK_MIN_HEIGHT_RATE) {
      technicalIndicatorSeriesHeight = Math.floor((1 - CANDLE_STICK_MIN_HEIGHT_RATE) * seriesExcludeXAxisHeight / technicalIndicatorSeriesCount)
    } else {
      technicalIndicatorSeriesHeight = Math.floor(seriesExcludeXAxisHeight * DEFAULT_TECHNICAL_INDICATOR_HEIGHT_RATE)
    }
    const candleStickSeriesHeight = seriesExcludeXAxisHeight - (technicalIndicatorSeriesCount * technicalIndicatorSeriesHeight)

    const isLeft = this._chartData.styleOptions().yAxis.position === YAxisPosition.LEFT
    let yAxisOffsetLeft = seriesExcludeYAxisWidth
    let mainOffsetLeft = 0
    if (isLeft) {
      yAxisOffsetLeft = 0
      mainOffsetLeft = yAxisWidth
    }
    this._candleStickSeries.setSize(
      { left: mainOffsetLeft, width: seriesExcludeYAxisWidth, height: candleStickSeriesHeight },
      { left: yAxisOffsetLeft, width: yAxisWidth, height: candleStickSeriesHeight }
    )
    for (const key in this._technicalIndicatorSeries) {
      this._technicalIndicatorSeries[key].setSize(
        { left: mainOffsetLeft, width: seriesExcludeYAxisWidth, height: technicalIndicatorSeriesHeight },
        { left: yAxisOffsetLeft, width: yAxisWidth, height: technicalIndicatorSeriesHeight }
      )
    }
    this._xAxisSeries.setSize(
      { left: mainOffsetLeft, width: seriesExcludeYAxisWidth, height: xAxisHeight },
      { left: yAxisOffsetLeft, width: yAxisWidth, height: xAxisHeight }
    )
  }

  applyStyleOptions (styleOptions) {
    this._chartData.applyStyleOptions(styleOptions)
    this.measureWidgetSize()
  }

  
}

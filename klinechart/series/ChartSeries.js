import ChartData, { InvalidateLevel } from '../data/ChartData'
import CandleStickSeries from './CandleStickSeries'
import XAxisSeries from './XAxisSeries'

import { ChartType, YAxisPosition, YAxisTextPosition } from '../data/options/styleOptions'
import { isArray, isObject } from '../utils/typeChecks'
import { formatValue } from '../utils/format'
import TechnicalIndicatorSeries from './TechnicalIndicatorSeries'
import { TechnicalIndicatorType } from '../data/options/technicalIndicatorParamOptions'

const DEFAULT_TECHNICAL_INDICATOR_HEIGHT_RATE = 0.2

const CANDLE_STICK_MIN_HEIGHT_RATE = 0.4

const TECHNICAL_INDICATOR_NAME_PREFIX = 'technical_indicator_'

export const CANDLE_STICK_SERIES_TAG = 'candle_stick_series_tag'

export default class ChartSeries {
  constructor (container, styleOptions) {
    this._container = container
    this._technicalIndicatorBaseId = 0
    this._chartData = new ChartData(styleOptions)
    this._xAxisSeries = new XAxisSeries({ container, chartData: this._chartData })
    this._candleStickSeries = new CandleStickSeries({
      container,
      chartData: this._chartData,
      xAxis: this._xAxisSeries.xAxis(),
      technicalIndicatorType: TechnicalIndicatorType.MA
    })
    this._technicalIndicatorSeries = {}
    this.measureSeriesSize()
  }

  /**
   * 计算x轴的高度
   * @returns {number}
   * @private
   */
  _measureXAxisHeight () {
    const xAxis = this._chartData.styleOptions().xAxis
    const tickText = xAxis.tickText
    const tickLine = xAxis.tickLine
    let height = tickText.size + tickText.margin
    if (xAxis.display && tickLine.display) {
      height += tickLine.length
    }
    if (xAxis.display && xAxis.axisLine.display) {
      height += xAxis.axisLine.size
    }
    height = Math.max(xAxis.minHeight, Math.min(height, xAxis.maxHeight))
    return (+Math.ceil(Number(height)).toFixed(0))
  }

  /**
   * 计算y轴宽度
   * @returns {number}
   * @private
   */
  _measureYAxisWidth () {
    const yAxis = this._chartData.styleOptions().yAxis
    const tickText = yAxis.tickText
    const tickLine = yAxis.tickLine
    const needsOffset = (((tickText.display || tickLine.display || tickText.margin > 0) && tickText.position === YAxisTextPosition.OUTSIDE) || yAxis.axisLine.display) && yAxis.display
    if (needsOffset) {
      let width = 0
      if (tickText.position === YAxisTextPosition.OUTSIDE) {
        width += tickText.margin
        if (yAxis.display && tickLine.display) {
          width += tickLine.length
        }
      }
      const axisLineSize = yAxis.axisLine.size
      if (yAxis.display && yAxis.axisLine.display) {
        width += axisLineSize
      }
      if (width > axisLineSize) {
        width = Math.max(yAxis.minWidth, Math.min(width, yAxis.maxWidth))
      }
      return Math.ceil(width)
    }
    return 0
  }

  /**
   * 更新所有series
   * @private
   */
  _updateAllSeries () {
    this._xAxisSeries.invalidate(InvalidateLevel.FULL)
    this._candleStickSeries.invalidate(InvalidateLevel.FULL)
    for (const key in this._technicalIndicatorSeries) {
      this._technicalIndicatorSeries[key].invalidate(InvalidateLevel.FULL)
    }
  }

  /**
   * 计算所有series的指标
   * @private
   */
  _calcAllSeriesTechnicalIndicator () {
    const technicalIndicatorTypeArray = []
    if (this._candleStickSeries.chartType() === ChartType.CANDLE) {
      technicalIndicatorTypeArray.push(this._candleStickSeries.technicalIndicatorType())
    } else {
      this._chartData.calcTechnicalIndicator(TechnicalIndicatorType.AVERAGE)
    }
    for (const key in this._technicalIndicatorSeries) {
      const technicalIndicatorSeriesTechnicalIndicatorType = this._technicalIndicatorSeries[key].technicalIndicatorType()
      if (technicalIndicatorTypeArray.indexOf(technicalIndicatorSeriesTechnicalIndicatorType) < 0) {
        technicalIndicatorTypeArray.push(technicalIndicatorSeriesTechnicalIndicatorType)
      }
    }
    for (const technicalIndicatorType of technicalIndicatorTypeArray) {
      this._chartData.calcTechnicalIndicator(technicalIndicatorType)
    }
    this._updateAllSeries()
  }

  chartData () {
    return this._chartData
  }

  /**
   * 测量尺寸
   * @private
   */
  measureSeriesSize () {
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
    this._chartData.setTotalDataSpace(seriesExcludeYAxisWidth)
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

  /**
   * 加载样式配置
   * @param styleOptions
   */
  applyStyleOptions (styleOptions) {
    this._chartData.applyStyleOptions(styleOptions)
    this.measureSeriesSize()
  }

  /**
   * 添加新数据
   * @param dataList
   */
  applyNewData (dataList) {
    if (isArray(dataList)) {
      this._chartData.clearDataList()
      this._chartData.addData(dataList, 0)
      this._calcAllSeriesTechnicalIndicator()
    }
  }

  /**
   * 添加更多数据
   * @param dataList
   */
  applyMoreData (dataList) {
    if (isArray(dataList)) {
      this._chartData.addData(dataList, 0)
      this._calcAllSeriesTechnicalIndicator()
    }
  }

  /**
   * 更新数据
   * @param data
   */
  updateData (data) {
    if (isObject(data) && !isArray(data)) {
      const dataList = this._chartData.dataList()
      const dataSize = dataList.length
      // 这里判断单个数据应该添加到哪个位置
      const timestamp = +formatValue(data, 'timestamp', 0)
      const lastDataTimestamp = +formatValue(dataList[dataSize - 1], 'timestamp', 0)
      let pos = dataSize
      if (timestamp === lastDataTimestamp) {
        pos = dataSize - 1
      }
      this._chartData.addData(data, pos)
      this._calcAllSeriesTechnicalIndicator()
    }
  }

  /**
   * 创建一个指标
   * @param technicalIndicatorType
   * @returns {string}
   */
  createTechnicalIndicator (technicalIndicatorType) {
    this._technicalIndicatorBaseId++
    const tag = `${TECHNICAL_INDICATOR_NAME_PREFIX}${this._technicalIndicatorBaseId}`
    this._technicalIndicatorSeries[tag] = new TechnicalIndicatorSeries({
      container: this._container,
      chartData: this._chartData,
      xAxis: this._xAxisSeries.xAxis(),
      technicalIndicatorType
    })
    this.measureSeriesSize()
    return tag
  }

  /**
   * 移除一个指标
   * @param tag
   */
  removeTechnicalIndicator (tag) {
    const series = this._technicalIndicatorSeries[tag]
    if (series) {
      series.destroy()
      delete this._technicalIndicatorSeries[tag]
      this.measureSeriesSize()
    }
  }

  /**
   * 设置指标类型
   * @param tag
   * @param technicalIndicatorType
   */
  setTechnicalIndicatorType (tag, technicalIndicatorType) {
    if (tag === CANDLE_STICK_SERIES_TAG) {
      this._technicalIndicatorSeries.setTechnicalIndicatorType(technicalIndicatorType)
    } else {
      const series = this._technicalIndicatorSeries[tag]
      if (series) {
        if (technicalIndicatorType === TechnicalIndicatorType.NO) {
          this.removeTechnicalIndicator(tag)
        } else {
          series.setTechnicalIndicatorType(technicalIndicatorType)
        }
      }
    }
  }
}

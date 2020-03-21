import ChartData, { InvalidateLevel } from '../data/ChartData'
import CandleStickSeries from './CandleStickSeries'
import XAxisSeries from './XAxisSeries'

import { ChartType, YAxisPosition, YAxisTextPosition } from '../data/options/styleOptions'
import { isArray, isObject } from '../utils/typeChecks'
import { formatValue } from '../utils/format'
import TechnicalIndicatorSeries from './TechnicalIndicatorSeries'
import SeparatorSeries from './SeparatorSeries'

import { TechnicalIndicatorType } from '../data/options/technicalIndicatorParamOptions'
import ChartEvent from '../e/ChartEvent'

const DEFAULT_TECHNICAL_INDICATOR_SERIES_HEIGHT_RATE = 0.2

const TECHNICAL_INDICATOR_NAME_PREFIX = 'technical_indicator_'

export const CANDLE_STICK_SERIES_TAG = 'candle_stick_series_tag'

export default class ChartSeries {
  constructor (container, styleOptions) {
    this._container = container
    this._technicalIndicatorBaseId = 0
    this._technicalIndicatorSeries = []
    this._separatorSeries = []
    this._separatorDragStartHeight = {}
    this._chartData = new ChartData(styleOptions, this._updateSeries.bind(this))
    this._chartEvent = new ChartEvent(this._container, this._chartData)
    this._xAxisSeries = new XAxisSeries({ container, chartData: this._chartData })
    this._candleStickSeries = new CandleStickSeries({
      container,
      chartData: this._chartData,
      xAxis: this._xAxisSeries.xAxis(),
      technicalIndicatorType: TechnicalIndicatorType.MA,
      tag: CANDLE_STICK_SERIES_TAG
    })
    this.measureSeriesSize()
  }

  _separatorStartDrag (topSeriesIndex, bottomSeriesIndex) {
    if (topSeriesIndex === -1) {
      this._separatorDragStartHeight.top = this._candleStickSeries.height()
    } else {
      this._separatorDragStartHeight.top = this._technicalIndicatorSeries[topSeriesIndex].height()
    }
    this._separatorDragStartHeight.bottom = this._technicalIndicatorSeries[bottomSeriesIndex].height()
  }

  _separatorDrag (dragDistance, topSeriesIndex, bottomSeriesIndex) {
    if (topSeriesIndex === -1) {
      this._candleStickSeries.setTempHeight(this._separatorDragStartHeight.top + dragDistance)
    } else {
      this._technicalIndicatorSeries[topSeriesIndex].setTempHeight(this._separatorDragStartHeight.top + dragDistance)
    }
    this._technicalIndicatorSeries[bottomSeriesIndex].setTempHeight(this._separatorDragStartHeight.bottom - dragDistance)
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
   * 测量图表间分割线的高度
   * @returns {number}
   * @private
   */
  _measureSeparatorHeight () {
    const separator = this._chartData.styleOptions().separator
    return separator.size * this._separatorSeries.length
  }

  /**
   * 更新所有series
   * @private
   */
  _updateSeries (invalidateLevel = InvalidateLevel.FULL) {
    this._xAxisSeries.invalidate(invalidateLevel)
    this._candleStickSeries.invalidate(invalidateLevel)
    for (const series of this._technicalIndicatorSeries) {
      series.invalidate(invalidateLevel)
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
    for (const series of this._technicalIndicatorSeries) {
      const technicalIndicatorSeriesTechnicalIndicatorType = series.technicalIndicatorType()
      if (technicalIndicatorTypeArray.indexOf(technicalIndicatorSeriesTechnicalIndicatorType) < 0) {
        technicalIndicatorTypeArray.push(technicalIndicatorSeriesTechnicalIndicatorType)
      }
    }
    for (const technicalIndicatorType of technicalIndicatorTypeArray) {
      this._chartData.calcTechnicalIndicator(technicalIndicatorType)
    }
    this._updateSeries()
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
    const separatorHeight = this._measureSeparatorHeight()
    const xAxisHeight = this._measureXAxisHeight()
    const yAxisWidth = this._measureYAxisWidth()
    const seriesExcludeXAxisSeparatorHeight = seriesHeight - xAxisHeight - separatorHeight
    const seriesExcludeYAxisWidth = seriesWidth - yAxisWidth

    const isLeft = this._chartData.styleOptions().yAxis.position === YAxisPosition.LEFT
    let yAxisOffsetLeft = seriesExcludeYAxisWidth
    let mainOffsetLeft = 0
    if (isLeft) {
      yAxisOffsetLeft = 0
      mainOffsetLeft = yAxisWidth
    }

    let seriesKnowTotalHeight = 0
    let candleStickSeriesHeight = this._candleStickSeries.height()
    if (candleStickSeriesHeight >= 0) {
      seriesKnowTotalHeight += candleStickSeriesHeight
    }

    let unKnowTechnicalIndicatorSeriesCount = 0
    for (const series of this._technicalIndicatorSeries) {
      const seriesHeight = series.height()
      if (seriesHeight < 0) {
        unKnowTechnicalIndicatorSeriesCount++
      } else {
        seriesKnowTotalHeight += seriesHeight
      }
    }

    const seriesUnKnowTotalHeight = seriesExcludeXAxisSeparatorHeight - seriesKnowTotalHeight
    const defaultTechnicalIndicatorSeriesHeight = Math.floor(seriesUnKnowTotalHeight * DEFAULT_TECHNICAL_INDICATOR_SERIES_HEIGHT_RATE)
    if (candleStickSeriesHeight < 0) {
      candleStickSeriesHeight = seriesUnKnowTotalHeight - defaultTechnicalIndicatorSeriesHeight * unKnowTechnicalIndicatorSeriesCount
    }
    this._chartData.setTotalDataSpace(seriesExcludeYAxisWidth)
    const seriesSize = {}
    seriesSize.contentLeft = mainOffsetLeft
    seriesSize.contentRight = mainOffsetLeft + seriesExcludeYAxisWidth
    const tags = {}
    tags[CANDLE_STICK_SERIES_TAG] = { contentTop: 0, contentBottom: candleStickSeriesHeight }
    let contentTop = candleStickSeriesHeight
    let contentBottom = candleStickSeriesHeight
    this._candleStickSeries.setSize(
      { left: mainOffsetLeft, width: seriesExcludeYAxisWidth, height: candleStickSeriesHeight },
      { left: yAxisOffsetLeft, width: yAxisWidth, height: candleStickSeriesHeight }
    )

    for (const series of this._technicalIndicatorSeries) {
      let seriesHeight = series.height()
      if (seriesHeight < 0) {
        seriesHeight = defaultTechnicalIndicatorSeriesHeight
      }
      series.setSize(
        { left: mainOffsetLeft, width: seriesExcludeYAxisWidth, height: seriesHeight },
        { left: yAxisOffsetLeft, width: yAxisWidth, height: seriesHeight }
      )
      contentBottom += seriesHeight
      tags[series.tag()] = { contentTop, contentBottom }
      contentTop = contentBottom
    }
    seriesSize.tags = tags
    this._xAxisSeries.setSize(
      { left: mainOffsetLeft, width: seriesExcludeYAxisWidth, height: xAxisHeight },
      { left: yAxisOffsetLeft, width: yAxisWidth, height: xAxisHeight }
    )
    this._chartEvent.setSeriesSize(seriesSize)
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
    const technicalIndicatorSeriesCount = this._technicalIndicatorSeries.length
    this._separatorSeries.push(
      new SeparatorSeries(
        this._container, this._chartData,
        technicalIndicatorSeriesCount - 1,
        technicalIndicatorSeriesCount, {
          startDrag: this._separatorStartDrag.bind(this),
          drag: this._separatorDrag.bind(this)
        }
      )
    )
    this._technicalIndicatorBaseId++
    const tag = `${TECHNICAL_INDICATOR_NAME_PREFIX}${this._technicalIndicatorBaseId}`
    this._technicalIndicatorSeries.push(
      new TechnicalIndicatorSeries({
        container: this._container,
        chartData: this._chartData,
        xAxis: this._xAxisSeries.xAxis(),
        technicalIndicatorType,
        tag
      })
    )
    this.measureSeriesSize()
    return tag
  }

  /**
   * 移除一个指标
   * @param tag
   */
  removeTechnicalIndicator (tag) {
    let seriesPos = -1
    for (let i = 0; i < this._technicalIndicatorSeries.length; i++) {
      const series = this._technicalIndicatorSeries[i]
      if (series.tag() === tag) {
        seriesPos = i
        break
      }
    }
    if (seriesPos !== -1) {
      this._technicalIndicatorSeries[seriesPos].destroy()
      this._separatorSeries[seriesPos].destroy()
      delete this._technicalIndicatorSeries[seriesPos]
      delete this._separatorSeries[seriesPos]
      for (let i = 0; i < this._separatorSeries.length; i++) {
        this._separatorSeries[i].updateSeriesIndex(i - 1, i)
      }
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
      this._candleStickSeries.setTechnicalIndicatorType(technicalIndicatorType)
    } else {
      let s
      for (const series of this._technicalIndicatorSeries) {
        if (series.tag() === tag) {
          s = series
          break
        }
      }
      if (s) {
        if (technicalIndicatorType === TechnicalIndicatorType.NO) {
          this.removeTechnicalIndicator(tag)
        } else {
          s.setTechnicalIndicatorType(technicalIndicatorType)
        }
      }
    }
  }
}

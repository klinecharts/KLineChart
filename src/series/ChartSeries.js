import ChartData, { InvalidateLevel } from '../data/ChartData'
import CandleStickSeries from './CandleStickSeries'
import XAxisSeries from './XAxisSeries'

import { ChartType, YAxisPosition, YAxisTextPosition } from '../data/options/styleOptions'
import { isArray, isFunction, isObject } from '../utils/typeChecks'
import { formatValue } from '../utils/format'
import TechnicalIndicatorSeries from './TechnicalIndicatorSeries'
import SeparatorSeries from './SeparatorSeries'

import { TechnicalIndicatorType } from '../data/options/technicalIndicatorParamOptions'
import ChartEvent from '../event/ChartEvent'
import { getPixelRatio } from '../utils/canvas'

const DEFAULT_TECHNICAL_INDICATOR_SERIES_HEIGHT = 100

const TECHNICAL_INDICATOR_NAME_PREFIX = 'technical_indicator_'

export const CANDLE_STICK_SERIES_TAG = 'candle_stick_series_tag'

export default class ChartSeries {
  constructor (container, styleOptions) {
    this._initChartContainer(container)
    this._technicalIndicatorBaseId = 0
    this._technicalIndicatorSeries = []
    this._separatorSeries = []
    this._separatorDragStartTechnicalIndicatorHeight = 0
    this._chartData = new ChartData(styleOptions, this._updateSeries.bind(this))
    this._xAxisSeries = new XAxisSeries({ container: this._chartContainer, chartData: this._chartData })
    this._candleStickSeries = new CandleStickSeries({
      container: this._chartContainer,
      chartData: this._chartData,
      xAxis: this._xAxisSeries.xAxis(),
      technicalIndicatorType: TechnicalIndicatorType.MA,
      tag: CANDLE_STICK_SERIES_TAG
    })
    this._chartEvent = new ChartEvent(
      this._chartContainer, this._chartData,
      this._xAxisSeries.xAxis(),
      this._candleStickSeries.yAxis()
    )
    this.measureSeriesSize()
  }

  /**
   * 初始化图表容器
   * @param container
   * @private
   */
  _initChartContainer (container) {
    this._container = container
    this._chartContainer = document.createElement('div')
    this._chartContainer.style.position = 'relative'
    this._chartContainer.style.outline = 'none'
    this._chartContainer.style.borderStyle = 'none'
    this._chartContainer.style.width = '100%'
    this._chartContainer.style.cursor = 'crosshair'
    this._chartContainer.tabIndex = 1
    container.appendChild(this._chartContainer)
  }

  /**
   * 分割线拖拽开始
   * @param seriesIndex
   * @private
   */
  _separatorStartDrag (seriesIndex) {
    this._separatorDragStartTechnicalIndicatorHeight = this._technicalIndicatorSeries[seriesIndex].height()
  }

  /**
   * 分割线拖拽
   * @param dragDistance
   * @param seriesIndex
   * @private
   */
  _separatorDrag (dragDistance, seriesIndex) {
    let height = this._separatorDragStartTechnicalIndicatorHeight - dragDistance
    if (height < 0) {
      height = 0
    }
    this._technicalIndicatorSeries[seriesIndex].setHeight(height)
    this.measureSeriesSize()
  }

  /**
   * 计算x轴的高度
   * @returns {number}
   * @private
   */
  _measureXAxisHeight () {
    const xAxis = this._chartData.styleOptions().xAxis
    const axisLine = xAxis.axisLine
    const tickText = xAxis.tickText
    const tickLine = xAxis.tickLine
    let height = 0
    if (xAxis.display) {
      if (axisLine.display) {
        height += axisLine.size
      }
      if (tickLine.display) {
        height += tickLine.length
      }
      if (tickText.display) {
        height += (tickText.size + tickText.margin)
      }
    }
    if (height > 0) {
      height = Math.ceil(Math.max(xAxis.minHeight, Math.min(height, xAxis.maxHeight)))
    }
    return height
  }

  /**
   * 计算y轴宽度
   * @returns {number}
   * @private
   */
  _measureYAxisWidth () {
    const yAxis = this._chartData.styleOptions().yAxis
    const axisLine = yAxis.axisLine
    const tickText = yAxis.tickText
    const tickLine = yAxis.tickLine
    let width = 0
    if (yAxis.display) {
      if (yAxis.axisLine.display) {
        width += axisLine.size
      }
      if (yAxis.tickLine.display) {
        width += tickLine.length
      }
      if (yAxis.tickText.display) {
        width += (tickText.margin + (tickText.size - 2) * 6)
      }
    }
    if (width > 0) {
      width = Math.ceil(Math.max(yAxis.minWidth, Math.min(width, yAxis.maxWidth)))
    }
    return width
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
    if (invalidateLevel !== InvalidateLevel.GRAPHIC_MARK) {
      this._xAxisSeries.invalidate(invalidateLevel)
      for (const series of this._technicalIndicatorSeries) {
        series.invalidate(invalidateLevel)
      }
    }
    this._candleStickSeries.invalidate(invalidateLevel)
  }

  /**
   * 计算所有series的指标
   * @private
   */
  _calcAllSeriesTechnicalIndicator () {
    const technicalIndicatorTypeArray = []
    if (this._candleStickSeries.chartType() === ChartType.CANDLE_STICK) {
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

  /**
   * 获取图表上的数据
   * @returns {ChartData}
   */
  chartData () {
    return this._chartData
  }

  /**
   * 测量尺寸
   * @private
   */
  measureSeriesSize () {
    const yAxis = this._chartData.styleOptions().yAxis
    const isYAxisLeft = yAxis.position === YAxisPosition.LEFT
    const isYAxisTextOutsize = yAxis.tickText.position === YAxisTextPosition.OUTSIDE
    const seriesWidth = this._container.offsetWidth
    const seriesHeight = this._container.offsetHeight
    const separatorHeight = this._measureSeparatorHeight()
    const xAxisHeight = this._measureXAxisHeight()
    const yAxisWidth = this._measureYAxisWidth()
    const seriesExcludeXAxisSeparatorHeight = seriesHeight - xAxisHeight - separatorHeight
    const mainWidthWidth = seriesWidth - (isYAxisTextOutsize ? yAxisWidth : 0)
    let yAxisOffsetLeft = seriesWidth - yAxisWidth
    let mainOffsetLeft = 0
    if (isYAxisLeft) {
      yAxisOffsetLeft = 0
      if (isYAxisTextOutsize) {
        mainOffsetLeft = yAxisWidth
      }
    }
    let technicalIndicatorSeriesTotalHeight = 0
    for (const series of this._technicalIndicatorSeries) {
      const seriesHeight = series.height()
      technicalIndicatorSeriesTotalHeight += seriesHeight
      // 修复拖拽会超出容器高度问题
      if (technicalIndicatorSeriesTotalHeight > seriesExcludeXAxisSeparatorHeight) {
        const difHeight = technicalIndicatorSeriesTotalHeight - seriesExcludeXAxisSeparatorHeight
        technicalIndicatorSeriesTotalHeight = seriesExcludeXAxisSeparatorHeight
        series.setHeight(seriesHeight - difHeight)
      }
    }

    const candleStickSeriesHeight = seriesExcludeXAxisSeparatorHeight - technicalIndicatorSeriesTotalHeight

    this._chartData.setTotalDataSpace(mainWidthWidth)
    const seriesSize = {}
    seriesSize.contentLeft = mainOffsetLeft
    seriesSize.contentRight = mainOffsetLeft + mainWidthWidth
    const tags = {}
    tags[CANDLE_STICK_SERIES_TAG] = { contentTop: 0, contentBottom: candleStickSeriesHeight }
    let contentTop = candleStickSeriesHeight
    let contentBottom = candleStickSeriesHeight
    this._candleStickSeries.setSize(
      { left: mainOffsetLeft, width: mainWidthWidth, height: candleStickSeriesHeight },
      { left: yAxisOffsetLeft, width: yAxisWidth, height: candleStickSeriesHeight }
    )

    for (let i = 0; i < this._technicalIndicatorSeries.length; i++) {
      const technicalIndicatorSeries = this._technicalIndicatorSeries[i]
      const separatorSeries = this._separatorSeries[i]
      const technicalIndicatorSeriesHeight = technicalIndicatorSeries.height()
      technicalIndicatorSeries.setSize(
        { left: mainOffsetLeft, width: mainWidthWidth, height: technicalIndicatorSeriesHeight },
        { left: yAxisOffsetLeft, width: yAxisWidth, height: technicalIndicatorSeriesHeight }
      )
      separatorSeries.setSize(mainOffsetLeft, mainWidthWidth)
      contentBottom += technicalIndicatorSeriesHeight
      tags[technicalIndicatorSeries.tag()] = { contentTop, contentBottom }
      contentTop = contentBottom
    }
    seriesSize.tags = tags
    this._xAxisSeries.setSize(
      { left: mainOffsetLeft, width: mainWidthWidth, height: xAxisHeight },
      { left: yAxisOffsetLeft, width: yAxisWidth, height: xAxisHeight }
    )
    this._chartEvent.setSeriesSize(seriesSize)
  }

  /**
   * 加载技术指标参数
   * @param technicalIndicatorType
   * @param params
   */
  applyTechnicalIndicatorParams (technicalIndicatorType, params) {
    this._chartData.applyTechnicalIndicatorParams(technicalIndicatorType, params)
    if (this._chartData.calcTechnicalIndicator(technicalIndicatorType)) {
      const candleStickSeriesTechnicalIndicatorType = this._candleStickSeries.technicalIndicatorType()
      if (candleStickSeriesTechnicalIndicatorType === technicalIndicatorType) {
        this._candleStickSeries.invalidate(InvalidateLevel.FULL)
      }
      for (const series of this._technicalIndicatorSeries) {
        const seriesTechnicalIndicatorType = series.technicalIndicatorType()
        if (seriesTechnicalIndicatorType === technicalIndicatorType) {
          series.invalidate(InvalidateLevel.FULL)
        }
      }
    }
  }

  /**
   * 处理数组数据
   * @param dataList
   * @param more
   * @param extendFun
   * @private
   */
  _applyDataList (dataList, more, extendFun) {
    if (isArray(dataList)) {
      if (isFunction(extendFun)) {
        extendFun()
      }
      const level = this._chartData.addData(dataList, 0, more)
      if (level !== InvalidateLevel.NONE) {
        this._calcAllSeriesTechnicalIndicator(level)
      }
    }
  }

  /**
   * 添加新数据
   * @param dataList
   * @param more
   */
  applyNewData (dataList, more) {
    this._applyDataList(dataList, more, () => {
      this._chartData.clearDataList()
    })
  }

  /**
   * 添加更多数据
   * @param dataList
   * @param more
   */
  applyMoreData (dataList, more) {
    this._applyDataList(dataList, more)
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
   * 设置蜡烛图图表类型
   * @param type
   */
  setCandleStickSeriesType (type) {
    this._candleStickSeries.setChartType(type)
  }

  /**
   * 创建一个指标
   * @param technicalIndicatorType
   * @param height
   * @returns {string}
   */
  createTechnicalIndicator (technicalIndicatorType, height = DEFAULT_TECHNICAL_INDICATOR_SERIES_HEIGHT) {
    if (
      !technicalIndicatorType ||
      !TechnicalIndicatorType.hasOwnProperty(technicalIndicatorType) ||
      technicalIndicatorType === TechnicalIndicatorType.NO ||
      technicalIndicatorType === TechnicalIndicatorType.AVERAGE
    ) {
      technicalIndicatorType = TechnicalIndicatorType.MACD
    }
    const technicalIndicatorSeriesCount = this._technicalIndicatorSeries.length
    this._separatorSeries.push(
      new SeparatorSeries(
        this._chartContainer, this._chartData,
        technicalIndicatorSeriesCount, {
          startDrag: this._separatorStartDrag.bind(this),
          drag: this._separatorDrag.bind(this)
        }
      )
    )
    this._technicalIndicatorBaseId++
    const tag = `${TECHNICAL_INDICATOR_NAME_PREFIX}${this._technicalIndicatorBaseId}`
    const technicalIndicatorSeries = new TechnicalIndicatorSeries({
      container: this._chartContainer,
      chartData: this._chartData,
      xAxis: this._xAxisSeries.xAxis(),
      technicalIndicatorType,
      tag
    })
    technicalIndicatorSeries.setHeight(height)
    this._technicalIndicatorSeries.push(technicalIndicatorSeries)
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
      this._technicalIndicatorSeries.splice(seriesPos, 1)
      this._separatorSeries.splice(seriesPos, 1)
      for (let i = 0; i < this._separatorSeries.length; i++) {
        this._separatorSeries[i].updateSeriesIndex(i)
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

  /**
   * 设置时区
   * @param timezone
   */
  setTimezone (timezone) {
    this._chartData.setTimezone(timezone)
    this._xAxisSeries.invalidate(InvalidateLevel.FULL)
  }

  /**
   * 获取图表转换为图片后url
   * @param includeFloatLayer,
   * @param includeGraphicMark
   * @param type
   */
  getConvertPictureUrl (includeFloatLayer, includeGraphicMark, type = 'jpeg') {
    if (type !== 'png' && type !== 'jpeg' && type !== 'bmp') {
      throw new Error('Picture format only supports jpeg, png and bmp!!!')
    }
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const pixelRatio = getPixelRatio(ctx)
    const width = this._chartContainer.offsetWidth
    const height = this._chartContainer.offsetHeight
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)
    let offsetTop = 0
    const candleStickSeriesHeight = this._candleStickSeries.height()
    ctx.drawImage(
      this._candleStickSeries.getImage(includeFloatLayer, includeGraphicMark),
      0, offsetTop, width, candleStickSeriesHeight
    )
    ctx.drawImage(
      this._candleStickSeries.getImage(includeFloatLayer, includeGraphicMark),
      0, offsetTop, width, candleStickSeriesHeight
    )
    offsetTop += candleStickSeriesHeight
    for (let i = 0; i < this._separatorSeries.length; i++) {
      const separatorSeries = this._separatorSeries[i]
      const separatorSeriesHeight = separatorSeries.height()
      const technicalIndicatorSeries = this._technicalIndicatorSeries[i]
      const technicalIndicatorSeriesHeight = technicalIndicatorSeries.height()
      ctx.drawImage(
        separatorSeries.getImage(),
        0, offsetTop, width, separatorSeriesHeight
      )
      offsetTop += separatorSeriesHeight
      ctx.drawImage(
        technicalIndicatorSeries.getImage(includeFloatLayer),
        0, offsetTop, width, technicalIndicatorSeriesHeight
      )
      offsetTop += technicalIndicatorSeriesHeight
    }

    ctx.drawImage(
      this._xAxisSeries.getImage(includeFloatLayer),
      0, offsetTop, width, this._xAxisSeries.height()
    )
    return canvas.toDataURL(`image/${type}`)
  }

  destroy () {
    this._candleStickSeries.destroy()
    this._technicalIndicatorSeries.forEach(series => {
      series.destroy()
    })
    this._separatorSeries.forEach(series => {
      series.destroy()
    })
    this._xAxisSeries.destroy()
    this._container.removeChild(this._chartContainer)
    this._chartEvent.destroy()
    delete this
  }
}

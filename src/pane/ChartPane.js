/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ChartData, { InvalidateLevel } from '../data/ChartData'
import CandleStickPane from './CandleStickPane'
import XAxisPane from './XAxisPane'

import { ChartType, YAxisPosition, YAxisTextPosition } from '../data/options/styleOptions'
import { isArray, isBoolean, isFunction, isObject } from '../utils/typeChecks'
import { formatValue } from '../utils/format'
import TechnicalIndicatorPane from './TechnicalIndicatorPane'
import SeparatorPane from './SeparatorPane'

import { NO, MA, AVERAGE, MACD } from '../data/technicalindicator/technicalIndicatorType'
import ChartEvent from '../event/ChartEvent'
import { getPixelRatio } from '../utils/canvas'

const DEFAULT_TECHNICAL_INDICATOR_PANE_HEIGHT = 100

const TECHNICAL_INDICATOR_NAME_PREFIX = 'technical_indicator_'

export const CANDLE_STICK_PANE_TAG = 'candle_stick_pane_tag'

export default class ChartPane {
  constructor (container, styleOptions) {
    this._initChartContainer(container)
    this._technicalIndicatorBaseId = 0
    this._technicalIndicatorPanes = []
    this._separatorPanes = []
    this._separatorDragStartTechnicalIndicatorHeight = 0
    this._chartData = new ChartData(styleOptions, this._updatePane.bind(this))
    this._xAxisPane = new XAxisPane({ container: this._chartContainer, chartData: this._chartData })
    this._candleStickPane = new CandleStickPane({
      container: this._chartContainer,
      chartData: this._chartData,
      xAxis: this._xAxisPane.xAxis(),
      technicalIndicatorType: MA,
      tag: CANDLE_STICK_PANE_TAG
    })
    this._chartEvent = new ChartEvent(
      this._chartContainer, this._chartData,
      this._xAxisPane.xAxis(),
      this._candleStickPane.yAxis()
    )
    this.measurePaneSize()
  }

  /**
   * 初始化图表容器
   * @param container
   * @private
   */
  _initChartContainer (container) {
    this._container = container
    this._chartContainer = document.createElement('div')
    this._chartContainer.style.userSelect = 'none'
    this._chartContainer.style.webkitUserSelect = 'none'
    this._chartContainer.style.msUserSelect = 'none'
    this._chartContainer.style.MozUserSelect = 'none'
    this._chartContainer.style.webkitTapHighlightColor = 'transparent'
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
   * @param paneIndex
   * @private
   */
  _separatorStartDrag (paneIndex) {
    this._separatorDragStartTechnicalIndicatorHeight = this._technicalIndicatorPanes[paneIndex].height()
  }

  /**
   * 分割线拖拽
   * @param dragDistance
   * @param paneIndex
   * @private
   */
  _separatorDrag (dragDistance, paneIndex) {
    let height = this._separatorDragStartTechnicalIndicatorHeight - dragDistance
    if (height < 0) {
      height = 0
    }
    this._technicalIndicatorPanes[paneIndex].setHeight(height)
    this.measurePaneSize()
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
    return separator.size * this._separatorPanes.length
  }

  /**
   * 更新所有pane
   * @private
   */
  _updatePane (invalidateLevel = InvalidateLevel.FULL) {
    if (invalidateLevel !== InvalidateLevel.GRAPHIC_MARK) {
      this._xAxisPane.invalidate(invalidateLevel)
      for (const pane of this._technicalIndicatorPanes) {
        pane.invalidate(invalidateLevel)
      }
    }
    this._candleStickPane.invalidate(invalidateLevel)
  }

  /**
   * 计算所有pane的指标
   * @private
   */
  _calcAllPaneTechnicalIndicator () {
    const technicalIndicatorArray = []
    let candleStickTechnicalIndicator
    if (this._candleStickPane.chartType() === ChartType.CANDLE_STICK) {
      candleStickTechnicalIndicator = this._candleStickPane.technicalIndicator()
      technicalIndicatorArray.push(candleStickTechnicalIndicator)
    } else {
      candleStickTechnicalIndicator = AVERAGE
    }
    this._chartData.calcTechnicalIndicator(this._candleStickPane, candleStickTechnicalIndicator)
    for (const pane of this._technicalIndicatorPanes) {
      const technicalIndicator = pane.technicalIndicator()
      if (technicalIndicatorArray.indexOf(technicalIndicator) < 0) {
        technicalIndicatorArray.push(technicalIndicator)
        this._chartData.calcTechnicalIndicator(pane, technicalIndicator)
      } else {
        pane.invalidate(InvalidateLevel.FULL)
      }
    }
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
  measurePaneSize () {
    const yAxis = this._chartData.styleOptions().yAxis
    const isYAxisLeft = yAxis.position === YAxisPosition.LEFT
    const isYAxisTextOutsize = yAxis.tickText.position === YAxisTextPosition.OUTSIDE
    const paneWidth = this._container.offsetWidth
    const paneHeight = this._container.offsetHeight
    const separatorHeight = this._measureSeparatorHeight()
    const xAxisHeight = this._measureXAxisHeight()
    const yAxisWidth = this._measureYAxisWidth()
    const paneExcludeXAxisSeparatorHeight = paneHeight - xAxisHeight - separatorHeight
    const mainWidthWidth = paneWidth - (isYAxisTextOutsize ? yAxisWidth : 0)
    let yAxisOffsetLeft = paneWidth - yAxisWidth
    let mainOffsetLeft = 0
    if (isYAxisLeft) {
      yAxisOffsetLeft = 0
      if (isYAxisTextOutsize) {
        mainOffsetLeft = yAxisWidth
      }
    }
    let technicalIndicatorPaneTotalHeight = 0
    for (const pane of this._technicalIndicatorPanes) {
      const paneHeight = pane.height()
      technicalIndicatorPaneTotalHeight += paneHeight
      // 修复拖拽会超出容器高度问题
      if (technicalIndicatorPaneTotalHeight > paneExcludeXAxisSeparatorHeight) {
        const difHeight = technicalIndicatorPaneTotalHeight - paneExcludeXAxisSeparatorHeight
        technicalIndicatorPaneTotalHeight = paneExcludeXAxisSeparatorHeight
        pane.setHeight(paneHeight - difHeight)
      }
    }

    const candleStickPaneHeight = paneExcludeXAxisSeparatorHeight - technicalIndicatorPaneTotalHeight

    this._chartData.setTotalDataSpace(mainWidthWidth)
    const paneSize = {}
    paneSize.contentLeft = mainOffsetLeft
    paneSize.contentRight = mainOffsetLeft + mainWidthWidth
    const tags = {}
    tags[CANDLE_STICK_PANE_TAG] = { contentTop: 0, contentBottom: candleStickPaneHeight }
    let contentTop = candleStickPaneHeight
    let contentBottom = candleStickPaneHeight
    this._candleStickPane.setSize(
      { left: mainOffsetLeft, width: mainWidthWidth, height: candleStickPaneHeight },
      { left: yAxisOffsetLeft, width: yAxisWidth, height: candleStickPaneHeight }
    )

    for (let i = 0; i < this._technicalIndicatorPanes.length; i++) {
      const technicalIndicatorPane = this._technicalIndicatorPanes[i]
      const separatorPane = this._separatorPanes[i]
      const technicalIndicatorPaneHeight = technicalIndicatorPane.height()
      technicalIndicatorPane.setSize(
        { left: mainOffsetLeft, width: mainWidthWidth, height: technicalIndicatorPaneHeight },
        { left: yAxisOffsetLeft, width: yAxisWidth, height: technicalIndicatorPaneHeight }
      )
      separatorPane.setSize(mainOffsetLeft, mainWidthWidth)
      contentBottom += technicalIndicatorPaneHeight
      tags[technicalIndicatorPane.tag()] = { contentTop, contentBottom }
      contentTop = contentBottom
    }
    paneSize.tags = tags
    this._xAxisPane.setSize(
      { left: mainOffsetLeft, width: mainWidthWidth, height: xAxisHeight },
      { left: yAxisOffsetLeft, width: yAxisWidth, height: xAxisHeight }
    )
    this._chartEvent.setPaneSize(paneSize)
  }

  /**
   * 加载技术指标参数
   * @param technicalIndicatorType
   * @param params
   */
  applyTechnicalIndicatorParams (technicalIndicatorType, params) {
    this._chartData.applyTechnicalIndicatorParams(technicalIndicatorType, params)
    const paneCollection = []
    const candleStickPaneTechnicalIndicatorType = this._candleStickPane.technicalIndicatorType()
    if (candleStickPaneTechnicalIndicatorType === technicalIndicatorType) {
      paneCollection.push(this._candleStickPane)
    }
    for (const pane of this._technicalIndicatorPanes) {
      const paneTechnicalIndicatorType = pane.technicalIndicatorType()
      if (paneTechnicalIndicatorType === technicalIndicatorType) {
        paneCollection.push(pane)
      }
    }
    this._chartData.calcTechnicalIndicator(paneCollection, technicalIndicatorType)
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
      this._chartData.addData(dataList, 0, more)
      this._xAxisPane.invalidate(InvalidateLevel.FULL)
      this._calcAllPaneTechnicalIndicator()
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
      this._xAxisPane.invalidate(pos === dataSize - 1 ? InvalidateLevel.NONE : InvalidateLevel.FULL)
      this._calcAllPaneTechnicalIndicator()
    }
  }

  /**
   * 设置蜡烛图图表类型
   * @param type
   */
  setCandleStickPaneType (type) {
    this._candleStickPane.setChartType(type)
  }

  /**
   * 创建一个指标
   * @param technicalIndicatorType
   * @param height
   * @param dragEnabled
   * @returns {string}
   */
  createTechnicalIndicator (technicalIndicatorType, height = DEFAULT_TECHNICAL_INDICATOR_PANE_HEIGHT, dragEnabled) {
    if (
      !technicalIndicatorType ||
      !this._chartData.technicalIndicator(technicalIndicatorType) ||
      technicalIndicatorType === NO ||
      technicalIndicatorType === AVERAGE
    ) {
      technicalIndicatorType = MACD
    }
    const technicalIndicatorPaneCount = this._technicalIndicatorPanes.length
    const isDrag = isBoolean(dragEnabled) ? dragEnabled : true
    this._separatorPanes.push(
      new SeparatorPane(
        this._chartContainer, this._chartData,
        technicalIndicatorPaneCount, isDrag,
        {
          startDrag: this._separatorStartDrag.bind(this),
          drag: this._separatorDrag.bind(this)
        }
      )
    )
    this._technicalIndicatorBaseId++
    const tag = `${TECHNICAL_INDICATOR_NAME_PREFIX}${this._technicalIndicatorBaseId}`
    const technicalIndicatorPane = new TechnicalIndicatorPane({
      container: this._chartContainer,
      chartData: this._chartData,
      xAxis: this._xAxisPane.xAxis(),
      technicalIndicatorType,
      tag
    })
    technicalIndicatorPane.setHeight(height)
    this._technicalIndicatorPanes.push(technicalIndicatorPane)
    this.measurePaneSize()
    return tag
  }

  /**
   * 移除一个指标
   * @param tag
   */
  removeTechnicalIndicator (tag) {
    let panePos = -1
    for (let i = 0; i < this._technicalIndicatorPanes.length; i++) {
      const pane = this._technicalIndicatorPanes[i]
      if (pane.tag() === tag) {
        panePos = i
        break
      }
    }
    if (panePos !== -1) {
      this._technicalIndicatorPanes[panePos].destroy()
      this._separatorPanes[panePos].destroy()
      this._technicalIndicatorPanes.splice(panePos, 1)
      this._separatorPanes.splice(panePos, 1)
      for (let i = 0; i < this._separatorPanes.length; i++) {
        this._separatorPanes[i].updatePaneIndex(i)
      }
      this.measurePaneSize()
    }
  }

  /**
   * 设置指标类型
   * @param tag
   * @param technicalIndicatorType
   */
  setTechnicalIndicatorType (tag, technicalIndicatorType) {
    if (tag === CANDLE_STICK_PANE_TAG) {
      this._candleStickPane.setTechnicalIndicatorType(technicalIndicatorType)
    } else {
      let s
      for (const pane of this._technicalIndicatorPanes) {
        if (pane.tag() === tag) {
          s = pane
          break
        }
      }
      if (s) {
        if (technicalIndicatorType === NO) {
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
    this._xAxisPane.invalidate(InvalidateLevel.FULL)
  }

  /**
   * 获取图表转换为图片后url
   * @param includeFloatLayer,
   * @param includeGraphicMark
   * @param type
   * @param backgroundColor
   */
  getConvertPictureUrl (includeFloatLayer, includeGraphicMark, type = 'jpeg', backgroundColor = '#333333') {
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

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
    let offsetTop = 0
    const candleStickPaneHeight = this._candleStickPane.height()
    ctx.drawImage(
      this._candleStickPane.getImage(includeFloatLayer, includeGraphicMark),
      0, offsetTop, width, candleStickPaneHeight
    )
    offsetTop += candleStickPaneHeight
    for (let i = 0; i < this._separatorPanes.length; i++) {
      const separatorPane = this._separatorPanes[i]
      const separatorPaneHeight = separatorPane.height()
      const technicalIndicatorPane = this._technicalIndicatorPanes[i]
      const technicalIndicatorPaneHeight = technicalIndicatorPane.height()
      ctx.drawImage(
        separatorPane.getImage(),
        0, offsetTop, width, separatorPaneHeight
      )
      offsetTop += separatorPaneHeight
      ctx.drawImage(
        technicalIndicatorPane.getImage(includeFloatLayer),
        0, offsetTop, width, technicalIndicatorPaneHeight
      )
      offsetTop += technicalIndicatorPaneHeight
    }

    ctx.drawImage(
      this._xAxisPane.getImage(includeFloatLayer),
      0, offsetTop, width, this._xAxisPane.height()
    )
    return canvas.toDataURL(`image/${type}`)
  }

  destroy () {
    this._candleStickPane.destroy()
    this._technicalIndicatorPanes.forEach(pane => {
      pane.destroy()
    })
    this._separatorPanes.forEach(pane => {
      pane.destroy()
    })
    this._xAxisPane.destroy()
    this._container.removeChild(this._chartContainer)
    this._chartEvent.destroy()
    delete this
  }
}

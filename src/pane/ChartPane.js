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

import ChartData, { ActionType, InvalidateLevel } from '../data/ChartData'
import { getTechnicalIndicatorInfo } from '../data/base/technicalindicator/technicalIndicatorControl'

import CandlePane from './CandlePane'
import XAxisPane from './XAxisPane'

import { YAxisPosition } from '../data/options/styleOptions'
import { isArray, isBoolean, isFunction, isObject, isValid } from '../utils/typeChecks'
import { formatValue } from '../utils/format'
import TechnicalIndicatorPane from './TechnicalIndicatorPane'
import SeparatorPane from './SeparatorPane'

import ChartEvent from '../event/ChartEvent'
import { getPixelRatio } from '../utils/canvas'
import { throttle } from '../utils/performance'
import Annotation from '../data/base/overlay/annotation/Annotation'

const DEFAULT_TECHNICAL_INDICATOR_PANE_HEIGHT = 100

const TECHNICAL_INDICATOR_PANE_ID_PREFIX = 'technical_indicator_pane_'

const GRAPHIC_MARK_ID_PREFIX = 'graphic_mark_'

export const TECHNICAL_INDICATOR_PANE = 'technicalIndicator'

export const CANDLE_PANE_ID = 'candle_pane'

export default class ChartPane {
  constructor (container, styleOptions) {
    this._initChartContainer(container)
    this._graphicMarkBaseId = 0
    this._paneBaseId = 0
    this._technicalIndicatorPanes = []
    this._separatorPanes = []
    this._separatorDragStartTechnicalIndicatorHeight = 0
    this._chartData = new ChartData(styleOptions, this._updatePane.bind(this))
    this._xAxisPane = new XAxisPane({ container: this._chartContainer, chartData: this._chartData })
    this._candlePane = new CandlePane({
      container: this._chartContainer,
      chartData: this._chartData,
      xAxis: this._xAxisPane.xAxis(),
      id: CANDLE_PANE_ID
    })
    this._chartWidth = {}
    this._chartHeight = {}
    this._chartEvent = new ChartEvent(this._chartContainer, this._chartData)
    this._chartData.crosshairDelegate().subscribe(this._crosshairObserver.bind(this))
    this.adjustPaneViewport(true, true, true)
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
   * 十字光标观察者
   * @private
   */
  _crosshairObserver ({ dataIndex, kLineData, x, y }) {
    if (this.chartData().hasAction(ActionType.crosshair)) {
      const getData = (pane) => {
        const data = {}
        pane.technicalIndicators().forEach(tech => {
          const result = tech.result
          data[tech.name] = result[dataIndex]
        })
        return data
      }
      const technicalIndicatorData = {
        [this._candlePane.id()]: getData(this._candlePane)
      }
      this._technicalIndicatorPanes.forEach(pane => {
        technicalIndicatorData[pane.id()] = getData(pane)
      })
      this._chartData.actionExecute(ActionType.crosshair, {
        coordinate: { x, y },
        dataIndex,
        kLineData,
        technicalIndicatorData
      })
    }
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
    this.adjustPaneViewport(true, true, true, true, true)
  }

  /**
   * 更新所有pane
   * @private
   */
  _updatePane (invalidateLevel = InvalidateLevel.FULL) {
    if (invalidateLevel === InvalidateLevel.TOOLTIP) {
      this._xAxisPane.invalidate(invalidateLevel)
      this._candlePane.invalidate(invalidateLevel)
      this._technicalIndicatorPanes.forEach(pane => {
        pane.invalidate(invalidateLevel)
      })
    } else {
      let shouldMeasureWidth = this._candlePane.computeAxis()
      if (invalidateLevel !== InvalidateLevel.OVERLAY) {
        this._technicalIndicatorPanes.forEach(pane => {
          const should = pane.computeAxis()
          if (should) {
            shouldMeasureWidth = should
          }
        })
      }
      this.adjustPaneViewport(false, shouldMeasureWidth, true)
    }
  }

  /**
   * 计算所有pane的指标
   * @private
   */
  _calcAllPaneTechnicalIndicator () {
    const tasks = [
      Promise.resolve(this._candlePane.calcAllTechnicalIndicator())
    ]
    this._technicalIndicatorPanes.forEach(pane => {
      tasks.push(
        Promise.resolve(pane.calcAllTechnicalIndicator())
      )
    })
    Promise.all(tasks).then(
      result => {
        const shouldMeasureWidth = result.indexOf(true) > -1
        this.adjustPaneViewport(false, shouldMeasureWidth, true)
      }
    )
  }

  /**
   * 测量pane高度
   * @private
   */
  _measurePaneHeight () {
    const styleOptions = this._chartData.styleOptions()
    const paneHeight = this._container.offsetHeight
    const separatorSize = styleOptions.separator.size
    const separatorTotalHeight = separatorSize * this._separatorPanes.length
    const xAxisHeight = this._xAxisPane.getSelfAxisHeight()
    const paneExcludeXAxisSeparatorHeight = paneHeight - xAxisHeight - separatorTotalHeight
    let technicalIndicatorPaneTotalHeight = 0
    this._technicalIndicatorPanes.forEach(pane => {
      const paneHeight = pane.height()
      technicalIndicatorPaneTotalHeight += paneHeight
      // 修复拖拽会超出容器高度问题
      if (technicalIndicatorPaneTotalHeight > paneExcludeXAxisSeparatorHeight) {
        const difHeight = technicalIndicatorPaneTotalHeight - paneExcludeXAxisSeparatorHeight
        technicalIndicatorPaneTotalHeight = paneExcludeXAxisSeparatorHeight
        pane.setHeight(paneHeight - difHeight)
      }
    })

    const candleStickPaneHeight = paneExcludeXAxisSeparatorHeight - technicalIndicatorPaneTotalHeight

    const paneContentSize = {}
    paneContentSize[CANDLE_PANE_ID] = { contentTop: 0, contentBottom: candleStickPaneHeight }
    let contentTop = candleStickPaneHeight
    let contentBottom = candleStickPaneHeight
    this._candlePane.setHeight(candleStickPaneHeight)
    this._chartHeight[this._candlePane.id()] = candleStickPaneHeight
    this._technicalIndicatorPanes.forEach(pane => {
      const technicalIndicatorPaneHeight = pane.height()
      pane.setHeight(technicalIndicatorPaneHeight)
      contentBottom += (technicalIndicatorPaneHeight + separatorSize)
      paneContentSize[pane.id()] = { contentTop, contentBottom }
      this._chartHeight[pane.id()] = technicalIndicatorPaneHeight
      contentTop = contentBottom
    })
    this._xAxisPane.setHeight(xAxisHeight)
    this._chartHeight.xAxis = xAxisHeight
    this._chartHeight.total = paneHeight
    this._chartEvent.setPaneContentSize(paneContentSize)
  }

  /**
   * 测量pan宽度
   * @private
   */
  _measurePaneWidth () {
    const styleOptions = this._chartData.styleOptions()
    const yAxisOptions = styleOptions.yAxis
    const isYAxisLeft = yAxisOptions.position === YAxisPosition.LEFT
    const isOutside = !yAxisOptions.inside
    const paneWidth = this._container.offsetWidth
    let mainWidth
    let yAxisWidth
    let yAxisOffsetLeft
    let mainOffsetLeft
    if (isOutside) {
      yAxisWidth = this._candlePane.getSelfAxisWidth()
      this._technicalIndicatorPanes.forEach(pane => {
        yAxisWidth = Math.max(yAxisWidth, pane.getSelfAxisWidth())
      })
      mainWidth = paneWidth - yAxisWidth
      if (isYAxisLeft) {
        yAxisOffsetLeft = 0
        mainOffsetLeft = yAxisWidth
      } else {
        mainOffsetLeft = 0
        yAxisOffsetLeft = paneWidth - yAxisWidth
      }
    } else {
      mainWidth = paneWidth
      yAxisWidth = paneWidth
      yAxisOffsetLeft = 0
      mainOffsetLeft = 0
    }

    this._chartData.setTotalDataSpace(mainWidth)
    this._candlePane.setWidth(mainWidth, yAxisWidth)
    this._candlePane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft)

    for (let i = 0; i < this._technicalIndicatorPanes.length; i++) {
      const technicalIndicatorPane = this._technicalIndicatorPanes[i]
      const separatorPane = this._separatorPanes[i]
      technicalIndicatorPane.setWidth(mainWidth, yAxisWidth)
      technicalIndicatorPane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft)
      separatorPane.setSize(mainOffsetLeft, mainWidth)
    }
    this._chartWidth = { content: mainWidth, yAxis: yAxisWidth, total: paneWidth }
    this._xAxisPane.setWidth(mainWidth, yAxisWidth)
    this._xAxisPane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft)
    this._chartEvent.setChartContentSize({ contentLeft: mainOffsetLeft, contentRight: mainOffsetLeft + mainWidth })
  }

  /**
   * 调整窗口尺寸
   * @param shouldMeasureHeight
   * @param shouldMeasureWidth
   * @param shouldLayout
   * @param shouldComputeAxis
   * @param shouldForceComputeAxis
   */
  adjustPaneViewport (
    shouldMeasureHeight, shouldMeasureWidth, shouldLayout, shouldComputeAxis, shouldForceComputeAxis
  ) {
    if (shouldMeasureHeight) {
      this._measurePaneHeight()
    }
    let isAdjust = false
    if (shouldComputeAxis) {
      isAdjust = this._candlePane.computeAxis(shouldForceComputeAxis)
      this._technicalIndicatorPanes.forEach(pane => {
        const adjust = pane.computeAxis(shouldForceComputeAxis)
        if (!isAdjust) {
          isAdjust = adjust
        }
      })
    }
    if ((!shouldComputeAxis && shouldMeasureWidth) || (shouldComputeAxis && isAdjust)) {
      this._measurePaneWidth()
    }
    if (shouldLayout) {
      this._xAxisPane.computeAxis()
      this._xAxisPane.layout()
      this._candlePane.layout()
      this._technicalIndicatorPanes.forEach(pane => {
        pane.layout()
      })
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
   * 覆盖技术指标
   * @param name
   * @param calcParams
   * @param precision
   * @param styles
   */
  overrideTechnicalIndicator ({ name, calcParams, precision, styles }) {
    const technicalIndicator = this._chartData.technicalIndicator(name)
    if (technicalIndicator) {
      const calcParamsSuccess = technicalIndicator.setCalcParams(calcParams)
      const precisionSuccess = technicalIndicator.setPrecision(precision)
      const defaultTechnicalStyleOptions = this._chartData.styleOptions().technicalIndicator
      const styleSuccess = technicalIndicator.setStyles(styles, defaultTechnicalStyleOptions)
      if (calcParamsSuccess || precisionSuccess || styleSuccess) {
        const candleTechnicalIndicators = this._candlePane.technicalIndicators()
        let shouldAdjust = false
        const tasks = []
        candleTechnicalIndicators.forEach(technicalIndicator => {
          if (technicalIndicator.name === name) {
            if (calcParamsSuccess) {
              shouldAdjust = true
              technicalIndicator.setCalcParams(calcParams)
              tasks.push(
                Promise.resolve(this._candlePane.calcTechnicalIndicator(technicalIndicator))
              )
            }
            if (precisionSuccess) {
              shouldAdjust = true
              technicalIndicator.setPrecision(precision)
            }
            if (styleSuccess) {
              shouldAdjust = true
              technicalIndicator.setStyles(styles, defaultTechnicalStyleOptions)
            }
          }
        })
        this._technicalIndicatorPanes.forEach(pane => {
          const technicalIndicators = pane.technicalIndicators()
          technicalIndicators.forEach(technicalIndicator => {
            if (technicalIndicator.name === name) {
              if (calcParamsSuccess) {
                shouldAdjust = true
                technicalIndicator.setCalcParams(calcParams)
                tasks.push(
                  Promise.resolve(pane.calcTechnicalIndicator(technicalIndicator))
                )
              }
              if (precisionSuccess) {
                shouldAdjust = true
                technicalIndicator.setPrecision(precision)
              }
              if (styleSuccess) {
                shouldAdjust = true
                technicalIndicator.setStyles(styles, defaultTechnicalStyleOptions)
              }
            }
          })
        })
        if (shouldAdjust) {
          Promise.all(tasks).then(
            _ => {
              this.adjustPaneViewport(false, true, true, true)
            }
          )
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
      this._chartData.addData(dataList, 0, more)
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
      if (timestamp >= lastDataTimestamp) {
        let pos = dataSize
        if (timestamp === lastDataTimestamp) {
          pos = dataSize - 1
        }
        this._chartData.addData(data, pos)
        this._calcAllPaneTechnicalIndicator()
      }
    }
  }

  /**
   * 移除指标
   * @param paneId
   * @param name
   */
  removeTechnicalIndicator (paneId, name) {
    if (paneId === CANDLE_PANE_ID) {
      if (this._candlePane.removeTechnicalIndicator(name)) {
        this.adjustPaneViewport(false, true, true, true)
      }
    } else {
      let paneIndex
      for (let i = 0; i < this._technicalIndicatorPanes.length; i++) {
        const pane = this._technicalIndicatorPanes[i]
        if (pane.id() === paneId) {
          paneIndex = i
          break
        }
      }
      if (isValid(paneIndex)) {
        const removed = this._technicalIndicatorPanes[paneIndex].removeTechnicalIndicator(name)
        if (this._technicalIndicatorPanes[paneIndex].isEmptyTechnicalIndicator()) {
          this._technicalIndicatorPanes[paneIndex].destroy()
          this._separatorPanes[paneIndex].destroy()
          this._technicalIndicatorPanes.splice(paneIndex, 1)
          this._separatorPanes.splice(paneIndex, 1)
          for (let i = 0; i < this._separatorPanes.length; i++) {
            this._separatorPanes[i].updatePaneIndex(i)
          }
          this.adjustPaneViewport(true, true, true, true, true)
        } else {
          if (removed) {
            this.adjustPaneViewport(false, true, true, true)
          }
        }
      }
    }
  }

  /**
   * 设置指标类型
   * @param technicalIndicator 技术指标实例
   * @param isStack 是否覆盖
   * @param options 配置
   */
  createTechnicalIndicator (technicalIndicator, isStack, options = {}) {
    if (options.id) {
      if (options.id === CANDLE_PANE_ID) {
        if (this._candlePane.setTechnicalIndicator(technicalIndicator, isStack)) {
          this.adjustPaneViewport(false, true, true, true)
        }
        return options.id
      }
      for (const pane of this._technicalIndicatorPanes) {
        if (options.id === pane.id()) {
          if (pane.setTechnicalIndicator(technicalIndicator, isStack)) {
            this.adjustPaneViewport(false, true, true, true)
          }
          return options.id
        }
      }
    }
    const technicalIndicatorPaneCount = this._technicalIndicatorPanes.length
    const isDrag = isBoolean(options.dragEnabled) ? options.dragEnabled : true
    this._separatorPanes.push(
      new SeparatorPane(
        this._chartContainer, this._chartData,
        technicalIndicatorPaneCount, isDrag,
        {
          startDrag: this._separatorStartDrag.bind(this),
          drag: throttle(this._separatorDrag.bind(this), 50)
        }
      )
    )
    const id = options.id || `${TECHNICAL_INDICATOR_PANE_ID_PREFIX}${++this._paneBaseId}`
    const technicalIndicatorPane = new TechnicalIndicatorPane({
      container: this._chartContainer,
      chartData: this._chartData,
      xAxis: this._xAxisPane.xAxis(),
      name: technicalIndicator.name,
      id,
      height: options.height || DEFAULT_TECHNICAL_INDICATOR_PANE_HEIGHT
    })
    this._technicalIndicatorPanes.push(technicalIndicatorPane)
    this.adjustPaneViewport(true, true, true, true, true)
    return id
  }

  /**
   * 获取窗口技术指标
   * @param paneId
   * @return {{}}
   */
  getPaneTechnicalIndicator (paneId) {
    const technicalIndicatorInfo = (pane) => {
      const technicals = {}
      pane.technicalIndicators().forEach(technicalIndicator => {
        technicals[technicalIndicator.name] = getTechnicalIndicatorInfo(technicalIndicator)
      })
      return technicals
    }

    if (isValid(paneId)) {
      if (paneId === CANDLE_PANE_ID) {
        return technicalIndicatorInfo(this._candlePane)
      } else {
        for (const pane of this._technicalIndicatorPanes) {
          if (pane.id() === paneId) {
            return technicalIndicatorInfo(pane)
          }
        }
      }
    } else {
      const technicals = {}
      technicals[this._candlePane.id()] = technicalIndicatorInfo(this._candlePane)
      for (const pane of this._technicalIndicatorPanes) {
        technicals[pane.id()] = technicalIndicatorInfo(pane)
      }
      return technicals
    }
    return {}
  }

  /**
   * 创建图形标记
   * @param GraphicMark
   * @param options
   */
  createGraphicMark (GraphicMark, options = {}) {
    const {
      id, points, styles, lock,
      onDrawStart, onDrawing,
      onDrawEnd, onClick,
      onRightClick, onPressedMove,
      onMouseEnter, onMouseLeave,
      onRemove
    } = options
    const graphicMarkId = id || `${GRAPHIC_MARK_ID_PREFIX}${++this._graphicMarkBaseId}`
    const graphicMarkInstance = new GraphicMark({
      id: graphicMarkId,
      chartData: this._chartData,
      xAxis: this._xAxisPane.xAxis(),
      yAxis: this._candlePane.yAxis(),
      points,
      styles,
      lock
    })
    if (isFunction(onDrawStart)) {
      graphicMarkInstance.onDrawStart = onDrawStart
      graphicMarkInstance.onDrawStart({ id: graphicMarkId })
    }
    if (isFunction(onDrawing)) {
      graphicMarkInstance.onDrawing = onDrawing
    }
    if (isFunction(onDrawEnd)) {
      graphicMarkInstance.onDrawEnd = onDrawEnd
    }
    if (isFunction(onClick)) {
      graphicMarkInstance.onClick = onClick
    }
    if (isFunction(onRightClick)) {
      graphicMarkInstance.onRightClick = onRightClick
    }
    if (isFunction(onPressedMove)) {
      graphicMarkInstance.onPressedMove = onPressedMove
    }
    if (isFunction(onMouseEnter)) {
      graphicMarkInstance.onMouseEnter = onMouseEnter
    }
    if (isFunction(onMouseLeave)) {
      graphicMarkInstance.onMouseLeave = onMouseLeave
    }
    if (isFunction(onRemove)) {
      graphicMarkInstance.onRemove = onRemove
    }
    if (this._chartData.addGraphicMarkInstance(graphicMarkInstance)) {
      return graphicMarkId
    }
  }

  /**
   * 创建注解
   * @param annotation
   */
  createAnnotation (annotation) {
    if (annotation) {
      const instances = []
      const annotations = [].concat(annotation)
      annotations.forEach(({
        point, symbol, position, styles,
        checkPointInCustomSymbol,
        drawCustomSymbol, drawExtend,
        onClick, onRightClick,
        onMouseEnter, onMouseLeave
      }) => {
        if (point && point.timestamp) {
          const annotationInstance = new Annotation({
            id: point.timestamp,
            chartData: this._chartData,
            symbol,
            point,
            position,
            xAxis: this._xAxisPane.xAxis(),
            yAxis: this._candlePane.yAxis(),
            styles
          })
          if (isFunction(drawExtend)) {
            annotationInstance.drawExtend = drawExtend
          }
          if (isFunction(checkPointInCustomSymbol)) {
            annotationInstance.checkPointInCustomSymbol = checkPointInCustomSymbol
          }
          if (isFunction(drawCustomSymbol)) {
            annotationInstance.drawCustomSymbol = drawCustomSymbol
          }
          if (isFunction(onClick)) {
            annotationInstance.onClick = onClick
          }
          if (isFunction(onRightClick)) {
            annotationInstance.onRightClick = onRightClick
          }
          if (isFunction(onMouseEnter)) {
            annotationInstance.onMouseEnter = onMouseEnter
          }
          if (isFunction(onMouseLeave)) {
            annotationInstance.onMouseLeave = onMouseLeave
          }
          instances.push(annotationInstance)
        }
      })
      this._chartData.addAnnotations(instances)
    }
  }

  /**
   * 设置时区
   * @param timezone
   */
  setTimezone (timezone) {
    this._chartData.setTimezone(timezone)
    this._xAxisPane.computeAxis()
    this._xAxisPane.invalidate(InvalidateLevel.FULL)
  }

  /**
   * 将值装换成像素
   * @param timestamp
   * @param value
   * @param paneId
   * @param dataIndexXAxis
   * @param absoluteYAxis
   */
  convertToPixel (value, { paneId, dataIndexXAxis, absoluteYAxis }) {
    const values = [].concat(value)
    let coordinates = []
    const convert = (pane, absoluteTop) => {
      return values.map(({ xAxisValue, yAxisValue }) => {
        const coordinate = {}
        if (isValid(xAxisValue)) {
          const dataIndex = dataIndexXAxis ? xAxisValue : this._chartData.timestampToDataIndex(xAxisValue)
          coordinate.x = this._xAxisPane.xAxis().convertToPixel(dataIndex)
        }
        if (isValid(yAxisValue)) {
          const y = pane.yAxis().convertToPixel(yAxisValue)
          coordinate.y = absoluteYAxis ? absoluteTop + y : y
        }
        return coordinate
      })
    }
    if (paneId) {
      if (paneId === this._candlePane.id()) {
        coordinates = convert(this._candlePane, 0)
      } else {
        let absoluteTop = this._candlePane.height()
        for (const pane of this._technicalIndicatorPanes) {
          if (paneId === pane.id()) {
            coordinates = convert(pane, absoluteTop)
            break
          }
          absoluteTop += pane.height()
        }
      }
    }
    return isArray(value) ? coordinates : (coordinates[0] || {})
  }

  /**
   * 将像素转换成值
   * @param coordinate
   * @param paneId
   * @param dataIndexXAxis
   * @param absoluteYAxis
   * @return {{}[]|*[]}
   */
  convertFromPixel (coordinate, { paneId, dataIndexXAxis, absoluteYAxis }) {
    const coordinates = [].concat(coordinate)
    let values = []
    const convert = (pane, absoluteTop) => {
      return coordinates.map(({ x, y }) => {
        const value = {}
        if (isValid(x)) {
          const v = this._xAxisPane.xAxis().convertFromPixel(x)
          value.xAxisValue = dataIndexXAxis ? v : this._chartData.dataIndexToTimestamp(v)
        }
        if (isValid(y)) {
          const ry = absoluteYAxis ? y - absoluteTop : y
          value.yAxisValue = pane.yAxis().convertFromPixel(ry)
        }
        return value
      })
    }
    if (paneId) {
      if (paneId === this._candlePane.id()) {
        values = convert(this._candlePane, 0)
      } else {
        let absoluteTop = this._candlePane.height()
        for (const pane of this._technicalIndicatorPanes) {
          if (paneId === pane.id()) {
            values = convert(pane, absoluteTop)
            break
          }
          absoluteTop += pane.height()
        }
      }
    }
    return isArray(coordinate) ? values : (values[0] || {})
  }

  /**
   * 图表宽度
   * @return {*|{}}
   */
  chartWidth () {
    return this._chartWidth
  }

  /**
   * 图表高度
   * @return {*|{}}
   */
  chartHeight () {
    return this._chartHeight
  }

  /**
   * 获取图表转换为图片后url
   * @param includeTooltip,
   * @param includeOverlay
   * @param type
   * @param backgroundColor
   */
  getConvertPictureUrl (includeTooltip, includeOverlay, type, backgroundColor) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const pixelRatio = getPixelRatio(canvas)
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
    const candleStickPaneHeight = this._candlePane.height()
    ctx.drawImage(
      this._candlePane.getImage(includeTooltip, includeOverlay),
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
        technicalIndicatorPane.getImage(includeTooltip),
        0, offsetTop, width, technicalIndicatorPaneHeight
      )
      offsetTop += technicalIndicatorPaneHeight
    }

    ctx.drawImage(
      this._xAxisPane.getImage(includeTooltip),
      0, offsetTop, width, this._xAxisPane.height()
    )
    return canvas.toDataURL(`image/${type}`)
  }

  destroy () {
    this._candlePane.destroy()
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

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

import { YAxisPosition } from '../data/options/styleOptions'
import { isArray, isBoolean, isFunction, isObject, isNumber, clone } from '../utils/typeChecks'
import { formatValue } from '../utils/format'
import TechnicalIndicatorPane from './TechnicalIndicatorPane'
import SeparatorPane from './SeparatorPane'

import { MA, MACD } from '../data/technicalindicator/defaultTechnicalIndicatorType'
import ChartEvent from '../event/ChartEvent'
import { getPixelRatio } from '../utils/canvas'
import { DEV } from '../utils/env'
import { throttle } from '../utils/performance'

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
    this._measurePaneHeight()
    this._layoutPane()
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
    this._measurePaneHeight()
    this._candleStickPane.layout()
    for (const pane of this._technicalIndicatorPanes) {
      pane.layout()
    }
  }

  /**
   * 重新布局
   * @private
   */
  _layoutPane () {
    this._measurePaneWidth()
    this._xAxisPane.computeAxis()
    this._xAxisPane.layout()
    this._candleStickPane.layout()
    for (const pane of this._technicalIndicatorPanes) {
      pane.layout()
    }
  }

  /**
   * 更新所有pane
   * @private
   */
  _updatePane (invalidateLevel = InvalidateLevel.FULL) {
    if (invalidateLevel === InvalidateLevel.FLOAT_LAYER) {
      this._xAxisPane.invalidate(invalidateLevel)
      this._candleStickPane.invalidate(invalidateLevel)
      for (const pane of this._technicalIndicatorPanes) {
        pane.invalidate(invalidateLevel)
      }
    } else {
      this._candleStickPane.computeAxis()
      if (invalidateLevel !== InvalidateLevel.GRAPHIC_MARK) {
        for (const pane of this._technicalIndicatorPanes) {
          pane.computeAxis()
        }
      }
      this._layoutPane()
    }
  }

  /**
   * 计算所有pane的指标
   * @private
   */
  _calcAllPaneTechnicalIndicator () {
    Promise.resolve().then(
      _ => {
        this._chartData.calcTechnicalIndicator(this._candleStickPane)
        for (const pane of this._technicalIndicatorPanes) {
          this._chartData.calcTechnicalIndicator(pane)
        }
        this._layoutPane()
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
    const separatorHeight = styleOptions.separator.size * this._separatorPanes.length
    const xAxisHeight = this._xAxisPane.getSelfAxisHeight()
    const paneExcludeXAxisSeparatorHeight = paneHeight - xAxisHeight - separatorHeight
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

    const paneContentSize = {}
    paneContentSize[CANDLE_STICK_PANE_TAG] = { contentTop: 0, contentBottom: candleStickPaneHeight }
    let contentTop = candleStickPaneHeight
    let contentBottom = candleStickPaneHeight
    this._candleStickPane.setHeight(candleStickPaneHeight)

    for (let i = 0; i < this._technicalIndicatorPanes.length; i++) {
      const technicalIndicatorPane = this._technicalIndicatorPanes[i]
      const technicalIndicatorPaneHeight = technicalIndicatorPane.height()
      technicalIndicatorPane.setHeight(technicalIndicatorPaneHeight)
      contentBottom += technicalIndicatorPaneHeight
      paneContentSize[technicalIndicatorPane.tag()] = { contentTop, contentBottom }
      contentTop = contentBottom
    }
    this._xAxisPane.setHeight(xAxisHeight)
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
      yAxisWidth = this._candleStickPane.getSelfAxisWidth()
      for (const pane of this._technicalIndicatorPanes) {
        yAxisWidth = Math.max(yAxisWidth, pane.getSelfAxisWidth())
      }
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
    this._candleStickPane.setWidth(mainWidth, yAxisWidth)
    this._candleStickPane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft)

    for (let i = 0; i < this._technicalIndicatorPanes.length; i++) {
      const technicalIndicatorPane = this._technicalIndicatorPanes[i]
      const separatorPane = this._separatorPanes[i]
      technicalIndicatorPane.setWidth(mainWidth, yAxisWidth)
      technicalIndicatorPane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft)
      separatorPane.setSize(mainOffsetLeft, mainWidth)
    }
    this._xAxisPane.setWidth(mainWidth, yAxisWidth)
    this._xAxisPane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft)
    this._chartEvent.setChartContentSize({ contentLeft: mainOffsetLeft, contentRight: mainOffsetLeft + mainWidth })
  }

  /**
   * 获取图表上的数据
   * @returns {ChartData}
   */
  chartData () {
    return this._chartData
  }

  /**
   * 重置尺寸
   */
  resize () {
    this._measurePaneHeight()
    this._candleStickPane.computeAxis()
    for (const pane of this._technicalIndicatorPanes) {
      pane.computeAxis()
    }
    this._layoutPane()
  }

  /**
   * 加载技术指标参数
   * @param technicalIndicatorType
   * @param params
   */
  applyTechnicalIndicatorParams (technicalIndicatorType, params) {
    const info = this._chartData.technicalIndicator(technicalIndicatorType)
    if (info.structure && isArray(params)) {
      for (const v of params) {
        if (!isNumber(v) || v <= 0 || parseInt(v, 10) !== v) {
          return
        }
      }
      info.calcParams = clone(params)
      Promise.resolve().then(
        _ => {
          if (this._candleStickPane.technicalIndicator().name === technicalIndicatorType) {
            this._chartData.calcTechnicalIndicator(this._candleStickPane)
          }
          for (const pane of this._technicalIndicatorPanes) {
            if (pane.technicalIndicator().name === technicalIndicatorType) {
              this._chartData.calcTechnicalIndicator(pane)
            }
          }
          this._layoutPane()
        }
      )
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
      let pos = dataSize
      if (timestamp === lastDataTimestamp) {
        pos = dataSize - 1
      }
      this._chartData.addData(data, pos)
      this._calcAllPaneTechnicalIndicator()
    }
  }

  /**
   * 设置蜡烛图图表类型
   * @param type
   */
  setCandleStickChartType (type) {
    this._candleStickPane.setChartType(type)
  }

  /**
   * 创建一个指标
   * @param technicalIndicatorType
   * @param height
   * @param dragEnabled
   * @returns {string}
   */
  createTechnicalIndicator (technicalIndicatorType = MACD, height = DEFAULT_TECHNICAL_INDICATOR_PANE_HEIGHT, dragEnabled) {
    const { structure: TechnicalIndicator } = this._chartData.technicalIndicator(technicalIndicatorType)
    if (!TechnicalIndicator) {
      if (DEV) {
        console.warn('The corresponding technical indicator type cannot be found and cannot be created!!!')
      }
      return null
    }
    const technicalIndicatorPaneCount = this._technicalIndicatorPanes.length
    const isDrag = isBoolean(dragEnabled) ? dragEnabled : true
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
    this._measurePaneHeight()
    this._layoutPane()
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
      this._measurePaneHeight()
      this._layoutPane()
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
      this._layoutPane()
    } else {
      let p
      for (const pane of this._technicalIndicatorPanes) {
        if (pane.tag() === tag) {
          p = pane
          break
        }
      }
      if (p) {
        const { structure: TechnicalIndicator } = this._chartData.technicalIndicator(technicalIndicatorType)
        if (!TechnicalIndicator) {
          this.removeTechnicalIndicator(tag)
        } else {
          p.setTechnicalIndicatorType(technicalIndicatorType)
          this._layoutPane()
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

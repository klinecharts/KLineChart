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

import ChartStore from './store/ChartStore'

import CandlePane from './panee/CandlePane'
import IndicatorPane from './panee/IndicatorPane'
import XAxisPane from './panee/XAxisPane'

import { YAxisPosition } from './options/styleOptions'

import { isArray, isBoolean, isFunction, isValid, isNumber } from './utils/typeChecks'
import { createId } from './utils/id'

import ChartEvent from './event/ChartEvent'
import { getPixelRatio } from './utils/canvas'
import { throttle } from './utils/performance'
import { createDom } from './utils/dom'
import Annotation from './component/overlay/Annotation'
import Tag from './component/overlay/Tag'
import { perfectOverlayFunc } from './component/overlay/Overlay'

import ActionType from './enum/ActionType'
import InvalidateLevel from './enum/InvalidateLevel'

// 默认技术指标窗口高度
const DEFAULT_TECH_PANE_HEIGHT = 100

// 技术指标窗口id前缀
const TECH_PANE_ID_PREFIX = 'tech_pane_'

// 图形id前缀
const SHAPE_ID_PREFIX = 'shape_'

// 注解id前缀
const ANNOTATION_ID_PREFIX = 'an_'

// 蜡烛图窗口id
export const CANDLE_PANE_ID = 'candle_pane'

// x轴窗口id
const XAXIS_PANE_ID = 'x_axis_pane'

export default class ChartInternal {
  private _container: HTMLElement
  private _chartContainer: HTMLElement
  private readonly _chartStore: ChartStore
  private readonly _xAxisPane: XAxisPane
  private readonly _panes: Map<string, IndicatorPane> = new Map()

  constructor (container: HTMLElement, styleOptions: any) {
    this._initChartContainer(container)
    this._separatorDragStartTopPaneHeight = 0
    this._separatorDragStartBottomPaneHeight = 0
    this._chartStore = new ChartStore(styleOptions, this)
    this._xAxisPane = new XAxisPane(this._chartContainer, XAXIS_PANE_ID, this)
    this._panes.set(CANDLE_PANE_ID, new CandlePane(this._chartContainer, CANDLE_PANE_ID, this))
    this._separators = new Map()
    this._chartWidth = {}
    this._chartHeight = {}
    this._chartEvent = new ChartEvent(
      this._chartContainer,
      this._chartStore,
      (paneId) => this._panes.get(paneId).yAxis()
    )
    this.adjustPaneViewport(true, true, true)
  }

  /**
   * 初始化图表容器
   * @param container
   * @private
   */
  _initChartContainer (container: HTMLElement): void {
    this._container = container
    this._chartContainer = createDom('div', {
      userSelect: 'none',
      position: 'relative',
      outline: 'none',
      borderStyle: 'none',
      width: '100%',
      cursor: 'crosshair',
      boxSizing: 'border-box'
    })
    this._chartContainer.tabIndex = 1
    container.appendChild(this._chartContainer)
  }

  /**
   * 十字光标观察者
   * @private
   */
  _crosshairObserver ({ paneId, dataIndex, kLineData, x, y }) {
    if (
      this._chartStore.actionStore().has(ActionType.CROSSHAIR) ||
      this._chartStore.actionStore().has(ActionType.TOOLTIP)
    ) {
      const techDatas = {}
      this._panes.forEach((_, id) => {
        const data = {}
        const techDataList = []
        const techs = this.chartStore().technicalIndicatorStore().instances(id)
        techs.forEach(tech => {
          const result = tech.result
          const techData = result[dataIndex]
          data[tech.name] = techData
          techDataList.push({ name: tech.name, data: techData })
        })
        techDatas[id] = data
        this._chartStore.actionStore().execute(ActionType.TOOLTIP, {
          paneId: id,
          dataIndex,
          kLineData,
          technicalIndicatorData: techDataList
        })
      })
      if (paneId) {
        this._chartStore.actionStore().execute(ActionType.CROSSHAIR, {
          paneId,
          coordinate: { x, y },
          dataIndex,
          kLineData,
          technicalIndicatorData: techDatas
        })
      }
    }
  }

  /**
   * 分割线拖拽开始
   * @param topPaneId
   * @param bottomPaneId
   * @private
   */
  _separatorStartDrag (topPaneId, bottomPaneId) {
    this._separatorDragStartTopPaneHeight = this._panes.get(topPaneId).height()
    this._separatorDragStartBottomPaneHeight = this._panes.get(bottomPaneId).height()
  }

  /**
   * 分割线拖拽
   * @param dragDistance
   * @param topPaneId
   * @param bottomPaneId
   * @private
   */
  _separatorDrag (dragDistance, topPaneId, bottomPaneId) {
    const topPane = this._panes.get(topPaneId)
    const bottomPane = this._panes.get(bottomPaneId)
    const topPaneMinHeight = topPane.minHeight()
    const bottomPaneMinHeight = bottomPane.minHeight()
    let topPaneHeight = this._separatorDragStartTopPaneHeight + dragDistance
    let bottomPaneHeight = this._separatorDragStartBottomPaneHeight - dragDistance
    if (topPaneHeight > this._separatorDragStartTopPaneHeight + this._separatorDragStartBottomPaneHeight) {
      topPaneHeight = this._separatorDragStartTopPaneHeight + this._separatorDragStartBottomPaneHeight
      bottomPaneHeight = 0
    }
    if (topPaneHeight < 0) {
      topPaneHeight = 0
      bottomPaneHeight = this._separatorDragStartTopPaneHeight + this._separatorDragStartBottomPaneHeight
    }
    if (topPaneHeight < topPaneMinHeight) {
      bottomPaneHeight -= bottomPaneMinHeight - topPaneHeight
      topPaneHeight = topPaneMinHeight
    }
    if (bottomPaneHeight < bottomPaneMinHeight) {
      topPaneHeight -= topPaneMinHeight - bottomPaneHeight
      bottomPaneHeight = bottomPaneMinHeight
    }
    topPane.setHeight(topPaneHeight)
    bottomPane.setHeight(bottomPaneHeight)
    this._chartStore.actionStore().execute(ActionType.PANE_DRAG, { topPaneId, bottomPaneId, topPaneHeight, bottomPaneHeight })
    this.adjustPaneViewport(true, true, true, true, true)
  }

  /**
   * 更新所有pane
   * @private
   */
  _invalidatePane (invalidateLevel = InvalidateLevel.FULL) {
    if (invalidateLevel === InvalidateLevel.OVERLAY) {
      this._xAxisPane.invalidate(invalidateLevel)
      this._panes.forEach((pane) => {
        pane.invalidate(invalidateLevel)
      })
    } else {
      let shouldMeasureWidth = false
      this._panes.forEach((pane) => {
        const should = pane.yAxis().computeAxis()
        if (should) {
          shouldMeasureWidth = should
        }
      })
      this.adjustPaneViewport(false, shouldMeasureWidth, true)
    }
  }

  /**
   * 测量pane高度
   * @private
   */
  _measurePaneHeight () {
    const styleOptions = this._chartStore.styleOptions()
    const paneHeight = this._container.offsetHeight
    const separatorSize = styleOptions.separator.size
    const separatorTotalHeight = separatorSize * this._separators.size
    const xAxisHeight = this._xAxisPane.xAxis().getSelfHeight()
    let paneExcludeXAxisSeparatorHeight = paneHeight - xAxisHeight - separatorTotalHeight
    if (paneExcludeXAxisSeparatorHeight < 0) {
      paneExcludeXAxisSeparatorHeight = 0
    }
    let techPaneTotalHeight = 0
    this._panes.forEach(pane => {
      if (pane.id() !== CANDLE_PANE_ID) {
        let paneHeight = pane.height()
        const paneMinHeight = pane.minHeight()
        if (paneHeight < paneMinHeight) {
          paneHeight = paneMinHeight
        }
        if (techPaneTotalHeight + paneHeight > paneExcludeXAxisSeparatorHeight) {
          techPaneTotalHeight = paneExcludeXAxisSeparatorHeight
          paneHeight = paneExcludeXAxisSeparatorHeight - techPaneTotalHeight
          if (paneHeight < 0) paneHeight = 0
        } else {
          techPaneTotalHeight += paneHeight
        }
        pane.setHeight(paneHeight)
      }
    })

    const candlePaneHeight = paneExcludeXAxisSeparatorHeight - techPaneTotalHeight

    const paneContentSize = {}
    paneContentSize[CANDLE_PANE_ID] = { contentTop: 0, contentBottom: candlePaneHeight }
    let contentTop = candlePaneHeight
    let contentBottom = candlePaneHeight
    this._panes.get(CANDLE_PANE_ID).setHeight(candlePaneHeight)
    this._chartHeight[CANDLE_PANE_ID] = candlePaneHeight
    this._panes.forEach(pane => {
      if (pane.id() !== CANDLE_PANE_ID) {
        const paneHeight = pane.height()
        contentBottom += (paneHeight + separatorSize)
        paneContentSize[pane.id()] = { contentTop, contentBottom }
        this._chartHeight[pane.id()] = paneHeight
        contentTop = contentBottom
      }
    })
    this._xAxisPane.setHeight(xAxisHeight)
    this._chartHeight.xAxis = xAxisHeight
    this._chartHeight.total = paneHeight
    this._chartEvent.setPaneContentSize(paneContentSize)
    this._chartEvent.setChartContentTopBottom({ contentTop: 0, contentBottom })
  }

  /**
   * 测量pan宽度
   * @private
   */
  _measurePaneWidth () {
    const styleOptions = this._chartStore.styleOptions()
    const yAxisOptions = styleOptions.yAxis
    const isYAxisLeft = yAxisOptions.position === YAxisPosition.LEFT
    const isOutside = !yAxisOptions.inside
    const paneWidth = this._container.offsetWidth
    let mainWidth
    let yAxisWidth = Number.MIN_SAFE_INTEGER
    let yAxisOffsetLeft
    let mainOffsetLeft
    this._panes.forEach(pane => {
      yAxisWidth = Math.max(yAxisWidth, pane.yAxis().getSelfWidth())
    })
    if (yAxisWidth > paneWidth) {
      yAxisWidth = paneWidth
    }
    if (isOutside) {
      mainWidth = paneWidth - yAxisWidth
      if (isYAxisLeft) {
        yAxisOffsetLeft = 0
        mainOffsetLeft = yAxisWidth
      } else {
        yAxisOffsetLeft = paneWidth - yAxisWidth
        mainOffsetLeft = 0
      }
    } else {
      mainWidth = paneWidth
      mainOffsetLeft = 0
      if (isYAxisLeft) {
        yAxisOffsetLeft = 0
      } else {
        yAxisOffsetLeft = paneWidth - yAxisWidth
      }
    }

    let totalDataSpace = mainWidth
    if (totalDataSpace < this._chartStore.timeScaleStore().dataSpace()) {
      totalDataSpace = this._chartStore.timeScaleStore().dataSpace()
    }
    this._chartStore.timeScaleStore().setTotalDataSpace(totalDataSpace)

    this._panes.forEach((pane, paneId) => {
      pane.setWidth(mainWidth, yAxisWidth)
      pane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft)
      const separator = this._separators.get(paneId)
      separator && separator.setSize(mainOffsetLeft, mainWidth)
    })
    this._chartWidth = { content: mainWidth, yAxis: yAxisWidth, total: paneWidth }
    this._xAxisPane.setWidth(mainWidth, yAxisWidth)
    this._xAxisPane.setOffsetLeft(mainOffsetLeft, yAxisOffsetLeft)
    this._chartEvent.setChartContentLeftRight({ contentLeft: mainOffsetLeft, contentRight: mainOffsetLeft + mainWidth })
  }

  /**
   * 获取容器
   * @returns
   */
  getContainer () { return this._container }

  getChartStore (): ChartStore { return this._chartStore }

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
      this._panes.forEach(pane => {
        const adjust = pane.yAxis().computeAxis(shouldForceComputeAxis)
        if (!isAdjust) {
          isAdjust = adjust
        }
      })
    }
    if ((!shouldComputeAxis && shouldMeasureWidth) || (shouldComputeAxis && isAdjust)) {
      this._measurePaneWidth()
    }
    if (shouldLayout) {
      this._xAxisPane.xAxis().computeAxis(true)
      this._xAxisPane.layout()
      this._panes.forEach(pane => {
        pane.layout()
      })
    }
  }

  /**
   * 窗口是否存在
   * @param paneId
   * @return {boolean}
   */
  hasPane (paneId) {
    return this._panes.has(paneId)
  }

  /**
   * 获取窗口
   * @param paneId
   * @returns
   */
  getPane (paneId) {
    return this._panes.get(paneId)
  }

  /**
   * 移除指标
   * @param paneId
   * @param name
   */
  removeTechnicalIndicator (paneId, name) {
    const removed = this._chartStore.technicalIndicatorStore().removeInstance(paneId, name)
    if (removed) {
      let shouldMeasureHeight = false
      if (paneId !== CANDLE_PANE_ID) {
        if (!this._chartStore.technicalIndicatorStore().hasInstance(paneId)) {
          shouldMeasureHeight = true
          this._panes.get(paneId).destroy()
          const deleteSeparatorTopPaneId = this._separators.get(paneId).topPaneId()
          this._separators.get(paneId).destroy()
          this._panes.delete(paneId)
          this._separators.delete(paneId)
          this._separators.forEach(separator => {
            const topPaneId = separator.topPaneId()
            if (!this._separators.has(topPaneId)) {
              separator.updatePaneId(deleteSeparatorTopPaneId)
            }
          })
        }
      }
      this.adjustPaneViewport(shouldMeasureHeight, true, true, true, true)
    }
  }

  /**
   * 设置指标类型
   * @param tech 技术指标实例
   * @param isStack 是否叠加
   * @param options 配置
   */
  createTechnicalIndicator (tech, isStack, options = {}) {
    if (this._panes.has(options.id)) {
      const task = this._chartStore.technicalIndicatorStore().addInstance(options.id, tech, isStack)
      if (task) {
        task.finally(_ => {
          this.setPaneOptions(options, this._panes.get(options.id).yAxis().computeAxis(true))
        })
      }
      return options.id
    }
    const id = options.id || createId(TECH_PANE_ID_PREFIX)
    const dragEnabled = isBoolean(options.dragEnabled) ? options.dragEnabled : true
    this._separators.set(id, new SeparatorPane(
      this._chartContainer,
      this._chartStore,
      Array.from(this._panes.keys()).pop(),
      id,
      dragEnabled,
      {
        startDrag: this._separatorStartDrag.bind(this),
        drag: throttle(this._separatorDrag.bind(this), 50)
      }
    ))
    const pane = new TechnicalIndicatorPane({
      container: this._chartContainer,
      chartStore: this._chartStore,
      xAxis: this._xAxisPane.xAxis(),
      id,
      height: options.height || DEFAULT_TECH_PANE_HEIGHT,
      minHeight: options.minHeight
    })
    this._panes.set(id, pane)
    const task = this._chartStore.technicalIndicatorStore().addInstance(id, tech, isStack)
    if (task) {
      task.finally(_ => {
        this.adjustPaneViewport(true, true, true, true, true)
      })
    }
    return id
  }

  /**
   * 创建图形
   * @param ShapeTemplateClass
   * @param shapeOptions
   * @param paneId
   */
  createShape (ShapeTemplateClass, shapeOptions, paneId) {
    const {
      id, points, styles, lock, mode, data,
      onDrawStart, onDrawing,
      onDrawEnd, onClick,
      onRightClick, onPressedMove,
      onMouseEnter, onMouseLeave,
      onRemove
    } = shapeOptions
    const shapeId = id || createId(SHAPE_ID_PREFIX)
    if (!this._chartStore.shapeStore().hasInstance(shapeId)) {
      let yAxis = null
      if (this.hasPane(paneId)) {
        yAxis = this._panes.get(paneId).yAxis()
      } else {
        if (points && points.length > 0) {
          paneId = CANDLE_PANE_ID
          yAxis = this._panes.get(CANDLE_PANE_ID).yAxis()
        }
      }
      const shapeInstance = new ShapeTemplateClass({
        id: shapeId,
        chartStore: this._chartStore,
        xAxis: this._xAxisPane.xAxis(),
        yAxis,
        points,
        styles,
        lock,
        mode,
        data
      })
      if (isFunction(onDrawStart)) {
        onDrawStart({ id: shapeId })
      }
      perfectOverlayFunc(shapeInstance, [
        { key: 'onDrawing', fn: onDrawing },
        { key: 'onDrawEnd', fn: onDrawEnd },
        { key: 'onClick', fn: onClick },
        { key: 'onRightClick', fn: onRightClick },
        { key: 'onPressedMove', fn: onPressedMove },
        { key: 'onMouseEnter', fn: onMouseEnter },
        { key: 'onMouseLeave', fn: onMouseLeave },
        { key: 'onRemove', fn: onRemove }
      ])
      this._chartStore.shapeStore().addInstance(shapeInstance, paneId)
      return shapeId
    }
    return null
  }

  /**
   * 创建注解
   * @param annotations
   * @param paneId
   */
  createAnnotation (annotations, paneId) {
    const instances = []
    annotations.forEach(({
      point,
      styles,
      checkEventCoordinateOnCustomSymbol,
      drawCustomSymbol,
      drawExtend,
      onClick,
      onRightClick,
      onMouseEnter,
      onMouseLeave
    }) => {
      if (point && point.timestamp) {
        const annotationInstance = new Annotation({
          id: createId(ANNOTATION_ID_PREFIX),
          chartStore: this._chartStore,
          point,
          xAxis: this._xAxisPane.xAxis(),
          yAxis: this._panes.get(paneId).yAxis(),
          styles
        })

        perfectOverlayFunc(annotationInstance, [
          { key: 'drawExtend', fn: drawExtend },
          { key: 'drawCustomSymbol', fn: drawCustomSymbol },
          { key: 'checkEventCoordinateOnCustomSymbol', fn: checkEventCoordinateOnCustomSymbol },
          { key: 'onClick', fn: onClick },
          { key: 'onRightClick', fn: onRightClick },
          { key: 'onMouseEnter', fn: onMouseEnter },
          { key: 'onMouseLeave', fn: onMouseLeave }
        ])
        instances.push(annotationInstance)
      }
    })
    if (instances.length > 0) {
      this._chartStore.annotationStore().add(instances, paneId)
    }
  }

  /**
   * 创建标签
   * @param tags
   * @param paneId
   */
  createTag (tags, paneId) {
    const instances = []
    let shouldUpdate = false
    let shouldAdd = false
    tags.forEach(({ id, point, text, mark, styles }) => {
      if (isValid(id)) {
        if (this._chartStore.tagStore().has(id, paneId)) {
          const updateSuccess = this._chartStore.tagStore().update(id, paneId, { point, text, mark, styles })
          if (!shouldUpdate) {
            shouldUpdate = updateSuccess
          }
        } else {
          shouldAdd = true
          instances.push(new Tag({
            id,
            point,
            text,
            mark,
            styles,
            chartStore: this._chartStore,
            xAxis: this._xAxisPane.xAxis(),
            yAxis: this._panes.get(paneId).yAxis()
          }))
        }
      }
    })
    if (shouldAdd) {
      this._chartStore.tagStore().add(instances, paneId)
    } else {
      if (shouldUpdate) {
        this._invalidatePane(InvalidateLevel.OVERLAY)
      }
    }
  }

  /**
   * 移除所有html元素
   */
  removeAllHtml () {
    this._panes.forEach(pane => { pane.removeHtml() })
    this._xAxisPane.removeHtml()
  }

  /**
   * 设置窗体参数
   * @param options
   * @param forceShouldAdjust
   */
  setPaneOptions (options, forceShouldAdjust) {
    let shouldAdjust = forceShouldAdjust
    let shouldMeasureHeight = false
    if (options.id !== CANDLE_PANE_ID) {
      const pane = this._panes.get(options.id)
      if (pane) {
        if (isNumber(options.minHeight) && options.minHeight > 0) {
          pane.setMinHeight(options.minHeight)
        }
        if (isNumber(options.height) && options.height > 0) {
          const minHeight = pane.minHeight()
          const height = options.height < pane.minHeight ? minHeight : options.height
          if (pane.height() !== height) {
            shouldAdjust = true
            pane.setHeight(options.height)
            shouldMeasureHeight = true
          }
        }
        if (isBoolean(options.dragEnabled)) {
          this._separators.get(options.id).setDragEnabled(options.dragEnabled)
        }
      }
    }
    if (shouldAdjust) {
      this.adjustPaneViewport(shouldMeasureHeight, true, true, true, true)
    }
  }

  /**
   * 设置时区
   * @param timezone
   */
  setTimezone (timezone) {
    this._chartStore.timeScaleStore().setTimezone(timezone)
    this._xAxisPane.xAxis().computeAxis(true)
    this._xAxisPane.invalidate(InvalidateLevel.FULL)
  }

  /**
   * 将值装换成像素
   * @param timestamp
   * @param point
   * @param paneId
   * @param absoluteYAxis
   */
  convertToPixel (point, { paneId = CANDLE_PANE_ID, absoluteYAxis }) {
    const points = [].concat(point)
    let coordinates = []
    const separatorSize = this._chartStore.styleOptions().separator.size
    let absoluteTop = 0
    const panes = this._panes.values()
    for (const pane of panes) {
      if (pane.id() === paneId) {
        coordinates = points.map(({ timestamp, dataIndex, value }) => {
          const coordinate = {}
          let index = dataIndex
          if (isValid(timestamp)) {
            index = this._chartStore.timeScaleStore().timestampToDataIndex(timestamp)
          }
          if (isValid(index)) {
            coordinate.x = this._xAxisPane.xAxis().convertToPixel(index)
          }
          if (isValid(value)) {
            const y = pane.yAxis().convertToPixel(value)
            coordinate.y = absoluteYAxis ? absoluteTop + y : y
          }
          return coordinate
        })
        break
      }
      absoluteTop += (pane.height() + separatorSize)
    }
    return isArray(point) ? coordinates : (coordinates[0] || {})
  }

  /**
   * 将像素转换成值
   * @param coordinate
   * @param paneId
   * @param dataIndexXAxis
   * @param absoluteYAxis
   * @return {{}[]|*[]}
   */
  convertFromPixel (coordinate, { paneId = CANDLE_PANE_ID, absoluteYAxis }) {
    const coordinates = [].concat(coordinate)
    let points = []
    const separatorSize = this._chartStore.styleOptions().separator.size
    let absoluteTop = 0
    const panes = this._panes.values()
    for (const pane of panes) {
      if (pane.id() === paneId) {
        points = coordinates.map(({ x, y }) => {
          const point = {}
          if (isValid(x)) {
            point.dataIndex = this._xAxisPane.xAxis().convertFromPixel(x)
            point.timestamp = this._chartStore.timeScaleStore().dataIndexToTimestamp(point.dataIndex)
          }
          if (isValid(y)) {
            const ry = absoluteYAxis ? y - absoluteTop : y
            point.value = pane.yAxis().convertFromPixel(ry)
          }
          return point
        })
        break
      }
      absoluteTop += pane.height() + separatorSize
    }
    return isArray(coordinate) ? points : (points[0] || {})
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
   * @param includeOverlay,
   * @param type
   * @param backgroundColor
   */
  getConvertPictureUrl (includeOverlay, type, backgroundColor) {
    const width = this._chartContainer.offsetWidth
    const height = this._chartContainer.offsetHeight
    const canvas = createElement('canvas', {
      width: `${width}px`,
      height: `${height}px`,
      boxSizing: 'border-box'
    })
    const ctx = canvas.getContext('2d')
    const pixelRatio = getPixelRatio(canvas)
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
    let offsetTop = 0
    this._panes.forEach((pane, paneId) => {
      if (paneId !== CANDLE_PANE_ID) {
        const separator = this._separators.get(paneId)
        ctx.drawImage(
          separator.getImage(),
          0, offsetTop, width, separator.height()
        )
        offsetTop += separator.height()
      }
      ctx.drawImage(
        pane.getImage(includeOverlay),
        0, offsetTop, width, pane.height()
      )
      offsetTop += pane.height()
    })
    ctx.drawImage(
      this._xAxisPane.getImage(includeOverlay),
      0, offsetTop, width, this._xAxisPane.height()
    )
    return canvas.toDataURL(`image/${type}`)
  }

  /**
   * 销毁
   */
  destroy () {
    this._panes.forEach(pane => {
      pane.destroy()
    })
    this._separators.forEach(pane => {
      pane.destroy()
    })
    this._panes.clear()
    this._separators.clear()
    this._xAxisPane.destroy()
    this._container.removeChild(this._chartContainer)
    this._chartEvent.destroy()
  }
}

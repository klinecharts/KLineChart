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

import TypeOrNull from './common/TypeOrNull'
import DeepPartial from './common/DeepPartial'
import ElementGroup from './common/ElementGroup'
import { UpdateLevel } from './common/Updater'
import MouseTouchEventHandler, { MouseTouchEventCallback } from './common/MouseTouchEventHandler'
import Coordinate from './common/Coordinate'

import ChartStore from './store/ChartStore'
import { Styles, YAxisPosition } from './store/styles'

import Pane, { PaneOptions, PANE_DEFAULT_HEIGHT } from './pane/Pane'
import CandlePane, { CANDLE_PANE_ID } from './pane/CandlePane'
import IndicatorPane, { INDICATOR_PANE_ID_PREFIX } from './pane/IndicatorPane'
import XAxisPane, { XAXIS_PANE_ID } from './pane/XAxisPane'

import Axis from './componentl/Axis'

import { Indicator } from './template/indicator/Indicator'

import { createId } from './common/utils/id'
import { createDom } from './common/utils/dom'
// import { isArray, isBoolean, isFunction, isValid, isNumber } from './common/utils/typeChecks'

// import { getPixelRatio } from './common/utils/canvas'

// import Annotation from './component/overlay/Annotation'
// import Tag from './component/overlay/Tag'
// import { perfectOverlayFunc } from './component/overlay/Overlay'

// // 图形id前缀
// const SHAPE_ID_PREFIX = 'shape_'

// // 注解id前缀
// const ANNOTATION_ID_PREFIX = 'an_'

export default class ChartInternal extends ElementGroup {
  private _container: HTMLElement
  private _chartContainer: HTMLElement
  private _eventContainer: HTMLElement
  private readonly _chartStore: ChartStore
  private readonly _xAxisPane: XAxisPane
  private readonly _panes: Map<string, IndicatorPane> = new Map()

  private _chartEvent: MouseTouchEventHandler

  constructor (container: HTMLElement, styleOptions?: DeepPartial<Styles>) {
    super()
    this._initContainer(container)
    this._chartStore = new ChartStore(this, styleOptions)
    this._xAxisPane = new XAxisPane(this._chartContainer, this, XAXIS_PANE_ID)
    this._panes.set(CANDLE_PANE_ID, new CandlePane(this._chartContainer, this, CANDLE_PANE_ID))
    this._initEvent()
    this.adjustPaneViewport(true, true, true)
  }

  /**
   * 初始化图表容器
   * @param container
   * @private
   */
  private _initContainer (container: HTMLElement): void {
    this._container = container
    this._chartContainer = createDom('div', {
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box'
    })
    this._eventContainer = createDom('div', {
      top: '0',
      userSelect: 'none',
      position: 'absolute',
      outline: 'none',
      borderStyle: 'none',
      cursor: 'crosshair',
      boxSizing: 'border-box'
    })
    this._eventContainer.tabIndex = 1
    this._chartContainer.appendChild(this._eventContainer)
    container.appendChild(this._chartContainer)
  }

  _initEvent (): void {
    this.registerEvent('mouseLeaveEvent', () => {
      this._chartStore.getCrosshairStore().set()
    })
    this.registerEvent('pressedMouseMoveEvent', (coordinate) => {
    })

    const chartEventCallback: ((type: string) => MouseTouchEventCallback) = (type: string) => (coordinate: Coordinate, ...others: any[]) => {
      this.dispatchEvent(type, coordinate, ...others)
    }

    this._chartEvent = new MouseTouchEventHandler(
      this._eventContainer,
      {
        pinchStartEvent: chartEventCallback('pinchStartEvent'),
        pinchEvent: chartEventCallback('pinchEvent'),
        mouseUpEvent: chartEventCallback('mouseUpEvent'),
        mouseClickEvent: chartEventCallback('mouseClickEvent'),
        mouseDownEvent: chartEventCallback('mouseDownEvent'),
        mouseEnterEvent: chartEventCallback('mouseEnterEvent'),
        mouseLeaveEvent: chartEventCallback('mouseLeaveEvent'),
        mouseMoveEvent: chartEventCallback('mouseMoveEvent'),
        pressedMouseMoveEvent: chartEventCallback('pressedMouseMoveEvent'),
        longTapEvent: chartEventCallback('longTapEvent')
      },
      {
        treatVertTouchDragAsPageScroll: () => true,
        treatHorzTouchDragAsPageScroll: () => false
      }
    )
  }

  private _dispatch (pane: Pane<Axis>, type: string, coordinate: Coordinate, ...others: any[]): boolean {
    const bounding = pane.getBounding()
    if (coordinate.y > bounding.top && coordinate.y < bounding.top + bounding.height) {
      return pane.dispatchEvent(type, { x: coordinate.x, y: coordinate.y - bounding.top }, ...others)
    }
    return false
  }

  dispatchEvent (type: string, coordinate: Coordinate, ...others: any[]): boolean {
    for (const entry of this._panes) {
      if (this._dispatch(entry[1], type, coordinate, ...others)) {
        return true
      }
    }
    if (!this._dispatch(this._xAxisPane, type, coordinate, ...others)) {
      return this.onEvent(type, coordinate, ...others)
    }
    return false
  }

  // /**
  //  * 十字光标观察者
  //  * @private
  //  */
  // _crosshairObserver ({ paneId, dataIndex, kLineData, x, y }) {
  //   if (
  //     this._chartStore.actionStore().has(ActionType.CROSSHAIR) ||
  //     this._chartStore.actionStore().has(ActionType.TOOLTIP)
  //   ) {
  //     const techDatas = {}
  //     this._panes.forEach((_, id) => {
  //       const data = {}
  //       const techDataList = []
  //       const techs = this.chartStore().technicalIndicatorStore().instances(id)
  //       techs.forEach(tech => {
  //         const result = tech.result
  //         const techData = result[dataIndex]
  //         data[tech.name] = techData
  //         techDataList.push({ name: tech.name, data: techData })
  //       })
  //       techDatas[id] = data
  //       this._chartStore.actionStore().execute(ActionType.TOOLTIP, {
  //         paneId: id,
  //         dataIndex,
  //         kLineData,
  //         technicalIndicatorData: techDataList
  //       })
  //     })
  //     if (paneId) {
  //       this._chartStore.actionStore().execute(ActionType.CROSSHAIR, {
  //         paneId,
  //         coordinate: { x, y },
  //         dataIndex,
  //         kLineData,
  //         technicalIndicatorData: techDatas
  //       })
  //     }
  //   }
  // }

  // /**
  //  * 更新所有pane
  //  * @private
  //  */
  // _invalidatePane (invalidateLevel = InvalidateLevel.FULL) {
  //   if (invalidateLevel === InvalidateLevel.OVERLAY) {
  //     this._xAxisPane.invalidate(invalidateLevel)
  //     this._panes.forEach((pane) => {
  //       pane.invalidate(invalidateLevel)
  //     })
  //   } else {
  //     let shouldMeasureWidth = false
  //     this._panes.forEach((pane) => {
  //       const should = pane.yAxis().computeAxis()
  //       if (should) {
  //         shouldMeasureWidth = should
  //       }
  //     })
  //     this.adjustPaneViewport(false, shouldMeasureWidth, true)
  //   }
  // }

  /**
   * 测量pane高度
   * @private
   */
  private _measurePaneHeight (): void {
    const totalHeight = this._container.offsetHeight
    const xAxisHeight = this._xAxisPane.getAxisComponent().getAutoSize()
    let paneExcludeXAxisHeight = totalHeight - xAxisHeight
    if (paneExcludeXAxisHeight < 0) {
      paneExcludeXAxisHeight = 0
    }
    let indicatorPaneTotalHeight = 0
    this._panes.forEach(pane => {
      if (pane.getId() !== CANDLE_PANE_ID) {
        let paneHeight = pane.getBounding().height
        const paneMinHeight = pane.getOptions().minHeight
        if (paneHeight < paneMinHeight) {
          paneHeight = paneMinHeight
        }
        if (indicatorPaneTotalHeight + paneHeight > paneExcludeXAxisHeight) {
          indicatorPaneTotalHeight = paneExcludeXAxisHeight
          paneHeight = Math.max(paneExcludeXAxisHeight - indicatorPaneTotalHeight, 0)
        } else {
          indicatorPaneTotalHeight += paneHeight
        }
        pane.setBounding({ height: paneHeight })
      }
    })

    const candlePaneHeight = paneExcludeXAxisHeight - indicatorPaneTotalHeight
    this._panes.get(CANDLE_PANE_ID)?.setBounding({ height: candlePaneHeight })

    let top = 0
    this._panes.forEach(pane => {
      pane.setBounding({ top })
      top += pane.getBounding().height
    })
    this._xAxisPane.setBounding({ height: xAxisHeight, top })
    this._eventContainer.style.height = `${paneExcludeXAxisHeight}px`
  }

  /**
   * 测量pan宽度
   * @private
   */
  private _measurePaneWidth (): void {
    const styles = this._chartStore.getStyleOptions()
    const yAxisStyles = styles.yAxis
    const isYAxisLeft = yAxisStyles.position === YAxisPosition.LEFT
    const isOutside = !yAxisStyles.inside
    const totolWidth = this._container.offsetWidth
    let mainWidth = 0
    let yAxisWidth = Number.MIN_SAFE_INTEGER
    let yAxisLeft = 0
    let mainLeft = 0
    this._panes.forEach(pane => {
      yAxisWidth = Math.max(yAxisWidth, pane.getAxisComponent().getAutoSize())
    })
    if (yAxisWidth > totolWidth) {
      yAxisWidth = totolWidth
    }
    if (isOutside) {
      mainWidth = totolWidth - yAxisWidth
      if (isYAxisLeft) {
        yAxisLeft = 0
        mainLeft = yAxisWidth
      } else {
        yAxisLeft = totolWidth - yAxisWidth
        mainLeft = 0
      }
    } else {
      mainWidth = totolWidth
      mainLeft = 0
      if (isYAxisLeft) {
        yAxisLeft = 0
      } else {
        yAxisLeft = totolWidth - yAxisWidth
      }
    }

    this._chartStore.getTimeScaleStore().setTotalBarSpace(mainWidth)

    const paneBounding = { width: totolWidth }
    const mainBounding = { width: mainWidth, left: mainLeft }
    const yAxisBounding = { width: yAxisWidth, left: yAxisLeft }
    this._panes.forEach((pane) => {
      pane.setBounding(paneBounding, mainBounding, yAxisBounding)
    })
    this._xAxisPane.setBounding(paneBounding, mainBounding, yAxisBounding)

    this._eventContainer.style.width = `${mainWidth}px`
    this._eventContainer.style.left = `${mainLeft}px`
  }

  /**
   * 获取容器
   * @returns
   */
  getContainer (): HTMLElement { return this._container }

  getChartContainer (): HTMLElement { return this._chartContainer }

  getChartStore (): ChartStore { return this._chartStore }

  /**
   * 调整窗口尺寸
   * @param shouldMeasureHeight
   * @param shouldMeasureWidth
   * @param shouldUpdate
   * @param shouldAdjustYAxis
   * @param shouldForceAdjustYAxis
   */
  adjustPaneViewport (
    shouldMeasureHeight: boolean,
    shouldMeasureWidth: boolean,
    shouldUpdate: boolean,
    shouldAdjustYAxis?: boolean,
    shouldForceAdjustYAxis?: boolean
  ): void {
    if (shouldMeasureHeight) {
      this._measurePaneHeight()
    }
    let forceMeasureWidth = shouldMeasureWidth
    const adjustYAxis = shouldAdjustYAxis ?? false
    const forceAdjustYAxis = shouldForceAdjustYAxis ?? false
    if (adjustYAxis || forceAdjustYAxis) {
      this._panes.forEach(pane => {
        const adjust = pane.getAxisComponent().buildTicks(forceAdjustYAxis)
        if (!forceMeasureWidth) {
          forceMeasureWidth = adjust
        }
      })
    }
    if (forceMeasureWidth) {
      this._measurePaneWidth()
    }
    if (shouldUpdate ?? false) {
      this._xAxisPane.getAxisComponent().buildTicks(true)
      this.updatePane(UpdateLevel.ALL)
    }
  }

  updatePane (level: UpdateLevel, paneId?: string): void {
    if (paneId !== undefined) {
      this.getPaneById(paneId)?.update(level)
    } else {
      this._xAxisPane.update(level)
      this._panes.forEach(pane => {
        pane.update(level)
      })
    }
  }

  /**
   * 获取窗口
   * @param paneId
   * @returns
   */
  getPaneById (paneId: string): TypeOrNull<Pane<Axis>> {
    if (paneId === XAXIS_PANE_ID) {
      return this._xAxisPane
    }
    return this._panes.get(paneId) ?? null
  }

  /**
   * 移除指标
   * @param paneId
   * @param name
   */
  removeIndicator (paneId: string, name?: string): void {
    const indicatorStore = this._chartStore.getIndicatorStore()
    const removed = indicatorStore.removeInstance(paneId, name)
    if (removed) {
      let shouldMeasureHeight = false
      if (paneId !== CANDLE_PANE_ID) {
        if (!indicatorStore.hasInstances(paneId)) {
          const deletePane = this._panes.get(paneId)
          if (deletePane !== undefined) {
            shouldMeasureHeight = true
            const deleteTopPane = deletePane.getTopPane()
            const deleteBottomPane = deletePane.getBottomPane()
            deleteBottomPane?.setTopPane(deleteTopPane)
            deleteTopPane?.setBottomPane(deleteBottomPane)
            deletePane?.destroy()
            this._panes.delete(paneId)
          }
        }
      }
      this.adjustPaneViewport(shouldMeasureHeight, true, true, true, true)
    }
  }

  /**
   * 设置指标类型
   * @param indicator 技术指标实例
   * @param isStack 是否叠加
   * @param paneOptions 配置
   */
  createIndicator (indicator: Omit<Indicator, 'result'>, isStack: boolean, paneOptions?: PaneOptions): string {
    let paneId: string
    if (paneOptions !== undefined && this._panes.has(paneOptions.id)) {
      paneId = paneOptions.id
      this._chartStore.getIndicatorStore().addInstance(paneId, indicator, isStack).finally(() => {
        this.setPaneOptions(paneOptions, this._panes.get(paneId)?.getAxisComponent().buildTicks(true))
      })
    } else {
      paneId = paneOptions?.id ?? createId(INDICATOR_PANE_ID_PREFIX)
      const pane = new IndicatorPane(this._chartContainer, this, paneId, Array.from(this._panes.keys()).pop() as unknown as Pane<Axis>)
      const height = paneOptions?.height ?? PANE_DEFAULT_HEIGHT
      pane.setBounding({ height })
      if (paneOptions !== undefined) {
        pane.setOptions(paneOptions)
      }
      this._panes.set(paneId, pane)
      this._chartStore.getIndicatorStore().addInstance(paneId, indicator, isStack).finally(() => {
        this.adjustPaneViewport(true, true, true, true, true)
      })
    }
    return paneId
  }

  // /**
  //  * 创建图形
  //  * @param ShapeTemplateClass
  //  * @param shapeOptions
  //  * @param paneId
  //  */
  // createShape (ShapeTemplateClass, shapeOptions, paneId) {
  //   const {
  //     id, points, styles, lock, mode, data,
  //     onDrawStart, onDrawing,
  //     onDrawEnd, onClick,
  //     onRightClick, onPressedMove,
  //     onMouseEnter, onMouseLeave,
  //     onRemove
  //   } = shapeOptions
  //   const shapeId = id || createId(SHAPE_ID_PREFIX)
  //   if (!this._chartStore.shapeStore().hasInstance(shapeId)) {
  //     let yAxis = null
  //     if (this.hasPane(paneId)) {
  //       yAxis = this._panes.get(paneId).yAxis()
  //     } else {
  //       if (points && points.length > 0) {
  //         paneId = CANDLE_PANE_ID
  //         yAxis = this._panes.get(CANDLE_PANE_ID).yAxis()
  //       }
  //     }
  //     const shapeInstance = new ShapeTemplateClass({
  //       id: shapeId,
  //       chartStore: this._chartStore,
  //       xAxis: this._xAxisPane.xAxis(),
  //       yAxis,
  //       points,
  //       styles,
  //       lock,
  //       mode,
  //       data
  //     })
  //     if (isFunction(onDrawStart)) {
  //       onDrawStart({ id: shapeId })
  //     }
  //     perfectOverlayFunc(shapeInstance, [
  //       { key: 'onDrawing', fn: onDrawing },
  //       { key: 'onDrawEnd', fn: onDrawEnd },
  //       { key: 'onClick', fn: onClick },
  //       { key: 'onRightClick', fn: onRightClick },
  //       { key: 'onPressedMove', fn: onPressedMove },
  //       { key: 'onMouseEnter', fn: onMouseEnter },
  //       { key: 'onMouseLeave', fn: onMouseLeave },
  //       { key: 'onRemove', fn: onRemove }
  //     ])
  //     this._chartStore.shapeStore().addInstance(shapeInstance, paneId)
  //     return shapeId
  //   }
  //   return null
  // }

  // /**
  //  * 创建注解
  //  * @param annotations
  //  * @param paneId
  //  */
  // createAnnotation (annotations, paneId) {
  //   const instances = []
  //   annotations.forEach(({
  //     point,
  //     styles,
  //     checkEventCoordinateOnCustomSymbol,
  //     drawCustomSymbol,
  //     drawExtend,
  //     onClick,
  //     onRightClick,
  //     onMouseEnter,
  //     onMouseLeave
  //   }) => {
  //     if (point && point.timestamp) {
  //       const annotationInstance = new Annotation({
  //         id: createId(ANNOTATION_ID_PREFIX),
  //         chartStore: this._chartStore,
  //         point,
  //         xAxis: this._xAxisPane.xAxis(),
  //         yAxis: this._panes.get(paneId).yAxis(),
  //         styles
  //       })

  //       perfectOverlayFunc(annotationInstance, [
  //         { key: 'drawExtend', fn: drawExtend },
  //         { key: 'drawCustomSymbol', fn: drawCustomSymbol },
  //         { key: 'checkEventCoordinateOnCustomSymbol', fn: checkEventCoordinateOnCustomSymbol },
  //         { key: 'onClick', fn: onClick },
  //         { key: 'onRightClick', fn: onRightClick },
  //         { key: 'onMouseEnter', fn: onMouseEnter },
  //         { key: 'onMouseLeave', fn: onMouseLeave }
  //       ])
  //       instances.push(annotationInstance)
  //     }
  //   })
  //   if (instances.length > 0) {
  //     this._chartStore.annotationStore().add(instances, paneId)
  //   }
  // }

  // /**
  //  * 创建标签
  //  * @param tags
  //  * @param paneId
  //  */
  // createTag (tags, paneId) {
  //   const instances = []
  //   let shouldUpdate = false
  //   let shouldAdd = false
  //   tags.forEach(({ id, point, text, mark, styles }) => {
  //     if (isValid(id)) {
  //       if (this._chartStore.tagStore().has(id, paneId)) {
  //         const updateSuccess = this._chartStore.tagStore().update(id, paneId, { point, text, mark, styles })
  //         if (!shouldUpdate) {
  //           shouldUpdate = updateSuccess
  //         }
  //       } else {
  //         shouldAdd = true
  //         instances.push(new Tag({
  //           id,
  //           point,
  //           text,
  //           mark,
  //           styles,
  //           chartStore: this._chartStore,
  //           xAxis: this._xAxisPane.xAxis(),
  //           yAxis: this._panes.get(paneId).yAxis()
  //         }))
  //       }
  //     }
  //   })
  //   if (shouldAdd) {
  //     this._chartStore.tagStore().add(instances, paneId)
  //   } else {
  //     if (shouldUpdate) {
  //       this._invalidatePane(InvalidateLevel.OVERLAY)
  //     }
  //   }
  // }

  // /**
  //  * 移除所有html元素
  //  */
  // removeAllHtml () {
  //   this._panes.forEach(pane => { pane.removeHtml() })
  //   this._xAxisPane.removeHtml()
  // }

  /**
   * 设置窗体参数
   * @param options
   * @param forceShouldAdjust
   */
  setPaneOptions (options: PaneOptions, forceShouldAdjust?: boolean): void {
    if (options.id !== CANDLE_PANE_ID) {
      const pane = this._panes.get(options.id)
      if (pane !== undefined) {
        let shouldAdjust = forceShouldAdjust ?? false
        let shouldMeasureHeight = false
        if (options.height !== undefined && options.height > 0) {
          const minHeight = Math.max(options.minHeight ?? pane.getOptions().minHeight, 0)
          const height = Math.min(minHeight, options.height)
          options.height = height
          shouldAdjust = true
          shouldMeasureHeight = true
        }
        pane.setOptions(options)
        if (shouldAdjust) {
          this.adjustPaneViewport(shouldMeasureHeight, true, true, true, true)
        }
      }
    }
  }

  // /**
  //  * 设置时区
  //  * @param timezone
  //  */
  // setTimezone (timezone) {
  //   this._chartStore.timeScaleStore().setTimezone(timezone)
  //   this._xAxisPane.xAxis().computeAxis(true)
  //   this._xAxisPane.invalidate(InvalidateLevel.FULL)
  // }

  // /**
  //  * 将值装换成像素
  //  * @param timestamp
  //  * @param point
  //  * @param paneId
  //  * @param absoluteYAxis
  //  */
  // convertToPixel (point, { paneId = CANDLE_PANE_ID, absoluteYAxis }) {
  //   const points = [].concat(point)
  //   let coordinates = []
  //   const separatorSize = this._chartStore.styleOptions().separator.size
  //   let absoluteTop = 0
  //   const panes = this._panes.values()
  //   for (const pane of panes) {
  //     if (pane.id() === paneId) {
  //       coordinates = points.map(({ timestamp, dataIndex, value }) => {
  //         const coordinate = {}
  //         let index = dataIndex
  //         if (isValid(timestamp)) {
  //           index = this._chartStore.timeScaleStore().timestampToDataIndex(timestamp)
  //         }
  //         if (isValid(index)) {
  //           coordinate.x = this._xAxisPane.xAxis().convertToPixel(index)
  //         }
  //         if (isValid(value)) {
  //           const y = pane.yAxis().convertToPixel(value)
  //           coordinate.y = absoluteYAxis ? absoluteTop + y : y
  //         }
  //         return coordinate
  //       })
  //       break
  //     }
  //     absoluteTop += (pane.height() + separatorSize)
  //   }
  //   return isArray(point) ? coordinates : (coordinates[0] || {})
  // }

  // /**
  //  * 将像素转换成值
  //  * @param coordinate
  //  * @param paneId
  //  * @param dataIndexXAxis
  //  * @param absoluteYAxis
  //  * @return {{}[]|*[]}
  //  */
  // convertFromPixel (coordinate, { paneId = CANDLE_PANE_ID, absoluteYAxis }) {
  //   const coordinates = [].concat(coordinate)
  //   let points = []
  //   const separatorSize = this._chartStore.styleOptions().separator.size
  //   let absoluteTop = 0
  //   const panes = this._panes.values()
  //   for (const pane of panes) {
  //     if (pane.id() === paneId) {
  //       points = coordinates.map(({ x, y }) => {
  //         const point = {}
  //         if (isValid(x)) {
  //           point.dataIndex = this._xAxisPane.xAxis().convertFromPixel(x)
  //           point.timestamp = this._chartStore.timeScaleStore().dataIndexToTimestamp(point.dataIndex)
  //         }
  //         if (isValid(y)) {
  //           const ry = absoluteYAxis ? y - absoluteTop : y
  //           point.value = pane.yAxis().convertFromPixel(ry)
  //         }
  //         return point
  //       })
  //       break
  //     }
  //     absoluteTop += pane.height() + separatorSize
  //   }
  //   return isArray(coordinate) ? points : (points[0] || {})
  // }

  // /**
  //  * 图表宽度
  //  * @return {*|{}}
  //  */
  // chartWidth () {
  //   return this._chartWidth
  // }

  // /**
  //  * 图表高度
  //  * @return {*|{}}
  //  */
  // chartHeight () {
  //   return this._chartHeight
  // }

  // /**
  //  * 获取图表转换为图片后url
  //  * @param includeOverlay,
  //  * @param type
  //  * @param backgroundColor
  //  */
  // getConvertPictureUrl (includeOverlay, type, backgroundColor) {
  //   const width = this._chartContainer.offsetWidth
  //   const height = this._chartContainer.offsetHeight
  //   const canvas = createElement('canvas', {
  //     width: `${width}px`,
  //     height: `${height}px`,
  //     boxSizing: 'border-box'
  //   })
  //   const ctx = canvas.getContext('2d')
  //   const pixelRatio = getPixelRatio(canvas)
  //   canvas.width = width * pixelRatio
  //   canvas.height = height * pixelRatio
  //   ctx.scale(pixelRatio, pixelRatio)

  //   ctx.fillStyle = backgroundColor
  //   ctx.fillRect(0, 0, width, height)
  //   let offsetTop = 0
  //   this._panes.forEach((pane, paneId) => {
  //     if (paneId !== CANDLE_PANE_ID) {
  //       const separator = this._separators.get(paneId)
  //       ctx.drawImage(
  //         separator.getImage(),
  //         0, offsetTop, width, separator.height()
  //       )
  //       offsetTop += separator.height()
  //     }
  //     ctx.drawImage(
  //       pane.getImage(includeOverlay),
  //       0, offsetTop, width, pane.height()
  //     )
  //     offsetTop += pane.height()
  //   })
  //   ctx.drawImage(
  //     this._xAxisPane.getImage(includeOverlay),
  //     0, offsetTop, width, this._xAxisPane.height()
  //   )
  //   return canvas.toDataURL(`image/${type}`)
  // }

  /**
   * 销毁
   */
  destroy (): void {
    this._panes.forEach(pane => {
      pane.destroy()
    })
    this._panes.clear()
    this._xAxisPane.destroy()
    this._container.removeChild(this._chartContainer)
    this._chartEvent.destroy()
  }
}

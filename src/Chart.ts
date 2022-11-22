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
import Bounding from './common/Bounding'
import KLineData from './common/KLineData'
import Coordinate from './common/Coordinate'
import Point from './common/Point'
import { UpdateLevel } from './common/Updater'
import { Styles, YAxisPosition } from './common/Styles'
import Crosshair from './common/Crosshair'
import { ActionType, ActionCallback } from './common/Action'
import LoadMoreCallback from './common/LoadMoreCallback'

import { createId } from './common/utils/id'
import { createDom } from './common/utils/dom'
import { getPixelRatio } from './common/utils/canvas'
import { isString, isArray } from './common/utils/typeChecks'
import { logWarn } from './common/utils/logger'
import { formatValue } from './common/utils/format'
import { binarySearchNearest } from './common/utils/number'

import ChartStore from './store/ChartStore'

import Pane, { PaneOptions, PANE_DEFAULT_HEIGHT, PaneIdConstants } from './pane/Pane'
import CandlePane from './pane/CandlePane'
import IndicatorPane from './pane/IndicatorPane'
import XAxisPane from './pane/XAxisPane'

import Axis from './component/Axis'

import { Indicator, IndicatorCreate } from './component/Indicator'
import { Overlay, OverlayCreate } from './component/Overlay'

import { getIndicatorClass } from './extension/indicator/index'
import { getOverlayClass } from './extension/overlay/index'

export const enum DomPosition {
  ROOT,
  MAIN,
  YAXIS
}

export interface ConvertFinder {
  paneId?: string
  absolute?: boolean
}

export interface Chart {
  getDom: (paneId?: string, position?: DomPosition) => TypeOrNull<HTMLElement>
  getSize: (paneId?: string, position?: DomPosition) => TypeOrNull<Bounding>
  setStyleOptions: (options: DeepPartial<Styles>) => void
  getStyleOptions: () => Styles
  setPriceVolumePrecision: (pricePrecision: number, volumePrecision: number) => void
  setTimezone: (timezone: string) => void
  getTimezone: () => string
  setOffsetRightDistance: (space: number) => void
  setLeftMinVisibleBarCount: (barCount: number) => void
  setRightMinVisibleBarCount: (barCount: number) => void
  setBarSpace: (space: number) => void
  getBarSpace: () => number
  clearData: () => void
  getDataList: () => KLineData[]
  applyNewData: (dataList: KLineData[], more?: boolean) => void
  applyMoreData: (dataList: KLineData[], more?: boolean) => void
  updateData: (data: KLineData) => void
  loadMore: (cb: LoadMoreCallback) => void
  createIndicator: (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: PaneOptions) => TypeOrNull<string>
  overrideIndicator: (override: IndicatorCreate, paneId?: string) => void
  getIndicatorByPaneId: (paneId?: string, name?: string) => TypeOrNull<Indicator> | TypeOrNull<Map<string, Indicator>> | Map<string, Map<string, Indicator>>
  removeIndicator: (paneId: string, name?: string) => void
  createOverlay: (value: string | OverlayCreate, paneId?: string) => TypeOrNull<string>
  getOverlayById: (id: string) => TypeOrNull<Overlay>
  overrideOverlay: (override: Partial<OverlayCreate>) => void
  removeOverlay: (id?: string) => void
  setPaneOptions: (options: PaneOptions) => void
  setZoomEnabled: (enabled: boolean) => void
  isZoomEnabled: () => boolean
  setScrollEnabled: (enabled: boolean) => void
  isScrollEnabled: () => boolean
  scrollByDistance: (distance: number, animationDuration?: number) => void
  scrollToRealTime: (animationDuration?: number) => void
  scrollToDataIndex: (dataIndex: number, animationDuration?: number) => void
  scrollToTimestamp: (timestamp: number, animationDuration?: number) => void
  zoomAtCoordinate: (scale: number, coordinate: Coordinate, animationDuration?: number) => void
  zoomAtDataIndex: (scale: number, dataIndex: number, animationDuration?: number) => void
  zoomAtTimestamp: (scale: number, timestamp: number, animationDuration?: number) => void
  convertToPixel: (points: Partial<Point> | Array<Partial<Point>>, finder: ConvertFinder) => Partial<Coordinate> | Array<Partial<Coordinate>>
  convertFromPixel: (coordinates: Array<Partial<Coordinate>>, finder: ConvertFinder) => Partial<Point> | Array<Partial<Point>>
  subscribeAction: (type: ActionType, callback: ActionCallback) => void
  unsubscribeAction: (type: ActionType, callback?: ActionCallback) => void
  getConvertPictureUrl: (includeOverlay?: boolean, type?: string, backgroundColor?: string) => string
  resize: () => void
  destroy: () => void
}

export default class ChartImp implements Chart {
  private _container: HTMLElement
  private _chartContainer: HTMLElement
  private readonly _chartStore: ChartStore
  private readonly _xAxisPane: XAxisPane
  private readonly _panes: Map<string, IndicatorPane> = new Map()

  constructor (container: HTMLElement, styleOptions?: DeepPartial<Styles>) {
    this._initContainer(container)
    this._chartStore = new ChartStore(this, styleOptions)
    this._xAxisPane = new XAxisPane(this._chartContainer, this, PaneIdConstants.XAXIS)
    this._panes.set(PaneIdConstants.CANDLE, new CandlePane(this._chartContainer, this, PaneIdConstants.CANDLE))
    this.adjustPaneViewport(true, true, true)
  }

  private _initContainer (container: HTMLElement): void {
    this._container = container
    this._chartContainer = createDom('div', {
      position: 'relative',
      width: '100%',
      userSelect: 'none',
      outline: 'none',
      borderStyle: 'none',
      cursor: 'crosshair',
      boxSizing: 'border-box'
    })
    this._chartContainer.tabIndex = 1
    container.appendChild(this._chartContainer)
  }

  private _measurePaneHeight (): void {
    const totalHeight = this._container.offsetHeight
    const xAxisHeight = this._xAxisPane.getAxisComponent().getAutoSize()
    let paneExcludeXAxisHeight = totalHeight - xAxisHeight
    if (paneExcludeXAxisHeight < 0) {
      paneExcludeXAxisHeight = 0
    }
    let indicatorPaneTotalHeight = 0
    this._panes.forEach(pane => {
      if (pane.getId() !== PaneIdConstants.CANDLE) {
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
    this._panes.get(PaneIdConstants.CANDLE)?.setBounding({ height: candlePaneHeight })

    let top = 0
    this._panes.forEach(pane => {
      pane.setBounding({ top })
      top += pane.getBounding().height
    })
    this._xAxisPane.setBounding({ height: xAxisHeight, top })
  }

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
  }

  private _setPaneOptions (options: PaneOptions, forceShouldAdjust: boolean): void {
    if (options.id !== PaneIdConstants.CANDLE) {
      const pane = this._panes.get(options.id)
      if (pane !== undefined) {
        let shouldAdjust = forceShouldAdjust
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

  getContainer (): HTMLElement { return this._container }

  getChartStore (): ChartStore { return this._chartStore }

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
      this._panes.forEach(pane => {
        pane.getAxisComponent().buildTicks(forceAdjustYAxis)
      })
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

  getPaneById (paneId: string): TypeOrNull<Pane<Axis>> {
    if (paneId === PaneIdConstants.XAXIS) {
      return this._xAxisPane
    }
    return this._panes.get(paneId) ?? null
  }

  crosshairChange (crosshair: Crosshair): void {
    const actionStore = this._chartStore.getActionStore()
    if (actionStore.has(ActionType.onCrosshairChange)) {
      const indicatorData = {}
      this._panes.forEach((_, id) => {
        const paneIndicatorData = {}
        const indicators = this._chartStore.getIndicatorStore().getInstances(id)
        indicators.forEach(indicator => {
          const result = indicator.result
          paneIndicatorData[indicator.name] = result[crosshair.dataIndex ?? result.length - 1]
        })
        indicatorData[id] = paneIndicatorData
      })
      if (crosshair.paneId !== undefined) {
        actionStore.execute(ActionType.onCrosshairChange, {
          ...crosshair,
          indicatorData
        })
      }
    }
  }

  getDom (paneId?: string, position?: DomPosition): TypeOrNull<HTMLElement> {
    if (paneId !== undefined) {
      const pane = this.getPaneById(paneId)
      if (pane !== null) {
        const pos = position ?? DomPosition.ROOT
        switch (pos) {
          case DomPosition.ROOT: {
            return pane.getContainer()
          }
          case DomPosition.MAIN: {
            return pane.getMainWidget().getContainer()
          }
          case DomPosition.YAXIS: {
            return pane.getYAxisWidget()?.getContainer() ?? null
          }
        }
      }
    } else {
      return this._chartContainer
    }
    return null
  }

  getSize (paneId?: string, position?: DomPosition): TypeOrNull<Bounding> {
    if (paneId !== undefined) {
      const pane = this.getPaneById(paneId)
      if (pane !== null) {
        const pos = position ?? DomPosition.ROOT
        switch (pos) {
          case DomPosition.ROOT: {
            return pane.getBounding()
          }
          case DomPosition.MAIN: {
            return pane.getMainWidget().getBounding()
          }
          case DomPosition.YAXIS: {
            return pane.getYAxisWidget()?.getBounding() ?? null
          }
        }
      }
    } else {
      return {
        width: this._chartContainer.offsetWidth,
        height: this._chartContainer.offsetHeight,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    }
    return null
  }

  setStyleOptions (options: DeepPartial<Styles>): void {
    this._chartStore.applyStyleOptions(options)
    this.adjustPaneViewport(true, true, true, true, true)
  }

  getStyleOptions (): Styles {
    return this._chartStore.getStyleOptions()
  }

  setPriceVolumePrecision (pricePrecision: number, volumePrecision: number): void {
    this._chartStore.setPrecision({ price: pricePrecision, volume: volumePrecision })
  }

  setTimezone (timezone: string): void {
    this._chartStore.getTimeScaleStore().setTimezone(timezone)
    this._xAxisPane.getAxisComponent().buildTicks(true)
    this._xAxisPane.update(UpdateLevel.DRAWER)
  }

  getTimezone (): string {
    return this._chartStore.getTimeScaleStore().getTimezone()
  }

  setOffsetRightDistance (space: number): void {
    this._chartStore.getTimeScaleStore().setOffsetRightDistance(space, true)
  }

  setLeftMinVisibleBarCount (barCount: number): void {
    if (barCount > 0) {
      this._chartStore.getTimeScaleStore().setLeftMinVisibleBarCount(Math.ceil(barCount))
    } else {
      logWarn('setLeftMinVisibleBarCount', 'barCount', 'barCount must greater than zero!!!')
    }
  }

  setRightMinVisibleBarCount (barCount: number): void {
    if (barCount > 0) {
      this._chartStore.getTimeScaleStore().setRightMinVisibleBarCount(Math.ceil(barCount))
    } else {
      logWarn('setRightMinVisibleBarCount', 'barCount', 'barCount must be a number and greater than zero!!!')
    }
  }

  setBarSpace (space: number): void {
    this._chartStore.getTimeScaleStore().setBarSpace(space)
  }

  getBarSpace (): number {
    return this._chartStore.getTimeScaleStore().getBarSpace().bar
  }

  clearData (): void {
    this._chartStore.clearDataList()
  }

  getDataList (): KLineData[] {
    return this._chartStore.getDataList()
  }

  applyNewData (dataList: KLineData[], more?: boolean): void {
    this._chartStore.clearDataList()
    this.applyMoreData(dataList, more)
  }

  applyMoreData (dataList: KLineData[], more?: boolean): void {
    this._chartStore.addData(dataList, 0, more)
    this._chartStore.getIndicatorStore().calcInstance().finally(
      () => {
        this.adjustPaneViewport(false, true, true, true)
      }
    )
  }

  updateData (data: KLineData): void {
    const dataList = this._chartStore.getDataList()
    const dataCount = dataList.length
    // 这里判断单个数据应该添加到哪个位置
    const timestamp = data.timestamp
    const lastDataTimestamp = formatValue(dataList[dataCount - 1], 'timestamp', 0) as number
    if (timestamp >= lastDataTimestamp) {
      let pos = dataCount
      if (timestamp === lastDataTimestamp) {
        pos = dataCount - 1
      }
      this._chartStore.addData(data, pos)
      this._chartStore.getIndicatorStore().calcInstance().finally(
        () => {
          this.adjustPaneViewport(false, true, true, true)
        }
      )
    }
  }

  loadMore (cb: LoadMoreCallback): void {
    this._chartStore.getTimeScaleStore().setLoadMoreCallback(cb)
  }

  createIndicator (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: PaneOptions): TypeOrNull<string> {
    const indicator: IndicatorCreate = isString(value) ? { name: value as string } : value as IndicatorCreate
    if (getIndicatorClass(indicator.name) === null) {
      logWarn('createIndicator', 'value', 'indicator not supported, you may need to use registerIndicator to add one!!!')
      return null
    }

    let paneId: string
    if (paneOptions !== undefined && this._panes.has(paneOptions.id)) {
      paneId = paneOptions.id
      this._chartStore.getIndicatorStore().addInstance(indicator, paneId, isStack ?? false).finally(() => {
        this._setPaneOptions(paneOptions, this._panes.get(paneId)?.getAxisComponent().buildTicks(true) ?? false)
      })
    } else {
      paneId = paneOptions?.id ?? createId(PaneIdConstants.INDICATOR)
      const topPane = Array.from(this._panes.values()).pop() as unknown as Pane<Axis>
      const pane = new IndicatorPane(this._chartContainer, this, paneId, topPane)
      topPane.setBottomPane(pane)
      const height = paneOptions?.height ?? PANE_DEFAULT_HEIGHT
      pane.setBounding({ height })
      if (paneOptions !== undefined) {
        pane.setOptions(paneOptions)
      }
      this._panes.set(paneId, pane)
      this._chartStore.getIndicatorStore().addInstance(indicator, paneId, isStack ?? false).finally(() => {
        this.adjustPaneViewport(true, true, true, true, true)
      })
    }
    return paneId
  }

  overrideIndicator (override: IndicatorCreate, paneId?: string): void {
    this._chartStore.getIndicatorStore().override(override, paneId).then(
      result => {
        if (result.length > 0) {
          this.adjustPaneViewport(false, true, true, true)
        }
      }
    ).catch(() => {})
  }

  getIndicatorByPaneId (paneId?: string, name?: string): TypeOrNull<Indicator> | TypeOrNull<Map<string, Indicator>> | Map<string, Map<string, Indicator>> {
    return this._chartStore.getIndicatorStore().getInstanceByPaneId(paneId, name)
  }

  removeIndicator (paneId: string, name?: string): void {
    const indicatorStore = this._chartStore.getIndicatorStore()
    const removed = indicatorStore.removeInstance(paneId, name)
    if (removed) {
      let shouldMeasureHeight = false
      if (paneId !== PaneIdConstants.CANDLE) {
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

  createOverlay (value: string | OverlayCreate, paneId?: string): TypeOrNull<string> {
    const overlay: OverlayCreate = isString(value) ? { name: value as string } : value as OverlayCreate
    if (getOverlayClass(overlay.name) === null) {
      logWarn('createOverlay', 'value', 'overlay not supported, you may need to use registerOverlay to add one!!!')
      return null
    }
    let appointPaneFlag = true
    if (paneId === undefined || this.getPaneById(paneId) === null) {
      paneId = PaneIdConstants.CANDLE
      appointPaneFlag = false
    }
    const id = this._chartStore.getOverlayStore().addInstance(overlay, paneId, appointPaneFlag)
    if (id === null) {
      logWarn('createOverlay', 'options.id', 'duplicate id!!!')
    }
    return id
  }

  getOverlayById (id: string): TypeOrNull<Overlay> {
    return this._chartStore.getOverlayStore().getInstanceById(id)
  }

  overrideOverlay (override: Partial<OverlayCreate>): void {
    this._chartStore.getOverlayStore().override(override)
  }

  removeOverlay (id?: string): void {
    this._chartStore.getOverlayStore().removeInstance(id)
  }

  setPaneOptions (options: PaneOptions): void {
    this._setPaneOptions(options, false)
  }

  setZoomEnabled (enabled: boolean): void {
    this._chartStore.getTimeScaleStore().setZoomEnabled(enabled)
  }

  isZoomEnabled (): boolean {
    return this._chartStore.getTimeScaleStore().getZoomEnabled()
  }

  setScrollEnabled (enabled: boolean): void {
    this._chartStore.getTimeScaleStore().setScrollEnabled(enabled)
  }

  isScrollEnabled (): boolean {
    return this._chartStore.getTimeScaleStore().getScrollEnabled()
  }

  scrollByDistance (distance: number, animationDuration?: number): void {
    const duration = animationDuration === undefined || animationDuration < 0 ? 0 : animationDuration
    const timeScaleStore = this._chartStore.getTimeScaleStore()
    if (duration > 0) {
      timeScaleStore.startScroll()
      const startTime = new Date().getTime()
      const animation: (() => void) = () => {
        const progress = (new Date().getTime() - startTime) / duration
        const finished = progress >= 1
        const dis = finished ? distance : distance * progress
        timeScaleStore.scroll(dis)
        if (!finished) {
          requestAnimationFrame(animation)
        }
      }
      animation()
    } else {
      timeScaleStore.startScroll()
      timeScaleStore.scroll(distance)
    }
  }

  scrollToRealTime (animationDuration?: number): void {
    const timeScaleStore = this._chartStore.getTimeScaleStore()
    const { bar: barSpace } = timeScaleStore.getBarSpace()
    const difBarCount = timeScaleStore.getOffsetRightBarCount() - timeScaleStore.getOffsetRightDistance() / barSpace
    const distance = difBarCount * barSpace
    this.scrollByDistance(distance, animationDuration)
  }

  scrollToDataIndex (dataIndex: number, animationDuration?: number): void {
    const timeScaleStore = this._chartStore.getTimeScaleStore()
    const distance = (
      timeScaleStore.getOffsetRightBarCount() + (this.getDataList().length - 1 - dataIndex)
    ) * timeScaleStore.getBarSpace().bar
    this.scrollByDistance(distance, animationDuration)
  }

  scrollToTimestamp (timestamp: number, animationDuration?: number): void {
    const dataIndex = binarySearchNearest(this.getDataList(), 'timestamp', timestamp)
    this.scrollToDataIndex(dataIndex, animationDuration)
  }

  zoomAtCoordinate (scale: number, coordinate: Coordinate, animationDuration?: number): void {
    const duration = animationDuration === undefined || animationDuration < 0 ? 0 : animationDuration
    const timeScaleStore = this._chartStore.getTimeScaleStore()
    if (duration > 0) {
      const { bar: barSpace } = timeScaleStore.getBarSpace()
      const scaleDataSpace = barSpace * scale
      const difSpace = scaleDataSpace - barSpace
      const startTime = new Date().getTime()
      const animation: (() => void) = () => {
        const progress = (new Date().getTime() - startTime) / duration
        const finished = progress >= 1
        const progressDataSpace = finished ? difSpace : difSpace * progress
        timeScaleStore.zoom(progressDataSpace / barSpace, coordinate)
        if (!finished) {
          requestAnimationFrame(animation)
        }
      }
      animation()
    } else {
      timeScaleStore.zoom(scale, coordinate)
    }
  }

  zoomAtDataIndex (scale: number, dataIndex: number, animationDuration?: number): void {
    const x = this._chartStore.getTimeScaleStore().dataIndexToCoordinate(dataIndex)
    this.zoomAtCoordinate(scale, { x, y: 0 }, animationDuration)
  }

  zoomAtTimestamp (scale: number, timestamp: number, animationDuration?: number): void {
    const dataIndex = binarySearchNearest(this.getDataList(), 'timestamp', timestamp)
    this.zoomAtDataIndex(scale, dataIndex, animationDuration)
  }

  convertToPixel (points: Partial<Point> | Array<Partial<Point>>, finder: ConvertFinder): Partial<Coordinate> | Array<Partial<Coordinate>> {
    const { paneId = PaneIdConstants.CANDLE, absolute = false } = finder
    let coordinates: Array<Partial<Coordinate>> = []
    if (paneId !== PaneIdConstants.XAXIS) {
      const pane = this.getPaneById(paneId)
      if (pane !== null) {
        const timeScaleStore = this._chartStore.getTimeScaleStore()
        const bounding = pane.getBounding()
        const ps = new Array<Partial<Point>>().concat(points)
        const xAxis = this._xAxisPane.getAxisComponent()
        const yAxis = pane.getAxisComponent()
        coordinates = ps.map(point => {
          const coordinate: Partial<Coordinate> = {}
          let dataIndex = point.dataIndex
          if (point.timestamp !== undefined) {
            dataIndex = timeScaleStore.timestampToDataIndex(point.timestamp)
          }
          if (dataIndex !== undefined) {
            coordinate.x = xAxis?.convertToPixel(dataIndex)
          }
          if (point.value !== undefined) {
            const y = yAxis?.convertToPixel(point.value)
            coordinate.y = absolute ? bounding.top + y : y
          }
          return coordinate
        })
      }
    }
    return isArray(points) ? coordinates : (coordinates[0] ?? {})
  }

  convertFromPixel (coordinates: Array<Partial<Coordinate>>, finder: ConvertFinder): Partial<Point> | Array<Partial<Point>> {
    const { paneId = PaneIdConstants.CANDLE, absolute = false } = finder
    let points: Array<Partial<Point>> = []
    if (paneId !== PaneIdConstants.XAXIS) {
      const pane = this.getPaneById(paneId)
      if (pane !== null) {
        const timeScaleStore = this._chartStore.getTimeScaleStore()
        const bounding = pane.getBounding()
        const cs = new Array<Partial<Coordinate>>().concat(coordinates)
        const xAxis = this._xAxisPane.getAxisComponent()
        const yAxis = pane.getAxisComponent()
        points = cs.map(coordinate => {
          const point: Partial<Point> = {}
          if (coordinate.x !== undefined) {
            const dataIndex = xAxis.convertFromPixel(coordinate.x)
            point.dataIndex = dataIndex
            point.timestamp = timeScaleStore.dataIndexToTimestamp(dataIndex) ?? undefined
          }
          if (coordinate.y !== undefined) {
            const y = absolute ? coordinate.y - bounding.top : coordinate.y
            point.value = yAxis.convertFromPixel(y)
          }
          return point
        })
      }
    }
    return isArray(coordinates) ? points : (points[0] ?? {})
  }

  subscribeAction (type: ActionType, callback: ActionCallback): void {
    this._chartStore.getActionStore().subscribe(type, callback)
  }

  unsubscribeAction (type: ActionType, callback?: ActionCallback): void {
    this._chartStore.getActionStore().unsubscribe(type, callback)
  }

  getConvertPictureUrl (includeOverlay?: boolean, type?: string, backgroundColor?: string): string {
    const width = this._chartContainer.offsetWidth
    const height = this._chartContainer.offsetHeight
    const canvas = createDom('canvas', {
      width: `${width}px`,
      height: `${height}px`,
      boxSizing: 'border-box'
    })
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const pixelRatio = getPixelRatio(canvas)
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)

    ctx.fillStyle = backgroundColor ?? '#FFFFFF'
    ctx.fillRect(0, 0, width, height)
    const overlayFlag = includeOverlay ?? false
    this._panes.forEach(pane => {
      const bounding = pane.getBounding()
      ctx.drawImage(
        pane.getImage(overlayFlag),
        0, bounding.top, width, bounding.height
      )
    })
    const xAxisBounding = this._xAxisPane.getBounding()
    ctx.drawImage(
      this._xAxisPane.getImage(overlayFlag),
      0, xAxisBounding.top, width, xAxisBounding.height
    )
    return canvas.toDataURL(`image/${type ?? 'jpeg'}`)
  }

  resize (): void {
    this.adjustPaneViewport(true, true, true, true, true)
  }

  destroy (): void {
    this._panes.forEach(pane => {
      pane.destroy()
    })
    this._panes.clear()
    this._xAxisPane.destroy()
    this._container.removeChild(this._chartContainer)
  }
}

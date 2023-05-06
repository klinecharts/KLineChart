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

import Nullable from './common/Nullable'
import DeepPartial from './common/DeepPartial'
import Bounding from './common/Bounding'
import KLineData from './common/KLineData'
import Coordinate from './common/Coordinate'
import Point from './common/Point'
import { UpdateLevel } from './common/Updater'
import { Styles, YAxisPosition, CustomApi, Options } from './common/Options'
import Crosshair from './common/Crosshair'
import { ActionType, ActionCallback } from './common/Action'
import LoadMoreCallback from './common/LoadMoreCallback'
import Precision from './common/Precision'
import VisibleRange from './common/VisibleRange'

import { createId } from './common/utils/id'
import { createDom } from './common/utils/dom'
import { getPixelRatio } from './common/utils/canvas'
import { isString, isArray, isValid } from './common/utils/typeChecks'
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
import { Overlay, OverlayCreate, OverlayRemove } from './component/Overlay'

import { getIndicatorClass } from './extension/indicator/index'
import { getOverlayClass } from './extension/overlay/index'
import { getStyles as getExtensionStyles } from './extension/styles/index'

import ChartEvent from './ChartEvent'

export enum DomPosition {
  Root = 'root',
  Main = 'main',
  YAxis = 'yAxis'
}

export interface ConvertFinder {
  paneId?: string
  absolute?: boolean
}

export interface Chart {
  getDom: (paneId?: string, position?: DomPosition) => Nullable<HTMLElement>
  getSize: (paneId?: string, position?: DomPosition) => Nullable<Bounding>
  setLocale: (locale: string) => void
  getLocale: () => string
  setStyles: (styles: string | DeepPartial<Styles>) => void
  getStyles: () => Styles
  setCustomApi: (customApi: Partial<CustomApi>) => void
  setPriceVolumePrecision: (pricePrecision: number, volumePrecision: number) => void
  getPriceVolumePrecision: () => Precision
  setTimezone: (timezone: string) => void
  getTimezone: () => string
  setOffsetRightDistance: (space: number) => void
  getOffsetRightDistance: () => number
  setLeftMinVisibleBarCount: (barCount: number) => void
  setRightMinVisibleBarCount: (barCount: number) => void
  setBarSpace: (space: number) => void
  getBarSpace: () => number
  getVisibleRange: () => VisibleRange
  clearData: () => void
  getDataList: () => KLineData[]
  applyNewData: (dataList: KLineData[], more?: boolean, callback?: () => void) => void
  applyMoreData: (dataList: KLineData[], more?: boolean, callback?: () => void) => void
  updateData: (data: KLineData, callback?: () => void) => void
  loadMore: (cb: LoadMoreCallback) => void
  createIndicator: (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: PaneOptions, callback?: () => void) => Nullable<string>
  overrideIndicator: (override: IndicatorCreate, paneId?: string, callback?: () => void) => void
  getIndicatorByPaneId: (paneId?: string, name?: string) => Nullable<Indicator> | Nullable<Map<string, Indicator>> | Map<string, Map<string, Indicator>>
  removeIndicator: (paneId: string, name?: string) => void
  createOverlay: (value: string | OverlayCreate, paneId?: string) => Nullable<string>
  getOverlayById: (id: string) => Nullable<Overlay>
  overrideOverlay: (override: Partial<OverlayCreate>) => void
  removeOverlay: (remove?: string | OverlayRemove) => void
  setPaneOptions: (options: PaneOptions) => void
  setZoomEnabled: (enabled: boolean) => void
  isZoomEnabled: () => boolean
  setScrollEnabled: (enabled: boolean) => void
  isScrollEnabled: () => boolean
  scrollByDistance: (distance: number, animationDuration?: number) => void
  scrollToRealTime: (animationDuration?: number) => void
  scrollToDataIndex: (dataIndex: number, animationDuration?: number) => void
  scrollToTimestamp: (timestamp: number, animationDuration?: number) => void
  zoomAtCoordinate: (scale: number, coordinate?: Coordinate, animationDuration?: number) => void
  zoomAtDataIndex: (scale: number, dataIndex: number, animationDuration?: number) => void
  zoomAtTimestamp: (scale: number, timestamp: number, animationDuration?: number) => void
  convertToPixel: (points: Partial<Point> | Array<Partial<Point>>, finder: ConvertFinder) => Partial<Coordinate> | Array<Partial<Coordinate>>
  convertFromPixel: (coordinates: Array<Partial<Coordinate>>, finder: ConvertFinder) => Partial<Point> | Array<Partial<Point>>
  executeAction: (type: ActionType, data: any) => void
  subscribeAction: (type: ActionType, callback: ActionCallback) => void
  unsubscribeAction: (type: ActionType, callback?: ActionCallback) => void
  getConvertPictureUrl: (includeOverlay?: boolean, type?: string, backgroundColor?: string) => string
  resize: () => void
  destroy: () => void
}

export default class ChartImp implements Chart {
  private _container: HTMLElement
  private _chartContainer: HTMLElement
  private readonly _chartEvent: ChartEvent
  private readonly _chartStore: ChartStore
  private readonly _xAxisPane: XAxisPane
  private readonly _panes: Map<string, IndicatorPane> = new Map()

  constructor (container: HTMLElement, options?: Options) {
    this._initContainer(container)
    this._chartEvent = new ChartEvent(this._chartContainer, this)
    this._chartStore = new ChartStore(this, options)
    this._xAxisPane = new XAxisPane(this._chartContainer, this, PaneIdConstants.XAXIS)
    this._panes.set(PaneIdConstants.CANDLE, new CandlePane(this._chartContainer, this, PaneIdConstants.CANDLE))
    this.adjustPaneViewport(true, true, true)
  }

  private _initContainer (container: HTMLElement): void {
    this._container = container
    this._chartContainer = createDom('div', {
      position: 'relative',
      width: '100%',
      outline: 'none',
      borderStyle: 'none',
      cursor: 'crosshair',
      boxSizing: 'border-box',
      userSelect: 'none',
      webkitUserSelect: 'none',
      // @ts-expect-error
      msUserSelect: 'none',
      MozUserSelect: 'none',
      webkitTapHighlightColor: 'transparent'
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
    const styles = this._chartStore.getStyles()
    const yAxisStyles = styles.yAxis
    const isYAxisLeft = yAxisStyles.position === YAxisPosition.Left
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
    const pane = this._panes.get(options?.id ?? '')
    let shouldMeasureHeight = false
    if (pane !== undefined) {
      let shouldAdjust = forceShouldAdjust
      if (options.id !== PaneIdConstants.CANDLE && options.height !== undefined && options.height > 0) {
        const minHeight = Math.max(options.minHeight ?? pane.getOptions().minHeight, 0)
        const height = Math.max(minHeight, options.height)
        pane.setBounding({ height })
        shouldAdjust = true
        shouldMeasureHeight = true
      }
      pane.setOptions(options)
      if (shouldAdjust) {
        this.adjustPaneViewport(shouldMeasureHeight, true, true, true, true)
      }
    }
  }

  getContainer (): HTMLElement { return this._container }

  getChartStore (): ChartStore { return this._chartStore }

  getAllPanes (): Map<string, IndicatorPane> { return this._panes }

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
      this.updatePane(UpdateLevel.All)
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

  getPaneById (paneId: string): Nullable<Pane<Axis>> {
    if (paneId === PaneIdConstants.XAXIS) {
      return this._xAxisPane
    }
    return this._panes.get(paneId) ?? null
  }

  crosshairChange (crosshair: Crosshair): void {
    const actionStore = this._chartStore.getActionStore()
    if (actionStore.has(ActionType.OnCrosshairChange)) {
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
        actionStore.execute(ActionType.OnCrosshairChange, {
          ...crosshair,
          indicatorData
        })
      }
    }
  }

  getDom (paneId?: string, position?: DomPosition): Nullable<HTMLElement> {
    if (paneId !== undefined) {
      const pane = this.getPaneById(paneId)
      if (pane !== null) {
        const pos = position ?? DomPosition.Root
        switch (pos) {
          case DomPosition.Root: {
            return pane.getContainer()
          }
          case DomPosition.Main: {
            return pane.getMainWidget().getContainer()
          }
          case DomPosition.YAxis: {
            return pane.getYAxisWidget()?.getContainer() ?? null
          }
        }
      }
    } else {
      return this._chartContainer
    }
    return null
  }

  getSize (paneId?: string, position?: DomPosition): Nullable<Bounding> {
    if (paneId !== undefined) {
      const pane = this.getPaneById(paneId)
      if (pane !== null) {
        const pos = position ?? DomPosition.Root
        switch (pos) {
          case DomPosition.Root: {
            return pane.getBounding()
          }
          case DomPosition.Main: {
            return pane.getMainWidget().getBounding()
          }
          case DomPosition.YAxis: {
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

  setStyles (styles: string | DeepPartial<Styles>): void {
    this._chartStore.setOptions({ styles })
    let realStyles: Nullable<DeepPartial<Styles>>
    if (isString(styles)) {
      realStyles = getExtensionStyles(styles)
    } else {
      realStyles = styles
    }
    if (realStyles?.yAxis?.type !== undefined) {
      this.getPaneById(PaneIdConstants.CANDLE)?.getAxisComponent().setAutoCalcTickFlag(true)
    }
    this.adjustPaneViewport(true, true, true, true, true)
  }

  getStyles (): Styles {
    return this._chartStore.getStyles()
  }

  setLocale (locale: string): void {
    this._chartStore.setOptions({ locale })
    this.adjustPaneViewport(true, true, true, true, true)
  }

  getLocale (): string {
    return this._chartStore.getLocale()
  }

  setCustomApi (customApi: Partial<CustomApi>): void {
    this._chartStore.setOptions({ customApi })
    this.adjustPaneViewport(true, true, true, true, true)
  }

  setPriceVolumePrecision (pricePrecision: number, volumePrecision: number): void {
    this._chartStore.setPrecision({ price: pricePrecision, volume: volumePrecision })
  }

  getPriceVolumePrecision (): Precision {
    return this._chartStore.getPrecision()
  }

  setTimezone (timezone: string): void {
    this._chartStore.setOptions({ timezone })
    this._xAxisPane.getAxisComponent().buildTicks(true)
    this._xAxisPane.update(UpdateLevel.Drawer)
  }

  getTimezone (): string {
    return this._chartStore.getTimeScaleStore().getTimezone()
  }

  setOffsetRightDistance (space: number): void {
    this._chartStore.getTimeScaleStore().setOffsetRightDistance(space, true)
  }

  getOffsetRightDistance (): number {
    return this._chartStore.getTimeScaleStore().getOffsetRightDistance()
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

  getVisibleRange (): VisibleRange {
    return this._chartStore.getTimeScaleStore().getVisibleRange()
  }

  clearData (): void {
    this._chartStore.clearDataList()
  }

  getDataList (): KLineData[] {
    return this._chartStore.getDataList()
  }

  applyNewData (dataList: KLineData[], more?: boolean, callback?: () => void): void {
    this._chartStore.clearDataList()
    if (dataList.length === 0) {
      this.adjustPaneViewport(false, true, true, true)
    } else {
      this.applyMoreData(dataList, more, callback)
    }
  }

  applyMoreData (dataList: KLineData[], more?: boolean, callback?: () => void): void {
    this._chartStore.addData(dataList, 0, more)
    if (dataList.length > 0) {
      this._chartStore.getIndicatorStore().calcInstance().then(
        _ => {
          this.adjustPaneViewport(false, true, true, true)
          callback?.()
        }
      ).catch(_ => {})
    }
  }

  updateData (data: KLineData, callback?: () => void): void {
    const dataList = this._chartStore.getDataList()
    const dataCount = dataList.length
    // Determine where individual data should be added
    const timestamp = data.timestamp
    const lastDataTimestamp = formatValue(dataList[dataCount - 1], 'timestamp', 0) as number
    if (timestamp >= lastDataTimestamp) {
      let pos = dataCount
      if (timestamp === lastDataTimestamp) {
        pos = dataCount - 1
      }
      this._chartStore.addData(data, pos)
      this._chartStore.getIndicatorStore().calcInstance().then(
        _ => {
          this.adjustPaneViewport(false, true, true, true)
          callback?.()
        }
      ).catch(_ => {})
    }
  }

  loadMore (cb: LoadMoreCallback): void {
    this._chartStore.getTimeScaleStore().setLoadMoreCallback(cb)
  }

  createIndicator (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: Nullable<PaneOptions>, callback?: () => void): Nullable<string> {
    const indicator: IndicatorCreate = isString(value) ? { name: value } : value
    if (getIndicatorClass(indicator.name) === null) {
      logWarn('createIndicator', 'value', 'indicator not supported, you may need to use registerIndicator to add one!!!')
      return null
    }

    let paneId: string
    if (isValid<PaneOptions>(paneOptions) && isString(paneOptions?.id) && this._panes.has(paneOptions.id)) {
      paneId = paneOptions.id
      this._chartStore.getIndicatorStore().addInstance(indicator, paneId, isStack ?? false).then(_ => {
        this._setPaneOptions(paneOptions, this._panes.get(paneId)?.getAxisComponent().buildTicks(true) ?? false)
      }).catch(_ => {})
    } else {
      paneId = paneOptions?.id ?? createId(PaneIdConstants.INDICATOR)
      const topPane = Array.from(this._panes.values()).pop() as unknown as Pane<Axis>
      const pane = new IndicatorPane(this._chartContainer, this, paneId, topPane)
      topPane.setBottomPane(pane)
      const height = paneOptions?.height ?? PANE_DEFAULT_HEIGHT
      pane.setBounding({ height })
      if (isValid<PaneOptions>(paneOptions)) {
        pane.setOptions(paneOptions)
      }
      this._panes.set(paneId, pane)
      this._chartStore.getIndicatorStore().addInstance(indicator, paneId, isStack ?? false).finally(() => {
        this.adjustPaneViewport(true, true, true, true, true)
        callback?.()
      })
    }
    return paneId
  }

  overrideIndicator (override: IndicatorCreate, paneId?: Nullable<string>, callback?: () => void): void {
    this._chartStore.getIndicatorStore().override(override, paneId ?? null).then(
      ([onlyUpdateFlag, resizeFlag]) => {
        if (onlyUpdateFlag || resizeFlag) {
          this.adjustPaneViewport(false, resizeFlag, true, resizeFlag)
          callback?.()
        }
      }
    ).catch(() => {})
  }

  getIndicatorByPaneId (paneId?: string, name?: string): Nullable<Indicator> | Nullable<Map<string, Indicator>> | Map<string, Map<string, Indicator>> {
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

  createOverlay (value: string | OverlayCreate, paneId?: string): Nullable<string> {
    const overlay: OverlayCreate = isString(value) ? { name: value } : value
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

  getOverlayById (id: string): Nullable<Overlay> {
    return this._chartStore.getOverlayStore().getInstanceById(id)
  }

  overrideOverlay (override: Partial<OverlayCreate>): void {
    this._chartStore.getOverlayStore().override(override)
  }

  removeOverlay (remove?: string | OverlayRemove): void {
    let overlayRemove
    if (remove !== undefined) {
      if (isString(remove)) {
        overlayRemove = { id: remove }
      } else {
        overlayRemove = remove
      }
    }
    this._chartStore.getOverlayStore().removeInstance(overlayRemove)
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
    const difBarCount = timeScaleStore.getOffsetRightBarCount() - timeScaleStore.getInitialOffsetRightDistance() / barSpace
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

  zoomAtCoordinate (scale: number, coordinate?: Coordinate, animationDuration?: number): void {
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

  executeAction (type: ActionType, data: any): void {
    switch (type) {
      case ActionType.OnCrosshairChange: {
        const crosshair = { ...data }
        crosshair.paneId = crosshair.paneId ?? PaneIdConstants.CANDLE
        this._chartStore.getCrosshairStore().set(crosshair)
        break
      }
    }
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
    this._chartEvent.destroy()
    this._panes.forEach(pane => {
      pane.destroy()
    })
    this._panes.clear()
    this._xAxisPane.destroy()
    this._container.removeChild(this._chartContainer)
  }
}

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

import type Nullable from './common/Nullable'
import type Bounding from './common/Bounding'
import { createDefaultBounding } from './common/Bounding'
import type { KLineData } from './common/Data'
import type Coordinate from './common/Coordinate'
import type Point from './common/Point'
import { UpdateLevel } from './common/Updater'
import type { Styles } from './common/Styles'
import type Crosshair from './common/Crosshair'
import { ActionType, type ActionCallback } from './common/Action'
import type { LoadDataCallback, LoadDataMore } from './common/LoadDataCallback'
import type Precision from './common/Precision'
import type VisibleRange from './common/VisibleRange'
import { type CustomApi, LayoutChildType, type Options } from './Options'
import Animation from './common/Animation'

import { createId } from './common/utils/id'
import { createDom } from './common/utils/dom'
import { getPixelRatio } from './common/utils/canvas'
import { isString, isArray, isValid, merge, isNumber, isBoolean } from './common/utils/typeChecks'
import { logWarn } from './common/utils/logger'
import { binarySearchNearest } from './common/utils/number'
import { LoadDataType } from './common/LoadDataCallback'

import ChartStore, { SCALE_MULTIPLIER } from './Store'

import CandlePane from './pane/CandlePane'
import IndicatorPane from './pane/IndicatorPane'
import XAxisPane from './pane/XAxisPane'
import type DrawPane from './pane/DrawPane'
import SeparatorPane from './pane/SeparatorPane'

import { type PaneOptions, PanePosition, PANE_DEFAULT_HEIGHT, PaneIdConstants, PaneState, PANE_MIN_HEIGHT } from './pane/types'

import type AxisImp from './component/Axis'
import { AxisPosition } from './component/Axis'

import type { IndicatorFilter, Indicator, IndicatorCreate } from './component/Indicator'
import type { OverlayFilter, Overlay, OverlayCreate } from './component/Overlay'

import { getIndicatorClass } from './extension/indicator/index'

import Event from './Event'
import type { YAxis } from './component/YAxis'

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
  id: string
  getDom: (paneId?: string, position?: DomPosition) => Nullable<HTMLElement>
  getSize: (paneId?: string, position?: DomPosition) => Nullable<Bounding>
  setOptions: (options: Options) => void
  getOptions: () => Required<Omit<Options, 'layout'>> & { customApi: CustomApi, styles: Styles }
  setPriceVolumePrecision: (pricePrecision: number, volumePrecision: number) => void
  getPriceVolumePrecision: () => Precision
  setOffsetRightDistance: (distance: number) => void
  getOffsetRightDistance: () => number
  setMaxOffsetLeftDistance: (distance: number) => void
  setMaxOffsetRightDistance: (distance: number) => void
  setLeftMinVisibleBarCount: (barCount: number) => void
  setRightMinVisibleBarCount: (barCount: number) => void
  setBarSpace: (space: number) => void
  getBarSpace: () => number
  getVisibleRange: () => VisibleRange
  clearData: () => void
  getDataList: () => KLineData[]
  applyNewData: (dataList: KLineData[], more?: boolean | Partial<LoadDataMore>) => void
  updateData: (data: KLineData) => void
  setLoadMoreDataCallback: (cb: LoadDataCallback) => void
  createIndicator: (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: PaneOptions) => Nullable<string>
  overrideIndicator: (override: IndicatorCreate) => void
  getIndicators: (filter?: IndicatorFilter) => Map<string, Indicator[]>
  removeIndicator: (filter?: IndicatorFilter) => void
  createOverlay: (value: string | OverlayCreate | Array<string | OverlayCreate>) => Nullable<string> | Array<Nullable<string>>
  getOverlays: (filter?: OverlayFilter) => Map<string, Overlay[]>
  overrideOverlay: (override: Partial<OverlayCreate>) => void
  removeOverlay: (filter?: OverlayFilter) => void
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
  executeAction: (type: ActionType, data: Crosshair) => void
  subscribeAction: (type: ActionType, callback: ActionCallback) => void
  unsubscribeAction: (type: ActionType, callback?: ActionCallback) => void
  getConvertPictureUrl: (includeOverlay?: boolean, type?: string, backgroundColor?: string) => string
  resize: () => void
}

export default class ChartImp implements Chart {
  id: string

  private _container: HTMLElement
  private _chartContainer: HTMLElement
  private readonly _chartBounding = createDefaultBounding()
  private readonly _chartEvent: Event
  private readonly _chartStore: ChartStore
  private _drawPanes: DrawPane[] = []
  private _candlePane: Nullable<CandlePane>
  private _xAxisPane: XAxisPane
  private readonly _separatorPanes = new Map<DrawPane, SeparatorPane>()

  constructor (container: HTMLElement, options?: Options) {
    this._initContainer(container)
    this._chartEvent = new Event(this._chartContainer, this)
    this._chartStore = new ChartStore(this, options)
    this._initPanes(options)
    this.adjustPaneViewport(true, true, true)
  }

  private _initContainer (container: HTMLElement): void {
    this._container = container
    this._chartContainer = createDom('div', {
      position: 'relative',
      width: '100%',
      height: '100%',
      outline: 'none',
      borderStyle: 'none',
      cursor: 'crosshair',
      boxSizing: 'border-box',
      userSelect: 'none',
      webkitUserSelect: 'none',
      overflow: 'hidden',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      msUserSelect: 'none',
      MozUserSelect: 'none',
      webkitTapHighlightColor: 'transparent'
    })
    this._chartContainer.tabIndex = 1
    container.appendChild(this._chartContainer)
    this._cacheChartBounding()
  }

  _cacheChartBounding (): void {
    this._chartBounding.width = Math.floor(this._chartContainer.clientWidth)
    this._chartBounding.height = Math.floor(this._chartContainer.clientHeight)
  }

  private _initPanes (options?: Options): void {
    const layout = options?.layout ?? [{ type: LayoutChildType.Candle }]
    let candlePaneInitialized = false
    let xAxisPaneInitialized = false

    const createXAxisPane: ((ops?: PaneOptions) => void) = (ops?: PaneOptions) => {
      if (!xAxisPaneInitialized) {
        const pane = this._createPane<XAxisPane>(XAxisPane, PaneIdConstants.X_AXIS, ops ?? {})
        this._xAxisPane = pane
        xAxisPaneInitialized = true
      }
    }

    layout.forEach(child => {
      switch (child.type) {
        case LayoutChildType.Candle: {
          if (!candlePaneInitialized) {
            const paneOptions = child.options ?? {}
            merge(paneOptions, { id: PaneIdConstants.CANDLE })
            this._candlePane = this._createPane<CandlePane>(CandlePane, PaneIdConstants.CANDLE, paneOptions)
            const content = child.content ?? []
            content.forEach(v => {
              this.createIndicator(v, true, paneOptions)
            })
            candlePaneInitialized = true
          }
          break
        }
        case LayoutChildType.Indicator: {
          const content = child.content ?? []
          if (content.length > 0) {
            let paneId: Nullable<string> = null
            content.forEach(v => {
              if (isValid(paneId)) {
                this.createIndicator(v, true, { id: paneId })
              } else {
                paneId = this.createIndicator(v, true, child.options)
              }
            })
          }
          break
        }
        case LayoutChildType.XAxis: {
          createXAxisPane(child.options)
          break
        }
      }
    })
    createXAxisPane({ position: PanePosition.Bottom })
  }

  private _createPane<P extends DrawPane> (
    DrawPaneClass: new (rootContainer: HTMLElement, afterElement: Nullable<HTMLElement>, chart: Chart, id: string, options: Omit<PaneOptions, 'id' | 'height'>) => P,
    id: string,
    options?: PaneOptions
  ): P {
    let index: Nullable<number> = null
    let pane: Nullable<P> = null
    const position = options?.position
    switch (position) {
      case PanePosition.Top: {
        const firstPane = this._drawPanes[0]
        if (isValid(firstPane)) {
          pane = new DrawPaneClass(this._chartContainer, firstPane.getContainer(), this, id, options ?? {})
          index = 0
        }
        break
      }
      case PanePosition.Bottom: { break }
      default: {
        for (let i = this._drawPanes.length - 1; i > -1; i--) {
          const p = this._drawPanes[i]
          const prevP = this._drawPanes[i - 1]
          if (
            p.getOptions().position === PanePosition.Bottom &&
            prevP.getOptions().position !== PanePosition.Bottom
          ) {
            pane = new DrawPaneClass(this._chartContainer, p.getContainer(), this, id, options ?? {})
            index = i
            break
          }
        }
      }
    }
    if (!isValid(pane)) {
      pane = new DrawPaneClass(this._chartContainer, null, this, id, options ?? {})
    }
    let newIndex = 0
    if (isNumber(index)) {
      this._drawPanes.splice(index, 0, pane)
      newIndex = index
    } else {
      this._drawPanes.push(pane)
      newIndex = this._drawPanes.length - 1
    }
    if (pane.getId() !== PaneIdConstants.X_AXIS) {
      let nextPane = this._drawPanes[newIndex + 1]
      if (isValid(nextPane)) {
        if (nextPane.getId() === PaneIdConstants.X_AXIS) {
          nextPane = this._drawPanes[newIndex + 2]
        }
      }
      if (isValid(nextPane)) {
        let separatorPane = this._separatorPanes.get(nextPane)
        if (isValid(separatorPane)) {
          separatorPane.setTopPane(pane)
        } else {
          separatorPane = new SeparatorPane(this._chartContainer, nextPane.getContainer(), this, '', pane, nextPane)
          this._separatorPanes.set(nextPane, separatorPane)
        }
      }
      let prevPane = this._drawPanes[newIndex - 1]
      if (isValid(prevPane)) {
        if (prevPane.getId() === PaneIdConstants.X_AXIS) {
          prevPane = this._drawPanes[newIndex - 2]
        }
      }
      if (isValid(prevPane)) {
        const separatorPane = new SeparatorPane(this._chartContainer, pane.getContainer(), this, '', prevPane, pane)
        this._separatorPanes.set(pane, separatorPane)
      }
    }
    return pane
  }

  private _measurePaneHeight (): void {
    const totalHeight = this._chartBounding.height
    const separatorSize = this._chartStore.getOptions().styles.separator.size
    const xAxisHeight = this._xAxisPane.getAxisComponent().getAutoSize()
    let remainingHeight = totalHeight - xAxisHeight
    if (remainingHeight < 0) {
      remainingHeight = 0
    }
    const maximizePane = this._drawPanes.find(pane => pane.getId() !== PaneIdConstants.X_AXIS && pane.getOptions().state === PaneState.Maximize)
    if (isValid(maximizePane)) {
      maximizePane.setBounding({ height: remainingHeight })
      this._separatorPanes.get(maximizePane)?.setVisible(false)
      this._drawPanes.forEach(pane => {
        const paneId = pane.getId()
        if (paneId !== maximizePane.getId() && paneId !== PaneIdConstants.X_AXIS) {
          pane.setVisible(false)
          this._separatorPanes.get(pane)?.setVisible(false)
        }
      })
    } else {
      this._drawPanes.forEach(pane => {
        pane.setVisible(true)
        this._separatorPanes.get(pane)?.setVisible(true)
        const paneId = pane.getId()
        if (isValid(this._separatorPanes.get(pane))) {
          remainingHeight -= separatorSize
        }
        if (paneId !== PaneIdConstants.X_AXIS && paneId !== PaneIdConstants.CANDLE) {
          let paneHeight = PANE_MIN_HEIGHT
          const paneOptions = pane.getOptions()
          if (paneOptions.state !== PaneState.Minimize) {
            paneHeight = Math.max(pane.getOriginalBounding().height, paneOptions.minHeight)
          }
          if (paneHeight > remainingHeight) {
            paneHeight = Math.max(remainingHeight, 0)
            remainingHeight = 0
          } else {
            remainingHeight -= paneHeight
          }
          pane.setBounding({ height: paneHeight })
        }
      })

      let candlePaneHeight = PANE_MIN_HEIGHT
      if (this._candlePane?.getOptions().state === PaneState.Minimize) {
        remainingHeight -= candlePaneHeight
        const candlePaneIndex = this._drawPanes.findIndex(pane => this._candlePane?.getId() === pane.getId())
        // Find the pane that is nearest to the main pane and is not minimized
        // Add the extra height to this pane
        let nearPane: Nullable<DrawPane> = null
        for (let i = candlePaneIndex + 1; i < this._drawPanes.length; i++) {
          const pane = this._drawPanes[i]
          if (pane.getOptions().state !== PaneState.Minimize) {
            nearPane = pane
            break
          }
        }
        if (!isValid(nearPane)) {
          for (let i = candlePaneIndex - 1; i > -1; i--) {
            const pane = this._drawPanes[i]
            if (pane.getOptions().state !== PaneState.Minimize) {
              nearPane = pane
              break
            }
          }
        }
        nearPane?.setBounding({ height: nearPane.getBounding().height + remainingHeight })
      } else {
        candlePaneHeight = Math.max(remainingHeight, 0)
        this._candlePane?.setOriginalBounding({ height: candlePaneHeight })
      }
      this._candlePane?.setBounding({ height: candlePaneHeight })
      this._xAxisPane.setBounding({ height: xAxisHeight })
  
      let top = 0
      this._drawPanes.forEach(pane => {
        const separatorPane = this._separatorPanes.get(pane)
        if (isValid(separatorPane)) {
          separatorPane.setBounding({ height: separatorSize, top })
          top += separatorSize
        }
        pane.setBounding({ top })
        top += pane.getBounding().height
      })
    }
  }

  private _measurePaneWidth (): void {
    const totalWidth = this._chartBounding.width
    const styles = this._chartStore.getOptions().styles

    let leftYAxisWidth = 0
    let leftYAxisOutside = true
    let rightYAxisWidth = 0
    let rightYAxisOutside = true

    this._drawPanes.forEach(pane => {
      if (pane.getId() !== PaneIdConstants.X_AXIS) {
        const yAxis = pane.getAxisComponent() as YAxis
        const inside = yAxis.inside
        const yAxisWidth = yAxis.getAutoSize()
        if (yAxis.position === AxisPosition.Left) {
          leftYAxisWidth = Math.max(leftYAxisWidth, yAxisWidth)
          if (inside) {
            leftYAxisOutside = false
          }
        } else {
          rightYAxisWidth = Math.max(rightYAxisWidth, yAxisWidth)
          if (inside) {
            rightYAxisOutside = false
          }
        }
      }
    })

    let mainWidth = totalWidth
    let mainLeft = 0
    let mainRight = 0
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (leftYAxisOutside) {
      mainWidth -= leftYAxisWidth
      mainLeft = leftYAxisWidth
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (rightYAxisOutside) {
      mainWidth -= rightYAxisWidth
      mainRight = rightYAxisWidth
    }

    this._chartStore.setTotalBarSpace(mainWidth)

    const paneBounding = { width: totalWidth }
    const mainBounding = { width: mainWidth, left: mainLeft, right: mainRight }
    const leftYAxisBounding = { width: leftYAxisWidth }
    const rightYAxisBounding = { width: rightYAxisWidth }
    const separatorFill = styles.separator.fill
    let separatorBounding: Partial<Bounding> = {}
    if (!separatorFill) {
      separatorBounding = mainBounding
    } else {
      separatorBounding = paneBounding
    }
    this._drawPanes.forEach((pane) => {
      this._separatorPanes.get(pane)?.setBounding(separatorBounding)
      pane.setBounding(paneBounding, mainBounding, leftYAxisBounding, rightYAxisBounding)
    })
  }

  private _setPaneOptions (options: PaneOptions, forceShouldAdjust: boolean): void {
    let shouldMeasureHeight = false
    let shouldAdjust = forceShouldAdjust
    for (let i = 0; i < this._drawPanes.length; i++) {
      const pane = this._drawPanes[i]
      const paneIdValid = isValid(options.id)
      const isSpecify = paneIdValid && pane.getId() === options.id
      if (isSpecify || !paneIdValid) {
        if (options.id !== PaneIdConstants.CANDLE && isNumber(options.height) && options.height > 0) {
          const minHeight = Math.max(options.minHeight ?? pane.getOptions().minHeight, 0)
          const height = Math.max(minHeight, options.height)
          pane.setOriginalBounding({ height })
          shouldAdjust = true
          shouldMeasureHeight = true
        }
        if (isValid(options.state)) {
          shouldMeasureHeight = true
          shouldAdjust = true
        }
        if (isValid(options.axis)) {
          shouldAdjust = true
        }
        pane.setOptions(options)
        if (isSpecify) {
          break
        }
      }
    }
    if (shouldAdjust) {
      this.adjustPaneViewport(shouldMeasureHeight, true, true, true, true)
    }
  }

  getDrawPaneById (paneId: string): Nullable<DrawPane> {
    if (paneId === PaneIdConstants.CANDLE) {
      return this._candlePane
    }
    if (paneId === PaneIdConstants.X_AXIS) {
      return this._xAxisPane
    }
    const pane = this._drawPanes.find(p => p.getId() === paneId)
    return pane ?? null
  }

  getContainer (): HTMLElement { return this._container }

  getChartStore (): ChartStore { return this._chartStore }

  getXAxisPane (): XAxisPane { return this._xAxisPane }

  getDrawPanes (): DrawPane[] { return this._drawPanes }

  getSeparatorPanes (): Map<DrawPane, SeparatorPane> { return this._separatorPanes }

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
      this._drawPanes.forEach(pane => {
        const adjust = (pane.getAxisComponent() as AxisImp).buildTicks(forceAdjustYAxis)
        if (!forceMeasureWidth) {
          forceMeasureWidth = adjust
        }
      })
    }
    if (forceMeasureWidth) {
      this._measurePaneWidth()
    }
    if (shouldUpdate) {
      (this._xAxisPane.getAxisComponent() as unknown as AxisImp).buildTicks(true)
      this.updatePane(UpdateLevel.All)
    }
  }

  updatePane (level: UpdateLevel, paneId?: string): void {
    if (isValid(paneId)) {
      const pane = this.getDrawPaneById(paneId)
      pane?.update(level)
    } else {
      this._drawPanes.forEach(pane => {
        pane.update(level)
        this._separatorPanes.get(pane)?.update(level)
      })
    }
  }

  crosshairChange (crosshair: Crosshair): void {
    if (this._chartStore.hasAction(ActionType.OnCrosshairChange)) {
      const indicatorData = {}
      this._drawPanes.forEach(pane => {
        const id = pane.getId()
        const paneIndicatorData = {}
        const indicators = this._chartStore.getIndicatorsByPaneId(id)
        indicators.forEach(indicator => {
          const result = indicator.result
          paneIndicatorData[indicator.name] = result[crosshair.dataIndex ?? result.length - 1]
        })
        indicatorData[id] = paneIndicatorData
      })
      if (isString(crosshair.paneId)) {
        this._chartStore.executeAction(ActionType.OnCrosshairChange, {
          ...crosshair,
          indicatorData
        })
      }
    }
  }

  getDom (paneId?: string, position?: DomPosition): Nullable<HTMLElement> {
    if (isString(paneId)) {
      const pane = this.getDrawPaneById(paneId)
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
    if (isValid(paneId)) {
      const pane = this.getDrawPaneById(paneId)
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
      return this._chartBounding
    }
    return null
  }

  setPriceVolumePrecision (pricePrecision: number, volumePrecision: number): void {
    this._chartStore.setPrecision({ price: pricePrecision, volume: volumePrecision })
  }

  getPriceVolumePrecision (): Precision {
    return this._chartStore.getPrecision()
  }

  setOptions (options: Options): void {
    this._chartStore.setOptions(options)
    const axis = (this._xAxisPane.getAxisComponent() as unknown as AxisImp)
    axis.buildTicks(true)
    this.adjustPaneViewport(true, true, true, true, true)
  }

  getOptions (): Required<Omit<Options, 'layout'>> & { customApi: CustomApi, styles: Styles } {
    return this._chartStore.getOptions()
  }

  setOffsetRightDistance (distance: number): void {
    this._chartStore.setOffsetRightDistance(distance, true)
  }

  getOffsetRightDistance (): number {
    return this._chartStore.getOffsetRightDistance()
  }

  setMaxOffsetLeftDistance (distance: number): void {
    if (distance < 0) {
      logWarn('setMaxOffsetLeftDistance', 'distance', 'distance must greater than zero!!!')
      return
    }
    this._chartStore.setMaxOffsetLeftDistance(distance)
  }

  setMaxOffsetRightDistance (distance: number): void {
    if (distance < 0) {
      logWarn('setMaxOffsetRightDistance', 'distance', 'distance must greater than zero!!!')
      return
    }
    this._chartStore.setMaxOffsetRightDistance(distance)
  }

  setLeftMinVisibleBarCount (barCount: number): void {
    if (barCount < 0) {
      logWarn('setLeftMinVisibleBarCount', 'barCount', 'barCount must greater than zero!!!')
      return
    }
    this._chartStore.setLeftMinVisibleBarCount(Math.ceil(barCount))
  }

  setRightMinVisibleBarCount (barCount: number): void {
    if (barCount < 0) {
      logWarn('setRightMinVisibleBarCount', 'barCount', 'barCount must greater than zero!!!')
      return
    }
    this._chartStore.setRightMinVisibleBarCount(Math.ceil(barCount))
  }

  setBarSpace (space: number): void {
    this._chartStore.setBarSpace(space)
  }

  getBarSpace (): number {
    return this._chartStore.getBarSpace().bar
  }

  getVisibleRange (): VisibleRange {
    return this._chartStore.getVisibleRange()
  }

  clearData (): void {
    this._chartStore.clear()
  }

  getDataList (): KLineData[] {
    return this._chartStore.getDataList()
  }

  applyNewData (data: KLineData[], more?: boolean | Partial<LoadDataMore>): void {
    this._drawPanes.forEach(pane => {
      (pane.getAxisComponent() as AxisImp).setAutoCalcTickFlag(true)
    })
    let loadDataMore = { forward: false, backward: false }
    if (isBoolean(more)) {
      loadDataMore.forward = more
      loadDataMore.backward = more
    } else {
      loadDataMore = { ...loadDataMore, ...more }
    }
    this._chartStore.addData(data, LoadDataType.Init, loadDataMore)
  }

  updateData (data: KLineData): void {
    this._chartStore.addData(data, LoadDataType.Update)
  }

  setLoadMoreDataCallback (cb: LoadDataCallback): void {
    this._chartStore.setLoadMoreDataCallback(cb)
  }

  createIndicator (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: Nullable<PaneOptions>): Nullable<string> {
    const indicator = isString(value) ? { name: value } : value
    if (getIndicatorClass(indicator.name) === null) {
      logWarn('createIndicator', 'value', 'indicator not supported, you may need to use registerIndicator to add one!!!')
      return null
    }

    let paneId = paneOptions?.id
    const currentPane = this.getDrawPaneById(paneId ?? '')
    if (currentPane !== null) {
      const result = this._chartStore.addIndicator(indicator, paneId ?? '', isStack ?? false)
      if (result) {
        this._setPaneOptions(paneOptions ?? {}, (currentPane.getAxisComponent() as AxisImp).buildTicks(true))
      }
    } else {
      paneId ??= createId(PaneIdConstants.INDICATOR)
      const pane = this._createPane(IndicatorPane, paneId, paneOptions ?? {})
      const height = paneOptions?.height ?? PANE_DEFAULT_HEIGHT
      pane.setOriginalBounding({ height })
      const result = this._chartStore.addIndicator(indicator, paneId, isStack ?? false)
      if (result) {
        this.adjustPaneViewport(true, true, true, true, true)
      }
    }
    return paneId ?? null
  }

  overrideIndicator (override: IndicatorCreate): void {
    const result = this._chartStore.overrideIndicator(override)
    if (result) {
      this.adjustPaneViewport(false, false, true)
    }
  }

  getIndicators (filter?: IndicatorFilter): Map<string, Indicator[]> {
    return this._chartStore.getIndicatorsByFilter(filter ?? {})
  }

  removeIndicator (filter?: IndicatorFilter): void {
    const removed = this._chartStore.removeIndicator(filter ?? {})
    if (removed) {
      let shouldMeasureHeight = false
      const paneIds: string[] = []
      this._drawPanes.forEach(pane => {
        const paneId = pane.getId()
        if (paneId !== PaneIdConstants.CANDLE && paneId !== PaneIdConstants.X_AXIS) {
          paneIds.push(paneId)
        }
      })

      paneIds.forEach(paneId => {
        if (!this._chartStore.hasIndicators(paneId)) {
          const index = this._drawPanes.findIndex(pane => pane.getId() === paneId)
          const pane = this._drawPanes[index]
          if (isValid(pane)) {
            shouldMeasureHeight = true
            const separatorPane = this._separatorPanes.get(pane)
            if (isValid(separatorPane)) {
              const topPane = separatorPane.getTopPane()
              for (const item of this._separatorPanes) {
                if (item[1].getTopPane().getId() === paneId) {
                  item[1].setTopPane(topPane)
                  break
                }
              }
              separatorPane.destroy()
              this._separatorPanes.delete(pane)
            }
            this._drawPanes.splice(index, 1)
            pane.destroy()

            let firstPane = this._drawPanes[0]
            if (isValid(firstPane)) {
              if (firstPane.getId() === PaneIdConstants.X_AXIS) {
                firstPane = this._drawPanes[1]
              }
            }
            this._separatorPanes.get(firstPane)?.destroy()
            this._separatorPanes.delete(firstPane)
          }
        }
      })
      this.adjustPaneViewport(shouldMeasureHeight, true, true, true, true)
    }
  }

  createOverlay (value: string | OverlayCreate | Array<string | OverlayCreate>): Nullable<string> | Array<Nullable<string>> {
    const overlays: OverlayCreate[] = []
    const appointPaneFlags: boolean[] = []

    const build: ((overlay: OverlayCreate) => void) = overlay => {
      if (!isValid(overlay.paneId) || this.getDrawPaneById(overlay.paneId) === null) {
        overlay.paneId = PaneIdConstants.CANDLE
        appointPaneFlags.push(false)
      } else {
        appointPaneFlags.push(true)
      }
      overlays.push(overlay)
    }

    if (isString(value)) {
      build({ name: value })
    } else if (isArray<Array<string | OverlayCreate>>(value)) {
      (value as Array<string | OverlayCreate>).forEach(v => {
        let overlay: Nullable<OverlayCreate> = null
        if (isString(v)) {
          overlay = { name: v }
        } else {
          overlay = v
        }
        build(overlay)
      })
    } else {
      build(value as OverlayCreate)
    }
    const ids = this._chartStore.addOverlays(overlays, appointPaneFlags)
    if (isArray(value)) {
      return ids
    }
    return ids[0]
  }

  getOverlays (filter?: OverlayFilter): Map<string, Overlay[]> {
    return this._chartStore.getOverlaysByFilter(filter ?? {})
  }

  overrideOverlay (override: Partial<OverlayCreate>): void {
    this._chartStore.overrideOverlay(override)
  }

  removeOverlay (filter?: OverlayFilter): void {
    this._chartStore.removeOverlay(filter ?? {})
  }

  setPaneOptions (options: PaneOptions): void {
    this._setPaneOptions(options, false)
  }

  setZoomEnabled (enabled: boolean): void {
    this._chartStore.setZoomEnabled(enabled)
  }

  isZoomEnabled (): boolean {
    return this._chartStore.getZoomEnabled()
  }

  setScrollEnabled (enabled: boolean): void {
    this._chartStore.setScrollEnabled(enabled)
  }

  isScrollEnabled (): boolean {
    return this._chartStore.getScrollEnabled()
  }

  scrollByDistance (distance: number, animationDuration?: number): void {
    const duration = isNumber(animationDuration) && animationDuration > 0 ? animationDuration : 0
    this._chartStore.startScroll()
    if (duration > 0) {
      const animation = new Animation({ duration })
      animation.doFrame(frameTime => {
        const progressDistance = distance * (frameTime / duration)
        this._chartStore.scroll(progressDistance)
      })
      animation.start()
    } else {
      this._chartStore.scroll(distance)
    }
  }

  scrollToRealTime (animationDuration?: number): void {
    const { bar: barSpace } = this._chartStore.getBarSpace()
    const difBarCount = this._chartStore.getLastBarRightSideDiffBarCount() - this._chartStore.getInitialOffsetRightDistance() / barSpace
    const distance = difBarCount * barSpace
    this.scrollByDistance(distance, animationDuration)
  }

  scrollToDataIndex (dataIndex: number, animationDuration?: number): void {
    const distance = (
      this._chartStore.getLastBarRightSideDiffBarCount() + (this.getDataList().length - 1 - dataIndex)
    ) * this._chartStore.getBarSpace().bar
    this.scrollByDistance(distance, animationDuration)
  }

  scrollToTimestamp (timestamp: number, animationDuration?: number): void {
    const dataIndex = binarySearchNearest(this.getDataList(), 'timestamp', timestamp)
    this.scrollToDataIndex(dataIndex, animationDuration)
  }

  zoomAtCoordinate (scale: number, coordinate?: Coordinate, animationDuration?: number): void {
    const duration = isNumber(animationDuration) && animationDuration > 0 ? animationDuration : 0
    const { bar: barSpace } = this._chartStore.getBarSpace()
    const scaleBarSpace = barSpace * scale
    const difSpace = scaleBarSpace - barSpace
    if (duration > 0) {
      let prevProgressBarSpace = 0
      const animation = new Animation({ duration })
      animation.doFrame(frameTime => {
        const progressBarSpace = difSpace * (frameTime / duration)
        const scale = (progressBarSpace - prevProgressBarSpace) / this._chartStore.getBarSpace().bar * SCALE_MULTIPLIER
        this._chartStore.zoom(scale, coordinate)
        prevProgressBarSpace = progressBarSpace
      })
      animation.start()
    } else {
      this._chartStore.zoom(difSpace / barSpace * SCALE_MULTIPLIER, coordinate)
    }
  }

  zoomAtDataIndex (scale: number, dataIndex: number, animationDuration?: number): void {
    const x = this._chartStore.dataIndexToCoordinate(dataIndex)
    this.zoomAtCoordinate(scale, { x, y: 0 }, animationDuration)
  }

  zoomAtTimestamp (scale: number, timestamp: number, animationDuration?: number): void {
    const dataIndex = binarySearchNearest(this.getDataList(), 'timestamp', timestamp)
    this.zoomAtDataIndex(scale, dataIndex, animationDuration)
  }

  convertToPixel (points: Partial<Point> | Array<Partial<Point>>, finder: ConvertFinder): Partial<Coordinate> | Array<Partial<Coordinate>> {
    const { paneId = PaneIdConstants.CANDLE, absolute = false } = finder
    let coordinates: Array<Partial<Coordinate>> = []
    if (paneId !== PaneIdConstants.X_AXIS) {
      const pane = this.getDrawPaneById(paneId)
      if (pane !== null) {
        const bounding = pane.getBounding()
        const ps = new Array<Partial<Point>>().concat(points)
        const xAxis = this._xAxisPane.getAxisComponent()
        const yAxis = pane.getAxisComponent()
        coordinates = ps.map(point => {
          const coordinate: Partial<Coordinate> = {}
          let dataIndex = point.dataIndex
          if (isNumber(point.timestamp)) {
            dataIndex = this._chartStore.timestampToDataIndex(point.timestamp)
          }
          if (isNumber(dataIndex)) {
            coordinate.x = xAxis.convertToPixel(dataIndex)
          }
          if (isNumber(point.value)) {
            const y = yAxis.convertToPixel(point.value)
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
    if (paneId !== PaneIdConstants.X_AXIS) {
      const pane = this.getDrawPaneById(paneId)
      if (pane !== null) {
        const bounding = pane.getBounding()
        const cs = new Array<Partial<Coordinate>>().concat(coordinates)
        const xAxis = this._xAxisPane.getAxisComponent()
        const yAxis = pane.getAxisComponent()
        points = cs.map(coordinate => {
          const point: Partial<Point> = {}
          if (isNumber(coordinate.x)) {
            const dataIndex = xAxis.convertFromPixel(coordinate.x)
            point.dataIndex = dataIndex
            point.timestamp = this._chartStore.dataIndexToTimestamp(dataIndex) ?? undefined
          }
          if (isNumber(coordinate.y)) {
            const y = absolute ? coordinate.y - bounding.top : coordinate.y
            point.value = yAxis.convertFromPixel(y)
          }
          return point
        })
      }
    }
    return isArray(coordinates) ? points : (points[0] ?? {})
  }

  executeAction (type: ActionType, data: Crosshair): void {
    switch (type) {
      case ActionType.OnCrosshairChange: {
        const crosshair: Crosshair = { ...data }
        crosshair.paneId = crosshair.paneId ?? PaneIdConstants.CANDLE
        this._chartStore.setCrosshair(crosshair)
        break
      }
    }
  }

  subscribeAction (type: ActionType, callback: ActionCallback): void {
    this._chartStore.subscribeAction(type, callback)
  }

  unsubscribeAction (type: ActionType, callback?: ActionCallback): void {
    this._chartStore.unsubscribeAction(type, callback)
  }

  getConvertPictureUrl (includeOverlay?: boolean, type?: string, backgroundColor?: string): string {
    const { width, height } = this._chartBounding
    const canvas = createDom('canvas', {
      width: `${width}px`,
      height: `${height}px`,
      boxSizing: 'border-box'
    })
    const ctx = canvas.getContext('2d')!
    const pixelRatio = getPixelRatio(canvas)
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)

    ctx.fillStyle = backgroundColor ?? '#FFFFFF'
    ctx.fillRect(0, 0, width, height)
    const overlayFlag = includeOverlay ?? false
    this._drawPanes.forEach(pane => {
      const separatorPane = this._separatorPanes.get(pane)
      if (isValid(separatorPane)) {
        const separatorBounding = separatorPane.getBounding()
        ctx.drawImage(
          separatorPane.getImage(overlayFlag),
          separatorBounding.left, separatorBounding.top, separatorBounding.width, separatorBounding.height
        )
      }

      const bounding = pane.getBounding()
      ctx.drawImage(
        pane.getImage(overlayFlag),
        0, bounding.top, width, bounding.height
      )
    })
    return canvas.toDataURL(`image/${type ?? 'jpeg'}`)
  }

  resize (): void {
    this._cacheChartBounding()
    this.adjustPaneViewport(true, true, true, true, true)
  }

  destroy (): void {
    this._chartEvent.destroy()
    this._drawPanes.forEach(pane => {
      pane.destroy()
      this._separatorPanes.get(pane)?.destroy()
    })
    this._drawPanes = []
    this._separatorPanes.clear()
    this._container.removeChild(this._chartContainer)
  }
}

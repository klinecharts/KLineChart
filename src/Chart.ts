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
import type DeepPartial from './common/DeepPartial'
import type PickPartial from './common/PickPartial'
import type Bounding from './common/Bounding'
import { createDefaultBounding } from './common/Bounding'
import type { KLineData } from './common/Data'
import type Coordinate from './common/Coordinate'
import type Point from './common/Point'
import { UpdateLevel } from './common/Updater'
import type Crosshair from './common/Crosshair'
import type { ActionType, ActionCallback } from './common/Action'
import type { DataLoader } from './common/DataLoader'
import type VisibleRange from './common/VisibleRange'
import type { Formatter, DecimalFold, LayoutChild, Options, ThousandsSeparator } from './Options'
import Animation from './common/Animation'
import { createId } from './common/utils/id'
import { createDom } from './common/utils/dom'
import { getPixelRatio } from './common/utils/canvas'
import { isString, isArray, isValid, merge, isNumber } from './common/utils/typeChecks'
import { logWarn } from './common/utils/logger'
import { binarySearchNearest } from './common/utils/number'
import type { Styles } from './common/Styles'
import type BarSpace from './common/BarSpace'
import type PickRequired from './common/PickRequired'
import type { SymbolInfo } from './common/SymbolInfo'
import type { Period } from './common/Period'

import ChartStore, { SCALE_MULTIPLIER, type Store } from './Store'

import CandlePane from './pane/CandlePane'
import IndicatorPane from './pane/IndicatorPane'
import XAxisPane from './pane/XAxisPane'
import type DrawPane from './pane/DrawPane'
import SeparatorPane from './pane/SeparatorPane'

import { type PaneOptions, PANE_DEFAULT_HEIGHT, PaneIdConstants, PANE_MIN_HEIGHT } from './pane/types'

import type AxisImp from './component/Axis'
import type { YAxis } from './component/YAxis'

import type { IndicatorFilter, Indicator, IndicatorCreate, IndicatorOverride } from './component/Indicator'
import type { OverlayFilter, Overlay, OverlayCreate, OverlayOverride } from './component/Overlay'

import { getIndicatorClass } from './extension/indicator/index'

import Event from './Event'

export type DomPosition = 'root' | 'main' | 'yAxis'

export interface ConvertFilter {
  paneId?: string
  absolute?: boolean
}

export interface DomFilter {
  paneId: string
  position?: DomPosition
}

export interface Chart extends Store {
  id: string
  getDom: (paneId?: string, position?: DomPosition) => Nullable<HTMLElement>
  getSize: (paneId?: string, position?: DomPosition) => Nullable<Bounding>
  createIndicator: (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: PaneOptions) => Nullable<string>
  getIndicators: (filter?: IndicatorFilter) => Indicator[]
  createOverlay: (value: string | OverlayCreate | Array<string | OverlayCreate>) => Nullable<string> | Array<Nullable<string>>
  getOverlays: (filter?: OverlayFilter) => Overlay[]
  setPaneOptions: (options: PaneOptions) => void
  getPaneOptions: (id?: string) => Nullable<PaneOptions> | PaneOptions[]
  scrollByDistance: (distance: number, animationDuration?: number) => void
  scrollToRealTime: (animationDuration?: number) => void
  scrollToDataIndex: (dataIndex: number, animationDuration?: number) => void
  scrollToTimestamp: (timestamp: number, animationDuration?: number) => void
  zoomAtCoordinate: (scale: number, coordinate?: Coordinate, animationDuration?: number) => void
  zoomAtDataIndex: (scale: number, dataIndex: number, animationDuration?: number) => void
  zoomAtTimestamp: (scale: number, timestamp: number, animationDuration?: number) => void
  convertToPixel: (points: Partial<Point> | Array<Partial<Point>>, filter?: ConvertFilter) => Partial<Coordinate> | Array<Partial<Coordinate>>
  convertFromPixel: (coordinates: Array<Partial<Coordinate>>, filter?: ConvertFilter) => Partial<Point> | Array<Partial<Point>>
  executeAction: (type: ActionType, data: Crosshair) => void
  subscribeAction: (type: ActionType, callback: ActionCallback) => void
  unsubscribeAction: (type: ActionType, callback?: ActionCallback) => void
  getConvertPictureUrl: (includeOverlay?: boolean, type?: 'png' | 'jpeg' | 'bmp', backgroundColor?: string) => string
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
  private _candlePane: CandlePane
  private _xAxisPane: XAxisPane
  private readonly _separatorPanes = new Map<DrawPane, SeparatorPane>()

  private _layoutOptions = {
    sort: true,
    measureHeight: true,
    measureWidth: true,
    update: true,
    buildYAxisTick: false,
    cacheYAxisWidth: false,
    forceBuildYAxisTick: false
  }

  private _layoutPending = false

  private readonly _cacheYAxisWidth = { left: 0, right: 0 }

  constructor (container: HTMLElement, options?: Options) {
    this._initContainer(container)
    this._chartEvent = new Event(this._chartContainer, this)
    this._chartStore = new ChartStore(this, options)
    this._initPanes(options)
    this._layout()
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
      // @ts-expect-error
      msUserSelect: 'none',
      MozUserSelect: 'none',
      webkitTapHighlightColor: 'transparent'
    })
    this._chartContainer.tabIndex = 1
    container.appendChild(this._chartContainer)
    this._cacheChartBounding()
  }

  private _cacheChartBounding (): void {
    this._chartBounding.width = Math.floor(this._chartContainer.clientWidth)
    this._chartBounding.height = Math.floor(this._chartContainer.clientHeight)
  }

  private _initPanes (options?: Options): void {
    const layout = options?.layout ?? [{ type: 'candle' }]

    const createCandlePane: ((child: LayoutChild) => void) = child => {
      if (!isValid(this._candlePane)) {
        const paneOptions = child.options ?? {}
        merge(paneOptions, { id: PaneIdConstants.CANDLE })
        this._candlePane = this._createPane<CandlePane>(CandlePane, PaneIdConstants.CANDLE, paneOptions)
        const content = child.content ?? []
        content.forEach(v => {
          this.createIndicator(v, true, paneOptions)
        })
      }
    }

    const createXAxisPane: ((ops?: PaneOptions) => void) = (ops?: PaneOptions) => {
      if (!isValid(this._xAxisPane)) {
        const pane = this._createPane<XAxisPane>(XAxisPane, PaneIdConstants.X_AXIS, ops ?? {})
        this._xAxisPane = pane
      }
    }

    layout.forEach(child => {
      switch (child.type) {
        case 'candle': {
          createCandlePane(child)
          break
        }
        case 'indicator': {
          const content = child.content ?? []
          if (content.length > 0) {
            let paneId: Nullable<string> = child.options?.id ?? null
            if (isValid(paneId)) {
              paneId = createId(PaneIdConstants.INDICATOR)
            }
            const paneOptions = { ...child.options, id: paneId! }
            content.forEach(v => {
              this.createIndicator(v, true, paneOptions)
            })
          }
          break
        }
        case 'xAxis': {
          createXAxisPane(child.options)
          break
        }
      }
    })
    createCandlePane({ type: 'candle' })
    createXAxisPane({ order: Number.MAX_SAFE_INTEGER })
  }

  private _createPane<P extends DrawPane> (
    DrawPaneClass: new (chart: Chart, id: string, options: Omit<PaneOptions, 'id' | 'height'>) => P,
    id: string,
    options?: PaneOptions
  ): P {
    const pane = new DrawPaneClass(this, id, options ?? {})
    this._drawPanes.push(pane)
    return pane
  }

  private _recalculatePaneHeight (currentPane: DrawPane, currentHeight: number, changeHeight: number): boolean {
    if (changeHeight === 0) {
      return false
    }
    const normalStatePanes = this._drawPanes.filter(pane => {
      const paneId = pane.getId()
      return (
        pane.getOptions().state === 'normal' &&
        paneId !== currentPane.getId() &&
        paneId !== PaneIdConstants.X_AXIS
      )
    })

    const count = normalStatePanes.length
    if (count === 0) {
      return false
    }
    if (
      currentPane.getId() !== PaneIdConstants.CANDLE &&
      isValid(this._candlePane) &&
      this._candlePane.getOptions().state === 'normal'
    ) {
      const height = this._candlePane.getBounding().height
      if (height > 0) {
        const minHeight = this._candlePane.getOptions().minHeight
        let newHeight = height + changeHeight
        if (newHeight < minHeight) {
          newHeight = minHeight
          currentHeight -= (height + changeHeight - newHeight)
        }
        this._candlePane.setBounding({ height: newHeight })
      }
    } else {
      let remainingHeight = changeHeight
      const normalStatePaneChangeHeight = Math.floor(changeHeight / count)
      normalStatePanes.forEach((pane, index) => {
        const height = pane.getBounding().height
        let newHeight = 0
        if (index === count - 1) {
          newHeight = height + remainingHeight
        } else {
          newHeight = height + normalStatePaneChangeHeight
        }
        if (newHeight < pane.getOptions().minHeight) {
          newHeight = pane.getOptions().minHeight
        }
        pane.setBounding({ height: newHeight })
        remainingHeight -= (newHeight - height)
      })
      if (Math.abs(remainingHeight) > 0) {
        currentHeight -= remainingHeight
      }
    }
    currentPane.setBounding({ height: currentHeight })
    return true
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

  layout (options: {
    sort?: boolean
    measureHeight?: boolean
    measureWidth?: boolean
    update?: boolean
    buildYAxisTick?: boolean
    cacheYAxisWidth?: boolean
    forceBuildYAxisTick?: boolean
  }): void {
    if (options.sort ?? false) {
      this._layoutOptions.sort = options.sort!
    }
    if (options.measureHeight ?? false) {
      this._layoutOptions.measureHeight = options.measureHeight!
    }
    if (options.measureWidth ?? false) {
      this._layoutOptions.measureWidth = options.measureWidth!
    }
    if (options.update ?? false) {
      this._layoutOptions.update = options.update!
    }
    if (options.buildYAxisTick ?? false) {
      this._layoutOptions.buildYAxisTick = options.buildYAxisTick!
    }
    if (options.cacheYAxisWidth ?? false) {
      this._layoutOptions.cacheYAxisWidth = options.cacheYAxisWidth!
    }
    if (options.buildYAxisTick ?? false) {
      this._layoutOptions.forceBuildYAxisTick = options.forceBuildYAxisTick!
    }
    if (!this._layoutPending) {
      this._layoutPending = true
      Promise.resolve().then(_ => {
        this._layout()
        this._layoutPending = false
      }).catch((_: unknown) => {
        // todo
      })
    }
  }

  private _layout (): void {
    const { sort, measureHeight, measureWidth, update, buildYAxisTick, cacheYAxisWidth, forceBuildYAxisTick } = this._layoutOptions
    if (sort) {
      while (isValid(this._chartContainer.firstChild)) {
        this._chartContainer.removeChild(this._chartContainer.firstChild)
      }
      this._separatorPanes.clear()
      this._drawPanes.sort((a, b) => a.getOptions().order - b.getOptions().order)
      let prevPane: Nullable<DrawPane> = null
      this._drawPanes.forEach(pane => {
        if (pane.getId() !== PaneIdConstants.X_AXIS) {
          if (isValid(prevPane)) {
            const separatorPane = new SeparatorPane(this, '', prevPane, pane)
            this._chartContainer.appendChild(separatorPane.getContainer())
            this._separatorPanes.set(pane, separatorPane)
          }
          prevPane = pane
        }
        this._chartContainer.appendChild(pane.getContainer())
      })
    }
    if (measureHeight) {
      const totalHeight = this._chartBounding.height
      const separatorSize = this.getStyles().separator.size
      const xAxisHeight = this._xAxisPane.getAxisComponent().getAutoSize()
      let remainingHeight = totalHeight - xAxisHeight
      if (remainingHeight < 0) {
        remainingHeight = 0
      }
      this._drawPanes.forEach(pane => {
        const paneId = pane.getId()
        if (isValid(this._separatorPanes.get(pane))) {
          remainingHeight -= separatorSize
        }
        if (paneId !== PaneIdConstants.X_AXIS && paneId !== PaneIdConstants.CANDLE && pane.getVisible()) {
          let paneHeight = pane.getBounding().height
          if (paneHeight > remainingHeight) {
            paneHeight = remainingHeight
            remainingHeight = 0
          } else {
            remainingHeight -= paneHeight
          }
          pane.setBounding({ height: paneHeight })
        }
      })

      this._candlePane.setBounding({ height: Math.max(remainingHeight, 0) })
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
    let forceMeasureWidth = measureWidth
    if (buildYAxisTick || forceBuildYAxisTick) {
      this._drawPanes.forEach(pane => {
        const success = (pane.getAxisComponent() as AxisImp).buildTicks(forceBuildYAxisTick)
        forceMeasureWidth ||= success
      })
    }
    if (forceMeasureWidth) {
      const totalWidth = this._chartBounding.width
      const styles = this.getStyles()

      let leftYAxisWidth = 0
      let leftYAxisOutside = true
      let rightYAxisWidth = 0
      let rightYAxisOutside = true

      this._drawPanes.forEach(pane => {
        if (pane.getId() !== PaneIdConstants.X_AXIS) {
          const yAxis = pane.getAxisComponent() as YAxis
          const inside = yAxis.inside
          const yAxisWidth = yAxis.getAutoSize()
          if (yAxis.position === 'left') {
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

      if (cacheYAxisWidth) {
        leftYAxisWidth = Math.max(this._cacheYAxisWidth.left, leftYAxisWidth)
        rightYAxisWidth = Math.max(this._cacheYAxisWidth.right, rightYAxisWidth)
      }

      this._cacheYAxisWidth.left = leftYAxisWidth
      this._cacheYAxisWidth.right = rightYAxisWidth

      let mainWidth = totalWidth
      let mainLeft = 0
      let mainRight = 0
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
      if (leftYAxisOutside) {
        mainWidth -= leftYAxisWidth
        mainLeft = leftYAxisWidth
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
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
    if (update) {
      (this._xAxisPane.getAxisComponent() as unknown as AxisImp).buildTicks(true)
      this.updatePane(UpdateLevel.All)
    }
    this._layoutOptions = {
      sort: false,
      measureHeight: false,
      measureWidth: false,
      update: false,
      buildYAxisTick: false,
      cacheYAxisWidth: false,
      forceBuildYAxisTick: false
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

  getDom (paneId?: string, position?: DomPosition): Nullable<HTMLElement> {
    if (isValid(paneId)) {
      const pane = this.getDrawPaneById(paneId)
      if (isValid(pane)) {
        const pos = position ?? 'root'
        switch (pos) {
          case 'root': {
            return pane.getContainer()
          }
          case 'main': {
            return pane.getMainWidget().getContainer()
          }
          case 'yAxis': {
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
      if (isValid(pane)) {
        const pos = position ?? 'root'
        switch (pos) {
          case 'root': {
            return pane.getBounding()
          }
          case 'main': {
            return pane.getMainWidget().getBounding()
          }
          case 'yAxis': {
            return pane.getYAxisWidget()?.getBounding() ?? null
          }
        }
      }
    } else {
      return this._chartBounding
    }
    return null
  }

  private _resetYAxisAutoCalcTickFlag (): void {
    this._drawPanes.forEach(pane => {
      (pane.getAxisComponent() as AxisImp).setAutoCalcTickFlag(true)
    })
  }

  setSymbol (symbol: PickPartial<SymbolInfo, 'pricePrecision' | 'volumePrecision'>): void {
    if (symbol !== this.getSymbol()) {
      this._resetYAxisAutoCalcTickFlag()
      this._chartStore.setSymbol(symbol)
    }
  }

  getSymbol (): Nullable<SymbolInfo> {
    return this._chartStore.getSymbol()
  }

  setPeriod (period: Period): void {
    if (period !== this.getPeriod()) {
      this._resetYAxisAutoCalcTickFlag()
      this._chartStore.setPeriod(period)
    }
  }

  getPeriod (): Nullable<Period> {
    return this._chartStore.getPeriod()
  }

  setStyles (value: string | DeepPartial<Styles>): void {
    this._setOptions(() => {
      this._chartStore.setStyles(value)
    })
  }

  getStyles (): Styles { return this._chartStore.getStyles() }

  setFormatter (formatter: Partial<Formatter>): void {
    this._setOptions(() => {
      this._chartStore.setFormatter(formatter)
    })
  }

  getFormatter (): Formatter { return this._chartStore.getFormatter() }

  setLocale (locale: string): void {
    this._setOptions(() => {
      this._chartStore.setLocale(locale)
    })
  }

  getLocale (): string { return this._chartStore.getLocale() }

  setTimezone (timezone: string): void {
    this._setOptions(() => {
      this._chartStore.setTimezone(timezone)
    })
  }

  getTimezone (): string { return this._chartStore.getTimezone() }

  setThousandsSeparator (thousandsSeparator: Partial<ThousandsSeparator>): void {
    this._setOptions(() => {
      this._chartStore.setThousandsSeparator(thousandsSeparator)
    })
  }

  getThousandsSeparator (): ThousandsSeparator { return this._chartStore.getThousandsSeparator() }

  setDecimalFold (decimalFold: Partial<DecimalFold>): void {
    this._setOptions(() => {
      this._chartStore.setDecimalFold(decimalFold)
    })
  }

  getDecimalFold (): DecimalFold { return this._chartStore.getDecimalFold() }

  private _setOptions (fuc: () => void): void {
    fuc()
    this.layout({
      measureHeight: true,
      measureWidth: true,
      update: true,
      buildYAxisTick: true,
      forceBuildYAxisTick: true
    })
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

  getBarSpace (): BarSpace {
    return this._chartStore.getBarSpace()
  }

  getVisibleRange (): VisibleRange {
    return this._chartStore.getVisibleRange()
  }

  resetData (): void {
    this._chartStore.resetData()
  }

  getDataList (): KLineData[] {
    return this._chartStore.getDataList()
  }

  setDataLoader (dataLoader: DataLoader): void {
    this._resetYAxisAutoCalcTickFlag()
    this._chartStore.setDataLoader(dataLoader)
  }

  createIndicator (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: PaneOptions): Nullable<string> {
    const indicator = isString(value) ? { name: value } : value
    if (getIndicatorClass(indicator.name) === null) {
      logWarn('createIndicator', 'value', 'indicator not supported, you may need to use registerIndicator to add one!!!')
      return null
    }

    const paneOpts = paneOptions ?? {}

    if (!isString(paneOpts.id)) {
      paneOpts.id = createId(PaneIdConstants.INDICATOR)
    }
    if (!isString(indicator.id)) {
      indicator.id = createId(indicator.name)
    }
    const result = this._chartStore.addIndicator(indicator as PickRequired<IndicatorCreate, 'id' | 'name'>, paneOpts.id, isStack ?? false)
    if (result) {
      let shouldSort = false
      if (!isValid(this.getDrawPaneById(paneOpts.id))) {
        this._createPane(IndicatorPane, paneOpts.id, paneOpts)
        paneOpts.height ??= PANE_DEFAULT_HEIGHT
        shouldSort = true
      }
      this.setPaneOptions(paneOpts)
      this.layout({
        sort: shouldSort,
        measureHeight: true,
        measureWidth: true,
        update: true,
        buildYAxisTick: true,
        forceBuildYAxisTick: true
      })
      return indicator.id
    }
    return null
  }

  overrideIndicator (override: IndicatorOverride): boolean {
    return this._chartStore.overrideIndicator(override)
  }

  getIndicators (filter?: IndicatorFilter): Indicator[] {
    return this._chartStore.getIndicatorsByFilter(filter ?? {})
  }

  removeIndicator (filter?: IndicatorFilter): boolean {
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
            this._recalculatePaneHeight(pane, 0, pane.getBounding().height)
            this._drawPanes.splice(index, 1)
            pane.destroy()
          }
        }
      })
      if (this._drawPanes.length === 2) {
        this._candlePane.setVisible(true)
        this._candlePane.setBounding({ height: this._chartBounding.height - this._xAxisPane.getBounding().height })
      }
      this.layout({
        sort: shouldMeasureHeight,
        measureHeight: shouldMeasureHeight,
        measureWidth: true,
        update: true,
        buildYAxisTick: true,
        forceBuildYAxisTick: true
      })
    }
    return removed
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

  getOverlays (filter?: OverlayFilter): Overlay[] {
    return this._chartStore.getOverlaysByFilter(filter ?? {})
  }

  overrideOverlay (override: OverlayOverride): boolean {
    return this._chartStore.overrideOverlay(override)
  }

  removeOverlay (filter?: OverlayFilter): boolean {
    return this._chartStore.removeOverlay(filter ?? {})
  }

  setPaneOptions (options: PaneOptions): void {
    let shouldMeasureHeight = false
    let shouldLayout = false
    const validId = isValid(options.id)
    for (const currentPane of this._drawPanes) {
      const currentPaneId = currentPane.getId()
      if ((validId && options.id === currentPaneId) || !validId) {
        if (currentPaneId !== PaneIdConstants.X_AXIS) {
          if (isNumber(options.height) && options.height > 0) {
            const minHeight = Math.max(options.minHeight ?? currentPane.getOptions().minHeight, 0)
            const height = Math.max(minHeight, options.height)
            shouldLayout = true
            shouldMeasureHeight = true
            currentPane.setOriginalBounding({ height })
            this._recalculatePaneHeight(currentPane, height, -height)
          }
          if (
            isValid(options.state) &&
            currentPane.getOptions().state !== options.state
          ) {
            shouldMeasureHeight = true
            shouldLayout = true
            const state = options.state
            switch (state) {
              case 'maximize': {
                const maximizePane = this._drawPanes.find(pane => {
                  const paneId = pane.getId()
                  return pane.getOptions().state === 'maximize' && paneId !== PaneIdConstants.X_AXIS
                })
                if (!isValid(maximizePane)) {
                  if (currentPane.getOptions().state === 'normal') {
                    currentPane.setOriginalBounding({ height: currentPane.getBounding().height })
                  }
                  currentPane.setOptions({ state })
                  const totalHeight = this._chartBounding.height
                  currentPane.setBounding({ height: totalHeight - this._xAxisPane.getBounding().height })
                  this._drawPanes.forEach(pane => {
                    if (pane.getId() !== PaneIdConstants.X_AXIS && pane.getId() !== currentPaneId) {
                      pane.setBounding({ height: pane.getOriginalBounding().height })
                      pane.setVisible(false)
                      this._separatorPanes.get(pane)?.setVisible(false)
                    }
                  })
                }
                break
              }
              case 'minimize': {
                const height = currentPane.getBounding().height
                const currentState = currentPane.getOptions().state
                let changeHeight = height - PANE_MIN_HEIGHT
                if (currentState === 'maximize') {
                  changeHeight = currentPane.getOriginalBounding().height - PANE_MIN_HEIGHT
                }
                if (
                  this._recalculatePaneHeight(
                    currentPane,
                    PANE_MIN_HEIGHT,
                    changeHeight
                  )
                ) {
                  if (currentState === 'normal') {
                    currentPane.setOriginalBounding({ height })
                  }
                  currentPane.setOptions({ state })
                }
                this._drawPanes.forEach(pane => {
                  if (pane.getId() !== PaneIdConstants.X_AXIS) {
                    pane.setVisible(true)
                    this._separatorPanes.get(pane)?.setVisible(true)
                  }
                })
                break
              }
              default: {
                const height = currentPane.getOriginalBounding().height
                if (
                  this._recalculatePaneHeight(
                    currentPane,
                    height,
                    currentPane.getBounding().height - height
                  )
                ) {
                  currentPane.setOptions({ state })
                }
                this._drawPanes.forEach(pane => {
                  if (pane.getId() !== PaneIdConstants.X_AXIS) {
                    pane.setVisible(true)
                    this._separatorPanes.get(pane)?.setVisible(true)
                  }
                })
                break
              }
            }
          }
        }
        if (isValid(options.axis)) {
          shouldLayout = true
        }
        const ops = { ...options }
        delete ops.state
        currentPane.setOptions(ops)
        if (currentPaneId === options.id) {
          break
        }
      }
    }
    if (shouldLayout) {
      this.layout({
        measureHeight: shouldMeasureHeight,
        measureWidth: true,
        update: true,
        buildYAxisTick: true,
        forceBuildYAxisTick: true
      })
    }
  }

  getPaneOptions (id?: string): Nullable<PaneOptions> | PaneOptions[] {
    if (isValid(id)) {
      const pane = this.getDrawPaneById(id)
      return pane?.getOptions() ?? null
    }
    return this._drawPanes.map(pane => pane.getOptions())
  }

  setZoomEnabled (enabled: boolean): void {
    this._chartStore.setZoomEnabled(enabled)
  }

  isZoomEnabled (): boolean {
    return this._chartStore.isZoomEnabled()
  }

  setScrollEnabled (enabled: boolean): void {
    this._chartStore.setScrollEnabled(enabled)
  }

  isScrollEnabled (): boolean {
    return this._chartStore.isScrollEnabled()
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

  convertToPixel (points: Partial<Point> | Array<Partial<Point>>, filter?: ConvertFilter): Partial<Coordinate> | Array<Partial<Coordinate>> {
    const { paneId = PaneIdConstants.CANDLE, absolute = false } = filter ?? {}
    let coordinates: Array<Partial<Coordinate>> = []
    if (paneId !== PaneIdConstants.X_AXIS) {
      const pane = this.getDrawPaneById(paneId)
      if (pane !== null) {
        const bounding = pane.getBounding()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
        // @ts-expect-error
        const ps: Array<Partial<Point>> = [].concat(points)
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

  convertFromPixel (coordinates: Array<Partial<Coordinate>>, filter?: ConvertFilter): Partial<Point> | Array<Partial<Point>> {
    const { paneId = PaneIdConstants.CANDLE, absolute = false } = filter ?? {}
    let points: Array<Partial<Point>> = []
    if (paneId !== PaneIdConstants.X_AXIS) {
      const pane = this.getDrawPaneById(paneId)
      if (pane !== null) {
        const bounding = pane.getBounding()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
        // @ts-expect-error
        const cs: Array<Partial<Coordinate>> = [].concat(coordinates)
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
      case 'onCrosshairChange': {
        const crosshair: Crosshair = { ...data }
        crosshair.paneId ??= PaneIdConstants.CANDLE
        this._chartStore.setCrosshair(crosshair, { notExecuteAction: true })
        break
      }
      default: { break }
    }
  }

  subscribeAction (type: ActionType, callback: ActionCallback): void {
    this._chartStore.subscribeAction(type, callback)
  }

  unsubscribeAction (type: ActionType, callback?: ActionCallback): void {
    this._chartStore.unsubscribeAction(type, callback)
  }

  getConvertPictureUrl (includeOverlay?: boolean, type?: 'png' | 'jpeg' | 'bmp', backgroundColor?: string): string {
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
    this.layout({
      measureHeight: true,
      measureWidth: true,
      update: true,
      buildYAxisTick: true,
      forceBuildYAxisTick: true

    })
  }

  destroy (): void {
    this._chartEvent.destroy()
    this._drawPanes.forEach(pane => {
      pane.destroy()
    })
    this._drawPanes = []
    this._separatorPanes.clear()
    this._chartStore.destroy()
    this._container.removeChild(this._chartContainer)
  }
}

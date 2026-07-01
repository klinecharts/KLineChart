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
import type { Formatter, DecimalFold, Options, ThousandsSeparator, ZoomAnchor, ZoomAnchorType, Layout, LayoutBasicParams, LayoutPaneContentChild, LayoutPaneContentChildMultipleParams, Hotkey } from './Options'
import Animation from './common/Animation'
import { createId } from './common/utils/id'
import { createDom } from './common/utils/dom'
import { getPixelRatio } from './common/utils/canvas'
import { isString, isArray, isValid, isNumber } from './common/utils/typeChecks'
import { requestAnimationFrame, cancelAnimationFrame, DEFAULT_REQUEST_ID } from './common/utils/compatible'
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

import { type PaneOptions, PANE_MIN_HEIGHT, PaneIdConstants } from './pane/types'

import type AxisImp from './component/Axis'
import type { YAxis, YAxisOverride } from './component/YAxis'

import type { IndicatorFilter, Indicator, IndicatorCreate, IndicatorOverride } from './component/Indicator'
import type { OverlayFilter, Overlay, OverlayCreate, OverlayOverride } from './component/Overlay'
import type ExcludePickPartial from './common/ExcludePickPartial'
import { DEFAULT_AXIS_ID } from './component/Axis'

import { getIndicatorClass } from './extension/indicator/index'

import Event from './Event'
import type { XAxisOverride } from './component/XAxis'

export interface CreateIndicatorOptions {
  isStack?: boolean
  pane?: PaneOptions
  yAxis?: YAxisOverride
}

export type DomPosition = 'root' | 'main' | 'yAxis'

export interface ConvertFilter {
  paneId?: string
  yAxisId?: string
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
  createIndicator: (value: string | IndicatorCreate, options?: CreateIndicatorOptions) => Nullable<string>
  getIndicators: (filter?: IndicatorFilter) => Indicator[]
  createOverlay: (value: string | OverlayCreate | Array<string | OverlayCreate>) => Nullable<string> | Array<Nullable<string>>
  getOverlays: (filter?: OverlayFilter) => Overlay[]
  setPaneOptions: (options: PaneOptions) => void
  overrideYAxis: (xAxis: YAxisOverride) => void
  overrideXAxis: (yAxis: XAxisOverride) => void
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
  private readonly _candlePane: CandlePane
  private readonly _xAxisPane: XAxisPane
  private readonly _separatorPanes = new Map<DrawPane, SeparatorPane>()

  private _layoutUpdateOptions = {
    sort: true,
    measureHeight: true,
    measureWidth: true,
    secondMeasureWidth: false,
    update: true,
    buildYAxisTick: false,
    cacheYAxisWidth: false,
    forceBuildYAxisTick: false
  }

  private _layoutPending = false

  private _resizeObserver: Nullable<ResizeObserver> = null

  private _resizeRequestAnimationId = DEFAULT_REQUEST_ID

  private readonly _scheduleResize = (): void => {
    if (this._resizeRequestAnimationId === DEFAULT_REQUEST_ID) {
      this._resizeRequestAnimationId = requestAnimationFrame(() => {
        this._resizeRequestAnimationId = DEFAULT_REQUEST_ID
        if (
          this._chartBounding.width !== Math.floor(this._chartContainer.clientWidth) ||
          this._chartBounding.height !== Math.floor(this._chartContainer.clientHeight)
        ) {
          this.resize()
        }
      })
    }
  }

  private readonly _cacheYAxisWidth = { left: 0, right: 0 }

  constructor (container: HTMLElement, options?: Options) {
    this._initContainer(container)
    this._chartEvent = new Event(this._chartContainer, this)
    this._chartStore = new ChartStore(this, options)
    const defaultPaneOptions = this._getLayoutDefaultPaneOptions(this._chartStore.getLayoutBasicParams())
    const defaultYAxis = this._getLayoutDefaultYAxis(this._chartStore.getLayoutBasicParams())
    this._candlePane = this._createPane<CandlePane>(CandlePane, { ...defaultPaneOptions, id: PaneIdConstants.CANDLE })
    this._candlePane.createYAxis({ ...defaultYAxis, id: DEFAULT_AXIS_ID })
    this._xAxisPane = this._createPane<XAxisPane>(XAxisPane, { ...defaultPaneOptions, id: PaneIdConstants.X_AXIS, order: Number.MAX_SAFE_INTEGER })
    this._applyLayout(options?.layout)
    this._layout()
    this._initResizeListener()
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

  private _initResizeListener (): void {
    if (isValid(ResizeObserver)) {
      this._resizeObserver = new ResizeObserver(() => {
        this._scheduleResize()
      })
      this._resizeObserver.observe(this._chartContainer)
    } else {
      window.addEventListener('resize', this._scheduleResize)
    }
  }

  private _createPane<P extends DrawPane> (
    DrawPaneClass: new (chart: Chart, options: PickRequired<PaneOptions, 'id'>) => P,
    options: PickRequired<PaneOptions, 'id'>
  ): P {
    const pane = new DrawPaneClass(this, options)
    this._drawPanes.push(pane)
    return pane
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

  private _getLayoutDefaultPaneOptions (basicParams: LayoutBasicParams): PaneOptions {
    const options: PaneOptions = {}
    if (isNumber(basicParams.paneMinHeight)) {
      options.minHeight = basicParams.paneMinHeight
    }
    if (isNumber(basicParams.paneHeight)) {
      options.height = basicParams.paneHeight
    }
    return options
  }

  private _getLayoutDefaultYAxis (basicParams: LayoutBasicParams): YAxisOverride {
    const yAxis: YAxisOverride = {}
    if (isString(basicParams.yAxisPosition)) {
      yAxis.position = basicParams.yAxisPosition
    }
    if (isValid(basicParams.yAxisInside)) {
      yAxis.inside = basicParams.yAxisInside
    }
    return yAxis
  }

  private _createLayoutIndicator (
    paneId: string,
    content: LayoutPaneContentChild,
    paneOptions: PaneOptions,
    yAxis: YAxisOverride
  ): void {
    let indicator: string | IndicatorCreate = ''
    let contentYAxis: Nullable<Omit<YAxisOverride, 'paneId'>> = null
    if (isString(content)) {
      indicator = content
    } else if (isValid((content as LayoutPaneContentChildMultipleParams).indicator)) {
      const child = content as LayoutPaneContentChildMultipleParams
      indicator = child.indicator
      contentYAxis = child.yAxis ?? null
    } else {
      indicator = content as Omit<IndicatorCreate, 'paneId'>
    }
    this.createIndicator(
      indicator,
      {
        isStack: true,
        pane: { ...paneOptions, id: paneId },
        yAxis: { ...yAxis, ...contentYAxis }
      }
    )
  }

  private _applyLayout (layout?: Layout): void {
    if (!isValid(layout)) {
      return
    }

    const basicParams = this._chartStore.getLayoutBasicParams()

    const defaultPaneOptions = this._getLayoutDefaultPaneOptions(basicParams)
    const defaultYAxis = this._getLayoutDefaultYAxis(basicParams)

    const panes = layout.panes ?? []
    panes.forEach((pane, index) => {
      const paneOptions = { ...defaultPaneOptions, ...pane.options }
      switch (pane.type) {
        case 'candle': {
          this._candlePane.setOptions({ ...paneOptions, id: PaneIdConstants.CANDLE })
          this._candlePane.createYAxis({ ...defaultYAxis, id: DEFAULT_AXIS_ID, paneId: PaneIdConstants.CANDLE })
          pane.content?.forEach(content => {
            this._createLayoutIndicator(
              PaneIdConstants.CANDLE,
              content,
              { ...paneOptions, id: PaneIdConstants.CANDLE },
              defaultYAxis
            )
          })
          break
        }
        case 'indicator': {
          const paneId = paneOptions.id ?? createId(PaneIdConstants.INDICATOR)
          let currentPane = this.getDrawPaneById(paneId)
          if (!isValid(currentPane)) {
            currentPane = this._createPane(IndicatorPane, { ...paneOptions, id: paneId, order: paneOptions.order ?? index + 1 })
          } else {
            currentPane.setOptions({ ...paneOptions, id: paneId })
          }
          currentPane.createYAxis({ ...defaultYAxis, id: DEFAULT_AXIS_ID, paneId })
          pane.content?.forEach(content => {
            this._createLayoutIndicator(
              paneId,
              content,
              { ...paneOptions, id: paneId },
              defaultYAxis
            )
          })
          break
        }
        case 'xAxis': {
          this._xAxisPane.setOptions({ ...paneOptions, id: PaneIdConstants.X_AXIS })
          break
        }
      }
    })
  }

  layout (options: {
    sort?: boolean
    measureHeight?: boolean
    measureWidth?: boolean
    secondMeasureWidth?: boolean
    update?: boolean
    buildYAxisTick?: boolean
    cacheYAxisWidth?: boolean
    forceBuildYAxisTick?: boolean
  }): void {
    if (options.sort ?? false) {
      this._layoutUpdateOptions.sort = options.sort!
    }
    if (options.measureHeight ?? false) {
      this._layoutUpdateOptions.measureHeight = options.measureHeight!
    }
    if (options.measureWidth ?? false) {
      this._layoutUpdateOptions.measureWidth = options.measureWidth!
    }
    if (options.secondMeasureWidth ?? false) {
      this._layoutUpdateOptions.secondMeasureWidth = options.secondMeasureWidth!
    }
    if (options.update ?? false) {
      this._layoutUpdateOptions.update = options.update!
    }
    if (options.buildYAxisTick ?? false) {
      this._layoutUpdateOptions.buildYAxisTick = options.buildYAxisTick!
    }
    if (options.cacheYAxisWidth ?? false) {
      this._layoutUpdateOptions.cacheYAxisWidth = options.cacheYAxisWidth!
    }
    if (options.forceBuildYAxisTick ?? false) {
      this._layoutUpdateOptions.forceBuildYAxisTick = options.forceBuildYAxisTick!
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
    const { sort, measureHeight, measureWidth, secondMeasureWidth, update, buildYAxisTick, cacheYAxisWidth, forceBuildYAxisTick } = this._layoutUpdateOptions
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
      const xAxisHeight = this._xAxisPane.getXAxisComponent().getAutoSize()
      const contentPanes = this._drawPanes.filter(pane => pane.getId() !== PaneIdConstants.X_AXIS)
      const maximizedPane = contentPanes.find(pane => pane.getOptions().state === 'maximize')
      let remainingHeight = Math.max(totalHeight - xAxisHeight, 0)
      const paneHeights = new Map<DrawPane, number>()
      let actualSeparatorSize = separatorSize
      if (isValid(maximizedPane)) {
        actualSeparatorSize = 0
        contentPanes.forEach(pane => {
          paneHeights.set(pane, pane === maximizedPane ? remainingHeight : 0)
        })
      } else {
        remainingHeight = Math.max(remainingHeight - this._separatorPanes.size * separatorSize, 0)
        const flexiblePane =
          contentPanes.find(pane => pane.getId() === PaneIdConstants.CANDLE && pane.getOptions().state === 'normal') ??
          contentPanes.find(pane => pane.getOptions().state === 'normal')
        contentPanes.forEach(pane => {
          if (pane === flexiblePane) {
            return
          }
          const options = pane.getOptions()
          let paneHeight = PANE_MIN_HEIGHT
          if (options.state === 'normal') {
            paneHeight = Math.max(options.minHeight, options.height)
            const availableHeight = Math.max(remainingHeight, 0)
            if (paneHeight > availableHeight) {
              paneHeight = availableHeight
            }
          }
          remainingHeight -= paneHeight
          paneHeights.set(pane, paneHeight)
        })
        if (isValid(flexiblePane)) {
          paneHeights.set(flexiblePane, Math.max(remainingHeight, 0))
        }
      }
      this._drawPanes.forEach(pane => {
        if (pane.getId() !== PaneIdConstants.X_AXIS) {
          pane.setBounding({ height: paneHeights.get(pane) ?? 0 })
        }
      })

      this._xAxisPane.setBounding({ height: xAxisHeight })

      let top = 0
      this._drawPanes.forEach(pane => {
        const separatorPane = this._separatorPanes.get(pane)
        if (isValid(separatorPane)) {
          separatorPane.setBounding({ height: actualSeparatorSize, top })
          top += actualSeparatorSize
        }
        pane.setBounding({ top })
        top += pane.getBounding().height
      })
    }

    const buildYAxisTickAndMeasureWidth = (): void => {
      let forceMeasureWidth = measureWidth
      if (buildYAxisTick || forceBuildYAxisTick) {
        this._drawPanes.forEach(pane => {
          pane.getYAxisComponents().forEach(axis => {
            const success = (axis as unknown as AxisImp).buildTicks(forceBuildYAxisTick)
            forceMeasureWidth ||= success
          })
        })
      }
      if (forceMeasureWidth) {
        const totalWidth = this._chartBounding.width
        const styles = this.getStyles()

        const leftOutsideYAxisWidths: number[] = []
        const leftInsideYAxisWidths: number[] = []
        const rightInsideYAxisWidths: number[] = []
        const rightOutsideYAxisWidths: number[] = []

        const updateColumnWidth = (widths: number[], index: number, width: number): void => {
          widths[index] = Math.max(widths[index] ?? 0, width)
        }

        this._drawPanes.forEach(pane => {
          const leftOutsideAxes: YAxis[] = []
          const leftInsideAxes: YAxis[] = []
          const rightInsideAxes: YAxis[] = []
          const rightOutsideAxes: YAxis[] = []
          if (pane.getId() !== PaneIdConstants.X_AXIS) {
            pane.getWidgetYAxisComponents().forEach(axis => {
              const yAxis = axis
              if (yAxis.position === 'left') {
                if (yAxis.inside) {
                  leftInsideAxes.push(yAxis)
                } else {
                  leftOutsideAxes.push(yAxis)
                }
              } else {
                if (yAxis.inside) {
                  rightInsideAxes.push(yAxis)
                } else {
                  rightOutsideAxes.push(yAxis)
                }
              }
            })
          }

          leftOutsideAxes.forEach((yAxis, index) => { updateColumnWidth(leftOutsideYAxisWidths, index, yAxis.getAutoSize()) })
          leftInsideAxes.forEach((yAxis, index) => { updateColumnWidth(leftInsideYAxisWidths, index, yAxis.getAutoSize()) })
          rightInsideAxes.forEach((yAxis, index) => { updateColumnWidth(rightInsideYAxisWidths, index, yAxis.getAutoSize()) })
          rightOutsideAxes.forEach((yAxis, index) => { updateColumnWidth(rightOutsideYAxisWidths, index, yAxis.getAutoSize()) })
        })

        let leftYAxisWidth = leftOutsideYAxisWidths.reduce((total, width) => total + width, 0)
        let rightYAxisWidth = rightOutsideYAxisWidths.reduce((total, width) => total + width, 0)

        if (cacheYAxisWidth) {
          leftYAxisWidth = Math.max(this._cacheYAxisWidth.left, leftYAxisWidth)
          rightYAxisWidth = Math.max(this._cacheYAxisWidth.right, rightYAxisWidth)
        }

        this._cacheYAxisWidth.left = leftYAxisWidth
        this._cacheYAxisWidth.right = rightYAxisWidth

        let mainWidth = totalWidth
        let mainLeft = 0
        let mainRight = 0
        mainWidth -= leftYAxisWidth
        mainLeft = leftYAxisWidth

        mainWidth -= rightYAxisWidth
        mainRight = rightYAxisWidth

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
          const yAxisBounding: Record<string, Partial<Bounding>> = {}
          let leftOutsideOffset = 0
          let leftInsideOffset = 0
          let rightInsideOffset = 0
          let rightOutsideOffset = 0
          const leftOutsideAxes: YAxis[] = []
          const leftInsideAxes: YAxis[] = []
          const rightInsideAxes: YAxis[] = []
          const rightOutsideAxes: YAxis[] = []
          if (pane.getId() !== PaneIdConstants.X_AXIS) {
            pane.getWidgetYAxisComponents().forEach(axis => {
              const yAxis = axis
              if (yAxis.position === 'left') {
                if (yAxis.inside) {
                  leftInsideAxes.push(yAxis)
                } else {
                  leftOutsideAxes.push(yAxis)
                }
              } else {
                if (yAxis.inside) {
                  rightInsideAxes.push(yAxis)
                } else {
                  rightOutsideAxes.push(yAxis)
                }
              }
            })
          }

          const paneLeftOutsideYAxisWidth = leftOutsideAxes.reduce((total, _yAxis, index) => total + (leftOutsideYAxisWidths[index] ?? 0), 0)
          leftOutsideOffset = leftYAxisWidth - paneLeftOutsideYAxisWidth
          for (let index = leftOutsideAxes.length - 1; index >= 0; index--) {
            const yAxis = leftOutsideAxes[index]
            const width = leftOutsideYAxisWidths[index] ?? 0
            yAxisBounding[yAxis.id] = { width, left: leftOutsideOffset }
            leftOutsideOffset += width
          }
          leftInsideAxes.forEach((yAxis, index) => {
            const width = leftInsideYAxisWidths[index] ?? 0
            yAxisBounding[yAxis.id] = { width, left: mainLeft + leftInsideOffset }
            leftInsideOffset += width
          })
          rightInsideAxes.forEach((yAxis, index) => {
            const width = rightInsideYAxisWidths[index] ?? 0
            rightInsideOffset += width
            yAxisBounding[yAxis.id] = { width, left: mainLeft + mainWidth - rightInsideOffset }
          })
          rightOutsideAxes.forEach((yAxis, index) => {
            const width = rightOutsideYAxisWidths[index] ?? 0
            yAxisBounding[yAxis.id] = { width, left: mainLeft + mainWidth + rightOutsideOffset }
            rightOutsideOffset += width
          })
          pane.setYAxesBounding(yAxisBounding)
          pane.setBounding(paneBounding, mainBounding, leftYAxisBounding, rightYAxisBounding)
        })
      }
    }
    buildYAxisTickAndMeasureWidth()
    if (secondMeasureWidth) {
      buildYAxisTickAndMeasureWidth()
    }
    if (update) {
      (this._xAxisPane.getXAxisComponent() as unknown as AxisImp).buildTicks(true)
      this.updatePane(UpdateLevel.All)
    }
    this._layoutUpdateOptions = {
      sort: false,
      measureHeight: false,
      measureWidth: false,
      secondMeasureWidth: false,
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
      pane.getYAxisComponents().forEach(axis => {
        (axis as unknown as AxisImp).setAutoCalcTickFlag(true)
      })
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

  setHotkey (hotkey: Partial<Hotkey>): void {
    this._chartStore.setHotkey(hotkey)
  }

  getHotkey (): Hotkey { return this._chartStore.getHotkey() }

  getHotKey (): Hotkey { return this._chartStore.getHotKey() }

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

  private _syncIndicatorPanesByData (): boolean {
    let changed = false
    const usedPaneIds = new Set<string>([PaneIdConstants.CANDLE, PaneIdConstants.X_AXIS])
    const defaultPaneOptions = this._getLayoutDefaultPaneOptions(this._chartStore.getLayoutBasicParams())
    this._chartStore.getIndicatorsByFilter({}).forEach(indicator => {
      usedPaneIds.add(indicator.paneId)
      if (!isValid(this.getDrawPaneById(indicator.paneId))) {
        this._createPane(IndicatorPane, { ...defaultPaneOptions, id: indicator.paneId })
        changed = true
      }
    })

    const removePaneIds: string[] = []
    this._drawPanes.forEach(pane => {
      const paneId = pane.getId()
      if (!usedPaneIds.has(paneId)) {
        removePaneIds.push(paneId)
      }
    })
    removePaneIds.forEach(paneId => {
      const index = this._drawPanes.findIndex(pane => pane.getId() === paneId)
      const pane = this._drawPanes[index]
      if (isValid(pane)) {
        this._drawPanes.splice(index, 1)
        pane.destroy()
        changed = true
      }
    })
    return changed
  }

  private _syncYAxesByData (): boolean {
    let changed = false
    const defaultYAxis = this._getLayoutDefaultYAxis(this._chartStore.getLayoutBasicParams())
    this._drawPanes.forEach(pane => {
      const paneId = pane.getId()
      if (paneId === PaneIdConstants.X_AXIS) {
        return
      }
      const usedYAxisIds = new Set<string>()
      if (paneId === PaneIdConstants.CANDLE) {
        usedYAxisIds.add(DEFAULT_AXIS_ID)
      }
      this._chartStore.getIndicatorsByPaneId(paneId).forEach(indicator => {
        usedYAxisIds.add(indicator.yAxisId)
        if (!pane.hasYAxisComponent(indicator.yAxisId)) {
          pane.createYAxis({ ...defaultYAxis, id: indicator.yAxisId, paneId })
          changed = true
        }
      })
      pane.getYAxisComponents().forEach(yAxis => {
        if (!usedYAxisIds.has(yAxis.id)) {
          changed = pane.removeYAxis(yAxis.id) || changed
        }
      })
    })
    return changed
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

  createIndicator (value: string | IndicatorCreate, options?: CreateIndicatorOptions): Nullable<string> {
    const indicator: ExcludePickPartial<Indicator, 'name'> = isString(value) ? { name: value } : value
    if (getIndicatorClass(indicator.name) === null) {
      logWarn('createIndicator', 'value', 'indicator not supported, you may need to use registerIndicator to add one!!!')
      return null
    }

    const paneId = options?.pane?.id ?? createId(PaneIdConstants.INDICATOR)
    const yAxisId = options?.yAxis?.id ?? DEFAULT_AXIS_ID

    indicator.paneId = paneId
    indicator.yAxisId = yAxisId

    if (!isString(indicator.id)) {
      indicator.id = createId(indicator.name)
    }

    const result = this._chartStore.addIndicator(indicator as ExcludePickPartial<Indicator, 'id' | 'name' | 'paneId'>, options?.isStack ?? false)
    if (result) {
      let shouldSort = false
      let pane = this.getDrawPaneById(paneId)
      const defaultPaneOptions = this._getLayoutDefaultPaneOptions(this._chartStore.getLayoutBasicParams())
      const defaultYAxis = this._getLayoutDefaultYAxis(this._chartStore.getLayoutBasicParams())
      if (!isValid(pane)) {
        pane = this._createPane(IndicatorPane, { ...defaultPaneOptions, ...options?.pane, id: paneId })
        shouldSort = true
      } else if (isValid(options?.pane)) {
        pane.setOptions({ ...options.pane, id: paneId })
        shouldSort = isNumber(options.pane.order)
      }
      pane.createYAxis({ ...defaultYAxis, ...options?.yAxis, id: yAxisId, paneId })
      this._syncYAxesByData()
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
    const indicators = this._chartStore.getIndicatorsByFilter(override)
    if (indicators.length === 0) {
      return false
    }
    const updated = this._chartStore.overrideIndicator(override)
    if (updated) {
      this.layout({
        measureWidth: true,
        update: true,
        buildYAxisTick: true,
        forceBuildYAxisTick: true
      })
    }
    return updated
  }

  getIndicators (filter?: IndicatorFilter): Indicator[] {
    return this._chartStore.getIndicatorsByFilter(filter ?? {})
  }

  removeIndicator (filter?: IndicatorFilter): boolean {
    const removed = this._chartStore.removeIndicator(filter ?? {})
    if (removed) {
      const panesChanged = this._syncIndicatorPanesByData()
      this._syncYAxesByData()
      this.layout({
        sort: panesChanged,
        measureHeight: panesChanged,
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
    let shouldSort = false
    const validId = isValid(options.id)
    for (const currentPane of this._drawPanes) {
      const currentPaneId = currentPane.getId()
      if ((validId && options.id === currentPaneId) || !validId) {
        if (currentPaneId !== PaneIdConstants.X_AXIS) {
          const currentPaneOptions = currentPane.getOptions()
          const currentState = currentPaneOptions.state
          if (isNumber(options.height) && options.height > 0) {
            const minHeight = Math.max(options.minHeight ?? currentPaneOptions.minHeight, 0)
            const height = Math.max(minHeight, options.height)
            shouldLayout = true
            shouldMeasureHeight = true
            currentPane.setBounding({ height })
          }
          if (isValid(options.state)) {
            shouldLayout = true
            shouldMeasureHeight = true
            if (currentState === 'normal' && options.state !== 'normal') {
              currentPane.setOptions({ height: currentPane.getBounding().height })
            } else if (currentState !== 'normal' && options.state === 'normal' && !isNumber(options.height)) {
              currentPane.setBounding({
                height: Math.max(currentPaneOptions.minHeight, currentPaneOptions.height)
              })
            }
          }
        }
        if (isNumber(options.order)) {
          shouldLayout = true
          shouldSort = true
        }
        currentPane.setOptions(options)
        if (currentPaneId === options.id) {
          break
        }
      }
    }
    if (shouldLayout) {
      this.layout({
        sort: shouldSort,
        measureHeight: shouldMeasureHeight,
        measureWidth: true,
        update: true,
        buildYAxisTick: true,
        forceBuildYAxisTick: true
      })
    }
  }

  overrideYAxis (yAxis: YAxisOverride): void {
    const validPaneId = isValid(yAxis.paneId)
    let shouldLayout = false
    for (const currentPane of this._drawPanes) {
      const currentPaneId = currentPane.getId()
      if (currentPaneId !== PaneIdConstants.X_AXIS && ((validPaneId && yAxis.paneId === currentPaneId) || !validPaneId)) {
        currentPane.createYAxis(yAxis)
        shouldLayout = true
        if (currentPaneId === yAxis.paneId) {
          break
        }
      }
    }
    if (shouldLayout) {
      this.layout({
        measureWidth: true,
        update: true,
        buildYAxisTick: true,
        forceBuildYAxisTick: true
      })
    }
  }

  overrideXAxis (xAxis: XAxisOverride): void {
    this._xAxisPane.overrideXAxis(xAxis)
    this.layout({
      measureHeight: true,
      update: true,
      buildYAxisTick: true,
      forceBuildYAxisTick: true
    })
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

  setZoomAnchor (anchor: ZoomAnchorType | Partial<ZoomAnchor>): void {
    this._chartStore.setZoomAnchor(anchor)
  }

  getZoomAnchor (): ZoomAnchor {
    return this._chartStore.getZoomAnchor()
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
        this._chartStore.zoom(scale, coordinate ?? null, 'main')
        prevProgressBarSpace = progressBarSpace
      })
      animation.start()
    } else {
      this._chartStore.zoom(difSpace / barSpace * SCALE_MULTIPLIER, coordinate ?? null, 'main')
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
    const { paneId = PaneIdConstants.CANDLE, yAxisId, absolute = false } = filter ?? {}
    let coordinates: Array<Partial<Coordinate>> = []
    if (paneId !== PaneIdConstants.X_AXIS) {
      const pane = this.getDrawPaneById(paneId)
      if (pane !== null) {
        const bounding = pane.getBounding()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
        // @ts-expect-error
        const ps: Array<Partial<Point>> = [].concat(points)
        const xAxis = this._xAxisPane.getXAxisComponent()
        const yAxis = pane.getYAxisComponentById(yAxisId)
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
    const { paneId = PaneIdConstants.CANDLE, yAxisId, absolute = false } = filter ?? {}
    let points: Array<Partial<Point>> = []
    if (paneId !== PaneIdConstants.X_AXIS) {
      const pane = this.getDrawPaneById(paneId)
      if (pane !== null) {
        const bounding = pane.getBounding()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
        // @ts-expect-error
        const cs: Array<Partial<Coordinate>> = [].concat(coordinates)
        const xAxis = this._xAxisPane.getXAxisComponent()
        const yAxis = pane.getYAxisComponentById(yAxisId)
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

  executeAction (type: ActionType, data: Nullable<Crosshair>): void {
    switch (type) {
      case 'onCrosshairChange': {
        let crosshair: Nullable<Crosshair> = null
        if (isValid(data)) {
          crosshair = { ...data }
          crosshair.paneId ??= PaneIdConstants.CANDLE
        }
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
      secondMeasureWidth: true,
      update: true,
      buildYAxisTick: true,
      forceBuildYAxisTick: true
    })
  }

  destroy (): void {
    if (this._resizeRequestAnimationId !== DEFAULT_REQUEST_ID) {
      cancelAnimationFrame(this._resizeRequestAnimationId)
      this._resizeRequestAnimationId = DEFAULT_REQUEST_ID
    }
    if (isValid(this._resizeObserver)) {
      this._resizeObserver.disconnect()
      this._resizeObserver = null
    } else {
      window.removeEventListener('resize', this._scheduleResize)
    }
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

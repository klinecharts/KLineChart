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
import type PickPartial from './common/PickPartial'
import type DeepPartial from './common/DeepPartial'
import type PickRequired from './common/PickRequired'
import type { KLineData, VisibleRangeData } from './common/Data'
import type VisibleRange from './common/VisibleRange'
import type Coordinate from './common/Coordinate'
import { getDefaultVisibleRange } from './common/VisibleRange'
import TaskScheduler from './common/TaskScheduler'
import type Crosshair from './common/Crosshair'
import type BarSpace from './common/BarSpace'
import type { Period } from './common/Period'
import { SymbolDefaultPrecisionConstants, type SymbolInfo } from './common/SymbolInfo'

import Action from './common/Action'
import type { ActionType, ActionCallback } from './common/Action'
import { formatValue, formatTimestampByTemplate, formatBigNumber, formatThousands, formatFoldDecimal } from './common/utils/format'
import { getDefaultStyles, type Styles, type TooltipLegend } from './common/Styles'
import { isArray, isString, isValid, isNumber, isBoolean, merge } from './common/utils/typeChecks'
import { createId } from './common/utils/id'
import { binarySearchNearest } from './common/utils/number'
import { logWarn } from './common/utils/logger'
import { UpdateLevel } from './common/Updater'
import type { DataLoader, DataLoaderGetBarsParams, DataLoadMore, DataLoadType } from './common/DataLoader'

import type { Options, Formatter, ThousandsSeparator, DecimalFold, FormatDateType, FormatDateParams, FormatBigNumber, FormatExtendText, FormatExtendTextParams, ZoomAnchor, ZoomAnchorType } from './Options'

import type { IndicatorOverride, IndicatorCreate, IndicatorFilter } from './component/Indicator'
import type IndicatorImp from './component/Indicator'
import { getIndicatorClass } from './extension/indicator/index'

import type OverlayImp from './component/Overlay'
import { type OverlayCreate, OVERLAY_ID_PREFIX, type OverlayFilter, type OverlayFigure, type OverlayOverride } from './component/Overlay'
import { getOverlayInnerClass } from './extension/overlay/index'

import { getStyles as getExtensionStyles } from './extension/styles/index'

import { PaneIdConstants } from './pane/types'

import type Chart from './Chart'

const BarSpaceLimitConstants = {
  MIN: 1,
  MAX: 50
}

type ScrollLimitRole = 'bar_count' | 'distance'

export interface ProgressOverlayInfo {
  paneId: string
  overlay: OverlayImp
  appointPaneFlag: boolean
}

export type EventOverlayInfoFigureType = 'none' | 'point' | 'other'

export interface EventOverlayInfo {
  paneId: string
  overlay: Nullable<OverlayImp>
  figureType: EventOverlayInfoFigureType
  figureIndex: number
  figure: Nullable<OverlayFigure>
}

type ProcessOverlayEventCallback = (overlay: OverlayImp, figure: Nullable<OverlayFigure>) => boolean

const DEFAULT_BAR_SPACE = 10

const DEFAULT_OFFSET_RIGHT_DISTANCE = 80

const BAR_GAP_RATIO = 0.2

export const SCALE_MULTIPLIER = 10

export const DEFAULT_MIN_TIME_SPAN = 15 * 60 * 1000

export interface Store {
  setStyles: (value: string | DeepPartial<Styles>) => void
  getStyles: () => Styles
  setFormatter: (formatter: Partial<Formatter>) => void
  getFormatter: () => Formatter
  setLocale: (locale: string) => void
  getLocale: () => string
  setTimezone: (timezone: string) => void
  getTimezone: () => string
  setThousandsSeparator: (thousandsSeparator: Partial<ThousandsSeparator>) => void
  getThousandsSeparator: () => ThousandsSeparator
  setDecimalFold: (decimalFold: Partial<DecimalFold>) => void
  getDecimalFold: () => DecimalFold
  setSymbol: (symbol: PickPartial<SymbolInfo, 'pricePrecision' | 'volumePrecision'>) => void
  getSymbol: () => Nullable<SymbolInfo>
  setPeriod: (period: Period) => void
  getPeriod: () => Nullable<Period>
  getDataList: () => KLineData[]
  setOffsetRightDistance: (distance: number) => void
  getOffsetRightDistance: () => number
  setMaxOffsetLeftDistance: (distance: number) => void
  setMaxOffsetRightDistance: (distance: number) => void
  setLeftMinVisibleBarCount: (barCount: number) => void
  setRightMinVisibleBarCount: (barCount: number) => void
  setBarSpace: (space: number) => void
  getBarSpace: () => BarSpace
  getVisibleRange: () => VisibleRange
  setDataLoader: (dataLoader: DataLoader) => void
  overrideIndicator: (override: IndicatorCreate) => boolean
  removeIndicator: (filter?: IndicatorFilter) => boolean
  overrideOverlay: (override: Partial<OverlayCreate>) => boolean
  removeOverlay: (filter?: OverlayFilter) => boolean
  setZoomEnabled: (enabled: boolean) => void
  isZoomEnabled: () => boolean
  setZoomAnchor: (behavior: ZoomAnchor) => void
  getZoomAnchor: () => ZoomAnchor
  setScrollEnabled: (enabled: boolean) => void
  isScrollEnabled: () => boolean
  resetData: () => void
}

export default class StoreImp implements Store {
  /**
   * Internal chart
   */
  private readonly _chart: Chart

  /**
   * Styles
   */
  private readonly _styles = getDefaultStyles()

  /**
   * Custom api
   */
  private readonly _formatter = {
    formatDate: ({
      dateTimeFormat,
      timestamp,
      template
    }: FormatDateParams) => formatTimestampByTemplate(dateTimeFormat, timestamp, template),
    formatBigNumber,
    formatExtendText: (_: FormatExtendTextParams) => ''
  }

  /**
   * Inner formatter
   * @description Internal use only
   */
  private readonly _innerFormatter = {
    formatDate: (timestamp: number, template: string, type: FormatDateType) => this._formatter.formatDate({ dateTimeFormat: this._dateTimeFormat, timestamp, template, type }),
    formatBigNumber: (value: number | string) => this._formatter.formatBigNumber(value),
    formatExtendText: (params: FormatExtendTextParams) => this._formatter.formatExtendText(params)
  }

  /**
   * Locale
   */
  private _locale = 'en-US'

  /**
   * Thousands separator
   */
  private readonly _thousandsSeparator = {
    sign: ',',
    format: (value: string | number) => formatThousands(value, this._thousandsSeparator.sign)
  }

  /**
   * Decimal fold
   */
  private readonly _decimalFold = {
    threshold: 3,
    format: (value: string | number) => formatFoldDecimal(value, this._decimalFold.threshold)
  }

  /**
   * Symbol
   */
  private _symbol: Nullable<SymbolInfo> = null

  /**
   * Period
   */
  private _period: Nullable<Period> = null

  /**
   * Data source
   */
  private _dataList: KLineData[] = []

  /**
   * Load more data callback
   */
  private _dataLoader: Nullable<DataLoader> = null

  /**
   * Is loading data flag
   */
  private _loading = false

  /**
  * Whether there are forward and backward more flag
   */
  private readonly _dataLoadMore = { forward: false, backward: false }

  /**
     * Time format
     */
  private _dateTimeFormat: Intl.DateTimeFormat

  /**
   * Scale enabled flag
   */
  private _zoomEnabled = true

  /**
   * Zoom anchor point flag
   */
  private readonly _zoomAnchor: ZoomAnchor = {
    main: 'cursor',
    xAxis: 'cursor'
  }

  /**
   * Scroll enabled flag
   */
  private _scrollEnabled = true

  /**
   * Total space of drawing area
   */
  private _totalBarSpace = 0

  /**
   * Space occupied by a single piece of data
   */
  private _barSpace = DEFAULT_BAR_SPACE

  /**
   * The space of the draw bar
   */
  private _gapBarSpace: number

  /**
   * Distance from the last data to the right of the drawing area
   */
  private _offsetRightDistance = DEFAULT_OFFSET_RIGHT_DISTANCE

  /**
   * The number of bar calculated from the distance of the last data to the right of the drawing area
   */
  private _lastBarRightSideDiffBarCount: number

  /**
   * The number of bar to the right of the drawing area from the last data when scrolling starts
   */
  private _startLastBarRightSideDiffBarCount = 0

  /**
   * Scroll limit role
   */
  private _scrollLimitRole: ScrollLimitRole = 'bar_count'

  /**
   * Scroll to the leftmost and rightmost visible bar
   */
  private readonly _minVisibleBarCount = { left: 2, right: 2 }

  /**
   * Scroll to the leftmost and rightmost distance
   */
  private readonly _maxOffsetDistance = { left: 50, right: 50 }

  /**
   * Start and end points of visible area data index
   */
  private _visibleRange = getDefaultVisibleRange()

  /**
   * Visible data array
   */
  private _visibleRangeDataList: VisibleRangeData[] = []

  /**
   * Visible highest lowest price data
   */
  private _visibleRangeHighLowPrice = [
    { x: 0, price: Number.MIN_SAFE_INTEGER },
    { x: 0, price: Number.MAX_SAFE_INTEGER }
  ]

  /**
   * Crosshair info
   */
  private _crosshair: Crosshair = {}

  /**
   * Actions
   */
  private readonly _actions = new Map<ActionType, Action>()

  /**
   * Indicator
   */
  private readonly _indicators = new Map<string, IndicatorImp[]>()

  /**
   * Task scheduler
   */
  private readonly _taskScheduler: TaskScheduler

  /**
   * Overlay
   */
  private readonly _overlays = new Map<string, OverlayImp[]>()

  /**
   * Overlay information in painting
   */
  private _progressOverlayInfo: Nullable<ProgressOverlayInfo> = null

  private _lastPriceMarkExtendTextUpdateTimers: Array<ReturnType<typeof setTimeout>> = []

  /**
   * Overlay information by the mouse pressed
   */
  private _pressedOverlayInfo: EventOverlayInfo = {
    paneId: '',
    overlay: null,
    figureType: 'none',
    figureIndex: -1,
    figure: null
  }

  /**
   * Overlay information by hover
   */
  private _hoverOverlayInfo: EventOverlayInfo = {
    paneId: '',
    overlay: null,
    figureType: 'none',
    figureIndex: -1,
    figure: null
  }

  /**
   * Overlay information by the mouse click
   */
  private _clickOverlayInfo: EventOverlayInfo = {
    paneId: '',
    overlay: null,
    figureType: 'none',
    figureIndex: -1,
    figure: null
  }

  constructor (chart: Chart, options?: Options) {
    this._chart = chart
    this._calcOptimalBarSpace()
    this._lastBarRightSideDiffBarCount = this._offsetRightDistance / this._barSpace
    const { styles, locale, timezone, formatter, thousandsSeparator, decimalFold, zoomAnchor } = options ?? {}
    if (isValid(styles)) {
      this.setStyles(styles)
    }
    if (isString(locale)) {
      this.setLocale(locale)
    }
    this.setTimezone(timezone ?? '')
    if (isValid(formatter)) {
      this.setFormatter(formatter)
    }
    if (isValid(thousandsSeparator)) {
      this.setThousandsSeparator(thousandsSeparator)
    }
    if (isValid(decimalFold)) {
      this.setDecimalFold(decimalFold)
    }

    if (isValid(zoomAnchor)) {
      this.setZoomAnchor(zoomAnchor)
    }

    this._taskScheduler = new TaskScheduler(() => {
      this._chart.layout({
        measureWidth: true,
        update: true,
        buildYAxisTick: true
      })
    })
  }

  setStyles (value: string | DeepPartial<Styles>): void {
    let styles: Nullable<DeepPartial<Styles>> = null
    if (isString(value)) {
      styles = getExtensionStyles(value)
    } else {
      styles = value
    }
    merge(this._styles, styles)
    // `candle.tooltip.custom` should override
    if (isArray(styles?.candle?.tooltip?.legend?.template)) {
      this._styles.candle.tooltip.legend.template = styles.candle.tooltip.legend.template as TooltipLegend[]
    }
    if (isValid(styles?.candle?.priceMark?.last?.extendTexts)) {
      this._clearLastPriceMarkExtendTextUpdateTimer()
      const intervals: number[] = []
      this._styles.candle.priceMark.last.extendTexts.forEach(item => {
        const updateInterval = item.updateInterval
        if (item.show && updateInterval > 0 && !intervals.includes(updateInterval)) {
          intervals.push(updateInterval)
          const timer = setInterval(() => {
            this._chart.updatePane(UpdateLevel.Main, PaneIdConstants.CANDLE)
          }, updateInterval)
          this._lastPriceMarkExtendTextUpdateTimers.push(timer)
        }
      })
    }
  }

  getStyles (): Styles { return this._styles }

  setFormatter (formatter: Partial<Formatter>): void {
    merge(this._formatter, formatter)
  }

  getFormatter (): Formatter { return this._formatter }

  getInnerFormatter (): {
    formatDate: (timestamp: number, template: string, type: FormatDateType) => string
    formatBigNumber: FormatBigNumber,
    formatExtendText: FormatExtendText
    } {
    return this._innerFormatter
  }

  setLocale (locale: string): void { this._locale = locale }

  getLocale (): string { return this._locale }

  setTimezone (timezone: string): void {
    if (
      !isValid(this._dateTimeFormat) ||
      (this.getTimezone() !== timezone)
    ) {
      const options: Intl.DateTimeFormatOptions = {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
      if (timezone.length > 0) {
        options.timeZone = timezone
      }
      let dateTimeFormat: Nullable<Intl.DateTimeFormat> = null
      try {
        dateTimeFormat = new Intl.DateTimeFormat('en', options)
      } catch (e) {
        logWarn('', '', 'Timezone is error!!!')
      }
      if (dateTimeFormat !== null) {
        this._dateTimeFormat = dateTimeFormat
      }
    }
  }

  getTimezone (): string { return this._dateTimeFormat.resolvedOptions().timeZone }

  getDateTimeFormat (): Intl.DateTimeFormat {
    return this._dateTimeFormat
  }

  setThousandsSeparator (thousandsSeparator: Partial<ThousandsSeparator>): void {
    merge(this._thousandsSeparator, thousandsSeparator)
  }

  getThousandsSeparator (): ThousandsSeparator { return this._thousandsSeparator }

  setDecimalFold (decimalFold: Partial<DecimalFold>): void { merge(this._decimalFold, decimalFold) }

  getDecimalFold (): DecimalFold { return this._decimalFold }

  setSymbol (symbol: PickPartial<SymbolInfo, 'pricePrecision' | 'volumePrecision'>): void {
    this.resetData(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ignore
      // @ts-expect-error
      this._symbol = {
        pricePrecision: SymbolDefaultPrecisionConstants.PRICE,
        volumePrecision: SymbolDefaultPrecisionConstants.VOLUME,
        ...this._symbol,
        ...symbol
      }
      this._synchronizeIndicatorSeriesPrecision()
    })
  }

  getSymbol (): Nullable<SymbolInfo> {
    return this._symbol
  }

  setPeriod (period: Period): void {
    this.resetData(() => {
      this._period = period
    })
  }

  getPeriod (): Nullable<Period> {
    return this._period
  }

  getDataList (): KLineData[] {
    return this._dataList
  }

  getVisibleRangeDataList (): VisibleRangeData[] {
    return this._visibleRangeDataList
  }

  getVisibleRangeHighLowPrice (): Array<{ price: number; x: number }> {
    return this._visibleRangeHighLowPrice
  }

  private _addData (
    data: KLineData | KLineData[],
    type: DataLoadType,
    more?: DataLoadMore
  ): void {
    let success = false
    let adjustFlag = false
    let dataLengthChange = 0
    if (isArray<KLineData>(data)) {
      const realMore = { backward: false, forward: false }
      if (isBoolean(more)) {
        realMore.backward = more
        realMore.forward = more
      } else {
        realMore.backward = more?.backward ?? false
        realMore.forward = more?.forward ?? false
      }
      dataLengthChange = data.length
      switch (type) {
        case 'init': {
          this._clearData()
          this._dataList = data
          this._dataLoadMore.backward = realMore.backward
          this._dataLoadMore.forward = realMore.forward
          this.setOffsetRightDistance(this._offsetRightDistance)
          adjustFlag = true
          break
        }
        case 'backward': {
          this._dataList = this._dataList.concat(data)
          this._dataLoadMore.backward = realMore.backward
          this._lastBarRightSideDiffBarCount -= dataLengthChange
          adjustFlag = dataLengthChange > 0
          break
        }
        case 'forward': {
          this._dataList = data.concat(this._dataList)
          this._dataLoadMore.forward = realMore.forward
          adjustFlag = dataLengthChange > 0
          break
        }
        default: {
          break
        }
      }
      success = true
    } else {
      const dataCount = this._dataList.length
      // Determine where individual data should be added
      const timestamp = data.timestamp
      const lastDataTimestamp = formatValue(this._dataList[dataCount - 1], 'timestamp', 0) as number
      if (timestamp > lastDataTimestamp) {
        this._dataList.push(data)
        let lastBarRightSideDiffBarCount = this.getLastBarRightSideDiffBarCount()
        if (lastBarRightSideDiffBarCount < 0) {
          this.setLastBarRightSideDiffBarCount(--lastBarRightSideDiffBarCount)
        }
        dataLengthChange = 1
        success = true
        adjustFlag = true
      } else if (timestamp === lastDataTimestamp) {
        this._dataList[dataCount - 1] = data
        success = true
        adjustFlag = true
      }
    }
    if (success && adjustFlag) {
      this._adjustVisibleRange()
      this.setCrosshair(this._crosshair, { notInvalidate: true })
      const filterIndicators = this.getIndicatorsByFilter({})
      if (filterIndicators.length > 0) {
        this._calcIndicator(filterIndicators)
      } else {
        this._chart.layout({
          measureWidth: true,
          update: true,
          buildYAxisTick: true,
          cacheYAxisWidth: type !== 'init'
        })
      }
    }
  }

  setDataLoader (dataLoader: DataLoader): void {
    this.resetData(() => {
      this._dataLoader = dataLoader
    })
  }

  private _calcOptimalBarSpace (): void {
    const specialBarSpace = 4
    const ratio = 1 - BAR_GAP_RATIO * Math.atan(Math.max(specialBarSpace, this._barSpace) - specialBarSpace) / (Math.PI * 0.5)
    let gapBarSpace = Math.min(Math.floor(this._barSpace * ratio), Math.floor(this._barSpace))
    if (gapBarSpace % 2 === 0 && gapBarSpace + 2 >= this._barSpace) {
      --gapBarSpace
    }
    this._gapBarSpace = Math.max(1, gapBarSpace)
  }

  private _adjustVisibleRange (): void {
    const totalBarCount = this._dataList.length
    const visibleBarCount = this._totalBarSpace / this._barSpace

    let leftMinVisibleBarCount = 0
    let rightMinVisibleBarCount = 0

    if (this._scrollLimitRole === 'distance') {
      leftMinVisibleBarCount = (this._totalBarSpace - this._maxOffsetDistance.right) / this._barSpace
      rightMinVisibleBarCount = (this._totalBarSpace - this._maxOffsetDistance.left) / this._barSpace
    } else {
      leftMinVisibleBarCount = this._minVisibleBarCount.left
      rightMinVisibleBarCount = this._minVisibleBarCount.right
    }

    leftMinVisibleBarCount = Math.max(0, leftMinVisibleBarCount)
    rightMinVisibleBarCount = Math.max(0, rightMinVisibleBarCount)

    const maxRightOffsetBarCount = visibleBarCount - Math.min(leftMinVisibleBarCount, totalBarCount)
    if (this._lastBarRightSideDiffBarCount > maxRightOffsetBarCount) {
      this._lastBarRightSideDiffBarCount = maxRightOffsetBarCount
    }

    const minRightOffsetBarCount = -totalBarCount + Math.min(rightMinVisibleBarCount, totalBarCount)
    if (this._lastBarRightSideDiffBarCount < minRightOffsetBarCount) {
      this._lastBarRightSideDiffBarCount = minRightOffsetBarCount
    }

    let to = Math.round(this._lastBarRightSideDiffBarCount + totalBarCount + 0.5)
    const realTo = to
    if (to > totalBarCount) {
      to = totalBarCount
    }
    let from = Math.round(to - visibleBarCount) - 1
    if (from < 0) {
      from = 0
    }
    const realFrom = this._lastBarRightSideDiffBarCount > 0 ? Math.round(totalBarCount + this._lastBarRightSideDiffBarCount - visibleBarCount) - 1 : from
    this._visibleRange = { from, to, realFrom, realTo }
    this.executeAction('onVisibleRangeChange', this._visibleRange)
    this._visibleRangeDataList = []
    this._visibleRangeHighLowPrice = [
      { x: 0, price: Number.MIN_SAFE_INTEGER },
      { x: 0, price: Number.MAX_SAFE_INTEGER }
    ]
    for (let i = realFrom; i < realTo; i++) {
      const kLineData = this._dataList[i]
      const x = this.dataIndexToCoordinate(i)
      this._visibleRangeDataList.push({
        dataIndex: i,
        x,
        data: {
          prev: this._dataList[i - 1] ?? kLineData,
          current: kLineData,
          next: this._dataList[i + 1] ?? kLineData
        }
      })
      if (isValid(kLineData)) {
        if (this._visibleRangeHighLowPrice[0].price < kLineData.high) {
          this._visibleRangeHighLowPrice[0].price = kLineData.high
          this._visibleRangeHighLowPrice[0].x = x
        }
        if (this._visibleRangeHighLowPrice[1].price > kLineData.low) {
          this._visibleRangeHighLowPrice[1].price = kLineData.low
          this._visibleRangeHighLowPrice[1].x = x
        }
      }
    }
    // More processing and loading, more loading if there are callback methods and no data is being loaded
    if (from === 0) {
      if (this._dataLoadMore.forward) {
        this._processDataLoad('forward')
      }
    } else if (to === totalBarCount) {
      if (this._dataLoadMore.backward) {
        this._processDataLoad('backward')
      }
    }
  }

  private _processDataLoad (type: DataLoadType): void {
    if (!this._loading && isValid(this._dataLoader) && isValid(this._symbol) && isValid(this._period)) {
      this._loading = true
      const params: DataLoaderGetBarsParams = {
        type,
        symbol: this._symbol,
        period: this._period,
        timestamp: null,
        callback: (data: KLineData[], more?: DataLoadMore) => {
          this._loading = false
          this._addData(data, type, more)
          if (type === 'init') {
            this._dataLoader?.subscribeBar?.({
              symbol: this._symbol!,
              period: this._period!,
              callback: (data: KLineData) => {
                this._addData(data, 'update')
              }
            })
          }
        }
      }
      switch (type) {
        case 'backward': {
          params.timestamp = this._dataList[this._dataList.length - 1]?.timestamp ?? null
          break
        }
        case 'forward': {
          params.timestamp = this._dataList[0]?.timestamp ?? null
          break
        }
        default: {
          break
        }
      }
      void this._dataLoader.getBars(params)
    }
  }

  private _processDataUnsubscribe (): void {
    if (isValid(this._dataLoader) && isValid(this._symbol) && isValid(this._period)) {
      this._dataLoader.unsubscribeBar?.({
        symbol: this._symbol,
        period: this._period
      })
    }
  }

  resetData (fn?: () => void): void {
    this._processDataUnsubscribe()
    fn?.()
    this._loading = false
    this._processDataLoad('init')
  }

  getBarSpace (): BarSpace {
    return {
      bar: this._barSpace,
      halfBar: this._barSpace / 2,
      gapBar: this._gapBarSpace,
      halfGapBar: Math.floor(this._gapBarSpace / 2)
    }
  }

  setBarSpace (barSpace: number, adjustBeforeFunc?: () => void): void {
    if (barSpace < BarSpaceLimitConstants.MIN || barSpace > BarSpaceLimitConstants.MAX || this._barSpace === barSpace) {
      return
    }
    this._barSpace = barSpace
    this._calcOptimalBarSpace()
    adjustBeforeFunc?.()
    this._adjustVisibleRange()
    this.setCrosshair(this._crosshair, { notInvalidate: true })
    this._chart.layout({
      measureWidth: true,
      update: true,
      buildYAxisTick: true,
      cacheYAxisWidth: true
    })
  }

  setTotalBarSpace (totalSpace: number): void {
    if (this._totalBarSpace !== totalSpace) {
      this._totalBarSpace = totalSpace
      this._adjustVisibleRange()
      this.setCrosshair(this._crosshair, { notInvalidate: true })
    }
  }

  setOffsetRightDistance (distance: number, isUpdate?: boolean): this {
    this._offsetRightDistance = this._scrollLimitRole === 'distance' ? Math.min(this._maxOffsetDistance.right, distance) : distance
    this._lastBarRightSideDiffBarCount = this._offsetRightDistance / this._barSpace
    if (isUpdate ?? false) {
      this._adjustVisibleRange()
      this.setCrosshair(this._crosshair, { notInvalidate: true })
      this._chart.layout({
        measureWidth: true,
        update: true,
        buildYAxisTick: true,
        cacheYAxisWidth: true
      })
    }
    return this
  }

  getInitialOffsetRightDistance (): number {
    return this._offsetRightDistance
  }

  getOffsetRightDistance (): number {
    return Math.max(0, this._lastBarRightSideDiffBarCount * this._barSpace)
  }

  getLastBarRightSideDiffBarCount (): number {
    return this._lastBarRightSideDiffBarCount
  }

  setLastBarRightSideDiffBarCount (barCount: number): void {
    this._lastBarRightSideDiffBarCount = barCount
  }

  setMaxOffsetLeftDistance (distance: number): void {
    this._scrollLimitRole = 'distance'
    this._maxOffsetDistance.left = distance
  }

  setMaxOffsetRightDistance (distance: number): void {
    this._scrollLimitRole = 'distance'
    this._maxOffsetDistance.right = distance
  }

  setLeftMinVisibleBarCount (barCount: number): void {
    this._scrollLimitRole = 'bar_count'
    this._minVisibleBarCount.left = barCount
  }

  setRightMinVisibleBarCount (barCount: number): void {
    this._scrollLimitRole = 'bar_count'
    this._minVisibleBarCount.right = barCount
  }

  getVisibleRange (): VisibleRange {
    return this._visibleRange
  }

  startScroll (): void {
    this._startLastBarRightSideDiffBarCount = this._lastBarRightSideDiffBarCount
  }

  scroll (distance: number): void {
    if (!this._scrollEnabled) {
      return
    }
    const distanceBarCount = distance / this._barSpace
    const prevLastBarRightSideDistance = this._lastBarRightSideDiffBarCount * this._barSpace
    this._lastBarRightSideDiffBarCount = this._startLastBarRightSideDiffBarCount - distanceBarCount
    this._adjustVisibleRange()
    this.setCrosshair(this._crosshair, { notInvalidate: true })
    this._chart.layout({
      measureWidth: true,
      update: true,
      buildYAxisTick: true,
      cacheYAxisWidth: true
    })
    const realDistance = Math.round(
      prevLastBarRightSideDistance - this._lastBarRightSideDiffBarCount * this._barSpace
    )
    if (realDistance !== 0) {
      this.executeAction('onScroll', { distance: realDistance })
    }
  }

  getDataByDataIndex (dataIndex: number): Nullable<KLineData> {
    return this._dataList[dataIndex] ?? null
  }

  coordinateToFloatIndex (x: number): number {
    const dataCount = this._dataList.length
    const deltaFromRight = (this._totalBarSpace - x) / this._barSpace
    const index = dataCount + this._lastBarRightSideDiffBarCount - deltaFromRight
    return Math.round(index * 1000000) / 1000000
  }

  dataIndexToTimestamp (dataIndex: number): Nullable<number> {
    const length = this._dataList.length
    if (length === 0) {
      return null
    }
    const data = this.getDataByDataIndex(dataIndex)
    if (isValid(data)) {
      return data.timestamp
    }
    if (isValid(this._period)) {
      const lastIndex = length - 1
      let referenceTimestamp: Nullable<number | null> = null
      let diff = 0
      if (dataIndex > lastIndex) {
        referenceTimestamp = this._dataList[lastIndex].timestamp
        diff = dataIndex - lastIndex
      } else if (dataIndex < 0) {
        referenceTimestamp = this._dataList[0].timestamp
        diff = dataIndex
      }
      if (isNumber(referenceTimestamp)) {
        const { type, span } = this._period
        switch (type) {
          case 'second': {
            return referenceTimestamp + span * 1000 * diff
          }
          case 'minute': {
            return referenceTimestamp + span * 60 * 1000 * diff
          }
          case 'hour': {
            return referenceTimestamp + span * 60 * 60 * 1000 * diff
          }
          case 'day': {
            return referenceTimestamp + span * 24 * 60 * 60 * 1000 * diff
          }
          case 'week': {
            return referenceTimestamp + span * 7 * 24 * 60 * 60 * 1000 * diff
          }
          case 'month': {
            const date = new Date(referenceTimestamp)
            const referenceDay = date.getDate()

            date.setDate(1)

            date.setMonth(date.getMonth() + span * diff)
            const lastDayOfTargetMonth = new Date(
              date.getFullYear(),
              date.getMonth() + 1,
              0
            ).getDate()
            date.setDate(Math.min(referenceDay, lastDayOfTargetMonth))
            return date.getTime()
          }
          case 'year': {
            const date = new Date(referenceTimestamp)
            date.setFullYear(date.getFullYear() + span * diff)
            return date.getTime()
          }
        }
      }
    }
    return null
  }

  timestampToDataIndex (timestamp: number): number {
    const length = this._dataList.length
    if (length === 0) {
      return 0
    }
    if (isValid(this._period)) {
      let referenceTimestamp: Nullable<number | null> = null
      let baseDataIndex = 0

      const lastIndex = length - 1
      const lastTimestamp = this._dataList[lastIndex].timestamp
      if (timestamp > lastTimestamp) {
        referenceTimestamp = lastTimestamp
        baseDataIndex = lastIndex
      }
      const firstTimestamp = this._dataList[0].timestamp
      if (timestamp < firstTimestamp) {
        referenceTimestamp = firstTimestamp
        baseDataIndex = 0
      }
      if (isNumber(referenceTimestamp)) {
        const { type, span } = this._period
        switch (type) {
          case 'second': {
            return baseDataIndex + Math.floor((timestamp - referenceTimestamp) / (span * 1000))
          }
          case 'minute': {
            return baseDataIndex + Math.floor((timestamp - referenceTimestamp) / (span * 60 * 1000))
          }
          case 'hour': {
            return baseDataIndex + Math.floor((timestamp - referenceTimestamp) / (span * 60 * 60 * 1000))
          }
          case 'day': {
            return baseDataIndex + Math.floor((timestamp - referenceTimestamp) / (span * 24 * 60 * 60 * 1000))
          }
          case 'week': {
            return baseDataIndex + Math.floor((timestamp - referenceTimestamp) / (span * 7 * 24 * 60 * 60 * 1000))
          }
          case 'month': {
            const referenceDate = new Date(referenceTimestamp)
            const currentDate = new Date(timestamp)
            const referenceYear = referenceDate.getFullYear()
            const currentYear = currentDate.getFullYear()
            const referenceMonth = referenceDate.getMonth()
            const currentMonth = currentDate.getMonth()
            return baseDataIndex + Math.floor(((currentYear - referenceYear) * 12 + (currentMonth - referenceMonth)) / span)
          }
          case 'year': {
            const referenceYear = new Date(referenceTimestamp).getFullYear()
            const currentYear = new Date(timestamp).getFullYear()
            return baseDataIndex + Math.floor((currentYear - referenceYear) / span)
          }
        }
      }
    }
    return binarySearchNearest(this._dataList, 'timestamp', timestamp)
  }

  dataIndexToCoordinate (dataIndex: number): number {
    const dataCount = this._dataList.length
    const deltaFromRight = dataCount + this._lastBarRightSideDiffBarCount - dataIndex
    return Math.floor(this._totalBarSpace - (deltaFromRight - 0.5) * this._barSpace + 0.5)
  }

  coordinateToDataIndex (x: number): number {
    return Math.ceil(this.coordinateToFloatIndex(x)) - 1
  }

  zoom (scale: number, coordinate: Nullable<Partial<Coordinate>>, position: 'main' | 'xAxis'): void {
    if (!this._zoomEnabled) {
      return
    }
    const zoomCoordinate: Partial<Coordinate> = coordinate ?? { x: this._crosshair.x ?? this._totalBarSpace / 2 }

    if (position === 'xAxis') {
      if (this._zoomAnchor.xAxis === 'last_bar') {
        zoomCoordinate.x = this.dataIndexToCoordinate(this._dataList.length - 1)
      }
    } else {
      if (this._zoomAnchor.main === 'last_bar') {
        zoomCoordinate.x = this.dataIndexToCoordinate(this._dataList.length - 1)
      }
    }
    const x = zoomCoordinate.x!
    const floatIndex = this.coordinateToFloatIndex(x)
    const prevBarSpace = this._barSpace
    const barSpace = this._barSpace + scale * (this._barSpace / SCALE_MULTIPLIER)
    this.setBarSpace(barSpace, () => {
      this._lastBarRightSideDiffBarCount += (floatIndex - this.coordinateToFloatIndex(x))
    })
    const realScale = this._barSpace / prevBarSpace
    if (realScale !== 1) {
      this.executeAction('onZoom', { scale: realScale })
    }
  }

  setZoomEnabled (enabled: boolean): void {
    this._zoomEnabled = enabled
  }

  isZoomEnabled (): boolean {
    return this._zoomEnabled
  }

  setZoomAnchor (anchor: ZoomAnchorType | Partial<ZoomAnchor>): void {
    if (isString(anchor)) {
      this._zoomAnchor.main = anchor
      this._zoomAnchor.xAxis = anchor
    } else {
      if (isString(anchor.main)) {
        this._zoomAnchor.main = anchor.main
      }
      if (isString(anchor.xAxis)) {
        this._zoomAnchor.xAxis = anchor.xAxis
      }
    }
  }

  getZoomAnchor (): ZoomAnchor {
    return { ...this._zoomAnchor }
  }

  setScrollEnabled (enabled: boolean): void {
    this._scrollEnabled = enabled
  }

  isScrollEnabled (): boolean {
    return this._scrollEnabled
  }

  setCrosshair (
    crosshair?: Crosshair,
    options?: { notInvalidate?: boolean, notExecuteAction?: boolean, forceInvalidate?: boolean }
  ): void {
    const { notInvalidate, notExecuteAction, forceInvalidate } = options ?? {}
    const cr = crosshair ?? {}
    let realDataIndex = 0
    let dataIndex = 0
    if (isNumber(cr.x)) {
      realDataIndex = this.coordinateToDataIndex(cr.x)
      if (realDataIndex < 0) {
        dataIndex = 0
      } else if (realDataIndex > this._dataList.length - 1) {
        dataIndex = this._dataList.length - 1
      } else {
        dataIndex = realDataIndex
      }
    } else {
      realDataIndex = this._dataList.length - 1
      dataIndex = realDataIndex
    }
    const kLineData: Nullable<KLineData> = this._dataList[dataIndex]
    const realX = this.dataIndexToCoordinate(realDataIndex)
    const prevCrosshair = { x: this._crosshair.x, y: this._crosshair.y, paneId: this._crosshair.paneId }
    this._crosshair = { ...cr, realX, kLineData, realDataIndex, dataIndex, timestamp: this.dataIndexToTimestamp(realDataIndex) ?? undefined }
    if (
      prevCrosshair.x !== cr.x ||
      prevCrosshair.y !== cr.y ||
      prevCrosshair.paneId !== cr.paneId ||
      (forceInvalidate ?? false)
    ) {
      if (isValid(kLineData) && !(notExecuteAction ?? false) && this.hasAction('onCrosshairChange') && isString(this._crosshair.paneId)) {
        this.executeAction('onCrosshairChange', crosshair)
      }
      if (!(notInvalidate ?? false)) {
        this._chart.updatePane(UpdateLevel.Overlay)
      }
    }
  }

  getCrosshair (): Crosshair {
    return this._crosshair
  }

  executeAction (type: ActionType, data?: unknown): void {
    this._actions.get(type)?.execute(data)
  }

  subscribeAction (type: ActionType, callback: ActionCallback): void {
    if (!this._actions.has(type)) {
      this._actions.set(type, new Action())
    }
    this._actions.get(type)?.subscribe(callback)
  }

  unsubscribeAction (type: ActionType, callback?: ActionCallback): void {
    const action = this._actions.get(type)
    if (isValid(action)) {
      action.unsubscribe(callback)
      if (action.isEmpty()) {
        this._actions.delete(type)
      }
    }
  }

  hasAction (type: ActionType): boolean {
    const action = this._actions.get(type)
    return isValid(action) && !action.isEmpty()
  }

  private _sortIndicators (paneId?: string): void {
    if (isString(paneId)) {
      this._indicators.get(paneId)?.sort((i1, i2) => i1.zLevel - i2.zLevel)
    } else {
      this._indicators.forEach(paneIndicators => {
        paneIndicators.sort((i1, i2) => i1.zLevel - i2.zLevel)
      })
    }
  }

  private _calcIndicator (data: IndicatorImp | IndicatorImp[]): void {
    let indicators: IndicatorImp[] = []
    indicators = indicators.concat(data)
    if (indicators.length > 0) {
      const tasks: Record<string, Promise<unknown>> = {}
      indicators.forEach(indicator => {
        tasks[indicator.id] = indicator.calcImp(this._dataList)
      })
      this._taskScheduler.add(tasks)
    }
  }

  addIndicator (create: PickRequired<IndicatorCreate, 'id' | 'name'>, paneId: string, isStack: boolean): boolean {
    const { name } = create
    const filterIndicators = this.getIndicatorsByFilter(create)
    if (filterIndicators.length > 0) {
      return false
    }
    let paneIndicators = this.getIndicatorsByPaneId(paneId)
    const IndicatorClazz = getIndicatorClass(name)!
    const indicator = new IndicatorClazz()

    this._synchronizeIndicatorSeriesPrecision(indicator)
    indicator.paneId = paneId
    indicator.override(create)
    if (!isStack) {
      this.removeIndicator({ paneId })
      paneIndicators = []
    }
    paneIndicators.push(indicator)
    this._indicators.set(paneId, paneIndicators)
    this._sortIndicators(paneId)
    this._calcIndicator(indicator)
    return true
  }

  getIndicatorsByPaneId (paneId: string): IndicatorImp[] {
    return this._indicators.get(paneId) ?? []
  }

  getIndicatorsByFilter (filter: IndicatorFilter): IndicatorImp[] {
    const { paneId, name, id } = filter
    const match: ((overlay: IndicatorImp) => boolean) = indicator => {
      if (isValid(id)) {
        return indicator.id === id
      }
      return !isValid(name) || indicator.name === name
    }
    let indicators: IndicatorImp[] = []
    if (isValid(paneId)) {
      indicators = indicators.concat(this.getIndicatorsByPaneId(paneId).filter(match))
    } else {
      this._indicators.forEach(paneIndicators => {
        indicators = indicators.concat(paneIndicators.filter(match))
      })
    }
    return indicators
  }

  removeIndicator (filter: IndicatorFilter): boolean {
    let removed = false
    const filterIndicators = this.getIndicatorsByFilter(filter)
    filterIndicators.forEach(indicator => {
      const paneIndicators = this.getIndicatorsByPaneId(indicator.paneId)
      const index = paneIndicators.findIndex(ins => ins.id === indicator.id)
      if (index > -1) {
        paneIndicators.splice(index, 1)
        removed = true
      }
      if (paneIndicators.length === 0) {
        this._indicators.delete(indicator.paneId)
      }
    })
    return removed
  }

  hasIndicators (paneId: string): boolean {
    return this._indicators.has(paneId)
  }

  private _synchronizeIndicatorSeriesPrecision (indicator?: IndicatorImp): void {
    if (isValid(this._symbol)) {
      const {
        pricePrecision = SymbolDefaultPrecisionConstants.PRICE,
        volumePrecision = SymbolDefaultPrecisionConstants.VOLUME
      } = this._symbol
      const synchronize: ((indicator: IndicatorImp) => void) = indicator => {
        switch (indicator.series) {
          case 'price': {
            indicator.setSeriesPrecision(pricePrecision)
            break
          }
          case 'volume': {
            indicator.setSeriesPrecision(volumePrecision)
            break
          }
          default: { break }
        }
      }

      if (isValid(indicator)) {
        synchronize(indicator)
      } else {
        this._indicators.forEach(paneIndicators => {
          paneIndicators.forEach(indicator => {
            synchronize(indicator)
          })
        })
      }
    }
  }

  overrideIndicator (override: IndicatorOverride): boolean {
    let updateFlag = false
    let sortFlag = false
    const filterIndicators = this.getIndicatorsByFilter(override)
    filterIndicators.forEach(indicator => {
      indicator.override(override)
      const { calc, draw, sort } = indicator.shouldUpdateImp()
      if (sort) {
        sortFlag = true
      }
      if (calc) {
        this._calcIndicator(indicator)
      } else {
        if (draw) {
          updateFlag = true
        }
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
    if (sortFlag) {
      this._sortIndicators()
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
    if (updateFlag) {
      this._chart.layout({ update: true })
      return true
    }
    return false
  }

  getOverlaysByFilter (filter: OverlayFilter): OverlayImp[] {
    const { id, groupId, paneId, name } = filter
    const match: ((overlay: OverlayImp) => boolean) = overlay => {
      if (isValid(id)) {
        return overlay.id === id
      } else {
        if (isValid(groupId)) {
          return overlay.groupId === groupId && (!isValid(name) || overlay.name === name)
        }
      }
      return !isValid(name) || overlay.name === name
    }

    let overlays: OverlayImp[] = []
    if (isValid(paneId)) {
      overlays = overlays.concat(this.getOverlaysByPaneId(paneId).filter(match))
    } else {
      this._overlays.forEach(paneOverlays => {
        overlays = overlays.concat(paneOverlays.filter(match))
      })
    }
    const progressOverlay = this._progressOverlayInfo?.overlay
    if (isValid(progressOverlay) && match(progressOverlay)) {
      overlays.push(progressOverlay)
    }
    return overlays
  }

  getOverlaysByPaneId (paneId?: string): OverlayImp[] {
    if (!isString(paneId)) {
      let overlays: OverlayImp[] = []
      this._overlays.forEach(paneOverlays => {
        overlays = overlays.concat(paneOverlays)
      })
      return overlays
    }
    return this._overlays.get(paneId) ?? []
  }

  private _sortOverlays (paneId?: string): void {
    if (isString(paneId)) {
      this._overlays.get(paneId)?.sort((o1, o2) => o1.zLevel - o2.zLevel)
    } else {
      this._overlays.forEach(paneOverlays => {
        paneOverlays.sort((o1, o2) => o1.zLevel - o2.zLevel)
      })
    }
  }

  addOverlays (os: OverlayCreate[], appointPaneFlags: boolean[]): Array<Nullable<string>> {
    const updatePaneIds: string[] = []
    const ids = os.map((create, index) => {
      if (isValid(create.id)) {
        let findOverlay: Nullable<OverlayImp> = null
        for (const item of this._overlays) {
          const overlays = item[1]
          const overlay = overlays.find(o => o.id === create.id)
          if (isValid(overlay)) {
            findOverlay = overlay
            break
          }
        }
        if (isValid(findOverlay)) {
          return create.id
        }
      }
      const OverlayClazz = getOverlayInnerClass(create.name)
      if (isValid(OverlayClazz)) {
        const id = create.id ?? createId(OVERLAY_ID_PREFIX)
        const overlay = new OverlayClazz()
        const paneId = create.paneId ?? PaneIdConstants.CANDLE
        create.id = id
        create.groupId ??= id
        const zLevel = this.getOverlaysByPaneId(paneId).length
        create.zLevel ??= zLevel
        overlay.override(create)
        if (!updatePaneIds.includes(paneId)) {
          updatePaneIds.push(paneId)
        }
        if (overlay.isDrawing()) {
          this._progressOverlayInfo = { paneId, overlay, appointPaneFlag: appointPaneFlags[index] }
        } else {
          if (!this._overlays.has(paneId)) {
            this._overlays.set(paneId, [])
          }
          this._overlays.get(paneId)?.push(overlay)
        }
        if (overlay.isStart()) {
          overlay.onDrawStart?.(({ overlay, chart: this._chart }))
        }
        return id
      }
      return null
    })
    if (updatePaneIds.length > 0) {
      this._sortOverlays()
      updatePaneIds.forEach(paneId => {
        this._chart.updatePane(UpdateLevel.Overlay, paneId)
      })
      this._chart.updatePane(UpdateLevel.Overlay, PaneIdConstants.X_AXIS)
    }
    return ids
  }

  getProgressOverlayInfo (): Nullable<ProgressOverlayInfo> {
    return this._progressOverlayInfo
  }

  progressOverlayComplete (): void {
    if (this._progressOverlayInfo !== null) {
      const { overlay, paneId } = this._progressOverlayInfo
      if (!overlay.isDrawing()) {
        if (!this._overlays.has(paneId)) {
          this._overlays.set(paneId, [])
        }
        this._overlays.get(paneId)?.push(overlay)
        this._sortOverlays(paneId)
        this._progressOverlayInfo = null
      }
    }
  }

  updateProgressOverlayInfo (paneId: string, appointPaneFlag?: boolean): void {
    if (this._progressOverlayInfo !== null) {
      if (isBoolean(appointPaneFlag) && appointPaneFlag) {
        this._progressOverlayInfo.appointPaneFlag = appointPaneFlag
      }
      this._progressOverlayInfo.paneId = paneId
      this._progressOverlayInfo.overlay.override({ paneId })
    }
  }

  overrideOverlay (override: OverlayOverride): boolean {
    let sortFlag = false
    const updatePaneIds: string[] = []
    const filterOverlays = this.getOverlaysByFilter(override)
    filterOverlays.forEach(overlay => {
      overlay.override(override)
      const { sort, draw } = overlay.shouldUpdate()
      if (sort) {
        sortFlag = true
      }
      if (sort || draw) {
        if (!updatePaneIds.includes(overlay.paneId)) {
          updatePaneIds.push(overlay.paneId)
        }
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
    if (sortFlag) {
      this._sortOverlays()
    }
    if (updatePaneIds.length > 0) {
      updatePaneIds.forEach(paneId => {
        this._chart.updatePane(UpdateLevel.Overlay, paneId)
      })
      this._chart.updatePane(UpdateLevel.Overlay, PaneIdConstants.X_AXIS)
      return true
    }
    return false
  }

  removeOverlay (filter: OverlayFilter): boolean {
    const updatePaneIds: string[] = []
    const filterOverlays = this.getOverlaysByFilter(filter)
    filterOverlays.forEach(overlay => {
      const paneId = overlay.paneId
      const paneOverlays = this.getOverlaysByPaneId(overlay.paneId)
      overlay.onRemoved?.({ overlay, chart: this._chart })
      if (!updatePaneIds.includes(paneId)) {
        updatePaneIds.push(paneId)
      }
      if (overlay.isDrawing()) {
        this._progressOverlayInfo = null
      } else {
        const index = paneOverlays.findIndex(o => o.id === overlay.id)
        if (index > -1) {
          paneOverlays.splice(index, 1)
        }
      }
      if (paneOverlays.length === 0) {
        this._overlays.delete(paneId)
      }
    })
    if (updatePaneIds.length > 0) {
      updatePaneIds.forEach(paneId => {
        this._chart.updatePane(UpdateLevel.Overlay, paneId)
      })
      this._chart.updatePane(UpdateLevel.Overlay, PaneIdConstants.X_AXIS)
      return true
    }
    return false
  }

  setPressedOverlayInfo (info: EventOverlayInfo): void {
    this._pressedOverlayInfo = info
  }

  getPressedOverlayInfo (): EventOverlayInfo {
    return this._pressedOverlayInfo
  }

  setHoverOverlayInfo (
    info: EventOverlayInfo,
    processOnMouseEnterEvent: ProcessOverlayEventCallback,
    processOnMouseLeaveEvent: ProcessOverlayEventCallback
  ): void {
    const { overlay, figureType, figureIndex, figure } = this._hoverOverlayInfo
    const infoOverlay = info.overlay
    if (
      overlay?.id !== infoOverlay?.id ||
      figureType !== info.figureType ||
      figureIndex !== info.figureIndex
    ) {
      this._hoverOverlayInfo = info
      if (overlay?.id !== infoOverlay?.id) {
        let ignoreUpdateFlag = false
        let sortFlag = false
        if (overlay !== null) {
          overlay.override({ zLevel: overlay.getPrevZLevel() })
          sortFlag = true
          if (processOnMouseLeaveEvent(overlay, figure)) {
            ignoreUpdateFlag = true
          }
        }

        if (infoOverlay !== null) {
          infoOverlay.setPrevZLevel(infoOverlay.zLevel)
          infoOverlay.override({ zLevel: Number.MAX_SAFE_INTEGER })
          sortFlag = true
          if (processOnMouseEnterEvent(infoOverlay, info.figure)) {
            ignoreUpdateFlag = true
          }
        }
        if (sortFlag) {
          this._sortOverlays()
        }
        if (!ignoreUpdateFlag) {
          this._chart.updatePane(UpdateLevel.Overlay)
        }
      }
    }
  }

  getHoverOverlayInfo (): EventOverlayInfo {
    return this._hoverOverlayInfo
  }

  setClickOverlayInfo (
    info: EventOverlayInfo,
    processOnSelectedEvent: ProcessOverlayEventCallback,
    processOnDeselectedEvent: ProcessOverlayEventCallback
  ): void {
    const { paneId, overlay, figureType, figure, figureIndex } = this._clickOverlayInfo
    const infoOverlay = info.overlay
    if (overlay?.id !== infoOverlay?.id || figureType !== info.figureType || figureIndex !== info.figureIndex) {
      this._clickOverlayInfo = info
      if (overlay?.id !== infoOverlay?.id) {
        if (isValid(overlay)) {
          processOnDeselectedEvent(overlay, figure)
        }
        if (isValid(infoOverlay)) {
          processOnSelectedEvent(infoOverlay, info.figure)
        }
        this._chart.updatePane(UpdateLevel.Overlay, info.paneId)
        if (paneId !== info.paneId) {
          this._chart.updatePane(UpdateLevel.Overlay, paneId)
        }
        this._chart.updatePane(UpdateLevel.Overlay, PaneIdConstants.X_AXIS)
      }
    }
  }

  getClickOverlayInfo (): EventOverlayInfo {
    return this._clickOverlayInfo
  }

  isOverlayEmpty (): boolean {
    return this._overlays.size === 0 && this._progressOverlayInfo === null
  }

  isOverlayDrawing (): boolean {
    return this._progressOverlayInfo?.overlay.isDrawing() ?? false
  }

  private _clearLastPriceMarkExtendTextUpdateTimer (): void {
    this._lastPriceMarkExtendTextUpdateTimers.forEach(timer => {
      clearInterval(timer)
    })
    this._lastPriceMarkExtendTextUpdateTimers = []
  }

  private _clearData (): void {
    this._dataLoadMore.backward = false
    this._dataLoadMore.forward = false
    this._loading = false
    this._dataList = []
    this._visibleRangeDataList = []
    this._visibleRangeHighLowPrice = [
      { x: 0, price: Number.MIN_SAFE_INTEGER },
      { x: 0, price: Number.MAX_SAFE_INTEGER }
    ]
    this._visibleRange = getDefaultVisibleRange()
    this._crosshair = {}
  }

  getChart (): Chart {
    return this._chart
  }

  destroy (): void {
    this._clearData()
    this._clearLastPriceMarkExtendTextUpdateTimer()
    this._taskScheduler.clear()
    this._overlays.clear()
    this._indicators.clear()
    this._actions.clear()
  }
}

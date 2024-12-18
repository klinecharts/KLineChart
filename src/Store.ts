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
import type { KLineData, VisibleRangeData } from './common/Data'
import type VisibleRange from './common/VisibleRange'
import type Coordinate from './common/Coordinate'
import { getDefaultVisibleRange } from './common/VisibleRange'
import TaskScheduler, { generateTaskId } from './common/TaskScheduler'
import type Crosshair from './common/Crosshair'
import type BarSpace from './common/BarSpace'
import type Precision from './common/Precision'
import Action from './common/Action'
import { ActionType, type ActionCallback } from './common/Action'
import { formatValue, type DateTime, formatTimestampToDateTime, formatTimestampToString, formatBigNumber, formatThousands, formatFoldDecimal } from './common/utils/format'
import { getDefaultStyles, type Styles, type TooltipLegend } from './common/Styles'
import { isArray, isString, isValid, isNumber, isBoolean, isFunction, merge } from './common/utils/typeChecks'
import { createId } from './common/utils/id'
import { binarySearchNearest } from './common/utils/number'
import { logWarn } from './common/utils/logger'
import { UpdateLevel } from './common/Updater'
import type { MouseTouchEvent } from './common/SyntheticEvent'
import { type LoadDataCallback, type LoadDataParams, LoadDataType } from './common/LoadDataCallback'
import { calcTextWidth } from './common/utils/canvas'

import type { Options, CustomApi, ThousandsSeparator, DecimalFold } from './Options'

import { IndicatorDataState, type IndicatorCreate, type IndicatorFilter } from './component/Indicator'
import type IndicatorImp from './component/Indicator'
import { IndicatorSeries } from './component/Indicator'
import { getIndicatorClass } from './extension/indicator/index'

import type OverlayImp from './component/Overlay'
import { type OverlayCreate, OVERLAY_ID_PREFIX, type OverlayFilter } from './component/Overlay'
import { getOverlayInnerClass } from './extension/overlay/index'

import { getStyles as getExtensionStyles } from './extension/styles/index'

import { PaneIdConstants } from './pane/types'

import type Chart from './Chart'

export interface TimeWeightTick {
  weight: number
  dataIndex: number
  dateTime: DateTime
  timestamp: number
}

export const TimeWeightConstants = {
  Year: 365 * 24 * 3600,
  Month: 30 * 24 * 3600,
  Day: 24 * 3600,
  Hour: 3600,
  Minute: 60,
  Second: 1
}

const BarSpaceLimitConstants = {
  MIN: 1,
  MAX: 50
}

const enum ScrollLimitRole {
  BarCount,
  Distance
}

export interface TooltipIcon {
  paneId: string
  indicatorName: string
  iconId: string
}

export interface ProgressOverlayInfo {
  paneId: string
  overlay: OverlayImp
  appointPaneFlag: boolean
}

export const enum EventOverlayInfoFigureType {
  None, Point, Other
}

export interface EventOverlayInfo {
  paneId: string
  overlay: Nullable<OverlayImp>
  figureType: EventOverlayInfoFigureType
  figureKey: string
  figureIndex: number
  attrsIndex: number
}

const DEFAULT_BAR_SPACE = 10

const DEFAULT_OFFSET_RIGHT_DISTANCE = 80

const BAR_GAP_RATIO = 0.2

export const SCALE_MULTIPLIER = 10

export interface Store {
  setStyles: (value: string | DeepPartial<Styles>) => void
  getStyles: () => Styles
  setCustomApi: (api: Partial<CustomApi>) => void
  getCustomApi: () => CustomApi
  setLocale: (locale: string) => void
  getLocale: () => string
  setTimezone: (timezone: string) => void
  getTimezone: () => string
  setThousandsSeparator: (thousandsSeparator: Partial<ThousandsSeparator>) => void
  getThousandsSeparator: () => ThousandsSeparator
  setDecimalFold: (decimalFold: Partial<DecimalFold>) => void
  getDecimalFold: () => DecimalFold
  getPrecision: () => Precision
  setPrecision: (precision: Partial<Precision>) => void
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
  setLoadMoreDataCallback: (callback: LoadDataCallback) => void
  overrideIndicator: (override: IndicatorCreate, paneId?: string) => boolean
  removeIndicator: (filter?: IndicatorFilter) => boolean
  overrideOverlay: (override: Partial<OverlayCreate>) => boolean
  removeOverlay: (filter?: OverlayFilter) => boolean
  setZoomEnabled: (enabled: boolean) => void
  isZoomEnabled: () => boolean
  setScrollEnabled: (enabled: boolean) => void
  isScrollEnabled: () => boolean
  clearData: () => void
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
  private readonly _customApi = {
    formatDate: (timestamp: number, format: string) => formatTimestampToString(this._dateTimeFormat, timestamp, format),
    formatBigNumber
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
   * Price and volume precision
   */
  private readonly _precision = { price: 2, volume: 0 }

  /**
   * Data source
   */
  private _dataList: KLineData[] = []

  /**
   * Load more data callback
   */
  private _loadMoreDataCallback: Nullable<LoadDataCallback> = null

  /**
   * Is loading data flag
   */
  private _loading = true

  /**
  * Whether there are forward and backward more flag
   */
  private readonly _loadDataMore = { forward: false, backward: false }

  /**
     * Time format
     */
  private _dateTimeFormat: Intl.DateTimeFormat

  /**
   * Scale enabled flag
   */
  private _zoomEnabled = true

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
  private _scrollLimitRole = ScrollLimitRole.BarCount

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

  private readonly _timeWeightTickMap = new Map<number, TimeWeightTick[]>()

  private _timeWeightTickList: TimeWeightTick[] = []

  private _minTimeDifference = Number.MAX_SAFE_INTEGER

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
   * Active tooltip icon info
   */
  private _activeTooltipIcon: Nullable<TooltipIcon> = null

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
  private readonly _taskScheduler = new TaskScheduler()

  /**
   * Overlay
   */
  private readonly _overlays = new Map<string, OverlayImp[]>()

  /**
   * Overlay information in painting
   */
  private _progressOverlayInfo: Nullable<ProgressOverlayInfo> = null

  /**
   * Overlay information by the mouse pressed
   */
  private _pressedOverlayInfo: EventOverlayInfo = {
    paneId: '',
    overlay: null,
    figureType: EventOverlayInfoFigureType.None,
    figureKey: '',
    figureIndex: -1,
    attrsIndex: -1
  }

  /**
   * Overlay information by hover
   */
  private _hoverOverlayInfo: EventOverlayInfo = {
    paneId: '',
    overlay: null,
    figureType: EventOverlayInfoFigureType.None,
    figureKey: '',
    figureIndex: -1,
    attrsIndex: -1
  }

  /**
   * Overlay information by the mouse click
   */
  private _clickOverlayInfo: EventOverlayInfo = {
    paneId: '',
    overlay: null,
    figureType: EventOverlayInfoFigureType.None,
    figureKey: '',
    figureIndex: -1,
    attrsIndex: -1
  }

  constructor (chart: Chart, options?: Options) {
    this._chart = chart
    this._calcOptimalBarSpace()
    this._lastBarRightSideDiffBarCount = this._offsetRightDistance / this._barSpace
    const { styles, locale, timezone, customApi, thousandsSeparator, decimalFold } = options ?? {}
    if (isValid(styles)) {
      this.setStyles(styles)
    }
    if (isString(locale)) {
      this.setLocale(locale)
    }
    this.setTimezone(timezone ?? '')
    if (isValid(customApi)) {
      this.setCustomApi(customApi)
    }
    if (isValid(thousandsSeparator)) {
      this.setThousandsSeparator(thousandsSeparator)
    }
    if (isValid(decimalFold)) {
      this.setDecimalFold(decimalFold)
    }
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
    if (isArray(styles?.candle?.tooltip?.custom)) {
      this._styles.candle.tooltip.custom = styles.candle.tooltip.custom as TooltipLegend[]
    }
  }

  getStyles (): Styles { return this._styles }

  setCustomApi (api: Partial<CustomApi>): void {
    merge(this._customApi, api)
  }

  getCustomApi (): CustomApi { return this._customApi }

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
        this._classifyTimeWeightTicks(this._dataList)
        this._dateTimeFormat = dateTimeFormat
      }
    }
  }

  getTimezone (): string { return this._dateTimeFormat.resolvedOptions().timeZone }

  setThousandsSeparator (thousandsSeparator: Partial<ThousandsSeparator>): void {
    merge(this._thousandsSeparator, thousandsSeparator)
  }

  getThousandsSeparator (): ThousandsSeparator { return this._thousandsSeparator }

  setDecimalFold (decimalFold: Partial<DecimalFold>): void { merge(this._decimalFold, decimalFold) }

  getDecimalFold (): DecimalFold { return this._decimalFold }

  getPrecision (): Precision {
    return this._precision
  }

  setPrecision (precision: Partial<Precision>): void {
    merge(this._precision, precision)
    this._synchronizeIndicatorSeriesPrecision()
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

  addData (
    data: KLineData | KLineData[],
    type: LoadDataType,
    more?: { forward: boolean, backward: boolean }
  ): void {
    let success = false
    let adjustFlag = false
    let dataLengthChange = 0
    if (isArray<KLineData>(data)) {
      dataLengthChange = data.length
      switch (type) {
        case LoadDataType.Init: {
          this.clearData()
          this._dataList = data
          this._loadDataMore.backward = more?.forward ?? false
          this._loadDataMore.forward = more?.forward ?? false
          this._classifyTimeWeightTicks(this._dataList)
          this.setOffsetRightDistance(this._offsetRightDistance)
          adjustFlag = true
          break
        }
        case LoadDataType.Backward: {
          this._classifyTimeWeightTicks(data, true)
          this._dataList = this._dataList.concat(data)
          this._loadDataMore.backward = more?.backward ?? false
          adjustFlag = dataLengthChange > 0
          break
        }
        case LoadDataType.Forward: {
          this._dataList = data.concat(this._dataList)
          this._classifyTimeWeightTicks(this._dataList)
          this._loadDataMore.forward = more?.forward ?? false
          adjustFlag = dataLengthChange > 0
          break
        }
        default: {
          break
        }
      }
      this._loading = false
      success = true
    } else {
      const dataCount = this._dataList.length
      // Determine where individual data should be added
      const timestamp = data.timestamp
      const lastDataTimestamp = formatValue(this._dataList[dataCount - 1], 'timestamp', 0) as number
      if (timestamp > lastDataTimestamp) {
        this._classifyTimeWeightTicks([data], true)
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
    if (success) {
      if (adjustFlag) {
        this._adjustVisibleRange()
        this.setCrosshair(this._crosshair, true)
        const filterMap = this.getIndicatorsByFilter({})
        filterMap.forEach((indicators, paneId) => {
          indicators.forEach(indicator => {
            this._addIndicatorCalcTask(paneId, indicator, type)
          })
        })
        this._chart.layout({
          measureWidth: true,
          update: true,
          buildYAxisTick: true
        })
      }
    }
  }

  setLoadMoreDataCallback (callback: LoadDataCallback): void {
    this._loadMoreDataCallback = callback
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

  private _classifyTimeWeightTicks (newDataList: KLineData[], isUpdate?: boolean): void {
    let baseDataIndex = 0
    let prevDateTime: Nullable<DateTime> = null
    let prevTimestamp: Nullable<number> = null
    if (isUpdate ?? false) {
      baseDataIndex = this._dataList.length
    } else {
      this._timeWeightTickMap.clear()
      this._minTimeDifference = Number.MAX_SAFE_INTEGER
    }
    for (let i = 0; i < newDataList.length; i++) {
      const timestamp = newDataList[i].timestamp
      let weight = TimeWeightConstants.Second
      const dateTime = formatTimestampToDateTime(this._dateTimeFormat, timestamp)
      if (isValid(prevDateTime)) {
        if (dateTime.YYYY !== prevDateTime.YYYY) {
          weight = TimeWeightConstants.Year
        } else if (dateTime.MM !== prevDateTime.MM) {
          weight = TimeWeightConstants.Month
        } else if (dateTime.DD !== prevDateTime.DD) {
          weight = TimeWeightConstants.Day
        } else if (dateTime.HH !== prevDateTime.HH) {
          weight = TimeWeightConstants.Hour
        } else if (dateTime.mm !== prevDateTime.mm) {
          weight = TimeWeightConstants.Minute
        } else {
          weight = TimeWeightConstants.Second
        }
      }
      if (isNumber(prevTimestamp)) {
        this._minTimeDifference = Math.min(this._minTimeDifference, timestamp - prevTimestamp)
      }
      const currentTimeWeightList = this._timeWeightTickMap.get(weight) ?? []
      currentTimeWeightList.push({ dataIndex: i + baseDataIndex, weight, dateTime, timestamp })
      this._timeWeightTickMap.set(weight, currentTimeWeightList)
      prevDateTime = dateTime
      prevTimestamp = timestamp
    }
    this._buildTimeWeightTickList()
  }

  private _buildTimeWeightTickList (): void {
    const styles = this._styles.xAxis.tickText
    const space = Math.max(calcTextWidth('0000-00-00 00:00:00', styles.size, styles.weight, styles.family), 146)
    const barCount = Math.ceil(
      space / this._barSpace
    )
    let optTimeWeightTickList: TimeWeightTick[] = []
    Array.from(this._timeWeightTickMap.keys()).sort((w1, w2) => w2 - w1).forEach(weight => {
      const currentTimeWeightTickList = this._timeWeightTickMap.get(weight)!
      const prevOptTimeWeightTickList = optTimeWeightTickList
      optTimeWeightTickList = []

      const prevOptTimeWeightTickListLength = prevOptTimeWeightTickList.length
      let prevOptTimeWeightTickListPointer = 0
      const currentTimeWeightTickListLength = currentTimeWeightTickList.length

      let rightIndex = Infinity
      let leftIndex = -Infinity
      for (let i = 0; i < currentTimeWeightTickListLength; i++) {
        const timeWeightTick = currentTimeWeightTickList[i]
        const currentIndex = timeWeightTick.dataIndex

        while (prevOptTimeWeightTickListPointer < prevOptTimeWeightTickListLength) {
          const lastTimeWeightTick = prevOptTimeWeightTickList[prevOptTimeWeightTickListPointer]
          const lastIndex = lastTimeWeightTick.dataIndex
          if (lastIndex < currentIndex) {
            prevOptTimeWeightTickListPointer++
            optTimeWeightTickList.push(lastTimeWeightTick)
            leftIndex = lastIndex
            rightIndex = Infinity
          } else {
            rightIndex = lastIndex
            break
          }
        }

        if (rightIndex - currentIndex >= barCount && currentIndex - leftIndex >= barCount) {
          optTimeWeightTickList.push(timeWeightTick)
          leftIndex = currentIndex
        }
      }

      for (; prevOptTimeWeightTickListPointer < prevOptTimeWeightTickListLength; prevOptTimeWeightTickListPointer++) {
        optTimeWeightTickList.push(prevOptTimeWeightTickList[prevOptTimeWeightTickListPointer])
      }
    })
    this._timeWeightTickList = optTimeWeightTickList
  }

  getTimeWeightTickList (): TimeWeightTick[] {
    return this._timeWeightTickList
  }

  private _adjustVisibleRange (): void {
    const totalBarCount = this._dataList.length
    const visibleBarCount = this._totalBarSpace / this._barSpace

    let leftMinVisibleBarCount = 0
    let rightMinVisibleBarCount = 0

    if (this._scrollLimitRole === ScrollLimitRole.Distance) {
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
    this.executeAction(ActionType.OnVisibleRangeChange, this._visibleRange)
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
        data: kLineData
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
    if (!this._loading && isValid(this._loadMoreDataCallback)) {
      let params: Nullable<LoadDataParams> = null
      if (from === 0) {
        if (this._loadDataMore.forward) {
          this._loading = true
          params = {
            type: LoadDataType.Forward,
            data: this._dataList[0] ?? null,
            callback: (data: KLineData[], more?: boolean) => {
              this.addData(data, LoadDataType.Forward, { forward: more ?? false, backward: more ?? false })
            }
          }
        }
      } else if (to === totalBarCount) {
        if (this._loadDataMore.backward) {
          this._loading = true
          params = {
            type: LoadDataType.Backward,
            data: this._dataList[totalBarCount - 1] ?? null,
            callback: (data: KLineData[], more?: boolean) => {
              this.addData(data, LoadDataType.Backward, { forward: more ?? false, backward: more ?? false })
            }
          }
        }
      }
      if (isValid(params)) {
        this._loadMoreDataCallback(params)
      }
    }
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
    this._buildTimeWeightTickList()
    this._calcOptimalBarSpace()
    adjustBeforeFunc?.()
    this._adjustVisibleRange()
    this.setCrosshair(this._crosshair, true)
    this._chart.layout({
      measureWidth: true,
      update: true,
      buildYAxisTick: true
    })
  }

  setTotalBarSpace (totalSpace: number): void {
    if (this._totalBarSpace !== totalSpace) {
      this._totalBarSpace = totalSpace
      this._adjustVisibleRange()
      this.setCrosshair(this._crosshair, true)
    }
  }

  setOffsetRightDistance (distance: number, isUpdate?: boolean): this {
    this._offsetRightDistance = this._scrollLimitRole === ScrollLimitRole.Distance ? Math.min(this._maxOffsetDistance.right, distance) : distance
    this._lastBarRightSideDiffBarCount = this._offsetRightDistance / this._barSpace
    if (isUpdate ?? false) {
      this._adjustVisibleRange()
      this.setCrosshair(this._crosshair, true)
      this._chart.layout({
        measureWidth: true,
        update: true,
        buildYAxisTick: true
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
    this._scrollLimitRole = ScrollLimitRole.Distance
    this._maxOffsetDistance.left = distance
  }

  setMaxOffsetRightDistance (distance: number): void {
    this._scrollLimitRole = ScrollLimitRole.Distance
    this._maxOffsetDistance.right = distance
  }

  setLeftMinVisibleBarCount (barCount: number): void {
    this._scrollLimitRole = ScrollLimitRole.BarCount
    this._minVisibleBarCount.left = barCount
  }

  setRightMinVisibleBarCount (barCount: number): void {
    this._scrollLimitRole = ScrollLimitRole.BarCount
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
    this.setCrosshair(this._crosshair, true)
    this._chart.layout({
      measureWidth: true,
      update: true,
      buildYAxisTick: true
    })
    const realDistance = Math.round(
      prevLastBarRightSideDistance - this._lastBarRightSideDiffBarCount * this._barSpace
    )
    if (realDistance !== 0) {
      this.executeAction(ActionType.OnScroll, { distance: realDistance })
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
    const lastIndex = length - 1
    if (dataIndex > lastIndex) {
      return this._dataList[lastIndex].timestamp + this._minTimeDifference * (dataIndex - lastIndex)
    }
    if (dataIndex < 0) {
      return this._dataList[0].timestamp - this._minTimeDifference * Math.abs(dataIndex)
    }
    return null
  }

  timestampToDataIndex (timestamp: number): number {
    const length = this._dataList.length
    if (length === 0) {
      return 0
    }
    const lastIndex = length - 1
    const lastTimestamp = this._dataList[lastIndex].timestamp
    if (timestamp > lastTimestamp) {
      return lastIndex + Math.floor((timestamp - lastTimestamp) / this._minTimeDifference)
    }
    const firstTimestamp = this._dataList[0].timestamp
    if (timestamp < firstTimestamp) {
      return Math.floor((timestamp - firstTimestamp) / this._minTimeDifference)
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

  zoom (scale: number, coordinate?: Partial<Coordinate>): void {
    if (!this._zoomEnabled) {
      return
    }
    let zoomCoordinate: Nullable<Partial<Coordinate>> = coordinate ?? null
    if (!isNumber(zoomCoordinate?.x)) {
      zoomCoordinate = { x: this._crosshair.x ?? this._totalBarSpace / 2 }
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
      this.executeAction(ActionType.OnZoom, { scale: realScale })
    }
  }

  setZoomEnabled (enabled: boolean): void {
    this._zoomEnabled = enabled
  }

  isZoomEnabled (): boolean {
    return this._zoomEnabled
  }

  setScrollEnabled (enabled: boolean): void {
    this._scrollEnabled = enabled
  }

  isScrollEnabled (): boolean {
    return this._scrollEnabled
  }

  setCrosshair (crosshair?: Crosshair, notInvalidate?: boolean): void {
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
      prevCrosshair.x !== cr.x || prevCrosshair.y !== cr.y || prevCrosshair.paneId !== cr.paneId
    ) {
      if (isValid(kLineData)) {
        this._chart.crosshairChange(this._crosshair)
      }
      if (!(notInvalidate ?? false)) {
        this._chart.updatePane(UpdateLevel.Overlay)
      }
    }
  }

  /**
   * 获取crosshair信息
   * @returns
   */
  getCrosshair (): Crosshair {
    return this._crosshair
  }

  setActiveTooltipIcon (icon?: TooltipIcon): void {
    this._activeTooltipIcon = icon ?? null
  }

  getActiveTooltipIcon (): Nullable<TooltipIcon> {
    return this._activeTooltipIcon
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

  private _addIndicatorCalcTask (paneId: string, indicator: IndicatorImp, loadDataType: LoadDataType): void {
    this._taskScheduler.addTask({
      id: generateTaskId(paneId, indicator.name),
      handler: () => {
        indicator.onDataStateChange?.({
          state: IndicatorDataState.Loading,
          type: loadDataType,
          indicator
        })
        indicator.calcImp(this._dataList).then(result => {
          if (result) {
            this._chart.layout({
              measureWidth: true,
              update: true,
              buildYAxisTick: true
            })
            indicator.onDataStateChange?.({
              state: IndicatorDataState.Ready,
              type: loadDataType,
              indicator
            })
          }
        }).catch(() => {
          indicator.onDataStateChange?.({
            state: IndicatorDataState.Error,
            type: loadDataType,
            indicator
          })
        })
      }
    })
  }

  addIndicator (create: IndicatorCreate, paneId: string, isStack: boolean): boolean {
    const { name } = create
    let paneIndicators = this._indicators.get(paneId)
    if (isValid(paneIndicators)) {
      if (isValid(paneIndicators.find(i => i.name === name))) {
        return false
      }
    }
    if (!isValid(paneIndicators)) {
      paneIndicators = []
    }
    const IndicatorClazz = getIndicatorClass(name)!
    const indicator = new IndicatorClazz()

    this._synchronizeIndicatorSeriesPrecision(indicator)
    indicator.override(create)
    if (!isStack) {
      this.removeIndicator({ paneId })
      paneIndicators = []
    }
    paneIndicators.push(indicator)
    this._indicators.set(paneId, paneIndicators)
    this._sortIndicators(paneId)
    this._addIndicatorCalcTask(paneId, indicator, LoadDataType.Init)
    return true
  }

  getIndicatorsByPaneId (paneId: string): IndicatorImp[] {
    return this._indicators.get(paneId) ?? []
  }

  getIndicatorsByFilter (filter: IndicatorFilter): Map<string, IndicatorImp[]> {
    const find: ((indicators: IndicatorImp[], name?: string) => IndicatorImp[]) = (indicators, name) => indicators.filter(indicator => (!isValid(name) || indicator.name === name))
    const { paneId, name } = filter
    const map = new Map<string, IndicatorImp[]>()
    if (isValid(paneId)) {
      const indicators = this.getIndicatorsByPaneId(paneId)
      map.set(paneId, find(indicators, name))
    } else {
      if (isValid(name)) {
        this._indicators.forEach((indicators, paneId) => {
          map.set(paneId, find(indicators, name))
        })
      } else {
        this._indicators.forEach((indicators, paneId) => {
          map.set(paneId, find(indicators))
        })
      }
    }
    return map
  }

  removeIndicator (filter: IndicatorFilter): boolean {
    let removed = false
    const filterMap = this.getIndicatorsByFilter(filter)
    filterMap.forEach((indicators, paneId) => {
      const paneIndicators = this.getIndicatorsByPaneId(paneId)
      indicators.forEach(indicator => {
        const index = paneIndicators.findIndex(ins => ins.name === indicator.name)
        if (index > -1) {
          this._taskScheduler.removeTask(generateTaskId(paneId, indicator.name))
          paneIndicators.splice(index, 1)
          removed = true
        }
      })
      if (paneIndicators.length === 0) {
        this._indicators.delete(paneId)
      }
    })
    return removed
  }

  hasIndicators (paneId: string): boolean {
    return this._indicators.has(paneId)
  }

  private _synchronizeIndicatorSeriesPrecision (indicator?: IndicatorImp): void {
    const { price: pricePrecision, volume: volumePrecision } = this._precision
    const synchronize: ((indicator: IndicatorImp) => void) = indicator => {
      switch (indicator.series) {
        case IndicatorSeries.Price: {
          indicator.setSeriesPrecision(pricePrecision)
          break
        }
        case IndicatorSeries.Volume: {
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

  overrideIndicator (create: IndicatorCreate, paneId?: string): boolean {
    const { name } = create
    let indictors = new Map<string, IndicatorImp[]>()
    if (isValid(paneId)) {
      const paneIndicators = this._indicators.get(paneId)
      if (isValid(paneIndicators)) {
        indictors.set(paneId, paneIndicators)
      }
    } else {
      indictors = this._indicators
    }
    let updateFlag = false
    let sortFlag = false
    indictors.forEach((paneIndicators, paneId) => {
      const indicator = paneIndicators.find(i => i.name === name)
      if (isValid(indicator)) {
        indicator.override(create)
        const { calc, draw, sort } = indicator.shouldUpdateImp()
        if (sort) {
          sortFlag = true
        }
        if (calc) {
          this._addIndicatorCalcTask(paneId, indicator, LoadDataType.Update)
        } else {
          if (draw) {
            updateFlag = true
          }
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

  getOverlaysByFilter (filter: OverlayFilter): Map<string, OverlayImp[]> {
    const { id, groupId, paneId, name } = filter
    const find: ((overlays: OverlayImp[]) => OverlayImp[]) = (overlays) => overlays.filter(overlay => {
      if (isValid(id)) {
        return overlay.id === id
      } else {
        if (isValid(groupId)) {
          return overlay.groupId === groupId && (!isValid(name) || overlay.name === name)
        }
      }
      return !isValid(name) || overlay.name === name
    })

    const map = new Map<string, OverlayImp[]>()
    if (isValid(paneId)) {
      const overlays = this.getOverlaysByPaneId(paneId)
      map.set(paneId, find(overlays))
    } else {
      this._overlays.forEach((overlays, paneId) => {
        map.set(paneId, find(overlays))
      })
    }
    const progressOverlay = this._progressOverlayInfo?.overlay
    if (isValid(progressOverlay)) {
      const paneOverlays = map.get(progressOverlay.paneId) ?? []
      paneOverlays.push(progressOverlay)
      map.set(progressOverlay.paneId, paneOverlays)
    }
    return map
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
        for (const [, overlays] of this._overlays) {
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
        create.id = id
        create.groupId ??= id
        overlay.override(create)
        const paneId = overlay.paneId
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

  overrideOverlay (create: Partial<OverlayCreate>): boolean {
    let sortFlag = false
    const updatePaneIds: string[] = []
    const filterMap = this.getOverlaysByFilter(create)
    filterMap.forEach((overlays, paneId) => {
      overlays.forEach(overlay => {
        overlay.override(create)
        const { sort, draw } = overlay.shouldUpdate()
        if (sort) {
          sortFlag = true
        }
        if (sort || draw) {
          if (!updatePaneIds.includes(paneId)) {
            updatePaneIds.push(paneId)
          }
        }
      })
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
    const filterMap = this.getOverlaysByFilter(filter)
    filterMap.forEach((overlays, paneId) => {
      const paneOverlays = this.getOverlaysByPaneId(paneId)
      overlays.forEach(overlay => {
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

  setHoverOverlayInfo (info: EventOverlayInfo, event: MouseTouchEvent): void {
    const { overlay, figureType, figureKey, figureIndex } = this._hoverOverlayInfo
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
          sortFlag = true
          if (isFunction(overlay.onMouseLeave)) {
            overlay.onMouseLeave({ chart: this._chart, overlay, figureKey, figureIndex, ...event })
            ignoreUpdateFlag = true
          }
        }

        if (infoOverlay !== null) {
          sortFlag = true
          if (isFunction(infoOverlay.onMouseEnter)) {
            infoOverlay.onMouseEnter({ chart: this._chart, overlay: infoOverlay, figureKey: info.figureKey, figureIndex: info.figureIndex, ...event })
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

  setClickOverlayInfo (info: EventOverlayInfo, event: MouseTouchEvent): void {
    const { paneId, overlay, figureType, figureKey, figureIndex } = this._clickOverlayInfo
    const infoOverlay = info.overlay
    if (!(infoOverlay?.isDrawing() ?? false)) {
      infoOverlay?.onClick?.({ chart: this._chart, overlay: infoOverlay, figureKey: info.figureKey, figureIndex: info.figureIndex, ...event })
    }
    if (overlay?.id !== infoOverlay?.id || figureType !== info.figureType || figureIndex !== info.figureIndex) {
      this._clickOverlayInfo = info
      if (overlay?.id !== infoOverlay?.id) {
        overlay?.onDeselected?.({ chart: this._chart, overlay, figureKey, figureIndex, ...event })
        infoOverlay?.onSelected?.({ chart: this._chart, overlay: infoOverlay, figureKey: info.figureKey, figureIndex: info.figureIndex, ...event })
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

  clearData (): void {
    this._loadDataMore.backward = false
    this._loadDataMore.forward = false
    this._loading = true
    this._dataList = []
    this._visibleRangeDataList = []
    this._visibleRangeHighLowPrice = [
      { x: 0, price: Number.MIN_SAFE_INTEGER },
      { x: 0, price: Number.MAX_SAFE_INTEGER }
    ]
    this._visibleRange = getDefaultVisibleRange()
    this._timeWeightTickMap.clear()
    this._timeWeightTickList = []
    this._crosshair = {}
    this._activeTooltipIcon = null
  }

  getChart (): Chart {
    return this._chart
  }
}

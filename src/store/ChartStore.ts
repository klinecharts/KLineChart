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

import type Nullable from '../common/Nullable'
import type DeepPartial from '../common/DeepPartial'
import type { KLineData, VisibleRangeData } from '../common/Data'
import type VisibleRange from '../common/VisibleRange';
import type Coordinate from '../common/Coordinate';
import { getDefaultVisibleRange } from '../common/VisibleRange'
import type BarSpace from '../common/BarSpace';
import type Precision from '../common/Precision'
import { ActionType } from '../common/Action';
import { formatValue, type DateTime, formatDateToDateTime } from '../common/utils/format'
import { getDefaultStyles, type Styles, type TooltipLegend } from '../common/Styles'
import { isArray, isString, isValid, isNumber, merge } from '../common/utils/typeChecks'
import { binarySearchNearest } from '../common/utils/number'
import { logWarn } from '../common/utils/logger'
import { calcTextWidth } from '../common/utils/canvas';
import { type LoadDataCallback, type LoadDataParams, LoadDataType } from '../common/LoadDataCallback'

import { getDefaultCustomApi, type CustomApi, defaultLocale, type Options } from '../Options'

import IndicatorStore from './IndicatorStore'
import TooltipStore from './TooltipStore'
import OverlayStore from './OverlayStore'
import ActionStore from './ActionStore'

import { getStyles } from '../extension/styles/index'

import type Chart from '../Chart'

export interface TimeTick {
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

const DEFAULT_BAR_SPACE = 10

const DEFAULT_OFFSET_RIGHT_DISTANCE = 80

const BAR_GAP_RATIO = 0.2

export const SCALE_MULTIPLIER = 10

export default class ChartStore {
  /**
   * Internal chart
   */
  private readonly _chart: Chart

  /**
   * Chart options
   */
  private readonly _options = {
    styles: getDefaultStyles(),
    customApi: getDefaultCustomApi(),
    locale: defaultLocale,
    thousandsSeparator: ',',
    decimalFoldThreshold: 3,
    timezone: 'auto'
  }

  /**
   * Price and volume precision
   */
  private _precision = { price: 2, volume: 0 }

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

  private _cacheVisibleRange = getDefaultVisibleRange()

  private readonly _timeTicks = new Map<number, TimeTick[]>()

  private _visibleRangeTimeTickList: TimeTick[] = []

  /**
   * Indicator store
   */
  private readonly _indicatorStore = new IndicatorStore(this)

  /**
   * Overlay store
   */
  private readonly _overlayStore = new OverlayStore(this)

  /**
   * Tooltip store
   */
  private readonly _tooltipStore = new TooltipStore(this)

  /**
   * Chart action store
   */
  private readonly _actionStore = new ActionStore()

  /**
   * Visible data array
   */
  private _visibleRangeDataList: VisibleRangeData[] = []

  /**
   * Visible highest lowest price data
   */
  private _visibleRangeHighLowPrice = [
    { x: 0, price: Number.MIN_SAFE_INTEGER },
    { x: 0, price: Number.MAX_SAFE_INTEGER },
  ]

  constructor (chart: Chart, options?: Options) {
    this._chart = chart
    this._calcOptimalBarSpace()
    this._lastBarRightSideDiffBarCount = this._offsetRightDistance / this._barSpace
    this.setOptions(options)
  }

  setOptions (options?: Options): void {
    if (
      !isValid(this._dateTimeFormat) ||
      (isString(options?.timezone) && options.timezone !== this._options.timezone)
    ) {
      const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
      if (isString(options?.timezone) && options.timezone !== 'auto') {
        dateTimeFormatOptions.timeZone = options.timezone
      }
      let dateTimeFormat: Nullable<Intl.DateTimeFormat> = null
      try {
        dateTimeFormat = new Intl.DateTimeFormat('en', dateTimeFormatOptions)
      } catch (e) {
        logWarn('', '', 'Timezone is error!!!')
      }
      if (dateTimeFormat !== null) {
        this._classifyTimeTicks(this._dataList)
        this._adjustVisibleRangeTimeTickList()
        this._dateTimeFormat = dateTimeFormat
      }
    }
    merge(this._options, options)
    const styles = options?.styles
    if (isValid(styles)) {
      let ss: Nullable<DeepPartial<Styles>> = null
      if (isString(styles)) {
        ss = getStyles(styles)
      } else {
        ss = styles
      }
      // `candle.tooltip.custom` should override
      if (isArray(ss?.candle?.tooltip?.custom)) {
        this._options.styles.candle.tooltip.custom = ss.candle.tooltip.custom as TooltipLegend[]
      }
    }
  }

  getOptions (): Required<Omit<Options, 'layout'>> & { customApi: CustomApi, styles: Styles } {
    return this._options
  }

  getPrecision (): Precision {
    return this._precision
  }

  setPrecision (precision: Precision): this {
    this._precision = precision
    this._indicatorStore.synchronizeSeriesPrecision()
    return this
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
          this.clear()
          this._dataList = data
          this._loadDataMore.backward = more?.forward ?? false
          this._loadDataMore.forward = more?.forward ?? false
          this._classifyTimeTicks(this._dataList)
          this.setOffsetRightDistance(this._offsetRightDistance)
          adjustFlag = true
          break
        }
        case LoadDataType.Backward: {
          this._classifyTimeTicks(data, true)
          this._dataList = this._dataList.concat(data)
          this._loadDataMore.backward = more?.backward ?? false
          adjustFlag = dataLengthChange > 0
          break
        }
        case LoadDataType.Forward: {
          this._dataList = data.concat(this._dataList)
          this._classifyTimeTicks(this._dataList)
          this._loadDataMore.forward = more?.forward ?? false
          adjustFlag = dataLengthChange > 0
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
        this._classifyTimeTicks([data], true)
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
      this._overlayStore.updatePointPosition(dataLengthChange, type)
      if (adjustFlag) {
        this._adjustVisibleRange()
        this._tooltipStore.recalculateCrosshair(true)
        this._indicatorStore.calcInstance(type, {})
        this._chart.adjustPaneViewport(false, true, true, true)
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

  private _classifyTimeTicks (newDataList: KLineData[], isUpdate?: boolean): void {
    let baseDataIndex = 0
    let prevKLineData: Nullable<KLineData> = null
    if (isUpdate ?? false) {
      baseDataIndex = this._dataList.length
      prevKLineData = this._dataList[baseDataIndex - 1]
    } else {
      this._timeTicks.clear()
    }

    for (let i = 0; i < newDataList.length; i++) {
      const kLineData = newDataList[i]
      let weight = TimeWeightConstants.Second
      const dateTime = formatDateToDateTime(this._dateTimeFormat, kLineData.timestamp)
      if (isValid(prevKLineData)) {
        const prevDateTime = formatDateToDateTime(this._dateTimeFormat, prevKLineData.timestamp)
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
      const tickList = this._timeTicks.get(weight) ?? []
      tickList.push({ dataIndex: i + baseDataIndex, weight, dateTime, timestamp: kLineData.timestamp })
      this._timeTicks.set(weight, tickList)
      prevKLineData = kLineData
    }
  }

  private _adjustVisibleRangeTimeTickList (): void {
    const tickTextStyles = this._options.styles.xAxis.tickText
    const width = Math.max(
      Math.ceil(this._totalBarSpace / 10),
      calcTextWidth('0000-00-00 00:00', tickTextStyles.size, tickTextStyles.weight, tickTextStyles.family)
    )
    const barCount = Math.ceil(width / this._barSpace)
    let tickList: TimeTick[] = []
    Array.from(this._timeTicks.keys()).sort((w1, w2) => w2 - w1).forEach(key => {
      const prevTickList = tickList
      tickList = []

      const prevTickListLength = prevTickList.length
      let prevTickListPointer = 0
      const currentTicks = this._timeTicks.get(key)!
      const currentTicksLength = currentTicks.length

      let rightIndex = Infinity
      let leftIndex = -Infinity
      for (let i = 0; i < currentTicksLength; i++) {
        const tick = currentTicks[i]
        const currentIndex = tick.dataIndex

        while (prevTickListPointer < prevTickListLength) {
          const lastMark = prevTickList[prevTickListPointer]
          const lastIndex = lastMark.dataIndex
          if (lastIndex < currentIndex) {
            prevTickListPointer++
            tickList.push(lastMark)
            leftIndex = lastIndex
            rightIndex = Infinity
          } else {
            rightIndex = lastIndex
            break
          }
        }

        if (rightIndex - currentIndex >= barCount && currentIndex - leftIndex >= barCount) {
          tickList.push(tick)
          leftIndex = currentIndex
        }
      }

      for (; prevTickListPointer < prevTickListLength; prevTickListPointer++) {
        tickList.push(prevTickList[prevTickListPointer])
      }
    })
    this._visibleRangeTimeTickList = []
    for (let i = 0; i < tickList.length; i++) {
      const tick = tickList[i]
      if (tick.dataIndex >= this._visibleRange.from && tick.dataIndex <= this._visibleRange.to) {
        this._visibleRangeTimeTickList.push(tick)
      }
    }
  }

  getVisibleRangeTimeTickList (): TimeTick[] {
    return this._visibleRangeTimeTickList
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
    this.getActionStore().execute(ActionType.OnVisibleRangeChange, this._visibleRange)
    this._visibleRangeDataList = []
    this._visibleRangeHighLowPrice = [
      { x: 0, price: Number.MIN_SAFE_INTEGER },
      { x: 0, price: Number.MAX_SAFE_INTEGER },
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
    if (
      this._cacheVisibleRange.from !== this._visibleRange.from ||
      this._cacheVisibleRange.to !== this._visibleRange.to
    ) {
      this._cacheVisibleRange = { ...this._visibleRange }
      this._adjustVisibleRangeTimeTickList()
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

  getDateTimeFormat (): Intl.DateTimeFormat {
    return this._dateTimeFormat
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
    this.getTooltipStore().recalculateCrosshair(true)
    this._chart.adjustPaneViewport(false, true, true, true)
  }

  setTotalBarSpace (totalSpace: number): void {
    if (this._totalBarSpace !== totalSpace) {
      this._totalBarSpace = totalSpace
      this._adjustVisibleRange()
      this.getTooltipStore().recalculateCrosshair(true)
    }
  }

  setOffsetRightDistance (distance: number, isUpdate?: boolean): this {
    this._offsetRightDistance = this._scrollLimitRole === ScrollLimitRole.Distance ? Math.min(this._maxOffsetDistance.right, distance) : distance
    this._lastBarRightSideDiffBarCount = this._offsetRightDistance / this._barSpace
    if (isUpdate ?? false) {
      this._adjustVisibleRange()
      this.getTooltipStore().recalculateCrosshair(true)
      this._chart.adjustPaneViewport(false, true, true, true)
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

  setLastBarRightSideDiffBarCount (barCount: number): this {
    this._lastBarRightSideDiffBarCount = barCount
    return this
  }

  setMaxOffsetLeftDistance (distance: number): this {
    this._scrollLimitRole = ScrollLimitRole.Distance
    this._maxOffsetDistance.left = distance
    return this
  }

  setMaxOffsetRightDistance (distance: number): this {
    this._scrollLimitRole = ScrollLimitRole.Distance
    this._maxOffsetDistance.right = distance
    return this
  }

  setLeftMinVisibleBarCount (barCount: number): this {
    this._scrollLimitRole = ScrollLimitRole.BarCount
    this._minVisibleBarCount.left = barCount
    return this
  }

  setRightMinVisibleBarCount (barCount: number): this {
    this._scrollLimitRole = ScrollLimitRole.BarCount
    this._minVisibleBarCount.right = barCount
    return this
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
    this.getTooltipStore().recalculateCrosshair(true)
    this.getChart().adjustPaneViewport(false, true, true, true)
    const realDistance = Math.round(
      prevLastBarRightSideDistance - this._lastBarRightSideDiffBarCount * this._barSpace
    )
    if (realDistance !== 0) {
      this.getActionStore().execute(ActionType.OnScroll, { distance: realDistance })
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
    const data = this.getDataByDataIndex(dataIndex)
    return data?.timestamp ?? null
  }

  timestampToDataIndex (timestamp: number): number {
    if (this._dataList.length === 0) {
      return 0
    }
    return binarySearchNearest(this._dataList, 'timestamp', timestamp)
  }

  dataIndexToCoordinate (dataIndex: number): number {
    const dataCount = this._dataList.length
    const deltaFromRight = dataCount + this._lastBarRightSideDiffBarCount - dataIndex
    // return Math.floor(this._totalBarSpace - (deltaFromRight - 0.5) * this._barSpace) - 0.5
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
      const crosshair = this.getTooltipStore().getCrosshair()
      zoomCoordinate = { x: crosshair?.x ?? this._totalBarSpace / 2 }
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
      this.getActionStore().execute(ActionType.OnZoom, { scale: realScale })
    }
  }

  setZoomEnabled (enabled: boolean): this {
    this._zoomEnabled = enabled
    return this
  }

  getZoomEnabled (): boolean {
    return this._zoomEnabled
  }

  setScrollEnabled (enabled: boolean): this {
    this._scrollEnabled = enabled
    return this
  }

  getScrollEnabled (): boolean {
    return this._scrollEnabled
  }

  clear (): void {
    this._loadDataMore.backward = false
    this._loadDataMore.forward = false
    this._loading = true
    this._dataList = []
    this._visibleRangeDataList = []
    this._visibleRangeHighLowPrice = [
      { x: 0, price: Number.MIN_SAFE_INTEGER },
      { x: 0, price: Number.MAX_SAFE_INTEGER },
    ]
    this._visibleRange = getDefaultVisibleRange()
    this._cacheVisibleRange = getDefaultVisibleRange()
    this._timeTicks.clear()
    this._tooltipStore.clear()
  }

  getIndicatorStore (): IndicatorStore {
    return this._indicatorStore
  }

  getOverlayStore (): OverlayStore {
    return this._overlayStore
  }

  getTooltipStore (): TooltipStore {
    return this._tooltipStore
  }

  getActionStore (): ActionStore {
    return this._actionStore
  }

  getChart (): Chart {
    return this._chart
  }
}

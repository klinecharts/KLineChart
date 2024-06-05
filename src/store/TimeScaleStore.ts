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
import type Coordinate from '../common/Coordinate'
import type KLineData from '../common/KLineData'
import type BarSpace from '../common/BarSpace'
import type VisibleRange from '../common/VisibleRange'
import { getDefaultVisibleRange } from '../common/VisibleRange'
import { ActionType } from '../common/Action'

import { logWarn } from '../common/utils/logger'
import { binarySearchNearest } from '../common/utils/number'
import { isNumber, isString } from '../common/utils/typeChecks'

import type ChartStore from './ChartStore'
import { LoadDataType } from '../common/LoadDataCallback'

interface LeftRightSide {
  left: number
  right: number
}

const BarSpaceLimitConstants = {
  MIN: 1,
  MAX: 50
}

const enum ScrollLimitRole {
  BarCount,
  Distance
}

const DEFAULT_BAR_SPACE = 8

const DEFAULT_OFFSET_RIGHT_DISTANCE = 80

const GAP_BAR_SPACE_RATIO = 0.88

export const SCALE_MULTIPLIER = 10

export default class TimeScaleStore {
  /**
   * Root store
   */
  private readonly _chartStore: ChartStore

  /**
   * Time format
   */
  private _dateTimeFormat: Intl.DateTimeFormat = this._buildDateTimeFormat()!

  /**
   * Scale enabled flag
   */
  private _zoomEnabled: boolean = true

  /**
   * Scroll enabled flag
   */
  private _scrollEnabled: boolean = true

  /**
   * Total space of drawing area
   */
  private _totalBarSpace: number = 0

  /**
   * Space occupied by a single piece of data
   */
  private _barSpace: number = DEFAULT_BAR_SPACE

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
  private _scrollLimitRole: ScrollLimitRole = ScrollLimitRole.BarCount

  /**
   * Scroll to the leftmost and rightmost visible bar
   */
  private readonly _minVisibleBarCount: LeftRightSide = { left: 2, right: 2 }

  /**
   * Scroll to the leftmost and rightmost distance
   */
  private readonly _maxOffsetDistance: LeftRightSide = { left: 50, right: 50 }

  /**
   * Start and end points of visible area data index
   */
  private _visibleRange: VisibleRange = getDefaultVisibleRange()

  constructor (chartStore: ChartStore) {
    this._chartStore = chartStore
    this._gapBarSpace = this._calcGapBarSpace()
    this._lastBarRightSideDiffBarCount = this._offsetRightDistance / this._barSpace
  }

  private _calcGapBarSpace (): number {
    let gapBarSpace: number
    if (this._barSpace > 3) {
      gapBarSpace = Math.floor(this._barSpace * GAP_BAR_SPACE_RATIO)
    } else {
      gapBarSpace = Math.floor(this._barSpace)
      if (gapBarSpace === this._barSpace) {
        gapBarSpace--
      }
    }
    if (gapBarSpace % 2 === 0) {
      gapBarSpace--
    }
    gapBarSpace = Math.max(1, gapBarSpace)
    return gapBarSpace
  }

  /**
   * adjust visible range
   */
  adjustVisibleRange (): void {
    const dataList = this._chartStore.getDataList()
    const totalBarCount = dataList.length
    const visibleBarCount = this._totalBarSpace / this._barSpace

    let leftMinVisibleBarCount: number
    let rightMinVisibleBarCount: number

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
    this._chartStore.getActionStore().execute(ActionType.OnVisibleRangeChange, this._visibleRange)
    this._chartStore.adjustVisibleDataList()
    // More processing and loading, more loading if there are callback methods and no data is being loaded
    if (from === 0) {
      const firstData = dataList[0]
      this._chartStore.executeLoadMoreCallback(firstData?.timestamp ?? null)
      this._chartStore.executeLoadDataCallback({
        type: LoadDataType.Forward,
        data: firstData ?? null
      })
    }
    if (to === totalBarCount) {
      this._chartStore.executeLoadDataCallback({
        type: LoadDataType.Backward,
        data: dataList[totalBarCount - 1] ?? null
      })
    }
  }

  getDateTimeFormat (): Intl.DateTimeFormat {
    return this._dateTimeFormat
  }

  _buildDateTimeFormat (timezone?: string): Nullable<Intl.DateTimeFormat> {
    const options: Intl.DateTimeFormatOptions = {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
    if (isString(timezone)) {
      options.timeZone = timezone
    }
    let dateTimeFormat: Nullable<Intl.DateTimeFormat> = null
    try {
      dateTimeFormat = new Intl.DateTimeFormat('en', options)
    } catch (e) {
      logWarn('', '', 'Timezone is error!!!')
    }
    return dateTimeFormat
  }

  setTimezone (timezone: string): void {
    const dateTimeFormat: Nullable<Intl.DateTimeFormat> = this._buildDateTimeFormat(timezone)
    if (dateTimeFormat !== null) {
      this._dateTimeFormat = dateTimeFormat
    }
  }

  getTimezone (): string {
    return this._dateTimeFormat.resolvedOptions().timeZone
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
    this._gapBarSpace = this._calcGapBarSpace()
    adjustBeforeFunc?.()
    this.adjustVisibleRange()
    this._chartStore.getTooltipStore().recalculateCrosshair(true)
    this._chartStore.getChart().adjustPaneViewport(false, true, true, true)
  }

  setTotalBarSpace (totalSpace: number): this {
    if (this._totalBarSpace !== totalSpace) {
      this._totalBarSpace = totalSpace
      this.adjustVisibleRange()
      this._chartStore.getTooltipStore().recalculateCrosshair(true)
    }
    return this
  }

  setOffsetRightDistance (distance: number, isUpdate?: boolean): this {
    this._offsetRightDistance = this._scrollLimitRole === ScrollLimitRole.Distance ? Math.min(this._maxOffsetDistance.right, distance) : distance
    this._lastBarRightSideDiffBarCount = this._offsetRightDistance / this._barSpace
    if (isUpdate ?? false) {
      this.adjustVisibleRange()
      this._chartStore.getTooltipStore().recalculateCrosshair(true)
      this._chartStore.getChart().adjustPaneViewport(false, true, true, true)
    }
    return this
  }

  resetOffsetRightDistance (): void {
    this.setOffsetRightDistance(this._offsetRightDistance)
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
    this.adjustVisibleRange()
    this._chartStore.getTooltipStore().recalculateCrosshair(true)
    this._chartStore.getChart().adjustPaneViewport(false, true, true, true)
    const realDistance = Math.round(
      prevLastBarRightSideDistance - this._lastBarRightSideDiffBarCount * this._barSpace
    )
    if (realDistance !== 0) {
      this._chartStore.getActionStore().execute(ActionType.OnScroll, { distance: realDistance })
    }
  }

  getDataByDataIndex (dataIndex: number): Nullable<KLineData> {
    return this._chartStore.getDataList()[dataIndex] ?? null
  }

  coordinateToFloatIndex (x: number): number {
    const dataCount = this._chartStore.getDataList().length
    const deltaFromRight = (this._totalBarSpace - x) / this._barSpace
    const index = dataCount + this._lastBarRightSideDiffBarCount - deltaFromRight
    return Math.round(index * 1000000) / 1000000
  }

  dataIndexToTimestamp (dataIndex: number): Nullable<number> {
    const data = this.getDataByDataIndex(dataIndex)
    return data?.timestamp ?? null
  }

  timestampToDataIndex (timestamp: number): number {
    const dataList = this._chartStore.getDataList()
    if (dataList.length === 0) {
      return 0
    }
    return binarySearchNearest(dataList, 'timestamp', timestamp)
  }

  dataIndexToCoordinate (dataIndex: number): number {
    const dataCount = this._chartStore.getDataList().length
    const deltaFromRight = dataCount + this._lastBarRightSideDiffBarCount - dataIndex
    // return Math.floor(this._totalBarSpace - (deltaFromRight - 0.5) * this._barSpace) - 0.5
    return Math.floor(this._totalBarSpace - (deltaFromRight - 0.5) * this._barSpace)
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
      const crosshair = this._chartStore.getTooltipStore().getCrosshair()
      zoomCoordinate = { x: crosshair?.x ?? this._totalBarSpace / 2 }
    }
    const x = zoomCoordinate!.x!
    const floatIndex = this.coordinateToFloatIndex(x)
    const prevBarSpace = this._barSpace
    const barSpace = this._barSpace + scale * (this._barSpace / SCALE_MULTIPLIER)
    this.setBarSpace(barSpace, () => {
      this._lastBarRightSideDiffBarCount += (floatIndex - this.coordinateToFloatIndex(x))
    })
    const realScale = this._barSpace / prevBarSpace
    if (realScale !== 1) {
      this._chartStore.getActionStore().execute(ActionType.OnZoom, { scale: realScale })
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
    this._visibleRange = getDefaultVisibleRange()
  }
}

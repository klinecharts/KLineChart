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

import Nullable from '../common/Nullable'
import Coordinate from '../common/Coordinate'
import KLineData from '../common/KLineData'
import BarSpace from '../common/BarSpace'
import VisibleRange, { getDefaultVisibleRange } from '../common/VisibleRange'
import LoadMoreCallback from '../common/LoadMoreCallback'
import { ActionType } from '../common/Action'

import { logWarn } from '../common/utils/logger'
import { binarySearchNearest } from '../common/utils/number'

import ChartStore from './ChartStore'

interface MinVisibleBarCount {
  left: number
  right: number
}

const BarSpaceLimitContants = {
  MIN: 1,
  MAX: 50
}

const DEFAULT_BAR_SPACE = 6

const DEFAULT_OFFSET_RIGHT_DISTANCE = 50

export default class TimeScaleStore {
  /**
   * Root store
   */
  private readonly _chartStore: ChartStore

  /**
   * Time foramt
   */
  private _dateTimeFormat: Intl.DateTimeFormat = this._buildDateTimeFormat() as Intl.DateTimeFormat

  /**
   * Scale enabled flag
   */
  private _zoomEnabled: boolean = true

  /**
   * Scroll enabled flag
   */
  private _scrollEnabled: boolean = true

  /**
   * Is loding data flag
   */
  private _loading: boolean = true

  /**
   * Load more data callback
   */
  private _loadMoreCallback: Nullable<LoadMoreCallback> = null

  /**
   * Whether there are more flag
   */
  private _more: boolean = true

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
  private _offsetRightBarCount: number

  /**
   * The number of bar to the right of the drawing area from the last data when scrolling starts
   */
  private _startScrollOffsetRightBarCount = 0

  /**
   * Scroll to the leftmost and rightmost visible bar
   */
  private readonly _minVisibleBarCount: MinVisibleBarCount = { left: 2, right: 2 }

  /**
   * Start and end points of visible area data index
   */
  private _visibleRange: VisibleRange = getDefaultVisibleRange()

  constructor (chartStore: ChartStore) {
    this._chartStore = chartStore
    this._gapBarSpace = this._calcGapBarSpace()
    this._offsetRightBarCount = this._offsetRightDistance / this._barSpace
  }

  private _calcGapBarSpace (): number {
    const rateSpace = Math.floor(this._barSpace * 0.82)
    const floorSpace = Math.floor(this._barSpace)
    let optimalSpace = Math.min(rateSpace, floorSpace - 1)
    // If the optimal space is an odd number halfGapBar will be x.5, which will cause blur fix to fail
    if (optimalSpace % 2 !== 0) {
      optimalSpace -= 1
    }
    return Math.max(2, optimalSpace)
  }

  /**
   * adjust visible range
   */
  adjustVisibleRange (): void {
    const dataList = this._chartStore.getDataList()
    const dataCount = dataList.length
    const barCount = this._totalBarSpace / this._barSpace
    const maxRightOffsetBarCount = barCount - Math.min(this._minVisibleBarCount.left, dataCount)
    if (this._offsetRightBarCount > maxRightOffsetBarCount) {
      this._offsetRightBarCount = maxRightOffsetBarCount
    }

    const minRightOffsetBarCount = -dataCount + Math.min(this._minVisibleBarCount.right, dataCount)
    if (this._offsetRightBarCount < minRightOffsetBarCount) {
      this._offsetRightBarCount = minRightOffsetBarCount
    }
    let to = Math.round(this._offsetRightBarCount + dataCount + 0.5)
    if (to > dataCount) {
      to = dataCount
    }
    let from = Math.round(to - barCount) - 1
    if (from < 0) {
      from = 0
    }
    const realFrom = this._offsetRightBarCount > 0 ? Math.round(dataCount + this._offsetRightBarCount - barCount) - 1 : from
    this._visibleRange = { from, to, realFrom, realTo: to }
    this._chartStore.getActionStore().execute(ActionType.OnVisibleRangeChange, this._visibleRange)
    this._chartStore.adjustVisibleDataList()
    // More processing and loading, more loading if there are callback methods and no data is being loaded
    if (from === 0 && this._more && !this._loading && this._loadMoreCallback !== null) {
      this._loading = true
      const firstData = dataList[0]
      this._loadMoreCallback(firstData?.timestamp ?? null)
    }
  }

  setMore (more: boolean): TimeScaleStore {
    this._more = more
    return this
  }

  setLoading (loading: boolean): TimeScaleStore {
    this._loading = loading
    return this
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
    if (timezone !== undefined) {
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
      halfGapBar: this._gapBarSpace / 2
    }
  }

  setBarSpace (barSpace: number, adjustBeforeFunc?: () => void): void {
    if (barSpace < BarSpaceLimitContants.MIN || barSpace > BarSpaceLimitContants.MAX || this._barSpace === barSpace) {
      return
    }
    this._barSpace = barSpace
    this._gapBarSpace = this._calcGapBarSpace()
    adjustBeforeFunc?.()
    this.adjustVisibleRange()
    this._chartStore.getCrosshairStore().recalculate(true)
    this._chartStore.getChart().adjustPaneViewport(false, true, true, true)
  }

  setTotalBarSpace (totalSpace: number): TimeScaleStore {
    if (this._totalBarSpace !== totalSpace) {
      this._totalBarSpace = totalSpace
      this.adjustVisibleRange()
      this._chartStore.getCrosshairStore().recalculate(true)
    }
    return this
  }

  setOffsetRightDistance (distance: number, isUpdate?: boolean): TimeScaleStore {
    this._offsetRightDistance = distance
    this._offsetRightBarCount = distance / this._barSpace
    if (isUpdate ?? false) {
      this.adjustVisibleRange()
      this._chartStore.getCrosshairStore().recalculate(true)
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
    return Math.max(0, this._offsetRightBarCount * this._barSpace)
  }

  getOffsetRightBarCount (): number {
    return this._offsetRightBarCount
  }

  setOffsetRightBarCount (barCount: number): TimeScaleStore {
    this._offsetRightBarCount = barCount
    return this
  }

  setLeftMinVisibleBarCount (barCount: number): TimeScaleStore {
    this._minVisibleBarCount.left = barCount
    return this
  }

  setRightMinVisibleBarCount (barCount: number): TimeScaleStore {
    this._minVisibleBarCount.right = barCount
    return this
  }

  getVisibleRange (): VisibleRange {
    return this._visibleRange
  }

  startScroll (): void {
    this._startScrollOffsetRightBarCount = this._offsetRightBarCount
  }

  scroll (distance: number): void {
    if (!this._scrollEnabled) {
      return
    }
    const distanceBarCount = distance / this._barSpace
    this._chartStore.getActionStore().execute(ActionType.OnScroll)
    this._offsetRightBarCount = this._startScrollOffsetRightBarCount - distanceBarCount
    this.adjustVisibleRange()
    this._chartStore.getCrosshairStore().recalculate(true)
    this._chartStore.getChart().adjustPaneViewport(false, true, true, true)
  }

  getDataByDataIndex (dataIndex: number): Nullable<KLineData> {
    return this._chartStore.getDataList()[dataIndex] ?? null
  }

  coordinateToFloatIndex (x: number): number {
    const dataCount = this._chartStore.getDataList().length
    const deltaFromRight = (this._totalBarSpace - x) / this._barSpace
    const index = dataCount + this._offsetRightBarCount - deltaFromRight
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
    const deltaFromRight = dataCount + this._offsetRightBarCount - dataIndex
    return Math.floor(this._totalBarSpace - (deltaFromRight - 0.5) * this._barSpace)
  }

  coordinateToDataIndex (x: number): number {
    return Math.ceil(this.coordinateToFloatIndex(x)) - 1
  }

  zoom (scale: number, coordinate?: Partial<Coordinate>): void {
    if (!this._zoomEnabled) {
      return
    }
    if (coordinate?.x === undefined) {
      const crosshair = this._chartStore.getCrosshairStore().get()
      coordinate = { x: crosshair?.x ?? this._totalBarSpace / 2 }
    }
    this._chartStore.getActionStore().execute(ActionType.OnZoom)
    const floatIndex = this.coordinateToFloatIndex(coordinate.x as number)
    const barSpace = this._barSpace + scale * (this._barSpace / 10)
    this.setBarSpace(barSpace, () => {
      this._offsetRightBarCount += (floatIndex - this.coordinateToFloatIndex(coordinate?.x as number))
    })
  }

  setZoomEnabled (enabled: boolean): TimeScaleStore {
    this._zoomEnabled = enabled
    return this
  }

  getZoomEnabled (): boolean {
    return this._zoomEnabled
  }

  setScrollEnabled (enabled: boolean): TimeScaleStore {
    this._scrollEnabled = enabled
    return this
  }

  getScrollEnabled (): boolean {
    return this._scrollEnabled
  }

  setLoadMoreCallback (callback: LoadMoreCallback): TimeScaleStore {
    this._loadMoreCallback = callback
    return this
  }

  clear (): void {
    this._more = true
    this._loading = true
    this._visibleRange = getDefaultVisibleRange()
  }
}

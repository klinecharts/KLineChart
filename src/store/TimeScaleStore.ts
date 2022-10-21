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

import TypeOrNull from '../common/TypeOrNull'
import Coordinate from '../common/Coordinate'
import KLineData from '../common/KLineData'

import { Crosshair } from './CrosshairStore'

import { formatValue } from '../utils/format'
import { logWarn } from '../utils/logger'
import { binarySearchNearest } from '../utils/number'

import ActionType from '../enum/ActionType'

import ChartStore from './ChartStore'

export interface VisibleRange {
  from: number
  to: number
}

export interface MinVisibleBarCount {
  left: number
  right: number
}

export type LoadMoreCallback = (timestamp: number) => void

const BarSpaceLimitContants = {
  MIN: 1,
  MAX: 50
}

const DEFAULT_BAR_SPACE = 6

const DEFAULT_OFFSET_RIGHT_DISTANCE = 50

export default class TimeScaleStore {
  private readonly _chartStore: ChartStore

  private _dateTimeFormat: Intl.DateTimeFormat

  private _zoomEnabled: boolean = true
  private _scrollEnabled: boolean = true

  private _loading: boolean = true
  private _loadMoreCallback: TypeOrNull<LoadMoreCallback> = null
  private _more: boolean = true

  private _totalBarSpace: number = 0
  private _barSpace: number = DEFAULT_BAR_SPACE
  private _gapBarSpace: number

  private _offsetRightDistance = DEFAULT_OFFSET_RIGHT_DISTANCE
  private _offsetRightBarCount: number
  private _startScrollOffsetRightBarCount = 0

  private _minVisibleBarCount: MinVisibleBarCount = { left: 2, right: 2 }

  private _visibleRange = { from: 0, to: 0 }

  constructor (chartStore: ChartStore) {
    this._chartStore = chartStore
    this._dateTimeFormat = new Intl.DateTimeFormat(
      'en', {
        hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
      }
    )
    this._gapBarSpace = this._calcGapBarSpace()
    this._offsetRightBarCount = this._offsetRightDistance / this._barSpace
  }

  /**
   * 计算一条有空隙柱子的空间
   * @returns {number}
   * @private
   */
  private _calcGapBarSpace (): number {
    const rateSpace = Math.floor(this._barSpace * 0.82)
    const floorSpace = Math.floor(this._barSpace)
    const optimalSpace = Math.min(rateSpace, floorSpace - 1)
    return Math.max(1, optimalSpace)
  }

  /**
   * 调整绘制起点终点位置
   * @private
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
    this._chartStore.adjustVisibleDataList()
    // 处理加载更多，有更多并且没有在加载则去加载更多
    if (from === 0 && this._more && !this._loading && this._loadMoreCallback !== null) {
      this._loading = true
      this._loadMoreCallback(formatValue(dataList[0], 'timestamp'))
    }
  }

  /**
   * 设置是否有更多
   * @param more
   */
  setMore (more: boolean): TimeScaleStore {
    this._more = more
    return this
  }

  /**
   * 设置是否在加载
   */
  setLoading (loading: boolean): TimeScaleStore {
    this._loading = loading
    return this
  }

  /**
   * 获取时间格式化
   * @returns {Intl.DateTimeFormat | Intl.DateTimeFormat}
   */
  getDateTimeFormat (): Intl.DateTimeFormat {
    return this._dateTimeFormat
  }

  /**
   * 设置时区
   * @param timezone
   */
  setTimezone (timezone: string): void {
    let dateTimeFormat: TypeOrNull<Intl.DateTimeFormat> = null
    try {
      dateTimeFormat = new Intl.DateTimeFormat(
        'en', {
          hour12: false, timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        }
      )
    } catch (e) {
      logWarn('', '', 'Timezone is error!!!')
    }
    if (dateTimeFormat !== null) {
      this._dateTimeFormat = dateTimeFormat
    }
  }

  /**
   * 获取时区
   * @returns {string}
   */
  getTimezone (): string {
    return this._dateTimeFormat.resolvedOptions().timeZone
  }

  /**
   * 获取一条数据的空间
   * @returns {number}
   */
  getBarSpace (): number {
    return this._barSpace
  }

  /**
   * 获取绘制一条数据的空间（不包括bar之间的间隙）
   * @returns {*}
   */
  getGapBarSpace (): number {
    return this._gapBarSpace
  }

  /**
   * 设置一条数据的空间
   * @param barSpace
   * @param adjustBeforeFunc
   */
  setBarSpace (barSpace: number, adjustBeforeFunc?: () => void): void {
    if (barSpace < BarSpaceLimitContants.MIN || barSpace > BarSpaceLimitContants.MAX || this._barSpace === barSpace) {
      return
    }
    this._barSpace = barSpace
    this._gapBarSpace = this._calcGapBarSpace()
    adjustBeforeFunc?.()
    this.adjustVisibleRange()
    this._chartStore.getCrosshairStore().recalculate(true)
    this._chartStore.getUpdater().update()
  }

  /**
   * 设置可见区域数据占用的总空间
   * @param totalSpace
   */
  setTotalBarSpace (totalSpace: number): TimeScaleStore {
    if (this._totalBarSpace !== totalSpace) {
      this._totalBarSpace = totalSpace
      this.adjustVisibleRange()
      this._chartStore.getCrosshairStore().recalculate(true)
    }
    return this
  }

  /**
   * 设置右边可以偏移的空间
   * @param distance
   * @param isUpdate
   */
  setOffsetRightDistance (distance: number, isUpdate?: boolean): TimeScaleStore {
    this._offsetRightDistance = distance
    this._offsetRightBarCount = distance / this._barSpace
    if (isUpdate ?? false) {
      this.adjustVisibleRange()
      this._chartStore.getCrosshairStore().recalculate(true)
      this._chartStore.getUpdater().update()
    }
    return this
  }

  /**
   * 重置右边可以偏移的空间
   */
  resetOffsetRightDistance (): void {
    this.setOffsetRightDistance(this._offsetRightDistance)
  }

  /**
   * 右偏移距离
   * @return {number}
   */
  getOffsetRightDistance (): number {
    return this._offsetRightDistance
  }

  /**
   * 右偏移bar数量
   * @return {*|number}
   */
  getOffsetRightBarCount (): number {
    return this._offsetRightBarCount
  }

  /**
   * 设置右偏移bar数量
   * @param barCount
   */
  setOffsetRightBarCount (barCount: number): TimeScaleStore {
    this._offsetRightBarCount = barCount
    return this
  }

  /**
   * 设置左边可见的最小bar数量
   * @param barCount
   */
  setLeftMinVisibleBarCount (barCount: number): TimeScaleStore {
    this._minVisibleBarCount.left = barCount
    return this
  }

  /**
   * 设置右边可见的最小bar数量
   * @param barCount
   */
  setRightMinVisibleBarCount (barCount: number): TimeScaleStore {
    this._minVisibleBarCount.right = barCount
    return this
  }

  getVisibleRange (): VisibleRange {
    return this._visibleRange
  }

  /**
   * 开始滚动
   */
  startScroll (): void {
    this._startScrollOffsetRightBarCount = this._offsetRightBarCount
  }

  /**
   * 滚动
   * @param distance
   * @param crosshair
   */
  scroll (distance: number, crosshair?: Crosshair): void {
    if (!this._scrollEnabled) {
      return
    }
    const distanceBarCount = distance / this._barSpace
    this._chartStore.getActionStore().execute(ActionType.SCROLL, { barCount: distanceBarCount, distance })
    this._offsetRightBarCount = this._startScrollOffsetRightBarCount - distanceBarCount
    this.adjustVisibleRange()
    const cross = crosshair ?? this._chartStore.getCrosshairStore().get()
    this._chartStore.getCrosshairStore().set(cross, true)
    this._chartStore.getUpdater().update()
  }

  /**
   * 根据索引获取数据
   * @param dataIndex
   */
  getDataByDataIndex (dataIndex: number): TypeOrNull<KLineData> {
    return this._chartStore.getDataList()[dataIndex] ?? null
  }

  /**
   * x转换成浮点数的位置
   * @param x
   * @returns {number}
   */
  coordinateToFloatIndex (x: number): number {
    const dataCount = this._chartStore.getDataList().length
    const deltaFromRight = (this._totalBarSpace - x) / this._barSpace
    const index = dataCount + this._offsetRightBarCount - deltaFromRight
    return Math.round(index * 1000000) / 1000000
  }

  /**
   * 数据索引转换成时间戳
   * @param dataIndex
   * @return {*}
   */
  dataIndexToTimestamp (dataIndex: number): TypeOrNull<number> {
    const data = this.getDataByDataIndex(dataIndex)
    return data?.timestamp ?? null
  }

  /**
   * 将时间戳转换成数据索引位置
   * @param timestamp
   * @return {number}
   */
  timestampToDataIndex (timestamp: number): number {
    const dataList = this._chartStore.getDataList()
    if (dataList.length === 0) {
      return 0
    }
    return binarySearchNearest(dataList, 'timestamp', timestamp)
  }

  /**
   * 数据索引转换成坐标
   * @param dataIndex
   */
  dataIndexToCoordinate (dataIndex: number): number {
    const dataCount = this._chartStore.getDataList().length
    const deltaFromRight = dataCount + this._offsetRightBarCount - dataIndex
    return this._totalBarSpace - (deltaFromRight - 0.5) * this._barSpace
  }

  /**
   * 坐标换成数据索引转
   * @param x
   */
  coordinateToDataIndex (x: number): number {
    return Math.ceil(this.coordinateToFloatIndex(x)) - 1
  }

  /**
   * 缩放
   * @param scale
   * @param coordinate
   */
  zoom (scale: number, coordinate?: Partial<Coordinate>): void {
    if (!this._zoomEnabled) {
      return
    }
    if (coordinate?.x === undefined) {
      const crosshair = this._chartStore.getCrosshairStore().get()
      coordinate = { x: crosshair?.x !== undefined ? crosshair.x : this._totalBarSpace / 2 }
    }
    this._chartStore.getActionStore().execute(ActionType.ZOOM, { coordinate, scale })
    const floatIndex = this.coordinateToFloatIndex(coordinate.x as number)
    const barSpace = this._barSpace + scale * (this._barSpace / 10)
    this.setBarSpace(barSpace, () => {
      this._offsetRightBarCount += (floatIndex - this.coordinateToFloatIndex(coordinate?.x as number))
    })
  }

  /**
   * 设置是否可以缩放
   * @param enabled
   */
  setZoomEnabled (enabled: boolean): TimeScaleStore {
    this._zoomEnabled = enabled
    return this
  }

  /**
   * 获取是否可以缩放
   * @return {boolean}
   */
  getZoomEnabled (): boolean {
    return this._zoomEnabled
  }

  /**
   * 设置是否可以拖拽滚动
   * @param enabled
   */
  setScrollEnabled (enabled: boolean): TimeScaleStore {
    this._scrollEnabled = enabled
    return this
  }

  /**
   * 获取是否可以拖拽滚动
   * @return {boolean}
   */
  getScrollEnabled (): boolean {
    return this._scrollEnabled
  }

  /**
   * 设置加载更多
   * @param callback
   */
  setLoadMoreCallback (callback: LoadMoreCallback): TimeScaleStore {
    this._loadMoreCallback = callback
    return this
  }

  /**
   * 清除数据
   */
  clear (): void {
    this._more = true
    this._loading = true
    this._visibleRange = { from: 0, to: 0 }
  }
}

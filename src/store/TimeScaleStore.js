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

import { isFunction, isValid } from '../utils/typeChecks'
import { formatValue } from '../utils/format'
import { logWarn } from '../utils/logger'
import { binarySearchNearest } from '../utils/number'

import ActionType from '../enum/ActionType'

// 最小单条数据宽度
const MIN_DATA_SPACE = 1

// 最大单条数据宽度
const MAX_DATA_SPACE = 50

export default class TimeScaleStore {
  constructor (chartStore) {
    this._chartStore = chartStore
    this._dateTimeFormat = new Intl.DateTimeFormat(
      'en', {
        hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
      }
    )

    // 是否可以缩放
    this._zoomEnabled = true
    // 是否可以拖拽滑动
    this._scrollEnabled = true

    // 是否在加载中
    this._loading = true
    // 加载更多回调
    this._loadMoreCallback = null
    // 还有更多
    this._more = true

    // 可见区域数据占用的空间
    this._totalDataSpace = 0
    // 每一条数据的空间
    this._dataSpace = 6
    // bar的空间
    this._barSpace = this._calcBarSpace()
    // 向右偏移的空间
    this._offsetRightSpace = 50
    // 向右偏移的数量
    this._offsetRightBarCount = this._offsetRightSpace / this._dataSpace
    // 左边最小可见bar的个数
    this._leftMinVisibleBarCount = 2
    // 右边最小可见bar的个数
    this._rightMinVisibleBarCount = 2
    // 开始绘制的索引
    this._from = 0
    // 结束的索引
    this._to = 0

    // 用来记录开始拖拽时向右偏移的数量
    this._preOffsetRightBarCount = 0
  }

  /**
   * 计算一条柱子的空间
   * @returns {number}
   * @private
   */
  _calcBarSpace () {
    const rateBarSpace = Math.floor(this._dataSpace * 0.82)
    const floorBarSpace = Math.floor(this._dataSpace)
    const optimalBarSpace = Math.min(rateBarSpace, floorBarSpace - 1)
    return Math.max(1, optimalBarSpace)
  }

  /**
   * 调整绘制起点终点位置
   * @private
   */
  adjustFromTo () {
    const dataSize = this._chartStore.dataList().length
    const barLength = this._totalDataSpace / this._dataSpace
    const maxRightOffsetBarCount = barLength - Math.min(this._leftMinVisibleBarCount, dataSize)
    if (this._offsetRightBarCount > maxRightOffsetBarCount) {
      this._offsetRightBarCount = maxRightOffsetBarCount
    }

    const minRightOffsetBarCount = -dataSize + Math.min(this._rightMinVisibleBarCount, dataSize)

    if (this._offsetRightBarCount < minRightOffsetBarCount) {
      this._offsetRightBarCount = minRightOffsetBarCount
    }
    this._to = Math.round(this._offsetRightBarCount + dataSize + 0.5)
    this._from = Math.round(this._to - barLength) - 1
    if (this._to > dataSize) {
      this._to = dataSize
    }
    if (this._from < 0) {
      this._from = 0
    }
    this._chartStore.adjustVisibleDataList()
    // 处理加载更多，有更多并且没有在加载则去加载更多
    if (this._from === 0 && this._more && !this._loading && isFunction(this._loadMoreCallback)) {
      this._loading = true
      this._loadMoreCallback(formatValue(this._chartStore.dataList()[0], 'timestamp'))
    }
  }

  /**
   * 设置是否有更多
   * @param more
   */
  setMore (more) {
    this._more = more
  }

  /**
   * 设置是否在加载
   */
  setLoading (loading) {
    this._loading = loading
  }

  /**
   * 获取时间格式化
   * @returns {Intl.DateTimeFormat | Intl.DateTimeFormat}
   */
  dateTimeFormat () {
    return this._dateTimeFormat
  }

  /**
   * 设置时区
   * @param timezone
   */
  setTimezone (timezone) {
    let dateTimeFormat
    try {
      dateTimeFormat = new Intl.DateTimeFormat(
        'en', {
          hour12: false, timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        }
      )
    } catch (e) {
      logWarn('', '', 'Timezone is error!!!')
    }
    if (dateTimeFormat) {
      this._dateTimeFormat = dateTimeFormat
    }
  }

  /**
   * 获取时区
   * @returns {null}
   */
  timezone () {
    return this._dateTimeFormat.resolvedOptions().timeZone
  }

  /**
   * 获取一条数据的空间
   * @returns {number}
   */
  dataSpace () {
    return this._dataSpace
  }

  /**
   * 获取绘制一条数据的空间（不包括bar之间的间隙）
   * @returns {*}
   */
  barSpace () {
    return this._barSpace
  }

  /**
   * 获取绘制一条数据一半的空间（不包括bar之间的间隙）
   * @returns
   */
  halfBarSpace () {
    return this._barSpace / 2
  }

  /**
   * 设置一条数据的空间
   * @param dataSpace
   * @param adjustBeforeFuc
   */
  setDataSpace (dataSpace, adjustBeforeFuc) {
    if (dataSpace < MIN_DATA_SPACE || dataSpace > MAX_DATA_SPACE || this._dataSpace === dataSpace) {
      return
    }
    this._dataSpace = dataSpace
    this._barSpace = this._calcBarSpace()
    adjustBeforeFuc && adjustBeforeFuc()
    this.adjustFromTo()
    this._chartStore.crosshairStore().recalculate(true)
    this._chartStore.invalidate()
  }

  /**
   * 设置可见区域数据占用的总空间
   * @param totalSpace
   */
  setTotalDataSpace (totalSpace) {
    if (this._totalDataSpace === totalSpace) {
      return
    }
    this._totalDataSpace = totalSpace
    this.adjustFromTo()
    this._chartStore.crosshairStore().recalculate(true)
  }

  /**
   * 设置右边可以偏移的空间
   * @param space
   * @param invalidate
   */
  setOffsetRightSpace (space, invalidate) {
    this._offsetRightSpace = space
    this._offsetRightBarCount = space / this._dataSpace
    if (invalidate) {
      this.adjustFromTo()
      this._chartStore.crosshairStore().recalculate(true)
      this._chartStore.invalidate()
    }
  }

  /**
   * 重置右边可以偏移的空间
   */
  resetOffsetRightSpace () {
    this.setOffsetRightSpace(this._offsetRightSpace)
  }

  /**
   * 右偏移距离
   * @return {number}
   */
  offsetRightSpace () {
    return this._offsetRightSpace
  }

  /**
   * 右偏移bar数量
   * @return {*|number}
   */
  offsetRightBarCount () {
    return this._offsetRightBarCount
  }

  /**
   * 设置右偏移bar数量
   * @param barCount
   */
  setOffsetRightBarCount (barCount) {
    this._offsetRightBarCount = barCount
  }

  /**
   * 设置左边可见的最小bar数量
   * @param barCount
   */
  setLeftMinVisibleBarCount (barCount) {
    this._leftMinVisibleBarCount = barCount
  }

  /**
   * 设置右边可见的最小bar数量
   * @param barCount
   */
  setRightMinVisibleBarCount (barCount) {
    this._rightMinVisibleBarCount = barCount
  }

  /**
   * 获取数据绘制起点
   * @returns {number}
   */
  from () {
    return this._from
  }

  /**
   * 获取数据绘制终点
   * @returns {number}
   */
  to () {
    return this._to
  }

  /**
   * 开始滚动
   */
  startScroll () {
    this._preOffsetRightBarCount = this._offsetRightBarCount
  }

  /**
   * 滚动
   * @param distance
   * @param crosshair
   */
  scroll (distance, crosshair) {
    if (!this._scrollEnabled) {
      return
    }
    const distanceBarCount = distance / this._dataSpace
    this._chartStore.actionStore().execute(ActionType.SCROLL, { barCount: distanceBarCount, distance })
    this._offsetRightBarCount = this._preOffsetRightBarCount - distanceBarCount
    this.adjustFromTo()
    const cross = crosshair || this._chartStore.crosshairStore().get()
    this._chartStore.crosshairStore().set(cross, true)
    this._chartStore.invalidate()
  }

  /**
   * 根据索引获取数据
   * @param dataIndex
   */
  getDataByDataIndex (dataIndex) {
    return this._chartStore.dataList()[dataIndex]
  }

  /**
   * x转换成浮点数的位置
   * @param x
   * @returns {number}
   */
  coordinateToFloatIndex (x) {
    const dataSize = this._chartStore.dataList().length
    const deltaFromRight = (this._totalDataSpace - x) / this._dataSpace
    const index = dataSize + this._offsetRightBarCount - deltaFromRight
    return Math.round(index * 1000000) / 1000000
  }

  /**
   * 数据索引转换成时间戳
   * @param dataIndex
   * @return {*}
   */
  dataIndexToTimestamp (dataIndex) {
    const data = this.getDataByDataIndex(dataIndex)
    if (data) {
      return data.timestamp
    }
  }

  /**
   * 将时间戳转换成数据索引位置
   * @param timestamp
   * @return {number}
   */
  timestampToDataIndex (timestamp) {
    if (this._chartStore.dataList().length === 0) {
      return 0
    }
    return binarySearchNearest(this._chartStore.dataList(), 'timestamp', timestamp)
  }

  /**
   * 数据索引转换成坐标
   * @param dataIndex
   */
  dataIndexToCoordinate (dataIndex) {
    const dataSize = this._chartStore.dataList().length
    const deltaFromRight = dataSize + this._offsetRightBarCount - dataIndex
    return this._totalDataSpace - (deltaFromRight - 0.5) * this._dataSpace
  }

  /**
   * 坐标换成数据索引转
   * @param pixel
   */
  coordinateToDataIndex (pixel) {
    return Math.ceil(this.coordinateToFloatIndex(pixel)) - 1
  }

  /**
   * 缩放
   * @param scale
   * @param coordinate
   */
  zoom (scale, coordinate) {
    if (!this._zoomEnabled) {
      return
    }
    if (!coordinate || !isValid(coordinate.x)) {
      const crosshair = this._chartStore.crosshairStore().get()
      coordinate = { x: isValid(crosshair.x) ? crosshair.x : this._totalDataSpace / 2 }
    }
    this._chartStore.actionStore().execute(ActionType.ZOOM, { coordinate, scale })
    const floatIndex = this.coordinateToFloatIndex(coordinate.x)
    const dataSpace = this._dataSpace + scale * (this._dataSpace / 10)
    this.setDataSpace(dataSpace, () => {
      this._offsetRightBarCount += (floatIndex - this.coordinateToFloatIndex(coordinate.x))
    })
  }

  /**
   * 设置是否可以缩放
   * @param enabled
   */
  setZoomEnabled (enabled) {
    this._zoomEnabled = enabled
  }

  /**
   * 获取是否可以缩放
   * @return {boolean}
   */
  zoomEnabled () {
    return this._zoomEnabled
  }

  /**
   * 设置是否可以拖拽滚动
   * @param enabled
   */
  setScrollEnabled (enabled) {
    this._scrollEnabled = enabled
  }

  /**
   * 获取是否可以拖拽滚动
   * @return {boolean}
   */
  scrollEnabled () {
    return this._scrollEnabled
  }

  /**
   * 设置加载更多
   * @param callback
   */
  setLoadMoreCallback (callback) {
    this._loadMoreCallback = callback
  }

  /**
   * 清除数据
   */
  clear () {
    this._more = true
    this._loading = true
    this._from = 0
    this._to = 0
  }
}

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

import { isArray, isObject, merge, clone, isFunction, isBoolean, isValid } from '../utils/typeChecks'
import { defaultStyleOptions } from './options/styleOptions'

import { formatValue } from '../utils/format'
import {
  createTechnicalIndicatorInstance,
  createTechnicalIndicatorMapping
} from './base/technicalindicator/technicalIndicatorControl'
import { DEV } from '../utils/env'
import { TechnicalIndicatorSeries } from './base/technicalindicator/TechnicalIndicator'
import { GraphicMarkMouseOperateElement } from './base/mark/GraphicMark'
import Delegate from './delegate/Delegate'
import { createGraphicMarkClass, createGraphicMarkMapping } from './base/mark/graphicMarkControl'
import { binarySearchNearest } from '../utils/number'

export const InvalidateLevel = {
  NONE: 0,
  GRAPHIC_MARK: 1,
  FLOAT_LAYER: 2,
  MAIN: 3,
  FULL: 4
}

export const ActionType = {
  drawCandle: 'drawCandle',
  drawTechnicalIndicator: 'drawTechnicalIndicator',
  zoom: 'zoom',
  scroll: 'scroll'
}

/**
 * 删除图形标记实例操作类型
 * @type {{ACTION: string, ID: string}}
 */
export const RemoveGraphicMarkOperateType = {
  ACTION: 'action',
  ID: 'id'
}

const MAX_DATA_SPACE = 50
const MIN_DATA_SPACE = 1

export default class ChartData {
  constructor (styleOptions, invalidateHandler) {
    // 刷新持有者
    this._invalidateHandler = invalidateHandler
    // 样式配置
    this._styleOptions = clone(defaultStyleOptions)
    merge(this._styleOptions, styleOptions)
    // 所有技术指标映射
    this._technicalIndicatorMapping = createTechnicalIndicatorMapping()
    // 是否可以缩放
    this._zoomEnabled = true
    // 是否可以拖拽滑动
    this._scrollEnabled = true

    // 价格精度
    this._pricePrecision = 2
    // 数量精度
    this._volumePrecision = 0

    this._dateTimeFormat = new Intl.DateTimeFormat(
      'en', {
        hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
      }
    )

    // 数据源
    this._dataList = []

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

    // 十字光标信息
    this._crosshair = {}
    // 用来记录开始拖拽时向右偏移的数量
    this._preOffsetRightBarCount = 0

    // 拖拽标记图形标记
    this._dragGraphicMarkFlag = false
    // 图形标记映射
    this._graphicMarkMapping = createGraphicMarkMapping()
    // 图形标记鼠标操作信息
    this._graphicMarkMouseOperate = {
      click: {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      },
      hover: {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      }
    }
    // 绘图标记数据
    this._graphicMarks = []

    // 调整pane标记
    this._dragPaneFlag = false

    // 事件代理
    this._actionDelegate = {}
  }

  /**
   * 计算一条柱子的空间
   * @returns {number}
   * @private
   */
  _calcBarSpace () {
    const rateBarSpace = Math.floor(this._dataSpace * 0.8)
    const floorBarSpace = Math.floor(this._dataSpace)
    const optimalBarSpace = Math.min(rateBarSpace, floorBarSpace - 1)
    return Math.max(1, optimalBarSpace)
  }

  /**
   * 内部用来设置一条数据的空间
   * @param dataSpace
   * @returns {boolean}
   * @private
   */
  _innerSetDataSpace (dataSpace) {
    if (!dataSpace || dataSpace < MIN_DATA_SPACE || dataSpace > MAX_DATA_SPACE || this._dataSpace === dataSpace) {
      return false
    }
    this._dataSpace = dataSpace
    this._barSpace = this._calcBarSpace()
    return true
  }

  /**
   * 调整绘制起点终点位置
   * @private
   */
  _adjustFromTo () {
    const dataSize = this._dataList.length
    const barLength = this._totalDataSpace / this._dataSpace
    const halfBarCount = this._barSpace / 2 / this._dataSpace
    const maxRightOffsetBarCount = barLength - Math.min(this._leftMinVisibleBarCount, dataSize) + (1 - halfBarCount)
    if (this._offsetRightBarCount > maxRightOffsetBarCount) {
      this._offsetRightBarCount = maxRightOffsetBarCount
    }

    const minRightOffsetBarCount = -dataSize + Math.min(this._rightMinVisibleBarCount, dataSize) + halfBarCount

    if (this._offsetRightBarCount < minRightOffsetBarCount) {
      this._offsetRightBarCount = minRightOffsetBarCount
    }
    this._to = Math.round(this._offsetRightBarCount + dataSize)
    this._from = Math.floor(this._to - barLength) - 1
    if (this._to > dataSize) {
      this._to = dataSize
    }
    if (this._from < 0) {
      this._from = 0
    }
    // 有更多并且没有在加载则去加载更多
    if (this._from === 0 && this._more && !this._loading && this._loadMoreCallback && isFunction(this._loadMoreCallback)) {
      this._loading = true
      this._loadMoreCallback(formatValue(this._dataList[0], 'timestamp'))
    }
  }

  /**
   * 获取样式配置
   */
  styleOptions () {
    return this._styleOptions
  }

  /**
   * 设置样式配置
   * @param options
   */
  applyStyleOptions (options) {
    merge(this._styleOptions, options)
  }

  /**
   * 获取技术指标信息
   * @param name
   * @return {{}|{series: *, calcParams: *, precision: *, name: *}}
   */
  technicalIndicatorInfo (name) {
    const technical = this.technicalIndicator(name)
    if (technical) {
      return {
        name: technical.name,
        series: technical.series,
        calcParams: technical.calcParams,
        precision: technical.precision,
        styles: technical.styles
      }
    }
    const technicals = {}
    for (const name in this._technicalIndicatorMapping) {
      const instance = this._technicalIndicatorMapping[name]
      technicals[name] = {
        name: instance.name,
        series: instance.series,
        calcParams: instance.calcParams,
        precision: instance.precision,
        styles: instance.styles
      }
    }
    return technicals
  }

  /**
   * 根据指标类型获取指标类
   * @param name
   */
  technicalIndicator (name) {
    return this._technicalIndicatorMapping[name]
  }

  /**
   * 价格精度
   * @returns {number}
   */
  pricePrecision () {
    return this._pricePrecision
  }

  /**
   * 数量精度
   * @returns {number}
   */
  volumePrecision () {
    return this._volumePrecision
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
      if (DEV) {
        console.warn(e.message)
      }
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
   * 加载价格和数量精度
   * @param pricePrecision
   * @param volumePrecision
   */
  applyPriceVolumePrecision (pricePrecision, volumePrecision) {
    this._pricePrecision = pricePrecision
    this._volumePrecision = volumePrecision
    for (const name in this._technicalIndicatorMapping) {
      const series = this._technicalIndicatorMapping[name].series
      switch (series) {
        case TechnicalIndicatorSeries.PRICE: {
          this._technicalIndicatorMapping[name].setPrecision(pricePrecision)
          break
        }
        case TechnicalIndicatorSeries.VOLUME: {
          this._technicalIndicatorMapping[name].setPrecision(volumePrecision)
          break
        }
        default: { break }
      }
    }
  }

  /**
   * 加载技术指标精度
   * @param precision
   * @param name
   */
  applyTechnicalIndicatorPrecision (precision, name) {
    const technicalIndicator = this.technicalIndicator(name)
    if (technicalIndicator) {
      technicalIndicator.setPrecision(precision)
    } else {
      for (const name in this._technicalIndicatorMapping) {
        this._technicalIndicatorMapping[name].setPrecision(precision)
      }
    }
  }

  /**
   * 获取数据源
   * @returns {[]|*[]}
   */
  dataList () {
    return this._dataList
  }

  /**
   * 清空数据源
   */
  clearDataList () {
    this._more = true
    this._loading = true
    this._dataList = []
    this._from = 0
    this._to = 0
  }

  /**
   * 添加数据
   * @param data
   * @param pos
   * @param more
   */
  addData (data, pos, more) {
    if (isObject(data)) {
      if (isArray(data)) {
        this._loading = false
        this._more = isBoolean(more) ? more : true
        const isFirstAdd = this._dataList.length === 0
        this._dataList = data.concat(this._dataList)
        if (isFirstAdd) {
          this.setOffsetRightSpace(this._offsetRightSpace)
        } else {
          this._adjustFromTo()
        }
      } else {
        const dataSize = this._dataList.length
        if (pos >= dataSize) {
          this._dataList.push(data)
          if (this._offsetRightBarCount < 0) {
            this._offsetRightBarCount -= 1
          }
          this._adjustFromTo()
        } else {
          this._dataList[pos] = data
        }
      }
    }
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
   * 获取向右偏移的bar的数量
   * @returns {number}
   */
  offsetRightBarCount () {
    return this._offsetRightBarCount
  }

  /**
   * 设置一条数据的空间
   * @param dataSpace
   */
  setDataSpace (dataSpace) {
    if (this._innerSetDataSpace(dataSpace)) {
      this._adjustFromTo()
      this.invalidate()
    }
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
    this._adjustFromTo()
  }

  /**
   * 设置右边可以偏移的空间
   * @param space
   */
  setOffsetRightSpace (space) {
    this._offsetRightSpace = space
    this._offsetRightBarCount = space / this._dataSpace
    this._adjustFromTo()
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
   * 获取十字光标信息
   * @returns {{}}
   */
  crosshair () {
    return this._crosshair
  }

  /**
   * 设置十字光标点所在的pane的标识
   * @param point
   * @param paneId
   */
  setCrosshairPointPaneId (point, paneId) {
    const p = point || {}
    if (
      this._crosshair.x !== p.x ||
      this._crosshair.y !== p.y ||
      this._crosshair.paneId !== paneId
    ) {
      this._crosshair = { ...point, paneId }
      this.invalidate(InvalidateLevel.FLOAT_LAYER)
    }
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
   */
  scroll (distance) {
    if (!this._scrollEnabled) {
      return
    }
    const distanceBarCount = distance / this._dataSpace
    this.actionExecute(ActionType.scroll, { barCount: distanceBarCount, distance })
    this._offsetRightBarCount = this._preOffsetRightBarCount - distanceBarCount
    this._adjustFromTo()
    this.invalidate()
  }

  /**
   * x转换成浮点数的位置
   * @param x
   * @returns {number}
   */
  coordinateToFloatIndex (x) {
    const dataSize = this._dataList.length
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
    const data = this._dataList[dataIndex]
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
    if (this._dataList.length === 0) {
      return 0
    }
    return binarySearchNearest(this._dataList, 'timestamp', timestamp)
  }

  /**
   * 缩放
   * @param scale
   * @param point
   */
  zoom (scale, point) {
    if (!this._zoomEnabled) {
      return
    }
    if (!point || isValid(point.x)) {
      point = { x: isValid(this._crosshair.x) ? this._crosshair.x : this._totalDataSpace / 2 }
    }
    this.actionExecute(ActionType.zoom, { point, scale })
    const floatIndexAtZoomPoint = this.coordinateToFloatIndex(point.x)
    const dataSpace = this._dataSpace + scale * (this._dataSpace / 10)
    if (this._innerSetDataSpace(dataSpace)) {
      this._offsetRightBarCount += (floatIndexAtZoomPoint - this.coordinateToFloatIndex(point.x))
      this._adjustFromTo()
      this.invalidate()
    }
  }

  /**
   * 刷新
   * @param invalidateLevel
   */
  invalidate (invalidateLevel) {
    this._invalidateHandler(invalidateLevel)
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
  loadMore (callback) {
    this._loadMoreCallback = callback
  }

  /**
   * 清空图形标记
   */
  clearGraphicMark () {
    if (this._graphicMarks.length > 0) {
      this._graphicMarks = []
      this.invalidate(InvalidateLevel.GRAPHIC_MARK)
    }
  }

  /**
   * 添加标记实例
   * @param graphicMark
   */
  addGraphicMarkInstance (graphicMark) {
    for (const mark of this._graphicMarks) {
      if (mark.id() === graphicMark.id()) {
        return false
      }
    }
    const lastGraphicMark = this._graphicMarks[this._graphicMarks.length - 1]
    if (lastGraphicMark && lastGraphicMark.isDrawing()) {
      this._graphicMarks[this._graphicMarks.length - 1] = graphicMark
    } else {
      this._graphicMarks.push(graphicMark)
    }
    this.invalidate(InvalidateLevel.GRAPHIC_MARK)
    return true
  }

  /**
   * 添加自定义标记图形
   * @param graphicMark
   */
  addCustomGraphicMark (graphicMark) {
    const GraphicMarkClass = createGraphicMarkClass(graphicMark)
    if (GraphicMarkClass) {
      this._graphicMarkMapping[graphicMark.name] = GraphicMarkClass
    }
  }

  /**
   * 设置图形标记配置
   * @param id
   * @param options
   */
  setGraphicMarkOptions (id, options = {}) {
    const { styles } = options
    for (const graphicMark of this._graphicMarks) {
      if (graphicMark.id() === id) {
        if (graphicMark.setStyles(styles)) {
          this.invalidate(InvalidateLevel.GRAPHIC_MARK)
        }
        break
      }
    }
  }

  /**
   * 移除图形实例
   * @param options 参数
   */
  removeGraphicMarkInstance (options) {
    const graphicMarks = this._graphicMarks
    let removeIndex = -1
    if (options.type === RemoveGraphicMarkOperateType.ID) {
      for (let i = 0; i < graphicMarks.length; i++) {
        if (options.id === graphicMarks[i].id()) {
          removeIndex = i
          break
        }
      }
    } else {
      removeIndex = options.index
    }
    if (removeIndex !== -1) {
      graphicMarks[removeIndex].onRemove({ id: graphicMarks[removeIndex].id() })
      graphicMarks.splice(removeIndex, 1)
      this.invalidate(InvalidateLevel.GRAPHIC_MARK)
    }
  }

  /**
   * 获取图形标记拖拽标记
   * @returns {boolean}
   */
  dragGraphicMarkFlag () {
    return this._dragGraphicMarkFlag
  }

  /**
   * 设置图形标记拖拽标记
   * @param flag
   */
  setDragGraphicMarkFlag (flag) {
    this._dragGraphicMarkFlag = flag
  }

  /**
   * 设置图形标记鼠标操作信息
   * @param hoverOperate
   * @param clickOperate
   */
  setGraphicMarkMouseOperate (hoverOperate, clickOperate) {
    const { hover, click } = this._graphicMarkMouseOperate
    const lastGraphicMark = this._graphicMarks[this._graphicMarks.length - 1]
    let shouldInvalidate = false
    if (hoverOperate &&
      (hover.id !== hoverOperate.id || hover.element !== hoverOperate.element || hover.elementIndex !== hoverOperate.elementIndex)
    ) {
      this._graphicMarkMouseOperate.hover = { ...hoverOperate }
      shouldInvalidate = true
    }
    if (clickOperate &&
      (click.id !== clickOperate.id || click.element !== clickOperate.element || click.elementIndex !== clickOperate.elementIndex)
    ) {
      this._graphicMarkMouseOperate.click = { ...clickOperate }
      shouldInvalidate = true
    }
    if (shouldInvalidate || (lastGraphicMark && lastGraphicMark.isDrawing())) {
      this.invalidate(InvalidateLevel.GRAPHIC_MARK)
    }
  }

  /**
   * 获取图形标记鼠标操作信息
   * @return {{hover: {id: string, elementIndex: number, element: string}, click: {id: string, elementIndex: number, element: string}}}
   */
  graphicMarkMouseOperate () {
    return this._graphicMarkMouseOperate
  }

  /**
   * 获取拖拽Pane标记
   * @return {boolean}
   */
  dragPaneFlag () {
    return this._dragPaneFlag
  }

  /**
   * 设置拖拽Pane标记
   * @param flag
   */
  setDragPaneFlag (flag) {
    this._dragPaneFlag = flag
  }

  /**
   * 获取图形标记映射
   * @returns {{}}
   */
  graphicMarkMapping () {
    return this._graphicMarkMapping
  }

  /**
   * 获取图形标记的数据
   * @returns {{}}
   */
  graphicMarks () {
    return this._graphicMarks
  }

  /**
   * 添加一个自定义指标
   * @param technicalIndicator
   */
  addCustomTechnicalIndicator (technicalIndicator) {
    const technicalIndicatorInstance = createTechnicalIndicatorInstance(technicalIndicator || {})
    if (technicalIndicatorInstance) {
      // 将生成的新的指标类放入集合
      this._technicalIndicatorMapping[technicalIndicatorInstance.name] = technicalIndicatorInstance
    }
  }

  /**
   * 事件执行
   * @param type
   * @param data
   * @param executeBeforeFun
   * @param executeAfterFun
   */
  actionExecute (type, data, executeBeforeFun, executeAfterFun) {
    const delegate = this._actionDelegate[type]
    if (delegate && delegate.hasObservers()) {
      executeBeforeFun && executeBeforeFun()
      delegate.execute(data)
      executeAfterFun && executeAfterFun()
    }
  }

  /**
   * 订阅事件
   * @param type
   * @param callback
   * @return {boolean}
   */
  subscribeAction (type, callback) {
    if (!(type in ActionType)) {
      return false
    }
    let delegate = this._actionDelegate[type]
    if (!delegate) {
      delegate = new Delegate()
      this._actionDelegate[type] = delegate
    }
    delegate.subscribe(callback)
    return true
  }

  /**
   * 取消事件订阅
   * @param type
   * @param callback
   * @return {boolean}
   */
  unsubscribeAction (type, callback) {
    if (!(type in ActionType)) {
      return false
    }
    const delegate = this._actionDelegate[type]
    if (delegate) {
      delegate.unsubscribe(callback)
      if (!delegate.hasObservers()) {
        delete this._actionDelegate[type]
        return true
      }
    }
    return false
  }
}

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

import {
  isArray, isObject,
  isFunction, isBoolean,
  isValid, merge, clone
} from '../utils/typeChecks'
import { defaultStyleOptions } from './options/styleOptions'

import { formatValue } from '../utils/format'
import { binarySearchNearest } from '../utils/number'
import { logWarn } from '../utils/logger'

import {
  createTechnicalIndicatorInstance,
  createTechnicalIndicatorMapping,
  createTechnicalIndicatorInfo
} from '../base/technicalindicator/technicalIndicatorControl'
import { TechnicalIndicatorSeries } from '../base/technicalindicator/TechnicalIndicator'
import { GraphicMarkMouseOperateElement } from '../base/overlay/mark/GraphicMark'
import Delegate from './delegate/Delegate'
import {
  createGraphicMarkClass,
  createGraphicMarkMapping,
  getGraphicMarkInfo
} from '../base/overlay/mark/graphicMarkControl'

import { MIN_DATA_SPACE, MAX_DATA_SPACE, InvalidateLevel, ActionType } from './constants'

export default class ChartData {
  constructor (styleOptions, handler) {
    // 持有者
    this._handler = handler
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
    // 可见的数据(需要绘制的数据)
    this._visibleDataList = []

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

    // 注解标记
    this._annotations = new Map()
    // 可见的注解标记
    this._visibleAnnotations = []
    // 注解鼠标操作信息
    this._annotationMouseOperate = { id: '' }

    // 标签
    this._tags = new Map()

    // 调整pane标记
    this._dragPaneFlag = false

    // 事件代理
    this._actionDelegate = new Map()
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
   * 调整可见数据
   * @private
   */
  _adjustVisibleDataList () {
    // 处理需要绘制的数据
    const dataSize = this._dataList.length
    this._visibleDataList = []
    this._visibleAnnotations = []
    for (let i = this._from; i < this._to; i++) {
      const kLineData = this._dataList[i]
      const deltaFromRight = dataSize + this._offsetRightBarCount - i
      const x = this._totalDataSpace - (deltaFromRight - 0.5) * this._dataSpace
      this._visibleDataList.push({
        index: i,
        x,
        data: kLineData
      })
      const annotation = this._annotations.get(kLineData.timestamp) || []
      if (annotation.length > 0) {
        for (const an of annotation) {
          an.createSymbolCoordinate(x)
          this._visibleAnnotations.push(an)
        }
      }
    }
  }

  /**
   * 调整绘制起点终点位置
   * @private
   */
  _adjustFromTo () {
    const dataSize = this._dataList.length
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
    this._adjustVisibleDataList()
    // 处理加载更多，有更多并且没有在加载则去加载更多
    if (this._from === 0 && this._more && !this._loading && this._loadMoreCallback && isFunction(this._loadMoreCallback)) {
      this._loading = true
      this._loadMoreCallback(formatValue(this._dataList[0], 'timestamp'))
    }
  }

  /**
   * 获取样式配置
   * @return {{}}
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
  getTechnicalIndicatorInfo (name) {
    if (isValid(name)) {
      const tech = this.getTechnicalIndicatorInstance(name)
      if (tech) {
        return createTechnicalIndicatorInfo(tech)
      }
    } else {
      const techs = {}
      for (const name in this._technicalIndicatorMapping) {
        const instance = this._technicalIndicatorMapping[name]
        techs[name] = createTechnicalIndicatorInfo(instance)
      }
      return techs
    }
    return {}
  }

  /**
   * 根据指标类型获取指标类
   * @param name
   * @return {*}
   */
  getTechnicalIndicatorInstance (name) {
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
   * 设置价格和数量精度
   * @param pricePrecision
   * @param volumePrecision
   */
  setPriceVolumePrecision (pricePrecision, volumePrecision) {
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
   * 获取数据源
   * @returns {[]|*[]}
   */
  dataList () {
    return this._dataList
  }

  /**
   * 获取可见数据源
   * @returns {[]|*[]}
   */
  visibleDataList () {
    return this._visibleDataList
  }

  /**
   * 清空数据源
   */
  clearDataList () {
    this._more = true
    this._loading = true
    this._dataList = []
    this._visibleDataList = []
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
        }
        this._adjustFromTo()
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
          this._adjustVisibleDataList()
        }
      }
      this.setCrosshair(this._crosshair, true)
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
    this._adjustFromTo()
    this.setCrosshair(this._crosshair, true)
    this.invalidate()
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
    this.setCrosshair(this._crosshair, true)
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
      this._adjustFromTo()
      this.setCrosshair(this._crosshair, true)
      this.invalidate()
    }
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
   * 设置十字光标点信息
   * @param crosshair
   * @param notInvalidate
   */
  setCrosshair (crosshair, notInvalidate) {
    const cr = crosshair || {}
    let realDataIndex
    let dataIndex
    if (isValid(cr.x)) {
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
    const kLineData = this._dataList[dataIndex]
    const realX = this.dataIndexToCoordinate(realDataIndex)
    const prevCrosshair = { x: this._crosshair.x, y: this._crosshair.y, paneId: this._crosshair.paneId }
    this._crosshair = { ...cr, realX, kLineData, realDataIndex, dataIndex }
    if (cr.paneId && kLineData) {
      this._handler.crosshair({
        realDataIndex,
        dataIndex,
        kLineData,
        x: cr.x,
        y: cr.y
      })
    }
    if (
      (prevCrosshair.x !== cr.x || prevCrosshair.y !== cr.y || prevCrosshair.paneId !== cr.paneId) && !notInvalidate
    ) {
      this.invalidate(InvalidateLevel.OVERLAY)
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
   * @param crosshair
   */
  scroll (distance, crosshair) {
    if (!this._scrollEnabled) {
      return
    }
    const distanceBarCount = distance / this._dataSpace
    this.actionExecute(ActionType.SCROLL, { barCount: distanceBarCount, distance })
    this._offsetRightBarCount = this._preOffsetRightBarCount - distanceBarCount
    this._adjustFromTo()
    const cross = crosshair || this._crosshair
    this.setCrosshair(cross, true)
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
   * 数据索引转换成坐标
   * @param dataIndex
   */
  dataIndexToCoordinate (dataIndex) {
    const dataSize = this._dataList.length
    const deltaFromRight = dataSize + this._offsetRightBarCount - dataIndex
    // return this._totalDataSpace - (deltaFromRight - 0.5) * this._dataSpace + this._barSpace / 2
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
   * @param point
   */
  zoom (scale, point) {
    if (!this._zoomEnabled) {
      return
    }
    if (!point || !isValid(point.x)) {
      point = { x: isValid(this._crosshair.x) ? this._crosshair.x : this._totalDataSpace / 2 }
    }
    this.actionExecute(ActionType.ZOOM, { point, scale })
    const floatIndex = this.coordinateToFloatIndex(point.x)
    const dataSpace = this._dataSpace + scale * (this._dataSpace / 10)
    this.setDataSpace(dataSpace, () => {
      this._offsetRightBarCount += (floatIndex - this.coordinateToFloatIndex(point.x))
    })
  }

  /**
   * 刷新
   * @param invalidateLevel
   */
  invalidate (invalidateLevel) {
    this._handler.invalidate(invalidateLevel)
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
   * 添加标记实例
   * @param graphicMark
   */
  addGraphicMarkInstance (graphicMark) {
    if (this._graphicMarks.find(gm => gm.id() === graphicMark.id())) {
      return false
    }
    const lastGraphicMark = this._graphicMarks[this._graphicMarks.length - 1]
    if (lastGraphicMark && lastGraphicMark.isDrawing()) {
      this._graphicMarks[this._graphicMarks.length - 1] = graphicMark
    } else {
      this._graphicMarks.push(graphicMark)
    }
    this.invalidate(InvalidateLevel.OVERLAY)
    return true
  }

  /**
   * 添加自定义标记图形
   * @param graphicMarks
   */
  addCustomGraphicMark (graphicMarks) {
    graphicMarks.forEach(mark => {
      const GraphicMarkClass = createGraphicMarkClass(mark)
      if (GraphicMarkClass) {
        this._graphicMarkMapping[mark.name] = GraphicMarkClass
      }
    })
  }

  /**
   * 设置图形标记配置
   * @param id
   * @param options
   */
  setGraphicMarkOptions (id, options = {}) {
    const { styles, lock } = options
    const graphicMark = this._graphicMarks.find(gm => gm.id() === id)
    if (graphicMark) {
      graphicMark.setLock(lock)
      if (graphicMark.setStyles(styles, this._styleOptions.graphicMark)) {
        this.invalidate(InvalidateLevel.OVERLAY)
      }
    }
  }

  /**
   * 获取图形标记信息
   * @param id
   * @return {{name, lock: *, styles, id, points: (*|*[])}[]|{name, lock: *, styles, id, points: (*|*[])}}
   */
  getGraphicMark (id) {
    if (id) {
      const graphicMark = this._graphicMarks.find(gm => gm.id() === id)
      if (graphicMark) {
        return getGraphicMarkInfo(graphicMark)
      }
    } else {
      return this._graphicMarks.map(graphicMark => {
        return getGraphicMarkInfo(graphicMark)
      })
    }
    return null
  }

  /**
   * 移除图形实例
   * @param id 参数
   */
  removeGraphicMarkInstance (id) {
    const graphicMarks = this._graphicMarks
    if (isValid(id)) {
      const removeIndex = graphicMarks.findIndex(gm => gm.id() === id)
      if (removeIndex > -1) {
        graphicMarks[removeIndex].onRemove({ id: graphicMarks[removeIndex].id() })
        graphicMarks.splice(removeIndex, 1)
        this.invalidate(InvalidateLevel.OVERLAY)
      }
    } else {
      if (graphicMarks.length > 0) {
        graphicMarks.forEach(gm => {
          gm.onRemove({ id: gm.id() })
        })
        this._graphicMarks = []
        this.invalidate(InvalidateLevel.OVERLAY)
      }
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
   * 获取可见的注解
   * @return {[]}
   */
  visibleAnnotations () {
    return this._visibleAnnotations
  }

  /**
   * 获取注解鼠标操作信息
   * @return {null}
   */
  annotationMouseOperate () {
    return this._annotationMouseOperate
  }

  /**
   * 创建注解
   * @param annotations
   */
  addAnnotations (annotations) {
    annotations.forEach(annotation => {
      if (this._annotations.has(annotation.id())) {
        this._annotations.get(annotation.id()).push(annotation)
      } else {
        this._annotations.set(annotation.id(), [annotation])
      }
    })
    this._adjustVisibleDataList()
    this.invalidate(InvalidateLevel.OVERLAY)
  }

  /**
   * 移除注解
   * @param points
   */
  removeAnnotation (points) {
    let shouldAdjust = false
    if (isValid(points)) {
      ([].concat(points)).forEach(({ timestamp }) => {
        if (this._annotations.has(timestamp)) {
          shouldAdjust = true
          this._annotations.delete(timestamp)
        }
      })
      if (shouldAdjust) {
        this._adjustVisibleDataList()
      }
    } else {
      shouldAdjust = true
      this._annotations.clear()
      this._visibleAnnotations = []
    }
    if (shouldAdjust) {
      this.invalidate(InvalidateLevel.OVERLAY)
    }
  }

  /**
   * 获取标签
   * @return {Map<any, any>}
   */
  tags () {
    return this._tags
  }

  /**
   * 根据id获取标签实例
   * @param id
   * @return
   */
  getTag (id) {
    return this._tags.get(id)
  }

  /**
   * 添加标签
   * @param tags
   */
  addTags (tags) {
    tags.forEach(tag => {
      this._tags.set(tag.id(), tag)
    })
    this.invalidate(InvalidateLevel.OVERLAY)
  }

  /**
   * 移除标签
   * @param id
   */
  removeTag (id) {
    let shouldInvalidate = false
    if (isValid(id)) {
      const ids = [].concat(id)
      ids.forEach(id => {
        if (this._tags.has(id)) {
          shouldInvalidate = true
          this._tags.delete(id)
        }
      })
    } else {
      shouldInvalidate = true
      this._tags.clear()
    }
    if (shouldInvalidate) {
      this.invalidate(InvalidateLevel.OVERLAY)
    }
  }

  /**
   * 设置覆盖物鼠标操作信息
   * @param graphicMarkOperate
   * @param annotationOperate
   */
  setOverlayMouseOperate (graphicMarkOperate, annotationOperate) {
    const { hover, click } = this._graphicMarkMouseOperate
    const { id } = this._annotationMouseOperate
    const lastGraphicMark = this._graphicMarks[this._graphicMarks.length - 1]
    let shouldInvalidate = false
    if (graphicMarkOperate.hover &&
      (hover.id !== graphicMarkOperate.hover.id || hover.element !== graphicMarkOperate.hover.element || hover.elementIndex !== graphicMarkOperate.hover.elementIndex)
    ) {
      this._graphicMarkMouseOperate.hover = { ...graphicMarkOperate.hover }
      shouldInvalidate = true
    }
    if (graphicMarkOperate.click &&
      (click.id !== graphicMarkOperate.click.id || click.element !== graphicMarkOperate.click.element || click.elementIndex !== graphicMarkOperate.click.elementIndex)
    ) {
      this._graphicMarkMouseOperate.click = { ...graphicMarkOperate.click }
      shouldInvalidate = true
    }
    if (annotationOperate && id !== annotationOperate.id) {
      this._annotationMouseOperate = { ...annotationOperate }
      shouldInvalidate = true
    }
    if (shouldInvalidate || (lastGraphicMark && lastGraphicMark.isDrawing())) {
      this.invalidate(InvalidateLevel.OVERLAY)
    }
  }

  /**
   * 添加一个自定义指标
   * @param techs
   */
  addCustomTechnicalIndicator (techs) {
    techs.forEach(tech => {
      const instance = createTechnicalIndicatorInstance(tech || {})
      if (instance) {
        // 将生成的新的指标类放入集合
        this._technicalIndicatorMapping[instance.name] = instance
      }
    })
  }

  /**
   * 事件执行
   * @param type
   * @param data
   * @param executeBeforeFun
   * @param executeAfterFun
   */
  actionExecute (type, data, executeBeforeFun, executeAfterFun) {
    if (this.hasAction(type)) {
      executeBeforeFun && executeBeforeFun()
      this._actionDelegate.get(type).execute(data)
      executeAfterFun && executeAfterFun()
    }
  }

  /**
   * 是否有事件监听
   * @param type
   * @return {boolean}
   */
  hasAction (type) {
    return this._actionDelegate.has(type) && this._actionDelegate.get(type).hasObservers()
  }

  /**
   * 订阅事件
   * @param type
   * @param callback
   * @return {boolean}
   */
  subscribeAction (type, callback) {
    if (Object.values(ActionType).indexOf(type) < 0) {
      return false
    }
    if (!this._actionDelegate.has(type)) {
      this._actionDelegate.set(type, new Delegate())
    }
    this._actionDelegate.get(type).subscribe(callback)
    return true
  }

  /**
   * 取消事件订阅
   * @param type
   * @param callback
   * @return {boolean}
   */
  unsubscribeAction (type, callback) {
    if (Object.values(ActionType).indexOf(type) < 0) {
      return false
    }
    if (this._actionDelegate.has(type)) {
      const delegate = this._actionDelegate.get(type)
      delegate.unsubscribe(callback)
      if (!delegate.hasObservers()) {
        this._actionDelegate.delete(type)
      }
      return true
    }
    return false
  }
}

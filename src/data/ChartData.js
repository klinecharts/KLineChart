import {isArray, isObject, merge, clone, isFunction, isBoolean, isNumber} from '../utils/typeChecks'
import { defaultStyleOptions } from './options/styleOptions'
import { defaultTechnicalIndicatorParamOptions, TechnicalIndicatorType } from './options/technicalIndicatorParamOptions'
import { defaultPrecisionOptions } from './options/precisionOptions'

import calcIndicator from './calcIndicator'
import { formatValue } from '../utils/format'

export const InvalidateLevel = {
  NONE: 0,
  GRAPHIC_MARK: 1,
  FLOAT_LAYER: 2,
  MAIN: 3,
  FULL: 4
}

export const GraphicMarkType = {
  NONE: 'none',
  HORIZONTAL_STRAIGHT_LINE: 'horizontalStraightLine',
  VERTICAL_STRAIGHT_LINE: 'verticalStraightLine',
  STRAIGHT_LINE: 'straightLine',
  HORIZONTAL_RAY_LINE: 'horizontalRayLine',
  VERTICAL_RAY_LINE: 'verticalRayLine',
  RAY_LINE: 'rayLine',
  HORIZONTAL_SEGMENT_LINE: 'horizontalSegmentLine',
  VERTICAL_SEGMENT_LINE: 'verticalSegmentLine',
  SEGMENT_LINE: 'segmentLine',
  PRICE_LINE: 'priceLine',
  PRICE_CHANNEL_LINE: 'priceChannelLine',
  PARALLEL_STRAIGHT_LINE: 'parallelStraightLine',
  FIBONACCI_LINE: 'fibonacciLine'
}

const MAX_DATA_SPACE = 30
const MIN_DATA_SPACE = 3

export default class ChartData {
  constructor (styleOptions, invalidateHandler) {
    // 刷新持有者
    this._invalidateHandler = invalidateHandler
    // 样式配置
    this._styleOptions = clone(defaultStyleOptions)
    merge(this._styleOptions, styleOptions)
    // 指标参数配置
    this._technicalIndicatorParamOptions = clone(defaultTechnicalIndicatorParamOptions)
    // 精度配置
    this._precisionOptions = clone(defaultPrecisionOptions)
    // 时区
    this._timezone = null

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
    // 向右偏移的数量
    this._offsetRightBarCount = 50 / this._dataSpace
    // 左边最小可见bar的个数
    this._leftMinVisibleBarCount = 2
    // 右边最小可见bar的个数
    this._rightMinVisibleBarCount = 2
    // 开始绘制的索引
    this._from = 0
    // 结束的索引
    this._to = 0

    // 十字光标位置
    this._crossHairPoint = null
    // 标识十字光标在哪个series
    this._crossHairSeriesTag = null
    // 用来记录开始拖拽时向右偏移的数量
    this._preOffsetRightBarCount = 0

    // 当前绘制的标记图形的类型
    this._graphicMarkType = GraphicMarkType.NONE
    // 标记图形点
    this._graphicMarkPoint = null
    // 拖拽标记图形标记
    this._dragGraphicMarkFlag = false
    // 绘图标记数据
    this._graphicMarkDatas = {
      // 水平直线
      horizontalStraightLine: [],
      // 垂直直线
      verticalStraightLine: [],
      // 直线
      straightLine: [],
      // 水平射线
      horizontalRayLine: [],
      // 垂直射线
      verticalRayLine: [],
      // 射线
      rayLine: [],
      // 水平线段
      horizontalSegmentLine: [],
      // 垂直线段
      verticalSegmentLine: [],
      // 线段
      segmentLine: [],
      // 价格线
      priceLine: [],
      // 平行直线
      parallelStraightLine: [],
      // 价格通道线
      priceChannelLine: [],
      // 斐波那契线
      fibonacciLine: []
    }
  }

  /**
   * 加载更多持有者
   * @private
   */
  _loadMoreHandler () {
    // 有更多并且没有在加载则去加载更多
    if (this._more && !this._loading && this._loadMoreCallback && isFunction(this._loadMoreCallback)) {
      this._loading = true
      this._loadMoreCallback(formatValue(this._dataList[0], 'timestamp'))
    }
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
   * 获取样式配置
   */
  styleOptions () {
    return this._styleOptions
  }

  applyStyleOptions (options) {
    merge(this._styleOptions, options)
  }

  /**
   * 获取计算指标参数配置
   */
  technicalIndicatorParamOptions () {
    return this._technicalIndicatorParamOptions
  }

  /**
   * 加载技术指标参数
   * @param technicalIndicatorType
   * @param params
   */
  applyTechnicalIndicatorParams (technicalIndicatorType, params = []) {
    if (this._technicalIndicatorParamOptions.hasOwnProperty(technicalIndicatorType)) {
      this._technicalIndicatorParamOptions[technicalIndicatorType] = params
    }
  }

  /**
   * 精度配置
   */
  precisionOptions () {
    return this._precisionOptions
  }

  /**
   * 设置时区
   * @param timezone
   */
  setTimezone (timezone) {
    this._timezone = timezone
  }

  /**
   * 获取时区
   * @returns {null}
   */
  timezone () {
    return this._timezone
  }

  /**
   * 加载精度
   * @param pricePrecision
   * @param volumePrecision
   */
  applyPrecision (pricePrecision, volumePrecision) {
    if ((pricePrecision || pricePrecision === 0) && !(pricePrecision < 0)) {
      this._precisionOptions.price = pricePrecision
      this._precisionOptions[TechnicalIndicatorType.MA] = pricePrecision
      this._precisionOptions[TechnicalIndicatorType.BOLL] = pricePrecision
      this._precisionOptions[TechnicalIndicatorType.SAR] = pricePrecision
    }
    if ((volumePrecision || volumePrecision === 0) && !(volumePrecision < 0)) {
      this._precisionOptions.volume = volumePrecision
      this._precisionOptions[TechnicalIndicatorType.VOL] = volumePrecision
    }
  }

  /**
   * 计算指标
   * @param technicalIndicatorType
   * @returns {boolean}
   */
  calcTechnicalIndicator (technicalIndicatorType) {
    if (technicalIndicatorType === TechnicalIndicatorType.NO) {
      return true
    }
    const calcFun = calcIndicator[technicalIndicatorType]
    if (calcFun) {
      this._dataList = calcFun(this._dataList, this._technicalIndicatorParamOptions[technicalIndicatorType])
      return true
    }
    return false
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
        this._dataList = data.concat(this._dataList)
        this.adjustOffsetBarCount()
        return InvalidateLevel.FULL
      } else {
        const dataSize = this._dataList.length
        if (pos >= dataSize) {
          const level = this._to - this._from < this._totalDataSpace / this._dataSpace ? InvalidateLevel.FULL : InvalidateLevel.MAIN
          this._dataList.push(data)
          if (this._offsetRightBarCount < 0) {
            this._offsetRightBarCount += 1
          }
          this.adjustOffsetBarCount()
          return level
        } else {
          this._dataList[pos] = data
          return InvalidateLevel.MAIN
        }
      }
    }
    return InvalidateLevel.NONE
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
      this.adjustOffsetBarCount()
      this._invalidateHandler()
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
    this.adjustOffsetBarCount()
  }

  /**
   * 设置右边可以偏移的空间
   * @param space
   */
  setOffsetRightSpace (space) {
    this._offsetRightBarCount = space / this._dataSpace
    this.adjustOffsetBarCount()
  }

  /**
   * 设置左边可见的最小bar数量
   * @param barCount
   */
  setLeftMinVisibleBarCount (barCount) {
    if (isNumber(barCount) && barCount > 0) {
      this._leftMinVisibleBarCount = Math.ceil(barCount)
    }
  }

  /**
   * 设置右边可见的最小bar数量
   * @param barCount
   */
  setRightMinVisibleBarCount (barCount) {
    if (isNumber(barCount) && barCount > 0) {
      this._rightMinVisibleBarCount = Math.ceil(barCount)
    }
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
   * 获取十字光标点
   * @returns {null}
   */
  crossHairPoint () {
    return this._crossHairPoint
  }

  /**
   * 获取十字光标点所在的series的标识
   * @returns {null}
   */
  crossHairSeriesTag () {
    return this._crossHairSeriesTag
  }

  /**
   * 设置十字光标点所在的series的标识
   * @param tag
   */
  setCrossHairSeriesTag (tag) {
    this._crossHairSeriesTag = tag
    this._invalidateHandler(InvalidateLevel.FLOAT_LAYER)
  }

  /**
   * 设置十字光标点
   * @param point
   */
  setCrossHairPoint (point) {
    this._crossHairPoint = point
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
    const distanceBarCount = distance / this._dataSpace
    this._offsetRightBarCount = this._preOffsetRightBarCount - distanceBarCount
    this.adjustOffsetBarCount()
    if (distanceBarCount > 0 && this._from === 0) {
      this._loadMoreHandler()
    }
    this._invalidateHandler()
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
    return Math.round(index * 10000000) / 10000000
  }

  /**
   * 缩放
   * @param scale
   * @param point
   */
  zoom (scale, point) {
    const floatIndexAtZoomPoint = this.coordinateToFloatIndex(point.x)
    const dataSpace = this._dataSpace + scale * (this._dataSpace / 10)
    if (this._innerSetDataSpace(dataSpace)) {
      this._offsetRightBarCount += (floatIndexAtZoomPoint - this.coordinateToFloatIndex(point.x))
      this.adjustOffsetBarCount()
      this._invalidateHandler()
    }
  }

  /**
   * 调整向右偏移bar的个数
   * @private
   */
  adjustOffsetBarCount () {
    const dataSize = this._dataList.length
    const barLength = this._totalDataSpace / this._dataSpace
    const difBarCount = 1 - this._barSpace / 2 / this._dataSpace
    const maxRightOffsetBarCount = barLength - Math.min(this._leftMinVisibleBarCount, dataSize) + difBarCount
    if (this._offsetRightBarCount > maxRightOffsetBarCount) {
      this._offsetRightBarCount = maxRightOffsetBarCount
    }

    const minRightOffsetBarCount = -dataSize + 1 + Math.min(this._rightMinVisibleBarCount, dataSize) - difBarCount

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
  }

  /**
   * 获取图形标记类型
   * @returns {string}
   */
  graphicMarkType () {
    return this._graphicMarkType
  }

  /**
   * 设置图形标记类型
   * @param graphicMarkType
   */
  setGraphicMarkType (graphicMarkType) {
    this._graphicMarkType = graphicMarkType
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
   * 获取图形标记开始的点
   * @returns {null}
   */
  graphicMarkPoint () {
    return this._graphicMarkPoint
  }

  /**
   * 设置图形标记开始的点
   * @param point
   */
  setGraphicMarkPoint (point) {
    this._graphicMarkPoint = point
  }

  /**
   * 获取图形标记的数据
   * @returns {{straightLine: [], verticalRayLine: [], rayLine: [], segmentLine: [], horizontalRayLine: [], horizontalSegmentLine: [], fibonacciLine: [], verticalStraightLine: [], priceChannelLine: [], priceLine: [], verticalSegmentLine: [], horizontalStraightLine: [], parallelStraightLine: []}}
   */
  graphicMarkData () {
    return this._graphicMarkDatas
  }

  /**
   * 设置图形标记的数据
   * @param datas
   */
  setGraphicMarkData (datas) {
    const shouldInvalidate = this.shouldInvalidateGraphicMark()
    this._graphicMarkDatas = datas
    if (shouldInvalidate) {
      this._invalidateHandler(InvalidateLevel.GRAPHIC_MARK)
    } else {
      if (this.shouldInvalidateGraphicMark()) {
        this._invalidateHandler(InvalidateLevel.GRAPHIC_MARK)
      }
    }
  }

  /**
   * 设置加载更多
   * @param callback
   */
  loadMore (callback) {
    this._loadMoreCallback = callback
  }

  /**
   * 是否需要刷新图形标记层
   * @returns {boolean}
   */
  shouldInvalidateGraphicMark () {
    if (this._graphicMarkType !== GraphicMarkType.NONE) {
      return true
    }
    for (const graphicMarkKey in this._graphicMarkDatas) {
      if (this._graphicMarkDatas[graphicMarkKey].length > 0) {
        return true
      }
    }
    return false
  }
}

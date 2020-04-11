import { isArray, isObject, merge, clone, isFunction, isBoolean } from '../utils/typeChecks'
import { defaultStyleOptions } from './options/styleOptions'
import { defaultTechnicalIndicatorParamOptions, TechnicalIndicatorType } from './options/technicalIndicatorParamOptions'
import { defaultPrecisionOptions } from './options/precisionOptions'

import calcIndicator from './calcIndicator'
import { formatValue } from '../utils/format'

export const InvalidateLevel = {
  FLOAT_LAYER: 1,
  GRAPHIC_MARK: 2,
  FULL: 3
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
    // 向右偏移的空间
    this._offsetRightSpace = 50
    // 开始绘制的索引
    this._from = 0
    // 结束的索引
    this._to = 0
    // 绘制区间数据数量
    this._range = 0
    // 每一条数据的空间
    this._dataSpace = 6
    // bar的空间
    this._barSpace = this._calcBarSpace()

    // 十字光标位置
    this._crossHairPoint = null
    // 标识十字光标在哪个series
    this._crossHairSeriesTag = null
    // 用来记录开始拖拽时数据绘制开始位置
    this._preFrom = 0

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
   * 计算绘制区间
   * @private
   */
  _calcRange () {
    this._range = Math.floor(this._totalDataSpace / this._dataSpace)
    this.adjustFromTo()
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
   * 计算rang dif
   * @private
   */
  _calcRangDif () {
    const offsetRightRange = Math.floor(this._offsetRightSpace / this._dataSpace)
    return this._range - offsetRightRange
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
    this._calcRange()
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
        if (this._dataList.length === 0) {
          this._loading = false
          this._more = isBoolean(more) ? more : true
          this._dataList = data.concat(this._dataList)
          const rangeDif = this._calcRangDif()
          this._from = this._dataList.length - rangeDif
          this.adjustFromTo()
        } else {
          this._loading = false
          this._more = more
          this._dataList = data.concat(this._dataList)
          this._from += data.length
          this.adjustFromTo()
        }
      } else {
        if (pos >= this._dataList.length) {
          const oldDataSize = this._dataList.length
          this._dataList.push(data)
          if (this._from !== 0) {
            if (this._to === oldDataSize) {
              this._to += 1
              const rangeDif = this._calcRangDif()
              if (this._to - this._from > rangeDif) {
                this._from += 1
              }
            }
          } else {
            const rangeDif = this._calcRangDif()
            if (this._dataList.length < rangeDif) {
              this._to = this._dataList.length
            } else {
              this._from += 1
              this._to += 1
            }
          }
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
   * 设置一条数据的空间
   * @param dataSpace
   */
  setDataSpace (dataSpace) {
    if (this._innerSetDataSpace(dataSpace)) {
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
    this._calcRange()
  }

  /**
   * 设置右边可以偏移的空间
   * @param space
   */
  setOffsetRightSpace (space) {
    if (space < 0) {
      space = 0
    }
    this._offsetRightSpace = space
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
   * 获取绘制数据个数
   * @returns {number}
   */
  range () {
    return this._range
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
   * 开始拖拽
   */
  startDrag () {
    this._preFrom = this._from
  }

  /**
   * 拖动
   * @param distance
   */
  drag (distance) {
    if (Math.abs(distance) < this._dataSpace / 2) {
      return
    }
    let distanceRange = distance / this._dataSpace
    distanceRange = distanceRange < 0 ? Math.floor(distanceRange) : Math.ceil(distanceRange)
    if (distanceRange === 0) {
      this._loadMoreHandler()
      return
    }
    if (distanceRange > 0) {
      // 右移
      if (this._from === 0) {
        this._loadMoreHandler(formatValue(this._dataList[0], 'timestamp'))
        this._invalidateHandler(InvalidateLevel.FLOAT_LAYER)
        return
      }
    } else {
      // 左移
      const rangeDif = this._calcRangDif()
      const dataSize = this._dataList.length
      if (this._from === dataSize - rangeDif) {
        this._invalidateHandler(InvalidateLevel.FLOAT_LAYER)
        return
      }
    }
    this._from = this._preFrom - distanceRange
    this.adjustFromTo()
    if (this._from === 0) {
      this._loadMoreHandler()
    }
    this._invalidateHandler()
  }

  /**
   * 缩放
   * @param zoomScale
   */
  zoom (zoomScale) {
    const dataSpace = this._dataSpace + zoomScale * (this._dataSpace / 10)
    if (this._innerSetDataSpace(dataSpace)) {
      this._invalidateHandler()
    }
  }

  /**
   * 调整from和to
   */
  adjustFromTo () {
    const dataSize = this._dataList.length
    const rangeDif = this._calcRangDif()
    if (this._from > dataSize - rangeDif) {
      this._from = dataSize - rangeDif
    }
    if (this._from < 0) {
      this._from = 0
    }
    this._to = this._from + this._range
    if (this._to > dataSize) {
      this._to = dataSize
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
    this._graphicMarkDatas = datas
    this._invalidateHandler(InvalidateLevel.GRAPHIC_MARK)
  }

  /**
   * 设置加载更多
   * @param callback
   */
  loadMore (callback) {
    this._loadMoreCallback = callback
  }
}

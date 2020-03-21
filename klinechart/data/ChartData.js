import { isArray, isObject, merge, clone } from '../utils/typeChecks'
import { defaultStyleOptions } from './options/styleOptions'
import { defaultTechnicalIndicatorParamOptions, TechnicalIndicatorType } from './options/technicalIndicatorParamOptions'
import { defaultPrecisionOptions } from './options/precisionOptions'

import { GraphicMarkType } from '../internal/constants'

import calcIndicator from '../internal/calcIndicator'

const BAR_MARGIN_SPACE_RATE = 0.25

export const InvalidateLevel = {
  CROSS_HAIR: 1,
  FULL: 2
}

const MAX_DATA_SPACE = 30
const MIN_DATA_SPACE = 3

export default class ChartData {
  constructor (styleOptions, invalidateHandler) {
    this._invalidateHandler = invalidateHandler
    // 样式配置
    this._styleOptions = clone(defaultStyleOptions)
    merge(this._styleOptions, styleOptions)
    // 指标参数配置
    this._technicalIndicatorParamOptions = clone(defaultTechnicalIndicatorParamOptions)

    this._precisionOptions = clone(defaultPrecisionOptions)

    // 数据源
    this._dataList = []

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
    this.graphicMarkType = GraphicMarkType.NONE
    // 标记图形点
    this.graphicMarkPoint = null
    // 是否在拖拽标记图形
    this.isDragGraphicMark = false
    // 绘图标记数据
    this.graphicMarkDatas = {
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

  _calcRange () {
    this._range = Math.floor(this._totalDataSpace / this._dataSpace)
    let to = this._from + this._range
    if (to > this._dataList.length) {
      to = this._dataList.length
    }
    this._to = to
  }

  _calcBarSpace () {
    return (1 - BAR_MARGIN_SPACE_RATE) * this._dataSpace
  }

  /**
   * 计算rang dif
   * @private
   */
  _calcRangDif () {
    const offsetRightRange = Math.floor(this._offsetRightSpace / this._dataSpace)
    return this._range - offsetRightRange
  }

  _innerSetDataSpace (dataSpace) {
    if (dataSpace < MIN_DATA_SPACE || dataSpace > MAX_DATA_SPACE) {
      return false
    }
    if (this._dataSpace === dataSpace) {
      return
    }
    this._dataSpace = dataSpace
    this._barSpace = this._calcBarSpace()
    this._calcRange()
    return true
  }

  /**
   * 将x转换成pos
   * @param x
   * @returns {number}
   * @private
   */
  _xToPos (x) {
    let range = x / this._dataSpace
    const floorRange = Math.floor(range)
    const spaceDif = (range - floorRange) * this._dataSpace
    if (spaceDif < this._barSpace / 2) {
      range = floorRange
    } else {
      range = Math.ceil(range)
    }
    return range
  }

  /**
   * 获取样式配置
   */
  styleOptions () {
    return this._styleOptions
  }

  /**
   * 获取计算指标参数配置
   */
  technicalIndicatorParamOptions () {
    return this._technicalIndicatorParamOptions
  }

  /**
   * 精度配置
   */
  precisionOptions () {
    return this._precisionOptions
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
    this._dataList = []
    this._from = 0
    this._to = 0
  }

  /**
   * 添加数据
   * @param data
   * @param pos
   */
  addData (data, pos) {
    if (isObject(data)) {
      if (isArray(data)) {
        if (this._dataList.length === 0) {
          this._dataList = data.concat(this._dataList)
          const rangeDif = this._calcRangDif()
          this._from = this._dataList.length - rangeDif
          this._fixFromTo()
        } else {
          this._dataList = data.concat(this._dataList)
          this._from += data.length
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
    this._invalidateHandler(InvalidateLevel.CROSS_HAIR)
  }

  /**
   * 设置十字光标点
   * @param point
   */
  setCrossHairPoint (point) {
    this._crossHairPoint = point
  }

  /**
   * 获取十字光标所在数据的位置
   * @returns {number}
   */
  getCrossHairDataPos () {
    let pos
    if (!this._crossHairPoint) {
      pos = this._to - 1
    } else {
      const range = this._xToPos(this._crossHairPoint.x)
      pos = this._from + range - 1
      if (pos > this._to - 1) {
        pos = this._to - 1
      }
    }
    return pos
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
      return
    }
    if (distanceRange > 0) {
      // 右移
      if (this._from === 0) {
        this._invalidateHandler(InvalidateLevel.CROSS_HAIR)
        return
      }
    } else {
      // 左移
      const rangeDif = this._calcRangDif()
      const dataSize = this._dataList.length
      if (this._from === dataSize - rangeDif) {
        this._invalidateHandler(InvalidateLevel.CROSS_HAIR)
        return
      }
    }
    this._from = this._preFrom - distanceRange
    this._fixFromTo()
    this._invalidateHandler()
  }

  /**
   * 缩放
   * @param zoomScale
   */
  zoom (zoomScale) {
    const dataSpace = this._dataSpace + zoomScale * (this._dataSpace / 10)
    if (this._innerSetDataSpace(dataSpace)) {
      this._fixFromTo()
      this._invalidateHandler()
    }
  }

  /**
   * 修正from和to
   * @private
   */
  _fixFromTo () {
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
}

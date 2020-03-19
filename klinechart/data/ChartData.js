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

const MAX_DATA_SPACE = 20
const MIN_DATA_SPACE = 2

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
    this._offsetRightSpace = 30
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

    // 当前提示数据的位置
    this.tooltipDataPos = 0
    // 十字光标中心点位置坐标
    this.crossPoint = null

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

  /**
   * 获取样式配置
   */
  styleOptions () {
    return this._styleOptions
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
      calcFun(this._technicalIndicatorParamOptions[technicalIndicatorType])
      return true
    }
    return false
  }

  dataList () {
    return this._dataList
  }

  clearDataList () {
    this._dataList = []
    this._from = 0
    this._to = 0
  }

  addData (data, pos) {
    if (isObject(data)) {
      if (isArray(data)) {
        if (this._dataList.length === 0) {
          this._dataList = data.concat(this._dataList)
          const rangeDif = this._calcRangDif()
          let from = this._dataList.length - rangeDif
          if (from < 0) {
            from = 0
          }
          this._from = from
          this._to = this._dataList.length
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

  dataSpace () {
    return this._dataSpace
  }

  barSpace () {
    return this._barSpace
  }

  /**
   * 设置一条数据的空间
   * @param dataSpace
   */
  setDataSpace (dataSpace) {
    if (dataSpace < MIN_DATA_SPACE || dataSpace > MAX_DATA_SPACE) {
      return
    }
    if (this._dataSpace === dataSpace) {
      return
    }
    this._dataSpace = dataSpace
    this._barSpace = this._calcBarSpace()
    this._calcRange()
    this._invalidateHandler()
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

  from () {
    return this._from
  }

  to () {
    return this._to
  }
}

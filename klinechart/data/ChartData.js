import { isArray, isObject, merge, clone } from '../utils/typeChecks'
import { defaultStyleOptions } from './options/styleOptions'
import {defaultTechnicalIndicatorParamOptions, TechnicalIndicatorType} from './options/technicalIndicatorParamOptions'

import { GraphicMarkType } from '../internal/constants'

import calcIndicator from '../internal/calcIndicator'

export const DATA_MARGIN_SPACE_RATE = 0.25

export const InvalidateLevel = {
  CROSS_HAIR: 1,
  FULL: 2
}

export default class ChartData {
  constructor (styleOptions) {
    this._styleOptions = clone(defaultStyleOptions)
    merge(this._styleOptions, styleOptions)
    this._technicalIndicatorParamOptions = clone(defaultTechnicalIndicatorParamOptions)

    // 数据源
    this.dataList = []
    // 数据绘制起始位置
    this.minPos = 0
    // 绘制的数据条数
    this.range = 180
    // 最大绘制条数
    this.maxRange = 300
    // 最小绘制条数
    this.minRange = 20
    // 每条数据的所占的空间
    this.dataSpace = 0
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

  /**
   * 获取样式配置
   */
  styleOptions () {
    return this._styleOptions
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

  clearDataList () {
    this._dataList = []
  }

  addData (data, pos) {
    if (isObject(data)) {
      if (isArray(data)) {
        if (this.dataList.length === 0) {
          this.dataList = data.concat(this.dataList)
          this.moveToLast(data.length)
        } else {
          this.dataList = data.concat(this.dataList)
          this.minPos += data.length
        }
      } else {
        let tooltipDataMoveCount = 0
        if (pos >= this.dataList.length) {
          tooltipDataMoveCount = 1
          this.dataList.push(data)
        } else if (pos <= 0) {
          this.dataList.unshift(data)
        } else {
          this.dataList[pos] = data
        }
        if (this.minPos + this.range >= this.dataList.length - 1) {
          this.moveToLast(tooltipDataMoveCount)
        }
      }
    }
  }

  moveToLast (tooltipDataMoveCount) {
    if (this.dataList.length > this.range) {
      this.minPos = this.dataList.length - this.range
      this.tooltipDataPos += tooltipDataMoveCount
      if (this.tooltipDataPos > this.dataList.length - 1) {
        this.tooltipDataPos = this.dataList.length - 1
      }
    } else {
      this.minPos = 0
    }
  }

  space (width) {
    this.dataSpace = width / this.range
  }

  calcCurrentTooltipDataPos (offsetLeft, x) {
    const range = +Math.ceil((x - offsetLeft) / this.dataSpace).toFixed(0)
    this.tooltipDataPos = this.minPos + range - 1
    if (this.tooltipDataPos > this.dataList.length - 1) {
      this.tooltipDataPos = this.dataList.length - 1
    }
    const sub = this.tooltipDataPos - this.minPos
    this.crossPoint.x = offsetLeft + this.dataSpace * sub + this.dataSpace * (1.0 - DATA_MARGIN_SPACE_RATE) / 2
  }
}

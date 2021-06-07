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

import { clone, isArray, isBoolean, isNumber, merge, isObject } from '../../utils/typeChecks'

/**
 * 技术指标系列
 * @type {{PRICE: string, VOLUME: string, NORMAL: string}}
 */
export const TechnicalIndicatorSeries = {
  PRICE: 'price',
  VOLUME: 'volume',
  NORMAL: 'normal'
}

/**
 * 绘制类型
 * @type {{BAR: string, LINE: string, CIRCLE: string}}
 */
export const TechnicalIndicatorPlotType = {
  LINE: 'line',
  BAR: 'bar',
  CIRCLE: 'circle'
}

export default class TechnicalIndicator {
  constructor ({
    name, series, calcParams, plots, precision,
    calcParamsAllowDecimal, shouldCheckParamCount,
    shouldOhlc, shouldFormatBigNumber,
    baseValue, minValue, maxValue, styles
  }) {
    // 指标名
    this.name = name || ''
    // 指标系列，值有 'price', 'volume', 'normal
    this.series = series || 'normal'
    // 精度
    this.precision = isNumber(precision) && precision >= 0 ? precision : 4
    // 计算参数
    this.calcParams = isArray(calcParams) ? calcParams : []
    // 数据信息
    this.plots = isArray(plots) ? plots : []
    // 计算参数是否允许小数
    this.calcParamsAllowDecimal = isObject(calcParamsAllowDecimal) ? calcParamsAllowDecimal : {}
    // 是否需要检查参数
    this.shouldCheckParamCount = isBoolean(shouldCheckParamCount) ? shouldCheckParamCount : true
    // 是否需要ohlc
    this.shouldOhlc = shouldOhlc
    // 是否需要格式化大数据值，从1000开始格式化，比如100000是否需要格式化100K
    this.shouldFormatBigNumber = shouldFormatBigNumber
    // 基础比对数据
    this.baseValue = isNumber(baseValue) ? baseValue : null
    // 指定的最小值
    this.minValue = minValue
    // 指定的最大值
    this.maxValue = maxValue
    // 样式
    this.styles = styles
  }

  setPrecision (precision) {
    if (isNumber(precision) && precision >= 0) {
      this.precision = parseInt(precision, 10)
      return true
    }
    return false
  }

  /**
   * 设置计算参数是否允许小数
   * @param calcParamsAllowDecimal
   */
  setCalcParamsAllowDecimal (calcParamsAllowDecimal) {
    if (isObject(calcParamsAllowDecimal)) {
      this.calcParamsAllowDecimal = calcParamsAllowDecimal
    }
  }

  setCalcParams (params) {
    if (!isArray(params)) {
      return false
    }
    if (this.shouldCheckParamCount && params.length !== this.calcParams.length) {
      return false
    }
    for (let i = 0; i < params.length; i++) {
      const v = params[i]
      if (!isNumber(v) || v <= 0 || (!this.calcParamsAllowDecimal[i] && parseInt(v, 10) !== v)) {
        return false
      }
    }
    this.calcParams = clone(params)
    const plots = this.regeneratePlots(params)
    if (plots && isArray(plots)) {
      this.plots = plots
    }
    return true
  }

  setStyles (styles, defaultStyles) {
    if (!isObject(styles)) {
      return false
    }
    if (!this.styles) {
      this.styles = {
        bar: clone(defaultStyles.bar),
        line: clone(defaultStyles.line),
        circle: clone(defaultStyles.circle)
      }
    }
    merge(this.styles, styles)
    return true
  }

  /**
   * 计算技术指标
   */
  calcTechnicalIndicator (dataList, calcParams) {}

  /**
   * 重新生成各项数据
   * @private
   */
  regeneratePlots (params) {}
}

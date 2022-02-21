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

import { clone, isArray, isBoolean, isNumber, merge, isObject, isFunction, isValid } from '../../utils/typeChecks'

/**
 * 绘制类型
 * @type {{BAR: string, LINE: string, CIRCLE: string}}
 */
export const TechnicalIndicatorPlotType = {
  LINE: 'line',
  BAR: 'bar',
  CIRCLE: 'circle'
}

/**
 * 系列
 */
export const TechnicalIndicatorSeries = {
  PRICE: 'price',
  VOLUME: 'volume',
  NORMAL: 'normal'
}

/**
 * 获取指标配置项样式
 * @param kLineDataList
 * @param techDataList
 * @param dataIndex
 * @param plot
 * @param techStyles
 * @param defaultStyle
 * @returns
 */
export function getTechnicalIndicatorPlotStyle (
  kLineDataList, techDataList, dataIndex, plot, techStyles, defaultStyle
) {
  let color = defaultStyle.color
  let isStroke = defaultStyle.isStroke
  const cbData = {
    prev: { kLineData: kLineDataList[dataIndex - 1], technicalIndicatorData: techDataList[dataIndex - 1] },
    current: { kLineData: kLineDataList[dataIndex], technicalIndicatorData: techDataList[dataIndex] },
    next: { kLineData: kLineDataList[dataIndex + 1], technicalIndicatorData: techDataList[dataIndex + 1] }
  }
  if (isValid(plot.color)) {
    if (isFunction(plot.color)) {
      color = plot.color(cbData, techStyles) || defaultStyle.color
    } else {
      color = plot.color || defaultStyle.color
    }
  }
  if (isValid(plot.isStroke)) {
    if (isFunction(plot.isStroke)) {
      isStroke = plot.isStroke(cbData)
    } else {
      isStroke = plot.isStroke
    }
  }
  return { color, isStroke }
}

export default class TechnicalIndicator {
  constructor ({
    name, shortName, series, calcParams, plots, precision,
    shouldCheckParamCount, shouldOhlc, shouldFormatBigNumber,
    minValue, maxValue, styles
  }) {
    // 指标名
    this.name = name || ''
    // 指标简短名称，用于显示
    this.shortName = isValid(shortName) ? shortName : name
    // 系列
    this.series = Object.values(TechnicalIndicatorSeries).indexOf(series) !== -1 ? series : TechnicalIndicatorSeries.NORMAL
    // 精度
    this.precision = isNumber(precision) && precision >= 0 ? precision : 4
    // 精度设置标识
    this._precisionFlag = false
    // 计算参数
    this.calcParams = isArray(calcParams) ? calcParams : []
    // 数据信息
    this.plots = isArray(plots) ? plots : []
    // 是否需要检查参数
    this.shouldCheckParamCount = isBoolean(shouldCheckParamCount) ? shouldCheckParamCount : true
    // 是否需要ohlc
    this.shouldOhlc = isBoolean(shouldOhlc) ? shouldOhlc : false
    // 是否需要格式化大数据值，从1000开始格式化，比如100000是否需要格式化100K
    this.shouldFormatBigNumber = isBoolean(shouldFormatBigNumber) ? shouldFormatBigNumber : false
    // 指定的最小值
    this.minValue = minValue
    // 指定的最大值
    this.maxValue = maxValue
    // 样式
    this.styles = styles
    // 结果
    this.result = []
  }

  _createParams (calcParams) {
    return calcParams.map(param => {
      if (isObject(param)) {
        return param.value
      }
      return param
    })
  }

  /**
   * 设置简短名称
   * @param shortName
   * @returns
   */
  setShortName (shortName) {
    if (isValid(shortName) && this.shortName !== shortName) {
      this.shortName = shortName
      return true
    }
    return false
  }

  /**
   * 设置精度
   * @param precision
   * @param flag
   * @returns
   */
  setPrecision (precision, flag) {
    if (isNumber(precision) && precision >= 0 && (!flag || (flag && !this._precisionFlag))) {
      this.precision = parseInt(precision, 10)
      if (!flag) {
        this._precisionFlag = true
      }
      return true
    }
    return false
  }

  /**
   * 设置计算参数
   * @param params
   * @returns
   */
  setCalcParams (params) {
    if (!isArray(params)) {
      return false
    }
    if (this.shouldCheckParamCount && params.length !== this.calcParams.length) {
      return false
    }
    const calcParams = []
    for (let i = 0; i < params.length; i++) {
      const param = params[i]
      let v
      let allowDecimal
      if (isObject(param)) {
        v = param.value
        allowDecimal = param.allowDecimal
      } else {
        v = param
        allowDecimal = false
      }
      const oldParam = this.calcParams[i]
      if (isObject(oldParam) && isBoolean(oldParam.allowDecimal)) {
        allowDecimal = oldParam.allowDecimal
      }
      if (
        !isNumber(v) ||
        v <= 0 ||
        (!allowDecimal && parseInt(v, 10) !== v)
      ) {
        return false
      }
      calcParams.push({ allowDecimal, value: v })
    }
    this.calcParams = calcParams
    const plots = this.regeneratePlots(this._createParams(calcParams))
    if (plots && isArray(plots)) {
      this.plots = plots
    }
    return true
  }

  setShouldOhlc (shouldOhlc) {
    if (isBoolean(shouldOhlc) && this.shouldOhlc !== shouldOhlc) {
      this.shouldOhlc = shouldOhlc
      return true
    }
    return false
  }

  setShouldFormatBigNumber (shouldFormatBigNumber) {
    if (isBoolean(shouldFormatBigNumber) && this.shouldFormatBigNumber !== shouldFormatBigNumber) {
      this.shouldFormatBigNumber = shouldFormatBigNumber
      return true
    }
    return false
  }

  setStyles (styles, defaultStyles) {
    if (!isObject(styles)) {
      return false
    }
    if (!this.styles) {
      this.styles = {
        margin: clone(defaultStyles.margin),
        bar: clone(defaultStyles.bar),
        line: clone(defaultStyles.line),
        circle: clone(defaultStyles.circle)
      }
    }
    merge(this.styles, styles)
    return true
  }

  /**
   * 计算
   * @param dataList
   * @return {*}
   */
  async calc (dataList) {
    this.result = await this.calcTechnicalIndicator(dataList, {
      params: this._createParams(this.calcParams),
      plots: this.plots
    }) || []
  }

  /**
   * 计算技术指标
   */
  calcTechnicalIndicator (dataList, options) {}

  /**
   * 重新生成各项数据
   * @param params
   */
  regeneratePlots (params) {}
}

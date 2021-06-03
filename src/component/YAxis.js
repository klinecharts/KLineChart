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

import Axis from './Axis'
import { CandleType, YAxisType } from '../data/options/styleOptions'
import { isNumber, isValid } from '../utils/typeChecks'
import { calcTextWidth, createFont } from '../utils/canvas'
import { formatBigNumber, formatPrecision } from '../utils/format'
import { round, log10, index10 } from '../utils/number'

export default class YAxis extends Axis {
  constructor (chartData, isCandleYAxis, additionalDataProvider) {
    super(chartData)
    this._realRange = 0
    this._isCandleYAxis = isCandleYAxis
    this._additionalDataProvider = additionalDataProvider
  }

  _computeMinMax () {
    const minMaxArray = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    const plotsResult = []
    let shouldOhlc = false
    let minValue = Number.MAX_SAFE_INTEGER
    let maxValue = Number.MIN_SAFE_INTEGER
    let technicalIndicatorPrecision = Number.MAX_SAFE_INTEGER
    const technicalIndicators = this._additionalDataProvider.technicalIndicators()
    technicalIndicators.forEach(tech => {
      if (!shouldOhlc) {
        shouldOhlc = tech.should
      }
      technicalIndicatorPrecision = Math.min(technicalIndicatorPrecision, tech.precision)
      if (isValid(tech.minValue) && isNumber(tech.minValue)) {
        minValue = Math.min(minValue, tech.minValue)
      }
      if (isValid(tech.maxValue) && isNumber(tech.maxValue)) {
        maxValue = Math.max(maxValue, tech.maxValue)
      }
      plotsResult.push({
        plots: tech.plots,
        result: tech.result
      })
    })

    let precision = 4
    if (this._isCandleYAxis) {
      const pricePrecision = this._chartData.pricePrecision()
      if (technicalIndicatorPrecision !== Number.MAX_SAFE_INTEGER) {
        precision = Math.min(technicalIndicatorPrecision, pricePrecision)
      } else {
        precision = pricePrecision
      }
    } else {
      if (technicalIndicatorPrecision !== Number.MAX_SAFE_INTEGER) {
        precision = technicalIndicatorPrecision
      }
    }
    const visibleDataList = this._chartData.visibleDataList()
    const candleOptions = this._chartData.styleOptions().candle
    const isArea = candleOptions.type === CandleType.AREA
    const areaValueKey = candleOptions.area.value
    const shouldCompareHighLow = (this._isCandleYAxis && !isArea) || (!this._isCandleYAxis && shouldOhlc)
    visibleDataList.forEach(({ index, data }) => {
      if (shouldCompareHighLow) {
        minMaxArray[0] = Math.min(minMaxArray[0], data.low)
        minMaxArray[1] = Math.max(minMaxArray[1], data.high)
      }
      if (this._isCandleYAxis && isArea) {
        minMaxArray[0] = Math.min(minMaxArray[0], data[areaValueKey])
        minMaxArray[1] = Math.max(minMaxArray[1], data[areaValueKey])
      }
      plotsResult.forEach(({ plots, result }) => {
        const technicalIndicatorData = result[index] || {}
        plots.forEach(plot => {
          const value = technicalIndicatorData[plot.key]
          if (isValid(value)) {
            minMaxArray[0] = Math.min(minMaxArray[0], value)
            minMaxArray[1] = Math.max(minMaxArray[1], value)
          }
        })
      })
    })
    if (minMaxArray[0] !== Number.MAX_SAFE_INTEGER && minMaxArray[1] !== Number.MIN_SAFE_INTEGER) {
      if (minValue !== Number.MAX_SAFE_INTEGER) {
        minMaxArray[0] = Math.min(minValue, minMaxArray[0])
      }
      if (maxValue !== Number.MIN_SAFE_INTEGER) {
        minMaxArray[1] = Math.max(maxValue, minMaxArray[1])
      }
    } else {
      minMaxArray[0] = 0
      minMaxArray[1] = 0
    }
    return { min: minMaxArray[0], max: minMaxArray[1], precision, specifyMin: minValue, specifyMax: maxValue }
  }

  _optimalMinMax ({ min, max, precision, specifyMin, specifyMax }) {
    let minValue = min
    let maxValue = max
    const yAxisType = this.yAxisType()
    let dif
    switch (yAxisType) {
      case YAxisType.PERCENTAGE: {
        const fromData = (this._chartData.visibleDataList()[0] || {}).data || {}
        if (isValid(fromData.close)) {
          minValue = (minValue - fromData.close) / fromData.close * 100
          maxValue = (maxValue - fromData.close) / fromData.close * 100
        }
        dif = Math.pow(10, -2)
        break
      }
      case YAxisType.LOG: {
        minValue = log10(minValue)
        maxValue = log10(maxValue)
        dif = 0.05 * index10(-precision)
        break
      }
      default: {
        dif = index10(-precision)
      }
    }
    if (
      minValue === maxValue ||
      Math.abs(minValue - maxValue) < dif
    ) {
      const minCheck = specifyMin === minValue
      const maxCheck = specifyMax === maxValue
      minValue = minCheck ? minValue : (maxCheck ? minValue - 8 * dif : minValue - 4 * dif)
      maxValue = maxCheck ? maxValue : (minCheck ? maxValue + 8 * dif : maxValue + 4 * dif)
    }
    let marginOptions
    if (this._isCandleYAxis) {
      marginOptions = this._chartData.styleOptions().candle.margin
    } else {
      marginOptions = this._chartData.styleOptions().technicalIndicator.margin
    }
    let topRate
    let bottomRate
    if (marginOptions.top > 1) {
      topRate = marginOptions.top / this._height
    } else {
      topRate = isNumber(marginOptions.top) ? marginOptions.top : 0.2
    }
    if (marginOptions.bottom > 1) {
      bottomRate = marginOptions.bottom / this._height
    } else {
      bottomRate = isNumber(marginOptions.bottom) ? marginOptions.bottom : 0.1
    }
    let range = Math.abs(maxValue - minValue)
    // 保证每次图形绘制上下都留间隙
    minValue = minValue - range * bottomRate
    maxValue = maxValue + range * topRate

    range = Math.abs(maxValue - minValue)
    if (yAxisType === YAxisType.LOG) {
      this._realRange = Math.abs(index10(maxValue) - index10(minValue))
    } else {
      this._realRange = range
    }
    return {
      min: minValue,
      max: maxValue,
      range
    }
  }

  _optimalTicks (ticks) {
    const optimalTicks = []
    const yAxisType = this.yAxisType()
    const technicalIndicators = this._additionalDataProvider.technicalIndicators()
    let precision = 0
    let shouldFormatBigNumber = false
    if (this._isCandleYAxis) {
      precision = this._chartData.pricePrecision()
    } else {
      technicalIndicators.forEach(technicalIndicator => {
        precision = Math.max(precision, technicalIndicator.precision)
        if (!shouldFormatBigNumber) {
          shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber
        }
      })
    }
    const textHeight = this._chartData.styleOptions().xAxis.tickText.size
    let intervalPrecision
    if (yAxisType === YAxisType.LOG) {
      intervalPrecision = this._computeInterval(this._realRange)
    }
    let validY
    ticks.forEach(({ v }) => {
      let value
      let y = this._innerConvertToPixel(+v)
      switch (yAxisType) {
        case YAxisType.PERCENTAGE: {
          value = `${formatPrecision(v, 2)}%`
          break
        }
        case YAxisType.LOG: {
          value = round(index10(v), intervalPrecision.precision)
          y = this._innerConvertToPixel(log10(value))
          value = formatPrecision(value, precision)
          break
        }
        default: {
          value = formatPrecision(v, precision)
          if (shouldFormatBigNumber) {
            value = formatBigNumber(value)
          }
          break
        }
      }
      if (y > textHeight && y < this._height - textHeight && ((validY && (validY - y > textHeight * 2)) || !validY)) {
        optimalTicks.push({ v: value, y })
        validY = y
      }
    })
    return optimalTicks
  }

  /**
   * 内部值转换成坐标
   * @param value
   * @return {number}
   * @private
   */
  _innerConvertToPixel (value) {
    return Math.round((1.0 - (value - this._minValue) / this._range) * this._height)
  }

  /**
   * 是否是蜡烛图轴
   * @return {*}
   */
  isCandleYAxis () {
    return this._isCandleYAxis
  }

  /**
   * y轴类型
   * @return {string|*}
   */
  yAxisType () {
    if (this._isCandleYAxis) {
      return this._chartData.styleOptions().yAxis.type
    }
    return YAxisType.NORMAL
  }

  /**
   * 获取自身宽度
   * @return {number}
   */
  getSelfWidth () {
    const styleOptions = this._chartData.styleOptions()
    const yAxisOptions = styleOptions.yAxis
    const width = yAxisOptions.width
    if (isValid(width) && isNumber(+width)) {
      return +width
    }
    let yAxisWidth = 0
    if (yAxisOptions.show) {
      if (yAxisOptions.axisLine.show) {
        yAxisWidth += yAxisOptions.axisLine.size
      }
      if (yAxisOptions.tickLine.show) {
        yAxisWidth += yAxisOptions.tickLine.length
      }
      if (yAxisOptions.tickText.show) {
        let textWidth = 0
        this._measureCtx.font = createFont(yAxisOptions.tickText.size, yAxisOptions.tickText.weight, yAxisOptions.tickText.family)
        this._ticks.forEach(tick => {
          textWidth = Math.max(textWidth, calcTextWidth(this._measureCtx, tick.v))
        })
        yAxisWidth += (yAxisOptions.tickText.paddingLeft + yAxisOptions.tickText.paddingRight + textWidth)
      }
    }
    const crosshairOptions = styleOptions.crosshair
    let crosshairVerticalTextWidth = 0
    if (
      crosshairOptions.show &&
      crosshairOptions.horizontal.show &&
      crosshairOptions.horizontal.text.show
    ) {
      const technicalIndicators = this._additionalDataProvider.technicalIndicators()
      let technicalIndicatorPrecision = 0
      let shouldFormatBigNumber = false
      technicalIndicators.forEach(technicalIndicator => {
        technicalIndicatorPrecision = Math.max(technicalIndicator.precision, technicalIndicatorPrecision)
        if (!shouldFormatBigNumber) {
          shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber
        }
      })
      this._measureCtx.font = createFont(
        crosshairOptions.horizontal.text.size,
        crosshairOptions.horizontal.text.weight,
        crosshairOptions.horizontal.text.family
      )
      let precision = 2
      if (this.yAxisType() !== YAxisType.PERCENTAGE) {
        if (this._isCandleYAxis) {
          const pricePrecision = this._chartData.pricePrecision()
          const lastValueMarkOptions = styleOptions.technicalIndicator.lastValueMark
          if (lastValueMarkOptions.show && lastValueMarkOptions.text.show) {
            precision = Math.max(technicalIndicatorPrecision, pricePrecision)
          } else {
            precision = pricePrecision
          }
        } else {
          precision = technicalIndicatorPrecision
        }
      }
      let valueText = formatPrecision(this._maxValue, precision)
      if (shouldFormatBigNumber) {
        valueText = formatBigNumber(valueText)
      }
      crosshairVerticalTextWidth += (
        crosshairOptions.horizontal.text.paddingLeft +
        crosshairOptions.horizontal.text.paddingRight +
        crosshairOptions.horizontal.text.borderSize * 2 +
        calcTextWidth(this._measureCtx, valueText)
      )
    }
    return Math.max(yAxisWidth, crosshairVerticalTextWidth)
  }

  convertFromPixel (pixel) {
    const value = (1.0 - pixel / this._height) * this._range + this._minValue
    switch (this.yAxisType()) {
      case YAxisType.PERCENTAGE: {
        const fromData = (this._chartData.visibleDataList()[0] || {}).data || {}
        if (isValid(fromData.close)) {
          return fromData.close * value / 100 + fromData.close
        }
        break
      }
      case YAxisType.LOG: {
        return index10(value)
      }
      default: {
        return value
      }
    }
  }

  convertToPixel (value) {
    let v
    switch (this.yAxisType()) {
      case YAxisType.PERCENTAGE: {
        const fromData = (this._chartData.visibleDataList()[0] || {}).data || {}
        if (isValid(fromData.close)) {
          v = (value - fromData.close) / fromData.close * 100
        }
        break
      }
      case YAxisType.LOG: {
        v = log10(value)
        break
      }
      default: {
        v = value
      }
    }
    return this._innerConvertToPixel(v)
  }
}

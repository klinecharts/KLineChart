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

export default class YAxis extends Axis {
  constructor (chartData, isCandleYAxis, additionalDataProvider) {
    super(chartData)
    this._isCandleYAxis = isCandleYAxis
    this._additionalDataProvider = additionalDataProvider
  }

  _computeMinMaxValue () {
    let min = this._minValue
    let max = this._maxValue
    let range = Math.abs(max - min)
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
    // 保证每次图形绘制上下都留间隙
    min = min - range * bottomRate
    max = max + range * topRate
    range = Math.abs(max - min)
    return { min, max, range }
  }

  _computeOptimalTicks (ticks) {
    const optimalTicks = []
    const tickLength = ticks.length
    if (tickLength > 0) {
      const textHeight = this._chartData.styleOptions().xAxis.tickText.size
      const y = this._innerConvertToPixel(+ticks[0].v)
      let tickCountDif = 1
      if (tickLength > 1) {
        const nextY = this._innerConvertToPixel(+ticks[1].v)
        const yDif = Math.abs(nextY - y)
        if (yDif < textHeight * 2) {
          tickCountDif = Math.ceil(textHeight * 2 / yDif)
        }
      }
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
      const isPercentageAxis = this.isPercentageYAxis()
      for (let i = 0; i < tickLength; i += tickCountDif) {
        let v = ticks[i].v
        v = +v === 0 ? '0' : v
        const y = this._innerConvertToPixel(+v)
        let value = ''
        if (isPercentageAxis) {
          value = `${formatPrecision(v, 2)}%`
        } else {
          value = formatPrecision(v, precision)
          if (shouldFormatBigNumber) {
            value = formatBigNumber(value)
          }
        }
        if (y > textHeight &&
          y < this._height - textHeight) {
          optimalTicks.push({ v: value, y })
        }
      }
    }
    return optimalTicks
  }

  /**
   * 计算最大最小值
   */
  calcMinMaxValue () {
    const technicalIndicators = this._additionalDataProvider.technicalIndicators()
    const dataList = this._chartData.dataList()
    const from = this._chartData.from()
    const to = this._chartData.to()
    const minMaxArray = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    const plotsResult = []
    let shouldOhlc = false
    let minValue = Number.MAX_SAFE_INTEGER
    let maxValue = Number.MIN_SAFE_INTEGER
    let technicalIndicatorPrecision = Number.MIN_SAFE_INTEGER
    technicalIndicators.forEach(technicalIndicator => {
      if (!shouldOhlc) {
        shouldOhlc = technicalIndicator.should
      }
      technicalIndicatorPrecision = Math.max(technicalIndicatorPrecision, technicalIndicator.precision)
      if (isValid(technicalIndicator.minValue) && isNumber(technicalIndicator.minValue)) {
        minValue = Math.min(minValue, technicalIndicator.minValue)
      }
      if (isValid(technicalIndicator.maxValue) && isNumber(technicalIndicator.maxValue)) {
        maxValue = Math.max(maxValue, technicalIndicator.maxValue)
      }
      plotsResult.push({
        plots: technicalIndicator.plots,
        result: technicalIndicator.result
      })
    })

    let precision = 4
    if (this._isCandleYAxis) {
      const pricePrecision = this._chartData.pricePrecision()
      if (technicalIndicatorPrecision !== Number.MIN_SAFE_INTEGER) {
        precision = Math.max(technicalIndicatorPrecision, pricePrecision)
      } else {
        precision = pricePrecision
      }
    } else {
      if (technicalIndicatorPrecision !== Number.MIN_SAFE_INTEGER) {
        precision = technicalIndicatorPrecision
      }
    }

    const candleOptions = this._chartData.styleOptions().candle
    const isArea = candleOptions.type === CandleType.AREA
    const areaValueKey = candleOptions.area.value
    const shouldCompareHighLow = (this._isCandleYAxis && !isArea) || (!this._isCandleYAxis && shouldOhlc)
    for (let i = from; i < to; i++) {
      const kLineData = dataList[i]
      if (shouldCompareHighLow) {
        minMaxArray[0] = Math.min(minMaxArray[0], kLineData.low)
        minMaxArray[1] = Math.max(minMaxArray[1], kLineData.high)
      }
      if (this._isCandleYAxis && isArea) {
        minMaxArray[0] = Math.min(minMaxArray[0], kLineData[areaValueKey])
        minMaxArray[1] = Math.max(minMaxArray[1], kLineData[areaValueKey])
      }
      plotsResult.forEach(({ plots, result }) => {
        const technicalIndicatorData = result[i] || {}
        plots.forEach(plot => {
          const value = technicalIndicatorData[plot.key]
          if (isValid(value)) {
            minMaxArray[0] = Math.min(minMaxArray[0], value)
            minMaxArray[1] = Math.max(minMaxArray[1], value)
          }
        })
      })
    }
    if (minMaxArray[0] !== Number.MAX_SAFE_INTEGER && minMaxArray[1] !== Number.MIN_SAFE_INTEGER) {
      if (minValue !== Number.MAX_SAFE_INTEGER) {
        minMaxArray[0] = Math.min(minValue, minMaxArray[0])
      }
      if (maxValue !== Number.MIN_SAFE_INTEGER) {
        minMaxArray[1] = Math.max(maxValue, minMaxArray[1])
      }
      if (this.isPercentageYAxis()) {
        const fromClose = dataList[from].close
        this._minValue = (minMaxArray[0] - fromClose) / fromClose * 100
        this._maxValue = (minMaxArray[1] - fromClose) / fromClose * 100
        if (
          this._minValue === this._maxValue ||
          Math.abs(this._minValue - this._maxValue) < Math.pow(10, -2)
        ) {
          this._minValue -= 10
          this._maxValue += 10
        }
      } else {
        this._minValue = minMaxArray[0]
        this._maxValue = minMaxArray[1]
        if (
          this._minValue === this._maxValue ||
          Math.abs(this._minValue - this._maxValue) < Math.pow(10, -precision)
        ) {
          const percentValue = this._minValue !== 0 ? Math.abs(this._minValue * 0.2) : 10
          this._minValue = this._minValue !== 0 ? this._minValue - percentValue : this._minValue
          this._maxValue += percentValue
        }
      }
    } else {
      this._minValue = 0
      this._maxValue = 0
    }
  }

  _innerConvertToPixel (value) {
    return Math.round((1.0 - (value - this._minValue) / this._range) * this._height)
  }

  isCandleYAxis () {
    return this._isCandleYAxis
  }

  /**
   * 是否是蜡烛图y轴组件
   * @returns {boolean}
   */
  isPercentageYAxis () {
    return this._isCandleYAxis && this._chartData.styleOptions().yAxis.type === YAxisType.PERCENTAGE
  }

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
      if (!this.isPercentageYAxis()) {
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
    const yAxisValue = (1.0 - pixel / this._height) * this._range + this._minValue
    if (this.isPercentageYAxis()) {
      const fromClose = this._chartData.dataList()[this._chartData.from()].close
      return fromClose * yAxisValue / 100 + fromClose
    }
    return yAxisValue
  }

  convertToPixel (value) {
    let realValue = value
    if (this.isPercentageYAxis()) {
      const fromClose = (this._chartData.dataList()[this._chartData.from()] || {}).close
      if (isValid(fromClose)) {
        realValue = (value - fromClose) / fromClose * 100
      }
    }
    return this._innerConvertToPixel(realValue)
  }
}

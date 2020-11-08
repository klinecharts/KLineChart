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
import { YAxisType } from '../data/options/styleOptions'
import { isNumber, isValid } from '../utils/typeChecks'
import { calcTextWidth, getFont } from '../utils/canvas'
import { formatBigNumber, formatPrecision } from '../utils/format'

export default class YAxis extends Axis {
  constructor (chartData, isCandleStickYAxis, additionalDataProvider) {
    super(chartData)
    this._isCandleStickYAxis = isCandleStickYAxis
    this._additionalDataProvider = additionalDataProvider
  }

  _computeMinMaxValue () {
    let min = this._minValue
    let max = this._maxValue
    let range = Math.abs(max - min)
    // 保证每次图形绘制上下都留间隙
    min = min - (range / 100.0) * 10.0
    max = max + (range / 100.0) * 20.0
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
      const technicalIndicator = this._additionalDataProvider.technicalIndicator()
      const isPercentageAxis = this.isPercentageYAxis()
      const precision = this._isCandleStickYAxis ? this._chartData.pricePrecision() : technicalIndicator.precision
      const shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber
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
    const technicalIndicator = this._additionalDataProvider.technicalIndicator()
    const isTimeLine = this._additionalDataProvider.isTimeLine()
    const dataList = this._chartData.dataList()
    const technicalIndicatorResult = technicalIndicator.result
    const from = this._chartData.from()
    const to = this._chartData.to()
    const isShowAverageLine = this._chartData.styleOptions().realTime.averageLine.display
    const minMaxArray = [Infinity, -Infinity]

    if (isTimeLine) {
      for (let i = from; i < to; i++) {
        const kLineData = dataList[i]
        const technicalIndicatorData = technicalIndicatorResult[i] || {}
        minMaxArray[0] = Math.min(kLineData.close, minMaxArray[0])
        minMaxArray[1] = Math.max(kLineData.close, minMaxArray[1])
        if (isShowAverageLine && isValid(technicalIndicatorData.average)) {
          minMaxArray[0] = Math.min(technicalIndicatorData.average, minMaxArray[0])
          minMaxArray[1] = Math.max(technicalIndicatorData.average, minMaxArray[1])
        }
      }
    } else {
      const plots = technicalIndicator.plots || []
      for (let i = from; i < to; i++) {
        const kLineData = dataList[i]
        const technicalIndicatorData = technicalIndicatorResult[i] || {}
        plots.forEach(plot => {
          const value = technicalIndicatorData[plot.key]
          if (isValid(value)) {
            minMaxArray[0] = Math.min(minMaxArray[0], value)
            minMaxArray[1] = Math.max(minMaxArray[1], value)
          }
        })
        if (this._isCandleStickYAxis || technicalIndicator.shouldOhlc) {
          minMaxArray[0] = Math.min(minMaxArray[0], kLineData.low)
          minMaxArray[1] = Math.max(minMaxArray[1], kLineData.high)
        }
      }
    }
    if (isValid(technicalIndicator.minValue) && isNumber(technicalIndicator.minValue)) {
      minMaxArray[0] = technicalIndicator.minValue
    }
    if (isValid(technicalIndicator.maxValue) && isNumber(technicalIndicator.maxValue)) {
      minMaxArray[1] = technicalIndicator.maxValue
    }
    if (minMaxArray[0] !== Infinity && minMaxArray[1] !== -Infinity) {
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
          Math.abs(this._minValue - this._maxValue) < Math.pow(10, -12)
        ) {
          const percentValue = this._minValue !== 0 ? Math.abs(this._minValue * 0.2) : 10
          this._minValue = this._minValue !== 0 ? this._minValue - percentValue : this._minValue
          this._maxValue += percentValue
        }
      }
    }
  }

  _innerConvertToPixel (value) {
    return Math.round((1.0 - (value - this._minValue) / this._range) * this._height)
  }

  isCandleStickYAxis () {
    return this._isCandleStickYAxis
  }

  /**
   * 是否是蜡烛图y轴组件
   * @returns {boolean}
   */
  isPercentageYAxis () {
    return this._isCandleStickYAxis && this._chartData.styleOptions().yAxis.type === YAxisType.PERCENTAGE
  }

  getSelfWidth () {
    const stylOptions = this._chartData.styleOptions()
    const yAxisOptions = stylOptions.yAxis
    const width = yAxisOptions.width
    if (isValid(width) && isNumber(+width)) {
      return +width
    }
    let yAxisWidth = 0
    if (yAxisOptions.display) {
      if (yAxisOptions.axisLine.display) {
        yAxisWidth += yAxisOptions.axisLine.size
      }
      if (yAxisOptions.tickLine.display) {
        yAxisWidth += yAxisOptions.tickLine.length
      }
      if (yAxisOptions.tickText.display) {
        let textWidth = 0
        this._measureCtx.font = getFont(yAxisOptions.tickText.size, yAxisOptions.tickText.weight, yAxisOptions.tickText.family)
        this._ticks.forEach(tick => {
          textWidth = Math.max(textWidth, calcTextWidth(this._measureCtx, tick.v))
        })
        yAxisWidth += (yAxisOptions.tickText.paddingLeft + yAxisOptions.tickText.paddingRight + textWidth)
      }
    }
    const crossHairOptions = stylOptions.floatLayer.crossHair
    let crossHairVerticalTextWidth = 0
    if (
      crossHairOptions.display &&
      crossHairOptions.horizontal.display &&
      crossHairOptions.horizontal.text.display
    ) {
      const technicalIndicator = this._additionalDataProvider.technicalIndicator()
      this._measureCtx.font = getFont(
        crossHairOptions.horizontal.text.size,
        crossHairOptions.horizontal.text.weight,
        crossHairOptions.horizontal.text.family
      )
      let precision = 2
      if (!this.isPercentageYAxis()) {
        if (this._isCandleStickYAxis) {
          const pricePrecision = this._chartData.pricePrecision()
          if (stylOptions.technicalIndicator.lastValueMark.display) {
            precision = Math.max(technicalIndicator.precision, pricePrecision)
          } else {
            precision = pricePrecision
          }
        } else {
          precision = technicalIndicator.precision
        }
      }
      let valueText = formatPrecision(this._maxValue, precision)
      if (technicalIndicator.shouldFormatBigNumber) {
        valueText = formatBigNumber(valueText)
      }
      crossHairVerticalTextWidth += (
        crossHairOptions.horizontal.text.paddingLeft +
        crossHairOptions.horizontal.text.paddingRight +
        crossHairOptions.horizontal.text.borderSize * 2 +
        calcTextWidth(this._measureCtx, valueText)
      )
    }
    return Math.max(yAxisWidth, crossHairVerticalTextWidth)
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

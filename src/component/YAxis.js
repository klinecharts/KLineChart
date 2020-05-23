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

export default class YAxis extends Axis {
  constructor (chartData, isCandleStickYAxis) {
    super(chartData)
    this._isCandleStickYAxis = isCandleStickYAxis
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
      const isPercentageAxis = this.isPercentageYAxis()
      for (let i = 0; i < tickLength; i += tickCountDif) {
        let v = ticks[i].v
        v = +v === 0 ? '0' : v
        const y = this._innerConvertToPixel(+v)
        if (y > textHeight &&
          y < this._height - textHeight) {
          optimalTicks.push({
            v: isPercentageAxis
              ? `${(+v).toFixed(2)}%`
              : v,
            y
          })
        }
      }
    }
    return optimalTicks
  }

  /**
   * 计算最大最小值
   * @param technicalIndicator
   * @param isRealTime
   */
  calcMinMaxValue (technicalIndicator, isRealTime) {
    const dataList = this._chartData.dataList()
    const technicalIndicatorResult = technicalIndicator.result
    const from = this._chartData.from()
    const to = this._chartData.to()
    const isShowAverageLine = this._chartData.styleOptions().realTime.averageLine.display
    const minMaxArray = [Infinity, -Infinity]

    if (isRealTime) {
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
        if (this._isCandleStickYAxis) {
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
          Math.abs(this._minValue - this._maxValue) < Math.pow(10, -6)
        ) {
          const percentValue = this._minValue * 0.2
          this._minValue -= percentValue
          this._maxValue += percentValue
        }
      }
    } else {
      this._minValue = 0
      this._maxValue = 10
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

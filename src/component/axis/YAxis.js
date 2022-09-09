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
import { CandleType, YAxisPosition, YAxisType } from '../../options/styleOptions'
import { isNumber, isValid } from '../../utils/typeChecks'
import { calcTextWidth, createFont } from '../../utils/canvas'
import { formatBigNumber, formatPrecision } from '../../utils/format'
import { log10, index10 } from '../../utils/number'

export default class YAxis extends Axis {
  constructor (chartStore, isCandleYAxis, paneId) {
    super(chartStore)
    this._isCandleYAxis = isCandleYAxis
    this._paneId = paneId
  }

  _computeMinMax () {
    const minMaxArray = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    const plotsResult = []
    let shouldOhlc = false
    let minValue = Number.MAX_SAFE_INTEGER
    let maxValue = Number.MIN_SAFE_INTEGER
    let techPrecision = Number.MAX_SAFE_INTEGER
    const techs = this._chartStore.technicalIndicatorStore().instances(this._paneId)
    let techGap
    techs.forEach(tech => {
      if (!shouldOhlc) {
        shouldOhlc = tech.shouldOhlc
      }
      techPrecision = Math.min(techPrecision, tech.precision)
      if (isNumber(tech.minValue)) {
        minValue = Math.min(minValue, tech.minValue)
      }
      if (isNumber(tech.maxValue)) {
        maxValue = Math.max(maxValue, tech.maxValue)
      }
      if (tech.styles) {
        if (!techGap) {
          techGap = { top: 0, bottom: 0 }
        }
        const margin = tech.styles.margin
        if (isNumber(margin.top)) {
          if (margin.top < 1) {
            techGap.top = Math.max(margin.top, techGap.top)
          } else {
            techGap.top = Math.max(margin.top / this._height, techGap.top)
          }
        }
        if (isNumber(margin.bottom)) {
          if (margin.bottom < 1) {
            techGap.bottom = Math.max(margin.bottom, techGap.bottom)
          } else {
            techGap.bottom = Math.max(margin.bottom / this._height, techGap.bottom)
          }
        }
      }
      plotsResult.push({
        plots: tech.plots,
        result: tech.result
      })
    })

    let precision = 4
    if (this._isCandleYAxis) {
      const pricePrecision = this._chartStore.pricePrecision()
      if (techPrecision !== Number.MAX_SAFE_INTEGER) {
        precision = Math.min(techPrecision, pricePrecision)
      } else {
        precision = pricePrecision
      }
    } else {
      if (techPrecision !== Number.MAX_SAFE_INTEGER) {
        precision = techPrecision
      }
    }
    const visibleDataList = this._chartStore.visibleDataList()
    const candleOptions = this._chartStore.styleOptions().candle
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
        const techData = result[index] || {}
        plots.forEach(plot => {
          const value = techData[plot.key]
          if (isValid(value)) {
            minMaxArray[0] = Math.min(minMaxArray[0], value)
            minMaxArray[1] = Math.max(minMaxArray[1], value)
          }
        })
      })
    })
    if (minMaxArray[0] !== Number.MAX_SAFE_INTEGER && minMaxArray[1] !== Number.MIN_SAFE_INTEGER) {
      minMaxArray[0] = Math.min(minValue, minMaxArray[0])
      minMaxArray[1] = Math.max(maxValue, minMaxArray[1])
    } else {
      minMaxArray[0] = 0
      minMaxArray[1] = 10
    }
    return { min: minMaxArray[0], max: minMaxArray[1], precision, specifyMin: minValue, specifyMax: maxValue, techGap }
  }

  _optimalMinMax ({ min, max, precision, specifyMin, specifyMax, techGap }) {
    let minValue = min
    let maxValue = max
    const yAxisType = this.yAxisType()
    let dif
    switch (yAxisType) {
      case YAxisType.PERCENTAGE: {
        const fromData = (this._chartStore.visibleDataList()[0] || {}).data || {}
        if (isNumber(fromData.close)) {
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
      marginOptions = this._chartStore.styleOptions().candle.margin
    } else {
      // 如果是副图，直接取指标的样式配置
      marginOptions = techGap ? { top: 0, bottom: 0 } : this._chartStore.styleOptions().technicalIndicator.margin
    }
    let topRate = 0.2
    if (isNumber(marginOptions.top)) {
      let rate
      if (marginOptions.top < 1) {
        rate = marginOptions.top
      } else {
        rate = marginOptions.top / this._height
      }
      topRate = techGap ? Math.max(techGap.top, rate) : rate
    }
    let bottomRate = 0.1
    if (isNumber(marginOptions.bottom)) {
      let rate
      if (marginOptions.bottom < 1) {
        rate = marginOptions.bottom
      } else {
        rate = marginOptions.bottom / this._height
      }
      bottomRate = techGap ? Math.max(techGap.bottom, rate) : rate
    }
    let range = Math.abs(maxValue - minValue)
    // 保证每次图形绘制上下都留间隙
    minValue = minValue - range * bottomRate
    maxValue = maxValue + range * topRate
    range = Math.abs(maxValue - minValue)
    let realMinValue
    let realMaxValue
    let realRange
    if (yAxisType === YAxisType.LOG) {
      realMinValue = index10(minValue)
      realMaxValue = index10(maxValue)
      realRange = Math.abs(realMaxValue - realMinValue)
    } else {
      realMinValue = minValue
      realMaxValue = maxValue
      realRange = range
    }
    return {
      min: minValue,
      max: maxValue,
      range,
      realMin: realMinValue,
      realMax: realMaxValue,
      realRange
    }
  }

  _optimalTicks (ticks) {
    const optimalTicks = []
    const yAxisType = this.yAxisType()
    const techs = this._chartStore.technicalIndicatorStore().instances(this._paneId)
    let precision = 0
    let shouldFormatBigNumber = false
    if (this._isCandleYAxis) {
      precision = this._chartStore.pricePrecision()
    } else {
      techs.forEach(tech => {
        precision = Math.max(precision, tech.precision)
        if (!shouldFormatBigNumber) {
          shouldFormatBigNumber = tech.shouldFormatBigNumber
        }
      })
    }
    const textHeight = this._chartStore.styleOptions().xAxis.tickText.size
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
          y = this._innerConvertToPixel(log10(v))
          value = formatPrecision(v, precision)
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
      if (y > textHeight && y < this._height - textHeight && ((validY && (Math.abs(validY - y) > textHeight * 2)) || !validY)) {
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
    const rate = (value - this._minValue) / this._range
    return this.isReverse() ? Math.round(rate * this._height) : Math.round((1.0 - rate) * this._height)
  }

  /**
   * 是否是蜡烛图轴
   * @return {boolean}
   */
  isCandleYAxis () {
    return this._isCandleYAxis
  }

  /**
   * y轴类型
   * @return {string}
   */
  yAxisType () {
    return this._isCandleYAxis ? this._chartStore.styleOptions().yAxis.type : YAxisType.NORMAL
  }

  /**
   * 是否反转
   * @return {boolean}
   */
  isReverse () {
    return this._isCandleYAxis && this._chartStore.styleOptions().yAxis.reverse
  }

  /**
   * 是否从y轴0开始
   * @return {boolean}
   */
  isFromYAxisZero () {
    const yAxisOptions = this._chartStore.styleOptions().yAxis
    return (
      (yAxisOptions.position === YAxisPosition.LEFT && yAxisOptions.inside) ||
      (yAxisOptions.position === YAxisPosition.RIGHT && !yAxisOptions.inside)
    )
  }

  /**
   * 获取自身宽度
   * @return {number}
   */
  getSelfWidth () {
    const styleOptions = this._chartStore.styleOptions()
    const yAxisOptions = styleOptions.yAxis
    const width = yAxisOptions.width
    if (isNumber(width)) {
      return width
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
      const techs = this._chartStore.technicalIndicatorStore().instances(this._paneId)
      let techPrecision = 0
      let shouldFormatBigNumber = false
      techs.forEach(tech => {
        techPrecision = Math.max(tech.precision, techPrecision)
        if (!shouldFormatBigNumber) {
          shouldFormatBigNumber = tech.shouldFormatBigNumber
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
          const pricePrecision = this._chartStore.pricePrecision()
          const lastValueMarkOptions = styleOptions.technicalIndicator.lastValueMark
          if (lastValueMarkOptions.show && lastValueMarkOptions.text.show) {
            precision = Math.max(techPrecision, pricePrecision)
          } else {
            precision = pricePrecision
          }
        } else {
          precision = techPrecision
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
    const rate = this.isReverse() ? pixel / this._height : 1 - pixel / this._height
    const value = rate * this._range + this._minValue
    switch (this.yAxisType()) {
      case YAxisType.PERCENTAGE: {
        const fromData = (this._chartStore.visibleDataList()[0] || {}).data || {}
        if (isNumber(fromData.close)) {
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
        const fromData = (this._chartStore.visibleDataList()[0] || {}).data || {}
        if (isNumber(fromData.close)) {
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

  /**
   * 将值转换成坐标，即使坐标不在范围内，也会显示在顶部或者底部
   * @param value
   * @return {number}
   */
  convertToNicePixel (value) {
    const y = this.convertToPixel(value)
    return Math.round(Math.max(this._height * 0.05, Math.min(y, this._height * 0.98)))
  }
}

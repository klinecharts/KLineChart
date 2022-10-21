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

import AxisImp, { Extremum, Tick } from './Axis'

import { IndicatorPlot } from '../template/indicator/Indicator'

import { isValid } from '../utils/typeChecks'
import { index10, log10 } from '../utils/number'

interface PlotsResult {
  plots: Array<IndicatorPlot<any>>
  result: any[]
}

export default class YAxis extends AxisImp {
  protected calcExtremum (): Extremum {
    const parent = this.getParent()
    const chartStore = parent.getChart().getChartStore()
    let min = Number.MAX_SAFE_INTEGER
    let max = Number.MIN_SAFE_INTEGER
    const plotsResultList: PlotsResult[] = []
    let shouldOhlc = false
    let specifyMin = Number.MAX_SAFE_INTEGER
    let specifyMax = Number.MIN_SAFE_INTEGER
    let indicatorPrecision = Number.MAX_SAFE_INTEGER
    const indicators = chartStore.getIndicatorStore().getInstances(parent.getId())
    indicators.forEach(indicator => {
      if (!shouldOhlc) {
        shouldOhlc = indicator.shouldOhlc ?? false
      }
      indicatorPrecision = Math.min(indicatorPrecision, indicator.precision as number)
      if (indicator.minValue !== undefined) {
        specifyMin = Math.min(specifyMin, indicator.minValue)
      }
      if (indicator.maxValue !== undefined) {
        specifyMax = Math.max(specifyMax, indicator.maxValue)
      }
      plotsResultList.push({
        plots: indicator.plots ?? [],
        result: indicator.result ?? []
      })
    })

    let precision = 4
    const inCandle = this.isInCandle()
    if (inCandle) {
      const { price: pricePrecision } = chartStore.getPrecision()
      if (indicatorPrecision !== Number.MAX_SAFE_INTEGER) {
        precision = Math.min(indicatorPrecision, pricePrecision)
      } else {
        precision = pricePrecision
      }
    } else {
      if (indicatorPrecision !== Number.MAX_SAFE_INTEGER) {
        precision = indicatorPrecision
      }
    }
    const visibleDataList = chartStore.getVisibleDataList()
    const candleOptions = chartStore.getStyleOptions().candle
    const isArea = candleOptions.type === 'area'
    const areaValueKey = candleOptions.area.value
    const shouldCompareHighLow = (inCandle && !isArea) || (!inCandle && shouldOhlc)
    visibleDataList.forEach(({ index, data }) => {
      if (shouldCompareHighLow) {
        min = Math.min(min, data.low)
        max = Math.max(max, data.high)
      }
      if (inCandle && isArea) {
        min = Math.min(min, data[areaValueKey])
        max = Math.max(max, data[areaValueKey])
      }
      plotsResultList.forEach(({ plots, result }) => {
        const indicatorData = result[index] ?? {}
        plots.forEach(plot => {
          const value = indicatorData[plot.key]
          if (isValid(value)) {
            min = Math.min(min, value)
            max = Math.max(max, value)
          }
        })
      })
    })
    if (min !== Number.MAX_SAFE_INTEGER && max !== Number.MIN_SAFE_INTEGER) {
      min = Math.min(specifyMin, min)
      max = Math.max(specifyMax, max)
    } else {
      min = 0
      max = 10
    }

    const type = this.getType()
    let dif: number
    switch (type) {
      case 'percentage': {
        const fromData = visibleDataList[0]?.data
        if (isValid(fromData?.close)) {
          min = (min - fromData.close) / fromData.close * 100
          max = (max - fromData.close) / fromData.close * 100
        }
        dif = Math.pow(10, -2)
        break
      }
      case 'log': {
        min = log10(min)
        max = log10(max)
        dif = 0.05 * index10(-precision)
        break
      }
      default: {
        dif = index10(-precision)
      }
    }
    if (
      min === max ||
      Math.abs(min - max) < dif
    ) {
      const minCheck = specifyMin === min
      const maxCheck = specifyMax === max
      min = minCheck ? min : (maxCheck ? min - 8 * dif : min - 4 * dif)
      max = maxCheck ? max : (minCheck ? max + 8 * dif : max + 4 * dif)
    }

    const { gap: paneGap } = parent.getOptions()
    let topRate = paneGap?.top ?? 0.2
    if (topRate >= 1) {
      topRate = topRate / this._height
    }
    let bottomRate = paneGap?.top ?? 0.1
    if (bottomRate >= 1) {
      bottomRate = bottomRate / this._height
    }
    let range = Math.abs(max - min)
    // 保证每次图形绘制上下都留间隙
    min = min - range * bottomRate
    max = max + range * topRate
    range = Math.abs(max - min)
    let realMin: number
    let realMax: number
    let realRange: number
    if (type === 'log') {
      realMin = index10(min)
      realMax = index10(max)
      realRange = Math.abs(realMax - realMin)
    } else {
      realMin = min
      realMax = max
      realRange = range
    }
    return {
      min, max, range, realMin, realMax, realRange
    }
  }

  /**
   * 内部值转换成坐标
   * @param value
   * @return {number}
   * @private
   */
  _innerConvertToPixel (value: number): number {
    const { min, range } = this.getExtremum()
    const rate = (value - min) / range
    return this.isReverse() ? Math.round(rate * this._height) : Math.round((1.0 - rate) * this._height)
  }

  /**
   * 是否是蜡烛图轴
   * @return {boolean}
   */
  isInCandle (): boolean {
    return this.getParent().getName() === 'candle'
  }

  /**
   * y轴类型
   * @return {string}
   */
  getType (): string {
    if (this.isInCandle()) {
      const chartStore = this.getParent().getChart().getChartStore()
      return chartStore.getStyleOptions().yAxis.type
    }
    return 'normal'
  }

  /**
   * 是否反转
   * @return {boolean}
   */
  isReverse (): boolean {
    if (this.isInCandle()) {
      const chartStore = this.getParent().getChart().getChartStore()
      return chartStore.getStyleOptions().yAxis.reverse
    }
    return false
  }

  /**
   * 是否从y轴0开始
   * @return {boolean}
   */
  isFromZero (): boolean {
    const chartStore = this.getParent().getChart().getChartStore()
    const yAxisStyles = chartStore.getStyleOptions().yAxis
    const inside = yAxisStyles.inside as boolean
    return (
      (yAxisStyles.position === 'left' && inside) ||
      (yAxisStyles.position === 'right' && !inside)
    )
  }

  protected optimalTicks (ticks: Tick[]): Tick[] {
    throw new Error('Method not implemented.')
  }

  convertFromPixel (pixel: number): number {
    const { min, range } = this.getExtremum()
    const rate = this.isReverse() ? pixel / this._height : 1 - pixel / this._height
    const value = rate * range + min
    switch (this.getType()) {
      case 'percentage': {
        const chartStore = this.getParent().getChart().getChartStore()
        const visibleDataList = chartStore.getVisibleDataList()
        const fromData = visibleDataList[0]?.data
        if (isValid(fromData?.close)) {
          return fromData.close * value / 100 + fromData.close
        }
        return 0
      }
      case 'log': {
        return index10(value)
      }
      default: {
        return value
      }
    }
  }

  convertToPixel (value: number): number {
    let v = 0
    switch (this.getType()) {
      case 'percentage': {
        const chartStore = this.getParent().getChart().getChartStore()
        const visibleDataList = chartStore.getVisibleDataList()
        const fromData = visibleDataList[0]?.data
        if (isValid(fromData?.close)) {
          v = (value - fromData.close) / fromData.close * 100
        }
        break
      }
      case 'log': {
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
  convertToNicePixel (value: number): number {
    const pixel = this.convertToPixel(value)
    return Math.round(Math.max(this._height * 0.05, Math.min(pixel, this._height * 0.98)))
  }
}

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

import { YAxisType, YAxisPosition, CandleType } from '../common/Styles'
import type Bounding from '../common/Bounding'
import { isNumber, isValid } from '../common/utils/typeChecks'
import { index10, log10 } from '../common/utils/number'
import { calcTextWidth } from '../common/utils/canvas'
import { formatPrecision, formatThousands, formatFoldDecimal } from '../common/utils/format'

import AxisImp, { type AxisTemplate, type Axis, type AxisRange, type AxisTick, type AxisCreateTicksParams } from './Axis'

import { type IndicatorFigure } from './Indicator'

import type DrawPane from '../pane/DrawPane'

import { PaneIdConstants } from '../pane/types'

interface FiguresResult {
  figures: IndicatorFigure[]
  result: any[]
}

export interface YAxis extends Axis {
  isFromZero: () => boolean
  isInCandle: () => boolean
}

export type YAxisConstructor = new (parent: DrawPane<AxisImp>) => YAxisImp

export default abstract class YAxisImp extends AxisImp implements YAxis {
  protected calcRange (): AxisRange {
    const parent = this.getParent()
    const chart = parent.getChart()
    const chartStore = chart.getChartStore()
    let min = Number.MAX_SAFE_INTEGER
    let max = Number.MIN_SAFE_INTEGER
    const figuresResultList: FiguresResult[] = []
    let shouldOhlc = false
    let specifyMin = Number.MAX_SAFE_INTEGER
    let specifyMax = Number.MIN_SAFE_INTEGER
    let indicatorPrecision = Number.MAX_SAFE_INTEGER
    const indicators = chartStore.getIndicatorStore().getInstances(parent.getId())
    indicators.forEach(indicator => {
      if (!shouldOhlc) {
        shouldOhlc = indicator.shouldOhlc ?? false
      }
      indicatorPrecision = Math.min(indicatorPrecision, indicator.precision)
      if (isNumber(indicator.minValue)) {
        specifyMin = Math.min(specifyMin, indicator.minValue)
      }
      if (isNumber(indicator.maxValue)) {
        specifyMax = Math.max(specifyMax, indicator.maxValue)
      }
      figuresResultList.push({
        figures: indicator.figures ?? [],
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
    const candleStyles = chart.getStyles().candle
    const isArea = candleStyles.type === CandleType.Area
    const areaValueKey = candleStyles.area.value
    const shouldCompareHighLow = (inCandle && !isArea) || (!inCandle && shouldOhlc)
    visibleDataList.forEach(({ dataIndex, data }) => {
      if (isValid(data)) {
        if (shouldCompareHighLow) {
          min = Math.min(min, data.low)
          max = Math.max(max, data.high)
        }
        if (inCandle && isArea) {
          const value = data[areaValueKey]
          if (isNumber(value)) {
            min = Math.min(min, value)
            max = Math.max(max, value)
          }
        }
      }
      figuresResultList.forEach(({ figures, result }) => {
        const indicatorData = result[dataIndex] ?? {}
        figures.forEach(figure => {
          const value = indicatorData[figure.key]
          if (isNumber(value)) {
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
      case YAxisType.Percentage: {
        const fromData = chartStore.getVisibleFirstData()
        if (isValid(fromData) && isNumber(fromData.close)) {
          min = (min - fromData.close) / fromData.close * 100
          max = (max - fromData.close) / fromData.close * 100
        }
        dif = Math.pow(10, -2)
        break
      }
      case YAxisType.Log: {
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

    const height = this.getParent().getYAxisWidget()?.getBounding().height ?? 0
    const { gap: paneGap } = parent.getOptions()
    let topRate = paneGap?.top ?? 0.2
    if (topRate >= 1) {
      topRate = topRate / height
    }
    let bottomRate = paneGap?.bottom ?? 0.1
    if (bottomRate >= 1) {
      bottomRate = bottomRate / height
    }
    let range = Math.abs(max - min)
    // gap
    min = min - range * bottomRate
    max = max + range * topRate
    range = Math.abs(max - min)
    let realMin: number
    let realMax: number
    let realRange: number
    if (type === YAxisType.Log) {
      realMin = index10(min)
      realMax = index10(max)
      realRange = Math.abs(realMax - realMin)
    } else {
      realMin = min
      realMax = max
      realRange = range
    }

    return {
      from: min, to: max, range, realFrom: realMin, realTo: realMax, realRange
    }
  }

  /**
   * 内部值转换成坐标
   * @param value
   * @return {number}
   * @private
   */
  _innerConvertToPixel (value: number): number {
    const height = this.getParent().getYAxisWidget()?.getBounding().height ?? 0
    const { from, range } = this.getRange()
    const rate = (value - from) / range
    return this.isReverse() ? Math.round(rate * height) : Math.round((1 - rate) * height)
  }

  /**
   * 是否是蜡烛图轴
   * @return {boolean}
   */
  isInCandle (): boolean {
    return this.getParent().getId() === PaneIdConstants.CANDLE
  }

  /**
   * y轴类型
   * @return {YAxisType}
   */
  getType (): YAxisType {
    if (this.isInCandle()) {
      return this.getParent().getChart().getStyles().yAxis.type
    }
    return YAxisType.Normal
  }

  getPosition (): string {
    return this.getParent().getChart().getStyles().yAxis.position
  }

  /**
   * 是否反转
   * @return {boolean}
   */
  isReverse (): boolean {
    if (this.isInCandle()) {
      return this.getParent().getChart().getStyles().yAxis.reverse
    }
    return false
  }

  /**
   * 是否从y轴0开始
   * @return {boolean}
   */
  isFromZero (): boolean {
    const yAxisStyles = this.getParent().getChart().getStyles().yAxis
    const inside = yAxisStyles.inside
    return (
      (yAxisStyles.position === YAxisPosition.Left && inside) ||
      (yAxisStyles.position === YAxisPosition.Right && !inside)
    )
  }

  protected optimalTicks (ticks: AxisTick[]): AxisTick[] {
    const pane = this.getParent()
    const height = pane.getYAxisWidget()?.getBounding().height ?? 0
    const chartStore = pane.getChart().getChartStore()
    const customApi = chartStore.getCustomApi()
    const optimalTicks: AxisTick[] = []
    const type = this.getType()
    const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
    const thousandsSeparator = chartStore.getThousandsSeparator()
    const decimalFoldThreshold = chartStore.getDecimalFoldThreshold()
    let precision = 0
    let shouldFormatBigNumber = false
    if (this.isInCandle()) {
      precision = chartStore.getPrecision().price
    } else {
      indicators.forEach(tech => {
        precision = Math.max(precision, tech.precision)
        if (!shouldFormatBigNumber) {
          shouldFormatBigNumber = tech.shouldFormatBigNumber
        }
      })
    }
    const textHeight = chartStore.getStyles().xAxis.tickText.size
    let validY: number
    ticks.forEach(({ value }) => {
      let v: string
      let y = this._innerConvertToPixel(+value)
      switch (type) {
        case YAxisType.Percentage: {
          v = `${formatPrecision(value, 2)}%`
          break
        }
        case YAxisType.Log: {
          y = this._innerConvertToPixel(log10(+value))
          v = formatPrecision(value, precision)
          break
        }
        default: {
          v = formatPrecision(value, precision)
          if (shouldFormatBigNumber) {
            v = customApi.formatBigNumber(value)
          }
          break
        }
      }
      v = formatFoldDecimal(formatThousands(v, thousandsSeparator), decimalFoldThreshold)
      const validYNumber = isNumber(validY)
      if (
        y > textHeight &&
        y < height - textHeight &&
        ((validYNumber && (Math.abs(validY - y) > textHeight * 2)) || !validYNumber)) {
        optimalTicks.push({ text: v, coord: y, value })
        validY = y
      }
    })
    return optimalTicks
  }

  override getAutoSize (): number {
    const pane = this.getParent()
    const chart = pane.getChart()
    const styles = chart.getStyles()
    const yAxisStyles = styles.yAxis
    const width = yAxisStyles.size
    if (width !== 'auto') {
      return width
    }
    const chartStore = chart.getChartStore()
    const customApi = chartStore.getCustomApi()
    let yAxisWidth = 0
    if (yAxisStyles.show) {
      if (yAxisStyles.axisLine.show) {
        yAxisWidth += yAxisStyles.axisLine.size
      }
      if (yAxisStyles.tickLine.show) {
        yAxisWidth += yAxisStyles.tickLine.length
      }
      if (yAxisStyles.tickText.show) {
        let textWidth = 0
        this.getTicks().forEach(tick => {
          textWidth = Math.max(textWidth, calcTextWidth(tick.text, yAxisStyles.tickText.size, yAxisStyles.tickText.weight, yAxisStyles.tickText.family))
        })
        yAxisWidth += (yAxisStyles.tickText.marginStart + yAxisStyles.tickText.marginEnd + textWidth)
      }
    }
    const crosshairStyles = styles.crosshair
    let crosshairVerticalTextWidth = 0
    if (
      crosshairStyles.show &&
      crosshairStyles.horizontal.show &&
      crosshairStyles.horizontal.text.show
    ) {
      const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
      let techPrecision = 0
      let shouldFormatBigNumber = false
      indicators.forEach(tech => {
        techPrecision = Math.max(tech.precision, techPrecision)
        if (!shouldFormatBigNumber) {
          shouldFormatBigNumber = tech.shouldFormatBigNumber
        }
      })
      let precision = 2
      if (this.getType() !== YAxisType.Percentage) {
        if (this.isInCandle()) {
          const { price: pricePrecision } = chartStore.getPrecision()
          const lastValueMarkStyles = styles.indicator.lastValueMark
          if (lastValueMarkStyles.show && lastValueMarkStyles.text.show) {
            precision = Math.max(techPrecision, pricePrecision)
          } else {
            precision = pricePrecision
          }
        } else {
          precision = techPrecision
        }
      }
      let valueText = formatPrecision(this.getRange().to, precision)
      if (shouldFormatBigNumber) {
        valueText = customApi.formatBigNumber(valueText)
      }
      valueText = formatFoldDecimal(valueText, chartStore.getDecimalFoldThreshold())
      crosshairVerticalTextWidth += (
        crosshairStyles.horizontal.text.paddingLeft +
        crosshairStyles.horizontal.text.paddingRight +
        crosshairStyles.horizontal.text.borderSize * 2 +
        calcTextWidth(
          valueText,
          crosshairStyles.horizontal.text.size,
          crosshairStyles.horizontal.text.weight,
          crosshairStyles.horizontal.text.family
        )
      )
    }
    return Math.max(yAxisWidth, crosshairVerticalTextWidth)
  }

  getSelfBounding (): Bounding {
    return this.getParent().getYAxisWidget()!.getBounding()
  }

  convertFromPixel (pixel: number): number {
    const height = this.getParent().getYAxisWidget()?.getBounding().height ?? 0
    const { from, range } = this.getRange()
    const rate = this.isReverse() ? pixel / height : 1 - pixel / height
    const value = rate * range + from
    switch (this.getType()) {
      case YAxisType.Percentage: {
        const fromData = this.getParent().getChart().getChartStore().getVisibleFirstData()
        if (isValid(fromData) && isNumber(fromData.close)) {
          return fromData.close * value / 100 + fromData.close
        }
        return 0
      }
      case YAxisType.Log: {
        return index10(value)
      }
      default: {
        return value
      }
    }
  }

  convertToRealValue (value: number): number {
    let v = value
    if (this.getType() === YAxisType.Log) {
      v = index10(value)
    }
    return v
  }

  convertToPixel (value: number): number {
    let v = value
    switch (this.getType()) {
      case YAxisType.Percentage: {
        const fromData = this.getParent().getChart().getChartStore().getVisibleFirstData()
        if (isValid(fromData) && isNumber(fromData.close)) {
          v = (value - fromData.close) / fromData.close * 100
        }
        break
      }
      case YAxisType.Log: {
        v = log10(value)
        break
      }
      default: {
        v = value
      }
    }
    return this._innerConvertToPixel(v)
  }

  convertToNicePixel (value: number): number {
    const height = this.getParent().getYAxisWidget()?.getBounding().height ?? 0
    const pixel = this.convertToPixel(value)
    return Math.round(Math.max(height * 0.05, Math.min(pixel, height * 0.98)))
  }

  static extend (template: AxisTemplate): YAxisConstructor {
    class Custom extends YAxisImp {
      createTicks (params: AxisCreateTicksParams): AxisTick[] {
        return template.createTicks(params)
      }
    }
    return Custom
  }
}

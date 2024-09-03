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

import { CandleType } from '../common/Styles'
import type Bounding from '../common/Bounding'
import { isNumber, isString, isValid, merge } from '../common/utils/typeChecks'
import { index10, getPrecision, nice, round } from '../common/utils/number'
import { calcTextWidth } from '../common/utils/canvas'
import { formatPrecision, formatThousands, formatFoldDecimal } from '../common/utils/format'

import AxisImp, {
  type AxisTemplate, type Axis, type AxisRange,
  type AxisTick, type AxisValueToValueCallback,
  type AxisMinSpanCallback, type AxisCreateRangeCallback,
  AxisPosition
} from './Axis'

import type DrawPane from '../pane/DrawPane'

import { PaneIdConstants } from '../pane/types'

export type YAxisTemplate = AxisTemplate

const TICK_COUNT = 8

export interface YAxis extends Axis, Required<YAxisTemplate> {
  isFromZero: () => boolean
  isInCandle: () => boolean
  convertToNicePixel: (value: number) => number
}

export type YAxisConstructor = new (parent: DrawPane<Axis>) => YAxis

export default abstract class YAxisImp extends AxisImp implements YAxis {
  reverse = false
  inside = false
  position = AxisPosition.Right
  gap = {
    top: 0.2,
    bottom: 0.1
  }

  createRange: AxisCreateRangeCallback = params => params.defaultRange
  minSpan: AxisMinSpanCallback = precision => index10(-precision)
  valueToRealValue: AxisValueToValueCallback = value => value
  realValueToDisplayValue: AxisValueToValueCallback = value => value
  displayValueToRealValue: AxisValueToValueCallback = value => value
  realValueToValue: AxisValueToValueCallback = value => value
  displayValueToText: ((value: number, precision: number) => string) = (value, precision) => formatPrecision(value, precision)

  constructor (parent: DrawPane<Axis>, yAxis: YAxisTemplate) {
    super(parent)
    this.override(yAxis)
  }

  override (yAxis: YAxisTemplate): void {
    const {
      name,
      gap,
      ...others
    } = yAxis
    if (!isString(this.name)) {
      this.name = name
    }
    merge(this.gap, gap)
    merge(this, others)
  }

  protected override createRangeImp (): AxisRange {
    const parent = this.getParent()
    const chart = parent.getChart()
    const chartStore = chart.getChartStore()
    const paneId = parent.getId()
    let min = Number.MAX_SAFE_INTEGER
    let max = Number.MIN_SAFE_INTEGER
    let shouldOhlc = false
    let specifyMin = Number.MAX_SAFE_INTEGER
    let specifyMax = Number.MIN_SAFE_INTEGER
    let indicatorPrecision = Number.MAX_SAFE_INTEGER
    const indicators = chartStore.getIndicatorStore().getInstanceByPaneId(paneId)
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
      indicators.forEach(({ result, figures }) => {
        const data = result[dataIndex] ?? {}
        figures.forEach(figure => {
          const value = data[figure.key]
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
    const defaultDiff = max - min
    const defaultRange = {
      from: min,
      to: max,
      range: defaultDiff,
      realFrom: min,
      realTo: max,
      realRange: defaultDiff,
      displayFrom: min,
      displayTo: max,
      displayRange: defaultDiff
    }

    const range = this.createRange?.({
      paneId,
      kLineDataList: chartStore.getDataList(),
      visibleDataRange: chartStore.getTimeScaleStore().getVisibleRange(),
      indicators,
      defaultRange
    })
    let realFrom = range.realFrom
    let realTo = range.realTo
    let realRange = range.realRange
    const minSpan = this.minSpan(precision)
    if (
      realFrom === realTo || realRange < minSpan
    ) {
      const minCheck = specifyMin === realFrom
      const maxCheck = specifyMax === realTo
      const halfTickCount = TICK_COUNT / 2
      realFrom = minCheck ? realFrom : (maxCheck ? realFrom - TICK_COUNT * minSpan : realFrom - halfTickCount * minSpan)
      realTo = maxCheck ? realTo : (minCheck ? realTo + TICK_COUNT * minSpan : realTo + halfTickCount * minSpan)
    }

    const height = this.getBounding().height
    const { top, bottom } = this.gap
    let topRate = top
    if (topRate >= 1) {
      topRate = topRate / height
    }
    let bottomRate = bottom
    if (bottomRate >= 1) {
      bottomRate = bottomRate / height
    }
    realRange = realTo - realFrom
    realFrom = realFrom - realRange * bottomRate
    realTo = realTo + realRange * topRate

    const from = this.realValueToValue(realFrom, { range })
    const to = this.realValueToValue(realTo, { range })
    const displayFrom = this.realValueToDisplayValue(realFrom, { range })
    const displayTo = this.realValueToDisplayValue(realTo, { range })
    return {
      from,
      to,
      range: to - from,
      realFrom,
      realTo,
      realRange: realTo - realFrom,
      displayFrom,
      displayTo,
      displayRange: displayTo - displayFrom
    }
  }

  /**
   * 是否是蜡烛图轴
   * @return {boolean}
   */
  isInCandle (): boolean {
    return this.getParent().getId() === PaneIdConstants.CANDLE
  }

  /**
   * 是否从y轴0开始
   * @return {boolean}
   */
  isFromZero (): boolean {
    return (
      (this.position === AxisPosition.Left && this.inside) ||
      (this.position === AxisPosition.Right && !this.inside)
    )
  }

  protected override createTicksImp (): AxisTick[] {
    const range = this.getRange()
    const { displayFrom, displayTo, displayRange } = range
    const ticks: AxisTick[] = []

    if (displayRange >= 0) {
      const interval = nice(displayRange / TICK_COUNT)
      const precision = getPrecision(interval)

      const first = round(Math.ceil(displayFrom / interval) * interval, precision)
      const last = round(Math.floor(displayTo / interval) * interval, precision)
      let n = 0
      let f = first

      if (interval !== 0) {
        while (f <= last) {
          const v = f.toFixed(precision)
          ticks[n] = { text: v, coord: 0, value: v }
          ++n
          f += interval
        }
      }
    }

    const pane = this.getParent()
    const height = pane.getYAxisWidget()?.getBounding().height ?? 0
    const chartStore = pane.getChart().getChartStore()
    const customApi = chartStore.getCustomApi()
    const optimalTicks: AxisTick[] = []
    const indicators = chartStore.getIndicatorStore().getInstanceByPaneId(pane.getId())
    const thousandsSeparator = chartStore.getThousandsSeparator()
    const decimalFoldThreshold = chartStore.getDecimalFoldThreshold()
    let precision = 0
    let shouldFormatBigNumber = false
    if (this.isInCandle()) {
      precision = chartStore.getPrecision().price
    } else {
      indicators.forEach(indicator => {
        precision = Math.max(precision, indicator.precision)
        if (!shouldFormatBigNumber) {
          shouldFormatBigNumber = indicator.shouldFormatBigNumber
        }
      })
    }
    const textHeight = chartStore.getStyles().xAxis.tickText.size
    let validY: number
    ticks.forEach(({ value }) => {
      let v = this.displayValueToText(+value, precision)
      const y = this.convertToPixel(
        this.realValueToValue(
          this.displayValueToRealValue(+value, { range }),
          { range }
        )
      )
      if (shouldFormatBigNumber) {
        v = customApi.formatBigNumber(value)
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
      const indicators = chartStore.getIndicatorStore().getInstanceByPaneId(pane.getId())
      let indicatorPrecision = 0
      let shouldFormatBigNumber = false
      indicators.forEach(indicator => {
        indicatorPrecision = Math.max(indicator.precision, indicatorPrecision)
        if (!shouldFormatBigNumber) {
          shouldFormatBigNumber = indicator.shouldFormatBigNumber
        }
      })
      let precision = 2
      if (this.isInCandle()) {
        const { price: pricePrecision } = chartStore.getPrecision()
        const lastValueMarkStyles = styles.indicator.lastValueMark
        if (lastValueMarkStyles.show && lastValueMarkStyles.text.show) {
          precision = Math.max(indicatorPrecision, pricePrecision)
        } else {
          precision = pricePrecision
        }
      } else {
        precision = indicatorPrecision
      }
      let valueText = formatPrecision(this.getRange().displayTo, precision)
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

  protected override getBounding (): Bounding {
    return this.getParent().getYAxisWidget()!.getBounding()
  }

  convertFromPixel (pixel: number): number {
    const height = this.getBounding().height
    const range = this.getRange()
    const { realFrom, realRange } = range
    const rate = this.reverse ? pixel / height : 1 - pixel / height
    const realValue = rate * realRange + realFrom
    return this.realValueToValue(realValue, { range })
  }

  convertToPixel (value: number): number {
    const range = this.getRange()
    const realValue = this.valueToRealValue(value, { range })
    const height = this.getParent().getYAxisWidget()?.getBounding().height ?? 0
    const { realFrom, realRange } = range
    const rate = (realValue - realFrom) / realRange
    return this.reverse ? Math.round(rate * height) : Math.round((1 - rate) * height)
  }

  convertToNicePixel (value: number): number {
    const height = this.getParent().getYAxisWidget()?.getBounding().height ?? 0
    const pixel = this.convertToPixel(value)
    return Math.round(Math.max(height * 0.05, Math.min(pixel, height * 0.98)))
  }

  static extend (template: YAxisTemplate): YAxisConstructor {
    class Custom extends YAxisImp {
      constructor (parent: DrawPane<Axis>) {
        super(parent, template)
      }
    }
    return Custom
  }
}

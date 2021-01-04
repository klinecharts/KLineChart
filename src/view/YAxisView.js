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

import View, { PlotType } from './View'
import { YAxisPosition } from '../data/options/styleOptions'
import { calcTextWidth, createFont } from '../utils/canvas'
import { renderHorizontalLine, renderVerticalLine } from '../renderer/line'
import { formatBigNumber, formatPrecision } from '../utils/format'
import { isValid } from '../utils/typeChecks'
import { renderFillRect } from '../renderer/rect'
import { renderText } from '../renderer/text'

export default class YAxisView extends View {
  constructor (container, chartData, yAxis, additionalDataProvider) {
    super(container, chartData)
    this._yAxis = yAxis
    this._additionalDataProvider = additionalDataProvider
  }

  _draw () {
    const yAxisOptions = this._chartData.styleOptions().yAxis
    if (yAxisOptions.show) {
      this._drawAxisLine(yAxisOptions)
      this._drawTickLines(yAxisOptions)
      this._drawTickLabels(yAxisOptions)
      this._drawTechnicalIndicatorLastValue(yAxisOptions)
      this._drawLastPriceLabel(yAxisOptions)
    }
  }

  _drawAxisLine (yAxisOptions) {
    const axisLine = yAxisOptions.axisLine
    if (!axisLine.show) {
      return
    }
    this._ctx.strokeStyle = axisLine.color
    this._ctx.lineWidth = axisLine.size
    let x
    if (this._isDrawFromStart(yAxisOptions)) {
      x = 0
    } else {
      x = this._width - 1
    }
    renderVerticalLine(this._ctx, x, 0, this._height)
  }

  _drawTickLines (yAxisOptions) {
    const tickLine = yAxisOptions.tickLine
    if (!tickLine.show) {
      return
    }
    this._ctx.lineWidth = tickLine.size
    this._ctx.strokeStyle = tickLine.color

    const tickLineLength = tickLine.length

    let startX
    let endX
    if (this._isDrawFromStart(yAxisOptions)) {
      startX = 0
      if (yAxisOptions.axisLine.show) {
        startX += yAxisOptions.axisLine.size
      }
      endX = startX + tickLineLength
    } else {
      startX = this._width
      if (yAxisOptions.axisLine.show) {
        startX -= yAxisOptions.axisLine.size
      }
      endX = startX - tickLineLength
    }
    this._yAxis.ticks().forEach(tick => {
      renderHorizontalLine(this._ctx, tick.y, startX, endX)
    })
  }

  _drawTickLabels (yAxisOptions) {
    const tickText = yAxisOptions.tickText
    if (!tickText.show) {
      return
    }
    const tickLine = yAxisOptions.tickLine
    const tickLineShow = tickLine.show
    const tickLineLength = tickLine.length
    let labelX
    if (this._isDrawFromStart(yAxisOptions)) {
      labelX = tickText.paddingLeft
      if (yAxisOptions.axisLine.show) {
        labelX += yAxisOptions.axisLine.size
      }
      if (tickLineShow) {
        labelX += tickLineLength
      }
      this._ctx.textAlign = 'left'
    } else {
      labelX = this._width - tickText.paddingRight
      if (yAxisOptions.axisLine.show) {
        labelX -= yAxisOptions.axisLine.size
      }
      if (tickLineShow) {
        labelX -= tickLineLength
      }
      this._ctx.textAlign = 'right'
    }
    this._ctx.textBaseline = 'middle'
    this._ctx.font = createFont(tickText.size, tickText.weight, tickText.family)
    this._ctx.fillStyle = tickText.color
    this._yAxis.ticks().forEach(tick => {
      this._ctx.fillText(tick.v, labelX, tick.y)
    })
    this._ctx.textAlign = 'left'
  }

  /**
   * 绘制技术指标最后值
   * @param yAxisOptions
   * @private
   */
  _drawTechnicalIndicatorLastValue (yAxisOptions) {
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    const lastValueMarkOptions = technicalIndicatorOptions.lastValueMark
    const technicalIndicators = this._additionalDataProvider.technicalIndicators()
    if (!lastValueMarkOptions.show || !lastValueMarkOptions.text.show) {
      return
    }
    const dataList = this._chartData.dataList()
    technicalIndicators.forEach(technicalIndicator => {
      const technicalIndicatorResult = technicalIndicator.result || []
      const dataSize = technicalIndicatorResult.length
      const technicalIndicatorData = technicalIndicatorResult[dataSize - 1] || {}
      const plots = technicalIndicator.plots
      const cbData = {
        preData: { kLineData: dataList[dataSize - 2], technicalIndicatorData: technicalIndicatorResult[dataSize - 2] },
        currentData: { kLineData: dataList[dataSize - 1], technicalIndicatorData },
        nextData: { kLineData: null, technicalIndicatorData: null }
      }
      const precision = technicalIndicator.precision
      const styles = technicalIndicator.styles || technicalIndicatorOptions
      const colors = styles.line.colors || []
      const colorSize = colors.length
      let lineCount = 0
      plots.forEach(plot => {
        const value = technicalIndicatorData[plot.key]
        let backgroundColor
        switch (plot.type) {
          case PlotType.CIRCLE: {
            backgroundColor = (plot.color && plot.color(cbData, styles)) || styles.circle.noChangeColor
            break
          }
          case PlotType.BAR: {
            backgroundColor = (plot.color && plot.color(cbData, styles)) || styles.bar.noChangeColor
            break
          }
          case PlotType.LINE: {
            backgroundColor = colors[lineCount % colorSize]
            lineCount++
            break
          }
          default: { break }
        }
        if (isValid(value)) {
          this._drawMarkLabel(
            yAxisOptions, value, precision, technicalIndicator.shouldFormatBigNumber,
            {
              ...lastValueMarkOptions.text, backgroundColor
            }
          )
        }
      })
    })
  }

  /**
   * 绘制最新价文字
   * @private
   */
  _drawLastPriceLabel (yAxisOptions) {
    if (!this._yAxis.isCandleYAxis()) {
      return
    }
    const priceMarkOptions = this._chartData.styleOptions().candle.priceMark
    const lastPriceMarkOptions = priceMarkOptions.last
    if (!priceMarkOptions.show || !lastPriceMarkOptions.show || !lastPriceMarkOptions.text.show) {
      return
    }
    const dataList = this._chartData.dataList()
    const kLineData = dataList[dataList.length - 1]
    if (!kLineData) {
      return
    }
    const close = kLineData.close
    const open = kLineData.open
    let backgroundColor
    if (close > open) {
      backgroundColor = lastPriceMarkOptions.upColor
    } else if (close < open) {
      backgroundColor = lastPriceMarkOptions.downColor
    } else {
      backgroundColor = lastPriceMarkOptions.noChangeColor
    }
    this._drawMarkLabel(
      yAxisOptions, close, this._chartData.pricePrecision(), false,
      {
        ...lastPriceMarkOptions.text, backgroundColor
      }
    )
  }

  /**
   * 绘制标记label
   * @param yAxisOptions
   * @param value
   * @param precision
   * @param shouldFormatBigNumber
   * @param size
   * @param weight
   * @param family
   * @param color
   * @param backgroundColor
   * @param paddingLeft
   * @param paddingTop
   * @param paddingRight
   * @param paddingBottom
   * @private
   */
  _drawMarkLabel (
    yAxisOptions, value, precision, shouldFormatBigNumber,
    {
      size, weight, family, color, backgroundColor,
      paddingLeft, paddingTop, paddingRight, paddingBottom
    }
  ) {
    let valueY = this._yAxis.convertToPixel(value)
    valueY = +(Math.max(this._height * 0.05, Math.min(valueY, this._height * 0.98))).toFixed(0)
    let text
    if (this._yAxis.isPercentageYAxis()) {
      const fromClose = this._chartData.dataList()[this._chartData.from()].close
      text = `${((value - fromClose) / fromClose * 100).toFixed(2)}%`
    } else {
      text = formatPrecision(value, precision)
      if (shouldFormatBigNumber) {
        text = formatBigNumber(text)
      }
    }
    this._ctx.font = createFont(size, weight, family)
    const rectWidth = calcTextWidth(this._ctx, text) + paddingLeft + paddingRight
    const rectHeight = paddingTop + size + paddingBottom
    let rectStartX
    if (this._isDrawFromStart(yAxisOptions)) {
      rectStartX = 0
    } else {
      rectStartX = this._width - rectWidth
    }
    renderFillRect(
      this._ctx, backgroundColor,
      rectStartX, valueY - paddingTop - size / 2, rectWidth, rectHeight
    )
    this._ctx.textBaseline = 'middle'
    renderText(this._ctx, color, rectStartX + paddingLeft, valueY, text)
  }

  /**
   * 判断是否从开始点绘制
   * @private
   */
  _isDrawFromStart (yAxisOptions) {
    return ((yAxisOptions.position === YAxisPosition.LEFT && yAxisOptions.inside) ||
      (yAxisOptions.position === YAxisPosition.RIGHT && !yAxisOptions.inside))
  }
}

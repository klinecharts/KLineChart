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

import View from './View'
import { YAxisType } from '../options/styleOptions'
import { TechnicalIndicatorPlotType } from '../component/technicalindicator/TechnicalIndicator'
import { calcTextWidth, createFont } from '../utils/canvas'
import { renderHorizontalLine, renderVerticalLine } from '../renderer/line'
import { formatBigNumber, formatPrecision } from '../utils/format'
import { isValid } from '../utils/typeChecks'
import { renderFillRoundRect } from '../renderer/rect'
import { renderText } from '../renderer/text'

export default class YAxisView extends View {
  constructor (container, chartStore, yAxis, paneId) {
    super(container, chartStore)
    this._yAxis = yAxis
    this._paneId = paneId
  }

  _draw () {
    const yAxisOptions = this._chartStore.styleOptions().yAxis
    if (yAxisOptions.show) {
      this._drawAxisLine(yAxisOptions)
      this._drawTickLines(yAxisOptions)
      this._drawTickLabels(yAxisOptions)
      this._drawTechLastValue()
      this._drawLastPriceLabel()
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
    if (this._yAxis.isFromYAxisZero()) {
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
    if (this._yAxis.isFromYAxisZero()) {
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
    if (this._yAxis.isFromYAxisZero()) {
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
   * @private
   */
  _drawTechLastValue () {
    const techOptions = this._chartStore.styleOptions().technicalIndicator
    const lastValueMarkOptions = techOptions.lastValueMark
    if (!lastValueMarkOptions.show || !lastValueMarkOptions.text.show) {
      return
    }
    const techs = this._chartStore.technicalIndicatorStore().instances(this._paneId)
    const dataList = this._chartStore.dataList()
    techs.forEach(tech => {
      const techResult = tech.result || []
      const dataSize = techResult.length
      const techData = techResult[dataSize - 1] || {}
      const plots = tech.plots
      const cbData = {
        prev: { kLineData: dataList[dataSize - 2], technicalIndicatorData: techResult[dataSize - 2] },
        current: { kLineData: dataList[dataSize - 1], technicalIndicatorData: techData },
        next: { kLineData: null, technicalIndicatorData: null }
      }
      const precision = tech.precision
      const styles = tech.styles || techOptions
      const colors = styles.line.colors || []
      const colorSize = colors.length
      let lineCount = 0
      plots.forEach(plot => {
        const value = techData[plot.key]
        let backgroundColor
        switch (plot.type) {
          case TechnicalIndicatorPlotType.CIRCLE: {
            backgroundColor = (plot.color && plot.color(cbData, styles)) || styles.circle.noChangeColor
            break
          }
          case TechnicalIndicatorPlotType.BAR: {
            backgroundColor = (plot.color && plot.color(cbData, styles)) || styles.bar.noChangeColor
            break
          }
          case TechnicalIndicatorPlotType.LINE: {
            backgroundColor = colors[lineCount % colorSize]
            lineCount++
            break
          }
          default: { break }
        }
        if (isValid(value)) {
          this._drawMarkLabel(
            value, precision, tech.shouldFormatBigNumber,
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
  _drawLastPriceLabel () {
    if (!this._yAxis.isCandleYAxis()) {
      return
    }
    const priceMarkOptions = this._chartStore.styleOptions().candle.priceMark
    const lastPriceMarkOptions = priceMarkOptions.last
    if (!priceMarkOptions.show || !lastPriceMarkOptions.show || !lastPriceMarkOptions.text.show) {
      return
    }
    const dataList = this._chartStore.dataList()
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
      close, this._chartStore.pricePrecision(), false,
      {
        ...lastPriceMarkOptions.text, backgroundColor
      }
    )
  }

  /**
   * 绘制标记label
   * @param value
   * @param precision
   * @param shouldFormatBigNumber
   * @param size
   * @param weight
   * @param family
   * @param color
   * @param backgroundColor
   * @param borderRadius
   * @param paddingLeft
   * @param paddingTop
   * @param paddingRight
   * @param paddingBottom
   * @private
   */
  _drawMarkLabel (
    value, precision, shouldFormatBigNumber,
    {
      size, weight, family, color, backgroundColor, borderRadius,
      paddingLeft, paddingTop, paddingRight, paddingBottom
    }
  ) {
    const valueY = this._yAxis.convertToNicePixel(value)
    let text
    if (this._yAxis.yAxisType() === YAxisType.PERCENTAGE) {
      const fromData = (this._chartStore.visibleDataList()[0] || {}).data || {}
      const fromClose = fromData.close
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
    if (this._yAxis.isFromYAxisZero()) {
      rectStartX = 0
    } else {
      rectStartX = this._width - rectWidth
    }
    renderFillRoundRect(
      this._ctx, backgroundColor,
      rectStartX, valueY - paddingTop - size / 2, rectWidth, rectHeight, borderRadius
    )
    this._ctx.textBaseline = 'middle'
    renderText(this._ctx, color, rectStartX + paddingLeft, valueY, text)
  }
}

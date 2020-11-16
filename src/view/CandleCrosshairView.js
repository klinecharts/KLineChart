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

import TechnicalIndicatorCrosshairView from './TechnicalIndicatorCrosshairView'
import { isFunction, isObject, isArray } from '../utils/typeChecks'
import { formatBigNumber, formatDate, formatPrecision, formatValue } from '../utils/format'
import { calcTextWidth, createFont } from '../utils/canvas'
import { LegendCandleShowType } from '../data/options/styleOptions'
import { getTechnicalIndicatorInfo } from '../data/technicalindicator/technicalIndicatorControl'
import { renderFillRoundRect, renderStrokeRoundRect } from '../renderer/rect'
import { renderText } from '../renderer/text'

export default class CandleCrosshairView extends TechnicalIndicatorCrosshairView {
  _drawLegend (
    crosshair, kLineData, technicalIndicatorData,
    realDataPos, realDataPosX, technicalIndicator
  ) {
    const styleOptions = this._chartData.styleOptions()
    const candleOptions = styleOptions.candle
    const candleLegendOptions = candleOptions.legend
    const isDrawCandleLegend = this._shouldDrawLegend(crosshair, candleLegendOptions)
    if (candleLegendOptions.showType === LegendCandleShowType.STANDARD) {
      const offsetTop = isDrawCandleLegend ? candleLegendOptions.text.size + candleLegendOptions.text.marginTop : 0
      this._drawCandleLegendWithStandard(kLineData, candleOptions, isDrawCandleLegend)
      this._drawTechnicalIndicatorLegend(crosshair, technicalIndicatorData, realDataPos, technicalIndicator, offsetTop)
    } else {
      this._drawCandleLegendWithRect(
        kLineData, technicalIndicatorData,
        realDataPosX, candleOptions, isDrawCandleLegend,
        styleOptions.technicalIndicator,
        this._shouldDrawLegend(crosshair, styleOptions.technicalIndicator.legend)
      )
    }
  }

  /**
   * 绘制蜡烛默认的图例
   * @param kLineData
   * @param candleOptions
   * @param isDrawCandleLegend
   * @private
   */
  _drawCandleLegendWithStandard (kLineData, candleOptions, isDrawCandleLegend) {
    if (!isDrawCandleLegend) {
      return
    }
    const values = this._getCandleLegendData(kLineData, candleOptions)
    const candleLegendOptions = candleOptions.legend
    const textMarginLeft = candleLegendOptions.text.marginLeft
    const textMarginRight = candleLegendOptions.text.marginRight
    const textSize = candleLegendOptions.text.size
    const textColor = candleLegendOptions.text.color
    const labels = candleLegendOptions.labels
    this._ctx.textBaseline = 'top'
    this._ctx.font = createFont(textSize, candleLegendOptions.text.weight, candleLegendOptions.text.family)
    let labelX = textMarginLeft
    const labelY = candleLegendOptions.text.marginTop
    labels.forEach((label, i) => {
      const labelText = label ? `${label}: ` : ''
      const labelWidth = calcTextWidth(this._ctx, labelText)
      renderText(this._ctx, textColor, labelX, labelY, labelText)
      labelX += labelWidth

      const value = values[i] || 'n/a'
      let valueText
      let valueColor
      if (isObject(value)) {
        valueText = value.value || 'n/a'
        valueColor = value.color || textColor
      } else {
        valueColor = textColor
        valueText = value
      }
      const textWidth = calcTextWidth(this._ctx, valueText)
      renderText(this._ctx, valueColor, labelX, labelY, valueText)
      labelX += (textWidth + textMarginLeft + textMarginRight)
    })
  }

  /**
   * 绘制蜡烛图矩形类型图例
   * @param kLineData
   * @param technicalIndicatorData
   * @param technicalIndicator
   * @param x
   * @param candleOptions
   * @param isDrawCandleLegend
   * @param technicalIndicatorOptions
   * @param isDrawTechnicalIndicatorLegend
   * @private
   */
  _drawCandleLegendWithRect (
    kLineData, technicalIndicatorData, technicalIndicator,
    x, candleOptions, isDrawCandleLegend,
    technicalIndicatorOptions, isDrawTechnicalIndicatorLegend
  ) {
    let maxLabelWidth = 0
    const candleLegendOptions = candleOptions.legend
    const baseLabels = candleLegendOptions.labels
    const baseValues = this._getCandleLegendData(kLineData, candleOptions)
    const baseTextMarginLeft = candleLegendOptions.text.marginLeft
    const baseTextMarginRight = candleLegendOptions.text.marginRight
    const baseTextMarginTop = candleLegendOptions.text.marginTop
    const baseTextMarginBottom = candleLegendOptions.text.marginBottom
    const baseTextSize = candleLegendOptions.text.size
    const baseTextColor = candleLegendOptions.text.color
    if (isDrawCandleLegend) {
      this._ctx.save()
      this._ctx.textBaseline = 'top'
      this._ctx.font = createFont(baseTextSize, candleLegendOptions.text.weight, candleLegendOptions.text.family)
      baseLabels.forEach((label, i) => {
        const value = baseValues[i] || 'n/a'
        let v = value
        if (isObject(value)) {
          v = value.value || 'n/a'
        }
        const text = `${label}: ${v}`
        const labelWidth = calcTextWidth(this._ctx, text) + baseTextMarginLeft + baseTextMarginRight
        maxLabelWidth = Math.max(maxLabelWidth, labelWidth)
      })
    }
    const rect = candleLegendOptions.rect
    const rectBorderSize = rect.borderSize
    const rectPaddingLeft = rect.paddingLeft
    const rectPaddingRight = rect.paddingRight
    const rectPaddingTop = rect.paddingTop
    const rectPaddingBottom = rect.paddingBottom
    const rectLeft = rect.left
    const rectRight = rect.right
    let rectHeight = rectBorderSize * 2 +
      rectPaddingTop + rectPaddingBottom +
      (baseTextMarginBottom + baseTextMarginTop + baseTextSize) * baseLabels.length

    const floatLayerPromptTechnicalIndicator = this._chartData.styleOptions().floatLayer.prompt.technicalIndicator

    const indicatorTextMarginLeft = floatLayerPromptTechnicalIndicator.text.marginLeft
    const indicatorTextMarginRight = floatLayerPromptTechnicalIndicator.text.marginRight
    const indicatorTextMarginTop = floatLayerPromptTechnicalIndicator.text.marginTop
    const indicatorTextMarginBottom = floatLayerPromptTechnicalIndicator.text.marginBottom
    const indicatorTextSize = floatLayerPromptTechnicalIndicator.text.size

    const indicatorLegendData = getTechnicalIndicatorInfo(technicalIndicatorData, technicalIndicator, this._yAxis)
    const indicatorLabels = indicatorLegendData.labels || []
    const indicatorValues = indicatorLegendData.values || []
    if (isDrawTechnicalIndicatorLegend) {
      this._ctx.font = createFont(
        indicatorTextSize,
        floatLayerPromptTechnicalIndicator.text.weight,
        floatLayerPromptTechnicalIndicator.text.family
      )
      indicatorLabels.forEach((label, i) => {
        const v = indicatorValues[i].value || 'n/a'
        const text = `${label}: ${v}`
        const labelWidth = calcTextWidth(this._ctx, text) + indicatorTextMarginLeft + indicatorTextMarginRight
        maxLabelWidth = Math.max(maxLabelWidth, labelWidth)
      })
      rectHeight += ((indicatorTextMarginTop + indicatorTextMarginBottom + indicatorTextSize) * indicatorLabels.length)
    }

    const rectWidth = rectBorderSize * 2 + maxLabelWidth + rectPaddingLeft + rectPaddingRight

    const centerX = this._width / 2
    let rectX
    if (x < centerX) {
      rectX = this._width - rectRight - rectWidth
    } else {
      rectX = rectLeft
    }
    const rectY = rect.top
    const radius = rect.borderRadius
    renderFillRoundRect(this._ctx, rect.fillColor, rectX, rectY, rectWidth, rectHeight, radius)
    renderStrokeRoundRect(this._ctx, rect.borderColor, rectBorderSize, rectX, rectY, rectWidth, rectHeight, radius)
    const baseLabelX = rectX + rectBorderSize + rectPaddingLeft + baseTextMarginLeft
    let labelY = rectY + rectBorderSize + rectPaddingTop
    if (isDrawCandleLegend) {
      // 开始渲染基础数据文字
      this._ctx.font = createFont(
        baseTextSize,
        candleLegendOptions.text.weight,
        candleLegendOptions.text.family
      )
      baseLabels.forEach((label, i) => {
        labelY += baseTextMarginTop
        this._ctx.textAlign = 'left'
        renderText(this._ctx, baseTextColor, baseLabelX, labelY, `${label}: `)

        const value = baseValues[i] || 'n/a'
        let text
        this._ctx.fillStyle = value.color || baseTextColor
        if (isObject(value)) {
          text = value.value || 'n/a'
        } else {
          text = value
        }
        this._ctx.textAlign = 'right'
        renderText(
          this._ctx,
          value.color || baseTextColor,
          rectX + rectWidth - rectBorderSize - baseTextMarginRight - rectPaddingRight,
          labelY,
          text
        )
        labelY += (baseTextSize + baseTextMarginBottom)
      })
    }
    if (isDrawTechnicalIndicatorLegend) {
      // 开始渲染指标数据文字
      const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
      const colors = technicalIndicatorOptions.line.colors
      const indicatorLabelX = rectX + rectBorderSize + rectPaddingLeft + indicatorTextMarginLeft
      const colorSize = colors.length
      this._ctx.font = createFont(
        indicatorTextSize,
        floatLayerPromptTechnicalIndicator.text.weight,
        floatLayerPromptTechnicalIndicator.text.family
      )
      indicatorLabels.forEach((label, i) => {
        labelY += indicatorTextMarginTop
        this._ctx.textAlign = 'left'
        this._ctx.fillStyle = colors[i % colorSize] || technicalIndicatorOptions.text.color
        this._ctx.fillText(`${label.toUpperCase()}: `, indicatorLabelX, labelY)

        this._ctx.textAlign = 'right'
        this._ctx.fillText(
          indicatorValues[i].value || 'n/a',
          rectX + rectWidth - rectBorderSize - indicatorTextMarginRight - rectPaddingRight,
          labelY
        )
        labelY += (indicatorTextSize + indicatorTextMarginBottom)
      })
    }
    this._ctx.restore()
  }

  /**
   * 获取蜡烛提示数据
   * @param kLineData
   * @param candleOptions
   * @returns {*}
   * @private
   */
  _getCandleLegendData (kLineData, candleOptions) {
    const baseValues = candleOptions.legend.values
    let values = []
    if (baseValues) {
      if (isFunction(baseValues)) {
        values = baseValues(kLineData, candleOptions) || []
      } else if (isArray(baseValues)) {
        values = baseValues
      }
    } else {
      const pricePrecision = this._chartData.pricePrecision()
      const volumePrecision = this._chartData.volumePrecision()
      values = [
        formatValue(kLineData, 'timestamp'),
        formatValue(kLineData, 'open'),
        formatValue(kLineData, 'close'),
        formatValue(kLineData, 'high'),
        formatValue(kLineData, 'low'),
        formatValue(kLineData, 'volume')
      ]
      values.forEach((value, index) => {
        switch (index) {
          case 0: {
            values[index] = formatDate(this._chartData.dateTimeFormat(), value, 'YYYY-MM-DD hh:mm')
            break
          }
          case values.length - 1: {
            values[index] = formatBigNumber(formatPrecision(value, volumePrecision))
            break
          }
          default: {
            values[index] = formatPrecision(value, pricePrecision)
            break
          }
        }
      })
    }
    return values
  }
}

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

import TechnicalIndicatorFloatLayerView from './TechnicalIndicatorFloatLayerView'
import { isFunction, isObject, isArray } from '../utils/typeChecks'
import { formatBigNumber, formatDate, formatPrecision, formatValue } from '../utils/format'
import { calcTextWidth, getFont } from '../utils/canvas'
import { ChartType, FloatLayerPromptCandleStickTextDisplayType } from '../data/options/styleOptions'
import { getTechnicalIndicatorInfo } from '../data/technicalindicator/technicalIndicatorControl'

export default class CandleStickFloatLayerView extends TechnicalIndicatorFloatLayerView {
  _drawPrompt (kLineData, technicalIndicatorData, realDataPos, realDataPosX, technicalIndicator) {
    const options = this._chartData.styleOptions()
    const floatLayerPromptCandleStick = options.floatLayer.prompt.candleStick
    const candleStickPromptData = this._getCandleStickPromptData(kLineData, options.candleStick, floatLayerPromptCandleStick)
    if (floatLayerPromptCandleStick.showType === FloatLayerPromptCandleStickTextDisplayType.STANDARD) {
      this._drawCandleStickStandardPromptText(floatLayerPromptCandleStick, candleStickPromptData)
      if (this._additionalDataProvider.chartType() === ChartType.CANDLE_STICK) {
        this._drawTechnicalIndicatorPromptText(
          technicalIndicatorData,
          realDataPos,
          technicalIndicator,
          floatLayerPromptCandleStick.text.size + floatLayerPromptCandleStick.text.marginTop
        )
      }
    } else {
      const data = getTechnicalIndicatorInfo(technicalIndicatorData, technicalIndicator, this._yAxis)
      this._drawCandleStickRectPromptText(
        realDataPosX, floatLayerPromptCandleStick, candleStickPromptData, data
      )
    }
  }

  _drawCandleStickStandardPromptText (floatLayerPromptCandleStick, candleStickPromptData) {
    const values = candleStickPromptData
    const textMarginLeft = floatLayerPromptCandleStick.text.marginLeft
    const textMarginRight = floatLayerPromptCandleStick.text.marginRight
    const textSize = floatLayerPromptCandleStick.text.size
    const textColor = floatLayerPromptCandleStick.text.color
    const labels = floatLayerPromptCandleStick.labels
    this._ctx.textBaseline = 'top'
    this._ctx.font = getFont(textSize, floatLayerPromptCandleStick.text.weight, floatLayerPromptCandleStick.text.family)
    let labelX = textMarginLeft
    const labelY = floatLayerPromptCandleStick.text.marginTop
    labels.forEach((label, i) => {
      const labelText = label ? `${label}: ` : ''
      const labelWidth = calcTextWidth(this._ctx, labelText)
      this._ctx.fillStyle = textColor
      this._ctx.fillText(labelText, labelX, labelY)
      labelX += labelWidth

      const value = values[i] || 'n/a'
      let valueText
      if (isObject(value)) {
        valueText = value.value || 'n/a'
        this._ctx.fillStyle = value.color || textColor
      } else {
        this._ctx.fillStyle = textColor
        valueText = value
      }
      const textWidth = calcTextWidth(this._ctx, valueText)
      this._ctx.fillText(valueText, labelX, labelY)
      labelX += (textWidth + textMarginLeft + textMarginRight)
    })
  }

  _drawCandleStickRectPromptText (
    x, floatLayerPromptCandleStick, candleStickPromptData, technicalIndicatorPromptData
  ) {
    const baseLabels = floatLayerPromptCandleStick.labels
    const baseValues = candleStickPromptData
    const baseTextMarginLeft = floatLayerPromptCandleStick.text.marginLeft
    const baseTextMarginRight = floatLayerPromptCandleStick.text.marginRight
    const baseTextMarginTop = floatLayerPromptCandleStick.text.marginTop
    const baseTextMarginBottom = floatLayerPromptCandleStick.text.marginBottom
    const baseTextSize = floatLayerPromptCandleStick.text.size
    const baseTextColor = floatLayerPromptCandleStick.text.color
    this._ctx.save()
    this._ctx.textBaseline = 'top'
    this._ctx.font = getFont(baseTextSize, floatLayerPromptCandleStick.text.weight, floatLayerPromptCandleStick.text.family)
    let maxLabelWidth = 0
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

    const rect = floatLayerPromptCandleStick.rect
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

    const isCandleStick = this._additionalDataProvider.chartType() === ChartType.CANDLE_STICK
    const indicatorLabels = technicalIndicatorPromptData.labels || []
    const indicatorValues = technicalIndicatorPromptData.values || []
    if (isCandleStick) {
      this._ctx.font = getFont(
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
    this._ctx.lineWidth = rectBorderSize
    this._ctx.strokeStyle = rect.borderColor
    this._ctx.fillStyle = rect.fillColor
    this._drawRoundRect(rectX, rectY, rectWidth, rectHeight, radius)
    this._ctx.stroke()
    this._drawRoundRect(rectX, rectY, rectWidth, rectHeight, radius)
    this._ctx.fill()
    const baseLabelX = rectX + rectBorderSize + rectPaddingLeft + baseTextMarginLeft
    let labelY = rectY + rectBorderSize + rectPaddingTop
    // 开始渲染基础数据文字
    this._ctx.font = getFont(
      baseTextSize,
      floatLayerPromptCandleStick.text.weight,
      floatLayerPromptCandleStick.text.family
    )
    baseLabels.forEach((label, i) => {
      labelY += baseTextMarginTop
      this._ctx.textAlign = 'left'
      this._ctx.fillStyle = baseTextColor
      this._ctx.fillText(`${label}: `, baseLabelX, labelY)

      const value = baseValues[i] || 'n/a'
      let text
      this._ctx.fillStyle = value.color || baseTextColor
      if (isObject(value)) {
        text = value.value || 'n/a'
      } else {
        text = value
      }
      this._ctx.textAlign = 'right'
      this._ctx.fillText(text, rectX + rectWidth - rectBorderSize - baseTextMarginRight - rectPaddingRight, labelY)
      labelY += (baseTextSize + baseTextMarginBottom)
    })
    if (isCandleStick) {
      // 开始渲染指标数据文字
      const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
      const colors = technicalIndicatorOptions.line.colors
      const indicatorLabelX = rectX + rectBorderSize + rectPaddingLeft + indicatorTextMarginLeft
      const colorSize = colors.length
      this._ctx.font = getFont(
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
   * 渲染圆角矩形
   * @param x
   * @param y
   * @param w
   * @param h
   * @param r
   */
  _drawRoundRect (x, y, w, h, r) {
    this._ctx.beginPath()
    this._ctx.moveTo(x + r, y)
    this._ctx.arcTo(x + w, y, x + w, y + h, r)
    this._ctx.arcTo(x + w, y + h, x, y + h, r)
    this._ctx.arcTo(x, y + h, x, y, r)
    this._ctx.arcTo(x, y, x + w, y, r)
    this._ctx.closePath()
  }

  /**
   * 获取蜡烛提示数据
   * @param kLineData
   * @param candleStick
   * @param floatLayerPromptCandleStick
   * @returns {*}
   * @private
   */
  _getCandleStickPromptData (kLineData, candleStick, floatLayerPromptCandleStick) {
    const baseValues = floatLayerPromptCandleStick.values
    let values = []
    if (baseValues) {
      if (isFunction(baseValues)) {
        values = baseValues(kLineData, candleStick, floatLayerPromptCandleStick) || []
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

import TechnicalIndicatorFloatLayerView from './TechnicalIndicatorFloatLayerView'
import { isFunction } from '../utils/typeChecks'
import { formatDate, formatPrecision, formatValue } from '../utils/format'
import { calcTextWidth, getFont } from '../utils/canvas'
import { FloatLayerPromptCandleStickTextDisplayType } from '../data/options/styleOptions'

export default class CandleStickFloatLayerView extends TechnicalIndicatorFloatLayerView {
  _drawPrompt (kLineData, x) {
    const floatLayerPromptCandleStick = this._chartData.styleOptions().floatLayer.prompt.candleStick
    const candleStickPromptData = this._getCandleStickPromptData(kLineData, floatLayerPromptCandleStick)
    if (floatLayerPromptCandleStick.showType === FloatLayerPromptCandleStickTextDisplayType.STANDARD) {
      this._drawCandleStickStandardPromptText(floatLayerPromptCandleStick, candleStickPromptData)
      this._drawTechnicalIndicatorPrompt(
        kLineData, x,
        floatLayerPromptCandleStick.text.size + floatLayerPromptCandleStick.text.marginTop
      )
    } else {
      this._drawCandleStickRectPromptText(kLineData, x, floatLayerPromptCandleStick, candleStickPromptData)
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
    this._ctx.font = getFont(textSize)
    let labelX = textMarginLeft
    const labelY = floatLayerPromptCandleStick.text.marginTop
    labels.forEach((label, i) => {
      const labelText = label ? `${label}: ` : ''
      const labelWidth = calcTextWidth(this._ctx, labelText)
      this._ctx.fillStyle = textColor
      this._ctx.fillText(labelText, labelX, labelY)
      labelX += labelWidth

      const value = values[i] || '--'
      let valueText
      if (typeof value === 'object') {
        valueText = value.value || '--'
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

  _drawCandleStickRectPromptText (kLineData, x, floatLayerPromptCandleStick, candleStickPromptData) {
    const baseLabels = floatLayerPromptCandleStick.labels
    const baseValues = candleStickPromptData
    const baseTextMarginLeft = floatLayerPromptCandleStick.text.marginLeft
    const baseTextMarginRight = floatLayerPromptCandleStick.text.marginRight
    const baseTextMarginTop = floatLayerPromptCandleStick.text.marginTop
    const baseTextMarginBottom = floatLayerPromptCandleStick.text.marginBottom
    const baseTextSize = floatLayerPromptCandleStick.text.size
    const baseTextColor = floatLayerPromptCandleStick.text.color

    this._ctx.textBaseline = 'top'
    this._ctx.font = getFont(baseTextSize)
    let maxLabelWidth = 0
    baseLabels.forEach((label, i) => {
      const value = baseValues[i] || '--'
      let v = value
      if (typeof value === 'object') {
        v = value.value || '--'
      }
      const text = `${label}: ${v}`
      const labelWidth = calcTextWidth(this._ctx, text) + baseTextMarginLeft + baseTextMarginRight
      maxLabelWidth = Math.max(maxLabelWidth, labelWidth)
    })

    const technicalIndicatorPromptData = this._getTechnicalIndicatorPromptData(kLineData)
    const indicatorLabels = technicalIndicatorPromptData.labels || []
    const indicatorValues = technicalIndicatorPromptData.values || []
    const floatLayerPromptTechnicalIndicator = this._chartData.styleOptions().floatLayer.prompt.technicalIndicator

    const indicatorTextMarginLeft = floatLayerPromptTechnicalIndicator.text.marginLeft
    const indicatorTextMarginRight = floatLayerPromptTechnicalIndicator.text.marginRight
    const indicatorTextMarginTop = floatLayerPromptTechnicalIndicator.text.marginTop
    const indicatorTextMarginBottom = floatLayerPromptTechnicalIndicator.text.marginBottom
    const indicatorTextSize = floatLayerPromptTechnicalIndicator.text.size
    this._ctx.font = getFont(indicatorTextSize)
    indicatorLabels.forEach((label, i) => {
      const v = indicatorValues[i] || '--'
      const text = `${label}: ${v}`
      const labelWidth = calcTextWidth(this._ctx, text) + indicatorTextMarginLeft + indicatorTextMarginRight
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
    const rectWidth = rectBorderSize * 2 + maxLabelWidth + rectPaddingLeft + rectPaddingRight
    const rectHeight = rectBorderSize * 2 +
      rectPaddingTop + rectPaddingBottom +
      (baseTextMarginBottom + baseTextMarginTop + baseTextSize) * baseLabels.length +
      (indicatorTextMarginTop + indicatorTextMarginBottom + indicatorTextSize) * indicatorLabels.length

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
    this._ctx.font = getFont(baseTextSize)
    baseLabels.forEach((label, i) => {
      labelY += baseTextMarginTop
      this._ctx.textAlign = 'left'
      this._ctx.fillStyle = baseTextColor
      this._ctx.fillText(`${label}: `, baseLabelX, labelY)

      const value = baseValues[i] || '--'
      let text
      this._ctx.fillStyle = value.color || baseTextColor
      if (typeof value === 'object') {
        text = value.value || '--'
      } else {
        text = value
      }
      this._ctx.textAlign = 'right'
      this._ctx.fillText(text, rectX + rectWidth - rectBorderSize - baseTextMarginRight - rectPaddingRight, labelY)
      labelY += (baseTextSize + baseTextMarginBottom)
    })
    // 开始渲染指标数据文字
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    const colors = technicalIndicatorOptions.line.colors
    const indicatorLabelX = rectX + rectBorderSize + rectPaddingLeft + indicatorTextMarginLeft
    const colorSize = colors.length
    this._ctx.font = getFont(indicatorTextSize)
    indicatorLabels.forEach((label, i) => {
      labelY += indicatorTextMarginTop
      this._ctx.textAlign = 'left'
      this._ctx.fillStyle = colors[i % colorSize] || technicalIndicatorOptions.text.color
      this._ctx.fillText(`${label.toUpperCase()}: `, indicatorLabelX, labelY)

      this._ctx.textAlign = 'right'
      this._ctx.fillText(
        indicatorValues[i] || '--',
        rectX + rectWidth - rectBorderSize - indicatorTextMarginRight - rectPaddingRight,
        labelY
      )
      labelY += (indicatorTextSize + indicatorTextMarginBottom)
    })
    this._ctx.textAlign = 'left'
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
   * @param floatLayerPromptCandleStick
   * @returns {*}
   * @private
   */
  _getCandleStickPromptData (kLineData, floatLayerPromptCandleStick) {
    const baseValues = floatLayerPromptCandleStick.values
    let values = []
    if (baseValues) {
      if (isFunction(baseValues)) {
        values = baseValues(kLineData) || []
      } else {
        values = baseValues
      }
    } else {
      const precisionOptions = this._chartData.precisionOptions()
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
            values[index] = formatDate(value, 'YYYY-MM-DD hh:mm')
            break
          }
          case values.length - 1: {
            values[index] = formatPrecision(value, precisionOptions.volume)
            break
          }
          default: {
            values[index] = formatPrecision(value, precisionOptions.price)
            break
          }
        }
      })
    }
    return values
  }
}

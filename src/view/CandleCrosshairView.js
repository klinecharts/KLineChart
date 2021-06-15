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
 import { TooltipCandleShowType } from '../data/options/styleOptions'
 import { getTechnicalIndicatorTooltipData } from '../data/technicalindicator/technicalIndicatorControl'
 import { renderFillRoundRect, renderStrokeRoundRect } from '../renderer/rect'
 import { renderText } from '../renderer/text'
 
 export default class CandleCrosshairView extends TechnicalIndicatorCrosshairView {
   _drawTooltip (
     crosshair, kLineData, dataPos, realDataPosX, technicalIndicators
   ) {
     const styleOptions = this._chartData.styleOptions()
     const candleOptions = styleOptions.candle
     const candleTooltipOptions = candleOptions.tooltip
     const isDrawCandleTooltip = this._shouldDrawTooltip(crosshair, candleTooltipOptions)
     if (candleTooltipOptions.showType === TooltipCandleShowType.STANDARD) {
       const offsetTop = isDrawCandleTooltip ? candleTooltipOptions.text.size + candleTooltipOptions.text.marginTop : 0
       this._drawCandleTooltipWithStandard(kLineData, candleOptions, isDrawCandleTooltip)
       this._drawBatchTechnicalIndicatorToolTip(
         crosshair, dataPos, technicalIndicators, offsetTop
       )
     } else {
       this._drawCandleTooltipWithRect(
         kLineData, technicalIndicators, dataPos,
         realDataPosX, candleOptions, isDrawCandleTooltip,
         styleOptions.technicalIndicator,
         this._shouldDrawTooltip(crosshair, styleOptions.technicalIndicator.tooltip)
       )
     }
   }
 
   /**
    * 绘制蜡烛默认的图例
    * @param kLineData
    * @param candleOptions
    * @param isDrawCandleTooltip
    * @private
    */
   _drawCandleTooltipWithStandard (kLineData, candleOptions, isDrawCandleTooltip) {
     if (!isDrawCandleTooltip) {
       return
     }
     const values = this._getCandleTooltipData(kLineData, candleOptions)
     const candleTooltipOptions = candleOptions.tooltip
     const textMarginLeft = candleTooltipOptions.text.marginLeft
     const textMarginRight = candleTooltipOptions.text.marginRight
     const textSize = candleTooltipOptions.text.size
     const textColor = candleTooltipOptions.text.color
     const labels = candleTooltipOptions.labels
     this._ctx.textBaseline = 'top'
     this._ctx.font = createFont(textSize, candleTooltipOptions.text.weight, candleTooltipOptions.text.family)
     let labelX = textMarginLeft
     const labelY = candleTooltipOptions.text.marginTop
     labels.forEach((label, i) => {
       const labelText = label ? `${label}: ` : ''
       const labelWidth = calcTextWidth(this._ctx, labelText)
       renderText(this._ctx, textColor, labelX, labelY, labelText)
       labelX += labelWidth
 
       const value = values[i] || candleTooltipOptions.defaultValue
       let valueText
       let valueColor
       if (isObject(value)) {
         valueText = value.value || candleTooltipOptions.defaultValue
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
    * @param technicalIndicators
    * @param dataPos
    * @param x
    * @param candleOptions
    * @param isDrawCandleTooltip
    * @param technicalIndicatorOptions
    * @param isDrawTechnicalIndicatorTooltip
    * @private
    */
   _drawCandleTooltipWithRect (
     kLineData, technicalIndicators, dataPos, x, candleOptions, isDrawCandleTooltip,
     technicalIndicatorOptions, isDrawTechnicalIndicatorTooltip
   ) {
     if (!isDrawCandleTooltip && !isDrawTechnicalIndicatorTooltip) {
       return
     }
     const candleTooltipOptions = candleOptions.tooltip
     const baseLabels = candleTooltipOptions.labels
     const baseValues = this._getCandleTooltipData(kLineData, candleOptions)
     const baseTextMarginLeft = candleTooltipOptions.text.marginLeft
     const baseTextMarginRight = candleTooltipOptions.text.marginRight
     const baseTextMarginTop = candleTooltipOptions.text.marginTop
     const baseTextMarginBottom = candleTooltipOptions.text.marginBottom
     const baseTextSize = candleTooltipOptions.text.size
     const baseTextColor = candleTooltipOptions.text.color
 
     const rectOptions = candleTooltipOptions.rect
     const rectBorderSize = rectOptions.borderSize
     const rectPaddingLeft = rectOptions.paddingLeft
     const rectPaddingRight = rectOptions.paddingRight
     const rectPaddingTop = rectOptions.paddingTop
     const rectPaddingBottom = rectOptions.paddingBottom
     const rectLeft = rectOptions.offsetLeft
     const rectRight = rectOptions.offsetRight
 
     let maxLabelWidth = 0
     let rectWidth = 0
     let rectHeight = 0
     this._ctx.save()
     this._ctx.textBaseline = 'top'
     if (isDrawCandleTooltip) {
       this._ctx.font = createFont(baseTextSize, candleTooltipOptions.text.weight, candleTooltipOptions.text.family)
       baseLabels.forEach((label, i) => {
         const value = baseValues[i]
         let v
         if (isObject(value)) {
           v = value.value || candleTooltipOptions.defaultValue
         } else {
           v = value
         }
         const text = `${label}: ${v}`
         const labelWidth = calcTextWidth(this._ctx, text) + baseTextMarginLeft + baseTextMarginRight
         maxLabelWidth = Math.max(maxLabelWidth, labelWidth)
       })
       rectHeight += ((baseTextMarginBottom + baseTextMarginTop + baseTextSize) * baseLabels.length)
     }
 
     const technicalIndicatorTooltipOptions = technicalIndicatorOptions.tooltip
 
     const indicatorTextMarginLeft = technicalIndicatorTooltipOptions.text.marginLeft
     const indicatorTextMarginRight = technicalIndicatorTooltipOptions.text.marginRight
     const indicatorTextMarginTop = technicalIndicatorTooltipOptions.text.marginTop
     const indicatorTextMarginBottom = technicalIndicatorTooltipOptions.text.marginBottom
     const indicatorTextSize = technicalIndicatorTooltipOptions.text.size
 
     const indicatorLabelValues = []
     technicalIndicators.forEach(technicalIndicator => {
       const indicatorTooltipData = getTechnicalIndicatorTooltipData(technicalIndicator.result[dataPos], technicalIndicator, this._yAxis)
       indicatorLabelValues.push({ labels: indicatorTooltipData.labels || [], values: indicatorTooltipData.values || [] })
     })
     if (isDrawTechnicalIndicatorTooltip) {
       this._ctx.font = createFont(
         indicatorTextSize,
         technicalIndicatorTooltipOptions.text.weight,
         technicalIndicatorTooltipOptions.text.family
       )
       indicatorLabelValues.forEach(({ labels, values }) => {
         labels.forEach((label, i) => {
           const v = values[i].value || technicalIndicatorTooltipOptions.defaultValue
           const text = `${label}: ${v}`
           const labelWidth = calcTextWidth(this._ctx, text) + indicatorTextMarginLeft + indicatorTextMarginRight
           maxLabelWidth = Math.max(maxLabelWidth, labelWidth)
         })
         rectHeight += ((indicatorTextMarginTop + indicatorTextMarginBottom + indicatorTextSize) * labels.length)
       })
     }
     rectWidth += maxLabelWidth
     if (rectWidth === 0 || rectHeight === 0) {
       return
     }
     rectWidth += (rectBorderSize * 2 + rectPaddingLeft + rectPaddingRight)
     rectHeight += (rectBorderSize * 2 + rectPaddingTop + rectPaddingBottom)
     const centerX = this._width / 2
     let rectX
     if (x < centerX) {
       rectX = this._width - rectRight - rectWidth
     } else {
       rectX = rectLeft
     }
     const rectY = rectOptions.offsetTop
     const radius = rectOptions.borderRadius
     renderFillRoundRect(this._ctx, rectOptions.fillColor, rectX, rectY, rectWidth, rectHeight, radius)
     renderStrokeRoundRect(this._ctx, rectOptions.borderColor, rectBorderSize, rectX, rectY, rectWidth, rectHeight, radius)
     const baseLabelX = rectX + rectBorderSize + rectPaddingLeft + baseTextMarginLeft
     let labelY = rectY + rectBorderSize + rectPaddingTop
     if (isDrawCandleTooltip) {
       // 开始渲染基础数据文字
       this._ctx.font = createFont(
         baseTextSize,
         candleTooltipOptions.text.weight,
         candleTooltipOptions.text.family
       )
       baseLabels.forEach((label, i) => {
         labelY += baseTextMarginTop
         this._ctx.textAlign = 'left'
         renderText(this._ctx, baseTextColor, baseLabelX, labelY, `${label}: `)
 
         const value = baseValues[i]
         let text
         let color
         if (isObject(value)) {
           color = value.color || baseTextColor
           text = value.value || candleTooltipOptions.defaultValue
         } else {
           color = baseTextColor
           text = value || candleTooltipOptions.defaultValue
         }
         this._ctx.textAlign = 'right'
         renderText(
           this._ctx,
           color,
           rectX + rectWidth - rectBorderSize - baseTextMarginRight - rectPaddingRight,
           labelY,
           text
         )
         labelY += (baseTextSize + baseTextMarginBottom)
       })
     }
     if (isDrawTechnicalIndicatorTooltip) {
       // 开始渲染指标数据文字
       const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
       const colors = technicalIndicatorOptions.line.colors
       const indicatorLabelX = rectX + rectBorderSize + rectPaddingLeft + indicatorTextMarginLeft
       const colorSize = colors.length
       this._ctx.font = createFont(
         indicatorTextSize,
         technicalIndicatorTooltipOptions.text.weight,
         technicalIndicatorTooltipOptions.text.family
       )
 
       indicatorLabelValues.forEach(({ labels, values }) => {
         labels.forEach((label, i) => {
           labelY += indicatorTextMarginTop
           this._ctx.textAlign = 'left'
           this._ctx.fillStyle = colors[i % colorSize] || technicalIndicatorOptions.text.color
           this._ctx.fillText(`${label.toUpperCase()}: `, indicatorLabelX, labelY)
 
           this._ctx.textAlign = 'right'
           this._ctx.fillText(
             values[i].value || technicalIndicatorTooltipOptions.defaultValue,
             rectX + rectWidth - rectBorderSize - indicatorTextMarginRight - rectPaddingRight,
             labelY
           )
           labelY += (indicatorTextSize + indicatorTextMarginBottom)
         })
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
   _getCandleTooltipData (kLineData, candleOptions) {
     const baseValues = candleOptions.tooltip.values
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
 
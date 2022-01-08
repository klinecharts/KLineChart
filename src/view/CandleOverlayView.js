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

import TechnicalIndicatorOverlayView from './TechnicalIndicatorOverlayView'
import { isFunction, isObject, isArray, isValid } from '../utils/typeChecks'
import { formatBigNumber, formatDate, formatPrecision, formatValue } from '../utils/format'
import { calcTextWidth, createFont } from '../utils/canvas'
import { TooltipShowType } from '../options/styleOptions'
import { getTechnicalIndicatorTooltipData } from '../store/TechnicalIndicatorStore'
import { TechnicalIndicatorPlotType } from '../component/technicalindicator/TechnicalIndicator'
import { renderFillRoundRect, renderStrokeRoundRect } from '../renderer/rect'
import { renderText } from '../renderer/text'

export default class CandleOverlayView extends TechnicalIndicatorOverlayView {
  _drawTooltip (crosshair, techs) {
    const styleOptions = this._chartStore.styleOptions()
    const candleOptions = styleOptions.candle
    const candleTooltipOptions = candleOptions.tooltip
    const techOptions = styleOptions.technicalIndicator
    const techTooltipOptions = techOptions.tooltip
    const isDrawCandleTooltip = this._shouldDrawTooltip(crosshair, candleTooltipOptions)
    const isDrawTechTooltip = this._shouldDrawTooltip(crosshair, techTooltipOptions)
    if (
      candleTooltipOptions.showType === TooltipShowType.RECT &&
      techTooltipOptions.showType === TooltipShowType.RECT
    ) {
      this._drawCandleTooltipWithRect(
        crosshair,
        techs,
        candleOptions,
        isDrawCandleTooltip,
        techOptions,
        isDrawTechTooltip
      )
    } else {
      if (candleTooltipOptions.showType === TooltipShowType.STANDARD) {
        this._drawCandleTooltipWithStandard(crosshair.kLineData, candleOptions, isDrawCandleTooltip)
        if (techTooltipOptions.showType === TooltipShowType.STANDARD) {
          const offsetTop = isDrawCandleTooltip ? candleTooltipOptions.text.size + candleTooltipOptions.text.marginTop : 0
          this._drawBatchTechToolTip(
            crosshair,
            techs,
            techOptions,
            offsetTop,
            isDrawTechTooltip
          )
        } else {
          this._drawCandleTooltipWithRect(
            crosshair,
            techs,
            candleOptions,
            false,
            techOptions,
            isDrawTechTooltip
          )
        }
      } else {
        this._drawCandleTooltipWithRect(
          crosshair,
          techs,
          candleOptions,
          isDrawCandleTooltip,
          techOptions,
          false
        )
        this._drawBatchTechToolTip(
          crosshair,
          techs,
          techOptions,
          0,
          isDrawTechTooltip
        )
      }
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
      const labelWidth = calcTextWidth(this._ctx, label)
      renderText(this._ctx, textColor, labelX, labelY, label)
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
   * @param crosshair
   * @param techs
   * @param candleOptions
   * @param isDrawCandleTooltip
   * @param techOptions
   * @param isDrawTechTooltip
   * @private
   */
  _drawCandleTooltipWithRect (
    crosshair, techs, candleOptions, isDrawCandleTooltip,
    techOptions, isDrawTechTooltip
  ) {
    if (!isDrawCandleTooltip && !isDrawTechTooltip) {
      return
    }
    const candleTooltipOptions = candleOptions.tooltip
    const baseLabels = candleTooltipOptions.labels
    const baseValues = this._getCandleTooltipData(crosshair.kLineData, candleOptions)
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
        const text = `${label}${v}`
        const labelWidth = calcTextWidth(this._ctx, text) + baseTextMarginLeft + baseTextMarginRight
        maxLabelWidth = Math.max(maxLabelWidth, labelWidth)
      })
      rectHeight += ((baseTextMarginBottom + baseTextMarginTop + baseTextSize) * baseLabels.length)
    }

    const techTooltipOptions = techOptions.tooltip

    const techTooltipTextMarginLeft = techTooltipOptions.text.marginLeft
    const techTooltipTextMarginRight = techTooltipOptions.text.marginRight
    const techTooltipTextMarginTop = techTooltipOptions.text.marginTop
    const techTooltipTextMarginBottom = techTooltipOptions.text.marginBottom
    const techTooltipTextSize = techTooltipOptions.text.size

    const techTooltipDataList = []
    const dataList = this._chartStore.dataList()
    techs.forEach(tech => {
      const result = tech.result
      techTooltipDataList.push({
        name: tech.name,
        tooltipData: getTechnicalIndicatorTooltipData(result[crosshair.dataIndex], tech),
        cbData: {
          prev: { kLineData: dataList[crosshair.dataIndex - 1], technicalIndicatorData: result[crosshair.dataIndex - 1] },
          current: { kLineData: dataList[crosshair.dataIndex], technicalIndicatorData: result[crosshair.dataIndex] },
          next: { kLineData: dataList[crosshair.dataIndex + 1], technicalIndicatorData: result[crosshair.dataIndex + 1] }
        }
      })
    })
    if (isDrawTechTooltip) {
      this._ctx.font = createFont(
        techTooltipTextSize,
        techTooltipOptions.text.weight,
        techTooltipOptions.text.family
      )
      techTooltipDataList.forEach(({ tooltipData }) => {
        tooltipData.values.forEach(({ title, value }) => {
          if (isValid(title)) {
            const v = value || techTooltipOptions.defaultValue
            const text = `${title}${v}`
            const labelWidth = calcTextWidth(this._ctx, text) + techTooltipTextMarginLeft + techTooltipTextMarginRight
            maxLabelWidth = Math.max(maxLabelWidth, labelWidth)
            rectHeight += (techTooltipTextMarginTop + techTooltipTextMarginBottom + techTooltipTextSize)
          }
        })
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
    if (crosshair.realX < centerX) {
      rectX = this._width - rectRight - rectWidth
    } else {
      rectX = rectLeft
    }
    const rectY = rectOptions.offsetTop
    const radius = rectOptions.borderRadius
    renderFillRoundRect(this._ctx, rectOptions.backgroundColor, rectX, rectY, rectWidth, rectHeight, radius)
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
        renderText(this._ctx, baseTextColor, baseLabelX, labelY, label)

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
    if (isDrawTechTooltip) {
      // 开始渲染指标数据文字
      const techOptions = this._chartStore.styleOptions().technicalIndicator
      const indicatorLabelX = rectX + rectBorderSize + rectPaddingLeft + techTooltipTextMarginLeft
      this._ctx.font = createFont(
        techTooltipTextSize,
        techTooltipOptions.text.weight,
        techTooltipOptions.text.family
      )
      techTooltipDataList.forEach(({ name, tooltipData, cbData }) => {
        const tech = techs.get(name)
        const styles = tech.styles || techOptions
        const colors = styles.line.colors
        const colorSize = colors.length
        const plots = tech.plots
        let lineCount = 0
        let valueColor
        plots.forEach((plot, i) => {
          switch (plot.type) {
            case TechnicalIndicatorPlotType.CIRCLE: {
              valueColor = (plot.color && plot.color(cbData, styles)) || styles.circle.noChangeColor
              break
            }
            case TechnicalIndicatorPlotType.BAR: {
              valueColor = (plot.color && plot.color(cbData, styles)) || styles.bar.noChangeColor
              break
            }
            case TechnicalIndicatorPlotType.LINE: {
              valueColor = colors[lineCount % colorSize] || styles.text.color
              lineCount++
              break
            }
            default: { break }
          }
          const value = tooltipData.values[i]
          if (isValid(value.title)) {
            labelY += techTooltipTextMarginTop
            this._ctx.textAlign = 'left'
            this._ctx.fillStyle = valueColor
            this._ctx.fillText(`${value.title}`, indicatorLabelX, labelY)

            this._ctx.textAlign = 'right'
            this._ctx.fillText(
              value.value || techTooltipOptions.defaultValue,
              rectX + rectWidth - rectBorderSize - techTooltipTextMarginRight - rectPaddingRight,
              labelY
            )
            labelY += (techTooltipTextSize + techTooltipTextMarginBottom)
          }
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
      const pricePrecision = this._chartStore.pricePrecision()
      const volumePrecision = this._chartStore.volumePrecision()
      var labels = candleOptions.tooltip.labels
      const map = {
        时间: 'timestamp',
        开: 'open',
        收: 'close',
        高: 'high',
        低: 'low',
        成交量: 'volume'
      }
      values = labels.map((key) => {
        let value = formatValue(kLineData, map[key])
        switch (key) {
          case '时间':
            value = formatDate(this._chartStore.timeScaleStore().dateTimeFormat(), value, 'YYYY-MM-DD hh:mm')
            break
          case '成交量':
            value = formatBigNumber(formatPrecision(value, volumePrecision))
            break
          default:
            value = formatPrecision(value, pricePrecision)
        }
        return value
      })
    }
    return values
  }
}

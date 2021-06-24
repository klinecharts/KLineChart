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
import { TooltipShowRule, LineStyle } from '../data/options/styleOptions'
import { TechnicalIndicatorPlotType } from '../base/technicalindicator/TechnicalIndicator'
import { isValid } from '../utils/typeChecks'
import { renderHorizontalLine, renderVerticalLine } from '../renderer/line'
import { calcTextWidth, createFont } from '../utils/canvas'
import { getTechnicalIndicatorTooltipData } from '../base/technicalindicator/technicalIndicatorControl'
import { renderText } from '../renderer/text'

export default class TechnicalIndicatorOverlayView extends View {
  constructor (container, chartData, xAxis, yAxis, additionalDataProvider) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._additionalDataProvider = additionalDataProvider
  }

  _draw () {
    this._drawCover()
    const crosshair = this._chartData.crosshair()
    if (crosshair.kLineData) {
      const technicalIndicators = this._additionalDataProvider.technicalIndicators()
      const styleOptions = this._chartData.styleOptions()
      const crosshairOptions = styleOptions.crosshair
      if (crosshair.paneId === this._additionalDataProvider.id()) {
        // 绘制十字光标水平线
        this._drawCrosshairLine(crosshairOptions, 'horizontal', crosshair.y, 0, this._width, renderHorizontalLine)
      }
      if (crosshair.paneId) {
        // 绘制十字光标垂直线
        this._drawCrosshairLine(crosshairOptions, 'vertical', crosshair.realX, 0, this._height, renderVerticalLine)
      }
      this._drawTooltip(crosshair, technicalIndicators)
    }
  }

  /**
   * 绘制覆盖物
   * @private
   */
  _drawCover () {}

  /**
   * 绘制图例
   * @param crosshair
   * @param technicalIndicators
   * @private
   */
  _drawTooltip (crosshair, technicalIndicators) {
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    this._drawBatchTechnicalIndicatorToolTip(
      crosshair,
      technicalIndicators,
      technicalIndicatorOptions,
      0,
      this._shouldDrawTooltip(crosshair, technicalIndicatorOptions.tooltip)
    )
  }

  /**
   * 绘制十字光标线
   * @param crosshairOptions
   * @param optionsKey
   * @param fixedCoordinate
   * @param startCoordinate
   * @param endCoordinate
   * @param drawLine
   * @private
   */
  _drawCrosshairLine (crosshairOptions, optionsKey, fixedCoordinate, startCoordinate, endCoordinate, drawLine) {
    const crosshairDirectionOptions = crosshairOptions[optionsKey]
    const crosshairLineOptions = crosshairDirectionOptions.line
    if (!crosshairOptions.show || !crosshairDirectionOptions.show || !crosshairLineOptions.show) {
      return
    }
    this._ctx.save()
    this._ctx.lineWidth = crosshairLineOptions.size
    this._ctx.strokeStyle = crosshairLineOptions.color

    if (crosshairLineOptions.style === LineStyle.DASH) {
      this._ctx.setLineDash(crosshairLineOptions.dashValue)
    }
    drawLine(this._ctx, fixedCoordinate, startCoordinate, endCoordinate)
    this._ctx.restore()
  }

  /**
   * 批量绘制技术指标提示
   * @param crosshair
   * @param technicalIndicators
   * @param technicalIndicatorOptions
   * @param offsetTop
   * @param isDrawTechnicalIndicatorTooltip
   */
  _drawBatchTechnicalIndicatorToolTip (crosshair, technicalIndicators, technicalIndicatorOptions, offsetTop = 0, isDrawTechnicalIndicatorTooltip) {
    if (!isDrawTechnicalIndicatorTooltip) {
      return
    }
    const technicalIndicatorTooltipOptions = technicalIndicatorOptions.tooltip
    let top = offsetTop
    technicalIndicators.forEach(technicalIndicator => {
      this._drawTechnicalIndicatorTooltip(crosshair, technicalIndicator, technicalIndicatorOptions, top)
      top += (
        technicalIndicatorTooltipOptions.text.marginTop +
        technicalIndicatorTooltipOptions.text.size +
        technicalIndicatorTooltipOptions.text.marginBottom
      )
    })
  }

  /**
   * 绘制指标图例
   * @param crosshair
   * @param technicalIndicator
   * @param technicalIndicatorOptions
   * @param offsetTop
   * @private
   */
  _drawTechnicalIndicatorTooltip (crosshair, technicalIndicator, technicalIndicatorOptions, offsetTop = 0) {
    const technicalIndicatorTooltipOptions = technicalIndicatorOptions.tooltip
    const styles = technicalIndicator.styles || technicalIndicatorOptions
    const technicalIndicatorResult = technicalIndicator.result
    const technicalIndicatorData = technicalIndicatorResult[crosshair.dataIndex]
    const tooltipData = getTechnicalIndicatorTooltipData(technicalIndicatorData, technicalIndicator)
    const colors = styles.line.colors
    const dataList = this._chartData.dataList()
    const cbData = {
      preData: { kLineData: dataList[crosshair.dataIndex - 1], technicalIndicatorData: technicalIndicatorResult[crosshair.dataIndex - 1] },
      currentData: { kLineData: dataList[crosshair.dataIndex], technicalIndicatorData },
      nextData: { kLineData: dataList[crosshair.dataIndex + 1], technicalIndicatorData: technicalIndicatorResult[crosshair.dataIndex + 1] }
    }
    const plots = technicalIndicator.plots
    const technicalIndicatorTooltipTextOptions = technicalIndicatorTooltipOptions.text
    const values = tooltipData.values
    const textMarginLeft = technicalIndicatorTooltipTextOptions.marginLeft
    const textMarginRight = technicalIndicatorTooltipTextOptions.marginRight
    let labelX = 0
    const labelY = technicalIndicatorTooltipTextOptions.marginTop + offsetTop
    const textSize = technicalIndicatorTooltipTextOptions.size
    const textColor = technicalIndicatorTooltipTextOptions.color
    const colorSize = colors.length
    this._ctx.textBaseline = 'top'
    this._ctx.font = createFont(textSize, technicalIndicatorTooltipTextOptions.weight, technicalIndicatorTooltipTextOptions.family)

    if (technicalIndicatorTooltipOptions.showName) {
      const nameText = tooltipData.name
      const nameTextWidth = calcTextWidth(this._ctx, nameText)
      labelX += textMarginLeft
      renderText(this._ctx, textColor, labelX, labelY, nameText)
      labelX += nameTextWidth
      if (!technicalIndicatorTooltipOptions.showParams) {
        labelX += textMarginRight
      }
    }
    if (technicalIndicatorTooltipOptions.showParams) {
      const calcParamText = tooltipData.calcParamText
      const calcParamTextWidth = calcTextWidth(this._ctx, calcParamText)
      if (!technicalIndicatorTooltipOptions.showName) {
        labelX += textMarginLeft
      }
      renderText(this._ctx, textColor, labelX, labelY, calcParamText)
      labelX += (calcParamTextWidth + textMarginRight)
    }
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
          valueColor = colors[lineCount % colorSize] || textColor
          lineCount++
          break
        }
        default: { break }
      }
      const title = values[i].title
      if (isValid(title)) {
        labelX += textMarginLeft
        const text = `${title}${values[i].value || technicalIndicatorTooltipOptions.defaultValue}`
        const textWidth = calcTextWidth(this._ctx, text)
        renderText(this._ctx, valueColor, labelX, labelY, text)
        labelX += (textWidth + textMarginRight)
      }
    })
  }

  /**
   * 是否需要绘制图例
   * @param crosshair
   * @param tooltipOptions
   * @return {boolean|boolean|*}
   */
  _shouldDrawTooltip (crosshair, tooltipOptions) {
    const showRule = tooltipOptions.showRule
    return showRule === TooltipShowRule.ALWAYS ||
      (showRule === TooltipShowRule.FOLLOW_CROSS && (!!crosshair.paneId))
  }
}

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
import { LegendShowRule, LineStyle } from '../data/options/styleOptions'
import { isValid } from '../utils/typeChecks'
import { renderHorizontalLine, renderVerticalLine } from '../renderer/line'
import { calcTextWidth, createFont } from '../utils/canvas'
import { getTechnicalIndicatorInfo } from '../data/technicalindicator/technicalIndicatorControl'
import { renderText } from '../renderer/text'

export default class TechnicalIndicatorCrosshairView extends View {
  constructor (container, chartData, xAxis, yAxis, additionalDataProvider) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._additionalDataProvider = additionalDataProvider
  }

  _draw () {
    const crosshair = this._chartData.crosshair()
    const dataList = this._chartData.dataList()
    const technicalIndicator = this._additionalDataProvider.technicalIndicator()
    const technicalIndicatorResult = technicalIndicator.result
    let realDataPos
    if (isValid(crosshair.x)) {
      realDataPos = this._xAxis.convertFromPixel(crosshair.x)
    } else {
      realDataPos = dataList.length - 1
    }
    let dataPos = realDataPos
    if (dataPos < 0) {
      dataPos = 0
    } else if (dataPos > dataList.length - 1) {
      dataPos = dataList.length - 1
    }
    const kLineData = dataList[dataPos]
    const technicalIndicatorData = technicalIndicatorResult[dataPos]
    if (kLineData) {
      const styleOptions = this._chartData.styleOptions()
      const crosshairOptions = styleOptions.crosshair
      const realDataPosX = this._xAxis.convertToPixel(realDataPos)
      if (crosshair.paneTag === this._additionalDataProvider.tag()) {
        // 绘制十字光标水平线
        this._drawCrosshairLine(crosshairOptions, 'horizontal', crosshair.y, 0, this._width, renderHorizontalLine)
      }
      if (crosshair.paneTag) {
        // 绘制十字光标垂直线
        this._drawCrosshairLine(crosshairOptions, 'vertical', realDataPosX, 0, this._height, renderVerticalLine)
      }
      this._drawLegend(
        crosshair, kLineData, technicalIndicatorData,
        realDataPos, realDataPosX, technicalIndicator,
        realDataPos >= 0 && realDataPos <= dataList.length - 1 && crosshair.paneTag
      )
    }
  }

  /**
   * 绘制图例
   * @param crosshair
   * @param kLineData
   * @param technicalIndicatorData
   * @param realDataPos
   * @param realDataPosX
   * @param technicalIndicator
   * @private
   */
  _drawLegend (
    crosshair, kLineData, technicalIndicatorData,
    realDataPos, realDataPosX, technicalIndicator
  ) {
    this._drawTechnicalIndicatorLegend(
      crosshair, technicalIndicatorData, realDataPos, technicalIndicator
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
   * 绘制指标图例
   * @param crosshair
   * @param technicalIndicatorData
   * @param realDataPos
   * @param technicalIndicator
   * @param offsetTop
   * @private
   */
  _drawTechnicalIndicatorLegend (crosshair, technicalIndicatorData, realDataPos, technicalIndicator, offsetTop = 0) {
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    const technicalIndicatorLegendOptions = technicalIndicatorOptions.legend
    if (this._shouldDrawLegend(crosshair, technicalIndicatorLegendOptions)) {
      const legendData = getTechnicalIndicatorInfo(technicalIndicatorData, technicalIndicator, this._yAxis)
      const colors = technicalIndicatorOptions.line.colors
      const dataList = this._chartData.dataList()
      const cbData = {
        preData: { kLineData: dataList[realDataPos - 1], technicalIndicatorData: technicalIndicator.result[realDataPos - 1] },
        currentData: { kLineData: dataList[realDataPos], technicalIndicatorData: technicalIndicator.result[realDataPos] }
      }
      const plots = technicalIndicator.plots
      const technicalIndicatorLegendTextOptions = technicalIndicatorLegendOptions.text
      const nameText = legendData.name
      const labels = legendData.labels
      const values = legendData.values
      const textMarginLeft = technicalIndicatorLegendTextOptions.marginLeft
      const textMarginRight = technicalIndicatorLegendTextOptions.marginRight
      let labelX = textMarginLeft
      const labelY = technicalIndicatorLegendTextOptions.marginTop + offsetTop
      const textSize = technicalIndicatorLegendTextOptions.size
      const textColor = technicalIndicatorLegendTextOptions.color
      const colorSize = colors.length
      this._ctx.textBaseline = 'top'
      this._ctx.font = createFont(textSize, technicalIndicatorLegendTextOptions.weight, technicalIndicatorLegendTextOptions.family)
      const nameTextWidth = calcTextWidth(this._ctx, nameText)
      renderText(this._ctx, textColor, labelX, labelY, nameText)
      labelX += (textMarginLeft + nameTextWidth)
      let lineCount = 0
      let valueColor
      for (let i = 0; i < labels.length; i++) {
        switch (plots[i].type) {
          case PlotType.CIRCLE: {
            valueColor = (plots[i].color && plots[i].color(cbData, technicalIndicatorOptions)) || technicalIndicatorOptions.circle.noChangeColor
            break
          }
          case PlotType.BAR: {
            valueColor = (plots[i].color && plots[i].color(cbData, technicalIndicatorOptions)) || technicalIndicatorOptions.bar.noChangeColor
            break
          }
          case PlotType.LINE: {
            valueColor = colors[lineCount % colorSize] || textColor
            lineCount++
            break
          }
          default: { break }
        }
        const text = `${labels[i]}: ${values[i].value || 'n/a'}`
        const textWidth = calcTextWidth(this._ctx, text)
        renderText(this._ctx, valueColor, labelX, labelY, text)
        labelX += (textMarginLeft + textMarginRight + textWidth)
      }
    }
  }

  /**
   * 是否需要绘制图例
   * @param crosshair
   * @param legendOptions
   * @return {boolean|boolean|*}
   * @private
   */
  _shouldDrawLegend (crosshair, legendOptions) {
    const showRule = legendOptions.showRule
    return showRule === LegendShowRule.ALWAYS ||
      (showRule === LegendShowRule.FOLLOW_CROSS && crosshair.paneTag)
  }
}

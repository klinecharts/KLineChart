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
import { FloatLayerPromptDisplayRule, LineStyle } from '../data/options/styleOptions'
import { isValid } from '../utils/typeChecks'
import { calcTextWidth, drawHorizontalLine, drawVerticalLine, getFont } from '../utils/canvas'
import { getTechnicalIndicatorInfo } from '../data/technicalindicator/technicalIndicatorControl'

export default class TechnicalIndicatorFloatLayerView extends View {
  constructor (container, chartData, xAxis, yAxis, additionalDataProvider) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._additionalDataProvider = additionalDataProvider
  }

  _draw () {
    const crossHairPoint = this._chartData.crossHairPoint()
    const dataList = this._chartData.dataList()
    const technicalIndicator = this._additionalDataProvider.technicalIndicator()
    const technicalIndicatorResult = technicalIndicator.result
    let dataPos
    if (crossHairPoint) {
      dataPos = this._xAxis.convertFromPixel(crossHairPoint.x)
    } else {
      dataPos = dataList.length - 1
    }
    let kLineData = dataList[dataPos]
    let technicalIndicatorData = technicalIndicatorResult[dataPos]
    if (!kLineData) {
      const to = this._chartData.to()
      if (dataPos > to - 1) {
        kLineData = dataList[to - 1]
        technicalIndicatorData = technicalIndicatorResult[to - 1]
      } else if (dataPos < 0) {
        kLineData = dataList[0]
        technicalIndicatorData = technicalIndicatorResult[0]
      }
    }
    if (kLineData) {
      const x = this._xAxis.convertToPixel(dataPos)
      this._drawCrossHairHorizontalLine()
      this._drawCrossHairVerticalLine(x)
      const displayRule = this._chartData.styleOptions().floatLayer.prompt.displayRule
      if (displayRule === FloatLayerPromptDisplayRule.ALWAYS ||
        (displayRule === FloatLayerPromptDisplayRule.FOLLOW_CROSS && this._chartData.crossHairPaneTag())) {
        this._drawPrompt(kLineData, technicalIndicatorData, technicalIndicator, x)
      }
    }
  }

  /**
   * 绘制提示
   * @param kLineData
   * @param technicalIndicatorData
   * @param technicalIndicator
   * @param x
   * @private
   */
  _drawPrompt (kLineData, technicalIndicatorData, technicalIndicator, x) {
    this._drawTechnicalIndicatorPrompt(technicalIndicatorData, technicalIndicator, x)
  }

  /**
   * 绘制十字光标水平线
   * @private
   */
  _drawCrossHairHorizontalLine () {
    if (this._chartData.crossHairPaneTag() !== this._additionalDataProvider.tag()) {
      return
    }
    const crossHair = this._chartData.styleOptions().floatLayer.crossHair
    const crossHairHorizontal = crossHair.horizontal
    const crossHairHorizontalLine = crossHairHorizontal.line
    if (!crossHair.display || !crossHairHorizontal.display || !crossHairHorizontalLine.display) {
      return
    }
    const crossHairPoint = this._chartData.crossHairPoint()
    if (!crossHairPoint) {
      return
    }
    // 绘制十字光标水平线
    this._ctx.lineWidth = crossHairHorizontalLine.size
    this._ctx.strokeStyle = crossHairHorizontalLine.color
    if (crossHairHorizontalLine.style === LineStyle.DASH) {
      this._ctx.setLineDash(crossHairHorizontalLine.dashValue)
    }
    drawHorizontalLine(this._ctx, crossHairPoint.y, 0, this._width)
    this._ctx.setLineDash([])
  }

  /**
   * 绘制十字光标垂直线
   * @param x
   * @private
   */
  _drawCrossHairVerticalLine (x) {
    if (!this._chartData.crossHairPaneTag()) {
      return
    }
    const crossHair = this._chartData.styleOptions().floatLayer.crossHair
    const crossHairVertical = crossHair.vertical
    const crossHairVerticalLine = crossHairVertical.line
    if (!crossHair.display || !crossHairVertical.display || !crossHairVerticalLine.display) {
      return
    }
    this._ctx.lineWidth = crossHairVerticalLine.size
    this._ctx.strokeStyle = crossHairVerticalLine.color

    if (crossHairVerticalLine.style === LineStyle.DASH) {
      this._ctx.setLineDash(crossHairVerticalLine.dashValue)
    }
    drawVerticalLine(this._ctx, x, 0, this._height)
    this._ctx.setLineDash([])
  }

  /**
   * 绘制指标提示
   * @param technicalIndicatorData
   * @param technicalIndicator
   * @param x
   * @param offsetTop
   * @private
   */
  _drawTechnicalIndicatorPrompt (technicalIndicatorData, technicalIndicator, x, offsetTop = 0) {
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    const data = getTechnicalIndicatorInfo(technicalIndicatorData, technicalIndicator, this._yAxis)
    const colors = technicalIndicatorOptions.line.colors
    this._drawTechnicalIndicatorPromptText(
      technicalIndicator, data, colors, offsetTop
    )
    this._drawTechnicalIndicatorPromptPoint(
      technicalIndicator, data.values, colors, x
    )
  }

  /**
   * 绘制指标提示文字
   * @param technicalIndicator
   * @param data
   * @param colors
   * @param offsetTop
   * @private
   */
  _drawTechnicalIndicatorPromptText (technicalIndicator, data, colors, offsetTop) {
    const plots = technicalIndicator.plots
    const floatLayerPromptTechnicalIndicatorText = this._chartData.styleOptions().floatLayer.prompt.technicalIndicator.text
    const nameText = data.name
    const labels = data.labels
    const values = data.values
    const textMarginLeft = floatLayerPromptTechnicalIndicatorText.marginLeft
    const textMarginRight = floatLayerPromptTechnicalIndicatorText.marginRight
    let labelX = textMarginLeft
    const labelY = floatLayerPromptTechnicalIndicatorText.marginTop + offsetTop
    const textSize = floatLayerPromptTechnicalIndicatorText.size
    const textColor = floatLayerPromptTechnicalIndicatorText.color
    const colorSize = colors.length
    this._ctx.textBaseline = 'top'
    this._ctx.font = getFont(textSize, floatLayerPromptTechnicalIndicatorText.family)
    const nameTextWidth = calcTextWidth(this._ctx, nameText)
    this._ctx.fillStyle = textColor
    this._ctx.fillText(nameText, labelX, labelY)
    labelX += (textMarginLeft + nameTextWidth)
    let lineCount = 0
    for (let i = 0; i < labels.length; i++) {
      if (plots[i].type === 'line') {
        this._ctx.fillStyle = colors[lineCount % colorSize] || textColor
        lineCount++
      } else {
        this._ctx.fillStyle = textColor
      }
      const text = `${labels[i]}: ${values[i].value || 'n/a'}`
      const textWidth = calcTextWidth(this._ctx, text)
      this._ctx.fillText(text, labelX, labelY)
      labelX += (textMarginLeft + textMarginRight + textWidth)
    }
  }

  /**
   * 绘制指标提示点
   * @param technicalIndicator
   * @param values
   * @param colors
   * @param x
   * @private
   */
  _drawTechnicalIndicatorPromptPoint (technicalIndicator, values, colors, x) {
    const floatLayerPromptTechnicalIndicatorPoint = this._chartData.styleOptions().floatLayer.prompt.technicalIndicator.point
    if (!floatLayerPromptTechnicalIndicatorPoint.display) {
      return
    }
    if (!this._chartData.crossHairPaneTag()) {
      return
    }
    const plots = technicalIndicator.plots
    const colorSize = colors.length
    const valueSize = values.length
    const radius = floatLayerPromptTechnicalIndicatorPoint.radius
    let lineCount = 0
    for (let i = 0; i < valueSize; i++) {
      const value = values[i].value
      if (plots[i].type === 'line') {
        if (isValid(value)) {
          this._ctx.fillStyle = colors[lineCount % colorSize]
          this._ctx.beginPath()
          this._ctx.arc(x, values[i].y, radius, 0, Math.PI * 2)
          this._ctx.closePath()
          this._ctx.fill()
        }
        lineCount++
      }
    }
  }
}

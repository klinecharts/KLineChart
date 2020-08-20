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
    const crossHair = this._chartData.crossHair()
    const dataList = this._chartData.dataList()
    const technicalIndicator = this._additionalDataProvider.technicalIndicator()
    const technicalIndicatorResult = technicalIndicator.result
    let realDataPos
    if (isValid(crossHair.x)) {
      realDataPos = this._xAxis.convertFromPixel(crossHair.x)
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
      const realDataPosX = this._xAxis.convertToPixel(realDataPos)
      this._drawCrossHairHorizontalLine(crossHair)
      this._drawCrossHairVerticalLine(crossHair, realDataPosX)
      const displayRule = this._chartData.styleOptions().floatLayer.prompt.displayRule
      if (displayRule === FloatLayerPromptDisplayRule.ALWAYS ||
        (displayRule === FloatLayerPromptDisplayRule.FOLLOW_CROSS && crossHair.paneTag)) {
        this._drawPrompt(
          kLineData, technicalIndicatorData,
          realDataPos, realDataPosX, technicalIndicator,
          realDataPos >= 0 && realDataPos <= dataList.length - 1 && crossHair.paneTag
        )
      }
    }
  }

  /**
   * 绘制提示
   * @param crossHair
   * @param kLineData
   * @param technicalIndicatorData
   * @param realDataPos
   * @param realDataPosX
   * @param technicalIndicator
   * @param isDrawValueIndicator 是否需要绘制指示点
   * @private
   */
  _drawPrompt (
    kLineData, technicalIndicatorData,
    realDataPos, realDataPosX, technicalIndicator,
    isDrawValueIndicator
  ) {
    this._drawTechnicalIndicatorPrompt(
      technicalIndicatorData, realDataPos, realDataPosX,
      technicalIndicator, isDrawValueIndicator
    )
  }

  /**
   * 绘制十字光标水平线
   * @param crossHair
   * @private
   */
  _drawCrossHairHorizontalLine (crossHair) {
    if (crossHair.paneTag !== this._additionalDataProvider.tag()) {
      return
    }
    const crossHairOptions = this._chartData.styleOptions().floatLayer.crossHair
    const crossHairHorizontal = crossHairOptions.horizontal
    const crossHairHorizontalLine = crossHairHorizontal.line
    if (!crossHairOptions.display || !crossHairHorizontal.display || !crossHairHorizontalLine.display) {
      return
    }
    this._ctx.save()
    // 绘制十字光标水平线
    this._ctx.lineWidth = crossHairHorizontalLine.size
    this._ctx.strokeStyle = crossHairHorizontalLine.color
    if (crossHairHorizontalLine.style === LineStyle.DASH) {
      this._ctx.setLineDash(crossHairHorizontalLine.dashValue)
    }
    drawHorizontalLine(this._ctx, crossHair.y, 0, this._width)
    this._ctx.restore()
  }

  /**
   * 绘制十字光标垂直线
   * @param crossHair
   * @param realDataPosX
   * @private
   */
  _drawCrossHairVerticalLine (crossHair, realDataPosX) {
    if (!crossHair.paneTag) {
      return
    }
    const crossHairOptions = this._chartData.styleOptions().floatLayer.crossHair
    const crossHairVertical = crossHairOptions.vertical
    const crossHairVerticalLine = crossHairVertical.line
    if (!crossHairOptions.display || !crossHairVertical.display || !crossHairVerticalLine.display) {
      return
    }
    this._ctx.save()
    this._ctx.lineWidth = crossHairVerticalLine.size
    this._ctx.strokeStyle = crossHairVerticalLine.color

    if (crossHairVerticalLine.style === LineStyle.DASH) {
      this._ctx.setLineDash(crossHairVerticalLine.dashValue)
    }
    drawVerticalLine(this._ctx, realDataPosX, 0, this._height)
    this._ctx.restore()
  }

  /**
   * 绘制指标提示
   * @param technicalIndicatorData
   * @param realDataPos
   * @param realDataPosX
   * @param technicalIndicator
   * @param isDrawValueIndicator
   * @param offsetTop
   * @private
   */
  _drawTechnicalIndicatorPrompt (
    technicalIndicatorData, realDataPos, realDataPosX,
    technicalIndicator, isDrawValueIndicator,
    offsetTop = 0
  ) {
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    const data = getTechnicalIndicatorInfo(technicalIndicatorData, technicalIndicator, this._yAxis)
    const colors = technicalIndicatorOptions.line.colors
    this._drawTechnicalIndicatorPromptText(
      realDataPos, technicalIndicator, data, colors, offsetTop
    )
    if (isDrawValueIndicator) {
      this._drawTechnicalIndicatorPromptPoint(
        realDataPos, realDataPosX, technicalIndicator, data.values, colors
      )
    }
  }

  /**
   * 绘制指标提示文字
   * @param dataPos
   * @param technicalIndicator
   * @param data
   * @param colors
   * @param offsetTop
   * @private
   */
  _drawTechnicalIndicatorPromptText (dataPos, technicalIndicator, data, colors, offsetTop) {
    const dataList = this._chartData.dataList()
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    const cbData = {
      preData: { kLineData: dataList[dataPos - 1], technicalIndicatorData: technicalIndicator.result[dataPos - 1] },
      currentData: { kLineData: dataList[dataPos], technicalIndicatorData: technicalIndicator.result[dataPos] }
    }
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
    this._ctx.font = getFont(textSize, floatLayerPromptTechnicalIndicatorText.weight, floatLayerPromptTechnicalIndicatorText.family)
    const nameTextWidth = calcTextWidth(this._ctx, nameText)
    this._ctx.fillStyle = textColor
    this._ctx.fillText(nameText, labelX, labelY)
    labelX += (textMarginLeft + nameTextWidth)
    let lineCount = 0
    for (let i = 0; i < labels.length; i++) {
      let showTipText = true
      switch (plots[i].type) {
        case PlotType.CIRCLE: {
          this._ctx.fillStyle = (plots[i].color && plots[i].color(cbData, technicalIndicatorOptions)) || technicalIndicatorOptions.circle.noChangeColor
          break
        }
        case PlotType.BAR: {
          this._ctx.fillStyle = (plots[i].color && plots[i].color(cbData, technicalIndicatorOptions)) || technicalIndicatorOptions.bar.noChangeColor
          break
        }
        case PlotType.LINE: {
          this._ctx.fillStyle = colors[lineCount % colorSize] || textColor
          lineCount++
          break
        }
        case PlotType.CUSTOM: {
          showTipText = !!plots[i].showTipText
          this._ctx.fillStyle = (plots[i].color && plots[i].color(cbData, technicalIndicatorOptions)) || floatLayerPromptTechnicalIndicatorText.color
          break
        }
        default: { break }
      }
      if (showTipText) {
        const text = `${labels[i]}: ${values[i].value || 'n/a'}`
        const textWidth = calcTextWidth(this._ctx, text)
        this._ctx.fillText(text, labelX, labelY)
        labelX += (textMarginLeft + textMarginRight + textWidth)
      }
    }
  }

  /**
   * 绘制指标提示点
   * @param realDataPos
   * @param realDataPosX
   * @param technicalIndicator
   * @param values
   * @param colors
   * @private
   */
  _drawTechnicalIndicatorPromptPoint (realDataPos, realDataPosX, technicalIndicator, values, colors) {
    const floatLayerPromptTechnicalIndicatorPoint = this._chartData.styleOptions().floatLayer.prompt.technicalIndicator.point
    if (!floatLayerPromptTechnicalIndicatorPoint.display) {
      return
    }
    const plots = technicalIndicator.plots
    const colorSize = colors.length
    const valueSize = values.length
    const radius = floatLayerPromptTechnicalIndicatorPoint.radius
    let lineCount = 0
    for (let i = 0; i < valueSize; i++) {
      const value = values[i].value
      if (plots[i].type === PlotType.LINE) {
        if (isValid(value)) {
          this._ctx.fillStyle = colors[lineCount % colorSize]
          this._ctx.beginPath()
          this._ctx.arc(realDataPosX, values[i].y, radius, 0, Math.PI * 2)
          this._ctx.closePath()
          this._ctx.fill()
        }
        lineCount++
      }
    }
  }
}

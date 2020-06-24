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

import { formatBigNumber, formatPrecision } from '../utils/format'

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
    let realDataPos = dataPos
    let kLineData = dataList[dataPos]
    let technicalIndicatorData = technicalIndicatorResult[dataPos]
    if (!kLineData) {
      const to = this._chartData.to()
      if (dataPos > to - 1) {
        kLineData = dataList[to - 1]
        technicalIndicatorData = technicalIndicatorResult[to - 1]
        realDataPos = to - 1
      } else if (dataPos < 0) {
        kLineData = dataList[0]
        technicalIndicatorData = technicalIndicatorResult[0]
        realDataPos = 0
      }
    }
    if (kLineData) {
      const x = this._xAxis.convertToPixel(dataPos)
      this._drawCrossHairHorizontalLine()
      this._drawCrossHairVerticalLine(x)
      const displayRule = this._chartData.styleOptions().floatLayer.prompt.displayRule
      if (displayRule === FloatLayerPromptDisplayRule.ALWAYS ||
        (displayRule === FloatLayerPromptDisplayRule.FOLLOW_CROSS && this._chartData.crossHairPaneTag())) {
        this._drawPrompt(
          realDataPos, kLineData, technicalIndicatorData,
          technicalIndicator, x, dataPos >= 0 && dataPos <= dataList.length - 1
        )
      }
    }
  }

  /**
   * 绘制提示
   * @param dataPos
   * @param kLineData
   * @param technicalIndicatorData
   * @param technicalIndicator
   * @param x
   * @param isDrawValueIndicator 是否需要绘制指示点
   * @private
   */
  _drawPrompt (dataPos, kLineData, technicalIndicatorData, technicalIndicator, x, isDrawValueIndicator) {
    this._drawTechnicalIndicatorPrompt(dataPos, technicalIndicatorData, technicalIndicator, x, isDrawValueIndicator)
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
   * @param dataPos
   * @param technicalIndicatorData
   * @param technicalIndicator
   * @param x
   * @param isDrawValueIndicator
   * @param offsetTop
   * @private
   */
  _drawTechnicalIndicatorPrompt (
    dataPos, technicalIndicatorData,
    technicalIndicator, x, isDrawValueIndicator,
    offsetTop = 0
  ) {
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    const data = getTechnicalIndicatorInfo(technicalIndicatorData, technicalIndicator, this._yAxis)
    const colors = technicalIndicatorOptions.line.colors
    this._drawTechnicalIndicatorPromptText(
      dataPos, technicalIndicator, data, colors, offsetTop
    )
    if (isDrawValueIndicator) {
      this._drawTechnicalIndicatorPromptPoint(
        dataPos, technicalIndicator, data.values, colors, x
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
    this._ctx.font = getFont(textSize, floatLayerPromptTechnicalIndicatorText.family)
    const nameTextWidth = calcTextWidth(this._ctx, nameText)
    this._ctx.fillStyle = textColor
    this._ctx.fillText(nameText, labelX, labelY)
    labelX += (textMarginLeft + nameTextWidth)
    let lineCount = 0
    for (let i = 0; i < labels.length; i++) {
      switch (plots[i].type) {
        case PlotType.CIRCLE: {
          this._ctx.fillStyle = (plots[i].color && plots[i].color(cbData, technicalIndicatorOptions)) || technicalIndicatorOptions.circle.noChangeColor
          break
        }
        case PlotType.BAR: {
          this._ctx.fillStyle = (plots[i].color && plots[i].color(cbData, technicalIndicatorOptions)) || technicalIndicatorOptions.bar.noChangeColor
          break
        }
        case PlotType.OHLC: {
          let value = values[i].value
          if (isValid(value)) {          
          let color;
          if(value.open>value.close){
            color = technicalIndicatorOptions.ohlc.downColor
          }else if(value.open<value.close){
            color = technicalIndicatorOptions.ohlc.upColor
          }else{
            color = technicalIndicatorOptions.ohlc.noChangeColor
          }
          const precision = technicalIndicator.precision
          const isVolumeTechnicalIndicator = technicalIndicator.isVolumeTechnicalIndicator
          for (const k in value) {
            value[k] = formatPrecision(value[k], precision)
            if (isVolumeTechnicalIndicator) {
              value[k] = formatBigNumber(value[k])
            }
          }
          values[i].value = `[ O=${value.open} H=${value.high} L=${value.low} C=${value.close} ]`
          this._ctx.fillStyle = color
        }
          break
        }
        default: {
          this._ctx.fillStyle = colors[lineCount % colorSize] || textColor
          lineCount++
        }
      }
      const text = `${labels[i]}: ${values[i].value || 'n/a'}`
      const textWidth = calcTextWidth(this._ctx, text)
      this._ctx.fillText(text, labelX, labelY)
      labelX += (textMarginLeft + textMarginRight + textWidth)
    }
  }

  /**
   * 绘制指标提示点
   * @param dataPos
   * @param technicalIndicator
   * @param values
   * @param colors
   * @param x
   * @private
   */
  _drawTechnicalIndicatorPromptPoint (dataPos, technicalIndicator, values, colors, x) {
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
      if (plots[i].type === PlotType.LINE) {
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

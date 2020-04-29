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
import { TechnicalIndicatorType, getTechnicalIndicatorDataKeysAndValues } from '../data/options/technicalIndicatorParamOptions'
import { isArray } from '../utils/typeChecks'
import { formatBigNumber, formatPrecision } from '../utils/format'
import { calcTextWidth, drawHorizontalLine, drawVerticalLine, getFont } from '../utils/canvas'

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
    let dataPos
    if (crossHairPoint) {
      dataPos = this._xAxis.convertFromPixel(crossHairPoint.x)
    } else {
      dataPos = dataList.length - 1
    }
    let kLineData = dataList[dataPos]
    if (!kLineData) {
      const to = this._chartData.to()
      if (dataPos > to - 1) {
        kLineData = dataList[to - 1]
      } else if (dataPos < 0) {
        kLineData = dataList[0]
      }
    }
    if (kLineData) {
      const x = this._xAxis.convertToPixel(dataPos)
      this._drawCrossHairHorizontalLine()
      this._drawCrossHairVerticalLine(kLineData, x)
      const displayRule = this._chartData.styleOptions().floatLayer.prompt.displayRule
      if (displayRule === FloatLayerPromptDisplayRule.ALWAYS ||
        (displayRule === FloatLayerPromptDisplayRule.FOLLOW_CROSS && this._chartData.crossHairSeriesTag())) {
        const isDrawTechnicalIndicatorPromptPoint = dataPos > 0 && dataPos < dataList.length
        this._drawPrompt(kLineData, x, isDrawTechnicalIndicatorPromptPoint)
      }
    }
  }

  /**
   * 绘制提示
   * @param kLineData
   * @param x
   * @param isDrawTechnicalIndicatorPromptPoint
   * @private
   */
  _drawPrompt (kLineData, x, isDrawTechnicalIndicatorPromptPoint) {
    this._drawTechnicalIndicatorPrompt(kLineData, x, isDrawTechnicalIndicatorPromptPoint)
  }

  /**
   * 绘制十字光标水平线
   * @private
   */
  _drawCrossHairHorizontalLine () {
    if (this._chartData.crossHairSeriesTag() !== this._additionalDataProvider.tag()) {
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
   * @param kLineData
   * @param x
   * @private
   */
  _drawCrossHairVerticalLine (kLineData, x) {
    if (!this._chartData.crossHairSeriesTag()) {
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
   * @param kLineData
   * @param x
   * @param isDrawTechnicalIndicatorPromptPoint
   * @param offsetTop
   * @private
   */
  _drawTechnicalIndicatorPrompt (kLineData, x, isDrawTechnicalIndicatorPromptPoint, offsetTop = 0) {
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    const data = this._getTechnicalIndicatorPromptData(kLineData)
    const colors = technicalIndicatorOptions.line.colors
    this._drawTechnicalIndicatorPromptText(
      data, colors, offsetTop
    )
    this._drawTechnicalIndicatorPromptPoint(
      data.values, colors, x, isDrawTechnicalIndicatorPromptPoint
    )
  }

  /**
   * 绘制指标提示文字
   * @param data
   * @param colors
   * @param offsetTop
   * @private
   */
  _drawTechnicalIndicatorPromptText (data, colors, offsetTop) {
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
    const isVol = this._additionalDataProvider.technicalIndicatorType() === TechnicalIndicatorType.VOL
    for (let i = 0; i < labels.length; i++) {
      const text = `${labels[i].toUpperCase()}: ${(isVol ? formatBigNumber(values[i]) : values[i]) || '--'}`
      const textWidth = calcTextWidth(this._ctx, text)
      this._ctx.fillStyle = colors[i % colorSize] || textColor
      this._ctx.fillText(text, labelX, labelY)
      labelX += (textMarginLeft + textMarginRight + textWidth)
    }
  }

  /**
   * 绘制指标提示点
   * @param values
   * @param colors
   * @param x
   * @param isDrawTechnicalIndicatorPromptPoint
   * @private
   */
  _drawTechnicalIndicatorPromptPoint (values, colors, x, isDrawTechnicalIndicatorPromptPoint) {
    const floatLayerPromptTechnicalIndicatorPoint = this._chartData.styleOptions().floatLayer.prompt.technicalIndicator.point
    if (!floatLayerPromptTechnicalIndicatorPoint.display) {
      return
    }
    const technicalIndicatorType = this._additionalDataProvider.technicalIndicatorType()
    if (!this._chartData.crossHairSeriesTag() ||
      technicalIndicatorType === TechnicalIndicatorType.SAR ||
      !isDrawTechnicalIndicatorPromptPoint
    ) {
      return
    }
    const colorSize = colors.length
    const valueSize = technicalIndicatorType === TechnicalIndicatorType.MACD || technicalIndicatorType === TechnicalIndicatorType.VOL ? values.length - 1 : values.length
    const radius = floatLayerPromptTechnicalIndicatorPoint.radius
    for (let i = 0; i < valueSize; i++) {
      const value = values[i]
      if (value || value === 0) {
        const y = this._yAxis.convertToPixel(value)
        this._ctx.fillStyle = colors[i % colorSize]
        this._ctx.beginPath()
        this._ctx.arc(x, y, radius, 0, Math.PI * 2)
        this._ctx.closePath()
        this._ctx.fill()
      }
    }
  }

  /**
   * 获取需要绘制的指标提示数据
   * @param kLineData
   * @returns {{values: Array, labels: Array}}
   */
  _getTechnicalIndicatorPromptData (kLineData) {
    const technicalIndicatorParamOptions = this._chartData.technicalIndicatorParamOptions()
    const technicalIndicatorType = this._additionalDataProvider.technicalIndicatorType()
    const keysAndValues = getTechnicalIndicatorDataKeysAndValues(kLineData, technicalIndicatorType, technicalIndicatorParamOptions)
    const params = this._chartData.technicalIndicatorParamOptions()[technicalIndicatorType] || []
    const labels = keysAndValues.keys
    const values = keysAndValues.values
    let name = ''
    if (labels.length > 0) {
      name = `${technicalIndicatorType}`
      if (params && isArray(params) && params.length > 0) {
        name = `${name}(${params.join(',')})`
      }
      const decimal = this._chartData.precisionOptions()[technicalIndicatorType]
      values.forEach((value, index) => {
        values[index] = formatPrecision(value, decimal)
      })
    }
    return { labels, values, name }
  }
}

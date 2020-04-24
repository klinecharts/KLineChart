/**
 * Copyright (c) 2019 lihu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import View from './View'

import { formatDate } from '../utils/format'
import { calcTextWidth, getFont } from '../utils/canvas'

export default class XAxisFloatLayerView extends View {
  constructor (container, chartData, xAxis) {
    super(container, chartData)
    this._xAxis = xAxis
  }

  _draw () {
    this._drawCrossHairLabel()
  }

  _drawCrossHairLabel () {
    if (!this._chartData.crossHairSeriesTag()) {
      return
    }
    const crossHair = this._chartData.styleOptions().floatLayer.crossHair
    const crossHairVertical = crossHair.vertical
    const crossHairVerticalText = crossHairVertical.text
    if (!crossHair.display || !crossHairVertical.display || !crossHairVerticalText.display) {
      return
    }
    const dataList = this._chartData.dataList()
    const crossHairPoint = this._chartData.crossHairPoint()
    let dataPos
    if (crossHairPoint) {
      dataPos = this._xAxis.convertFromPixel(crossHairPoint.x)
    } else {
      dataPos = dataList.length - 1
    }
    const kLineData = dataList[dataPos]
    if (!kLineData) {
      return
    }
    const x = this._xAxis.convertToPixel(dataPos)
    const timestamp = kLineData.timestamp
    const text = formatDate(timestamp, 'YYYY-MM-DD hh:mm', this._chartData.timezone())

    const textSize = crossHairVerticalText.size
    this._ctx.font = getFont(textSize, crossHairVerticalText.family)
    const labelWidth = calcTextWidth(this._ctx, text)
    let xAxisLabelX = x - labelWidth / 2

    const paddingLeft = crossHairVerticalText.paddingLeft
    const paddingRight = crossHairVerticalText.paddingRight
    const paddingTop = crossHairVerticalText.paddingTop
    const paddingBottom = crossHairVerticalText.paddingBottom
    const borderSize = crossHairVerticalText.borderSize

    // 保证整个x轴上的提示文字总是完全显示
    if (xAxisLabelX < paddingLeft + borderSize) {
      xAxisLabelX = paddingLeft + borderSize
    } else if (xAxisLabelX > this._width - labelWidth - borderSize - paddingRight) {
      xAxisLabelX = this._width - labelWidth - borderSize - paddingRight
    }

    const rectLeft = xAxisLabelX - borderSize - paddingLeft
    const rectTop = 0
    const rectRight = xAxisLabelX + labelWidth + borderSize + paddingRight
    const rectBottom = rectTop + textSize + borderSize * 2 + paddingTop + paddingBottom
    this._ctx.fillStyle = crossHairVerticalText.backgroundColor
    this._ctx.fillRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)

    this._ctx.lineWidth = borderSize
    this._ctx.strokeStyle = crossHairVerticalText.borderColor
    this._ctx.strokeRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)

    // 绘制轴上的提示文字
    this._ctx.textBaseline = 'top'

    this._ctx.fillStyle = crossHairVerticalText.color
    this._ctx.fillText(
      text, xAxisLabelX, borderSize + paddingTop
    )
  }
}

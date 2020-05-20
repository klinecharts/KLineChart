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
    if (!this._chartData.crossHairPaneTag()) {
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

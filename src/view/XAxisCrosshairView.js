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
import { calcTextWidth, createFont } from '../utils/canvas'
import { isValid } from '../utils/typeChecks'
import { renderStrokeFillRect } from '../renderer/rect'
import { renderText } from '../renderer/text'

export default class XAxisCrosshairView extends View {
  constructor (container, chartData, xAxis) {
    super(container, chartData)
    this._xAxis = xAxis
  }

  _draw () {
    this._drawCrosshairLabel()
  }

  _drawCrosshairLabel () {
    const crosshair = this._chartData.crosshair()
    if (!crosshair.paneId) {
      return
    }
    const crosshairOptions = this._chartData.styleOptions().crosshair
    const crosshairVerticalOptions = crosshairOptions.vertical
    const crosshairVerticalTextOptions = crosshairVerticalOptions.text
    if (!crosshairOptions.show || !crosshairVerticalOptions.show || !crosshairVerticalTextOptions.show) {
      return
    }
    const dataList = this._chartData.dataList()
    let dataPos
    if (isValid(crosshair.x)) {
      dataPos = this._xAxis.convertFromPixel(crosshair.x)
    } else {
      dataPos = dataList.length - 1
    }
    const kLineData = dataList[dataPos]
    if (!kLineData) {
      return
    }
    const x = this._xAxis.convertToPixel(dataPos)
    const timestamp = kLineData.timestamp
    const text = formatDate(this._chartData.dateTimeFormat(), timestamp, 'YYYY-MM-DD hh:mm')

    const textSize = crosshairVerticalTextOptions.size
    this._ctx.font = createFont(textSize, crosshairVerticalTextOptions.weight, crosshairVerticalTextOptions.family)
    const labelWidth = calcTextWidth(this._ctx, text)
    let labelX = x - labelWidth / 2

    const paddingLeft = crosshairVerticalTextOptions.paddingLeft
    const paddingRight = crosshairVerticalTextOptions.paddingRight
    const paddingTop = crosshairVerticalTextOptions.paddingTop
    const paddingBottom = crosshairVerticalTextOptions.paddingBottom
    const borderSize = crosshairVerticalTextOptions.borderSize

    // 保证整个x轴上的提示文字总是完全显示
    if (labelX < paddingLeft + borderSize) {
      labelX = paddingLeft + borderSize
    } else if (labelX > this._width - labelWidth - borderSize - paddingRight) {
      labelX = this._width - labelWidth - borderSize - paddingRight
    }

    const rectX = labelX - borderSize - paddingLeft
    const rectWidth = labelWidth + borderSize * 2 + paddingRight + paddingLeft
    const rectHeight = textSize + borderSize * 2 + paddingTop + paddingBottom

    renderStrokeFillRect(
      this._ctx, crosshairVerticalTextOptions.backgroundColor,
      crosshairVerticalTextOptions.borderColor, borderSize,
      rectX, 0, rectWidth, rectHeight
    )
    // 绘制轴上的提示文字
    this._ctx.textBaseline = 'top'
    renderText(
      this._ctx, crosshairVerticalTextOptions.color,
      labelX, borderSize + paddingTop, text
    )
  }
}

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
import { getTextRectWidth, getTextRectHeight } from '../utils/canvas'
import { renderStrokeFillRoundRect } from '../renderer/rect'
import { renderText } from '../renderer/text'

export default class XAxisOverlayView extends View {
  constructor (container, chartStore, xAxis) {
    super(container, chartStore)
    this._xAxis = xAxis
  }

  _draw () {
    this._drawCrosshairLabel()
  }

  _drawCrosshairLabel () {
    const crosshair = this._chartStore.crosshairStore().get()
    if (!crosshair.paneId) {
      return
    }
    const crosshairOptions = this._chartStore.styleOptions().crosshair
    const crosshairVerticalOptions = crosshairOptions.vertical
    const crosshairVerticalTextOptions = crosshairVerticalOptions.text
    if (
      !crosshairOptions.show ||
      !crosshairVerticalOptions.show ||
      !crosshairVerticalTextOptions.show ||
      crosshair.dataIndex !== crosshair.realDataIndex
    ) {
      return
    }

    const timestamp = crosshair.kLineData.timestamp
    const text = formatDate(this._chartStore.timeScaleStore().dateTimeFormat(), timestamp, 'YYYY-MM-DD hh:mm')

    const paddingLeft = crosshairVerticalTextOptions.paddingLeft
    const paddingRight = crosshairVerticalTextOptions.paddingRight
    const paddingTop = crosshairVerticalTextOptions.paddingTop
    const borderSize = crosshairVerticalTextOptions.borderSize

    const rectWidth = getTextRectWidth(this._ctx, text, crosshairVerticalTextOptions)
    const rectHeight = getTextRectHeight(crosshairVerticalTextOptions)
    const labelWidth = rectWidth - borderSize * 2 - paddingLeft - paddingRight

    let labelX = crosshair.realX - labelWidth / 2

    // 保证整个x轴上的提示文字总是完全显示
    if (labelX < paddingLeft + borderSize) {
      labelX = paddingLeft + borderSize
    } else if (labelX > this._width - labelWidth - borderSize - paddingRight) {
      labelX = this._width - labelWidth - borderSize - paddingRight
    }

    const rectX = labelX - borderSize - paddingLeft

    renderStrokeFillRoundRect(
      this._ctx,
      crosshairVerticalTextOptions.backgroundColor,
      crosshairVerticalTextOptions.borderColor,
      borderSize,
      rectX,
      0,
      rectWidth,
      rectHeight,
      crosshairVerticalTextOptions.borderRadius
    )
    // 绘制轴上的提示文字
    this._ctx.textBaseline = 'top'
    renderText(
      this._ctx, crosshairVerticalTextOptions.color,
      labelX, borderSize + paddingTop, text
    )
  }
}

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
import { getTextRectWidth, getTextRectHeight } from '../utils/canvas'
import { formatBigNumber, formatPrecision } from '../utils/format'
import { YAxisType } from '../options/styleOptions'
import { renderStrokeFillRoundRect } from '../renderer/rect'
import { renderText } from '../renderer/text'

export default class YAxisOverlayView extends View {
  constructor (container, chartStore, yAxis, paneId) {
    super(container, chartStore)
    this._yAxis = yAxis
    this._paneId = paneId
  }

  _draw () {
    this._ctx.textBaseline = 'middle'
    this._drawTag()
    this._drawCrossHairLabel()
  }

  /**
   * 绘制标签
   * @private
   */
  _drawTag () {
    const tags = this._chartStore.tagStore().get(this._paneId)
    if (tags) {
      tags.forEach(tag => {
        tag.drawText(this._ctx)
      })
    }
  }

  _drawCrossHairLabel () {
    const crosshair = this._chartStore.crosshairStore().get()
    if (crosshair.paneId !== this._paneId || this._chartStore.dataList().length === 0) {
      return
    }
    const styleOptions = this._chartStore.styleOptions()
    const crosshairOptions = styleOptions.crosshair
    const crosshairHorizontalOptions = crosshairOptions.horizontal
    const crosshairHorizontalTextOptions = crosshairHorizontalOptions.text
    if (!crosshairOptions.show || !crosshairHorizontalOptions.show || !crosshairHorizontalTextOptions.show) {
      return
    }
    const value = this._yAxis.convertFromPixel(crosshair.y)
    let text
    if (this._yAxis.yAxisType() === YAxisType.PERCENTAGE) {
      const fromData = (this._chartStore.visibleDataList()[0] || {}).data || {}
      text = `${((value - fromData.close) / fromData.close * 100).toFixed(2)}%`
    } else {
      const techs = this._chartStore.technicalIndicatorStore().instances(this._paneId)
      let precision = 0
      let shouldFormatBigNumber = false
      if (this._yAxis.isCandleYAxis()) {
        precision = this._chartStore.pricePrecision()
      } else {
        techs.forEach(tech => {
          precision = Math.max(tech.precision, precision)
          if (!shouldFormatBigNumber) {
            shouldFormatBigNumber = tech.shouldFormatBigNumber
          }
        })
      }
      text = formatPrecision(value, precision)
      if (shouldFormatBigNumber) {
        text = formatBigNumber(text)
      }
    }
    let rectStartX
    const borderSize = crosshairHorizontalTextOptions.borderSize

    const rectWidth = getTextRectWidth(this._ctx, text, crosshairHorizontalTextOptions)
    const rectHeight = getTextRectHeight(crosshairHorizontalTextOptions)
    if (this._yAxis.isFromYAxisZero()) {
      rectStartX = 0
    } else {
      rectStartX = this._width - rectWidth
    }

    const rectY = crosshair.y - borderSize - crosshairHorizontalTextOptions.paddingTop - crosshairHorizontalTextOptions.size / 2
    // 绘制y轴文字外的边框
    renderStrokeFillRoundRect(
      this._ctx,
      crosshairHorizontalTextOptions.backgroundColor,
      crosshairHorizontalTextOptions.borderColor,
      borderSize,
      rectStartX,
      rectY,
      rectWidth,
      rectHeight,
      crosshairHorizontalTextOptions.borderRadius
    )
    renderText(
      this._ctx,
      crosshairHorizontalTextOptions.color,
      rectStartX + borderSize + crosshairHorizontalTextOptions.paddingLeft,
      crosshair.y,
      text
    )
  }
}

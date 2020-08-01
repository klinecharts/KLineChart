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
import { calcTextWidth, getFont } from '../utils/canvas'
import { formatBigNumber, formatPrecision } from '../utils/format'
import { YAxisPosition } from '../data/options/styleOptions'

export default class YAxisFloatLayerView extends View {
  constructor (container, chartData, yAxis, additionalDataProvider) {
    super(container, chartData)
    this._yAxis = yAxis
    this._additionalDataProvider = additionalDataProvider
  }

  _draw () {
    this._drawCrossHairLabel()
  }

  _drawCrossHairLabel () {
    const crossHair = this._chartData.crossHair()
    if (crossHair.paneTag !== this._additionalDataProvider.tag() || this._chartData.dataList().length === 0) {
      return
    }
    const crossHairOptions = this._chartData.styleOptions().floatLayer.crossHair
    const crossHairHorizontal = crossHairOptions.horizontal
    const crossHairHorizontalText = crossHairHorizontal.text
    if (!crossHairOptions.display || !crossHairHorizontal.display || !crossHairHorizontalText.display) {
      return
    }
    const value = this._yAxis.convertFromPixel(crossHair.y)
    let yAxisDataLabel
    if (this._yAxis.isPercentageYAxis()) {
      const fromClose = this._chartData.dataList()[this._chartData.from()].close
      yAxisDataLabel = `${((value - fromClose) / fromClose * 100).toFixed(2)}%`
    } else {
      const technicalIndicator = this._additionalDataProvider.technicalIndicator()
      const precision = this._yAxis.isCandleStickYAxis() ? this._chartData.pricePrecision() : technicalIndicator.precision
      yAxisDataLabel = formatPrecision(value, precision)
      if (technicalIndicator.shouldFormatBigNumber) {
        yAxisDataLabel = formatBigNumber(yAxisDataLabel)
      }
    }
    const textSize = crossHairHorizontalText.size
    this._ctx.font = getFont(textSize, crossHairHorizontalText.weight, crossHairHorizontalText.family)
    const yAxisDataLabelWidth = calcTextWidth(this._ctx, yAxisDataLabel)
    let rectStartX

    const paddingLeft = crossHairHorizontalText.paddingLeft
    const paddingRight = crossHairHorizontalText.paddingRight
    const paddingTop = crossHairHorizontalText.paddingTop
    const paddingBottom = crossHairHorizontalText.paddingBottom
    const borderSize = crossHairHorizontalText.borderSize

    const rectWidth = yAxisDataLabelWidth + borderSize * 2 + paddingLeft + paddingRight
    const rectHeight = textSize + borderSize * 2 + paddingTop + paddingBottom
    const yAxisOptions = this._chartData.styleOptions().yAxis
    if (
      (yAxisOptions.position === YAxisPosition.LEFT && yAxisOptions.inside) ||
      (yAxisOptions.position === YAxisPosition.RIGHT && !yAxisOptions.inside)
    ) {
      rectStartX = 0
    } else {
      rectStartX = this._width - rectWidth
    }

    const rectY = crossHair.y - borderSize - paddingTop - textSize / 2
    // 绘制y轴文字外的边框
    this._ctx.fillStyle = crossHairHorizontalText.backgroundColor
    this._ctx.fillRect(rectStartX, rectY, rectWidth, rectHeight)

    this._ctx.lineWidth = borderSize
    this._ctx.strokeStyle = crossHairHorizontalText.borderColor
    this._ctx.strokeRect(rectStartX, rectY, rectWidth, rectHeight)

    this._ctx.textBaseline = 'middle'
    this._ctx.fillStyle = crossHairHorizontalText.color
    this._ctx.fillText(yAxisDataLabel, rectStartX + borderSize + paddingLeft, crossHair.y)
  }
}

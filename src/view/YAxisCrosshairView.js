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
 import { calcTextWidth, createFont } from '../utils/canvas'
 import { formatBigNumber, formatPrecision } from '../utils/format'
 import { YAxisPosition } from '../data/options/styleOptions'
 import { renderFillRectWithCorner } from '../renderer/rect'
 import { renderText } from '../renderer/text'
 
 export default class YAxisCrosshairView extends View {
   constructor (container, chartData, yAxis, additionalDataProvider) {
     super(container, chartData)
     this._yAxis = yAxis
     this._additionalDataProvider = additionalDataProvider
   }
 
   _draw () {
     this._drawCrossHairLabel()
   }
 
   _drawCrossHairLabel () {
     const crosshair = this._chartData.crosshair()
     if (crosshair.paneId !== this._additionalDataProvider.id() || this._chartData.dataList().length === 0) {
       return
     }
     const styleOptions = this._chartData.styleOptions()
     const crosshairOptions = styleOptions.crosshair
     const crosshairHorizontalOptions = crosshairOptions.horizontal
     const crosshairHorizontalTextOptions = crosshairHorizontalOptions.text
     if (!crosshairOptions.show || !crosshairHorizontalOptions.show || !crosshairHorizontalTextOptions.show) {
       return
     }
     const value = this._yAxis.convertFromPixel(crosshair.y)
     let text
     if (this._yAxis.isPercentageYAxis()) {
       const fromClose = this._chartData.dataList()[this._chartData.from()].close
       text = `${((value - fromClose) / fromClose * 100).toFixed(2)}%`
     } else {
       const technicalIndicators = this._additionalDataProvider.technicalIndicators()
       let precision = 0
       let shouldFormatBigNumber = false
       if (this._yAxis.isCandleYAxis()) {
         precision = this._chartData.pricePrecision()
       } else {
         technicalIndicators.forEach(technicalIndicator => {
           precision = Math.max(technicalIndicator.precision, precision)
           if (!shouldFormatBigNumber) {
             shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber
           }
         })
       }
       text = formatPrecision(value, precision)
       if (shouldFormatBigNumber) {
         text = formatBigNumber(text)
       }
     }
     const textSize = crosshairHorizontalTextOptions.size
     this._ctx.font = createFont(textSize, crosshairHorizontalTextOptions.weight, crosshairHorizontalTextOptions.family)
     const yAxisDataLabelWidth = calcTextWidth(this._ctx, text)
     let rectStartX
 
     const cornerWidth = crosshairHorizontalTextOptions.cornerWidth 
     const paddingLeft = crosshairHorizontalTextOptions.paddingLeft
     const paddingRight = crosshairHorizontalTextOptions.paddingRight
     const paddingTop = crosshairHorizontalTextOptions.paddingTop
     const paddingBottom = crosshairHorizontalTextOptions.paddingBottom
     const borderSize = crosshairHorizontalTextOptions.borderSize
 
     const rectWidth = yAxisDataLabelWidth + borderSize * 2 + paddingLeft + paddingRight + cornerWidth
     const rectHeight = textSize + borderSize * 2 + paddingTop + paddingBottom
     const yAxisOptions = styleOptions.yAxis
     if (
       (yAxisOptions.position === YAxisPosition.LEFT && yAxisOptions.inside) ||
       (yAxisOptions.position === YAxisPosition.RIGHT && !yAxisOptions.inside)
     ) {
       rectStartX = 0
     } else {
       rectStartX = this._width - rectWidth
     }
 
     const rectY = crosshair.y - borderSize - paddingTop - textSize / 2
     // 绘制y轴文字外的边框
     renderFillRectWithCorner(
       this._ctx,
       crosshairHorizontalTextOptions.backgroundColor,
       // crosshairHorizontalTextOptions.borderColor,
       // borderSize,
       rectStartX,
       rectY,
       rectWidth,
       rectHeight,
       cornerWidth
     )
 
     this._ctx.textBaseline = 'middle'
     renderText(
       this._ctx,
       crosshairHorizontalTextOptions.color,
       rectStartX + borderSize + paddingLeft + cornerWidth,
       crosshair.y,
       text
     )
   }
 }
 
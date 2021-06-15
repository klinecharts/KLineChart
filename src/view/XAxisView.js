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
 import { renderHorizontalLine, renderVerticalLine } from '../renderer/line'
 import { createFont } from '../utils/canvas'
 
 export default class XAxisView extends View {
   constructor (container, chartData, xAxis) {
     super(container, chartData)
     this._xAxis = xAxis
   }
 
   _draw () {
     const xAxisOptions = this._chartData.styleOptions().xAxis
     if (xAxisOptions.show) {
       this._drawAxisLine(xAxisOptions)
       this._drawTickLines(xAxisOptions)
       this._drawTickLabels(xAxisOptions)
     }
   }
 
   _drawAxisLine (xAxisOptions) {
     const xAxisLine = xAxisOptions.axisLine
     if (!xAxisLine.show) {
       return
     }
     this._ctx.strokeStyle = xAxisLine.color
     this._ctx.lineWidth = xAxisLine.size
     renderHorizontalLine(this._ctx, 0, 0, this._width)
   }
 
   _drawTickLines (xAxisOptions) {
     const tickLine = xAxisOptions.tickLine
     if (!tickLine.show) {
       return
     }
     this._ctx.lineWidth = tickLine.size
     this._ctx.strokeStyle = tickLine.color
 
     const startY = xAxisOptions.axisLine.show ? xAxisOptions.axisLine.size : 0
 
     const endY = startY + tickLine.length
     this._xAxis.ticks().forEach(tick => {
       renderVerticalLine(this._ctx, tick.x, startY, endY)
     })
   }
 
   _drawTickLabels (xAxisOptions) {
     const tickText = xAxisOptions.tickText
     if (!tickText.show) {
       return
     }
     const tickLine = xAxisOptions.tickLine
 
     this._ctx.textBaseline = 'top'
     this._ctx.font = createFont(tickText.size, tickText.weight, tickText.family)
     this._ctx.textAlign = 'center'
     this._ctx.fillStyle = tickText.color
 
     let labelY = tickText.paddingTop
     if (xAxisOptions.axisLine.show) {
       labelY += (xAxisOptions.axisLine.size)
     }
     if (tickLine.show) {
       labelY += (tickLine.length)
     }
     const ticks = this._xAxis.ticks()
     const tickLength = ticks.length
     for (let i = 0; i < tickLength; i++) {
       this._ctx.fillText(ticks[i].v, ticks[i].x, labelY)
     }
   }
 }
 
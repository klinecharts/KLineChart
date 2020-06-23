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
import { LineStyle } from '../data/options/styleOptions'
import { drawHorizontalLine, drawVerticalLine, drawLine } from '../utils/canvas'
import { isValid } from '../utils/typeChecks'

export default class TechnicalIndicatorView extends View {
  constructor (container, chartData, xAxis, yAxis, additionalDataProvider) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._additionalDataProvider = additionalDataProvider
  }

  _draw () {
    this._drawGrid()
    this._drawTechnicalIndicator()
  }

  /**
   * 绘制网格
   * @private
   */
  _drawGrid () {
    const grid = this._chartData.styleOptions().grid
    if (!grid.display) {
      return
    }
    const horizontalGrid = grid.horizontal
    if (horizontalGrid.display) {
      this._ctx.strokeStyle = horizontalGrid.color
      this._ctx.lineWidth = horizontalGrid.size
      if (horizontalGrid.style === LineStyle.DASH) {
        this._ctx.setLineDash(horizontalGrid.dashValue)
      }
      this._yAxis.ticks().forEach(tick => {
        drawHorizontalLine(this._ctx, tick.y, 0, this._width)
      })
    }

    const verticalGrid = grid.vertical
    if (verticalGrid.display) {
      this._ctx.strokeStyle = verticalGrid.color
      this._ctx.lineWidth = verticalGrid.size
      if (verticalGrid.style === LineStyle.DASH) {
        this._ctx.setLineDash(verticalGrid.dashValue)
      } else {
        this._ctx.setLineDash([])
      }
      this._xAxis.ticks().forEach(tick => {
        drawVerticalLine(this._ctx, tick.x, 0, this._height)
      })
    }

    this._ctx.setLineDash([])
  }

  /**
   * 绘制指标
   * @private
   */
  _drawTechnicalIndicator () {
    const technicalIndicator = this._additionalDataProvider.technicalIndicator()
    const plots = technicalIndicator.plots
    const lines = []
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    const dataList = this._chartData.dataList()
    const technicalIndicatorResult = technicalIndicator.result
    let baseValue = technicalIndicator.baseValue
    if (!isValid(baseValue)) {
      baseValue = this._yAxis.min()
    }
    const baseValueY = this._yAxis.convertToPixel(baseValue)
    this._ctx.lineWidth = 1
    this._drawGraphics(
      (x, i, kLineData, halfBarSpace) => {
        const technicalIndicatorData = technicalIndicatorResult[i] || {}
        let lineValueIndex = 0
        plots.forEach(plot => {
          const value = technicalIndicatorData[plot.key]
          switch (plot.type) {
            case PlotType.CIRCLE: {
              if (isValid(value)) {
                const cbData = {
                  preData: { kLineData: dataList[i - 1], technicalIndicatorData: technicalIndicatorResult[i - 1] },
                  currentData: { kLineData, technicalIndicatorData }
                }
                const valueY = this._yAxis.convertToPixel(value)
                const circle = {
                  x,
                  y: valueY,
                  radius: halfBarSpace,
                  color: (plot.color && plot.color(cbData, technicalIndicatorOptions)) || technicalIndicatorOptions.circle.noChangeColor,
                  isStroke: plot.isStroke
                    ? plot.isStroke(cbData)
                    : true
                }
                this._drawCircle(circle)
              }
              break
            }
            case PlotType.OHLC: {
              if (isValid(value)) {
                
                const cbData = {
                  preData: { kLineData: dataList[i - 1], technicalIndicatorData: technicalIndicatorResult[i - 1] },
                  currentData: { kLineData, technicalIndicatorData }
                };
                const openY = this._yAxis.convertToPixel(value.open);
                const closeY = this._yAxis.convertToPixel(value.close);
                const highY = this._yAxis.convertToPixel(value.high);
                const lowY = this._yAxis.convertToPixel(value.low);

                let color;
                if(value.open>value.close){
                  color = technicalIndicatorOptions.ohlc.downColor
                }else if(value.open<value.close){
                  color = technicalIndicatorOptions.ohlc.upColor
                }else{
                  color = technicalIndicatorOptions.ohlc.noChangeColor
                }

                const ohlc = {
                  x,
                  openY,
                  closeY,
                  highY,
                  lowY,
                  halfBarSpace,
                  color,
                  isStroke: plot.isStroke
                    ? plot.isStroke(cbData)
                    : true
                };
                this._drawOhlc(ohlc);
              }
              break
            }
            case PlotType.BAR: {
              if (isValid(value)) {
                const cbData = {
                  preData: { kLineData: dataList[i - 1], technicalIndicatorData: technicalIndicatorResult[i - 1] },
                  currentData: { kLineData, technicalIndicatorData }
                }
                const valueY = this._yAxis.convertToPixel(value)
                const height = Math.abs(baseValueY - valueY)
                const bar = {
                  x: x - halfBarSpace,
                  width: halfBarSpace * 2,
                  height: Math.max(1, height)
                }
                if (valueY <= baseValueY) {
                  bar.y = height < 1 ? baseValueY + 1 : valueY
                } else {
                  bar.y = baseValueY
                }
                bar.color = (plot.color && plot.color(cbData, technicalIndicatorOptions)) || technicalIndicatorOptions.bar.noChangeColor
                bar.isStroke = plot.isStroke
                  ? plot.isStroke(cbData)
                  : false
                this._drawBar(bar)
              }
              break
            }
            default: {
              if (isValid(value)) {
                const valueY = this._yAxis.convertToPixel(value)
                const line = { x: x, y: valueY }
                if (lines[lineValueIndex]) {
                  lines[lineValueIndex].push(line)
                } else {
                  lines[lineValueIndex] = [line]
                }
              } else {
                if (lines[lineValueIndex]) {
                  lines[lineValueIndex].push(null)
                } else {
                  lines[lineValueIndex] = [null]
                }
              }
              lineValueIndex++
              break
            }
          }
        })
      },
      () => {
        this._drawLines(lines, technicalIndicatorOptions)
      }
    )
  }

  /**
   * 绘制线
   * @param lines
   * @param technicalIndicatorOptions
   */
  _drawLines (lines, technicalIndicatorOptions) {
    const colors = technicalIndicatorOptions.line.colors
    const colorSize = (colors || []).length
    this._ctx.lineWidth = technicalIndicatorOptions.line.size
    drawLine(this._ctx, () => {
      lines.forEach((lineItem, i) => {
        this._ctx.strokeStyle = colors[i % colorSize]
        this._ctx.beginPath()
        let isStart = true
        lineItem.forEach(line => {
          if (isValid(line)) {
            if (isStart) {
              this._ctx.moveTo(line.x, line.y)
              isStart = false
            } else {
              this._ctx.lineTo(line.x, line.y)
            }
          }
        })
        this._ctx.stroke()
        this._ctx.closePath()
      })
    })
  }

  /**
   * 绘制柱
   */
  _drawBar (bar) {
    if (bar.isStroke) {
      this._ctx.strokeStyle = bar.color
      this._ctx.strokeRect(bar.x + 0.5, bar.y, bar.width - 1, bar.height)
    } else {
      this._ctx.fillStyle = bar.color
      this._ctx.fillRect(bar.x, bar.y, bar.width, bar.height)
    }
  }

  /**
   * 绘制圆点
   * @param circle
   * @private
   */
  _drawCircle (circle) {
    this._ctx.strokeStyle = circle.color
    this._ctx.fillStyle = circle.color
    this._ctx.beginPath()
    this._ctx.arc(circle.x, circle.y, circle.radius, Math.PI * 2, 0, true)
    if (circle.isStroke) {
      this._ctx.stroke()
    } else {
      this._ctx.fill()
    }
    this._ctx.closePath()
  }


    /**
     * 绘制ohlc
     * @param ohlc
     * @private
     */
    _drawOhlc (ohlc) {
      const openY = ohlc.openY;
      const closeY = ohlc.closeY;
      const highY = ohlc.highY;
      const lowY = ohlc.lowY;

      this._ctx.fillStyle = ohlc.color;
      this._ctx.fillRect(ohlc.x - 0.5, highY, 1, lowY - highY);
      this._ctx.fillRect(ohlc.x - ohlc.halfBarSpace, openY - 0.5, ohlc.halfBarSpace, 1);
      this._ctx.fillRect(ohlc.x, closeY - 0.5, ohlc.halfBarSpace, 1);
    }

    
  /**
   * 绘制图形
   * @param onDrawing
   * @param onDrawEnd
   * @private
   */
  _drawGraphics (onDrawing, onDrawEnd) {
    const dataList = this._chartData.dataList()
    const dataSize = dataList.length
    const barSpace = this._chartData.barSpace()
    const dataSpace = this._chartData.dataSpace()
    const halfBarSpace = barSpace / 2
    const offsetRightBarCount = this._chartData.offsetRightBarCount()
    const to = this._chartData.to()
    for (let i = this._chartData.from(); i < to; i++) {
      const deltaFromRight = dataSize + offsetRightBarCount - i
      const x = this._width - (deltaFromRight - 0.5) * dataSpace + halfBarSpace
      const kLineData = dataList[i]
      onDrawing(x, i, kLineData, halfBarSpace, barSpace)
    }
    if (onDrawEnd) {
      onDrawEnd()
    }
  }
}

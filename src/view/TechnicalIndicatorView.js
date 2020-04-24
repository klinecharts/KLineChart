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
import { TechnicalIndicatorType, getTechnicalIndicatorDataKeysAndValues } from '../data/options/technicalIndicatorParamOptions'
import { LineStyle } from '../data/options/styleOptions'
import { drawHorizontalLine, drawVerticalLine, strokeInPixel } from '../utils/canvas'
import { formatValue } from '../utils/format'

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
    const technicalIndicatorType = this._additionalDataProvider.technicalIndicatorType()
    const technicalIndicatorParamOptions = this._chartData.technicalIndicatorParamOptions()
    const linePoints = []
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    const dataList = this._chartData.dataList()
    this._drawGraphics(
      (x, i, kLineData, halfBarSpace) => {
        const keysAndValues = getTechnicalIndicatorDataKeysAndValues(kLineData, technicalIndicatorType, technicalIndicatorParamOptions)
        const values = keysAndValues.values
        const lineValues = [...values]
        switch (technicalIndicatorType) {
          case TechnicalIndicatorType.MA:
          case TechnicalIndicatorType.EMA:
          case TechnicalIndicatorType.BOLL: {
            this._drawTechnicalIndicatorOhlc(
              i, x, halfBarSpace, technicalIndicatorOptions,
              kLineData, this._yAxis.isCandleStickYAxis()
            )
            break
          }
          case TechnicalIndicatorType.MACD: {
            lineValues.splice(lineValues.length - 1, 1)
            const macd = values[values.length - 1]
            if (macd > 0) {
              this._ctx.strokeStyle = technicalIndicatorOptions.bar.upColor
              this._ctx.fillStyle = technicalIndicatorOptions.bar.upColor
            } else if (macd < 0) {
              this._ctx.strokeStyle = technicalIndicatorOptions.bar.downColor
              this._ctx.fillStyle = technicalIndicatorOptions.bar.downColor
            } else {
              this._ctx.strokeStyle = technicalIndicatorOptions.bar.noChangeColor
              this._ctx.fillStyle = technicalIndicatorOptions.bar.noChangeColor
            }
            const preKLineData = formatValue(dataList, i - 1, {})
            const preMacd = formatValue(preKLineData, 'macd', {}).macd
            const isFill = !((preMacd || preMacd === 0) && macd > preMacd)
            this._drawBars(x, halfBarSpace, macd, isFill)
            break
          }
          case TechnicalIndicatorType.VOL: {
            lineValues.splice(lineValues.length - 1, 1)
            const close = kLineData.close
            const open = kLineData.open
            if (close > open) {
              this._ctx.fillStyle = technicalIndicatorOptions.bar.upColor
            } else if (close < open) {
              this._ctx.fillStyle = technicalIndicatorOptions.bar.downColor
            } else {
              this._ctx.fillStyle = technicalIndicatorOptions.bar.noChangeColor
            }
            const num = values[values.length - 1]
            this._drawBars(x, halfBarSpace, num, true)
            break
          }
          case TechnicalIndicatorType.SAR: {
            lineValues.splice(0, 1)
            const sar = values[0]
            if (sar || sar === 0) {
              const dataY = this._yAxis.convertToPixel(sar)
              if (sar < (kLineData.high + kLineData.low) / 2) {
                this._ctx.strokeStyle = technicalIndicatorOptions.bar.upColor
              } else {
                this._ctx.strokeStyle = technicalIndicatorOptions.bar.downColor
              }
              this._ctx.beginPath()
              this._ctx.arc(x, dataY, halfBarSpace, Math.PI * 2, 0, true)
              this._ctx.stroke()
              this._ctx.closePath()
            }
            this._drawTechnicalIndicatorOhlc(
              i, x, halfBarSpace, technicalIndicatorOptions,
              kLineData, this._yAxis.isCandleStickYAxis()
            )
            break
          }
        }
        this._prepareLinePoints(x, lineValues, linePoints)
      },
      () => {
        this._drawLines(linePoints, technicalIndicatorOptions)
      }
    )
  }

  /**
   * 需要绘制ohlc指标每条数据渲染
   * @param i
   * @param x
   * @param halfBarSpace
   * @param technicalIndicatorOptions
   * @param kLineData
   * @param isCandleStick
   */
  _drawTechnicalIndicatorOhlc (i, x, halfBarSpace, technicalIndicatorOptions, kLineData, isCandleStick) {
    if (!isCandleStick) {
      this._drawOhlc(
        halfBarSpace, x, kLineData,
        technicalIndicatorOptions.bar.upColor,
        technicalIndicatorOptions.bar.downColor, technicalIndicatorOptions.bar.noChangeColor
      )
    }
  }

  /**
   * 准备绘制线的数据
   * @param x
   * @param lineValues
   * @param linePoints
   */
  _prepareLinePoints (x, lineValues, linePoints) {
    for (let i = 0; i < lineValues.length; i++) {
      const value = lineValues[i]
      const valueY = this._yAxis.convertToPixel(value)
      if (!linePoints[i]) {
        linePoints[i] = [{ x: x, y: valueY }]
      } else {
        linePoints[i].push({ x: x, y: valueY })
      }
    }
  }

  /**
   * 绘制线
   * @param linePoints
   * @param technicalIndicatorOptions
   */
  _drawLines (linePoints, technicalIndicatorOptions) {
    const colors = technicalIndicatorOptions.line.colors
    const pointCount = linePoints.length
    const colorSize = (colors || []).length
    this._ctx.lineWidth = technicalIndicatorOptions.line.size
    strokeInPixel(this._ctx, () => {
      for (let i = 0; i < pointCount; i++) {
        const points = linePoints[i]
        if (points.length > 0) {
          this._ctx.strokeStyle = colors[i % colorSize]
          this._ctx.beginPath()
          this._ctx.moveTo(points[0].x, points[0].y)
          for (let j = 1; j < points.length; j++) {
            this._ctx.lineTo(points[j].x, points[j].y)
          }
          this._ctx.stroke()
          this._ctx.closePath()
        }
      }
    })
  }

  /**
   * 绘制柱状图
   * @param x
   * @param halfBarSpace
   * @param barData
   * @param isFill
   */
  _drawBars (x, halfBarSpace, barData, isFill) {
    if (barData || barData === 0) {
      this._ctx.lineWidth = 1
      const dataY = this._yAxis.convertToPixel(barData)
      const zeroY = this._yAxis.convertToPixel(0)
      let y = dataY
      if (barData < 0) {
        y = zeroY
      }
      const yDif = zeroY - dataY
      let barHeight = Math.abs(yDif)
      if (barHeight < 1) {
        barHeight = 1
        y = barData < 0 ? y + 1 : y - 1
      }
      if (isFill) {
        this._ctx.fillRect(x - halfBarSpace, y, halfBarSpace * 2, barHeight)
      } else {
        this._ctx.strokeRect(x - halfBarSpace + 0.5, y, halfBarSpace * 2 - 1, barHeight)
      }
    }
  }

  /**
   * 绘制ohlc
   * @param halfBarSpace
   * @param x
   * @param kLineData
   * @param upColor
   * @param downColor
   * @param noChangeColor
   * @private
   */
  _drawOhlc (halfBarSpace, x, kLineData, upColor, downColor, noChangeColor) {
    const open = kLineData.open
    const close = kLineData.close
    const openY = this._yAxis.convertToPixel(open)
    const closeY = this._yAxis.convertToPixel(close)
    const highY = this._yAxis.convertToPixel(kLineData.high)
    const lowY = this._yAxis.convertToPixel(kLineData.low)
    if (close > open) {
      this._ctx.fillStyle = upColor
    } else if (close < open) {
      this._ctx.fillStyle = downColor
    } else {
      this._ctx.fillStyle = noChangeColor
    }
    this._ctx.fillRect(x - 0.5, highY, 1, lowY - highY)
    this._ctx.fillRect(x - halfBarSpace, openY - 0.5, halfBarSpace, 1)
    this._ctx.fillRect(x, closeY - 0.5, halfBarSpace, 1)
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
      if (onDrawing) {
        onDrawing(x, i, kLineData, halfBarSpace, barSpace)
      }
    }
    if (onDrawEnd) {
      onDrawEnd()
    }
  }
}

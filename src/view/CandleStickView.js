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

import TechnicalIndicatorView from './TechnicalIndicatorView'
import { LineStyle, CandleStickStyle, ChartType } from '../data/options/styleOptions'
import { drawHorizontalLine, drawVerticalLine, getFont, drawLine } from '../utils/canvas'
import { formatPrecision } from '../utils/format'

export default class CandleStickView extends TechnicalIndicatorView {
  _draw () {
    this._drawGrid()
    if (this._additionalDataProvider.chartType() === ChartType.REAL_TIME) {
      this._drawRealTime()
    } else {
      this._drawCandleStick()
      this._drawTechnicalIndicator()
      this._drawHighestPriceMark()
      this._drawLowestPriceMark()
    }
    this._drawLastPriceLine()
  }

  /**
   * 绘制分时图
   * @private
   */
  _drawRealTime () {
    const timeLinePoints = []
    const timeLineAreaPoints = []
    const averageLinePoints = []
    const from = this._chartData.from()
    const technicalIndicator = this._additionalDataProvider.technicalIndicator()
    const technicalIndicatorResult = technicalIndicator.result
    const onDrawing = (x, i, kLineData, halfBarSpace) => {
      const technicalIndicatorData = technicalIndicatorResult[i] || {}
      const average = technicalIndicatorData.average || 0
      const closeY = this._yAxis.convertToPixel(kLineData.close)
      const averageY = this._yAxis.convertToPixel(average)
      averageLinePoints.push({ x: x, y: averageY })
      if (i === from) {
        const startX = x - halfBarSpace
        timeLineAreaPoints.push({ x: startX, y: this._height })
        timeLineAreaPoints.push({ x: startX, y: closeY })
        timeLinePoints.push({ x: startX, y: closeY })
      }
      timeLinePoints.push({ x: x, y: closeY })
      timeLineAreaPoints.push({ x: x, y: closeY })
    }
    const onDrawEnd = () => {
      const areaPointLength = timeLineAreaPoints.length
      if (areaPointLength > 0) {
        const lastPoint = timeLineAreaPoints[areaPointLength - 1]
        const halfBarSpace = this._chartData.barSpace() / 2
        const endX = lastPoint.x + halfBarSpace
        timeLinePoints.push({ x: endX, y: lastPoint.y })
        timeLineAreaPoints.push({ x: endX, y: lastPoint.y })
        timeLineAreaPoints.push({ x: endX, y: this._height })
      }

      const realTime = this._chartData.styleOptions().realTime
      const timeLine = realTime.timeLine
      if (timeLinePoints.length > 0) {
        // 绘制分时线
        this._ctx.lineWidth = timeLine.size
        this._ctx.strokeStyle = timeLine.color
        drawLine(this._ctx, () => {
          this._ctx.beginPath()
          this._ctx.moveTo(timeLinePoints[0].x, timeLinePoints[0].y)
          for (let i = 1; i < timeLinePoints.length; i++) {
            this._ctx.lineTo(timeLinePoints[i].x, timeLinePoints[i].y)
          }
          this._ctx.stroke()
          this._ctx.closePath()
        })
      }

      if (timeLineAreaPoints.length > 0) {
        // 绘制分时线填充区域
        this._ctx.fillStyle = timeLine.areaFillColor
        this._ctx.beginPath()
        this._ctx.moveTo(timeLineAreaPoints[0].x, timeLineAreaPoints[0].y)
        for (let i = 1; i < timeLineAreaPoints.length; i++) {
          this._ctx.lineTo(timeLineAreaPoints[i].x, timeLineAreaPoints[i].y)
        }
        this._ctx.closePath()
        this._ctx.fill()
      }
      const averageLine = realTime.averageLine
      if (averageLine.display && averageLinePoints.length > 0) {
        // 绘制均线
        this._ctx.lineWidth = averageLine.size
        this._ctx.strokeStyle = averageLine.color
        drawLine(this._ctx, () => {
          this._ctx.beginPath()
          this._ctx.moveTo(averageLinePoints[0].x, averageLinePoints[0].y)
          for (let i = 1; i < averageLinePoints.length; i++) {
            this._ctx.lineTo(averageLinePoints[i].x, averageLinePoints[i].y)
          }
          this._ctx.stroke()
          this._ctx.closePath()
        })
      }
    }
    this._drawGraphics(onDrawing, onDrawEnd)
  }

  /**
   * 绘制蜡烛
   * @private
   */
  _drawCandleStick () {
    let markHighestPrice = -Infinity
    let markHighestPriceX = -1
    let markLowestPrice = Infinity
    let markLowestPriceX = -1
    const candleStick = this._chartData.styleOptions().candleStick
    const onDrawing = (x, i, kLineData, halfBarSpace, barSpace) => {
      const open = kLineData.open
      const close = kLineData.close
      const high = kLineData.high
      const low = kLineData.low
      if (markHighestPrice < high) {
        markHighestPrice = high
        markHighestPriceX = x
      }

      if (low < markLowestPrice) {
        markLowestPrice = low
        markLowestPriceX = x
      }

      if (close > open) {
        this._ctx.strokeStyle = candleStick.bar.upColor
        this._ctx.fillStyle = candleStick.bar.upColor
      } else if (close < open) {
        this._ctx.strokeStyle = candleStick.bar.downColor
        this._ctx.fillStyle = candleStick.bar.downColor
      } else {
        this._ctx.strokeStyle = candleStick.bar.noChangeColor
        this._ctx.fillStyle = candleStick.bar.noChangeColor
      }
      const openY = this._yAxis.convertToPixel(open)
      const closeY = this._yAxis.convertToPixel(close)
      const highY = this._yAxis.convertToPixel(high)
      const lowY = this._yAxis.convertToPixel(low)
      switch (candleStick.bar.style) {
        case CandleStickStyle.SOLID: {
          this._drawCandleStickBar(
            x, openY, closeY, highY, lowY,
            halfBarSpace, barSpace, 0, this._ctx.fillRect
          )
          break
        }
        case CandleStickStyle.STROKE: {
          this._drawCandleStickBar(
            x, openY, closeY, highY, lowY,
            halfBarSpace, barSpace, 0.5, this._ctx.strokeRect
          )
          break
        }
        case CandleStickStyle.UP_STROKE: {
          let drawFuc
          let correction = 0
          if (close > open) {
            drawFuc = this._ctx.strokeRect
            correction = 0.5
          } else {
            drawFuc = this._ctx.fillRect
          }
          this._drawCandleStickBar(
            x, openY, closeY, highY, lowY,
            halfBarSpace, barSpace, correction, drawFuc
          )
          break
        }
        case CandleStickStyle.DOWN_STROKE: {
          let drawFuc
          let correction = 0
          if (close > open) {
            drawFuc = this._ctx.fillRect
          } else {
            correction = 0.5
            drawFuc = this._ctx.strokeRect
          }
          this._drawCandleStickBar(
            x, openY, closeY, highY, lowY,
            halfBarSpace, barSpace, correction, drawFuc
          )
          break
        }
        default: {
          this._ctx.fillRect(x - 0.5, highY, 1, lowY - highY)
          this._ctx.fillRect(x - halfBarSpace, openY - 0.5, halfBarSpace, 1)
          this._ctx.fillRect(x, closeY - 0.5, halfBarSpace, 1)
          break
        }
      }
    }
    this._drawGraphics(onDrawing)
    this._highestMarkData = { x: markHighestPriceX, price: markHighestPrice }
    this._lowestMarkData = { x: markLowestPriceX, price: markLowestPrice }
  }

  /**
   * 绘制蜡烛柱
   * @param x
   * @param openY
   * @param closeY
   * @param highY
   * @param lowY
   * @param halfBarSpace
   * @param barSpace
   * @param correction
   * @param drawFuc
   * @private
   */
  _drawCandleStickBar (x, openY, closeY, highY, lowY, halfBarSpace, barSpace, correction, drawFuc) {
    const highEndY = Math.min(openY, closeY)
    const lowStartY = Math.max(openY, closeY)
    this._ctx.fillRect(x - 0.5, highY, 1, highEndY - highY)
    this._ctx.fillRect(x - 0.5, lowStartY, 1, lowY - lowStartY)
    drawFuc.call(this._ctx, x - halfBarSpace + correction, highEndY, barSpace - correction * 2, Math.max(1, lowStartY - highEndY))
  }

  /**
   * 渲染最高价标记
   * @param pricePrecision
   */
  _drawHighestPriceMark (pricePrecision) {
    if (!this._highestMarkData) {
      return
    }
    const price = this._highestMarkData.price
    const priceMark = this._chartData.styleOptions().candleStick.priceMark
    const highestPriceMark = priceMark.high
    if (price === -Infinity || !priceMark.display || !highestPriceMark.display) {
      return
    }
    this._drawLowestHighestPriceMark(
      highestPriceMark, this._highestMarkData.x, price, true, this._chartData.pricePrecision()
    )
  }

  /**
   * 绘制最低价标记
   */
  _drawLowestPriceMark () {
    if (!this._lowestMarkData) {
      return
    }
    const price = this._lowestMarkData.price
    const priceMark = this._chartData.styleOptions().candleStick.priceMark
    const lowestPriceMark = priceMark.low
    if (price === Infinity || !priceMark.display || !lowestPriceMark.display) {
      return
    }
    this._drawLowestHighestPriceMark(
      lowestPriceMark, this._lowestMarkData.x, price, false, this._chartData.pricePrecision()
    )
  }

  /**
   * 渲染最高最低价格标记
   * @param priceMark
   * @param x
   * @param price
   * @param isHigh
   * @param pricePrecision
   */
  _drawLowestHighestPriceMark (priceMark, x, price, isHigh, pricePrecision) {
    const priceY = this._yAxis.convertToPixel(price)
    const startX = x
    const startY = priceY + (isHigh ? -2 : 2)
    this._ctx.textAlign = 'left'
    this._ctx.lineWidth = 1
    this._ctx.strokeStyle = priceMark.color
    this._ctx.fillStyle = priceMark.color

    drawLine(this._ctx, () => {
      this._ctx.beginPath()
      this._ctx.moveTo(startX, startY)
      this._ctx.lineTo(startX - 2, startY + (isHigh ? -2 : 2))
      this._ctx.stroke()
      this._ctx.closePath()

      this._ctx.beginPath()
      this._ctx.moveTo(startX, startY)
      this._ctx.lineTo(startX + 2, startY + (isHigh ? -2 : 2))
      this._ctx.stroke()
      this._ctx.closePath()
    })

    // 绘制竖线
    const y = startY + (isHigh ? -5 : 5)
    drawVerticalLine(this._ctx, startX, startY, y)
    drawHorizontalLine(this._ctx, y, startX, startX + 5)

    this._ctx.font = getFont(priceMark.textSize, priceMark.textFamily)
    const text = formatPrecision(price, pricePrecision)
    this._ctx.textBaseline = 'middle'
    this._ctx.fillText(text, startX + 5 + priceMark.textMargin, y)
  }

  /**
   * 绘制最新价线
   * @private
   */
  _drawLastPriceLine () {
    const dataList = this._chartData.dataList()
    const dataSize = dataList.length
    const priceMark = this._chartData.styleOptions().candleStick.priceMark
    const lastPriceMark = priceMark.last
    if (!priceMark.display || !lastPriceMark.display || !lastPriceMark.line.display || dataSize === 0) {
      return
    }
    const kLineData = dataList[dataSize - 1]
    const close = kLineData.close
    const open = kLineData.open
    let priceY = this._yAxis.convertToPixel(close)
    priceY = +(Math.max(this._height * 0.05, Math.min(priceY, this._height * 0.98))).toFixed(0)
    let color
    if (close > open) {
      color = lastPriceMark.upColor
    } else if (close < open) {
      color = lastPriceMark.downColor
    } else {
      color = lastPriceMark.noChangeColor
    }
    const priceMarkLine = lastPriceMark.line
    this._ctx.strokeStyle = color
    this._ctx.lineWidth = priceMarkLine.size
    if (priceMarkLine.style === LineStyle.DASH) {
      this._ctx.setLineDash(priceMarkLine.dashValue)
    }
    drawHorizontalLine(this._ctx, priceY, 0, this._width)
    this._ctx.setLineDash([])
  }
}

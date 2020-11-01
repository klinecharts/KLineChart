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
import { LineStyle, ChartType } from '../data/options/styleOptions'
import { drawHorizontalLine, drawVerticalLine, getFont, drawLine } from '../utils/canvas'
import { formatPrecision, formatValue } from '../utils/format'

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
    const candleStickOptions = this._chartData.styleOptions().candleStick
    this._drawGraphics((x, i, kLineData, halfBarSpace, barSpace) => {
      this._drawCandleStickBar(x, halfBarSpace, barSpace, i, kLineData, candleStickOptions.bar, candleStickOptions.bar.style)
    })
  }

  /**
   * 渲染最高价标记
   */
  _drawHighestPriceMark () {
    const priceMarkOptions = this._chartData.styleOptions().candleStick.priceMark
    const highestPriceMarkOptions = priceMarkOptions.high
    if (!priceMarkOptions.display || !highestPriceMarkOptions.display) {
      return
    }
    const dataList = this._chartData.dataList()
    const to = this._chartData.to()
    let highestPrice = -Infinity
    let highestPos = -1
    for (let i = this._chartData.from(); i < to; i++) {
      const high = formatValue(dataList[i], 'high', -Infinity)
      if (high > highestPrice) {
        highestPrice = high
        highestPos = i
      }
    }
    if (highestPrice !== -Infinity) {
      this._drawLowestHighestPriceMark(highestPriceMarkOptions, highestPos, highestPrice, true)
    }
  }

  /**
   * 绘制最低价标记
   */
  _drawLowestPriceMark () {
    const priceMarkOptions = this._chartData.styleOptions().candleStick.priceMark
    const lowestPriceMarkOptions = priceMarkOptions.low
    if (!priceMarkOptions.display || !lowestPriceMarkOptions.display) {
      return
    }
    const dataList = this._chartData.dataList()
    const to = this._chartData.to()
    let lowestPrice = Infinity
    let lowestPos = -1
    for (let i = this._chartData.from(); i < to; i++) {
      const low = formatValue(dataList[i], 'low', Infinity)
      if (low < lowestPrice) {
        lowestPrice = low
        lowestPos = i
      }
    }
    if (lowestPrice !== Infinity) {
      this._drawLowestHighestPriceMark(lowestPriceMarkOptions, lowestPos, lowestPrice)
    }
  }

  /**
   * 渲染最高最低价格标记
   * @param priceMarkOptions
   * @param pricePos
   * @param price
   * @param isHigh
   */
  _drawLowestHighestPriceMark (priceMarkOptions, pricePos, price, isHigh) {
    const pricePrecision = this._chartData.pricePrecision()
    const priceY = this._yAxis.convertToPixel(price)
    const startX = this._xAxis.convertToPixel(pricePos)
    const startY = priceY + (isHigh ? -2 : 2)
    this._ctx.textAlign = 'left'
    this._ctx.lineWidth = 1
    this._ctx.strokeStyle = priceMarkOptions.color
    this._ctx.fillStyle = priceMarkOptions.color

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

    this._ctx.font = getFont(priceMarkOptions.textSize, priceMarkOptions.textWeight, priceMarkOptions.textFamily)
    const text = formatPrecision(price, pricePrecision)
    this._ctx.textBaseline = 'middle'
    this._ctx.fillText(text, startX + 5 + priceMarkOptions.textMargin, y)
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
    this._ctx.save()
    this._ctx.strokeStyle = color
    this._ctx.lineWidth = priceMarkLine.size
    if (priceMarkLine.style === LineStyle.DASH) {
      this._ctx.setLineDash(priceMarkLine.dashValue)
    }
    drawHorizontalLine(this._ctx, priceY, 0, this._width)
    this._ctx.restore()
  }
}

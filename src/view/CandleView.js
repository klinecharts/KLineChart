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
import { CandleType, LineStyle } from '../data/options/styleOptions'
import { renderHorizontalLine, renderLine } from '../renderer/line'
import { createFont } from '../utils/canvas'
import { formatPrecision, formatValue } from '../utils/format'
import { isArray, isValid, isNumber } from '../utils/typeChecks'

export default class CandleView extends TechnicalIndicatorView {
  _draw () {
    this._drawGrid()
    const candleOptions = this._chartData.styleOptions().candle
    if (candleOptions.type === CandleType.AREA) {
      this._drawArea(candleOptions)
    } else {
      this._drawCandle(candleOptions)
      this._drawLowHighPrice(
        candleOptions.priceMark,
        'high',
        'high',
        Number.MIN_SAFE_INTEGER,
        [-2, -5],
        (price, comparePrice) => {
          if (price > comparePrice) {
            return price
          }
        }
      )
      this._drawLowHighPrice(
        candleOptions.priceMark,
        'low',
        'low',
        Number.MAX_SAFE_INTEGER,
        [2, 5],
        (price, comparePrice) => {
          if (price < comparePrice) {
            return price
          }
        }
      )
    }
    this._drawTechnicalIndicators()
    this._drawLastPriceLine(candleOptions.priceMark)
  }

  /**
   * 绘制面积图
   * @param candleOptions
   * @private
   */
  _drawArea (candleOptions) {
    const linePoints = []
    const areaPoints = []
    let minY = Number.MAX_SAFE_INTEGER
    const areaOptions = candleOptions.area
    const onDrawing = (x, i, kLineData, halfBarSpace, barSpace, n) => {
      const value = kLineData[areaOptions.value]
      if (isValid(value) && isNumber(value)) {
        const y = this._yAxis.convertToPixel(value)
        if (n === 0) {
          const startX = x - halfBarSpace
          areaPoints.push({ x: startX, y: this._height })
          areaPoints.push({ x: startX, y })
          linePoints.push({ x: startX, y })
        }
        linePoints.push({ x, y })
        areaPoints.push({ x, y })
        minY = Math.min(minY, y)
      }
    }
    const onDrawEnd = () => {
      const areaPointLength = areaPoints.length
      if (areaPointLength > 0) {
        const lastPoint = areaPoints[areaPointLength - 1]
        const halfBarSpace = this._chartData.barSpace() / 2
        const endX = lastPoint.x + halfBarSpace
        linePoints.push({ x: endX, y: lastPoint.y })
        areaPoints.push({ x: endX, y: lastPoint.y })
        areaPoints.push({ x: endX, y: this._height })
      }

      if (linePoints.length > 0) {
        // 绘制分时线
        this._ctx.lineWidth = areaOptions.lineSize
        this._ctx.strokeStyle = areaOptions.lineColor
        renderLine(this._ctx, () => {
          this._ctx.beginPath()
          this._ctx.moveTo(linePoints[0].x, linePoints[0].y)
          for (let i = 1; i < linePoints.length; i++) {
            this._ctx.lineTo(linePoints[i].x, linePoints[i].y)
          }
          this._ctx.stroke()
          this._ctx.closePath()
        })
      }

      if (areaPoints.length > 0) {
        // 绘制分时线填充区域
        const fillColor = areaOptions.fillColor
        if (isArray(fillColor)) {
          const gradient = this._ctx.createLinearGradient(0, this._height, 0, minY)
          try {
            fillColor.forEach(({ offset, color }) => {
              gradient.addColorStop(offset, color)
            })
          } catch (e) {
          }
          this._ctx.fillStyle = gradient
        } else {
          this._ctx.fillStyle = fillColor
        }
        this._ctx.beginPath()
        this._ctx.moveTo(areaPoints[0].x, areaPoints[0].y)
        for (let i = 1; i < areaPoints.length; i++) {
          this._ctx.lineTo(areaPoints[i].x, areaPoints[i].y)
        }
        this._ctx.closePath()
        this._ctx.fill()
      }
    }
    this._drawGraphics(onDrawing, onDrawEnd)
  }

  /**
   * 绘制蜡烛
   * @param candleOptions
   * @private
   */
  _drawCandle (candleOptions) {
    this._drawGraphics((x, i, kLineData, halfBarSpace, barSpace) => {
      this._drawCandleBar(x, halfBarSpace, barSpace, i, kLineData, candleOptions.bar, candleOptions.type)
    })
  }

  /**
   * 渲染最高最低价格
   * @param priceMarkOptions
   * @param optionKey
   * @param priceKey
   * @param initPriceValue
   * @param offsets
   * @param compare
   * @private
   */
  _drawLowHighPrice (priceMarkOptions, optionKey, priceKey, initPriceValue, offsets, compare) {
    const lowHighPriceMarkOptions = priceMarkOptions[optionKey]
    if (!priceMarkOptions.show || !lowHighPriceMarkOptions.show) {
      return
    }
    const visibleDataList = this._chartData.visibleDataList()
    let price = initPriceValue
    let pos = -1
    visibleDataList.forEach(({ index, data }) => {
      const comparePrice = compare(formatValue(data, priceKey, initPriceValue), price)
      if (comparePrice) {
        price = comparePrice
        pos = index
      }
    })
    const pricePrecision = this._chartData.pricePrecision()
    const priceY = this._yAxis.convertToPixel(price)
    const startX = this._xAxis.convertToPixel(pos)
    const startY = priceY + offsets[0]
    this._ctx.textAlign = 'left'
    this._ctx.lineWidth = 1
    this._ctx.strokeStyle = lowHighPriceMarkOptions.color
    this._ctx.fillStyle = lowHighPriceMarkOptions.color

    renderLine(this._ctx, () => {
      this._ctx.beginPath()
      this._ctx.moveTo(startX - 2, startY + offsets[0])
      this._ctx.lineTo(startX, startY)
      this._ctx.lineTo(startX + 2, startY + offsets[0])
      this._ctx.stroke()
      this._ctx.closePath()
    })

    // 绘制竖线
    const y = startY + offsets[1]
    renderLine(this._ctx, () => {
      this._ctx.beginPath()
      this._ctx.moveTo(startX, startY)
      this._ctx.lineTo(startX, y)
      this._ctx.lineTo(startX + 5, y)
      this._ctx.stroke()
      this._ctx.closePath()
    })

    this._ctx.font = createFont(lowHighPriceMarkOptions.textSize, lowHighPriceMarkOptions.textWeight, lowHighPriceMarkOptions.textFamily)
    const text = formatPrecision(price, pricePrecision)
    this._ctx.textBaseline = 'middle'
    this._ctx.fillText(text, startX + 5 + lowHighPriceMarkOptions.textMargin, y)
  }

  /**
   * 绘制最新价线
   * @param priceMarkOptions
   * @private
   */
  _drawLastPriceLine (priceMarkOptions) {
    const lastPriceMarkOptions = priceMarkOptions.last
    if (!priceMarkOptions.show || !lastPriceMarkOptions.show || !lastPriceMarkOptions.line.show) {
      return
    }
    const dataList = this._chartData.dataList()
    const kLineData = dataList[dataList.length - 1]
    if (!kLineData) {
      return
    }
    const close = kLineData.close
    const open = kLineData.open
    let priceY = this._yAxis.convertToPixel(close)
    priceY = Math.round(Math.max(this._height * 0.05, Math.min(priceY, this._height * 0.98)))
    let color
    if (close > open) {
      color = lastPriceMarkOptions.upColor
    } else if (close < open) {
      color = lastPriceMarkOptions.downColor
    } else {
      color = lastPriceMarkOptions.noChangeColor
    }
    this._ctx.save()
    this._ctx.strokeStyle = color
    this._ctx.lineWidth = lastPriceMarkOptions.line.size
    if (lastPriceMarkOptions.line.style === LineStyle.DASH) {
      this._ctx.setLineDash(lastPriceMarkOptions.line.dashValue)
    }
    renderHorizontalLine(this._ctx, priceY, 0, this._width)
    this._ctx.restore()
  }
}

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
import { CandleType, LineStyle } from '../options/styleOptions'
import { renderHorizontalLine, renderLine } from '../renderer/line'
import { renderCloseFillPath } from '../renderer/path'
import { createFont } from '../utils/canvas'
import { formatPrecision, formatValue } from '../utils/format'
import { isArray, isNumber } from '../utils/typeChecks'

export default class CandleView extends TechnicalIndicatorView {
  _drawContent () {
    const candleOptions = this._chartStore.styleOptions().candle
    this._drawLastPriceLine(candleOptions.priceMark)
    if (candleOptions.type === CandleType.AREA) {
      this._drawArea(candleOptions)
    } else {
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
      this._drawCandle(candleOptions)
    }
    this._drawTechs()
    this._drawGrid()
  }

  /**
   * 绘制面积图
   * @param candleOptions
   * @private
   */
  _drawArea (candleOptions) {
    const lineCoordinates = []
    const areaCoordinates = []
    let minY = Number.MAX_SAFE_INTEGER
    const areaOptions = candleOptions.area
    const onDrawing = (x, i, kLineData, halfBarSpace, barSpace, n) => {
      const value = kLineData[areaOptions.value]
      if (isNumber(value)) {
        const y = this._yAxis.convertToPixel(value)
        if (n === 0) {
          const startX = x - halfBarSpace
          areaCoordinates.push({ x: startX, y: this._height })
          areaCoordinates.push({ x: startX, y })
          lineCoordinates.push({ x: startX, y })
        }
        lineCoordinates.push({ x, y })
        areaCoordinates.push({ x, y })
        minY = Math.min(minY, y)
      }
    }
    const onDrawEnd = () => {
      const areaCoordinateLength = areaCoordinates.length
      if (areaCoordinateLength > 0) {
        const lastCoordinate = areaCoordinates[areaCoordinateLength - 1]
        const halfBarSpace = this._chartStore.timeScaleStore().halfBarSpace()
        const endX = lastCoordinate.x + halfBarSpace
        lineCoordinates.push({ x: endX, y: lastCoordinate.y })
        areaCoordinates.push({ x: endX, y: lastCoordinate.y })
        areaCoordinates.push({ x: endX, y: this._height })
      }

      if (lineCoordinates.length > 0) {
        // 绘制分时线
        this._ctx.lineWidth = areaOptions.lineSize
        this._ctx.strokeStyle = areaOptions.lineColor
        renderLine(this._ctx, lineCoordinates)
      }

      if (areaCoordinates.length > 0) {
        // 绘制分时线填充区域
        const backgroundColor = areaOptions.backgroundColor
        if (isArray(backgroundColor)) {
          const gradient = this._ctx.createLinearGradient(0, this._height, 0, minY)
          try {
            backgroundColor.forEach(({ offset, color }) => {
              gradient.addColorStop(offset, color)
            })
          } catch (e) {
          }
          this._ctx.fillStyle = gradient
        } else {
          this._ctx.fillStyle = backgroundColor
        }
        renderCloseFillPath(this._ctx, areaCoordinates)
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
    const visibleDataList = this._chartStore.visibleDataList()
    let price = initPriceValue
    let pos = -1
    visibleDataList.forEach(({ index, data }) => {
      const comparePrice = compare(formatValue(data, priceKey, initPriceValue), price)
      if (comparePrice) {
        price = comparePrice
        pos = index
      }
    })
    const pricePrecision = this._chartStore.pricePrecision()
    const priceY = this._yAxis.convertToPixel(price)
    const startX = this._xAxis.convertToPixel(pos)
    const startY = priceY + offsets[0]
    this._ctx.textAlign = 'left'
    this._ctx.lineWidth = 1
    this._ctx.strokeStyle = lowHighPriceMarkOptions.color
    this._ctx.fillStyle = lowHighPriceMarkOptions.color

    renderLine(
      this._ctx,
      [
        { x: startX - 2, y: startY + offsets[0] },
        { x: startX, y: startY },
        { x: startX + 2, y: startY + offsets[0] }
      ]
    )

    // 绘制竖线
    const y = startY + offsets[1]
    renderLine(
      this._ctx,
      [
        { x: startX, y: startY },
        { x: startX, y },
        { x: startX + 5, y }
      ]
    )

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
    const dataList = this._chartStore.dataList()
    const kLineData = dataList[dataList.length - 1]
    if (!kLineData) {
      return
    }
    const close = kLineData.close
    const open = kLineData.open
    const priceY = this._yAxis.convertToNicePixel(close)
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

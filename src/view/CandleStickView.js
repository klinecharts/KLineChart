import TechnicalIndicatorView from './TechnicalIndicatorView'
import { LineStyle, CandleStickStyle, ChartType } from '../data/options/styleOptions'
import { getFont } from '../utils/canvas'
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
    const timeLineAreaPoints = [{ x: 0, y: this._height }]
    const averageLinePoints = []

    const from = this._chartData.from()
    const range = this._chartData.range()
    const to = this._chartData.to()
    const onDrawing = (x, i, kLineData) => {
      const average = kLineData.average
      const closeY = this._yAxis.convertToPixel(kLineData.close)
      const averageY = this._yAxis.convertToPixel(average)
      timeLinePoints.push({ x: x, y: closeY })
      if (average || average === 0) {
        averageLinePoints.push({ x: x, y: averageY })
      }
      if (i === from) {
        timeLineAreaPoints.push({ x: 0, y: closeY })
      }
      timeLineAreaPoints.push({ x: x, y: closeY })
    }
    const onDrawEnd = () => {
      const areaPointLength = timeLineAreaPoints.length
      if (areaPointLength > 0) {
        const lastPoint = timeLineAreaPoints[areaPointLength - 1]
        const isFit = !(from - to < range)
        if (isFit) {
          timeLineAreaPoints.push({ x: this._width, y: lastPoint.y })
          timeLineAreaPoints.push({ x: this._width, y: this._height })
        } else {
          timeLineAreaPoints.push({ x: lastPoint.x, y: this._height })
        }
      }

      const realTime = this._chartData.styleOptions().realTime
      const timeLine = realTime.timeLine
      if (timeLinePoints.length > 0) {
        // 绘制分时线
        this._ctx.lineWidth = timeLine.size
        this._ctx.strokeStyle = timeLine.color
        this._ctx.beginPath()
        this._ctx.moveTo(timeLinePoints[0].x, timeLinePoints[0].y)
        for (let i = 1; i < timeLinePoints.length; i++) {
          this._ctx.lineTo(timeLinePoints[i].x, timeLinePoints[i].y)
        }
        this._ctx.stroke()
        this._ctx.closePath()
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
        this._ctx.beginPath()
        this._ctx.moveTo(averageLinePoints[0].x, averageLinePoints[0].y)
        for (let i = 1; i < averageLinePoints.length; i++) {
          this._ctx.lineTo(averageLinePoints[i].x, averageLinePoints[i].y)
        }
        this._ctx.stroke()
        this._ctx.closePath()
      }
    }
    this._drawGraphics(onDrawing, onDrawEnd)
  }

  /**
   * 绘制蜡烛
   * @private
   */
  _drawCandleStick () {
    this._ctx.lineWidth = 1
    let rect = []
    let markHighestPrice = -Infinity
    let markHighestPriceX = -1
    let markLowestPrice = Infinity
    let markLowestPriceX = -1
    const dataList = this._chartData.dataList()
    const candleStick = this._chartData.styleOptions().candleStick
    const onDrawing = (x, i, kLineData, halfBarSpace, barSpace) => {
      const close = kLineData.close
      const refKLineData = dataList[i - 1] || {}
      const refClose = refKLineData.close || close
      const high = kLineData.high
      const low = kLineData.low
      const open = kLineData.open
      if (markHighestPrice < high) {
        markHighestPrice = high
        markHighestPriceX = x
      }

      if (low < markLowestPrice) {
        markLowestPrice = low
        markLowestPriceX = x
      }
      if (close > refClose) {
        this._ctx.strokeStyle = candleStick.bar.upColor
        this._ctx.fillStyle = candleStick.bar.upColor
      } else if (close < refClose) {
        this._ctx.strokeStyle = candleStick.bar.downColor
        this._ctx.fillStyle = candleStick.bar.downColor
      } else {
        this._ctx.strokeStyle = candleStick.bar.noChangeColor
        this._ctx.fillStyle = candleStick.bar.noChangeColor
      }

      if (candleStick.bar.style !== CandleStickStyle.OHLC) {
        const openY = this._yAxis.convertToPixel(open)
        const closeY = this._yAxis.convertToPixel(close)
        const highY = this._yAxis.convertToPixel(high)
        const lowY = this._yAxis.convertToPixel(low)
        const highLine = []
        const lowLine = []
        highLine[0] = highY
        lowLine[1] = lowY
        if (openY > closeY) {
          highLine[1] = closeY
          lowLine[0] = openY
          rect = [x - halfBarSpace, closeY, barSpace, openY - closeY]
        } else if (openY < closeY) {
          highLine[1] = openY
          lowLine[0] = closeY
          rect = [x - halfBarSpace, openY, barSpace, closeY - openY]
        } else {
          highLine[1] = openY
          lowLine[0] = closeY
          rect = [x - halfBarSpace, openY, barSpace, 1]
        }
        this._ctx.beginPath()
        this._ctx.moveTo(x, highLine[0])
        this._ctx.lineTo(x, highLine[1])
        this._ctx.stroke()
        this._ctx.closePath()

        this._ctx.beginPath()
        this._ctx.moveTo(x, lowLine[0])
        this._ctx.lineTo(x, lowLine[1])
        this._ctx.stroke()
        this._ctx.closePath()
        if (rect[3] < 1) {
          rect[3] = 1
        }
        switch (candleStick.bar.style) {
          case CandleStickStyle.SOLID: {
            this._ctx.fillRect(rect[0], rect[1], rect[2], rect[3])
            break
          }
          case CandleStickStyle.STROKE: {
            this._ctx.strokeRect(rect[0], rect[1], rect[2], rect[3])
            break
          }
          case CandleStickStyle.UP_STROKE: {
            if (close > refClose) {
              this._ctx.strokeRect(rect[0], rect[1], rect[2], rect[3])
            } else {
              this._ctx.fillRect(rect[0], rect[1], rect[2], rect[3])
            }
            break
          }
          case CandleStickStyle.DOWN_STROKE: {
            if (close > refClose) {
              this._ctx.fillRect(rect[0], rect[1], rect[2], rect[3])
            } else {
              this._ctx.strokeRect(rect[0], rect[1], rect[2], rect[3])
            }
            break
          }
        }
      } else {
        this._drawOhlc(
          halfBarSpace, x, kLineData,
          refKLineData, candleStick.bar.upColor,
          candleStick.bar.downColor, candleStick.bar.noChangeColor
        )
      }
    }
    this._drawGraphics(onDrawing)
    this._highestMarkData = { x: markHighestPriceX, price: markHighestPrice }
    this._lowestMarkData = { x: markLowestPriceX, price: markLowestPrice }
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
      highestPriceMark, this._highestMarkData.x, price, true, this._chartData.precisionOptions().price
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
      lowestPriceMark, this._lowestMarkData.x, price, false, this._chartData.precisionOptions().price
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
    let startY = priceY + (isHigh ? -2 : 2)
    this._ctx.textAlign = 'left'
    this._ctx.lineWidth = 1
    this._ctx.strokeStyle = priceMark.color
    this._ctx.fillStyle = priceMark.color
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
    // 绘制竖线
    this._ctx.beginPath()
    this._ctx.moveTo(startX, startY)
    startY = startY + (isHigh ? -5 : 5)
    this._ctx.lineTo(startX, startY)
    this._ctx.stroke()
    this._ctx.closePath()

    this._ctx.beginPath()
    this._ctx.moveTo(startX, startY)
    this._ctx.lineTo(startX + 5, startY)
    this._ctx.stroke()
    this._ctx.closePath()

    this._ctx.font = getFont(priceMark.textSize)
    const text = formatPrecision(price, pricePrecision)
    this._ctx.textBaseline = 'middle'
    this._ctx.fillText(text, startX + 5 + priceMark.textMargin, startY)
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
    const lastPrice = dataList[dataSize - 1].close
    const preKLineData = dataList[dataSize - 2] || {}
    const preLastPrice = preKLineData.close || lastPrice
    let priceY = this._yAxis.convertToPixel(lastPrice)
    priceY = +(Math.max(this._height * 0.05, Math.min(priceY, this._height * 0.98))).toFixed(0)
    let color
    if (lastPrice > preLastPrice) {
      color = lastPriceMark.upColor
    } else if (lastPrice < preLastPrice) {
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
    this._ctx.beginPath()
    this._ctx.moveTo(0, priceY)
    this._ctx.lineTo(this._width, priceY)
    this._ctx.stroke()
    this._ctx.closePath()
    this._ctx.setLineDash([])
  }
}

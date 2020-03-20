import TechnicalIndicatorView from './TechnicalIndicatorView'
import { LineStyle, CandleStickStyle } from '../data/options/styleOptions'
import { getFont } from '../utils/canvas'
import { formatPrecision } from '../utils/format'

export default class CandleStickView extends TechnicalIndicatorView {
  _draw () {
    this._drawGrid()
    this._drawCandleStick()
    this._drawTechnicalIndicator()
    this._drawHighestPriceMark()
    this._drawLowestPriceMark()
    this._drawLastPriceLine()
  }

  /**
   * 绘制分时图
   * @private
   */
  _drawRealTime () {

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
      const refKLineData = dataList[i - 1] || {}
      const refClose = refKLineData.close || -Infinity
      const high = kLineData.high
      const low = kLineData.low
      const close = kLineData.close
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
      } else {
        this._ctx.strokeStyle = candleStick.bar.downColor
        this._ctx.fillStyle = candleStick.bar.downColor
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
          case CandleStickStyle.INCREASING_STROKE: {
            if (close > refClose) {
              this._ctx.strokeRect(rect[0], rect[1], rect[2], rect[3])
            } else {
              this._ctx.fillRect(rect[0], rect[1], rect[2], rect[3])
            }
            break
          }
          case CandleStickStyle.DECREASING_STROKE: {
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
          refKLineData, candleStick.bar.upColor, candleStick.bar.downColor
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
    const preKLineData = dataList[dataSize - 2] || {}
    const preLastPrice = preKLineData.close || -Infinity
    const lastPrice = dataList[dataSize - 1].close
    let priceY = this._yAxis.convertToPixel(lastPrice)
    priceY = +(Math.max(this._height * 0.05, Math.min(priceY, this._height * 0.98))).toFixed(0)
    const color = lastPrice > preLastPrice ? lastPriceMark.upColor : lastPriceMark.downColor
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

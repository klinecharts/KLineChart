import IndicatorRender from './IndicatorRender'
import { calcTextWidth, getFont } from '../utils/canvas'
import { formatPrecision } from '../utils/format'
import { CandleStyle, LineStyle } from '../internal/constants'

class CandleStickView extends IndicatorRender {
  /**
   * 渲染蜡烛图
   * @param ctx
   * @param candle
   * @param pricePrecision
   */
  renderCandle (ctx, candle, pricePrecision) {
    ctx.lineWidth = 1
    let rect = []
    let markHighestPrice = Number.MIN_SAFE_INTEGER
    let markHighestPriceX = -1
    let markLowestPrice = Number.MAX_SAFE_INTEGER
    let markLowestPriceX = -1
    const dataList = this.storage.dataList
    const onRendering = (x, i, kLineData, halfBarSpace) => {
      const refKLineData = dataList[i - 1] || {}
      const refClose = refKLineData.close || Number.MIN_SAFE_INTEGER
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
        ctx.strokeStyle = candle.increasingColor
        ctx.fillStyle = candle.increasingColor
      } else {
        ctx.strokeStyle = candle.decreasingColor
        ctx.fillStyle = candle.decreasingColor
      }

      if (candle.style !== CandleStyle.OHLC) {
        const openY = this.yAxisRender.getY(open)
        const closeY = this.yAxisRender.getY(close)
        const highY = this.yAxisRender.getY(high)
        const lowY = this.yAxisRender.getY(low)
        const highLine = []
        const lowLine = []
        highLine[0] = highY
        lowLine[1] = lowY
        if (openY > closeY) {
          highLine[1] = closeY
          lowLine[0] = openY
          rect = [x - halfBarSpace, closeY, halfBarSpace * 2, openY - closeY]
        } else if (openY < closeY) {
          highLine[1] = openY
          lowLine[0] = closeY
          rect = [x - halfBarSpace, openY, halfBarSpace * 2, closeY - openY]
        } else {
          highLine[1] = openY
          lowLine[0] = closeY
          rect = [x - halfBarSpace, openY, halfBarSpace * 2, 1]
        }
        ctx.beginPath()
        ctx.moveTo(x, highLine[0])
        ctx.lineTo(x, highLine[1])
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.moveTo(x, lowLine[0])
        ctx.lineTo(x, lowLine[1])
        ctx.stroke()
        ctx.closePath()
        if (rect[3] < 1) {
          rect[3] = 1
        }
        switch (candle.style) {
          case CandleStyle.SOLID: {
            ctx.fillRect(rect[0], rect[1], rect[2], rect[3])
            break
          }
          case CandleStyle.STROKE: {
            ctx.strokeRect(rect[0], rect[1], rect[2], rect[3])
            break
          }
          case CandleStyle.INCREASING_STROKE: {
            if (close > refClose) {
              ctx.strokeRect(rect[0], rect[1], rect[2], rect[3])
            } else {
              ctx.fillRect(rect[0], rect[1], rect[2], rect[3])
            }
            break
          }
          case CandleStyle.DECREASING_STROKE: {
            if (close > refClose) {
              ctx.fillRect(rect[0], rect[1], rect[2], rect[3])
            } else {
              ctx.strokeRect(rect[0], rect[1], rect[2], rect[3])
            }
            break
          }
        }
      } else {
        this.renderOhlc(
          ctx, halfBarSpace, x, kLineData,
          refKLineData, candle.increasingColor, candle.decreasingColor
        )
      }
    }
    this.renderGraphics(ctx, onRendering)
    this.highestMarkData = { x: markHighestPriceX, price: markHighestPrice }
    this.lowestMarkData = { x: markLowestPriceX, price: markLowestPrice }
  }

  /**
   * 渲染最高价标记
   * @param ctx
   * @param highestPriceMark
   * @param pricePrecision
   */
  renderHighestPriceMark (ctx, highestPriceMark, pricePrecision) {
    const price = this.highestMarkData.price
    if (price === Number.MIN_SAFE_INTEGER || !highestPriceMark.display) {
      return
    }
    this.renderLowestHighestPriceMark(
      ctx, highestPriceMark, this.highestMarkData.x, price, true, pricePrecision
    )
  }

  /**
   * 绘制最低价标记
   * @param ctx
   * @param lowestPriceMark
   * @param pricePrecision
   */
  renderLowestPriceMark (ctx, lowestPriceMark, pricePrecision) {
    const price = this.lowestMarkData.price
    if (price === Number.MAX_SAFE_INTEGER || !lowestPriceMark.display) {
      return
    }
    this.renderLowestHighestPriceMark(
      ctx, lowestPriceMark, this.lowestMarkData.x, price, false, pricePrecision
    )
  }

  /**
   * 渲染最高最低价格标记
   * @param ctx
   * @param priceMark
   * @param x
   * @param price
   * @param isHigh
   * @param pricePrecision
   */
  renderLowestHighestPriceMark (ctx, priceMark, x, price, isHigh, pricePrecision) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(
      0, 0,
      this.handler.contentRight() - this.handler.contentLeft(),
      this.handler.contentBottom() - this.handler.contentTop()
    )
    ctx.closePath()
    ctx.clip()
    const priceY = this.yAxisRender.getY(price)
    const startX = x
    let startY = priceY + (isHigh ? -2 : 2)
    ctx.textAlign = 'left'
    ctx.lineWidth = 1
    ctx.strokeStyle = priceMark.color
    ctx.fillStyle = priceMark.color
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX - 2, startY + (isHigh ? -2 : 2))
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX + 2, startY + (isHigh ? -2 : 2))
    ctx.stroke()
    ctx.closePath()
    // 绘制竖线
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    startY = startY + (isHigh ? -5 : 5)
    ctx.lineTo(startX, startY)
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX + 5, startY)
    ctx.stroke()
    ctx.closePath()

    ctx.font = getFont(priceMark.text.size)
    const text = formatPrecision(price, pricePrecision)
    ctx.textBaseline = 'middle'
    ctx.fillText(text, startX + 5 + priceMark.text.margin, startY)
    ctx.restore()
  }

  /**
   * 绘制最新价标记
   * @param ctx
   * @param lastPriceMark
   * @param isRenderTextLeft
   * @param isRenderTextOutside
   * @param pricePrecision
   */
  renderLastPriceMark (ctx, lastPriceMark, isRenderTextLeft, isRenderTextOutside, pricePrecision) {
    const dataSize = this.storage.dataList.length
    if (!lastPriceMark.display || dataSize === 0) {
      return
    }
    const preKLineData = this.storage.dataList[dataSize - 2] || {}
    const preLastPrice = preKLineData.close || Number.MIN_SAFE_INTEGER
    const lastPrice = this.storage.dataList[dataSize - 1].close
    let priceY = this.yAxisRender.getY(lastPrice)
    const height = this.handler.contentBottom() - this.handler.contentTop()
    priceY = +(Math.max(height * 0.05, Math.min(priceY, height * 0.98))).toFixed(0)
    const color = lastPrice > preLastPrice ? lastPriceMark.increasingColor : lastPriceMark.decreasingColor
    let lineStartX = this.handler.contentLeft()
    let lineEndX = this.handler.contentRight()
    const priceMarkText = lastPriceMark.text
    const displayText = priceMarkText.display
    if (displayText) {
      const text = formatPrecision(lastPrice, pricePrecision)
      const textSize = lastPriceMark.text.size
      const rectWidth = calcTextWidth(textSize, text) + priceMarkText.paddingLeft + priceMarkText.paddingRight
      const rectHeight = priceMarkText.paddingTop + textSize + priceMarkText.paddingBottom
      let rectStartX
      if (isRenderTextOutside) {
        if (isRenderTextLeft) {
          rectStartX = lineStartX - rectWidth
        } else {
          rectStartX = lineEndX
        }
      } else {
        if (isRenderTextLeft) {
          rectStartX = lineStartX
          lineStartX += rectWidth
        } else {
          rectStartX = lineEndX - rectWidth
          lineEndX = rectStartX
        }
      }
      ctx.fillStyle = color
      ctx.fillRect(rectStartX, priceY - priceMarkText.paddingTop - textSize / 2, rectWidth, rectHeight)
      ctx.fillStyle = priceMarkText.color
      ctx.font = getFont(textSize)
      ctx.textBaseline = 'middle'
      ctx.fillText(text, rectStartX + priceMarkText.paddingLeft, priceY)
    }
    const priceMarkLine = lastPriceMark.line
    if (priceMarkLine.display) {
      ctx.strokeStyle = color
      ctx.lineWidth = priceMarkLine.size
      if (priceMarkLine.style === LineStyle.DASH) {
        ctx.setLineDash(priceMarkLine.dashValue)
      }
      ctx.beginPath()
      ctx.moveTo(lineStartX, priceY)
      ctx.lineTo(lineEndX, priceY)
      ctx.stroke()
      ctx.closePath()
      ctx.setLineDash([])
    }
  }

  /**
   * 绘制分时线
   * @param ctx
   * @param realTime
   */
  renderTimeLine (ctx, realTime) {
    const timeLinePoints = []
    const timeLineAreaPoints = [{ x: this.handler.contentLeft(), y: this.handler.contentBottom() }]
    const averageLinePoints = []

    const minPos = this.storage.minPos
    const range = this.storage.range
    const dataSize = this.storage.dataList.length
    const onRendering = (x, i, kLineData) => {
      const average = kLineData.average
      const closeY = this.yAxisRender.getY(kLineData.close)
      const averageY = this.yAxisRender.getY(average)
      timeLinePoints.push({ x: x, y: closeY })
      if (average || average === 0) {
        averageLinePoints.push({ x: x, y: averageY })
      }
      if (i === minPos) {
        timeLineAreaPoints.push({ x: this.handler.contentLeft(), y: closeY })
        timeLineAreaPoints.push({ x: x, y: closeY })
      } else if (i === minPos + range - 1) {
        timeLineAreaPoints.push({ x: x, y: closeY })
        timeLineAreaPoints.push({ x: this.handler.contentRight(), y: closeY })
        timeLineAreaPoints.push({ x: this.handler.contentRight(), y: this.handler.contentBottom() })
      } else if (i === dataSize - 1) {
        timeLineAreaPoints.push({ x: x, y: closeY })
        timeLineAreaPoints.push({ x: x, y: this.handler.contentBottom() })
      } else {
        timeLineAreaPoints.push({ x: x, y: closeY })
      }
    }
    const onRenderEnd = () => {
      const timeLine = realTime.timeLine
      if (timeLinePoints.length > 0) {
        // 绘制分时线
        ctx.lineWidth = timeLine.size
        ctx.strokeStyle = timeLine.color
        ctx.beginPath()
        ctx.moveTo(timeLinePoints[0].x, timeLinePoints[0].y)
        for (let i = 1; i < timeLinePoints.length; i++) {
          ctx.lineTo(timeLinePoints[i].x, timeLinePoints[i].y)
        }
        ctx.stroke()
        ctx.closePath()
      }

      if (timeLineAreaPoints.length > 0) {
        // 绘制分时线填充区域
        ctx.fillStyle = timeLine.areaFillColor
        ctx.beginPath()
        ctx.moveTo(timeLineAreaPoints[0].x, timeLineAreaPoints[0].y)
        for (let i = 1; i < timeLineAreaPoints.length; i++) {
          ctx.lineTo(timeLineAreaPoints[i].x, timeLineAreaPoints[i].y)
        }
        ctx.closePath()
        ctx.fill()
      }
      const averageLine = realTime.averageLine
      if (averageLine.display && averageLinePoints.length > 0) {
        // 绘制均线
        ctx.lineWidth = averageLine.size
        ctx.strokeStyle = averageLine.color
        ctx.beginPath()
        ctx.moveTo(averageLinePoints[0].x, averageLinePoints[0].y)
        for (let i = 1; i < averageLinePoints.length; i++) {
          ctx.lineTo(averageLinePoints[i].x, averageLinePoints[i].y)
        }
        ctx.stroke()
        ctx.closePath()
      }
    }
    this.renderGraphics(ctx, onRendering, onRenderEnd)
  }
}

export default CandleStickView

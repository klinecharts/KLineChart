import View from './View'
import { YAxisPosition, YAxisTextPosition } from '../data/options/styleOptions'
import { calcTextWidth, drawHorizontalLine, drawVerticalLine, getFont } from '../utils/canvas'
import { formatBigNumber, formatPrecision } from '../utils/format'

export default class YAxisView extends View {
  constructor (container, chartData, yAxis) {
    super(container, chartData)
    this._yAxis = yAxis
  }

  _draw () {
    const yAxisOptions = this._chartData.styleOptions().yAxis
    if (yAxisOptions.display) {
      this._drawAxisLine(yAxisOptions)
      this._drawTickLines(yAxisOptions)
      this._drawTickLabels(yAxisOptions)
      this._drawLastPriceLabel(yAxisOptions)
    }
  }

  _drawAxisLine (yAxisOptions) {
    const axisLine = yAxisOptions.axisLine
    if (!axisLine.display) {
      return
    }
    this._ctx.strokeStyle = axisLine.color
    this._ctx.lineWidth = axisLine.size
    let x
    if (this._isDrawFromStart(yAxisOptions)) {
      x = 0
    } else {
      x = this._width
    }
    drawVerticalLine(this._ctx, x, 0, this._height)
  }

  _drawTickLines (yAxisOptions) {
    const tickLine = yAxisOptions.tickLine
    if (!tickLine.display) {
      return
    }
    this._ctx.lineWidth = tickLine.size
    this._ctx.strokeStyle = tickLine.color

    const tickLineLength = tickLine.length

    let startX
    let endX
    if (this._isDrawFromStart(yAxisOptions)) {
      startX = 0
      if (yAxisOptions.axisLine.display) {
        startX += yAxisOptions.axisLine.size
      }
      endX = startX + tickLineLength
    } else {
      startX = this._width
      if (yAxisOptions.axisLine.display) {
        startX -= yAxisOptions.axisLine.size
      }
      endX = startX - tickLineLength
    }
    this._yAxis.ticks().forEach(tick => {
      drawHorizontalLine(this._ctx, tick.y, startX, endX)
    })
  }

  _drawTickLabels (yAxisOptions) {
    const tickText = yAxisOptions.tickText
    if (!tickText.display) {
      return
    }
    const tickLine = yAxisOptions.tickLine
    const tickLineDisplay = tickLine.display
    const tickLineLength = tickLine.length
    const tickTextMargin = tickText.margin
    let labelX
    if (this._isDrawFromStart(yAxisOptions)) {
      labelX = tickTextMargin
      if (yAxisOptions.axisLine.display) {
        labelX += yAxisOptions.axisLine.size
      }
      if (tickLineDisplay) {
        labelX += tickLineLength
      }
      this._ctx.textAlign = 'left'
    } else {
      labelX = this._width - tickTextMargin
      if (yAxisOptions.axisLine.display) {
        labelX -= yAxisOptions.axisLine.size
      }
      if (tickLineDisplay) {
        labelX -= tickLineLength
      }
      this._ctx.textAlign = 'right'
    }
    const textSize = tickText.size
    this._ctx.textBaseline = 'middle'
    this._ctx.font = getFont(textSize)
    this._ctx.fillStyle = tickText.color
    this._yAxis.ticks().forEach(tick => {
      const text = formatBigNumber(tick.v)
      this._ctx.fillText(text, labelX, tick.y)
    })
    this._ctx.textAlign = 'left'
  }

  /**
   * 绘制最新价文字
   * @private
   */
  _drawLastPriceLabel (yAxisOptions) {
    if (!this._yAxis.isCandleStickYAxis()) {
      return
    }
    const priceMark = this._chartData.styleOptions().candleStick.priceMark
    const lastPriceMark = priceMark.last
    const dataList = this._chartData.dataList()
    const dataSize = dataList.length
    if (!priceMark.display || !lastPriceMark.display || !lastPriceMark.text.display || dataSize === 0) {
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
    const priceMarkText = lastPriceMark.text
    const text = formatPrecision(lastPrice, this._chartData.precisionOptions().price)
    const textSize = lastPriceMark.text.size
    this._ctx.font = getFont(textSize)
    const rectWidth = calcTextWidth(this._ctx, text) + priceMarkText.paddingLeft + priceMarkText.paddingRight
    const rectHeight = priceMarkText.paddingTop + textSize + priceMarkText.paddingBottom
    let rectStartX
    if (this._isDrawFromStart(yAxisOptions)) {
      rectStartX = 0
    } else {
      rectStartX = this._width - rectWidth
    }
    this._ctx.fillStyle = color
    this._ctx.fillRect(rectStartX, priceY - priceMarkText.paddingTop - textSize / 2, rectWidth, rectHeight)
    this._ctx.fillStyle = priceMarkText.color
    this._ctx.textBaseline = 'middle'
    this._ctx.fillText(text, rectStartX + priceMarkText.paddingLeft, priceY)
  }

  /**
   * 判断是否从开始点绘制
   * @private
   */
  _isDrawFromStart (yAxisOptions) {
    return ((yAxisOptions.position === YAxisPosition.LEFT && yAxisOptions.tickText.position === YAxisTextPosition.INSIDE) ||
      (yAxisOptions.position === YAxisPosition.RIGHT && yAxisOptions.tickText.position === YAxisTextPosition.OUTSIDE))
  }
}

import AxisView from './AxisView'
import { YAxisPosition, YAxisTextPosition } from '../data/options/styleOptions'
import { calcTextWidth, getFont } from '../utils/canvas'
import { formatBigNumber, formatPrecision } from '../utils/format'

export default class YAxisView extends AxisView {
  _draw () {
    super._draw()
    this._drawLastPriceLabel()
  }

  _drawAxisLine () {
    const yAxis = this._chartData.styleOptions().yAxis
    if (!yAxis.display || !yAxis.axisLine.display) {
      return
    }
    const lineSize = yAxis.axisLine.size
    this._ctx.strokeStyle = yAxis.axisLine.color
    this._ctx.lineWidth = lineSize
    this._ctx.beginPath()
    if (
      (yAxis.position === YAxisPosition.LEFT && yAxis.tickText.position === YAxisTextPosition.INSIDE) ||
      (yAxis.position === YAxisPosition.RIGHT && yAxis.tickText.position === YAxisTextPosition.OUTSIDE)
    ) {
      const x = lineSize / 2
      this._ctx.moveTo(x, 0)
      this._ctx.lineTo(x, this._height)
    } else {
      const x = this._width - lineSize / 2
      this._ctx.moveTo(x, 0)
      this._ctx.lineTo(x, this._height)
    }
    this._ctx.stroke()
    this._ctx.closePath()
  }

  _drawTickLines () {
    const yAxis = this._chartData.styleOptions().yAxis
    const tickText = yAxis.tickText
    if (!yAxis.display || !tickText.display) {
      return
    }
    const tickLine = yAxis.tickLine
    this._ctx.lineWidth = tickLine.size
    this._ctx.strokeStyle = tickLine.color

    const tickLineLength = tickLine.length

    let startX
    let endX
    const tickTextPosition = tickText.position
    if (
      (yAxis.position === YAxisPosition.LEFT && tickTextPosition === YAxisTextPosition.INSIDE) ||
      (yAxis.position === YAxisPosition.RIGHT && tickTextPosition === YAxisTextPosition.OUTSIDE)
    ) {
      startX = 0
      if (yAxis.axisLine.display) {
        startX += yAxis.axisLine.size
      }
      endX = startX + tickLineLength
    } else {
      startX = this._width
      if (yAxis.axisLine.display) {
        startX -= yAxis.axisLine.size
      }
      endX = startX - tickLineLength
    }
    this._axis.ticks().forEach(tick => {
      const y = tick.y
      this._ctx.beginPath()
      this._ctx.moveTo(startX, y)
      this._ctx.lineTo(endX, y)
      this._ctx.stroke()
      this._ctx.closePath()
    })
  }

  _drawTickLabels () {
    const yAxis = this._chartData.styleOptions().yAxis
    const tickText = yAxis.tickText
    if (!yAxis.display || !tickText.display) {
      return
    }
    const tickLine = yAxis.tickLine
    const tickTextPosition = tickText.position
    const tickLineDisplay = tickLine.display
    const tickLineLength = tickLine.length
    const tickTextMargin = tickText.margin
    let labelX
    if (
      (yAxis.position === YAxisPosition.LEFT && tickTextPosition === YAxisTextPosition.INSIDE) ||
      (yAxis.position === YAxisPosition.RIGHT && tickTextPosition === YAxisTextPosition.OUTSIDE)
    ) {
      labelX = tickTextMargin
      if (yAxis.axisLine.display) {
        labelX += yAxis.axisLine.size
      }
      if (tickLineDisplay) {
        labelX += tickLineLength
      }
      this._ctx.textAlign = 'left'
    } else {
      labelX = this.width - tickTextMargin
      if (yAxis.axisLine.display) {
        labelX -= yAxis.axisLine.size
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
    this._axis.ticks().forEach(tick => {
      const text = formatBigNumber(tick.v)
      this._ctx.fillText(text, labelX, tick.y)
    })
    this._ctx.textAlign = 'left'
  }

  /**
   * 绘制最新价文字
   * @private
   */
  _drawLastPriceLabel () {
    if (!this._axis.isCandleStickYAxis()) {
      return
    }
    const priceMark = this._chartData.styleOptions().candleStick.priceMark
    const lastPriceMark = priceMark.last
    const dataList = this._chartData.dataList()
    const dataSize = dataList.length
    if (!priceMark.display || !lastPriceMark.display || !lastPriceMark.text.display || dataSize === 0) {
      return
    }
    const preKLineData = dataList[dataSize - 2] || {}
    const preLastPrice = preKLineData.close || -Infinity
    const lastPrice = dataList[dataSize - 1].close
    let priceY = this._axis.convertToPixel(lastPrice)
    priceY = +(Math.max(this._height * 0.05, Math.min(priceY, this._height * 0.98))).toFixed(0)
    const color = lastPrice > preLastPrice ? lastPriceMark.upColor : lastPriceMark.downColor
    const priceMarkText = lastPriceMark.text
    const text = formatPrecision(lastPrice, this._chartData.precisionOptions().price)
    const textSize = lastPriceMark.text.size
    this._ctx.font = getFont(textSize)
    const rectWidth = calcTextWidth(this._ctx, text) + priceMarkText.paddingLeft + priceMarkText.paddingRight
    const rectHeight = priceMarkText.paddingTop + textSize + priceMarkText.paddingBottom
    let rectStartX
    const yAxis = this._chartData.styleOptions().yAxis
    if (
      (yAxis.position === YAxisPosition.LEFT && yAxis.tickText.position === YAxisTextPosition.INSIDE) ||
      (yAxis.position === YAxisPosition.RIGHT && yAxis.tickText.position === YAxisTextPosition.OUTSIDE)
    ) {
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
}

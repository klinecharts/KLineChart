/*
  BINANY View
*/
import TechnicalIndicatorView from './TechnicalIndicatorView'
import { hexToRGBA } from '../utils/canvas'
import { renderFillCircle } from '../renderer/circle'
import { roundRect } from '../renderer/rect'
import { renderVerticalLine } from '../renderer/line'
import { drawDeal } from '../renderer/deal'
import { createFont } from '../utils/canvas'

export default class BinanyView extends TechnicalIndicatorView {
  constructor (container, chartData, xAxis, yAxis, additionalDataProvider) {
    super(container, chartData, xAxis, yAxis, additionalDataProvider)
    this._pricePointX, this._pricePointY
    this.animationState = 0
  }

  _draw () {
    this.timestampNow = new Date().getTime()
    this.animationState = (this.timestampNow % 1000) / 1000

    this._updateLastPricePointPosition()
    this._drawTradeStartEndDuration()
    this._drawLastPriceCircle()
    this._drawTrades()
    this._drawTimer()
  }

  _updateLastPricePointPosition () {
    const dataList = this._chartData.dataList()
    const pos = dataList.length - 1
    const lastCandle = dataList.last()

    if (!lastCandle) {
      return
    }

    const close = lastCandle.close
    let priceX = this._xAxis.convertToPixel(pos)
    let priceY = this._yAxis.convertToPixel(close)
    priceY = +(Math.max(this._height * 0.05, Math.min(priceY, this._height * 0.98))).toFixed(0)

    this._pricePointX = priceX
    this._pricePointY = priceY
  }

  _drawLastPriceCircle () {
    const isOffline = !this._chartData._isOnline
    const style = this._chartData.styleOptions().binany.lastPriceMark

    this._ctx.save()
    renderFillCircle(this._ctx, isOffline ? style.offlineColor : style.color, { x: this._pricePointX, y: this._pricePointY }, 3)

    if (isOffline) {
      return null
    }

    const color = hexToRGBA(style.color, (1 - this.animationState) / 2)
    const r = this.animationState * 15

    renderFillCircle(this._ctx, color, { x: this._pricePointX, y: this._pricePointY }, r)
    this._ctx.restore()
  }

  _drawTradeStartEndDuration () {
    const style = this._chartData.styleOptions().binany.tradeDuration
    const tradeDurationInTF = this._chartData._tradeDuration / this._chartData._timeframe

    if (!tradeDurationInTF) {
      return null
    }

    this._ctx.save()
    this._ctx.strokeStyle = style.color
    this._ctx.lineWidth = 1
    this._ctx.setLineDash([6, 4])
    // start of trade line
    renderVerticalLine(this._ctx, this._pricePointX - 0.5, 0, this._height)

    // end of trade
    this._ctx.setLineDash([10, 0])
    renderVerticalLine(this._ctx, this._pricePointX + this._chartData._dataSpace * tradeDurationInTF, 0, this._height)

    if (style.text.show) {
      this._ctx.font = createFont(style.text.size, 'normal', 'Helvetica Neue')
      this._ctx.textBaseline = 'middle'
      this._ctx.fillStyle = style.text.color
      this._ctx.textAlign = 'right'
      this._ctx.fillText(this._chartData.getLocales().tradeStarts, this._pricePointX - 20, 15)
      this._ctx.textAlign = 'left'
      this._ctx.fillText(this._chartData.getLocales().endOfTrade, this._pricePointX + this._chartData._dataSpace * tradeDurationInTF + 20, 15)
    }

    this._ctx.restore()
  }

  _drawTimer () {
    const chartType = this._chartData.styleOptions().candle.type

    if (!this._chartData._isOnline || chartType === 'area') {
      return null
    }

    const formatTime = (i) => `0${i}`.slice(-2)

    const dataList = this._chartData.dataList()
    const lastCandle = dataList.last()

    if (!lastCandle || !this._chartData._lastOnline || !this._chartData._timeframe || this._chartData._timeframe < 1) {
      return null
    }

    const seconds = Math.round((this._chartData._timeframe * 1000 - Math.floor(this._chartData._lastOnline - lastCandle.timestamp)) / 1000)

    const height = 10
    const text = `${formatTime(Math.floor(seconds / 60))}:${formatTime(seconds % 60)}`
    const x = this._pricePointX + 40
    const y = this._pricePointY

    this._ctx.save()
    this._ctx.font = `14px sans-serif`
    this._ctx.strokeStyle = `white`
  
    const width = this._ctx.measureText(text).width
  
    this._ctx.fillStyle = "#2B3257"
    roundRect(this._ctx, x - 10, y - 16, width + 20, height + 20, 2, true, false)
    this._ctx.fillStyle = hexToRGBA(`#ffffff`, 0.8)
    this._ctx.textBaseline = 'middle'
    this._ctx.fillText(text, x, y)
    this._ctx.restore()
  }

  _drawTrades () {
    const trades = this._chartData._trades

    if (trades.length < 1) {
      return null
    }

    let firstDealPointX = 0

    trades.forEach(({
      // symbolId,
      // status,
      priceOpen,
      // priceClose,
      // accountType,
      // profitPercent,
      direction,
      createdAt,
      closedAt,
      amount
    }, i) => {
      const startXTimestamp = new Date(createdAt).getTime()
      const endXTimestamp = new Date(closedAt).getTime()
      const lastCandleTimestamp = this._chartData.dataList().last().timestamp
      const tradeStartedOnLastCandle = startXTimestamp > lastCandleTimestamp
      const startPosX = this._xAxis.convertToPixel(this._chartData.timestampToDataIndex(startXTimestamp) + (tradeStartedOnLastCandle ? 1 : 0))

      if (i === 0) {
        firstDealPointX = startPosX
      }

      const dealBadgeX = firstDealPointX - 100 * (i + 1)
      const tradeDuration = Math.round((endXTimestamp - startXTimestamp) / 1000)
      const endPosX = startPosX + (this._chartData._dataSpace * tradeDuration / this._chartData._timeframe)
      const posY = this._yAxis.convertToPixel(priceOpen)

      const { symbol, symbolPosition } = this._chartData._userCurrency
      const text = symbolPosition === 'right' ? `${amount} ${symbol}` : `${symbol} ${amount}`

      drawDeal(this._ctx, {
        x: dealBadgeX,
        y: posY,
        direction,
        left: startPosX,
        right: endPosX,
        text,
      }, this._chartData._isMobile)
    })
  }
}
import View from './View'
import { drawHorizontalLine, drawVerticalLine, getFont } from '../utils/canvas'

export default class XAxisView extends View {
  constructor (container, chartData, xAxis) {
    super(container, chartData)
    this._xAxis = xAxis
  }

  _draw () {
    const xAxisOptions = this._chartData.styleOptions().xAxis
    if (xAxisOptions.display) {
      this._drawAxisLine(xAxisOptions)
      this._drawTickLines(xAxisOptions)
      this._drawTickLabels(xAxisOptions)
    }
  }

  _drawAxisLine (xAxisOptions) {
    const xAxisLine = xAxisOptions.axisLine
    if (!xAxisLine.display) {
      return
    }
    this._ctx.strokeStyle = xAxisLine.color
    this._ctx.lineWidth = xAxisLine.size
    drawHorizontalLine(this._ctx, 0, 0, this._width)
  }

  _drawTickLines (xAxisOptions) {
    const tickLine = xAxisOptions.tickLine
    if (!tickLine.display) {
      return
    }
    this._ctx.lineWidth = tickLine.size
    this._ctx.strokeStyle = tickLine.color

    const startY = xAxisOptions.axisLine.display ? xAxisOptions.axisLine.size : 0

    const endY = startY + tickLine.length
    this._xAxis.ticks().forEach(tick => {
      drawVerticalLine(this._ctx, tick.x, startY, endY)
    })
  }

  _drawTickLabels (xAxisOptions) {
    const tickText = xAxisOptions.tickText
    if (!tickText.display) {
      return
    }
    const tickLine = xAxisOptions.tickLine

    this._ctx.textBaseline = 'top'
    this._ctx.font = getFont(tickText.size)
    this._ctx.textAlign = 'center'
    this._ctx.fillStyle = tickText.color

    let labelY = tickText.margin
    if (xAxisOptions.axisLine.display) {
      labelY += (xAxisOptions.axisLine.size)
    }
    if (tickLine.display) {
      labelY += (tickLine.length)
    }
    const ticks = this._xAxis.ticks()
    const tickLength = ticks.length
    for (let i = 0; i < tickLength; i++) {
      this._ctx.fillText(ticks[i].v, ticks[i].x, labelY)
    }
  }
}

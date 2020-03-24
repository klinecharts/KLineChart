import AxisView from './AxisView'
import { getFont } from '../utils/canvas'

export default class XAxisView extends AxisView {
  _drawAxisLine () {
    const xAxis = this._chartData.styleOptions().xAxis
    if (!xAxis.display || !xAxis.axisLine.display) {
      return
    }
    const lineSize = xAxis.axisLine.size
    const y = lineSize / 2
    this._ctx.strokeStyle = xAxis.axisLine.color
    this._ctx.lineWidth = lineSize
    this._ctx.beginPath()
    this._ctx.moveTo(0, y)
    this._ctx.lineTo(this._width, y)
    this._ctx.stroke()
    this._ctx.closePath()
  }

  _drawTickLines () {
    const xAxis = this._chartData.styleOptions().xAxis
    const tickLine = xAxis.tickLine
    if (!xAxis.display || !tickLine.display) {
      return
    }
    this._ctx.lineWidth = tickLine.size
    this._ctx.strokeStyle = tickLine.color

    const startY = xAxis.axisLine.display ? xAxis.axisLine.size : 0

    const endY = startY + tickLine.length
    this._axis.ticks().forEach(tick => {
      const x = tick.x
      this._ctx.beginPath()
      this._ctx.moveTo(x, startY)
      this._ctx.lineTo(x, endY)
      this._ctx.stroke()
      this._ctx.closePath()
    })
  }

  _drawTickLabels () {
    const xAxis = this._chartData.styleOptions().xAxis
    const tickText = xAxis.tickText
    if (!xAxis.display || !tickText.display) {
      return
    }
    const tickLine = xAxis.tickLine

    this._ctx.textBaseline = 'top'
    this._ctx.font = getFont(tickText.size)
    this._ctx.textAlign = 'center'
    this._ctx.fillStyle = tickText.color

    let labelY = tickText.margin
    if (xAxis.axisLine.display) {
      labelY += (xAxis.axisLine.size)
    }
    if (tickLine.display) {
      labelY += (tickLine.length)
    }
    const ticks = this._axis.ticks()
    const tickLength = ticks.length
    for (let i = 0; i < tickLength; i++) {
      this._ctx.fillText(ticks[i].v, ticks[i].x, labelY)
    }
  }
}

import AxisView from './AxisView'
import { getFont } from '../utils/canvas'
import { formatDate } from '../utils/format'

export default class XAxisView extends AxisView {
  _drawAxisLine () {
    const xAxis = this._chartData.styleOptions().xAxis
    if (!xAxis.display || !xAxis.line.display) {
      return
    }
    this._ctx.strokeStyle = xAxis.line.color
    this._ctx.lineWidth = xAxis.line.size
    this._ctx.beginPath()
    this._ctx.moveTo(0, 0)
    this._ctx.lineTo(this._width, 0)
    this._ctx.stroke()
    this._ctx.closePath()
  }

  _drawTickLines () {
    const xAxis = this._chartData.styleOptions().xAxis
    const tickLine = xAxis.tick.line
    if (!xAxis.display || !tickLine.display) {
      return
    }
    this._ctx.lineWidth = tickLine.size
    this._ctx.strokeStyle = tickLine.color

    const startY = xAxis.line.display ? xAxis.line.size : 0

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
    const tickText = xAxis.tick.text
    if (!xAxis.display || !tickText.display) {
      return
    }
    const tickLine = xAxis.tick.line

    this._ctx.textBaseline = 'top'
    this._ctx.font = getFont(tickText.size)
    this._ctx.textAlign = 'center'
    this._ctx.fillStyle = tickText.color

    let labelY = tickText.margin
    if (xAxis.line.display) {
      labelY += (xAxis.line.size)
    }
    if (tickLine.display) {
      labelY += (tickLine.length)
    }
    const dataList = this._chartData.dataList()
    const ticks = this._axis.ticks()
    const tickLength = ticks.length
    for (let i = 0; i < tickLength; i++) {
      const x = ticks[i].x
      const dataPos = parseInt(ticks[i].v)
      const kLineData = dataList[dataPos]
      const timestamp = kLineData.timestamp
      let dateText = formatDate(timestamp, this._axis.tickLabelFormatType())
      if (i !== tickLength - 1) {
        const nextDataPos = parseInt(ticks[i + 1].v)
        const nextKLineData = dataList[nextDataPos]
        const nextTimestamp = nextKLineData.timestamp
        const year = formatDate(timestamp, 'YYYY')
        const month = formatDate(timestamp, 'YYYY-MM')
        const day = formatDate(timestamp, 'MM-DD')
        if (year !== formatDate(nextTimestamp, 'YYYY')) {
          dateText = year
        } else if (month !== formatDate(nextTimestamp, 'YYYY-MM')) {
          dateText = month
        } else if (day !== formatDate(nextTimestamp, 'MM-DD')) {
          dateText = day
        }
      }
      this._ctx.fillText(dateText, x, labelY)
    }
  }
}

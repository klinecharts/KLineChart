import Axis from './Axis'
import { calcTextWidth, getFont, getPixelRatio } from '../utils/canvas'
import { formatDate, formatValue } from '../utils/format'

export default class XAxis extends Axis {
  constructor (chartData) {
    super(chartData)
    this._initMeasureCanvas()
  }

  _initMeasureCanvas () {
    const measureCanvas = document.createElement('canvas')
    this._measureCtx = measureCanvas.getContext('2d')
    const pixelRatio = getPixelRatio(this._measureCtx)
    this._measureCtx.scale(pixelRatio, pixelRatio)
  }

  _computeMinMaxValue () {
    const min = this._chartData.from()
    const max = this._chartData.to() - 1
    const range = max - min
    return { min, max, range }
  }

  _computeOptimalTicks (ticks) {
    const optimalTicks = []
    const tickLength = ticks.length
    const dataList = this._chartData.dataList()
    if (tickLength > 0) {
      const timezone = this._chartData.timezone()
      const fontSize = this._chartData.styleOptions().xAxis.tickText.size
      this._measureCtx.font = getFont(fontSize)
      const defaultLabelWidth = calcTextWidth(this._measureCtx, '00-00 00:00')
      const pos = parseInt(ticks[0].v)
      const timestamp = formatValue(dataList[pos], 'timestamp', 0)
      const x = this.convertToPixel(pos)
      let tickCountDif = 1
      let tickLabelFormatType = 'MM:DD hh:mm'
      if (tickLength > 1) {
        const nextPos = parseInt(ticks[1].v)
        const nextTimestamp = formatValue(dataList[nextPos], 'timestamp', 0)
        const nextX = this.convertToPixel(nextPos)
        const xDif = Math.abs(nextX - x)
        if (xDif < defaultLabelWidth) {
          tickCountDif = Math.ceil(defaultLabelWidth / xDif)
        }
        const timeDif = nextTimestamp - timestamp
        const minuteDif = timeDif / 1000 / 60
        if (minuteDif < 12 * 60) {
          tickLabelFormatType = 'hh:mm'
        } else if (minuteDif < 15 * 24 * 60) {
          tickLabelFormatType = 'MM-DD'
        } else if (minuteDif < 180 * 24 * 60) {
          tickLabelFormatType = 'YYYY-MM'
        } else {
          tickLabelFormatType = 'YYYY'
        }
      }
      for (let i = 0; i < tickLength; i += tickCountDif) {
        const pos = parseInt(ticks[i].v)
        const kLineData = dataList[pos]
        const timestamp = kLineData.timestamp
        let label = formatDate(timestamp, tickLabelFormatType, timezone)
        if (i <= tickLength - 1 - tickCountDif) {
          const nextPos = parseInt(ticks[i + tickCountDif].v)
          const nextKLineData = dataList[nextPos]
          const nextTimestamp = nextKLineData.timestamp
          const year = formatDate(timestamp, 'YYYY', timezone)
          const month = formatDate(timestamp, 'YYYY-MM', timezone)
          const day = formatDate(timestamp, 'MM-DD', timezone)
          if (year !== formatDate(nextTimestamp, 'YYYY', timezone)) {
            label = year
          } else if (month !== formatDate(nextTimestamp, 'YYYY-MM', timezone)) {
            label = month
          } else if (day !== formatDate(nextTimestamp, 'MM-DD', timezone)) {
            label = day
          }
        }

        const x = this.convertToPixel(pos)
        if (x > defaultLabelWidth / 2 &&
          x < this._width - defaultLabelWidth / 2) {
          optimalTicks.push({ v: label, x })
        }
      }
      if (optimalTicks.length === 0) {
        const pos = parseInt(ticks[ticks.length - 1].v)
        const timestamp = dataList[pos].timestamp
        const x = this.convertToPixel(pos)
        optimalTicks.push({ v: formatDate(timestamp, 'MM-DD', timezone), x })
      }
    }
    return optimalTicks
  }

  convertFromPixel (pixel) {
    const dataSpace = this._chartData.dataSpace()
    const range = Math.ceil(pixel / dataSpace)
    let dataPos = this._chartData.from() + range - 1
    const to = this._chartData.to()
    if (dataPos > to - 1) {
      dataPos = to - 1
    }
    return dataPos
  }

  convertToPixel (value) {
    return (value - this._chartData.from()) * this._chartData.dataSpace() + this._chartData.barSpace() / 2
  }
}

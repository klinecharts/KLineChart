import Axis from './Axis'
import { calcTextWidth, getFont, getPixelRatio } from '../utils/canvas'
import { formatDate } from '../utils/format'

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
      const x = this.convertToPixel(pos)
      let tickCountDif = 1
      if (tickLength > 1) {
        const nextPos = parseInt(ticks[1].v)
        const nextX = this.convertToPixel(nextPos)
        const xDif = Math.abs(nextX - x)
        if (xDif < defaultLabelWidth) {
          tickCountDif = Math.ceil(defaultLabelWidth / xDif)
        }
      }
      for (let i = 0; i < tickLength; i += tickCountDif) {
        const pos = parseInt(ticks[i].v)
        const kLineData = dataList[pos]
        const timestamp = kLineData.timestamp
        let label = formatDate(timestamp, 'hh:mm', timezone)
        if (i <= tickLength - 1 - tickCountDif) {
          const nextPos = parseInt(ticks[i + tickCountDif].v)
          const nextKLineData = dataList[nextPos]
          const nextTimestamp = nextKLineData.timestamp
          label = this._optimalTickLabel(timestamp, nextTimestamp, timezone) || label
        }

        const x = this.convertToPixel(pos)
        if (x > defaultLabelWidth / 2 &&
          x < this._width - defaultLabelWidth / 2) {
          optimalTicks.push({ v: label, x, oV: timestamp })
        }
      }
      const optimalTickLength = optimalTicks.length
      if (optimalTickLength === 0) {
        const pos = parseInt(ticks[ticks.length - 1].v)
        const timestamp = dataList[pos].timestamp
        const x = this.convertToPixel(pos)
        optimalTicks.push({ v: formatDate(timestamp, 'MM-DD', timezone), x, oV: timestamp })
      } else if (optimalTickLength > 1) {
        const lastTimestamp = optimalTicks[optimalTickLength - 1].oV
        const lastV = optimalTicks[optimalTickLength - 1].v
        const secondLastTimestamp = optimalTicks[optimalTickLength - 2].oV
        optimalTicks[optimalTickLength - 1].v = this._optimalTickLabel(lastTimestamp, secondLastTimestamp, timezone) || lastV
      }
    }
    return optimalTicks
  }

  _optimalTickLabel (timestamp, comparedTimestamp, timezone) {
    const year = formatDate(timestamp, 'YYYY', timezone)
    const month = formatDate(timestamp, 'YYYY-MM', timezone)
    const day = formatDate(timestamp, 'MM-DD', timezone)
    if (year !== formatDate(comparedTimestamp, 'YYYY', timezone)) {
      return year
    } else if (month !== formatDate(comparedTimestamp, 'YYYY-MM', timezone)) {
      return month
    } else if (day !== formatDate(comparedTimestamp, 'MM-DD', timezone)) {
      return day
    }
    return null
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

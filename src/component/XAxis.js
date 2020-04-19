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
      const tickText = this._chartData.styleOptions().xAxis.tickText
      this._measureCtx.font = getFont(tickText.size, tickText.family)
      const defaultLabelWidth = calcTextWidth(this._measureCtx, '00-00 00:00')
      const pos = parseInt(ticks[0].v, 10)
      const x = this.convertToPixel(pos)
      let tickCountDif = 1
      if (tickLength > 1) {
        const nextPos = parseInt(ticks[1].v, 10)
        const nextX = this.convertToPixel(nextPos)
        const xDif = Math.abs(nextX - x)
        if (xDif < defaultLabelWidth) {
          tickCountDif = Math.ceil(defaultLabelWidth / xDif)
        }
      }
      for (let i = 0; i < tickLength; i += tickCountDif) {
        const pos = parseInt(ticks[i].v, 10)
        const kLineData = dataList[pos]
        const timestamp = kLineData.timestamp
        let label = formatDate(timestamp, 'hh:mm', timezone)
        if (i <= tickLength - 1 - tickCountDif) {
          const nextPos = parseInt(ticks[i + tickCountDif].v, 10)
          const nextKLineData = dataList[nextPos]
          const nextTimestamp = nextKLineData.timestamp
          label = this._optimalTickLabel(timestamp, nextTimestamp, timezone) || label
        }
        const x = this.convertToPixel(pos)
        optimalTicks.push({ v: label, x, oV: timestamp })
      }
      const optimalTickLength = optimalTicks.length
      if (optimalTickLength === 1) {
        optimalTicks[0].v = formatDate(optimalTicks[0].oV, 'YYYY-MM-DD hh:mm', timezone)
      } else {
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
    return Math.round(this._chartData.coordinateToFloatIndex(pixel)) - 1
  }

  convertToPixel (value) {
    const dataList = this._chartData.dataList()
    const dataSize = dataList.length
    const dataSpace = this._chartData.dataSpace()
    const deltaFromRight = dataSize + this._chartData.offsetRightBarCount() - value
    return this._width - (deltaFromRight - 0.5) * dataSpace + this._chartData.barSpace() / 2
  }
}

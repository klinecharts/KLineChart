import Axis from './Axis'
import { calcTextWidth, getFont, getPixelRatio } from '../utils/canvas'
import { formatValue } from '../utils/format'

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
      const fontSize = this._chartData.styleOptions().xAxis.tickText.size
      this._measureCtx.font = getFont(fontSize)
      const defaultLabelWidth = calcTextWidth(this._measureCtx, '00-00 00:00')
      const pos = parseInt(ticks[0].v)
      const timestamp = formatValue(dataList[pos], 'timestamp', 0)
      const x = this.convertToPixel(pos)
      let tickCountDif = 1
      this._tickLabelFormatType = 'MM:DD hh:mm'
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
          this._tickLabelFormatType = 'hh:mm'
        } else if (minuteDif < 15 * 24 * 60) {
          this._tickLabelFormatType = 'MM-DD'
        } else if (minuteDif < 180 * 24 * 60) {
          this._tickLabelFormatType = 'YYYY-MM'
        } else {
          this._tickLabelFormatType = 'YYYY'
        }
      }
      for (let i = 0; i < tickLength; i += tickCountDif) {
        const v = ticks[i].v
        const x = this.convertToPixel(v)
        if (x > defaultLabelWidth / 2 &&
          x < this._width - defaultLabelWidth / 2) {
          optimalTicks.push({ v, x })
        }
      }
    }
    return optimalTicks
  }

  tickLabelFormatType () {
    return this._tickLabelFormatType
  }

  convertFromPixel (pixel) {
    const dataSpace = this._chartData.dataSpace()
    const range = Math.floor(pixel / dataSpace)
    return this._chartData.from() + range - 1
  }

  convertToPixel (value) {
    const dataSpace = this._chartData.dataSpace()
    return Math.floor((value - this._chartData.from()) * dataSpace + this._chartData.barSpace() / 2)
  }
}

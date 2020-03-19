import Axis from './Axis'
import { calcTextWidth, getFont } from '../utils/canvas'
import { formatValue } from '../utils/format'

export default class XAxis extends Axis {
  _computeMinMaxValue () {
    const min = this.storage.minPos
    const max = Math.min(min + this.storage.range - 1, this.storage.dataList.length - 1)
    const range = max - min + 1
    return { min, max, range }
  }

  _computeOptimalTicks (ticks) {
    const optimalTicks = []
    const tickLength = ticks.length
    if (tickLength > 0) {
      const fontSize = this._chartData.styleOptions().xAxis.tick.text.fontSize
      this._ctx.font = getFont(fontSize)
      const defaultLabelWidth = calcTextWidth(this._ctx, '00-00 00:00')
      const pos = parseInt(ticks[0].v)
      const timestamp = formatValue(this.storage.dataList[pos], 'timestamp', 0)
      const x = this.getX(pos)
      let tickCountDif = 1
      this.tickLabelFormatType = 'MM:DD hh:mm'
      if (tickLength > 1) {
        const nextPos = parseInt(ticks[1].v)
        const nextTimestamp = formatValue(this.storage.dataList[nextPos], 'timestamp', 0)
        const nextX = this.getX(nextPos)
        const xDif = Math.abs(nextX - x)
        if (xDif < defaultLabelWidth) {
          tickCountDif = Math.ceil(defaultLabelWidth / xDif)
        }
        const timeDif = nextTimestamp - timestamp
        const minuteDif = timeDif / 1000 / 60
        if (minuteDif < 12 * 60) {
          this.tickLabelFormatType = 'hh:mm'
        } else if (minuteDif < 15 * 24 * 60) {
          this.tickLabelFormatType = 'MM-DD'
        } else if (minuteDif < 180 * 24 * 60) {
          this.tickLabelFormatType = 'YYYY-MM'
        } else {
          this.tickLabelFormatType = 'YYYY'
        }
      }
      for (let i = 0; i < tickLength; i += tickCountDif) {
        const v = ticks[i].v
        const x = this.getX(v)
        if (x > this.handler.contentLeft() + defaultLabelWidth / 2 &&
          x < this.handler.contentRight() - defaultLabelWidth / 2) {
          optimalTicks.push({ v, x })
        }
      }
    }
    return optimalTicks
  }

  convertFromPixel (pixel) {
  }

  convertToPixel (value) {

  }
}

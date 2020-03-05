import AxisRender from './AxisRender'

import { DATA_MARGIN_SPACE_RATE } from '../internal/Storage'
import { formatDate } from '../utils/date'
import { calcTextWidth, getFont } from '../utils/draw'
import { LineStyle } from '../internal/constants'

class XAxisRender extends AxisRender {
  /**
   * 渲染边框
   * @param ctx
   * @param xAxis
   * @param display
   */
  renderStrokeLine (ctx, xAxis, display) {
    if (!display) {
      return
    }
    ctx.strokeStyle = xAxis.line.color
    ctx.lineWidth = xAxis.line.size
    ctx.beginPath()
    ctx.moveTo(this.handler.contentLeft(), this.handler.contentTop())
    ctx.lineTo(this.handler.contentRight(), this.handler.contentTop())
    ctx.stroke()
    ctx.closePath()
  }

  /**
   * 绘制轴线
   * @param ctx
   * @param xAxis
   */
  renderAxisLine (ctx, xAxis) {
    if (!xAxis.display || !xAxis.line.display) {
      return
    }
    ctx.strokeStyle = xAxis.line.color
    ctx.lineWidth = xAxis.line.size
    ctx.beginPath()
    ctx.moveTo(this.handler.contentLeft(), this.handler.contentBottom())
    ctx.lineTo(this.handler.contentRight(), this.handler.contentBottom())
    ctx.stroke()
    ctx.closePath()
  }

  /**
   * 绘制坐标轴上的文字
   * @param ctx
   * @param xAxis
   * @param period
   */
  renderAxisLabels (ctx, xAxis, period) {
    const tickText = xAxis.tick.text
    if (!xAxis.display || !tickText.display) {
      return
    }
    const periodType = period.replace(/[1-9]/, '').toUpperCase()
    let dateFormatType
    switch (periodType) {
      case 'D':
      case 'W': {
        dateFormatType = 'YYYY-MM-DD'
        break
      }
      case 'M': {
        dateFormatType = 'YYYY-MM'
        break
      }
      case 'Y': {
        dateFormatType = 'YYYY'
        break
      }
      default: {
        dateFormatType = 'hh:mm'
        break
      }
    }
    const tickLine = xAxis.tick.line

    ctx.textBaseline = 'top'
    ctx.font = getFont(tickText.size)
    ctx.textAlign = 'center'
    ctx.fillStyle = tickText.color

    let labelY = this.handler.contentBottom() + tickText.margin
    if (tickLine.display) {
      labelY += (tickLine.length)
    }
    const valuePointLength = this.valuePoints.length
    for (let i = 0; i < valuePointLength; i++) {
      const x = this.valuePoints[i]
      const kLineModel = this.storage.dataList[parseInt(this.values[i])]
      const timestamp = kLineModel.timestamp
      let dateText = formatDate(timestamp, dateFormatType)
      if (i !== valuePointLength - 1) {
        const nextKLineModel = this.storage.dataList[parseInt(this.values[i + 1])]
        const nextTimestamp = nextKLineModel.timestamp
        if (periodType === 'D' || periodType === 'W') {
          const month = formatDate(timestamp, 'YYYY-MM')
          if (month !== formatDate(nextTimestamp, 'YYYY-MM')) {
            dateText = month
          }
        } else if (periodType === 'M') {
          const year = formatDate(timestamp, 'YYYY')
          if (year !== formatDate(nextTimestamp, 'YYYY')) {
            dateText = year
          }
        } else if (!periodType) {
          const day = formatDate(timestamp, 'MM-DD')
          if (day !== formatDate(nextTimestamp, 'MM-DD')) {
            dateText = day
          }
        }
      }
      ctx.fillText(dateText, x, labelY)
    }
  }

  /**
   * 绘制分割线
   * @param ctx
   * @param xAxis
   */
  renderSeparatorLines (ctx, xAxis) {
    if (!xAxis.display || !xAxis.separatorLine.display) {
      return
    }
    ctx.strokeStyle = xAxis.separatorLine.color
    ctx.lineWidth = xAxis.separatorLine.size
    if (xAxis.separatorLine.style === LineStyle.DASH) {
      ctx.setLineDash(xAxis.separatorLine.dashValue)
    }
    for (let i = 0; i < this.valuePoints.length; i++) {
      const x = this.valuePoints[i]
      ctx.beginPath()
      ctx.moveTo(x, this.handler.contentTop())
      ctx.lineTo(x, this.handler.contentBottom())
      ctx.stroke()
      ctx.closePath()
    }
    ctx.setLineDash([])
  }

  /**
   * 绘制tick线
   * @param ctx
   * @param xAxis
   */
  renderTickLines (ctx, xAxis) {
    const tickLine = xAxis.tick.line
    if (!xAxis.display || !tickLine.display) {
      return
    }
    ctx.lineWidth = tickLine.size
    ctx.strokeStyle = tickLine.color

    const startY = this.handler.contentBottom()

    const endY = startY + tickLine.length

    for (let i = 0; i < this.valuePoints.length; i++) {
      const x = this.valuePoints[i]
      ctx.beginPath()
      ctx.moveTo(x, startY)
      ctx.lineTo(x, endY)
      ctx.stroke()
      ctx.closePath()
    }
  }

  computeAxis (xAxis) {
    const minPos = this.storage.minPos
    const max = Math.min(minPos + this.storage.range - 1, this.storage.dataList.length - 1)
    this.computeAxisValues(minPos, max, 8.0, xAxis)
    this.pointValuesToPixel()
  }

  fixComputeAxisValues (xAxis) {
    const dataSize = this.storage.dataList.length
    if (dataSize > 0) {
      const defaultLabelWidth = calcTextWidth(xAxis.tick.text.size, '0000-00-00 00:00:00')
      let startPos = Math.ceil(defaultLabelWidth / 2 / this.storage.dataSpace) - 1
      if (startPos > dataSize - 1) {
        startPos = dataSize - 1
      }
      const barCount = Math.ceil(defaultLabelWidth / (this.storage.dataSpace * (1 + DATA_MARGIN_SPACE_RATE))) + 1
      if (dataSize > barCount) {
        this.valueCount = Math.floor((dataSize - startPos) / barCount) + 1
      } else {
        this.valueCount = 1
      }
      this.values = [startPos]
      for (let i = 1; i < this.valueCount; i++) {
        this.values[i] = startPos + i * (barCount - 1)
      }
    } else {
      this.valueCount = 0
      this.values = []
    }
  }

  pointValuesToPixel () {
    const offsetLeft = this.handler.contentLeft()
    this.valuePoints = []
    for (let i = 0; i < this.values.length; i++) {
      const pos = this.values[i]
      this.valuePoints[i] = offsetLeft + ((pos - this.storage.minPos) * this.storage.dataSpace + this.storage.dataSpace * (1 - DATA_MARGIN_SPACE_RATE) / 2)
    }
  }

  calcRange (max, min) {
    if (max < 0) {
      return 0
    }
    return Math.abs(max - min) + 1
  }

  isFillChart () {
    return this.storage.dataList.length > this.storage.range
  }
}

export default XAxisRender

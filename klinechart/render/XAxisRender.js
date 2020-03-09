import AxisRender from './AxisRender'

import { DATA_MARGIN_SPACE_RATE } from '../internal/Storage'
import { formatDate } from '../utils/date'
import { formatValue } from '../utils/data'

import { calcTextWidth, getFont } from '../utils/draw'
import { LineStyle } from '../internal/constants'

class XAxisRender extends AxisRender {
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
   */
  renderAxisLabels (ctx, xAxis) {
    const tickText = xAxis.tick.text
    if (!xAxis.display || !tickText.display) {
      return
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
    const valueLength = this.values.length
    for (let i = 0; i < valueLength; i++) {
      const x = this.values[i].x
      const dataPos = parseInt(this.values[i].v)
      const kLineModel = this.storage.dataList[dataPos]
      const timestamp = kLineModel.timestamp
      let dateText = formatDate(timestamp, this.tickLabelFormatType)
      if (i !== valueLength - 1) {
        const nextDataPos = parseInt(this.values[i + 1].v)
        const nextKLineModel = this.storage.dataList[nextDataPos]
        const nextTimestamp = nextKLineModel.timestamp
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
    for (let i = 0; i < this.values.length; i++) {
      const x = this.values[i].x
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

    for (let i = 0; i < this.values.length; i++) {
      const x = this.values[i].x
      ctx.beginPath()
      ctx.moveTo(x, startY)
      ctx.lineTo(x, endY)
      ctx.stroke()
      ctx.closePath()
    }
  }

  computeAxis (xAxis) {
    const minPos = this.storage.minPos
    this.axisMinimum = minPos
    this.axisMaximum = Math.min(minPos + this.storage.range - 1, this.storage.dataList.length - 1)
    this.axisRange = this.axisMaximum - this.axisMinimum + 1
    this.computeAxisValues()
    this.fixComputeAxisValues(xAxis)
  }

  fixComputeAxisValues (xAxis) {
    const valueLength = this.values.length
    if (valueLength > 0) {
      const defaultLabelWidth = calcTextWidth(xAxis.tick.text.size, '00-00 00:00')
      const pos = parseInt(this.values[0].v)
      const timestamp = formatValue(this.storage.dataList[pos], 'timestamp', 0)
      const x = this.getX(pos)
      let valueCountDif = 1
      this.tickLabelFormatType = 'MM:DD hh:mm'
      if (valueLength > 1) {
        const nextPos = parseInt(this.values[1].v)
        const nextTimestamp = formatValue(this.storage.dataList[nextPos], 'timestamp', 0)
        const nextX = this.getX(nextPos)
        const xDif = Math.abs(nextX - x)
        if (xDif < defaultLabelWidth) {
          valueCountDif = Math.ceil(defaultLabelWidth / xDif)
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
      const values = []
      for (let i = 0; i < valueLength; i += valueCountDif) {
        const v = this.values[i].v
        const x = this.getX(v)
        if (x > this.handler.contentLeft() + defaultLabelWidth / 2 &&
          x < this.handler.contentRight() - defaultLabelWidth / 2) {
          values.push({ v, x })
        }
      }
      this.values = values
    }
  }

  /**
   * 获取x轴点
   * @param pos
   * @returns {*}
   */
  getX (pos) {
    return this.handler.contentLeft() + ((pos - this.storage.minPos) * this.storage.dataSpace + this.storage.dataSpace * (1 - DATA_MARGIN_SPACE_RATE) / 2)
  }
}

export default XAxisRender

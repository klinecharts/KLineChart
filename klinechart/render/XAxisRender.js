import AxisRender from './AxisRender'

import { DATA_MARGIN_SPACE_RATE } from '../internal/DataProvider'
import { formatDate, isFunction } from '../internal/utils/dataUtils'
import { calcTextWidth } from '../internal/utils/drawUtils'
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
    ctx.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentTop())
    ctx.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentTop())
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
    ctx.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentBottom())
    ctx.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentBottom())
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
    ctx.font = `${tickText.size}px Arial`
    ctx.textAlign = 'center'
    ctx.fillStyle = tickText.color

    let labelY = this.viewPortHandler.contentBottom() + tickText.margin
    if (tickLine.display) {
      labelY += (tickLine.length)
    }

    const formatter = tickText.valueFormatter
    for (let i = 0; i < this.valuePoints.length; i++) {
      const x = this.valuePoints[i]
      const kLineModel = this.dataProvider.dataList[parseInt(this.values[i])]
      const timestamp = kLineModel.timestamp
      let label = formatDate(timestamp)
      if (isFunction(formatter)) {
        label = formatter(kLineModel)
      }
      ctx.fillText(label, x, labelY)
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
      ctx.moveTo(x, this.viewPortHandler.contentTop())
      ctx.lineTo(x, this.viewPortHandler.contentBottom())
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

    const startY = this.viewPortHandler.contentBottom()

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
    const minPos = this.dataProvider.minPos
    const max = Math.min(minPos + this.dataProvider.range - 1, this.dataProvider.dataList.length - 1)
    this.computeAxisValues(minPos, max, xAxis)
    this.pointValuesToPixel()
  }

  fixComputeAxisValues (xAxis) {
    const dataSize = this.dataProvider.dataList.length
    if (dataSize > 0) {
      const defaultLabelWidth = calcTextWidth(xAxis.tick.text.size, '0000-00-00 00:00:00')
      let startPos = Math.ceil(defaultLabelWidth / 2 / this.dataProvider.dataSpace) - 1
      if (startPos > dataSize - 1) {
        startPos = dataSize - 1
      }
      const barCount = Math.ceil(defaultLabelWidth / (this.dataProvider.dataSpace * (1 + DATA_MARGIN_SPACE_RATE))) + 1
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
    const offsetLeft = this.viewPortHandler.contentLeft()
    this.valuePoints = []
    for (let i = 0; i < this.values.length; i++) {
      const pos = this.values[i]
      this.valuePoints[i] = offsetLeft + ((pos - this.dataProvider.minPos) * this.dataProvider.dataSpace + this.dataProvider.dataSpace * (1 - DATA_MARGIN_SPACE_RATE) / 2)
    }
  }

  calcRange (max, min) {
    if (max < 0) {
      return 0
    }
    return Math.abs(max - min) + 1
  }

  isFillChart () {
    return this.dataProvider.dataList.length > this.dataProvider.range
  }
}

export default XAxisRender

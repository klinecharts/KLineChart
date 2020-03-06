import AxisRender from './AxisRender'
import { formatValue } from '../utils/data'
import { LineStyle, YAxisPosition, YAxisTextPosition, IndicatorType } from '../internal/constants'
import { formatBigNumber } from '../utils/number'
import { getFont } from '../utils/draw'

class YAxisRender extends AxisRender {
  /**
   * 绘制轴线
   * @param ctx
   * @param yAxis
   */
  renderAxisLine (ctx, yAxis) {
    if (!yAxis.display || !yAxis.line.display) {
      return
    }
    ctx.strokeStyle = yAxis.line.color
    ctx.lineWidth = yAxis.line.size
    ctx.beginPath()
    if (yAxis.position === YAxisPosition.LEFT) {
      ctx.moveTo(this.handler.contentLeft(), this.handler.contentTop())
      ctx.lineTo(this.handler.contentLeft(), this.handler.contentBottom())
    } else {
      ctx.moveTo(this.handler.contentRight(), this.handler.contentTop())
      ctx.lineTo(this.handler.contentRight(), this.handler.contentBottom())
    }
    ctx.stroke()
    ctx.closePath()
  }

  /**
   * 绘制y轴上文字
   * @param ctx
   * @param yAxis
   */
  renderAxisLabels (ctx, yAxis) {
    const tickText = yAxis.tick.text
    if (!yAxis.display || !tickText.display) {
      return
    }
    const tickLine = yAxis.tick.line
    const tickTextPosition = tickText.position
    const tickLineDisplay = tickLine.display
    const tickLineLength = tickLine.length
    const tickTextMargin = tickText.margin
    let initX
    if (yAxis.position === YAxisPosition.LEFT) {
      if (tickTextPosition === YAxisTextPosition.OUTSIDE) {
        if (tickLineDisplay) {
          initX = this.handler.contentLeft() - tickLineLength - tickTextMargin
        } else {
          initX = this.handler.contentLeft() - tickTextMargin
        }
      } else {
        if (tickLineDisplay) {
          initX = this.handler.contentLeft() + tickLineLength + tickTextMargin
        } else {
          initX = this.handler.contentLeft() + tickTextMargin
        }
      }
    } else {
      if (tickTextPosition === YAxisTextPosition.OUTSIDE) {
        if (tickLineDisplay) {
          initX = this.handler.contentRight() + tickLineLength + tickTextMargin
        } else {
          initX = this.handler.contentRight() + tickTextMargin
        }
      } else {
        if (tickLineDisplay) {
          initX = this.handler.contentRight() - tickLineLength - tickTextMargin
        } else {
          initX = this.handler.contentRight() - tickTextMargin
        }
      }
    }
    const textSize = tickText.size
    ctx.textBaseline = 'middle'
    ctx.font = getFont(textSize)
    ctx.fillStyle = tickText.color

    for (let i = 0; i < this.values.length; i++) {
      const y = this.values[i].y
      const text = formatBigNumber(this.values[i].v)
      if ((yAxis.position === YAxisPosition.LEFT && tickTextPosition === YAxisTextPosition.OUTSIDE) ||
        (yAxis.position === YAxisPosition.RIGHT && tickTextPosition !== YAxisTextPosition.OUTSIDE)) {
        ctx.textAlign = 'right'
      } else {
        ctx.textAlign = 'left'
      }
      ctx.fillText(text, initX, y)
    }
    ctx.textAlign = 'left'
  }

  /**
   * 绘制y轴分割线
   * @param ctx
   * @param yAxis
   */
  renderSeparatorLines (ctx, yAxis) {
    const separatorLine = yAxis.separatorLine
    if (!yAxis.display || !separatorLine.display) {
      return
    }
    ctx.strokeStyle = separatorLine.color
    ctx.lineWidth = separatorLine.size

    if (separatorLine.style === LineStyle.DASH) {
      ctx.setLineDash(separatorLine.dashValue)
    }

    for (let i = 0; i < this.values.length; i++) {
      const y = this.values[i].y
      ctx.beginPath()
      ctx.moveTo(this.handler.contentLeft(), y)
      ctx.lineTo(this.handler.contentRight(), y)
      ctx.stroke()
      ctx.closePath()
    }
    ctx.setLineDash([])
  }

  /**
   * 绘制刻度线
   * @param ctx
   * @param yAxis
   */
  renderTickLines (ctx, yAxis) {
    const tickText = yAxis.tick.text
    if (!yAxis.display || !tickText.display) {
      return
    }
    const tickLine = yAxis.tick.line
    ctx.lineWidth = tickLine.size
    ctx.strokeStyle = tickLine.color

    const tickLineLength = tickLine.length

    let startX
    let endX
    const tickTextPosition = tickText.position
    if (yAxis.position === YAxisPosition.LEFT) {
      startX = this.handler.contentLeft()
      if (tickTextPosition === YAxisTextPosition.OUTSIDE) {
        endX = startX - tickLineLength
      } else {
        endX = startX + tickLineLength
      }
    } else {
      startX = this.handler.contentRight()
      if (tickTextPosition === YAxisTextPosition.OUTSIDE) {
        endX = startX + tickLineLength
      } else {
        endX = startX - tickLineLength
      }
    }
    for (let i = 0; i < this.values.length; i++) {
      const y = this.values[i].y
      ctx.beginPath()
      ctx.moveTo(startX, y)
      ctx.lineTo(endX, y)
      ctx.stroke()
      ctx.closePath()
    }
  }

  calcAxisMinMax (indicatorType, isMainChart = false, isRealTimeChart = false, isShowAverageLine = false) {
    const dataList = this.storage.dataList
    const min = this.storage.minPos
    const max = Math.min(min + this.storage.range, dataList.length)
    const minMaxArray = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    if (isRealTimeChart) {
      for (let i = min; i < max; i++) {
        const kLineData = dataList[i]
        const minCompareArray = [kLineData.close, minMaxArray[0]]
        const maxCompareArray = [kLineData.close, minMaxArray[1]]
        if (isShowAverageLine) {
          minCompareArray.push(kLineData.average)
          maxCompareArray.push(kLineData.average)
        }
        minMaxArray[0] = Math.min.apply(null, minCompareArray)
        minMaxArray[1] = Math.max.apply(null, maxCompareArray)
      }
    } else {
      for (let i = min; i < max; i++) {
        const kLineData = dataList[i]
        this.compareMinMax(kLineData, indicatorType, minMaxArray)
        if (isMainChart) {
          minMaxArray[0] = Math.min(kLineData.low, minMaxArray[0])
          minMaxArray[1] = Math.max(kLineData.high, minMaxArray[1])
        }
      }
      if (indicatorType === IndicatorType.VOL) {
        minMaxArray[0] = 0
      }
    }

    if (minMaxArray[0] !== Number.MAX_SAFE_INTEGER && minMaxArray[1] !== Number.MIN_SAFE_INTEGER) {
      this.axisMinimum = minMaxArray[0]
      this.axisMaximum = minMaxArray[1]
    }
  }

  compareMinMax (kLineData, indicatorType, minMaxArray) {
    const indicatorData = formatValue(kLineData, indicatorType.toLowerCase(), {})
    Object.keys(indicatorData).forEach(key => {
      const value = indicatorData[key]
      if (value || value === 0) {
        minMaxArray[0] = Math.min(minMaxArray[0], value)
        minMaxArray[1] = Math.max(minMaxArray[1], value)
      }
    })
    if (indicatorType === IndicatorType.BOLL || indicatorType === IndicatorType.SAR) {
      minMaxArray[0] = Math.min(minMaxArray[0], kLineData.low)
      minMaxArray[1] = Math.max(minMaxArray[1], kLineData.high)
    }
    return minMaxArray
  }

  computeAxis (yAxis) {
    let min = this.axisMinimum
    let max = this.axisMaximum
    if (min === Number.MAX_SAFE_INTEGER || max === Number.MIN_SAFE_INTEGER || (max === 0 && min === 0)) {
      return
    }

    let range = Math.abs(max - min)
    if (range === 0) {
      max += 1
      min -= 1
      range = Math.abs(max - min)
    }
    this.axisMinimum = min - (range / 100.0) * 10.0
    this.axisMaximum = max + (range / 100.0) * 20.0

    this.axisRange = Math.abs(this.axisMaximum - this.axisMinimum)

    this.computeAxisValues()
    this.fixComputeAxisValues(yAxis)
  }

  fixComputeAxisValues (yAxis) {
    const valueLength = this.values.length
    if (valueLength > 0) {
      const textHeight = yAxis.tick.text.size
      const firstValueY = this.getY(this.values[0].v)
      let subValueCount = 1
      if (valueLength > 1) {
        const secondValueY = this.getY(this.values[1].v)
        const subY = Math.abs(secondValueY - firstValueY)
        if (subY < textHeight * 2) {
          subValueCount = Math.ceil(textHeight * 2 / subY)
        }
      }
      const values = []
      for (let i = 0; i < valueLength; i += subValueCount) {
        const v = this.values[i].v
        const y = this.getY(v)
        if (y > this.handler.contentTop() + textHeight &&
          y < this.handler.contentBottom() - textHeight) {
          values.push({ v, y })
        }
      }
      this.values = values
    }
  }

  getY (value) {
    return (1.0 - (value - this.axisMinimum) / this.axisRange) * this.handler.getContentHeight()
  }

  getValue (y) {
    return (1.0 - y / this.handler.getContentHeight()) * this.axisRange + this.axisMinimum
  }
}

export default YAxisRender

import View from './Render'

import { calcTextWidth, getFont } from '../utils/canvas'
import { isFunction, isArray } from '../utils/typeChecks'
import { formatDate, formatValue, formatPrecision } from '../utils/format'

import { IndicatorType, LineStyle, GraphicMarkType, TooltipCandleChartTextDisplayType } from '../internal/constants'
import { getIndicatorPrecision } from '../internal/config'

class TooltipRender extends View {
  constructor (
    handler, storage, indicatorParams,
    candleHandler, volHandler, subIndicatorHandler,
    candleYAxisRender, volYAxisRender, subIndicatorYAxisRender
  ) {
    super(handler, storage)
    this.indicatorParams = indicatorParams
    this.candleHandler = candleHandler
    this.volHandler = volHandler
    this.subIndicatorHandler = subIndicatorHandler
    this.candleYAxisRender = candleYAxisRender
    this.volYAxisRender = volYAxisRender
    this.subIndicatorYAxisRender = subIndicatorYAxisRender
  }

  /**
   * 绘制水平线
   * @param ctx
   * @param mainIndicatorType
   * @param subIndicatorType
   * @param isRenderYAxisLeft
   * @param isRenderYAxisTextOutside
   * @param tooltip
   * @param precision
   */
  renderCrossHorizontalLine (ctx, mainIndicatorType, subIndicatorType, isRenderYAxisLeft, isRenderYAxisTextOutside, tooltip, precision) {
    const yAxisDataLabel = this.getCrossYAxisLabel(tooltip, mainIndicatorType, subIndicatorType, precision)
    const crossPoint = this.storage.crossPoint
    if (!yAxisDataLabel || !crossPoint || !tooltip.cross.display) {
      return
    }
    const textHorizontal = tooltip.cross.text.horizontal
    const textSize = textHorizontal.size
    ctx.font = getFont(textSize)
    const yAxisDataLabelWidth = calcTextWidth(ctx, yAxisDataLabel)
    let rectStartX

    let lineStartX = this.handler.contentLeft()
    let lineEndX = this.handler.contentRight()

    const centerPoint = this.handler.getContentCenter()

    const paddingLeft = textHorizontal.paddingLeft
    const paddingRight = textHorizontal.paddingRight
    const paddingTop = textHorizontal.paddingTop
    const paddingBottom = textHorizontal.paddingBottom
    const borderSize = textHorizontal.borderSize

    const rectWidth = yAxisDataLabelWidth + borderSize * 2 + paddingLeft + paddingRight
    const rectHeight = textSize + borderSize * 2 + paddingTop + paddingBottom
    if (isRenderYAxisTextOutside) {
      if (isRenderYAxisLeft) {
        rectStartX = lineStartX - rectWidth
      } else {
        rectStartX = lineEndX
      }
    } else {
      if (crossPoint.x > centerPoint.x) {
        // 左边
        lineStartX = this.handler.contentLeft() + rectWidth
        rectStartX = this.handler.contentLeft() + 1
      } else {
        lineEndX = this.handler.contentRight() - rectWidth
        rectStartX = lineEndX - 1
      }
    }
    // 绘制十字光标水平线
    ctx.lineWidth = tooltip.cross.line.size
    ctx.strokeStyle = tooltip.cross.line.color
    if (tooltip.cross.line.style === LineStyle.DASH) {
      ctx.setLineDash(tooltip.cross.line.dashValue)
    }
    ctx.beginPath()
    ctx.moveTo(lineStartX, crossPoint.y)
    ctx.lineTo(lineEndX, crossPoint.y)
    ctx.stroke()
    ctx.closePath()
    ctx.setLineDash([])

    const rectY = crossPoint.y - borderSize - paddingTop - textSize / 2
    // 绘制y轴文字外的边框
    ctx.fillStyle = textHorizontal.backgroundColor
    ctx.fillRect(rectStartX, rectY, rectWidth, rectHeight)

    ctx.lineWidth = borderSize
    ctx.strokeStyle = textHorizontal.borderColor
    ctx.strokeRect(rectStartX, rectY, rectWidth, rectHeight)

    ctx.textBaseline = 'middle'
    ctx.fillStyle = textHorizontal.color
    ctx.fillText(yAxisDataLabel, rectStartX + borderSize + paddingLeft, crossPoint.y)
  }

  /**
   * 获取十字光标y轴上的文字
   * @param tooltip
   * @param mainIndicatorType
   * @param subIndicatorType
   * @param precision
   * @returns {null|*|string}
   */
  getCrossYAxisLabel (tooltip, mainIndicatorType, subIndicatorType, precision) {
    if (!this.storage.crossPoint) {
      return null
    }
    const eventY = this.storage.crossPoint.y
    let top
    if (eventY && eventY > 0 && eventY < this.handler.height + this.handler.height + this.handler.height) {
      let yAxisRender
      let indicatorType
      if (eventY > 0 && eventY < this.candleHandler.contentBottom()) {
        yAxisRender = this.candleYAxisRender
        indicatorType = mainIndicatorType
        top = 0
      } else if (eventY > this.candleHandler.contentBottom() && eventY < this.candleHandler.contentBottom() + this.volHandler.height) {
        yAxisRender = this.volYAxisRender
        indicatorType = IndicatorType.VOL
        top = this.candleHandler.height
      } else {
        yAxisRender = this.subIndicatorYAxisRender
        indicatorType = subIndicatorType
        top = this.candleHandler.height + this.volHandler.height
      }
      const yData = yAxisRender.getValue(eventY - top)
      const precisionConfig = getIndicatorPrecision(precision.pricePrecision, precision.volumePrecision)
      return formatPrecision(yData, precisionConfig[indicatorType])
    }
    return null
  }

  /**
   * 绘制十字光标垂直线
   * @param ctx
   * @param kLineData
   * @param tooltip
   */
  renderCrossVerticalLine (ctx, kLineData, tooltip) {
    const crossPoint = this.storage.crossPoint
    if (!crossPoint || !tooltip.cross.display) {
      return
    }
    const crossLine = tooltip.cross.line
    ctx.lineWidth = crossLine.size
    ctx.strokeStyle = crossLine.color

    if (crossLine.style === LineStyle.DASH) {
      ctx.setLineDash(crossLine.dashValue)
    }
    ctx.beginPath()
    ctx.moveTo(crossPoint.x, this.handler.contentTop())
    ctx.lineTo(crossPoint.x, this.handler.contentBottom())
    ctx.stroke()
    ctx.closePath()
    ctx.setLineDash([])

    const timestamp = kLineData.timestamp
    const text = formatDate(timestamp, 'YYYY-MM-DD hh:mm')
    const textVertical = tooltip.cross.text.vertical

    const textSize = textVertical.size
    const labelWidth = calcTextWidth(textSize, text)
    let xAxisLabelX = crossPoint.x - labelWidth / 2

    const paddingLeft = textVertical.paddingLeft
    const paddingRight = textVertical.paddingRight
    const paddingTop = textVertical.paddingTop
    const paddingBottom = textVertical.paddingBottom
    const borderSize = textVertical.borderSize

    // 保证整个x轴上的提示文字总是完全显示
    if (xAxisLabelX < this.handler.contentLeft() + paddingLeft + borderSize) {
      xAxisLabelX = this.handler.contentLeft() + paddingLeft + borderSize
    } else if (xAxisLabelX > this.handler.contentRight() - labelWidth - borderSize - paddingRight) {
      xAxisLabelX = this.handler.contentRight() - labelWidth - borderSize - paddingRight
    }

    const rectLeft = xAxisLabelX - borderSize - paddingLeft
    const rectTop = this.handler.contentBottom()
    const rectRight = xAxisLabelX + labelWidth + borderSize + paddingRight
    const rectBottom = this.handler.contentBottom() + textSize + borderSize * 2 + paddingTop + paddingBottom
    ctx.fillStyle = textVertical.backgroundColor
    ctx.fillRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)

    ctx.lineWidth = borderSize
    ctx.strokeStyle = textVertical.borderColor
    ctx.strokeRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)

    // 绘制轴上的提示文字
    ctx.textBaseline = 'top'
    ctx.font = getFont(textSize)
    ctx.fillStyle = textVertical.color
    ctx.fillText(
      text,
      xAxisLabelX,
      this.handler.contentBottom() + borderSize + paddingTop
    )
  }

  /**
   * 渲染主图提示文字
   * @param ctx
   * @param kLineData
   * @param indicatorType
   * @param isCandle
   * @param tooltip
   * @param indicator
   * @param precision
   */
  renderCandleChartTooltip (ctx, kLineData, indicatorType, isCandle, tooltip, indicator, precision) {
    const baseDataStyle = tooltip.data.base
    const indicatorDataStyle = tooltip.data.indicator
    const indicatorColors = indicator.lineColors
    const data = this.getRenderIndicatorTooltipData(kLineData, indicatorType, indicatorDataStyle, precision)
    if (baseDataStyle.showType === TooltipCandleChartTextDisplayType.FIXED) {
      let startY = baseDataStyle.text.marginTop
      this.renderCandleChartFixedBaseDataTooltipText(ctx, startY, kLineData, baseDataStyle, precision)
      if (isCandle) {
        startY += (baseDataStyle.text.size + baseDataStyle.text.marginBottom + tooltip.data.indicator.text.marginTop)
        this.renderIndicatorTooltipText(ctx, startY, data, indicatorDataStyle, indicatorColors)
      }
    } else {
      this.renderCandleChartFloatRectText(
        ctx, kLineData, isCandle ? data : {}, baseDataStyle,
        indicatorDataStyle, indicatorColors, precision
      )
    }
    if (isCandle) {
      this.renderIndicatorLineCircle(ctx, indicatorType, this.candleHandler.contentTop(), data.values, this.candleYAxisRender, indicatorColors, tooltip.cross.display)
    }
  }

  /**
   * 渲染指标图提示文字
   * @param ctx
   * @param offsetTop
   * @param kLineData
   * @param indicatorType
   * @param tooltip
   * @param indicator
   * @param isVolChart
   * @param precision
   */
  renderIndicatorChartTooltip (ctx, offsetTop, kLineData, indicatorType, tooltip, indicator, isVolChart, precision) {
    const indicatorDataStyle = tooltip.data.indicator
    const data = this.getRenderIndicatorTooltipData(kLineData, indicatorType, indicatorDataStyle, precision)
    const indicatorLineColors = indicator.lineColors
    this.renderIndicatorTooltipText(
      ctx, offsetTop + indicatorDataStyle.text.marginTop,
      data, indicatorDataStyle, indicatorLineColors
    )
    const circleOffsetTop = isVolChart
      ? this.candleHandler.height + this.volHandler.contentTop()
      : this.candleHandler.height + this.volHandler.height + this.subIndicatorHandler.contentTop()
    this.renderIndicatorLineCircle(
      ctx, indicatorType, circleOffsetTop, data.values,
      isVolChart ? this.volYAxisRender : this.subIndicatorYAxisRender,
      indicatorLineColors, tooltip.cross.display
    )
  }

  /**
   * 渲染主图固定的基础数据文字
   * @param ctx
   * @param startY
   * @param kLineData
   * @param baseDataStyle
   * @param precision
   */
  renderCandleChartFixedBaseDataTooltipText (ctx, startY, kLineData, baseDataStyle, precision) {
    const values = this.getCandleChartBaseValues(kLineData, baseDataStyle, precision)
    const textMarginLeft = baseDataStyle.text.marginLeft
    const textMarginRight = baseDataStyle.text.marginRight
    const textSize = baseDataStyle.text.size
    const textColor = baseDataStyle.text.color
    const labels = baseDataStyle.labels
    ctx.textBaseline = 'top'
    ctx.font = getFont(textSize)
    let startX = this.handler.contentLeft() + textMarginLeft
    labels.forEach((label, i) => {
      const labelText = `${label}: `
      const labelWidth = calcTextWidth(textSize, labelText)
      ctx.fillStyle = textColor
      ctx.fillText(labelText, startX, startY)
      startX += labelWidth

      const value = values[i] || '--'
      let valueText
      if (typeof value === 'object') {
        valueText = value.value || '--'
        ctx.fillStyle = value.color || textColor
      } else {
        ctx.fillStyle = textColor
        valueText = value
      }
      const textWidth = calcTextWidth(textSize, valueText)
      ctx.fillText(valueText, startX, startY)
      startX += (textWidth + textMarginLeft + textMarginRight)
    })
  }

  /**
   * 渲染主图浮动文字
   * @param ctx
   * @param kLineData
   * @param indicatorData
   * @param baseDataStyle
   * @param indicatorDataStyle
   * @param indicatorColors
   * @param precision
   */
  renderCandleChartFloatRectText (
    ctx, kLineData, indicatorData, baseDataStyle, indicatorDataStyle,
    indicatorColors = [], precision
  ) {
    const baseLabels = baseDataStyle.labels
    const baseValues = this.getCandleChartBaseValues(kLineData, baseDataStyle, precision)
    const baseTextMarginLeft = baseDataStyle.text.marginLeft
    const baseTextMarginRight = baseDataStyle.text.marginRight
    const baseTextMarginTop = baseDataStyle.text.marginTop
    const baseTextMarginBottom = baseDataStyle.text.marginBottom
    const baseTextSize = baseDataStyle.text.size
    const baseTextColor = baseDataStyle.text.color

    ctx.textBaseline = 'top'
    let maxLabelWidth = 0
    baseLabels.forEach((label, i) => {
      const value = baseValues[i] || '--'
      let v = value
      if (typeof value === 'object') {
        v = value.value || '--'
      }
      const text = `${label}: ${v}`
      const labelWidth = calcTextWidth(baseTextSize, text) + baseTextMarginLeft + baseTextMarginRight
      maxLabelWidth = Math.max(maxLabelWidth, labelWidth)
    })
    const indicatorLabels = indicatorData.labels || []
    const indicatorValues = indicatorData.values || []
    const indicatorTextMarginLeft = indicatorDataStyle.text.marginLeft
    const indicatorTextMarginRight = indicatorDataStyle.text.marginRight
    const indicatorTextMarginTop = indicatorDataStyle.text.marginTop
    const indicatorTextMarginBottom = indicatorDataStyle.text.marginBottom
    const indicatorTextSize = indicatorDataStyle.text.size
    indicatorLabels.forEach((label, i) => {
      const v = indicatorValues[i] || '--'
      const text = `${label}: ${v}`
      const labelWidth = calcTextWidth(indicatorTextSize, text) + indicatorTextMarginLeft + indicatorTextMarginRight
      maxLabelWidth = Math.max(maxLabelWidth, labelWidth)
    })
    const floatRect = baseDataStyle.floatRect
    const floatRectBorderSize = floatRect.borderSize
    const floatRectPaddingLeft = floatRect.paddingLeft
    const floatRectPaddingRight = floatRect.paddingRight
    const floatRectPaddingTop = floatRect.paddingTop
    const floatRectPaddingBottom = floatRect.paddingBottom
    const floatRectLeft = floatRect.left
    const floatRectRight = floatRect.right
    const floatRectWidth = floatRectBorderSize * 2 + maxLabelWidth + floatRectPaddingLeft + floatRectPaddingRight
    const floatRectHeight = floatRectBorderSize * 2 +
      floatRectPaddingTop + floatRectPaddingBottom +
      (baseTextMarginBottom + baseTextMarginTop + baseTextSize) * baseLabels.length +
      (indicatorTextMarginTop + indicatorTextMarginBottom + indicatorTextSize) * indicatorLabels.length

    const centerPoint = this.volHandler.getContentCenter()
    let rectX
    const crossPoint = this.storage.crossPoint
    if (crossPoint && crossPoint.x < centerPoint.x) {
      rectX = this.handler.contentRight() - floatRectRight - floatRectWidth
    } else {
      rectX = this.handler.contentLeft() + floatRectLeft
    }
    const rectY = floatRect.top
    const radius = floatRect.borderRadius
    ctx.lineWidth = floatRectBorderSize
    ctx.strokeStyle = floatRect.borderColor
    ctx.fillStyle = floatRect.fillColor
    this.renderRoundRect(ctx, rectX, rectY, floatRectWidth, floatRectHeight, radius)
    ctx.stroke()
    this.renderRoundRect(ctx, rectX, rectY, floatRectWidth, floatRectHeight, radius)
    ctx.fill()

    const baseLabelX = rectX + floatRectBorderSize + floatRectPaddingLeft + baseTextMarginLeft
    let labelY = rectY + floatRectBorderSize + floatRectPaddingTop
    // 开始渲染基础数据文字
    ctx.font = getFont(baseTextSize)
    baseLabels.forEach((label, i) => {
      labelY += baseTextMarginTop
      ctx.textAlign = 'left'
      ctx.fillStyle = baseTextColor
      ctx.fillText(`${label}: `, baseLabelX, labelY)

      const value = baseValues[i] || '--'
      let text
      ctx.fillStyle = value.color || baseTextColor
      if (typeof value === 'object') {
        text = value.value || '--'
      } else {
        text = value
      }
      ctx.textAlign = 'right'
      ctx.fillText(text, rectX + floatRectWidth - floatRectBorderSize - baseTextMarginRight - floatRectPaddingRight, labelY)
      labelY += (baseTextSize + baseTextMarginBottom)
    })
    // 开始渲染指标数据文字
    const indicatorLabelX = rectX + floatRectBorderSize + floatRectPaddingLeft + indicatorTextMarginLeft
    const colorLength = indicatorColors.length
    ctx.font = getFont(indicatorTextSize)
    indicatorLabels.forEach((label, i) => {
      labelY += indicatorTextMarginTop
      ctx.textAlign = 'left'
      ctx.fillStyle = indicatorColors[i % colorLength] || indicatorDataStyle.text.color
      ctx.fillText(`${label.toUpperCase()}: `, indicatorLabelX, labelY)

      ctx.textAlign = 'right'
      ctx.fillText(
        indicatorValues[i] || '--',
        rectX + floatRectWidth - floatRectBorderSize - indicatorTextMarginRight - floatRectPaddingRight,
        labelY
      )
      labelY += (indicatorTextSize + indicatorTextMarginBottom)
    })
    ctx.textAlign = 'left'
  }

  /**
   * 渲染圆角矩形
   * @param ctx
   * @param x
   * @param y
   * @param w
   * @param h
   * @param r
   */
  renderRoundRect (ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  /**
   * 获取主信息提示值
   * @param kLineData
   * @param baseDataStyle
   * @param precision
   * @returns {*}
   */
  getCandleChartBaseValues (kLineData, baseDataStyle, precision) {
    const baseValues = baseDataStyle.values
    let values = []
    if (baseValues) {
      if (isFunction(baseValues)) {
        values = baseValues(kLineData) || []
      } else {
        values = baseValues
      }
    } else {
      values = [
        formatValue(kLineData, 'timestamp'),
        formatValue(kLineData, 'open'),
        formatValue(kLineData, 'close'),
        formatValue(kLineData, 'high'),
        formatValue(kLineData, 'low'),
        formatValue(kLineData, 'volume')
      ]
      values.forEach((value, index) => {
        switch (index) {
          case 0: {
            values[index] = formatDate(value, 'YYYY-MM-DD hh:mm')
            break
          }
          case values.length - 1: {
            values[index] = formatPrecision(value, precision.volumePrecision)
            break
          }
          default: {
            values[index] = formatPrecision(value, precision.pricePrecision)
            break
          }
        }
      })
    }
    return values
  }

  /**
   * 绘制指标提示文字
   * @param ctx
   * @param startY
   * @param data
   * @param indicatorDataStyle
   * @param indicatorColors
   */
  renderIndicatorTooltipText (ctx, startY, data, indicatorDataStyle, indicatorColors = []) {
    const nameText = data.name
    const labels = data.labels
    const values = data.values
    const indicatorText = indicatorDataStyle.text
    const textMarginLeft = indicatorText.marginLeft
    const textMarginRight = indicatorText.marginRight
    let labelX = this.handler.contentLeft() + textMarginLeft
    const textSize = indicatorText.size
    const textColor = indicatorDataStyle.text.color
    const lineColorSize = indicatorColors.length
    ctx.textBaseline = 'top'
    ctx.font = getFont(textSize)
    const nameTextWidth = calcTextWidth(textSize, nameText)
    ctx.fillStyle = textColor
    ctx.fillText(nameText, labelX, startY)
    labelX += (textMarginLeft + nameTextWidth)
    for (let i = 0; i < labels.length; i++) {
      const text = `${labels[i].toUpperCase()}: ${values[i] || '--'}`
      const textWidth = calcTextWidth(textSize, text)
      ctx.fillStyle = indicatorColors[i % lineColorSize] || textColor
      ctx.fillText(text, labelX, startY)
      labelX += (textMarginLeft + textMarginRight + textWidth)
    }
  }

  /**
   * 渲染指标线上的圆点
   * @param ctx
   * @param indicatorType
   * @param values
   * @param offsetTop
   * @param yAxisRender
   * @param indicatorColors
   * @param isShowCross
   */
  renderIndicatorLineCircle (ctx, indicatorType, offsetTop, values = [], yAxisRender, indicatorColors = [], isShowCross) {
    const crossPoint = this.storage.crossPoint
    if (!crossPoint ||
      this.storage.graphicMarkType !== GraphicMarkType.NONE ||
      indicatorType === IndicatorType.SAR ||
      !isShowCross ||
      this.storage.isDragGraphicMark) {
      return
    }
    const colorSize = indicatorColors.length
    const valueSize = indicatorType === IndicatorType.MACD || indicatorType === IndicatorType.VOL ? values.length - 1 : values.length
    for (let i = 0; i < valueSize; i++) {
      const value = values[i]
      if (value || value === 0) {
        const y = yAxisRender.getY(value) + offsetTop
        ctx.fillStyle = indicatorColors[i % colorSize]
        ctx.beginPath()
        ctx.arc(crossPoint.x, y, 3, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      }
    }
  }

  /**
   * 获取需要渲染的指标提示数据
   * @param kLineData
   * @param indicatorType
   * @param indicatorDataStyle
   * @param precision
   * @returns {{values: Array, labels: Array}}
   */
  getRenderIndicatorTooltipData (kLineData, indicatorType, indicatorDataStyle, precision) {
    const values = []
    let labels = []
    const params = this.indicatorParams[indicatorType] || []
    switch (indicatorType) {
      case IndicatorType.MA: {
        params.forEach(p => {
          labels.push(`ma${p}`)
        })
        break
      }
      case IndicatorType.VOL: {
        params.forEach(p => {
          labels.push(`ma${p}`)
        })
        labels.push('num')
        break
      }
      case IndicatorType.MACD: {
        labels = ['diff', 'dea', 'macd']
        break
      }
      case IndicatorType.BOLL: {
        labels = ['up', 'mid', 'dn']
        break
      }
      case IndicatorType.BIAS: {
        params.forEach(p => {
          labels.push(`bias${p}`)
        })
        break
      }
      case IndicatorType.BRAR: {
        labels = ['br', 'ar']
        break
      }
      case IndicatorType.CCI: {
        labels = ['cci']
        break
      }
      case IndicatorType.CR: {
        labels = ['cr', 'ma1', 'ma2', 'ma3', 'ma4']
        break
      }
      case IndicatorType.DMA: {
        labels = ['dif', 'difMa']
        break
      }
      case IndicatorType.DMI: {
        labels = ['mdi', 'pdi', 'adx', 'adxr']
        break
      }
      case IndicatorType.KDJ: {
        labels = ['k', 'd', 'j']
        break
      }

      case IndicatorType.RSI: {
        params.forEach(p => {
          labels.push(`rsi${p}`)
        })
        break
      }
      case IndicatorType.PSY: {
        labels = ['psy']
        break
      }
      case IndicatorType.TRIX: {
        labels = ['trix', 'maTrix']
        break
      }
      case IndicatorType.OBV: {
        labels = ['obv', 'maObv']
        break
      }
      case IndicatorType.VR: {
        labels = ['vr', 'maVr']
        break
      }
      case IndicatorType.WR: {
        labels = ['wr1', 'wr2', 'wr3']
        break
      }
      case IndicatorType.MTM: {
        labels = ['mtm', 'mtmMa']
        break
      }

      case IndicatorType.EMV: {
        labels = ['emv', 'maEmv']
        break
      }

      case IndicatorType.SAR: {
        labels = ['sar']
        break
      }
    }
    let name = ''
    if (labels.length > 0) {
      name = `${indicatorType}`
      if (params && isArray(params) && params.length > 0) {
        name = `${name}(${params.join(',')})`
      }
      const indicatorData = formatValue(kLineData, indicatorType.toLowerCase())
      labels.forEach(label => {
        values.push(formatValue(indicatorData, label))
      })
      const decimal = getIndicatorPrecision(precision.pricePrecision, precision.volumePrecision)[indicatorType]
      values.forEach((value, index) => {
        values[index] = formatPrecision(value, decimal)
      })
    }
    return { labels, values, name }
  }
}

export default TooltipRender

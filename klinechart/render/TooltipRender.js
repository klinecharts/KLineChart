import Render from './Render'

import { calcTextWidth } from '../internal/utils/drawUtils'
import { formatDate, isFunction, formatValue, formatDecimal, isArray } from '../internal/utils/dataUtils'

import { IndicatorType, LineStyle, MarkerType, TooltipMainChartTextDisplayType } from '../internal/constants'

class TooltipRender extends Render {
  constructor (
    viewPortHandler, dataProvider, indicatorParams,
    candleViewPortHandler, volViewPortHandler, subIndicatorViewPortHandler,
    candleYAxisRender, volYAxisRender, subIndicatorYAxisRender
  ) {
    super(viewPortHandler, dataProvider)
    this.indicatorParams = indicatorParams
    this.candleViewPortHandler = candleViewPortHandler
    this.volViewPortHandler = volViewPortHandler
    this.subIndicatorViewPortHandler = subIndicatorViewPortHandler
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
   */
  renderCrossHorizontalLine (ctx, mainIndicatorType, subIndicatorType, isRenderYAxisLeft, isRenderYAxisTextOutside, tooltip) {
    const yAxisDataLabel = this.getCrossYAxisLabel(tooltip, mainIndicatorType, subIndicatorType)
    const crossPoint = this.dataProvider.crossPoint
    if (!yAxisDataLabel || !crossPoint || !tooltip.cross.display) {
      return
    }
    const textHorizontal = tooltip.cross.text.horizontal
    const textSize = textHorizontal.size
    const yAxisDataLabelWidth = calcTextWidth(textSize, yAxisDataLabel)
    let rectStartX

    let lineStartX = this.viewPortHandler.contentLeft()
    let lineEndX = this.viewPortHandler.contentRight()

    const centerPoint = this.viewPortHandler.getContentCenter()

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
        lineStartX = this.viewPortHandler.contentLeft() + rectWidth
        rectStartX = this.viewPortHandler.contentLeft() + 1
      } else {
        lineEndX = this.viewPortHandler.contentRight() - rectWidth
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
    ctx.font = `${textSize}px Arial`
    ctx.fillText(yAxisDataLabel, rectStartX + borderSize + paddingLeft, crossPoint.y)
  }

  /**
   * 获取十字光标y轴上的文字
   * @param tooltip
   * @param mainIndicatorType
   * @param subIndicatorType
   * @returns {null|*|string}
   */
  getCrossYAxisLabel (tooltip, mainIndicatorType, subIndicatorType) {
    if (!this.dataProvider.crossPoint) {
      return null
    }
    const eventY = this.dataProvider.crossPoint.y
    let top
    if (eventY && eventY > 0 && eventY < this.candleViewPortHandler.height + this.volViewPortHandler.height + this.subIndicatorViewPortHandler.height) {
      let yAxisRender
      let indicatorType
      if (eventY > 0 && eventY < this.candleViewPortHandler.contentBottom()) {
        yAxisRender = this.candleYAxisRender
        indicatorType = mainIndicatorType
        top = 0
      } else if (eventY > this.candleViewPortHandler.contentBottom() && eventY < this.candleViewPortHandler.contentBottom() + this.volViewPortHandler.height) {
        yAxisRender = this.volYAxisRender
        indicatorType = IndicatorType.VOL
        top = this.candleViewPortHandler.height
      } else {
        yAxisRender = this.subIndicatorYAxisRender
        indicatorType = subIndicatorType
        top = this.candleViewPortHandler.height + this.volViewPortHandler.height
      }
      const yData = yAxisRender.getValue(eventY - top)
      let text = yData.toFixed(2)
      if (indicatorType === IndicatorType.VOL) {
        text = yData.toFixed(0)
      }
      const valueFormatter = tooltip.cross.text.horizontal.valueFormatter
      if (isFunction(valueFormatter)) {
        text = valueFormatter(indicatorType, yData) || '--'
      }
      return text
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
    const crossPoint = this.dataProvider.crossPoint
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
    ctx.moveTo(crossPoint.x, this.viewPortHandler.contentTop())
    ctx.lineTo(crossPoint.x, this.viewPortHandler.contentBottom())
    ctx.stroke()
    ctx.closePath()
    ctx.setLineDash([])

    const timestamp = kLineData.timestamp
    let label = formatDate(timestamp)
    const textVertical = tooltip.cross.text.vertical
    const valueFormatter = textVertical.valueFormatter
    if (isFunction(valueFormatter)) {
      label = valueFormatter(kLineData) || '--'
    }

    const textSize = textVertical.size
    const labelWidth = calcTextWidth(textSize, label)
    let xAxisLabelX = crossPoint.x - labelWidth / 2

    const paddingLeft = textVertical.paddingLeft
    const paddingRight = textVertical.paddingRight
    const paddingTop = textVertical.paddingTop
    const paddingBottom = textVertical.paddingBottom
    const borderSize = textVertical.borderSize

    // 保证整个x轴上的提示文字总是完全显示
    if (xAxisLabelX < this.viewPortHandler.contentLeft() + paddingLeft + borderSize) {
      xAxisLabelX = this.viewPortHandler.contentLeft() + paddingLeft + borderSize
    } else if (xAxisLabelX > this.viewPortHandler.contentRight() - labelWidth - borderSize - paddingRight) {
      xAxisLabelX = this.viewPortHandler.contentRight() - labelWidth - borderSize - paddingRight
    }

    const rectLeft = xAxisLabelX - borderSize - paddingLeft
    const rectTop = this.viewPortHandler.contentBottom()
    const rectRight = xAxisLabelX + labelWidth + borderSize + paddingRight
    const rectBottom = this.viewPortHandler.contentBottom() + textSize + borderSize * 2 + paddingTop + paddingBottom
    ctx.fillStyle = textVertical.backgroundColor
    ctx.fillRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)

    ctx.lineWidth = borderSize
    ctx.strokeStyle = textVertical.borderColor
    ctx.strokeRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)

    // 绘制轴上的提示文字
    ctx.textBaseline = 'top'
    ctx.font = `${textSize}px Arial`
    ctx.fillStyle = textVertical.color
    ctx.fillText(
      label,
      xAxisLabelX,
      this.viewPortHandler.contentBottom() + borderSize + paddingTop
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
   */
  renderMainChartTooltip (ctx, kLineData, indicatorType, isCandle, tooltip, indicator) {
    const baseDataStyle = tooltip.data.base
    const indicatorDataStyle = tooltip.data.indicator
    const indicatorColors = indicator.lineColors
    const data = this.getRenderIndicatorTooltipData(kLineData, indicatorType, indicatorDataStyle)
    if (baseDataStyle.showType === TooltipMainChartTextDisplayType.FIXED) {
      let startY = baseDataStyle.text.marginTop
      this.renderMainChartFixedBaseDataTooltipText(ctx, startY, kLineData, baseDataStyle)
      if (isCandle) {
        startY += (baseDataStyle.text.size + baseDataStyle.text.marginBottom + tooltip.data.indicator.text.marginTop)
        this.renderIndicatorTooltipText(ctx, startY, data, indicatorDataStyle, indicatorColors)
      }
    } else {
      this.renderMainChartFloatRectText(ctx, kLineData, isCandle ? data : {}, baseDataStyle, indicatorDataStyle, indicatorColors)
    }
    if (isCandle) {
      this.renderIndicatorLineCircle(ctx, indicatorType, this.candleViewPortHandler.contentTop(), data.values, this.candleYAxisRender, indicatorColors)
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
   */
  renderIndicatorChartTooltip (ctx, offsetTop, kLineData, indicatorType, tooltip, indicator, isVolChart) {
    const indicatorDataStyle = tooltip.data.indicator
    const data = this.getRenderIndicatorTooltipData(kLineData, indicatorType, indicatorDataStyle)
    const indicatorLineColors = indicator.lineColors
    this.renderIndicatorTooltipText(
      ctx, offsetTop + indicatorDataStyle.text.marginTop,
      data, indicatorDataStyle, indicatorLineColors
    )
    const circleOffsetTop = isVolChart
      ? this.candleViewPortHandler.height + this.volViewPortHandler.contentTop()
      : this.candleViewPortHandler.height + this.volViewPortHandler.height + this.subIndicatorViewPortHandler.contentTop()
    this.renderIndicatorLineCircle(ctx, indicatorType, circleOffsetTop, data.values, isVolChart ? this.volYAxisRender : this.subIndicatorYAxisRender, indicatorLineColors)
  }

  /**
   * 渲染主图固定的基础数据文字
   * @param ctx
   * @param startY
   * @param kLineData
   * @param baseDataStyle
   */
  renderMainChartFixedBaseDataTooltipText (ctx, startY, kLineData, baseDataStyle) {
    const values = this.getMainChartBaseValues(kLineData, baseDataStyle)
    const textMarginLeft = baseDataStyle.text.marginLeft
    const textMarginRight = baseDataStyle.text.marginRight
    const textSize = baseDataStyle.text.size
    const textColor = baseDataStyle.text.color
    const labels = baseDataStyle.labels
    ctx.textBaseline = 'top'
    ctx.font = `${textSize}px Arial`
    let startX = this.viewPortHandler.contentLeft() + textMarginLeft
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
   */
  renderMainChartFloatRectText (ctx, kLineData, indicatorData, baseDataStyle, indicatorDataStyle, indicatorColors = []) {
    const baseLabels = baseDataStyle.labels
    const baseValues = this.getMainChartBaseValues(kLineData, baseDataStyle)
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

    const centerPoint = this.volViewPortHandler.getContentCenter()
    let rectX
    const crossPoint = this.dataProvider.crossPoint
    if (crossPoint && crossPoint.x < centerPoint.x) {
      rectX = this.viewPortHandler.contentRight() - floatRectRight - floatRectWidth
    } else {
      rectX = this.viewPortHandler.contentLeft() + floatRectLeft
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
    ctx.font = `${baseTextSize}px Arial`
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
    ctx.font = `${indicatorTextSize}px Arial`
    indicatorLabels.forEach((label, i) => {
      labelY += indicatorTextMarginTop
      ctx.textAlign = 'left'
      ctx.fillStyle = indicatorColors[i % colorLength] || indicatorDataStyle.text.color
      ctx.fillText(`${label}: `, indicatorLabelX, labelY)

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
   * @returns {*}
   */
  getMainChartBaseValues (kLineData, baseDataStyle) {
    const baseValues = baseDataStyle.values
    let values = []
    if (baseValues) {
      if (isFunction(baseValues)) {
        values = baseValues(kLineData) || []
      } else {
        values = baseValues
      }
    } else {
      const valueFormatter = baseDataStyle.text.valueFormatter
      values = [
        formatValue(kLineData, 'timestamp'),
        formatValue(kLineData, 'open'),
        formatValue(kLineData, 'close'),
        formatValue(kLineData, 'high'),
        formatValue(kLineData, 'low'),
        formatValue(kLineData, 'volume')
      ]
      if (isFunction(valueFormatter)) {
        values.forEach((value, index) => {
          values[index] = valueFormatter(index, value) || '--'
        })
      } else {
        values.forEach((value, index) => {
          switch (index) {
            case 0: {
              values[index] = formatDate(value)
              break
            }
            case values.length - 1: {
              values[index] = formatDecimal(value, 0)
              break
            }
            default: {
              values[index] = formatDecimal(value)
              break
            }
          }
        })
      }
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
    let labelX = this.viewPortHandler.contentLeft() + textMarginLeft
    const textSize = indicatorText.size
    const textColor = indicatorDataStyle.text.color
    const lineColorSize = indicatorColors.length
    ctx.textBaseline = 'top'
    ctx.font = `${textSize}px Arial`
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
   */
  renderIndicatorLineCircle (ctx, indicatorType, offsetTop, values = [], yAxisRender, indicatorColors = []) {
    const crossPoint = this.dataProvider.crossPoint
    if (!crossPoint ||
      this.dataProvider.currentMarkerType !== MarkerType.NONE ||
      indicatorType === IndicatorType.SAR ||
      this.dataProvider.isDragMarker) {
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
   * @returns {{values: Array, labels: Array}}
   */
  getRenderIndicatorTooltipData (kLineData, indicatorType, indicatorDataStyle) {
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
        labels = ['bias6', 'bias12', 'bias24']
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
        labels = ['rsi6', 'rsi12', 'rsi24']
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
    if (params && isArray(params) && params.length > 0) {
      name = `${indicatorType}(${params.join(',')})`
    }
    if (labels.length > 0) {
      const indicatorData = formatValue(kLineData, indicatorType.toLowerCase())
      labels.forEach(label => {
        values.push(formatValue(indicatorData, label))
      })

      const valueFormatter = indicatorDataStyle.text.valueFormatter
      if (isFunction(valueFormatter)) {
        values.forEach((value, index) => {
          values[index] = valueFormatter(indicatorType, value) || '--'
        })
      } else {
        const decimal = indicatorType === IndicatorType.VOL ? 0 : 2
        values.forEach((value, index) => {
          values[index] = formatDecimal(value, decimal)
        })
      }
    }
    return { labels, values, name }
  }
}

export default TooltipRender

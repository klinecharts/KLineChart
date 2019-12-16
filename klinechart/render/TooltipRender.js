import Render from './Render'

import { calcTextWidth } from '../internal/utils/drawUtils'
import { formatDate, isFunction, formatValue, formatDecimal } from '../internal/utils/dataUtils'

import { IndicatorType, LineStyle, MarkerType, TooltipMainChartTextDisplayType } from '../internal/constants'

class TooltipRender extends Render {
  constructor (
    viewPortHandler, dataProvider,
    candleViewPortHandler, volViewPortHandler, subIndicatorViewPortHandler,
    candleYAxisRender, volYAxisRender, subIndicatorYAxisRender
  ) {
    super(viewPortHandler, dataProvider)
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
    const baseDataConfig = tooltip.data.base
    const indicatorDataConfig = tooltip.data.indicator
    const indicatorColors = indicator.lineColors
    const data = this.getRenderIndicatorTooltipData(kLineData, indicatorType, indicatorDataConfig)
    if (baseDataConfig.showType === TooltipMainChartTextDisplayType.FIXED) {
      let startY = baseDataConfig.text.marginTop
      this.renderMainChartFixedBaseDataTooltipText(ctx, startY, kLineData, baseDataConfig)
      if (isCandle) {
        startY += (baseDataConfig.text.size + baseDataConfig.text.marginBottom + tooltip.data.indicator.text.marginTop)
        this.renderIndicatorTooltipText(ctx, startY, data, indicatorDataConfig, indicatorColors)
      }
    } else {
      this.renderMainChartFloatRectText(ctx, kLineData, isCandle ? data : {}, baseDataConfig, indicatorDataConfig, indicatorColors)
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
    const indicatorDataConfig = tooltip.data.indicator
    const data = this.getRenderIndicatorTooltipData(kLineData, indicatorType, indicatorDataConfig)
    const indicatorLineColors = indicator.lineColors
    this.renderIndicatorTooltipText(
      ctx, offsetTop + indicatorDataConfig.text.marginTop,
      data, indicatorDataConfig, indicatorLineColors
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
   * @param baseDataConfig
   */
  renderMainChartFixedBaseDataTooltipText (ctx, startY, kLineData, baseDataConfig) {
    const values = this.getMainChartBaseValues(kLineData, baseDataConfig)
    const textMarginLeft = baseDataConfig.text.marginLeft
    const textMarginRight = baseDataConfig.text.marginRight
    const textSize = baseDataConfig.text.size
    const textColor = baseDataConfig.text.color
    const labels = baseDataConfig.labels
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
   * @param baseDataConfig
   * @param indicatorDataConfig
   * @param indicatorColors
   */
  renderMainChartFloatRectText (ctx, kLineData, indicatorData, baseDataConfig, indicatorDataConfig, indicatorColors = []) {
    const baseLabels = baseDataConfig.labels
    const baseValues = this.getMainChartBaseValues(kLineData, baseDataConfig)
    const baseTextMarginLeft = baseDataConfig.text.marginLeft
    const baseTextMarginRight = baseDataConfig.text.marginRight
    const baseTextMarginTop = baseDataConfig.text.marginTop
    const baseTextMarginBottom = baseDataConfig.text.marginBottom
    const baseTextSize = baseDataConfig.text.size
    const baseTextColor = baseDataConfig.text.color

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
    const indicatorTextMarginLeft = indicatorDataConfig.text.marginLeft
    const indicatorTextMarginRight = indicatorDataConfig.text.marginRight
    const indicatorTextMarginTop = indicatorDataConfig.text.marginTop
    const indicatorTextMarginBottom = indicatorDataConfig.text.marginBottom
    const indicatorTextSize = indicatorDataConfig.text.size
    indicatorLabels.forEach((label, i) => {
      const v = indicatorValues[i] || '--'
      const text = `${label}: ${v}`
      const labelWidth = calcTextWidth(indicatorTextSize, text) + indicatorTextMarginLeft + indicatorTextMarginRight
      maxLabelWidth = Math.max(maxLabelWidth, labelWidth)
    })
    const floatRect = baseDataConfig.floatRect
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
      ctx.fillStyle = indicatorColors[i % colorLength] || indicatorDataConfig.text.color
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
   * @param baseDataConfig
   * @returns {*}
   */
  getMainChartBaseValues (kLineData, baseDataConfig) {
    const baseValues = baseDataConfig.values
    let values = []
    if (baseValues) {
      if (isFunction(baseValues)) {
        values = baseValues(kLineData) || []
      } else {
        values = baseValues
      }
    } else {
      const valueFormatter = baseDataConfig.text.valueFormatter
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
   * @param indicatorDataConfig
   * @param indicatorColors
   */
  renderIndicatorTooltipText (ctx, startY, data, indicatorDataConfig, indicatorColors = []) {
    const nameText = data.name
    const labels = data.labels
    const values = data.values
    const indicatorText = indicatorDataConfig.text
    const textMarginLeft = indicatorText.marginLeft
    const textMarginRight = indicatorText.marginRight
    let labelX = this.viewPortHandler.contentLeft() + textMarginLeft
    const textSize = indicatorText.size
    const textColor = indicatorDataConfig.text.color
    const lineColorSize = indicatorColors.length
    ctx.textBaseline = 'top'
    ctx.font = `${textSize}px Arial`
    const nameTextWidth = calcTextWidth(textSize, nameText)
    ctx.fillStyle = textColor
    ctx.fillText(nameText, labelX, startY)
    labelX += (textMarginLeft + nameTextWidth)
    for (let i = 0; i < labels.length; i++) {
      const text = `${labels[i]}: ${values[i] || '--'}`
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
   * @param indicatorDataConfig
   * @returns {{values: Array, labels: Array}}
   */
  getRenderIndicatorTooltipData (kLineData, indicatorType, indicatorDataConfig) {
    let values = []
    let labels = []
    let name = ''
    switch (indicatorType) {
      case IndicatorType.MA: {
        const ma = formatValue(kLineData, 'ma')
        values = [formatValue(ma, 'ma5'), formatValue(ma, 'ma10'), formatValue(ma, 'ma20'), formatValue(ma, 'ma60')]
        labels = ['MA5', 'MA10', 'MA20', 'MA60']
        name = 'MA(5,10,20,60)'
        break
      }
      case IndicatorType.MACD: {
        const macd = formatValue(kLineData, 'macd')
        values = [formatValue(macd, 'diff'), formatValue(macd, 'dea'), formatValue(macd, 'macd')]
        labels = ['DIFF', 'DEA', 'MACD']
        name = 'MACD(12,26,9)'
        break
      }
      case IndicatorType.VOL: {
        const vol = formatValue(kLineData, 'vol')
        values = [formatValue(vol, 'ma5'), formatValue(vol, 'ma10'), formatValue(vol, 'ma20'), formatValue(vol, 'num')]
        labels = ['MA5', 'MA10', 'MA20', 'NUM']
        name = 'VOLUME(5,10,20)'
        break
      }
      case IndicatorType.BOLL: {
        const boll = formatValue(kLineData, 'boll')
        values = [formatValue(boll, 'up'), formatValue(boll, 'mid'), formatValue(boll, 'dn')]
        labels = ['UP', 'MID', 'DN']
        name = 'BOLL(20)'
        break
      }
      case IndicatorType.BIAS: {
        const bias = formatValue(kLineData, 'bias')
        values = [formatValue(bias, 'bias1'), formatValue(bias, 'bias2'), formatValue(bias, 'bias3')]
        labels = ['BIAS6', 'BIAS12', 'BIAS24']
        name = 'BIAS(6,12,24)'
        break
      }
      case IndicatorType.BRAR: {
        const brar = formatValue(kLineData, 'brar')
        values = [formatValue(brar, 'br'), formatValue(brar, 'ar')]
        labels = ['BR', 'AR']
        name = 'BRAR(26)'
        break
      }
      case IndicatorType.CCI: {
        const cci = formatValue(kLineData, 'cci')
        values = [formatValue(cci, 'cci')]
        labels = ['CCI']
        name = 'CCI(13)'
        break
      }
      case IndicatorType.CR: {
        const cr = formatValue(kLineData, 'cr')
        values = [
          formatValue(cr, 'cr'),
          formatValue(cr, 'ma1'),
          formatValue(cr, 'ma2'),
          formatValue(cr, 'ma3'),
          formatValue(cr, 'ma4')
        ]
        labels = ['CR', 'MA1', 'MA2', 'MA3', 'MA4']
        name = 'CR(26,10,20,40,60)'
        break
      }
      case IndicatorType.DMA: {
        const dma = formatValue(kLineData, 'dma')
        values = [formatValue(dma, 'dif'), formatValue(dma, 'difMa')]
        labels = ['DIF', 'DIFMA']
        name = 'DMA(10,50,10)'
        break
      }
      case IndicatorType.DMI: {
        const dmi = formatValue(kLineData, 'dmi')
        values = [
          formatValue(dmi, 'mdi'),
          formatValue(dmi, 'pdi'),
          formatValue(dmi, 'adx'),
          formatValue(dmi, 'adxr')
        ]
        labels = ['MDI', 'PDI', 'ADX', 'ADXR']
        name = 'DMI(14,6)'
        break
      }
      case IndicatorType.KDJ: {
        const kdj = formatValue(kLineData, 'kdj')
        values = [formatValue(kdj, 'k'), formatValue(kdj, 'd'), formatValue(kdj, 'j')]
        labels = ['K', 'D', 'J']
        name = 'KDJ(9,3,3)'
        break
      }

      case IndicatorType.RSI: {
        const rsi = formatValue(kLineData, 'rsi')
        values = [formatValue(rsi, 'rsi1'), formatValue(rsi, 'rsi2'), formatValue(rsi, 'rsi3')]
        labels = ['RSI6', 'RSI12', 'RSI24']
        name = 'RSI(6,12,24)'
        break
      }
      case IndicatorType.PSY: {
        const psy = formatValue(kLineData, 'psy')
        values = [formatValue(psy, 'psy')]
        labels = ['PSY']
        name = 'PSY(12)'
        break
      }
      case IndicatorType.TRIX: {
        const trix = formatValue(kLineData, 'trix')
        values = [formatValue(trix, 'trix'), formatValue(trix, 'maTrix')]
        labels = ['TRIX', 'MATRIX']
        name = 'TRIX(12,20)'
        break
      }
      case IndicatorType.OBV: {
        const obv = formatValue(kLineData, 'obv')
        values = [formatValue(obv, 'obv'), formatValue(obv, 'maObv')]
        labels = ['OBV', 'MAOBV']
        name = 'OBV(30)'
        break
      }
      case IndicatorType.VR: {
        const vr = formatValue(kLineData, 'vr')
        values = [formatValue(vr, 'vr'), formatValue(vr, 'maVr')]
        labels = ['VR', 'MAVR']
        name = 'VR(24,30)'
        break
      }
      case IndicatorType.WR: {
        const wr = formatValue(kLineData, 'wr')
        values = [formatValue(wr, 'wr1'), formatValue(wr, 'wr2'), formatValue(wr, 'wr3')]
        labels = ['WR1', 'WR2', 'WR3']
        name = 'WR(13,34,89)'
        break
      }
      case IndicatorType.MTM: {
        const mtm = formatValue(kLineData, 'mtm')
        values = [formatValue(mtm, 'mtm'), formatValue(mtm, 'mtmMa')]
        labels = ['MTM', 'MTMMA']
        name = 'MTM(6,10)'
        break
      }

      case IndicatorType.EMV: {
        const emv = formatValue(kLineData, 'emv')
        values = [formatValue(emv, 'emv'), formatValue(emv, 'maEmv')]
        labels = ['EMV', 'MAEMV']
        name = 'EMV(14,9)'
        break
      }

      case IndicatorType.SAR: {
        const sar = formatValue(kLineData, 'sar')
        values = [formatValue(sar, 'sar')]
        labels = ['SAR']
        name = 'SAR'
        break
      }
    }
    const valueFormatter = indicatorDataConfig.text.valueFormatter
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
    return { labels, values, name }
  }
}

export default TooltipRender

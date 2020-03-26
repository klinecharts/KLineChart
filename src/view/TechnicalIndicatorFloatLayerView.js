import View from './View'
import { FloatLayerPromptDisplayRule, LineStyle } from '../data/options/styleOptions'
import { TechnicalIndicatorType } from '../data/options/technicalIndicatorParamOptions'
import { isArray } from '../utils/typeChecks'
import { formatPrecision, formatValue } from '../utils/format'
import { calcTextWidth, drawHorizontalLine, drawVerticalLine, getFont } from '../utils/canvas'

export default class TechnicalIndicatorFloatLayerView extends View {
  constructor (container, chartData, xAxis, yAxis, additionalDataProvider) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._additionalDataProvider = additionalDataProvider
  }

  _draw () {
    const crossHairPoint = this._chartData.crossHairPoint()
    let dataPos
    if (crossHairPoint) {
      dataPos = this._xAxis.convertFromPixel(crossHairPoint.x)
    } else {
      dataPos = this._chartData.dataList().length - 1
    }
    const kLineData = this._chartData.dataList()[dataPos]
    const x = this._xAxis.convertToPixel(dataPos)
    this._drawCrossHairHorizontalLine()
    this._drawCrossHairVerticalLine(kLineData, x)
    const displayRule = this._chartData.styleOptions().floatLayer.prompt.displayRule
    if (displayRule === FloatLayerPromptDisplayRule.ALWAYS ||
      (displayRule === FloatLayerPromptDisplayRule.FOLLOW_CROSS && this._chartData.crossHairSeriesTag())) {
      this._drawPrompt(kLineData, x)
    }
  }

  /**
   * 绘制提示
   * @param kLineData
   * @param x
   * @private
   */
  _drawPrompt (kLineData, x) {
    this._drawTechnicalIndicatorPrompt(kLineData, x)
  }

  /**
   * 绘制十字光标水平线
   * @private
   */
  _drawCrossHairHorizontalLine () {
    if (this._chartData.crossHairSeriesTag() !== this._additionalDataProvider.tag()) {
      return
    }
    const crossHair = this._chartData.styleOptions().floatLayer.crossHair
    const crossHairHorizontal = crossHair.horizontal
    const crossHairHorizontalLine = crossHairHorizontal.line
    if (!crossHair.display || !crossHairHorizontal.display || !crossHairHorizontalLine.display) {
      return
    }
    const crossHairPoint = this._chartData.crossHairPoint()
    if (!crossHairPoint) {
      return
    }
    // 绘制十字光标水平线
    this._ctx.lineWidth = crossHairHorizontalLine.size
    this._ctx.strokeStyle = crossHairHorizontalLine.color
    if (crossHairHorizontalLine.style === LineStyle.DASH) {
      this._ctx.setLineDash(crossHairHorizontalLine.dashValue)
    }
    drawHorizontalLine(this._ctx, crossHairPoint.y, 0, this._width)
    this._ctx.setLineDash([])
  }

  /**
   * 绘制十字光标垂直线
   * @param kLineData
   * @param x
   * @private
   */
  _drawCrossHairVerticalLine (kLineData, x) {
    if (!this._chartData.crossHairSeriesTag()) {
      return
    }
    const crossHair = this._chartData.styleOptions().floatLayer.crossHair
    const crossHairVertical = crossHair.vertical
    const crossHairVerticalLine = crossHairVertical.line
    if (!crossHair.display || !crossHairVertical.display || !crossHairVerticalLine.display) {
      return
    }
    if (!kLineData) {
      return
    }
    this._ctx.lineWidth = crossHairVerticalLine.size
    this._ctx.strokeStyle = crossHairVerticalLine.color

    if (crossHairVerticalLine.style === LineStyle.DASH) {
      this._ctx.setLineDash(crossHairVerticalLine.dashValue)
    }
    drawVerticalLine(this._ctx, x, 0, this._height)
    this._ctx.setLineDash([])
  }

  /**
   * 绘制指标提示
   * @param kLineData
   * @param x
   * @param offsetTop
   * @private
   */
  _drawTechnicalIndicatorPrompt (kLineData, x, offsetTop = 0) {
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    const data = this._getTechnicalIndicatorPromptData(kLineData)
    const colors = technicalIndicatorOptions.line.colors
    this._drawTechnicalIndicatorPromptText(
      data, colors, offsetTop
    )
    this._drawTechnicalIndicatorPromptPoint(
      data.values, colors, x
    )
  }

  /**
   * 绘制指标提示文字
   * @param data
   * @param colors
   * @param offsetTop
   * @private
   */
  _drawTechnicalIndicatorPromptText (data, colors, offsetTop) {
    const floatLayerPromptTechnicalIndicatorText = this._chartData.styleOptions().floatLayer.prompt.technicalIndicator.text
    const nameText = data.name
    const labels = data.labels
    const values = data.values
    const textMarginLeft = floatLayerPromptTechnicalIndicatorText.marginLeft
    const textMarginRight = floatLayerPromptTechnicalIndicatorText.marginRight
    let labelX = textMarginLeft
    const labelY = floatLayerPromptTechnicalIndicatorText.marginTop + offsetTop
    const textSize = floatLayerPromptTechnicalIndicatorText.size
    const textColor = floatLayerPromptTechnicalIndicatorText.color
    const colorSize = colors.length
    this._ctx.textBaseline = 'top'
    this._ctx.font = getFont(textSize)
    const nameTextWidth = calcTextWidth(this._ctx, nameText)
    this._ctx.fillStyle = textColor
    this._ctx.fillText(nameText, labelX, labelY)
    labelX += (textMarginLeft + nameTextWidth)
    for (let i = 0; i < labels.length; i++) {
      const text = `${labels[i].toUpperCase()}: ${values[i] || '--'}`
      const textWidth = calcTextWidth(this._ctx, text)
      this._ctx.fillStyle = colors[i % colorSize] || textColor
      this._ctx.fillText(text, labelX, labelY)
      labelX += (textMarginLeft + textMarginRight + textWidth)
    }
  }

  /**
   * 绘制指标提示点
   * @param values
   * @param colors
   * @param x
   * @private
   */
  _drawTechnicalIndicatorPromptPoint (values, colors, x) {
    const floatLayerPromptTechnicalIndicatorPoint = this._chartData.styleOptions().floatLayer.prompt.technicalIndicator.point
    if (!floatLayerPromptTechnicalIndicatorPoint.display) {
      return
    }
    const technicalIndicatorType = this._additionalDataProvider.technicalIndicatorType()
    if (!this._chartData.crossHairSeriesTag() ||
      technicalIndicatorType === TechnicalIndicatorType.SAR) {
      return
    }
    const colorSize = colors.length
    const valueSize = technicalIndicatorType === TechnicalIndicatorType.MACD || technicalIndicatorType === TechnicalIndicatorType.VOL ? values.length - 1 : values.length
    const radius = floatLayerPromptTechnicalIndicatorPoint.radius
    for (let i = 0; i < valueSize; i++) {
      const value = values[i]
      if (value || value === 0) {
        const y = this._yAxis.convertToPixel(value)
        this._ctx.fillStyle = colors[i % colorSize]
        this._ctx.beginPath()
        this._ctx.arc(x, y, radius, 0, Math.PI * 2)
        this._ctx.closePath()
        this._ctx.fill()
      }
    }
  }

  /**
   * 获取需要绘制的指标提示数据
   * @param kLineData
   * @returns {{values: Array, labels: Array}}
   */
  _getTechnicalIndicatorPromptData (kLineData) {
    const technicalIndicatorType = this._additionalDataProvider.technicalIndicatorType()
    const params = this._chartData.technicalIndicatorParamOptions()[technicalIndicatorType] || []
    const values = []
    let labels = []
    switch (technicalIndicatorType) {
      case TechnicalIndicatorType.MA: {
        params.forEach(p => {
          labels.push(`ma${p}`)
        })
        break
      }
      case TechnicalIndicatorType.VOL: {
        params.forEach(p => {
          labels.push(`ma${p}`)
        })
        labels.push('num')
        break
      }
      case TechnicalIndicatorType.MACD: {
        labels = ['diff', 'dea', 'macd']
        break
      }
      case TechnicalIndicatorType.BOLL: {
        labels = ['up', 'mid', 'dn']
        break
      }
      case TechnicalIndicatorType.BIAS: {
        params.forEach(p => {
          labels.push(`bias${p}`)
        })
        break
      }
      case TechnicalIndicatorType.BRAR: {
        labels = ['br', 'ar']
        break
      }
      case TechnicalIndicatorType.CCI: {
        labels = ['cci']
        break
      }
      case TechnicalIndicatorType.CR: {
        labels = ['cr', 'ma1', 'ma2', 'ma3', 'ma4']
        break
      }
      case TechnicalIndicatorType.DMA: {
        labels = ['dif', 'difMa']
        break
      }
      case TechnicalIndicatorType.DMI: {
        labels = ['mdi', 'pdi', 'adx', 'adxr']
        break
      }
      case TechnicalIndicatorType.KDJ: {
        labels = ['k', 'd', 'j']
        break
      }

      case TechnicalIndicatorType.RSI: {
        params.forEach(p => {
          labels.push(`rsi${p}`)
        })
        break
      }
      case TechnicalIndicatorType.PSY: {
        labels = ['psy']
        break
      }
      case TechnicalIndicatorType.TRIX: {
        labels = ['trix', 'maTrix']
        break
      }
      case TechnicalIndicatorType.OBV: {
        labels = ['obv', 'maObv']
        break
      }
      case TechnicalIndicatorType.VR: {
        labels = ['vr', 'maVr']
        break
      }
      case TechnicalIndicatorType.WR: {
        labels = ['wr1', 'wr2', 'wr3']
        break
      }
      case TechnicalIndicatorType.MTM: {
        labels = ['mtm', 'mtmMa']
        break
      }

      case TechnicalIndicatorType.EMV: {
        labels = ['emv', 'maEmv']
        break
      }

      case TechnicalIndicatorType.SAR: {
        labels = ['sar']
        break
      }
    }
    let name = ''
    if (labels.length > 0) {
      name = `${technicalIndicatorType}`
      if (params && isArray(params) && params.length > 0) {
        name = `${name}(${params.join(',')})`
      }
      const indicatorData = formatValue(kLineData, technicalIndicatorType.toLowerCase())
      labels.forEach(label => {
        values.push(formatValue(indicatorData, label))
      })
      const decimal = this._chartData.precisionOptions()[technicalIndicatorType]
      values.forEach((value, index) => {
        values[index] = formatPrecision(value, decimal)
      })
    }
    return { labels, values, name }
  }
}

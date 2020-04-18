import View from './View'
import { calcTextWidth, getFont } from '../utils/canvas'
import { formatPrecision } from '../utils/format'
import { YAxisPosition, YAxisTextPosition } from '../data/options/styleOptions'

export default class YAxisFloatLayerView extends View {
  constructor (container, chartData, yAxis, additionalDataProvider) {
    super(container, chartData)
    this._yAxis = yAxis
    this._additionalDataProvider = additionalDataProvider
  }

  _draw () {
    this._drawCrossHairLabel()
  }

  _drawCrossHairLabel () {
    if (
      this._chartData.crossHairSeriesTag() !== this._additionalDataProvider.tag() ||
      this._chartData.dataList().length === 0
    ) {
      return
    }
    const crossHair = this._chartData.styleOptions().floatLayer.crossHair
    const crossHairHorizontal = crossHair.horizontal
    const crossHairHorizontalText = crossHairHorizontal.text
    if (!crossHair.display || !crossHairHorizontal.display || !crossHairHorizontalText.display) {
      return
    }
    const crossHairPoint = this._chartData.crossHairPoint()
    if (!crossHairPoint) {
      return
    }
    const value = this._yAxis.convertFromPixel(crossHairPoint.y)
    let yAxisDataLabel
    if (this._yAxis.isPercentageYAxis()) {
      const fromClose = this._chartData.dataList()[this._chartData.from()].close
      yAxisDataLabel = `${((value - fromClose) / fromClose * 100).toFixed(2)}%`
    } else {
      const precision = this._chartData.precisionOptions()[this._yAxis.isCandleStickYAxis() ? 'price' : this._additionalDataProvider.technicalIndicatorType()]
      yAxisDataLabel = formatPrecision(value, precision)
    }
    const textSize = crossHairHorizontalText.size
    this._ctx.font = getFont(textSize, crossHairHorizontalText.family)
    const yAxisDataLabelWidth = calcTextWidth(this._ctx, yAxisDataLabel)
    let rectStartX

    const paddingLeft = crossHairHorizontalText.paddingLeft
    const paddingRight = crossHairHorizontalText.paddingRight
    const paddingTop = crossHairHorizontalText.paddingTop
    const paddingBottom = crossHairHorizontalText.paddingBottom
    const borderSize = crossHairHorizontalText.borderSize

    const rectWidth = yAxisDataLabelWidth + borderSize * 2 + paddingLeft + paddingRight
    const rectHeight = textSize + borderSize * 2 + paddingTop + paddingBottom
    const yAxis = this._chartData.styleOptions().yAxis
    if (
      (yAxis.position === YAxisPosition.LEFT && yAxis.tickText.position === YAxisTextPosition.INSIDE) ||
      (yAxis.position === YAxisPosition.RIGHT && yAxis.tickText.position === YAxisTextPosition.OUTSIDE)
    ) {
      rectStartX = 0
    } else {
      rectStartX = this._width - rectWidth
    }

    const rectY = crossHairPoint.y - borderSize - paddingTop - textSize / 2
    // 绘制y轴文字外的边框
    this._ctx.fillStyle = crossHairHorizontalText.backgroundColor
    this._ctx.fillRect(rectStartX, rectY, rectWidth, rectHeight)

    this._ctx.lineWidth = borderSize
    this._ctx.strokeStyle = crossHairHorizontalText.borderColor
    this._ctx.strokeRect(rectStartX, rectY, rectWidth, rectHeight)

    this._ctx.textBaseline = 'middle'
    this._ctx.fillStyle = crossHairHorizontalText.color
    this._ctx.fillText(yAxisDataLabel, rectStartX + borderSize + paddingLeft, crossHairPoint.y)
  }
}

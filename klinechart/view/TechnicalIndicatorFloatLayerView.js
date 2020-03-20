import View from './View'
import { CrossHairEvent } from '../e/CrossHairEvent'
import { LineStyle } from '../data/options/styleOptions'

export default class TechnicalIndicatorFloatLayerView extends View {
  constructor (container, chartData, xAxis, yAxis, additionalDataProvider) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._additionalDataProvider = additionalDataProvider
    this._crossHairEvent = new CrossHairEvent(this._canvas, chartData, additionalDataProvider.tag())
  }

  _draw () {
    this._drawTechnicalIndicatorTooltipLabels()
    this._drawHorizontalLine()
    this._drawVerticalLine()
  }

  _drawHorizontalLine () {
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
    this._ctx.beginPath()
    this._ctx.moveTo(0, crossHairPoint.y)
    this._ctx.lineTo(this._width, crossHairPoint.y)
    this._ctx.stroke()
    this._ctx.closePath()
    this._ctx.setLineDash([])
  }

  _drawVerticalLine () {
    if (!this._chartData.crossHairSeriesTag()) {
      return
    }
    const crossHair = this._chartData.styleOptions().floatLayer.crossHair
    const crossHairVertical = crossHair.vertical
    const crossHairVerticalLine = crossHairVertical.line
    if (!crossHair.display || !crossHairVertical.display || !crossHairVerticalLine.display) {
      return
    }
    const dataPos = this._chartData.getCrossHairDataPos()
    const kLineData = this._chartData.dataList()[dataPos]
    if (!kLineData) {
      return
    }
    const x = this._xAxis.convertToPixel(dataPos)
    this._ctx.lineWidth = crossHairVerticalLine.size
    this._ctx.strokeStyle = crossHairVerticalLine.color

    if (crossHairVerticalLine.style === LineStyle.DASH) {
      this._ctx.setLineDash(crossHairVerticalLine.dashValue)
    }
    this._ctx.beginPath()
    this._ctx.moveTo(x, 0)
    this._ctx.lineTo(x, this._height)
    this._ctx.stroke()
    this._ctx.closePath()
    this._ctx.setLineDash([])
  }

  _drawTechnicalIndicatorTooltipLabels () {}
}

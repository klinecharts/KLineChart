import View from './View'

export default class TechnicalIndicatorCrossHairView extends View {
  constructor (container, chartData, xAxis, yAxis) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
  }

  _draw () {
    this._drawTechnicalIndicatorTooltipLabels()
    this._drawHorizontalLine()
    this._drawVerticalLine()
  }

  _drawHorizontalLine () {}

  _drawVerticalLine () {}

  _drawTechnicalIndicatorTooltipLabels () {}
}

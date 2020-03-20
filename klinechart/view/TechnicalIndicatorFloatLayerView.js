import View from './View'

export default class TechnicalIndicatorFloatLayerView extends View {
  constructor (container, chartData, xAxis, yAxis, additionalDataProvider) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._additionalDataProvider = additionalDataProvider
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

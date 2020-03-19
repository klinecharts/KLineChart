import View from './View'

export default class TechnicalIndicatorCrossHairView extends View {
  _draw () {
    this._drawTechnicalIndicatorTooltipLabels()
    this._drawHorizontalLine()
    this._drawVerticalLine()
  }

  _drawHorizontalLine () {}

  _drawVerticalLine () {}

  _drawTechnicalIndicatorTooltipLabels () {}
}

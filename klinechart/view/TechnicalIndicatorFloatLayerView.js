import View from './View'
import { CrossHairEvent } from '../e/CrossHairEvent'

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

  _drawHorizontalLine () {}

  _drawVerticalLine () {}

  _drawTechnicalIndicatorTooltipLabels () {}
}

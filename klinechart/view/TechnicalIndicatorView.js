import View from './View'

export default class TechnicalIndicatorView extends View {
  constructor (container, chartData, xAxis, yAxis) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
  }

  _draw () {
    this._drawGrid()
    this._drawTechnicalIndicator()
  }

  /**
   * 绘制网格
   * @private
   */
  _drawGrid () {}

  /**
   * 绘制指标
   * @private
   */
  _drawTechnicalIndicator () {}
}

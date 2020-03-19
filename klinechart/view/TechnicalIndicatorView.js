import View from './View'

export default class TechnicalIndicatorView extends View {
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

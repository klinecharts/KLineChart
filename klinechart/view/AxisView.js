import View from './View'

export default class AxisView extends View {
  constructor (container, chartData, axis) {
    super(container, chartData)
    this._axis = axis
  }

  _draw () {
    this._drawAxisLine()
    this._drawTickLines()
    this._drawTickLabels()
  }

  /**
   * 绘制轴线
   * @private
   */
  _drawAxisLine () {}

  /**
   * 绘制tick线
   * @private
   */
  _drawTickLines () {}

  /**
   * 绘制tick文字
   * @private
   */
  _drawTickLabels () {}
}

import View from './View'

export default class AxisFloatLayerView extends View {
  constructor (container, chartData, axis) {
    super(container, chartData)
    this._axis = axis
  }

  _draw () {
    this._drawCrossHairLabel()
  }

  /**
   * 绘制十字光标文字
   * @private
   */
  _drawCrossHairLabel () {
  }
}

import View from './View'

export default class AxisFloatLayerView extends View {
  constructor (container, chartData, axis, additionalDataProvider) {
    super(container, chartData)
    this._axis = axis
    this._additionalDataProvider = additionalDataProvider
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

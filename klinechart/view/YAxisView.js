import AxisView from './AxisView'

export default class YAxisView extends AxisView {
  _draw () {
    super._draw()
    this._drawLastPriceLabel()
  }

  _drawAxisLine () {}

  _drawTickLines () {}

  _drawTickLabels () {}

  /**
   * 绘制最新价文字
   * @private
   */
  _drawLastPriceLabel () {
  }
}

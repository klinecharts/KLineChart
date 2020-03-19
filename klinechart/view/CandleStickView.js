import TechnicalIndicatorView from './TechnicalIndicatorView'

export default class CandleStickView extends TechnicalIndicatorView {
  _draw () {
    this._drawGrid()
    this._drawCandleStick()
    this._drawTechnicalIndicator()
    this._drawHighestPrice()
    this._drawLowestPrice()
    this._drawLastPriceLine()
  }

  /**
   * 绘制分时图
   * @private
   */
  _drawRealTime () {}

  /**
   * 绘制蜡烛
   * @private
   */
  _drawCandleStick () {}

  /**
   * 绘制最高价
   * @private
   */
  _drawHighestPrice () {}

  /**
   * 绘制最低价
   * @private
   */
  _drawLowestPrice () {}

  /**
   * 绘制最新价线
   * @private
   */
  _drawLastPriceLine () {}
}

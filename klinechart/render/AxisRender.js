import Render from './Render'
import { nice, getIntervalPrecision, round } from '../internal/utils/numberUtils'

class AxisRender extends Render {
  constructor (viewPortHandler, dataProvider) {
    super(viewPortHandler, dataProvider)
    this.axisMaximum = 0
    this.axisMinimum = 0
    this.axisRange = 0
  }

  /**
   * 计算轴上的值
   * @param min
   * @param max
   * @param axis
   */
  computeAxisValues (min, max, axis = null) {
    const span = this.calcRange(max, min)
    if (span < 0) {
      this.values = []
      return
    }
    if (this.isFillChart()) {
      const interval = +nice(span / 5.0)
      const precision = getIntervalPrecision(interval)
      const first = +round(Math.ceil(min / interval) * interval, precision)
      const last = +round(Math.floor(max / interval) * interval, precision)
      let n = 0
      let f = first

      if (interval !== 0) {
        while (f <= (+last)) {
          ++n
          f += interval
        }
      }
      this.values = []
      f = first
      for (let i = 0; i < n; i++) {
        this.values[i] = f
        f += interval
      }
    } else {
      this.fixComputeAxisValues(axis)
    }
  }

  /**
   * 计算range
   * @param max
   * @param min
   * @returns {number}
   */
  calcRange (max, min) {
    return Math.abs(max - min)
  }

  /**
   * 是否数据会超过整个绘制区域
   * @return Boolean
   */
  isFillChart () {
    return true
  }

  fixComputeAxisValues () {}
}

export default AxisRender

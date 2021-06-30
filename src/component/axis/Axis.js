/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getPixelRatio } from '../../utils/canvas'
import { getPrecision, nice, round } from '../../utils/number'
import { createElement } from '../../utils/element'

export default class Axis {
  constructor (chartData) {
    this._chartData = chartData
    this._width = 0
    this._height = 0
    this._cacheMinValue = 0
    this._cacheMaxValue = 0
    this._minValue = 0
    this._maxValue = 0
    this._range = 0
    this._ticks = []
    this._initMeasureCanvas()
  }

  _initMeasureCanvas () {
    const measureCanvas = createElement('canvas')
    const pixelRatio = getPixelRatio(measureCanvas)
    this._measureCtx = measureCanvas.getContext('2d')
    this._measureCtx.scale(pixelRatio, pixelRatio)
  }

  min () {
    return this._minValue
  }

  max () {
    return this._maxValue
  }

  width () {
    return this._width
  }

  height () {
    return this._height
  }

  setWidth (width) {
    this._width = width
  }

  setHeight (height) {
    this._height = height
  }

  /**
   * 获取ticks
   * @returns {[]|*[]}
   */
  ticks () {
    return this._ticks
  }

  /**
   * 计算轴
   * @param forceCompute
   */
  computeAxis (forceCompute) {
    const minMax = this._optimalMinMax(this._computeMinMax())
    this._minValue = minMax.min
    this._maxValue = minMax.max
    this._range = minMax.range
    if (this._cacheMinValue !== minMax.min || this._cacheMaxValue !== minMax.max || forceCompute) {
      this._cacheMinValue = minMax.min
      this._cacheMaxValue = minMax.max
      this._ticks = this._optimalTicks(this._computeTicks())
      return true
    }
    return false
  }

  /**
   * 计算最大最小值
   * @private
   */
  _computeMinMax () {}

  /**
   * 优化最大最小值
   * @param min
   * @param max
   * @param precision
   * @private
   */
  _optimalMinMax ({ min, max, precision }) {}

  /**
   * 计算轴上的tick值
   */
  _computeTicks () {
    const ticks = []
    if (this._range >= 0) {
      const intervalPrecision = this._computeInterval(this._range)
      const interval = intervalPrecision.interval
      const precision = intervalPrecision.precision
      const first = round(Math.ceil(this._minValue / interval) * interval, precision)
      const last = round(Math.floor(this._maxValue / interval) * interval, precision)
      let n = 0
      let f = first

      if (interval !== 0) {
        while (f <= last) {
          ticks[n] = { v: f.toFixed(precision) }
          ++n
          f += interval
        }
      }
    }
    return ticks
  }

  /**
   * 计算最佳的tick
   * @param ticks
   */
  _optimalTicks (ticks) {}

  /**
   * 计算间隔
   * @private
   */
  _computeInterval (range) {
    const interval = nice(range / 8.0)
    const precision = getPrecision(interval)
    return {
      interval, precision
    }
  }
}

/**
 * Copyright (c) 2019 lihu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Series from './Series'
import TechnicalIndicatorWidget from '../widget/TechnicalIndicatorWidget'
import YAxisWidget from '../widget/YAxisWidget'
import { TechnicalIndicatorType } from '../data/options/technicalIndicatorParamOptions'
import YAxis from '../component/YAxis'
import { InvalidateLevel } from '../data/ChartData'

export default class TechnicalIndicatorSeries extends Series {
  constructor (props) {
    super(props)
    this._technicalIndicatorType = props.technicalIndicatorType || TechnicalIndicatorType.MACD
    this._calcTechnicalIndicator()
  }

  _initBefore (props) {
    this._tag = props.tag
    this._yAxis = this._createYAxis(props)
  }

  _createYAxis (props) {
    return new YAxis(props.chartData, false)
  }

  _createMainWidget (container, props) {
    return new TechnicalIndicatorWidget({
      container,
      chartData: props.chartData,
      xAxis: props.xAxis,
      yAxis: this._yAxis,
      additionalDataProvider: {
        technicalIndicatorType: this.technicalIndicatorType.bind(this),
        tag: this.tag.bind(this)
      }
    })
  }

  _createYAxisWidget (container, props) {
    return new YAxisWidget({
      container,
      chartData: props.chartData,
      yAxis: this._yAxis,
      additionalDataProvider: {
        technicalIndicatorType: this.technicalIndicatorType.bind(this),
        tag: this.tag.bind(this)
      }
    })
  }

  _computeAxis () {
    this._yAxis.calcMinMaxValue(this._technicalIndicatorType, this._isRealTime())
    this._yAxis.computeAxis()
  }

  _isRealTime () {
    return false
  }

  /**
   * 计算指标
   * @private
   */
  _calcTechnicalIndicator () {
    if (this._chartData.calcTechnicalIndicator(this._technicalIndicatorType)) {
      this.invalidate(InvalidateLevel.FULL)
    }
  }

  /**
   * 获取标识
   * @returns {string}
   */
  tag () {
    return this._tag
  }

  /**
   * 设置尺寸
   * @param mainWidgetSize
   * @param yAxisWidgetSize
   */
  setSize (mainWidgetSize, yAxisWidgetSize) {
    this._yAxis.setSize(yAxisWidgetSize.width, yAxisWidgetSize.height)
    this._computeAxis()
    super.setSize(mainWidgetSize, yAxisWidgetSize)
  }

  yAxis () {
    return this._yAxis
  }

  /**
   * 获取技术指标类型
   * @returns {string}
   */
  technicalIndicatorType () {
    return this._technicalIndicatorType
  }

  setTechnicalIndicatorType (technicalIndicatorType) {
    if (this._technicalIndicatorType !== technicalIndicatorType) {
      this._technicalIndicatorType = technicalIndicatorType
      this._calcTechnicalIndicator()
    }
  }
}

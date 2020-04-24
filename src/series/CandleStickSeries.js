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

import TechnicalIndicatorSeries from './TechnicalIndicatorSeries'
import CandleStickWidget from '../widget/CandleStickWidget'
import { ChartType } from '../data/options/styleOptions'
import YAxis from '../component/YAxis'
import { InvalidateLevel } from '../data/ChartData'
import { TechnicalIndicatorType } from '../data/options/technicalIndicatorParamOptions'

export default class CandleStickSeries extends TechnicalIndicatorSeries {
  constructor (props) {
    super(props)
    this._chartType = ChartType.CANDLE_STICK
  }

  _createYAxis (props) {
    return new YAxis(props.chartData, true)
  }

  _createMainWidget (container, props) {
    return new CandleStickWidget({
      container,
      chartData: props.chartData,
      xAxis: props.xAxis,
      yAxis: this._yAxis,
      additionalDataProvider: {
        technicalIndicatorType: this.technicalIndicatorType.bind(this),
        chartType: this.chartType.bind(this),
        tag: this.tag.bind(this)
      }
    })
  }

  _isRealTime () {
    return this._chartType === ChartType.REAL_TIME
  }

  chartType () {
    return this._chartType
  }

  setChartType (chartType) {
    if (this._chartType !== chartType) {
      this._chartType = chartType
      if (this._chartData.styleOptions().realTime.averageLine.display && this._isRealTime()) {
        this._chartData.calcTechnicalIndicator(TechnicalIndicatorType.AVERAGE)
      }
      this.invalidate(InvalidateLevel.FULL)
    }
  }
}

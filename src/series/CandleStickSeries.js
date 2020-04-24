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

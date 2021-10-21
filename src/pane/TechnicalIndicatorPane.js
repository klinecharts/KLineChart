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

import Pane from './Pane'
import TechnicalIndicatorWidget from '../widget/TechnicalIndicatorWidget'
import YAxisWidget from '../widget/YAxisWidget'
import YAxis from '../component/axis/YAxis'

export default class TechnicalIndicatorPane extends Pane {
  constructor (props) {
    super(props)
    if ('height' in props) {
      this.setHeight(props.height)
    }
  }

  _initBefore (props) {
    this._id = props.id
    this._yAxis = this._createYAxis(props)
  }

  _createYAxis (props) {
    return new YAxis(
      props.chartData,
      false,
      props.id
    )
  }

  _createMainWidget (container, props) {
    return new TechnicalIndicatorWidget({
      container,
      chartData: props.chartData,
      xAxis: props.xAxis,
      yAxis: this._yAxis,
      paneId: props.id
    })
  }

  _createYAxisWidget (container, props) {
    return new YAxisWidget({
      container,
      chartData: props.chartData,
      yAxis: this._yAxis,
      paneId: props.id
    })
  }

  setHeight (height) {
    super.setHeight(height)
    this._yAxis.setHeight(height)
  }

  setWidth (mainWidgetWidth, yAxisWidgetWidth) {
    super.setWidth(mainWidgetWidth, yAxisWidgetWidth)
    this._yAxis.setWidth(yAxisWidgetWidth)
  }

  /**
   * 获取id
   * @returns {string}
   */
  id () {
    return this._id
  }

  yAxis () {
    return this._yAxis
  }
}

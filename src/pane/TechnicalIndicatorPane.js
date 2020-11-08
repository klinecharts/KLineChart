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
import EmptyTechnicalIndicator from '../data/technicalindicator/TechnicalIndicator'
import YAxis from '../component/YAxis'

export default class TechnicalIndicatorPane extends Pane {
  constructor (props) {
    super(props)
    this._technicalIndicator = new EmptyTechnicalIndicator({})
    if ('height' in props) {
      this.setHeight(props.height)
    }
    this.setTechnicalIndicatorType(props.technicalIndicatorType)
  }

  _initBefore (props) {
    this._tag = props.tag
    this._yAxis = this._createYAxis(props)
  }

  _createYAxis (props) {
    return new YAxis(
      props.chartData,
      false,
      { technicalIndicator: this.technicalIndicator.bind(this), isTimeLine: this._isRealTime.bind(this) })
  }

  _createMainWidget (container, props) {
    return new TechnicalIndicatorWidget({
      container,
      chartData: props.chartData,
      xAxis: props.xAxis,
      yAxis: this._yAxis,
      additionalDataProvider: {
        technicalIndicator: this.technicalIndicator.bind(this),
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
        technicalIndicator: this.technicalIndicator.bind(this),
        tag: this.tag.bind(this)
      }
    })
  }

  _isRealTime () {
    return false
  }

  setHeight (height) {
    super.setHeight(height)
    this._yAxis.setHeight(height)
  }

  setWidth (mainWidgetWidth, yAxisWidgetWidth) {
    super.setWidth(mainWidgetWidth, yAxisWidgetWidth)
    this._yAxis.setWidth(yAxisWidgetWidth)
  }

  computeAxis (forceCompute) {
    this._yAxis.calcMinMaxValue()
    return this._yAxis.computeAxis(forceCompute)
  }

  getSelfAxisWidth () {
    return this._yAxis.getSelfWidth(this._technicalIndicator)
  }

  /**
   * 获取标识
   * @returns {string}
   */
  tag () {
    return this._tag
  }

  yAxis () {
    return this._yAxis
  }

  /**
   * 获取技术指标
   * @returns {TechnicalIndicator}
   */
  technicalIndicator () {
    return this._technicalIndicator
  }

  /**
   * 设置技术指标类型
   * @param technicalIndicatorType
   */
  setTechnicalIndicatorType (technicalIndicatorType) {
    const technicalIndicator = this._chartData.technicalIndicator(technicalIndicatorType)
    if (this._technicalIndicator && this._technicalIndicator.name === technicalIndicatorType) {
      return false
    }
    if (technicalIndicator) {
      this._technicalIndicator = Object.create(technicalIndicator)
    } else {
      this._technicalIndicator = new EmptyTechnicalIndicator({})
    }
    return this.calcTechnicalIndicator()
  }

  /**
   * 计算指标
   */
  calcTechnicalIndicator () {
    const currentTechnicalIndicator = this.technicalIndicator()
    const technicalIndicator = this._chartData.technicalIndicator[currentTechnicalIndicator.name]
    if (technicalIndicator) {
      currentTechnicalIndicator.setPrecision(technicalIndicator.precision)
      currentTechnicalIndicator.setCalcParams(technicalIndicator.calcParams)
    }
    currentTechnicalIndicator.result = currentTechnicalIndicator.calcTechnicalIndicator(this._chartData.dataList(), currentTechnicalIndicator.calcParams, currentTechnicalIndicator.plots) || []
    return this.computeAxis()
  }
}
